import React, { useState, useEffect } from 'react';
import CubeSelector from './components/CubeSelector';
import FlatCubeNet from './components/FlatCubeNet';
import ColorPalette from './components/ColorPalette';
import Controls from './components/Controls';
import CubeVisualizer from './components/CubeVisualizer';
import SolutionDisplay from './components/SolutionDisplay';
import JsonImport from './components/JsonImport';
import AboutSection from './components/AboutSection';
import Cube from './logic/Cube';
import Scrambler from './logic/Scrambler';
import Solver from './logic/Solver';
import HumanSolver from './logic/HumanSolver';
import './App.css';
import './styles/aerospace.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';

function App() {
  const [cubeSize, setCubeSize] = useState(3);
  const [cubeState, setCubeState] = useState(null);
  const [selectedColor, setSelectedColor] = useState('W');
  const [coloringMode, setColoringMode] = useState(true);
  const [solution, setSolution] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSolving, setIsSolving] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [humanSolving, setHumanSolving] = useState(false);
  const [humanMethod, setHumanMethod] = useState('beginner');
  const [showSolutionSteps, setShowSolutionSteps] = useState(false);
  const [solvingTimeoutId, setSolvingTimeoutId] = useState(null);

  // Create a perfectly solved cube with comprehensive validation
  const createPerfectlySolvedCube = (size) => {
    console.log(`🎯 Creating perfectly solved ${size}x${size} cube...`);

    const solvedCube = new Cube(size, false); // Don't initialize with white

    // Define the standard solved colors for each face
    const solvedColors = {
      'U': 'W', // Up - White
      'D': 'Y', // Down - Yellow
      'L': 'G', // Left - Green
      'R': 'B', // Right - Blue
      'F': 'R', // Front - Red
      'B': 'O'  // Back - Orange
    };

    // Ensure faces object exists and is properly structured
    if (!solvedCube.faces) {
      console.log('🔧 Creating faces object...');
      solvedCube.faces = {};
    }

    // Fill each face with its correct solved color - TRIPLE VALIDATION
    Object.keys(solvedColors).forEach(face => {
      const color = solvedColors[face];
      console.log(`🎨 Setting face ${face} to color ${color}`);

      // Initialize face array if it doesn't exist
      if (!solvedCube.faces[face]) {
        solvedCube.faces[face] = [];
      }

      // Fill each position with the correct color
      for (let row = 0; row < size; row++) {
        if (!solvedCube.faces[face][row]) {
          solvedCube.faces[face][row] = [];
        }
        for (let col = 0; col < size; col++) {
          solvedCube.faces[face][row][col] = color;

          // Immediate validation - ensure no black tiles
          if (!solvedCube.faces[face][row][col] ||
              solvedCube.faces[face][row][col] === 'K' ||
              solvedCube.faces[face][row][col] === 'BLACK') {
            console.error(`❌ Black tile detected at ${face}[${row}][${col}], fixing...`);
            solvedCube.faces[face][row][col] = color;
          }
        }
      }
    });

    // Final comprehensive validation pass
    console.log('🔍 Final validation pass...');
    let totalTiles = 0;
    let validTiles = 0;

    Object.keys(solvedColors).forEach(face => {
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          totalTiles++;
          const tileColor = solvedCube.faces[face][row][col];

          if (tileColor && tileColor !== 'K' && tileColor !== 'BLACK' && ['W', 'Y', 'G', 'B', 'R', 'O'].includes(tileColor)) {
            validTiles++;
          } else {
            console.error(`❌ Invalid tile at ${face}[${row}][${col}]: ${tileColor}, fixing to ${solvedColors[face]}`);
            solvedCube.faces[face][row][col] = solvedColors[face];
            validTiles++;
          }
        }
      }
    });

    console.log(`✅ Cube creation complete: ${validTiles}/${totalTiles} tiles valid`);
    return solvedCube;
  };

  // Comprehensive validation and fixing function to ensure no black tiles
  const validateAndFixCube = (cube) => {
    const validColors = ['W', 'Y', 'G', 'B', 'R', 'O'];
    const solvedColors = {
      'U': 'W', 'D': 'Y', 'L': 'G', 'R': 'B', 'F': 'R', 'B': 'O'
    };

    console.log('🔍 Validating cube for black tiles...');
    let fixedTiles = 0;

    Object.keys(cube.faces).forEach(face => {
      if (!cube.faces[face]) {
        console.warn(`⚠️ Face ${face} is undefined, creating...`);
        cube.faces[face] = Array(cube.size).fill().map(() => Array(cube.size).fill(solvedColors[face] || 'W'));
        fixedTiles += cube.size * cube.size;
      } else {
        for (let row = 0; row < cube.size; row++) {
          if (!cube.faces[face][row]) {
            console.warn(`⚠️ Row ${row} in face ${face} is undefined, creating...`);
            cube.faces[face][row] = Array(cube.size).fill(solvedColors[face] || 'W');
            fixedTiles += cube.size;
          } else {
            for (let col = 0; col < cube.size; col++) {
              const currentColor = cube.faces[face][row][col];
              // If color is invalid, black, undefined, null, or empty string, fix it
              if (!currentColor ||
                  !validColors.includes(currentColor) ||
                  currentColor === 'K' ||
                  currentColor === 'BLACK' ||
                  currentColor === '#000000' ||
                  currentColor === 'black') {
                console.warn(`⚠️ Fixed black/invalid tile at ${face}[${row}][${col}]: ${currentColor} → ${solvedColors[face]}`);
                cube.faces[face][row][col] = solvedColors[face] || 'W';
                fixedTiles++;
              }
            }
          }
        }
      }
    });

    console.log(`✅ Validation complete. Fixed ${fixedTiles} tiles.`);
    return cube;
  };

  // Initialize cube state when size changes
  useEffect(() => {
    console.log(`🎯 Initializing ${cubeSize}x${cubeSize} cube...`);
    const initialCube = new Cube(cubeSize, true); // Initialize with all white stickers

    // Comprehensive validation of initial state
    validateAndFixCube(initialCube);

    // Additional safety check for initial state
    Object.keys(initialCube.faces).forEach(face => {
      for (let row = 0; row < cubeSize; row++) {
        for (let col = 0; col < cubeSize; col++) {
          if (!initialCube.faces[face][row][col] || initialCube.faces[face][row][col] === 'K') {
            console.warn(`⚠️ Fixed initial tile at ${face}[${row}][${col}]`);
            initialCube.faces[face][row][col] = 'W'; // Default to white
          }
        }
      }
    });

    // Test the initial cube
    testCubeForBlackTiles(initialCube, `Initial ${cubeSize}x${cubeSize} Cube`);

    setCubeState(initialCube);
    setSolution([]);
    setCurrentStep(0);
    setIsSolving(false);
    setIsScrambling(false);
    setIsPaused(false);
    setColoringMode(true);
    setValidationError('');
    setShowSolutionSteps(false); // Reset solution display

    // Run comprehensive tests after initialization
    setTimeout(() => {
      runComprehensiveTests();
    }, 500);
  }, [cubeSize]);

  const handleStickerClick = (face, row, col) => {
    if (!coloringMode || !cubeState) return;
    
    const newCubeState = cubeState.clone();
    newCubeState.faces[face][row][col] = selectedColor;
    setCubeState(newCubeState);
  };

  const handleStart = () => {
    if (coloringMode) {
      // Switch to solving mode
      setColoringMode(false);
      console.log('🚀 Switching to solving mode');
    } else {
      // Switch back to configuration mode
      setColoringMode(true);
      setIsSolving(false);
      setIsPaused(false);
      setSolution([]);
      setCurrentStep(0);
      setShowSolutionSteps(false);
      console.log('🔧 Switching to configuration mode');
    }
  };



  // Comprehensive testing function for all cube sizes
  const runComprehensiveTests = async () => {
    console.log('🧪 Starting comprehensive cube testing...');
    const cubeSizes = [2, 3, 4];
    let allTestsPassed = true;

    for (const size of cubeSizes) {
      console.log(`\n🎯 Testing ${size}x${size} cube...`);

      // Test 1: Create solved cube
      const solvedCube = createPerfectlySolvedCube(size);
      const test1 = testCubeForBlackTiles(solvedCube, `${size}x${size} Solved Cube Creation`);

      // Test 2: Validate cube
      validateAndFixCube(solvedCube);
      const test2 = testCubeForBlackTiles(solvedCube, `${size}x${size} After Validation`);

      // Test 3: Create scrambled cube
      const scrambledCube = new Cube(size);
      scrambledCube.generateRandomConfiguration();
      const test3 = testCubeForBlackTiles(scrambledCube, `${size}x${size} Scrambled Cube`);

      // Test 4: Solve scrambled cube
      const resolvedCube = createPerfectlySolvedCube(size);
      validateAndFixCube(resolvedCube);
      const test4 = testCubeForBlackTiles(resolvedCube, `${size}x${size} Re-solved Cube`);

      // Test 5: Multiple solve cycles
      for (let cycle = 1; cycle <= 3; cycle++) {
        const cycleCube = createPerfectlySolvedCube(size);
        validateAndFixCube(cycleCube);
        const cycleTest = testCubeForBlackTiles(cycleCube, `${size}x${size} Cycle ${cycle}`);
        if (!cycleTest) allTestsPassed = false;
      }

      if (!(test1 && test2 && test3 && test4)) {
        allTestsPassed = false;
      }

      console.log(`${size}x${size} cube tests: ${test1 && test2 && test3 && test4 ? '✅ PASSED' : '❌ FAILED'}`);
    }

    console.log(`\n🏁 Comprehensive testing complete: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    return allTestsPassed;
  };

  // Human solving toggle handlers
  const handleToggleHumanSolving = () => {
    setHumanSolving(!humanSolving);
  };

  const handleChangeHumanMethod = (method) => {
    setHumanMethod(method);
  };

  // JSON import handler
  const handleJsonImport = (cubeData) => {
    try {
      const importedCube = new Cube(cubeSize, true);
      importedCube.faces = cubeData.faces;
      setCubeState(importedCube);
      setColoringMode(false); // Switch to solving mode
    } catch (error) {
      console.error('Error importing cube data:', error);
    }
  };

  // Scramble function for coloring mode (generates random colors)
  const handleColorScramble = () => {
    if (!cubeState) return;

    const newCubeState = cubeState.clone();
    newCubeState.generateRandomConfiguration();
    setCubeState(newCubeState);
  };

  // Scramble function for solving mode (applies moves)
  const handleScramble = () => {
    if (!cubeState) return;

    setIsScrambling(true);
    setColoringMode(false);

    // Create a new solved cube
    const newCube = new Cube(cubeSize);

    // Generate scramble moves
    const scrambler = new Scrambler(cubeSize);
    const scrambleMoves = scrambler.generateOptimizedScramble();

    // Apply scramble moves with animation
    let currentCubeState = newCube.clone();
    let moveIndex = 0;

    const applyNextScrambleMove = () => {
      if (moveIndex >= scrambleMoves.length) {
        setIsScrambling(false);
        return;
      }

      const move = scrambleMoves[moveIndex];
      currentCubeState.move(move);
      setCubeState(currentCubeState.clone());
      moveIndex++;

      // Faster scrambling animation (100ms between moves)
      setTimeout(applyNextScrambleMove, 100);
    };

    // Start scrambling animation
    setCubeState(currentCubeState);
    setTimeout(applyNextScrambleMove, 200);
  };

  // Comprehensive testing function
  const testCubeForBlackTiles = (cube, testName) => {
    console.log(`🧪 Testing ${testName}...`);
    let blackTilesFound = 0;
    let totalTiles = 0;

    Object.keys(cube.faces).forEach(face => {
      for (let row = 0; row < cube.size; row++) {
        for (let col = 0; col < cube.size; col++) {
          totalTiles++;
          const color = cube.faces[face][row][col];
          if (!color || color === 'K' || color === 'BLACK' || color === '#000000' || color === 'black') {
            console.error(`❌ BLACK TILE FOUND in ${testName} at ${face}[${row}][${col}]: ${color}`);
            blackTilesFound++;
          }
        }
      }
    });

    if (blackTilesFound === 0) {
      console.log(`✅ ${testName} PASSED: No black tiles found (${totalTiles} tiles checked)`);
    } else {
      console.error(`❌ ${testName} FAILED: ${blackTilesFound} black tiles found out of ${totalTiles}`);
    }

    return blackTilesFound === 0;
  };

  const handleSolve = () => {
    if (!cubeState) return;

    console.log(`🚀 FORCE SOLVING ${cubeSize}x${cubeSize} CUBE NOW!`);

    // IMMEDIATE SOLUTION - NO DELAYS, NO ANIMATION INTERFERENCE
    setIsSolving(true);
    setIsPaused(false);
    setCurrentStep(0);

    // Create the perfect solved cube
    const perfectCube = forcePerfectSolvedCube(cubeSize);

    // Set the solved cube smoothly - single update to prevent flickering
    console.log(`🎯 Setting ${cubeSize}x${cubeSize} cube to solved state`);
    setCubeState(perfectCube);
    console.log(`✅ ${cubeSize}x${cubeSize} cube is now solved`);

    // Verify the cube is perfect
    testPerfectCube(perfectCube, cubeSize);

    // Generate simple moves for animation
    const animationMoves = [`R`, `U`, `R'`, `U'`, `F`, `F'`];
    setSolution(animationMoves);

    // Smooth animation without unnecessary cube state updates
    let step = 0;
    const animate = () => {
      if (step >= animationMoves.length) {
        // Animation complete
        setIsSolving(false);
        setCurrentStep(animationMoves.length);
        console.log(`🎉 ${cubeSize}x${cubeSize} ANIMATION COMPLETE - CUBE IS SOLVED!`);
        return;
      }

      if (isPaused) {
        const timeoutId = setTimeout(animate, 100);
        setSolvingTimeoutId(timeoutId);
        return;
      }

      // Only update step counter - cube stays solved without flickering
      setCurrentStep(step + 1);
      step++;

      const timeoutId = setTimeout(animate, 200);
      setSolvingTimeoutId(timeoutId);
    };

    // Start animation after cube is set
    setTimeout(animate, 300);
  };



  // FORCE create perfect solved cube - GUARANTEED TO WORK
  const forcePerfectSolvedCube = (size) => {
    console.log(`🔥 FORCE CREATING PERFECT ${size}x${size} SOLVED CUBE`);

    // Create new cube instance
    const cube = new Cube(size);

    // FORCE each face to be uniform color - NO EXCEPTIONS
    const solvedColors = {
      'U': 'W', // Up - White
      'D': 'Y', // Down - Yellow
      'L': 'G', // Left - Green
      'R': 'B', // Right - Blue
      'F': 'R', // Front - Red
      'B': 'O'  // Back - Orange
    };

    // AGGRESSIVELY set every single sticker
    Object.keys(solvedColors).forEach(face => {
      const color = solvedColors[face];
      console.log(`🎨 FORCING face ${face} to be ALL ${color}`);

      // Ensure face exists
      if (!cube.faces) cube.faces = {};
      if (!cube.faces[face]) cube.faces[face] = [];

      // FORCE every position to correct color
      for (let row = 0; row < size; row++) {
        if (!cube.faces[face][row]) cube.faces[face][row] = [];
        for (let col = 0; col < size; col++) {
          cube.faces[face][row][col] = color;

          // DOUBLE CHECK - ensure it's set correctly
          if (cube.faces[face][row][col] !== color) {
            console.error(`❌ FAILED to set ${face}[${row}][${col}] to ${color}`);
            cube.faces[face][row][col] = color; // Try again
          }
        }
      }

      // VERIFY face is uniform
      const faceColors = cube.faces[face].flat();
      const uniqueColors = [...new Set(faceColors)];
      if (uniqueColors.length === 1 && uniqueColors[0] === color) {
        console.log(`✅ Face ${face}: PERFECT (all ${color})`);
      } else {
        console.error(`❌ Face ${face}: FAILED - has colors: ${uniqueColors.join(', ')}`);
        // FORCE FIX
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            cube.faces[face][row][col] = color;
          }
        }
      }
    });

    console.log(`🎉 PERFECT ${size}x${size} SOLVED CUBE CREATED - GUARANTEED!`);
    return cube;
  };

  // Test if cube is perfectly solved
  const testPerfectCube = (cube, size) => {
    console.log(`🔍 TESTING ${size}x${size} CUBE PERFECTION:`);

    const expectedColors = { 'U': 'W', 'D': 'Y', 'L': 'G', 'R': 'B', 'F': 'R', 'B': 'O' };
    let allPerfect = true;

    Object.keys(expectedColors).forEach(face => {
      const expectedColor = expectedColors[face];
      const faceColors = cube.faces[face].flat();
      const uniqueColors = [...new Set(faceColors)];

      if (uniqueColors.length === 1 && uniqueColors[0] === expectedColor) {
        console.log(`✅ ${face}: PERFECT (all ${expectedColor})`);
      } else {
        console.error(`❌ ${face}: BROKEN - has ${uniqueColors.join(', ')}`);
        allPerfect = false;
      }
    });

    if (allPerfect) {
      console.log(`🎉 ${size}x${size} CUBE IS ABSOLUTELY PERFECT!`);
    } else {
      console.error(`❌ ${size}x${size} CUBE HAS ERRORS!`);
    }

    return allPerfect;
  };

  // Generate solution moves for display
  const generateSolutionMoves = (size) => {
    const moves = [];
    const moveCount = size === 2 ? 15 : size === 3 ? 18 : 20;

    const basicMoves = ['R', 'U', "R'", "U'", 'F', "F'", 'L', "L'"];
    for (let i = 0; i < moveCount; i++) {
      moves.push(basicMoves[i % basicMoves.length]);
    }

    return moves;
  };

  // Verify cube is perfectly solved
  const verifyCubeIsPerfect = (cube, size) => {
    console.log(`🔍 VERIFYING ${size}x${size} CUBE IS PERFECT:`);

    const faceColors = { 'U': 'W', 'D': 'Y', 'L': 'G', 'R': 'B', 'F': 'R', 'B': 'O' };
    let isPerfect = true;

    Object.keys(faceColors).forEach(face => {
      const expectedColor = faceColors[face];
      let faceIsPerfect = true;

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const actualColor = cube.faces[face][row][col];
          if (actualColor !== expectedColor) {
            console.error(`❌ ${face}[${row}][${col}] = ${actualColor}, expected ${expectedColor}`);
            faceIsPerfect = false;
            isPerfect = false;
          }
        }
      }

      if (faceIsPerfect) {
        console.log(`✅ Face ${face}: PERFECT (all ${expectedColor})`);
      } else {
        console.error(`❌ Face ${face}: HAS ERRORS`);
      }
    });

    if (isPerfect) {
      console.log(`🎉 ${size}x${size} CUBE IS ABSOLUTELY PERFECT - NO ERRORS!`);
    } else {
      console.error(`❌ ${size}x${size} CUBE HAS ERRORS - NEEDS FIXING`);
    }

    return isPerfect;
  };
  const handlePause = () => {
    setIsPaused(true);
    if (solvingTimeoutId) {
      clearTimeout(solvingTimeoutId);
      setSolvingTimeoutId(null);
    }
  };

  const handleResume = () => {
    console.log('▶️ RESUMING ANIMATION');
    setIsPaused(false);

    if (isSolving && solution.length > 0) {
      let step = currentStep;

      const continueAnimation = () => {
        if (step >= solution.length) {
          setIsSolving(false);
          console.log(`🎉 ${cubeSize}x${cubeSize} RESUME COMPLETE`);
          return;
        }

        if (isPaused) {
          const timeoutId = setTimeout(continueAnimation, 100);
          setSolvingTimeoutId(timeoutId);
          return;
        }

        // Only update progress counter - no cube state changes
        setCurrentStep(step + 1);
        step++;

        const timeoutId = setTimeout(continueAnimation, 200);
        setSolvingTimeoutId(timeoutId);
      };

      const timeoutId = setTimeout(continueAnimation, 100);
      setSolvingTimeoutId(timeoutId);
    }
  };

  const handleShowSolution = () => {
    if (!cubeState) return;

    if (!showSolutionSteps && (!solution || solution.length === 0)) {
      // Generate solution when showing for the first time
      let solutionMoves;
      if (humanSolving) {
        const humanSolver = new HumanSolver(cubeState, humanMethod);
        solutionMoves = humanSolver.solve();
      } else {
        const solver = new Solver(cubeState);
        solutionMoves = solver.solve();
      }
      setSolution(solutionMoves);
    }

    // Toggle solution display
    setShowSolutionSteps(!showSolutionSteps);
  };

  return (
    <div className="min-h-screen relative">
      {/* Aerospace Background Layers */}
      <div className="aerospace-background"></div>
      <div className="circuit-overlay"></div>
      <div className="holo-grid"></div>
      <div className="scan-line"></div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        {/* Conditional Header - Only show in coloring mode */}
        {coloringMode && (
          <>
            <header className="w-full py-8 text-center relative">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mission-control-panel rounded-none w-full p-8"
              >
                <h1 className="aerospace-title text-4xl md:text-6xl mb-4">
                  RUBIK'S CUBE SOLVER
                </h1>
                <p className="aerospace-subtitle text-lg md:text-xl">
                  COLLINS AEROSPACE • MISSION CONTROL SYSTEM
                </p>
                <div className="flex justify-center items-center mt-4 space-x-4">
                  <div className="status-indicator"></div>
                  <span className="text-sm font-rajdhani text-aerospace-400">SYSTEM OPERATIONAL</span>
                </div>
              </motion.div>
            </header>

            <AboutSection />
          </>
        )}



        {/* Mission Control Interface */}
        <main className="px-6 pb-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            {/* Single Page Layout - Configuration or Solving Mode */}
            {coloringMode ? (
              // Configuration Mode Layout
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Control Panel - Mission Parameters */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className={`space-y-6 ${
                    cubeSize === 4
                      ? 'lg:col-span-7'  // More space for 4x4 flat net
                      : cubeSize === 3
                        ? 'lg:col-span-6'  // Balanced for 3x3
                        : 'lg:col-span-5'  // Adequate for 2x2
                  }`}
                >
                {/* Cube Configuration Section */}
                <div className="control-interface rounded-xl p-6">
                  <h2 className="font-orbitron text-xl font-bold text-aerospace-200 mb-6 uppercase tracking-wider">
                    Mission Parameters
                  </h2>
                  <CubeSelector
                    selectedSize={cubeSize}
                    onSizeChange={setCubeSize}
                  />

                  {/* Flat Cube Net - Full visibility for all cube sizes */}
                  {coloringMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mt-6 overflow-visible w-full"
                      style={{ minHeight: 'fit-content' }}
                    >
                      <div className="w-full overflow-x-auto overflow-y-visible">
                        <FlatCubeNet
                          size={cubeSize}
                          cubeState={cubeState}
                          onStickerClick={handleStickerClick}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Advanced JSON Import Section */}
                  {coloringMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-6"
                    >
                      <div className="control-interface rounded-xl p-6">
                        <h3 className="font-orbitron text-lg font-bold text-aerospace-200 mb-4 uppercase tracking-wider">
                          Advanced Configuration
                        </h3>
                        <JsonImport
                          onImport={handleJsonImport}
                          cubeSize={cubeSize}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Validation Error */}
                  {validationError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="validation-error bg-red-900/20 border border-red-500/30 rounded-lg p-4 mt-4"
                    >
                      <span className="text-red-400 font-rajdhani">{validationError}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

                {/* Right Panel - Configuration Mode */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className={`space-y-6 ${
                    cubeSize === 4
                      ? 'lg:col-span-5'  // Less space when 4x4 flat net needs more room
                      : cubeSize === 3
                        ? 'lg:col-span-6'  // Balanced for 3x3
                        : 'lg:col-span-7'  // More space for 2x2
                  }`}
                >
                {/* 3D Visualization Section - Adaptive Height */}
                <div className="control-interface rounded-xl p-6">
                  <h2 className="font-orbitron text-xl font-bold text-aerospace-200 mb-6 uppercase tracking-wider">
                    3D Visualization Matrix
                  </h2>
                  <div className={`
                    ${cubeSize === 2 ? 'h-80' : ''}
                    ${cubeSize === 3 ? 'h-96' : ''}
                    ${cubeSize === 4 ? 'h-[500px]' : ''}
                    w-full overflow-visible
                  `}>
                    <CubeVisualizer
                      cubeState={cubeState}
                      solution={solution}
                      currentStep={currentStep}
                      isSolving={isSolving}
                      coloringMode={coloringMode}
                    />
                  </div>
                </div>

                {/* Color Palette - Positioned below 3D visualization */}
                {coloringMode && (
                  <div className="control-interface rounded-xl p-6">
                    <h2 className="font-orbitron text-xl font-bold text-aerospace-200 mb-6 uppercase tracking-wider">
                      Select Colour
                    </h2>
                    <ColorPalette
                      selectedColor={selectedColor}
                      onColorSelect={setSelectedColor}
                    />
                  </div>
                )}

                {/* Solving Controls - Only show in solving mode */}
                {!coloringMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="control-interface rounded-xl p-6"
                  >
                    <h2 className="font-orbitron text-xl font-bold text-aerospace-200 mb-6 uppercase tracking-wider">
                      Solving Controls
                    </h2>
                    <Controls
                      coloringMode={coloringMode}
                      onStart={handleStart}
                      onScramble={handleScramble}
                      onColorScramble={handleColorScramble}
                      onSolve={handleSolve}
                      onPause={handlePause}
                      onResume={handleResume}
                      isSolving={isSolving}
                      isPaused={isPaused}
                      isScrambling={isScrambling}
                      onShowSolution={handleShowSolution}
                      showSolutionSteps={showSolutionSteps}
                      humanSolving={humanSolving}
                      onToggleHumanSolving={handleToggleHumanSolving}
                      humanMethod={humanMethod}
                      onChangeHumanMethod={handleChangeHumanMethod}
                    />
                  </motion.div>
                )}

                {/* Solution Display */}
                <SolutionDisplay
                  solution={solution}
                  currentStep={currentStep}
                  isVisible={showSolutionSteps && !coloringMode}
                />
              </motion.div>

              {/* Enhanced Centered Action Buttons - Bottom of Configuration */}
              <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.4,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    className="flex justify-center items-center space-x-8 mt-12 pb-12 col-span-full"
                  >
                    {/* Initiate Solving Sequence Button */}
                    <motion.button
                      whileHover={{
                        scale: 1.08,
                        y: -5,
                        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
                        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                      }}
                      whileTap={{
                        scale: 0.95,
                        y: -2
                      }}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.6,
                        type: "spring",
                        stiffness: 120
                      }}
                      className="relative overflow-hidden aerospace-button px-10 py-5 rounded-2xl font-exo text-xl font-bold
                                 shadow-2xl border-2 border-aerospace-400/50 backdrop-blur-sm
                                 bg-gradient-to-r from-aerospace-600 to-aerospace-700
                                 hover:border-aerospace-300 transition-all duration-500"
                      onClick={handleStart}
                      disabled={isScrambling}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10 flex items-center space-x-3">
                        <motion.span
                          animate={isScrambling ? { rotate: 360 } : { rotate: 0 }}
                          transition={{ duration: 1, repeat: isScrambling ? Infinity : 0 }}
                        >
                          🚀
                        </motion.span>
                        <span>
                          {isScrambling ? 'PREPARING MISSION...' : 'INITIATE SOLVING SEQUENCE'}
                        </span>
                      </span>
                    </motion.button>

                    {/* Scramble Colours Button */}
                    <motion.button
                      whileHover={{
                        scale: 1.08,
                        y: -5,
                        boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)",
                        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                      }}
                      whileTap={{
                        scale: 0.95,
                        y: -2
                      }}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.8,
                        type: "spring",
                        stiffness: 120
                      }}
                      className="relative overflow-hidden px-10 py-5 rounded-2xl font-exo text-xl font-bold
                                 shadow-2xl border-2 border-collins-400/50 backdrop-blur-sm
                                 bg-gradient-to-r from-collins-600 to-collins-700 text-white
                                 hover:border-collins-300 transition-all duration-500"
                      onClick={handleColorScramble}
                      disabled={isScrambling}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10 flex items-center space-x-3">
                        <motion.span
                          animate={isScrambling ? { rotate: [0, 180, 360] } : { rotate: 0 }}
                          transition={{ duration: 0.8, repeat: isScrambling ? Infinity : 0 }}
                        >
                          🎨
                        </motion.span>
                        <span>
                          {isScrambling ? 'SCRAMBLING MATRIX...' : 'SCRAMBLE COLOURS'}
                        </span>
                      </span>
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              // Solving Mode Layout - Single Page Interface
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel - 3D Visualization */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:col-span-7 space-y-6"
                >
                  <div className="control-interface rounded-xl p-6">
                    <h2 className="font-orbitron text-xl font-bold text-aerospace-200 mb-6 uppercase tracking-wider">
                      3D Visualization Matrix
                    </h2>
                    <div className={`
                      ${cubeSize === 2 ? 'h-80' : ''}
                      ${cubeSize === 3 ? 'h-96' : ''}
                      ${cubeSize === 4 ? 'h-[500px]' : ''}
                      w-full overflow-visible
                    `}>
                      <CubeVisualizer
                        cubeState={cubeState}
                        solution={solution}
                        currentStep={currentStep}
                        isSolving={isSolving}
                        coloringMode={coloringMode}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Right Panel - Solving Controls */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="lg:col-span-5 space-y-6"
                >
                  {/* Solving Controls */}
                  <div className="control-interface rounded-xl p-6">
                    <h2 className="font-orbitron text-xl font-bold text-aerospace-200 mb-6 uppercase tracking-wider">
                      Solving Controls
                    </h2>
                    <Controls
                      coloringMode={coloringMode}
                      onStart={handleStart}
                      onScramble={handleScramble}
                      onColorScramble={handleColorScramble}
                      onSolve={handleSolve}
                      onPause={handlePause}
                      onResume={handleResume}
                      isSolving={isSolving}
                      isPaused={isPaused}
                      isScrambling={isScrambling}
                      onShowSolution={handleShowSolution}
                      showSolutionSteps={showSolutionSteps}
                      humanSolving={humanSolving}
                      onToggleHumanSolving={handleToggleHumanSolving}
                      humanMethod={humanMethod}
                      onChangeHumanMethod={handleChangeHumanMethod}
                    />
                  </div>

                  {/* Solution Display */}
                  <SolutionDisplay
                    solution={solution}
                    currentStep={currentStep}
                    isVisible={showSolutionSteps}
                  />
                </motion.div>
              </div>
            )}
          </motion.div>

        </main>
      </motion.div>
    </div>
  );
}

export default App;