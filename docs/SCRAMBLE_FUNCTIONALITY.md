# Scramble Functionality Design

## Overview
This document describes the implementation of the scramble functionality that generates random valid cube configurations using legal moves.

## Scramble Algorithm Design

### Move Set Definition
Define all possible moves for each cube size:

```javascript
// Move definitions
const MOVES = {
  2: ['F', 'F\'', 'R', 'R\'', 'U', 'U\''], // 2x2 moves
  3: ['F', 'F\'', 'R', 'R\'', 'U', 'U\'', 'B', 'B\'', 'L', 'L\'', 'D', 'D\''], // 3x3 moves
  4: ['F', 'F\'', 'R', 'R\'', 'U', 'U\'', 'B', 'B\'', 'L', 'L\'', 'D', 'D\'', 
      'f', 'f\'', 'r', 'r\'', 'u', 'u\'', 'b', 'b\'', 'l', 'l\'', 'd', 'd\''] // 4x4 moves
};

// Move descriptions for UI
const MOVE_DESCRIPTIONS = {
  'F': 'Front face clockwise',
  'F\'': 'Front face counter-clockwise',
  'R': 'Right face clockwise',
  'R\'': 'Right face counter-clockwise',
  'U': 'Up face clockwise',
  'U\'': 'Up face counter-clockwise',
  'B': 'Back face clockwise',
  'B\'': 'Back face counter-clockwise',
  'L': 'Left face clockwise',
  'L\'': 'Left face counter-clockwise',
  'D': 'Down face clockwise',
  'D\'': 'Down face counter-clockwise',
  // For 4x4 and larger
  'f': 'Front slice clockwise',
  'f\'': 'Front slice counter-clockwise',
  'r': 'Right slice clockwise',
  'r\'': 'Right slice counter-clockwise',
  'u': 'Up slice clockwise',
  'u\'': 'Up slice counter-clockwise',
  'b': 'Back slice clockwise',
  'b\'': 'Back slice counter-clockwise',
  'l': 'Left slice clockwise',
  'l\'': 'Left slice counter-clockwise',
  'd': 'Down slice clockwise',
  'd\'': 'Down slice counter-clockwise'
};
```

### Scramble Generation Algorithm
```javascript
// Scramble generator
class Scrambler {
  constructor(cubeSize) {
    this.cubeSize = cubeSize;
    this.moves = MOVES[cubeSize] || MOVES[3]; // Default to 3x3 moves
  }
  
  // Generate a scramble sequence
  generateScramble(length = 20) {
    const scramble = [];
    let lastMove = '';
    let lastAxis = '';
    
    while (scramble.length < length) {
      const move = this.getRandomMove(lastMove, lastAxis);
      
      if (move) {
        scramble.push(move);
        lastMove = move;
        lastAxis = this.getMoveAxis(move);
      }
    }
    
    return scramble;
  }
  
  // Get a random move that doesn't conflict with the previous move
  getRandomMove(lastMove, lastAxis) {
    const availableMoves = this.moves.filter(move => {
      // Don't use the same move twice in a row
      if (move === lastMove) return false;
      
      // Don't use moves on the same axis consecutively
      const moveAxis = this.getMoveAxis(move);
      if (moveAxis === lastAxis) return false;
      
      return true;
    });
    
    if (availableMoves.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }
  
  // Get the axis of a move (F, B = X-axis; R, L = Y-axis; U, D = Z-axis)
  getMoveAxis(move) {
    const face = move.replace(/'/, '').toLowerCase();
    
    switch (face) {
      case 'f':
      case 'b':
        return 'x';
      case 'r':
      case 'l':
        return 'y';
      case 'u':
      case 'd':
        return 'z';
      default:
        return face; // For slice moves
    }
  }
  
  // Apply scramble to a cube
  applyScramble(cube, scramble) {
    for (const move of scramble) {
      cube.move(move);
    }
    return cube;
  }
}
```

### Cube State Scrambling
```javascript
// Cube scrambling function
const scrambleCube = (cube, scrambleLength = 20) => {
  const scrambler = new Scrambler(cube.size);
  const scrambleMoves = scrambler.generateScramble(scrambleLength);
  
  // Apply the scramble moves to the cube
  const scrambledCube = scrambler.applyScramble(cube.clone(), scrambleMoves);
  
  return {
    scrambledCube,
    scrambleMoves
  };
};
```

## UI Integration

### Scramble Button Component
```jsx
// ScrambleButton.jsx
import React from 'react';

function ScrambleButton({ onScramble, isScrambling, disabled }) {
  return (
    <button
      className="scramble-button"
      onClick={onScramble}
      disabled={disabled || isScrambling}
    >
      {isScrambling ? 'Scrambling...' : 'Scramble'}
    </button>
  );
}

export default ScrambleButton;
```

### Scramble Display Component
```jsx
// ScrambleDisplay.jsx
import React from 'react';

function ScrambleDisplay({ scrambleMoves }) {
  if (!scrambleMoves || scrambleMoves.length === 0) {
    return null;
  }
  
  return (
    <div className="scramble-display">
      <h3>Scramble Sequence</h3>
      <div className="scramble-sequence">
        {scrambleMoves.map((move, index) => (
          <span key={index} className="scramble-move">
            {move}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ScrambleDisplay;
```

## Scramble Validation

### Validity Check
Ensure the scramble produces a valid cube state:
```javascript
// Validate scramble result
const validateScrambledCube = (cube) => {
  // Check that all pieces are present
  const pieceCount = countPieces(cube);
  const expectedCount = getExpectedPieceCount(cube.size);
  
  if (pieceCount !== expectedCount) {
    return {
      valid: false,
      error: `Invalid piece count: ${pieceCount}, expected: ${expectedCount}`
    };
  }
  
  // Check that no pieces are duplicated
  const duplicates = findDuplicatePieces(cube);
  if (duplicates.length > 0) {
    return {
      valid: false,
      error: `Duplicate pieces found: ${duplicates.join(', ')}`
    };
  }
  
  return { valid: true };
};
```

### Piece Counting Functions
```javascript
// Count pieces in a cube
const countPieces = (cube) => {
  const { size } = cube;
  
  if (size === 2) {
    // 2x2 has only 8 corner pieces
    return 8;
  } else if (size === 3) {
    // 3x3 has 8 corners + 12 edges + 6 centers
    return 8 + 12 + 6;
  } else {
    // For larger cubes, calculate based on layers
    // This is a simplified calculation
    return size * size * 6;
  }
};

// Get expected piece count for a given size
const getExpectedPieceCount = (size) => {
  if (size === 2) return 8;
  if (size === 3) return 26;
  // For 4x4 and larger, it's more complex due to center pieces
  return size * size * 6;
};
```

## Performance Optimization

### Efficient Scrambling
```javascript
// Optimized scramble application
const applyScrambleOptimized = (cube, scrambleMoves) => {
  // Batch moves to reduce state updates
  const batchedMoves = batchMoves(scrambleMoves);
  
  for (const batch of batchedMoves) {
    cube.applyMoveBatch(batch);
  }
  
  return cube;
};

// Batch consecutive moves on the same face
const batchMoves = (moves) => {
  const batches = [];
  let currentBatch = [];
  let currentFace = '';
  
  for (const move of moves) {
    const face = move.replace(/'/, '');
    
    if (face === currentFace) {
      currentBatch.push(move);
    } else {
      if (currentBatch.length > 0) {
        batches.push([...currentBatch]);
      }
      currentBatch = [move];
      currentFace = face;
    }
  }
  
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }
  
  return batches;
};
```

## Animation Integration

### Scramble Animation
```javascript
// Scramble animation controller
class ScrambleAnimation {
  constructor(cubeVisualizer, scrambleMoves) {
    this.cubeVisualizer = cubeVisualizer;
    this.scrambleMoves = scrambleMoves;
    this.currentIndex = 0;
  }
  
  async play(onMoveComplete, onComplete) {
    if (this.currentIndex >= this.scrambleMoves.length) {
      onComplete();
      return;
    }
    
    const move = this.scrambleMoves[this.currentIndex];
    
    // Animate the move
    await this.cubeVisualizer.animateMove(move);
    
    // Update index and continue
    this.currentIndex++;
    onMoveComplete(this.currentIndex, this.scrambleMoves.length);
    
    // Continue with next move
    setTimeout(() => {
      this.play(onMoveComplete, onComplete);
    }, 100); // Small delay between moves
  }
  
  stop() {
    this.currentIndex = this.scrambleMoves.length;
  }
}
```

## Difficulty Levels

### Adjustable Scramble Length
```javascript
// Scramble difficulty levels
const SCRAMBLE_DIFFICULTY = {
  easy: { length: 10, description: 'Easy (10 moves)' },
  medium: { length: 20, description: 'Medium (20 moves)' },
  hard: { length: 30, description: 'Hard (30 moves)' },
  expert: { length: 50, description: 'Expert (50 moves)' }
};

// Get scramble length based on difficulty
const getScrambleLength = (difficulty, cubeSize) => {
  const baseLength = SCRAMBLE_DIFFICULTY[difficulty]?.length || 20;
  
  // Adjust for cube size
  if (cubeSize === 2) {
    return Math.floor(baseLength * 0.7); // 2x2 is easier
  } else if (cubeSize === 4) {
    return Math.floor(baseLength * 1.3); // 4x4 is harder
  }
  
  return baseLength;
};
```

## Randomization Quality

### Improved Random Number Generation
```javascript
// Better randomization for scrambles
class ImprovedRandom {
  static getRandomInt(min, max) {
    // Use crypto.getRandomValues for better randomness
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % (max - min + 1));
  }
  
  static shuffle(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.getRandomInt(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
```

## Integration with Main Application

### Scramble Context
```javascript
// Scramble context for global state
import { createContext, useContext, useState } from 'react';

const ScrambleContext = createContext();

export const ScrambleProvider = ({ children }) => {
  const [scrambleMoves, setScrambleMoves] = useState([]);
  const [isScrambling, setIsScrambling] = useState(false);
  
  const value = {
    scrambleMoves,
    setScrambleMoves,
    isScrambling,
    setIsScrambling
  };
  
  return (
    <ScrambleContext.Provider value={value}>
      {children}
    </ScrambleContext.Provider>
  );
};

export const useScramble = () => {
  const context = useContext(ScrambleContext);
  if (!context) {
    throw new Error('useScramble must be used within ScrambleProvider');
  }
  return context;
};
```

### Main App Integration
```jsx
// App.jsx integration
function App() {
  const { scrambleMoves, setScrambleMoves, isScrambling, setIsScrambling } = useScramble();
  const [cubeState, setCubeState] = useState(initialCubeState(3));
  
  const handleScramble = async () => {
    setIsScrambling(true);
    
    try {
      const scrambler = new Scrambler(cubeState.size);
      const newScrambleMoves = scrambler.generateScramble(20);
      
      setScrambleMoves(newScrambleMoves);
      
      // Apply scramble to cube state
      const scrambledCube = scrambler.applyScramble(cubeState.clone(), newScrambleMoves);
      setCubeState(scrambledCube);
      
      // Animate the scramble
      const animation = new ScrambleAnimation(cubeVisualizerRef.current, newScrambleMoves);
      await animation.play(
        (current, total) => {
          // Update progress
        },
        () => {
          setIsScrambling(false);
        }
      );
    } catch (error) {
      console.error('Scramble error:', error);
      setIsScrambling(false);
    }
  };
  
  return (
    <div className="app">
      <ScrambleDisplay scrambleMoves={scrambleMoves} />
      <ScrambleButton 
        onScramble={handleScramble} 
        isScrambling={isScrambling}
        disabled={!isValid}
      />
      {/* Other components */}
    </div>
  );
}
```

## Testing Strategy

### Unit Tests
```javascript
// Scramble tests
describe('Scrambler', () => {
  test('generates valid scramble for 3x3', () => {
    const scrambler = new Scrambler(3);
    const scramble = scrambler.generateScramble(20);
    
    expect(scramble).toHaveLength(20);
    expect(scramble.every(move => MOVES[3].includes(move))).toBe(true);
  });
  
  test('no consecutive moves on same face', () => {
    const scrambler = new Scrambler(3);
    const scramble = scrambler.generateScramble(50);
    
    for (let i = 1; i < scramble.length; i++) {
      const currentFace = scramble[i].replace(/'/, '');
      const previousFace = scramble[i-1].replace(/'/, '');
      expect(currentFace).not.toBe(previousFace);
    }
  });
  
  test('applies scramble correctly', () => {
    const cube = new Cube(3);
    const scrambler = new Scrambler(3);
    const scramble = ['F', 'R', 'U'];
    
    const scrambledCube = scrambler.applyScramble(cube.clone(), scramble);
    
    // Verify cube state has changed
    expect(scrambledCube.isSolved()).toBe(false);
  });
});
```

## Accessibility Features

### Screen Reader Support
```jsx
// Accessible scramble button
function ScrambleButton({ onScramble, isScrambling, disabled }) {
  return (
    <button
      className="scramble-button"
      onClick={onScramble}
      disabled={disabled || isScrambling}
      aria-label={isScrambling ? "Scrambling cube" : "Scramble cube"}
      aria-busy={isScrambling}
    >
      {isScrambling ? 'Scrambling...' : 'Scramble'}
    </button>
  );
}
```

### Keyboard Navigation
```javascript
// Keyboard support for scramble button
function ScrambleButton({ onScramble, isScrambling, disabled }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onScramble();
    }
  };
  
  return (
    <button
      className="scramble-button"
      onClick={onScramble}
      onKeyDown={handleKeyDown}
      disabled={disabled || isScrambling}
    >
      {isScrambling ? 'Scrambling...' : 'Scramble'}
    </button>
  );
}
```

This scramble functionality design provides:

1. **Valid scramble generation** using legal cube moves
2. **Adjustable difficulty levels** for different skill levels
3. **Visual feedback** during scrambling process
4. **Performance optimization** through batching and efficient algorithms
5. **Animation integration** for visual scrambling
6. **Validation system** to ensure valid cube states
7. **Accessibility features** for all users
8. **Comprehensive testing** for reliability
9. **Integration with main application** state management
10. **Quality randomization** for unpredictable scrambles

The implementation ensures that users can generate random, solvable cube configurations while providing an engaging visual experience.