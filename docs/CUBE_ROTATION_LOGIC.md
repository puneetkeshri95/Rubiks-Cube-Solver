# Cube Rotation Logic Design

## Overview
This document describes the implementation of rotation logic for 2x2, 3x3, and 4x4 Rubik's cubes. The rotation logic must handle:
1. Rotating the face itself (90° clockwise or counter-clockwise)
2. Moving stickers on adjacent faces

## Basic Rotation Principles

### Face Rotation (90° Clockwise)
For any NxN face matrix, a 90° clockwise rotation follows this pattern:
```
New[i][j] = Old[size-1-j][i]
```

### Face Rotation (90° Counter-clockwise)
```
New[i][j] = Old[j][size-1-i]
```

## 3x3 Cube Rotations

### Front Face Rotation (F)
When rotating the front face clockwise:
1. The front face matrix rotates 90° clockwise
2. Adjacent faces exchange stickers:
   - Up face bottom row ↔ Left face right column (reversed)
   - Left face right column ↔ Down face top row
   - Down face top row ↔ Right face left column (reversed)
   - Right face left column ↔ Up face bottom row

### Implementation Example
```javascript
// F rotation (front face clockwise)
F() {
  // Rotate front face
  this.rotateFaceClockwise('F');
  
  // Store affected rows/columns temporarily
  const upBottom = [...this.faces.U[2]];
  const leftRight = [this.faces.L[0][2], this.faces.L[1][2], this.faces.L[2][2]];
  const downTop = [...this.faces.D[0]];
  const rightLeft = [this.faces.R[0][0], this.faces.R[1][0], this.faces.R[2][0]];
  
  // Move stickers
  // Up bottom row -> Right left column (top to bottom)
  this.faces.R[0][0] = upBottom[0];
  this.faces.R[1][0] = upBottom[1];
  this.faces.R[2][0] = upBottom[2];
  
  // Right left column -> Down top row
  this.faces.D[0] = rightLeft.reverse();
  
  // Down top row -> Left right column (bottom to top)
  this.faces.L[0][2] = downTop[2];
  this.faces.L[1][2] = downTop[1];
  this.faces.L[2][2] = downTop[0];
  
  // Left right column -> Up bottom row
  this.faces.U[2] = leftRight;
}
```

## 2x2 Cube Rotations

### Simplified Implementation
For a 2x2 cube, only corner pieces exist, so rotations are simpler:

```javascript
// F rotation for 2x2 cube
F() {
  // Rotate front face
  this.rotateFaceClockwise('F');
  
  // Store affected rows/columns
  const upBottom = [...this.faces.U[1]];
  const leftRight = [this.faces.L[0][1], this.faces.L[1][1]];
  const downTop = [...this.faces.D[0]];
  const rightLeft = [this.faces.R[0][0], this.faces.R[1][0]];
  
  // Move stickers
  this.faces.R[0][0] = upBottom[0];
  this.faces.R[1][0] = upBottom[1];
  
  this.faces.D[0] = [rightLeft[1], rightLeft[0]];
  
  this.faces.L[0][1] = downTop[1];
  this.faces.L[1][1] = downTop[0];
  
  this.faces.U[1] = leftRight;
}
```

## 4x4 Cube Rotations

### Additional Complexity
4x4 cubes have:
- 4 layers instead of 3
- No fixed center pieces
- Potential parity issues

### Layer-based Rotations
For 4x4 cubes, we need to handle rotations of:
1. Outer layers (like 3x3)
2. Inner layers
3. Combined rotations (both outer and inner)

```javascript
// F rotation for 4x4 cube (outer layer)
F() {
  // Rotate front face
  this.rotateFaceClockwise('F');
  
  // Store affected rows/columns (outer layer)
  const upBottom = [...this.faces.U[3]];
  const leftRight = [
    this.faces.L[0][3], 
    this.faces.L[1][3], 
    this.faces.L[2][3], 
    this.faces.L[3][3]
  ];
  const downTop = [...this.faces.D[0]];
  const rightLeft = [
    this.faces.R[0][0], 
    this.faces.R[1][0], 
    this.faces.R[2][0], 
    this.faces.R[3][0]
  ];
  
  // Move stickers
  this.faces.R[0][0] = upBottom[0];
  this.faces.R[1][0] = upBottom[1];
  this.faces.R[2][0] = upBottom[2];
  this.faces.R[3][0] = upBottom[3];
  
  this.faces.D[0] = rightLeft.reverse();
  
  this.faces.L[0][3] = downTop[3];
  this.faces.L[1][3] = downTop[2];
  this.faces.L[2][3] = downTop[1];
  this.faces.L[3][3] = downTop[0];
  
  this.faces.U[3] = leftRight;
}
```

## Generic Rotation Implementation

To handle all cube sizes with a single implementation:

```javascript
class Cube {
  // ... constructor and other methods
  
  rotateFaceClockwise(face) {
    const size = this.size;
    const faceMatrix = this.faces[face];
    const newMatrix = Array(size).fill().map(() => Array(size));
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        newMatrix[j][size - 1 - i] = faceMatrix[i][j];
      }
    }
    
    this.faces[face] = newMatrix;
  }
  
  rotateFaceCounterClockwise(face) {
    const size = this.size;
    const faceMatrix = this.faces[face];
    const newMatrix = Array(size).fill().map(() => Array(size));
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        newMatrix[size - 1 - j][i] = faceMatrix[i][j];
      }
    }
    
    this.faces[face] = newMatrix;
  }
  
  // Generic move implementation
  move(moveName) {
    const size = this.size;
    const isPrime = moveName.includes("'");
    const face = moveName.replace("'", "");
    
    // Handle different face rotations
    switch (face) {
      case 'F': // Front face
        if (isPrime) {
          this.rotateFaceCounterClockwise('F');
        } else {
          this.rotateFaceClockwise('F');
        }
        this.moveFFaceStickers(isPrime);
        break;
      // ... other faces (U, D, L, R, B)
    }
  }
  
  moveFFaceStickers(isPrime) {
    const size = this.size;
    if (isPrime) {
      // Counter-clockwise movement
      // Implementation for moving stickers counter-clockwise
    } else {
      // Clockwise movement
      // Implementation for moving stickers clockwise
    }
  }
}
```

## Performance Considerations

1. **Precomputed Adjacency Maps**: Create maps that define which rows/columns of adjacent faces are affected by each rotation to avoid repetitive calculations.

2. **Immutable Operations**: For animation purposes, consider creating new cube states rather than modifying existing ones.

3. **Batch Operations**: For scramble generation, allow batch processing of multiple moves to reduce overhead.

## Visualization Integration

The rotation logic will be used by both:
1. The solving algorithm to find solutions
2. The visualization system to animate moves

Each rotation must:
1. Update the internal cube state
2. Generate appropriate events/notifications for the visualization system
3. Maintain move history for step-by-step replay

## Testing Strategy

1. **Unit Tests**: Test each rotation independently for all cube sizes
2. **Integration Tests**: Test sequences of moves to ensure consistency
3. **Validation Tests**: Verify that 4 random rotations return the cube to solved state
4. **Performance Tests**: Measure rotation speed for different cube sizes

This design ensures that the rotation logic is:
- Consistent across cube sizes
- Efficient in execution
- Compatible with both solving algorithms and visualization
- Extensible for future enhancements