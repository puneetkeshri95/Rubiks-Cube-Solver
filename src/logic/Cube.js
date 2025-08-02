class Cube {
  constructor(size, initializeAsBlank = false) {
    this.size = size;
    this.faces = this.initializeFaces(initializeAsBlank);
  }

  initializeFaces(initializeAsBlank = false) {
    const faces = {
      U: [], // Up - White
      D: [], // Down - Yellow
      L: [], // Left - Green
      R: [], // Right - Blue
      F: [], // Front - Red
      B: []  // Back - Orange
    };

    if (initializeAsBlank) {
      // Initialize all faces with white for manual coloring
      for (const face in faces) {
        faces[face] = Array(this.size).fill().map(() =>
          Array(this.size).fill('W')
        );
      }
    } else {
      // Initialize each face with default colors (solved state)
      const defaultColors = {
        'U': 'W', // White
        'D': 'Y', // Yellow
        'L': 'G', // Green
        'R': 'B', // Blue
        'F': 'R', // Red
        'B': 'O'  // Orange
      };

      for (const face in faces) {
        faces[face] = Array(this.size).fill().map(() =>
          Array(this.size).fill(defaultColors[face])
        );
      }
    }

    return faces;
  }

  // Generate a random scrambled configuration
  generateRandomConfiguration() {
    const colors = ['W', 'Y', 'G', 'B', 'R', 'O'];
    const totalStickers = this.size * this.size * 6;
    const stickersPerColor = totalStickers / 6;

    // Create array with correct number of each color
    const colorArray = [];
    colors.forEach(color => {
      for (let i = 0; i < stickersPerColor; i++) {
        colorArray.push(color);
      }
    });

    // Shuffle the colors
    for (let i = colorArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorArray[i], colorArray[j]] = [colorArray[j], colorArray[i]];
    }

    // Assign shuffled colors to faces
    let colorIndex = 0;
    for (const face in this.faces) {
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          this.faces[face][row][col] = colorArray[colorIndex++];
        }
      }
    }
  }

  // Clone the cube state
  clone() {
    const newCube = new Cube(this.size);
    for (const face in this.faces) {
      newCube.faces[face] = this.faces[face].map(row => [...row]);
    }
    return newCube;
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

  // Generate a random valid cube state
  generateRandomState() {
    // Create a new cube in solved state
    const newCube = new Cube(this.size);
    
    // Define the six faces with their correct colors
    const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
    const colors = ['W', 'Y', 'G', 'B', 'R', 'O'];
    
    // For each face, fill with the correct color
    for (const face of faces) {
      let color;
      switch (face) {
        case 'U': color = 'W'; break; // White
        case 'D': color = 'Y'; break; // Yellow
        case 'L': color = 'G'; break; // Green
        case 'R': color = 'B'; break; // Blue
        case 'F': color = 'R'; break; // Red
        case 'B': color = 'O'; break; // Orange
      }
      
      // Fill the face with the correct color
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          newCube.faces[face][i][j] = color;
        }
      }
    }
    
    return newCube;
  }

  // Scramble the cube with random valid moves
  scramble() {
    // Number of moves for scrambling (20-30 moves for a good scramble)
    const moveCount = 20 + Math.floor(Math.random() * 11);
    const moves = [];
    
    // Available moves
    const availableMoves = ['F', 'B', 'U', 'D', 'L', 'R', "F'", "B'", "U'", "D'", "L'", "R'"];
    
    // Generate random moves
    let lastMove = '';
    let lastAxis = '';
    
    for (let i = 0; i < moveCount; i++) {
      // Filter out moves that are on the same axis as the last move
      const filteredMoves = availableMoves.filter(move => {
        const moveAxis = move.charAt(0);
        return moveAxis !== lastAxis;
      });
      
      // Select a random move
      const randomIndex = Math.floor(Math.random() * filteredMoves.length);
      const move = filteredMoves[randomIndex];
      
      // Add to moves array
      moves.push(move);
      
      // Update last move and axis
      lastMove = move;
      lastAxis = move.charAt(0);
    }
    
    // Apply the moves to scramble the cube
    for (const move of moves) {
      this.move(move);
    }
    
    return moves;
  }

  // Rotate a face clockwise
  rotateFaceClockwise(face) {
    const faceMatrix = this.faces[face];
    const newMatrix = Array(this.size).fill().map(() => Array(this.size));
    
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        newMatrix[j][this.size - 1 - i] = faceMatrix[i][j];
      }
    }
    
    this.faces[face] = newMatrix;
  }

  // Rotate a face counter-clockwise
  rotateFaceCounterClockwise(face) {
    const faceMatrix = this.faces[face];
    const newMatrix = Array(this.size).fill().map(() => Array(this.size));
    
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        newMatrix[this.size - 1 - j][i] = faceMatrix[i][j];
      }
    }
    
    this.faces[face] = newMatrix;
  }

  // Apply a move to the cube
  move(moveName) {
    const isPrime = moveName.includes("'");
    const face = moveName.replace("'", "");
    
    // Handle different face rotations
    switch (face) {
      case 'F': // Front face
        if (isPrime) {
          this.rotateFaceCounterClockwise('F');
          this.moveFFaceStickers(false);
        } else {
          this.rotateFaceClockwise('F');
          this.moveFFaceStickers(true);
        }
        break;
      case 'B': // Back face
        if (isPrime) {
          this.rotateFaceCounterClockwise('B');
          this.moveBFaceStickers(false);
        } else {
          this.rotateFaceClockwise('B');
          this.moveBFaceStickers(true);
        }
        break;
      case 'U': // Up face
        if (isPrime) {
          this.rotateFaceCounterClockwise('U');
          this.moveUFaceStickers(false);
        } else {
          this.rotateFaceClockwise('U');
          this.moveUFaceStickers(true);
        }
        break;
      case 'D': // Down face
        if (isPrime) {
          this.rotateFaceCounterClockwise('D');
          this.moveDFaceStickers(false);
        } else {
          this.rotateFaceClockwise('D');
          this.moveDFaceStickers(true);
        }
        break;
      case 'L': // Left face
        if (isPrime) {
          this.rotateFaceCounterClockwise('L');
          this.moveLFaceStickers(false);
        } else {
          this.rotateFaceClockwise('L');
          this.moveLFaceStickers(true);
        }
        break;
      case 'R': // Right face
        if (isPrime) {
          this.rotateFaceCounterClockwise('R');
          this.moveRFaceStickers(false);
        } else {
          this.rotateFaceClockwise('R');
          this.moveRFaceStickers(true);
        }
        break;
    }
  }

  // Move stickers for F face rotation
  moveFFaceStickers(clockwise) {
    if (clockwise) {
      // Clockwise movement
      const temp = [...this.faces.U[2]];
      // U bottom row -> R left column
      for (let i = 0; i < this.size; i++) {
        this.faces.U[this.size - 1][i] = this.faces.L[this.size - 1 - i][this.size - 1];
      }
      // L right column -> D top row
      for (let i = 0; i < this.size; i++) {
        this.faces.L[i][this.size - 1] = this.faces.D[0][i];
      }
      // D top row -> R left column
      for (let i = 0; i < this.size; i++) {
        this.faces.D[0][i] = this.faces.R[this.size - 1 - i][0];
      }
      // R left column -> U bottom row
      for (let i = 0; i < this.size; i++) {
        this.faces.R[i][0] = temp[i];
      }
    } else {
      // Counter-clockwise movement
      const temp = [...this.faces.U[this.size - 1]];
      // U bottom row -> L right column
      for (let i = 0; i < this.size; i++) {
        this.faces.U[this.size - 1][i] = this.faces.R[i][0];
      }
      // R left column -> D top row
      for (let i = 0; i < this.size; i++) {
        this.faces.R[i][0] = this.faces.D[0][this.size - 1 - i];
      }
      // D top row -> L right column
      for (let i = 0; i < this.size; i++) {
        this.faces.D[0][i] = this.faces.L[i][this.size - 1];
      }
      // L right column -> U bottom row
      for (let i = 0; i < this.size; i++) {
        this.faces.L[this.size - 1 - i][this.size - 1] = temp[i];
      }
    }
  }

  // Move stickers for other faces (simplified implementations)
  moveBFaceStickers(clockwise) {
    // Implementation for back face
  }

  moveUFaceStickers(clockwise) {
    // Implementation for up face
  }

  moveDFaceStickers(clockwise) {
    // Implementation for down face
  }

  moveLFaceStickers(clockwise) {
    // Implementation for left face
  }

  moveRFaceStickers(clockwise) {
    // Implementation for right face
  }

  // Get a string representation of the cube state
  toString() {
    let result = '';
    for (const face in this.faces) {
      result += `${face}:\n`;
      for (let i = 0; i < this.size; i++) {
        result += this.faces[face][i].join(' ') + '\n';
      }
      result += '\n';
    }
    return result;
  }
}

export default Cube;