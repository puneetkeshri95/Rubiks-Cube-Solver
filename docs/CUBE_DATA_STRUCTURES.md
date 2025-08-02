# Cube Data Structures Design

## Overview
This document describes the data structures used to represent different sized Rubik's cubes (2x2, 3x3, 4x4) and how they will be manipulated.

## Cube Representation

### Face-Based Representation
Each cube face will be represented as a 2D array where each element represents a sticker color.

For a 3x3 cube:
```
Face 0 (Front):
[
  ['W', 'W', 'W'],
  ['W', 'W', 'W'],
  ['W', 'W', 'W']
]

Colors:
- W: White
- Y: Yellow
- G: Green
- B: Blue
- R: Red
- O: Orange
```

### Cube Class Structure

```javascript
class Cube {
  constructor(size) {
    this.size = size; // 2, 3, or 4
    this.faces = {
      U: [], // Up face
      D: [], // Down face
      L: [], // Left face
      R: [], // Right face
      F: [], // Front face
      B: []; // Back face
    };
    this.colors = {
      U: 'W', // Up face color (White)
      D: 'Y', // Down face color (Yellow)
      L: 'G', // Left face color (Green)
      R: 'B', // Right face color (Blue)
      F: 'R', // Front face color (Red)
      B: 'O'  // Back face color (Orange)
    };
    this.initialize();
  }

  initialize() {
    // Initialize all faces with their respective colors
    for (const face in this.faces) {
      this.faces[face] = Array(this.size).fill().map(() => 
        Array(this.size).fill(this.colors[face])
      );
    }
  }

  // Rotation methods
  rotateFace(face, clockwise = true) {
    // Implementation depends on cube size
  }

  // Move methods (e.g., F, R, U, etc.)
  move(moveName) {
    // Implementation depends on cube size
  }

  // Check if cube is solved
  isSolved() {
    for (const face in this.faces) {
      const color = this.faces[face][0][0];
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          if (this.faces[face][i][j] !== color) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
```

## Rotation Logic

### 3x3 Cube Rotations
For a basic 3x3 cube, we need to implement the standard rotations:
- F, F' (Front face clockwise and counter-clockwise)
- R, R' (Right face)
- U, U' (Up face)
- B, B' (Back face)
- L, L' (Left face)
- D, D' (Down face)

Each rotation affects:
1. The face being rotated (rotates the 2D matrix)
2. The adjacent faces (exchange stickers)

### 2x2 and 4x4 Adaptations
The same rotation principles apply, but with different sized matrices:
- 2x2: Only corner pieces, simpler rotations
- 4x4: Additional layers, more complex rotations with potential parity issues

## State Management

### Move History
To support step-by-step solving visualization:
```javascript
this.moveHistory = []; // Array of moves to solve the cube
```

### Scramble Generation
```javascript
this.scrambleMoves = []; // Array of moves used to scramble the cube
```

## Visualization Data

For Three.js integration, we'll need to convert the face-based representation to a format suitable for 3D rendering:
```javascript
get3DRepresentation() {
  // Convert face arrays to 3D positions for rendering
  // Returns array of sticker objects with position and color
}
```

## Scalability Considerations

### Generic Implementation
The Cube class will be designed to handle different sizes by:
1. Using the `size` parameter to determine matrix dimensions
2. Implementing rotation logic that works for any size
3. Adapting solving algorithms to work with different piece types

### Piece Types
- 2x2: Only corner pieces
- 3x3: Corner, edge, and center pieces
- 4x4: Corner, edge (multiple types), and center pieces

This design allows for a unified approach to cube manipulation while accommodating the differences between cube sizes.