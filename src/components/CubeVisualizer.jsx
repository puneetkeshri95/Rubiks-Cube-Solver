import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import './CubeVisualizer.css';

function CubeVisualizer({ cubeState, solution, currentStep, isSolving, coloringMode }) {
  const [isFolding, setIsFolding] = useState(false);
  const [solveStartTime, setSolveStartTime] = useState(null);
  const [solveTime, setSolveTime] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const [hasStartedSolving, setHasStartedSolving] = useState(false);

  // Trigger folding animation when switching from coloring mode to solving mode
  useEffect(() => {
    if (!coloringMode && cubeState) {
      setIsFolding(true);
      const timer = setTimeout(() => {
        setIsFolding(false);
      }, 3000); // 3 seconds for more elaborate folding animation
      return () => clearTimeout(timer);
    }
  }, [coloringMode, cubeState]);

  // Reset timer when cube state changes or when returning to coloring mode
  useEffect(() => {
    if (coloringMode || !cubeState) {
      setShowTimer(false);
      setSolveTime(null);
      setSolveStartTime(null);
      setHasStartedSolving(false);
    }
  }, [cubeState, coloringMode]);

  // Track solving time
  useEffect(() => {
    if (isSolving && !solveStartTime) {
      setSolveStartTime(Date.now());
      setShowTimer(true);
      setSolveTime(null);
      setHasStartedSolving(true);
    } else if (!isSolving && solveStartTime && solution && currentStep >= solution.length - 1) {
      const endTime = Date.now();
      setSolveTime(((endTime - solveStartTime) / 1000).toFixed(2));
      setSolveStartTime(null);
    }
  }, [isSolving, solveStartTime, solution, currentStep]);

  // Calculate dynamic camera position based on cube size
  const getCameraPosition = (size) => {
    // Enhanced camera positioning for better cube visibility
    const baseDistance = 6;
    const sizeMultiplier = {
      2: 2.0,  // Closer for 2x2
      3: 2.5,  // Standard for 3x3
      4: 3.2   // Further back for 4x4 to prevent cut-off
    };

    const distance = Math.max(baseDistance, size * (sizeMultiplier[size] || 2.5));
    return [distance, distance, distance];
  };

  // Calculate canvas style for responsive container - Size-adaptive
  const getCanvasStyle = (size) => {
    // Dynamic height based on cube size to prevent cut-off
    const getMaxHeight = (cubeSize) => {
      switch(cubeSize) {
        case 2: return '320px';
        case 3: return '400px';
        case 4: return '500px';
        default: return '400px';
      }
    };

    return {
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      width: '100%',
      height: '100%',
      minHeight: getMaxHeight(size),
      maxHeight: getMaxHeight(size),
      borderRadius: '12px',
      boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.5)'
    };
  };

  return (
    <div className={`cube-visualizer cube-3d-container size-${cubeState?.size || 3} h-full flex flex-col`}>
      <Canvas
        shadows
        camera={{
          position: getCameraPosition(cubeState?.size || 3),
          fov: cubeState?.size === 4 ? 50 : 45  // Wider FOV for 4x4 cube
        }}
        style={getCanvasStyle(cubeState?.size || 3)}
      >
        {/* Enhanced Aerospace Mission Control Lighting for Maximum Visibility */}
        <ambientLight intensity={0.8} color="#f1f5f9" />

        {/* Primary directional light (simulates bright space station lighting) */}
        <directionalLight
          position={[15, 20, 15]}
          intensity={3.5}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-near={0.1}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          color="#ffffff"
        />

        {/* High-intensity fill lights for even illumination */}
        <pointLight position={[12, 12, 12]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-12, 12, -12]} intensity={1.2} color="#f1f5f9" />
        <pointLight position={[12, -12, -12]} intensity={1.0} color="#e2e8f0" />
        <pointLight position={[-12, -12, 12]} intensity={1.0} color="#f8fafc" />

        {/* Additional directional lights for complete coverage */}
        <directionalLight
          position={[-15, -20, -15]}
          intensity={2.5}
          color="#f1f5f9"
        />

        <directionalLight
          position={[0, 0, 20]}
          intensity={2.0}
          color="#ffffff"
        />

        {/* Bright environment lighting */}
        <hemisphereLight
          skyColor="#ffffff"
          groundColor="#f1f5f9"
          intensity={1.2}
        />

        {/* Additional spot lights for cube visibility */}
        <spotLight
          position={[0, 25, 0]}
          intensity={2.0}
          angle={Math.PI / 3}
          penumbra={0.2}
          color="#ffffff"
          castShadow
        />

        <spotLight
          position={[20, 0, 20]}
          intensity={1.5}
          angle={Math.PI / 4}
          penumbra={0.3}
          color="#f8fafc"
        />

        <spotLight
          position={[-20, 0, -20]}
          intensity={1.5}
          angle={Math.PI / 4}
          penumbra={0.3}
          color="#f1f5f9"
        />

        <PerspectiveCamera makeDefault position={getCameraPosition(cubeState?.size || 3)} />

        {/* Ground plane for realistic shadows */}
        <mesh position={[0, -4, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshPhysicalMaterial
            color="#f0f0f0"
            metalness={0.0}
            roughness={0.9}
            transparent={false}
            opacity={1.0}
          />
        </mesh>

        {cubeState && (
          <CubeModel
            cubeState={cubeState}
            isFolding={isFolding}
            solution={solution}
            currentStep={currentStep}
            isSolving={isSolving}
          />
        )}

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={!isSolving && !isFolding && (!solution || currentStep < solution.length - 1)}
          autoRotateSpeed={0.5}
          minDistance={Math.max(3, (cubeState?.size || 3) * 1.2)} // Closer minimum for better detail
          maxDistance={Math.max(20, (cubeState?.size || 3) * 8)}  // Further maximum for 4x4 overview
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
        />
      </Canvas>

      {/* Timer display - only show during/after solving */}
      {showTimer && hasStartedSolving && !coloringMode && (
        <div className="solve-timer">
          {solveTime ? `Solved in: ${solveTime}s` : 'Solving...'}
        </div>
      )}


    </div>
  );
}

// Individual Cubie Component - represents a single piece of the cube
function Cubie({ position, colors, rotation = [0, 0, 0], animating = false }) {
  const meshRef = useRef();
  const cubieSize = 0.98; // Realistic cube piece size
  const stickerSize = 0.92; // Larger stickers for better coverage
  const stickerDepth = 0.01; // Slightly thicker for better visibility

  // Animate rotation changes
  useFrame(() => {
    if (meshRef.current && animating) {
      // Smooth rotation animation
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, rotation[0], 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotation[1], 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, rotation[2], 0.1);
    } else if (meshRef.current) {
      meshRef.current.rotation.set(...rotation);
    }
  });

  // Create aerospace-grade metallic materials with comprehensive black tile prevention
  const createMaterial = (color) => {
    // Multiple layers of protection against black tiles
    let safeColor = color;

    // Check for any form of black or invalid color
    if (!safeColor ||
        safeColor === 'K' ||
        safeColor === 'BLACK' ||
        safeColor === '#000000' ||
        safeColor === 'black' ||
        safeColor === null ||
        safeColor === undefined ||
        safeColor === '') {
      console.warn(`⚠️ Material: Converting invalid color "${safeColor}" to white`);
      safeColor = 'W';
    }

    const colorMap = {
      'W': '#ffffff',  // Pure white for maximum visibility
      'Y': '#fde047',  // Bright yellow
      'G': '#22c55e',  // Bright green
      'B': '#3b82f6',  // Bright blue
      'R': '#ef4444',  // Bright red
      'O': '#f97316',  // Bright orange
      'K': '#ffffff',  // Black tiles become white
      'BLACK': '#ffffff',  // Explicit black becomes white
      'black': '#ffffff',  // Lowercase black becomes white
      '#000000': '#ffffff'  // Hex black becomes white
    };

    // Get the color, with multiple fallbacks
    let finalColor = colorMap[safeColor];
    if (!finalColor) {
      console.warn(`⚠️ Material: Unknown color "${safeColor}", defaulting to white`);
      finalColor = '#ffffff';
    }

    // Ensure the final color is never black
    if (finalColor === '#000000' || finalColor === 'black' || finalColor === 'BLACK') {
      console.error(`❌ Material: Final color was black, forcing to white`);
      finalColor = '#ffffff';
    }

    console.log(`🎨 Material: Creating material for color ${safeColor} → ${finalColor}`);

    return new THREE.MeshPhysicalMaterial({
      color: finalColor,
      metalness: 0.6,           // Reduced metalness for better color visibility
      roughness: 0.1,           // Smooth but not mirror-like
      clearcoat: 0.9,           // High clearcoat for protection
      clearcoatRoughness: 0.05, // Smooth clearcoat
      reflectivity: 0.8,        // High but not maximum reflectivity
      transparent: false,
      opacity: 1.0,
      side: THREE.DoubleSide,
      envMapIntensity: 1.5,     // Moderate environment reflections
      // Enhanced emissive glow for better visibility
      emissive: new THREE.Color(finalColor).multiplyScalar(0.08),
      // Realistic IOR
      ior: 1.4,
      transmission: 0.0,        // No transmission, solid metal
      thickness: 1.0
    });
  };

  // Aerospace-grade carbon fiber/graphite material for cube body (more visible)
  const blackMaterial = new THREE.MeshPhysicalMaterial({
    color: '#334155',           // Lighter aerospace dark for better visibility
    metalness: 0.7,             // Slightly reduced metalness
    roughness: 0.2,             // Slightly more rough for better light interaction
    clearcoat: 0.8,             // High clearcoat for protection layer
    clearcoatRoughness: 0.1,    // Smooth clearcoat
    transparent: false,
    opacity: 1.0,
    side: THREE.FrontSide,
    envMapIntensity: 2.0,       // Enhanced reflections for visibility
    emissive: new THREE.Color('#475569').multiplyScalar(0.05), // More visible glow
    ior: 1.4
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Main cube body with slightly rounded edges */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[cubieSize, cubieSize, cubieSize]} />
        <primitive object={blackMaterial} />
      </mesh>

      {/* Stickers on each visible face */}
      {colors.front && (
        <mesh position={[0, 0, cubieSize/2 + stickerDepth]} castShadow>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <primitive object={createMaterial(colors.front)} />
        </mesh>
      )}
      {colors.back && (
        <mesh position={[0, 0, -cubieSize/2 - stickerDepth]} rotation={[0, Math.PI, 0]} castShadow>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <primitive object={createMaterial(colors.back)} />
        </mesh>
      )}
      {colors.right && (
        <mesh position={[cubieSize/2 + stickerDepth, 0, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <primitive object={createMaterial(colors.right)} />
        </mesh>
      )}
      {colors.left && (
        <mesh position={[-cubieSize/2 - stickerDepth, 0, 0]} rotation={[0, -Math.PI/2, 0]} castShadow>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <primitive object={createMaterial(colors.left)} />
        </mesh>
      )}
      {colors.top && (
        <mesh position={[0, cubieSize/2 + stickerDepth, 0]} rotation={[-Math.PI/2, 0, 0]} castShadow>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <primitive object={createMaterial(colors.top)} />
        </mesh>
      )}
      {colors.bottom && (
        <mesh position={[0, -cubieSize/2 - stickerDepth, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <primitive object={createMaterial(colors.bottom)} />
        </mesh>
      )}
    </group>
  );
}

function CubeModel({ cubeState, isFolding, solution, currentStep, isSolving }) {
  const groupRef = useRef();
  const size = cubeState.size;
  const [isPostSolveRotating, setIsPostSolveRotating] = useState(false);
  const [animatingMove, setAnimatingMove] = useState(null);
  const [cubiePositions, setCubiePositions] = useState([]);
  const [cubieRotations, setCubieRotations] = useState({});
  const [currentMove, setCurrentMove] = useState(null);

  // Track current move for animation
  useEffect(() => {
    if (isSolving && solution && currentStep < solution.length) {
      const move = solution[currentStep];
      if (move !== currentMove) {
        setCurrentMove(move);
        animateFaceRotation(move);
      }
    }
  }, [currentStep, solution, isSolving]);

  // Function to determine which cubies are affected by a face rotation
  const getCubiesInFace = (face) => {
    const affected = [];

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let x, y, z;

        switch (face) {
          case 'F': // Front face (positive Z)
            x = i; y = j; z = size - 1;
            break;
          case 'B': // Back face (negative Z)
            x = size - 1 - i; y = j; z = 0;
            break;
          case 'R': // Right face (positive X)
            x = size - 1; y = j; z = i;
            break;
          case 'L': // Left face (negative X)
            x = 0; y = j; z = size - 1 - i;
            break;
          case 'U': // Up face (positive Y)
            x = i; y = size - 1; z = j;
            break;
          case 'D': // Down face (negative Y)
            x = i; y = 0; z = size - 1 - j;
            break;
          default:
            continue;
        }

        affected.push(`${x}-${y}-${z}`);
      }
    }

    return affected;
  };

  // Animate face rotation
  const animateFaceRotation = (move) => {
    const face = move.replace("'", "").replace("2", "");
    const isPrime = move.includes("'");
    const isDouble = move.includes("2");

    const affectedCubies = getCubiesInFace(face);
    const rotationAngle = isDouble ? Math.PI : (isPrime ? -Math.PI/2 : Math.PI/2);

    // Set animation state
    setAnimatingMove(move);

    // Apply rotation to affected cubies
    const newRotations = { ...cubieRotations };

    affectedCubies.forEach(cubieKey => {
      if (!newRotations[cubieKey]) {
        newRotations[cubieKey] = [0, 0, 0];
      }

      // Apply rotation based on face
      switch (face) {
        case 'F':
        case 'B':
          newRotations[cubieKey][2] += rotationAngle * (face === 'B' ? -1 : 1);
          break;
        case 'R':
        case 'L':
          newRotations[cubieKey][0] += rotationAngle * (face === 'L' ? -1 : 1);
          break;
        case 'U':
        case 'D':
          newRotations[cubieKey][1] += rotationAngle * (face === 'D' ? -1 : 1);
          break;
      }
    });

    setCubieRotations(newRotations);

    // Clear animation state after animation completes
    setTimeout(() => {
      setAnimatingMove(null);
    }, 500);
  };

  // Check if cube is solved and start post-solve rotation
  useEffect(() => {
    if (!isSolving && solution && currentStep >= solution.length - 1 && solution.length > 0) {
      setIsPostSolveRotating(true);
      const timer = setTimeout(() => {
        setIsPostSolveRotating(false);
      }, 8000); // 8 seconds of rotation
      return () => clearTimeout(timer);
    }
  }, [isSolving, solution, currentStep]);

  // Comprehensive validation and fixing function for cube state
  const validateCubeState = (cube) => {
    if (!cube || !cube.faces) {
      console.warn('⚠️ CubeVisualizer: Invalid cube object received');
      return null;
    }

    const validColors = ['W', 'Y', 'G', 'B', 'R', 'O'];
    const faceNames = ['U', 'D', 'L', 'R', 'F', 'B'];
    const solvedColors = {
      'U': 'W', 'D': 'Y', 'L': 'G', 'R': 'B', 'F': 'R', 'B': 'O'
    };

    console.log('🔍 CubeVisualizer: Validating cube state...');
    let fixedTiles = 0;

    // Ensure all faces exist and are properly initialized
    faceNames.forEach(face => {
      if (!cube.faces[face]) {
        console.warn(`⚠️ CubeVisualizer: Face ${face} missing, creating...`);
        cube.faces[face] = Array(cube.size).fill().map(() => Array(cube.size).fill(solvedColors[face] || 'W'));
        fixedTiles += cube.size * cube.size;
      } else {
        // Validate each row and cell
        for (let row = 0; row < cube.size; row++) {
          if (!cube.faces[face][row]) {
            console.warn(`⚠️ CubeVisualizer: Row ${row} in face ${face} missing, creating...`);
            cube.faces[face][row] = Array(cube.size).fill(solvedColors[face] || 'W');
            fixedTiles += cube.size;
          } else {
            for (let col = 0; col < cube.size; col++) {
              const color = cube.faces[face][row][col];
              // Check for any form of black or invalid color
              if (!color ||
                  !validColors.includes(color) ||
                  color === 'K' ||
                  color === 'BLACK' ||
                  color === '#000000' ||
                  color === 'black' ||
                  color === null ||
                  color === undefined) {
                console.warn(`⚠️ CubeVisualizer: Fixed invalid color at ${face}[${row}][${col}]: ${color} → ${solvedColors[face] || 'W'}`);
                cube.faces[face][row][col] = solvedColors[face] || 'W';
                fixedTiles++;
              }
            }
          }
        }
      }
    });

    console.log(`✅ CubeVisualizer: Validation complete. Fixed ${fixedTiles} tiles.`);
    return cube;
  };

  // Initialize cubie positions based on cube state
  useEffect(() => {
    if (!cubeState) return;

    // Validate cube state efficiently - minimal processing to prevent flickering
    const validatedCube = validateCubeState(cubeState);
    if (!validatedCube) return;

    const size = validatedCube.size;

    const positions = [];
    const offset = (size - 1) / 2;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const position = [
            (x - offset) * 1.02, // Tight spacing like real Rubik's cubes
            (y - offset) * 1.02,
            (z - offset) * 1.02
          ];

          // Determine which faces are visible and their colors
          const colors = {};

          // ULTRA-AGGRESSIVE BLACK TILE PREVENTION - ZERO TOLERANCE

          // Front face (positive Z) - GUARANTEED NO BLACK
          if (z === size - 1) {
            const row = validatedCube.faces.F[size - 1 - y];
            let color = (row && row[x]) || 'R';
            // Multiple checks for any form of black
            if (!color || color === 'K' || color === 'black' || color === 'BLACK' ||
                color === '#000000' || color === '#000' || color === 'undefined' ||
                color === null || color === undefined) {
              color = 'R'; // Force to red
            }
            colors.front = color;
          }

          // Back face (negative Z) - GUARANTEED NO BLACK
          if (z === 0) {
            const row = validatedCube.faces.B[size - 1 - y];
            let color = (row && row[size - 1 - x]) || 'O';
            if (!color || color === 'K' || color === 'black' || color === 'BLACK' ||
                color === '#000000' || color === '#000' || color === 'undefined' ||
                color === null || color === undefined) {
              color = 'O'; // Force to orange
            }
            colors.back = color;
          }

          // Right face (positive X) - GUARANTEED NO BLACK
          if (x === size - 1) {
            const row = validatedCube.faces.R[size - 1 - y];
            let color = (row && row[z]) || 'B';
            if (!color || color === 'K' || color === 'black' || color === 'BLACK' ||
                color === '#000000' || color === '#000' || color === 'undefined' ||
                color === null || color === undefined) {
              color = 'B'; // Force to blue
            }
            colors.right = color;
          }

          // Left face (negative X) - GUARANTEED NO BLACK
          if (x === 0) {
            const row = validatedCube.faces.L[size - 1 - y];
            let color = (row && row[size - 1 - z]) || 'G';
            if (!color || color === 'K' || color === 'black' || color === 'BLACK' ||
                color === '#000000' || color === '#000' || color === 'undefined' ||
                color === null || color === undefined) {
              color = 'G'; // Force to green
            }
            colors.left = color;
          }

          // Top face (positive Y) - GUARANTEED NO BLACK
          if (y === size - 1) {
            const row = validatedCube.faces.U[z];
            let color = (row && row[x]) || 'W';
            if (!color || color === 'K' || color === 'black' || color === 'BLACK' ||
                color === '#000000' || color === '#000' || color === 'undefined' ||
                color === null || color === undefined) {
              color = 'W'; // Force to white
            }
            colors.top = color;
          }

          // Bottom face (negative Y) - GUARANTEED NO BLACK
          if (y === 0) {
            const row = validatedCube.faces.D[size - 1 - z];
            let color = (row && row[x]) || 'Y';
            if (!color || color === 'K' || color === 'black' || color === 'BLACK' ||
                color === '#000000' || color === '#000' || color === 'undefined' ||
                color === null || color === undefined) {
              color = 'Y'; // Force to yellow
            }
            colors.bottom = color;
          }

          positions.push({
            key: `${x}-${y}-${z}`,
            position,
            colors,
            gridPos: { x, y, z }
          });
        }
      }
    }

    setCubiePositions(positions);
  }, [cubeState, size]);

  // Render all cubies
  const renderCubies = () => {
    return cubiePositions.map((cubie) => (
      <Cubie
        key={cubie.key}
        position={cubie.position}
        colors={cubie.colors}
        rotation={cubieRotations[cubie.key] || [0, 0, 0]}
        animating={animatingMove !== null}
      />
    ));
  };
  

  
  // Enhanced rotation animations
  useFrame((state) => {
    if (groupRef.current) {
      if (isPostSolveRotating) {
        // Smooth 360-degree rotation after solving for verification
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
        groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.15) * 0.1;
      } else if (isFolding) {
        // Enhanced folding animation effect
        const foldProgress = Math.min((state.clock.elapsedTime % 3) / 3, 1);

        // Multi-stage folding animation
        if (foldProgress < 0.3) {
          // Stage 1: Flatten and spread out (like unfolded net)
          const stage1Progress = foldProgress / 0.3;
          groupRef.current.scale.setScalar(0.3 + 0.7 * (1 - stage1Progress));
          groupRef.current.rotation.x = stage1Progress * Math.PI * 0.1;
          groupRef.current.rotation.y = stage1Progress * Math.PI * 0.2;
        } else if (foldProgress < 0.7) {
          // Stage 2: Begin folding (rotating faces)
          const stage2Progress = (foldProgress - 0.3) / 0.4;
          groupRef.current.scale.setScalar(0.3 + 0.4 * stage2Progress);
          groupRef.current.rotation.x = 0.1 * Math.PI * (1 - stage2Progress) + stage2Progress * Math.PI * 0.3;
          groupRef.current.rotation.y = 0.2 * Math.PI * (1 - stage2Progress) + stage2Progress * Math.PI * 0.5;
          groupRef.current.rotation.z = stage2Progress * Math.PI * 0.2;
        } else {
          // Stage 3: Final assembly into cube
          const stage3Progress = (foldProgress - 0.7) / 0.3;
          groupRef.current.scale.setScalar(0.7 + 0.3 * stage3Progress);
          groupRef.current.rotation.x = 0.3 * Math.PI * (1 - stage3Progress);
          groupRef.current.rotation.y = 0.5 * Math.PI * (1 - stage3Progress);
          groupRef.current.rotation.z = 0.2 * Math.PI * (1 - stage3Progress);
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      {renderCubies()}
    </group>
  );
}

export default CubeVisualizer;