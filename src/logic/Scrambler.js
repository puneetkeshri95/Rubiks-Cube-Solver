class Scrambler {
  constructor(cubeSize) {
    this.cubeSize = cubeSize;
    this.moves = this.getMovesForSize(cubeSize);
  }

  // Get available moves for a specific cube size
  getMovesForSize(size) {
    if (size === 2) {
      return ['F', 'F\'', 'R', 'R\'', 'U', 'U\''];
    } else if (size === 3) {
      return ['F', 'F\'', 'R', 'R\'', 'U', 'U\'', 'B', 'B\'', 'L', 'L\'', 'D', 'D\''];
    } else {
      // For 4x4 and larger, include slice moves
      return ['F', 'F\'', 'R', 'R\'', 'U', 'U\'', 'B', 'B\'', 'L', 'L\'', 'D', 'D\'', 
              'f', 'f\'', 'r', 'r\'', 'u', 'u\'', 'b', 'b\'', 'l', 'l\'', 'd', 'd\''];
    }
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

  // Generate a scramble for a specific difficulty level
  generateScrambleByDifficulty(difficulty) {
    const lengths = {
      easy: 10,
      medium: 20,
      hard: 30,
      expert: 50
    };
    
    const length = lengths[difficulty] || 20;
    return this.generateScramble(length);
  }

  // Generate a scramble optimized for a specific cube size
  generateOptimizedScramble() {
    // For smaller cubes, use fewer moves
    // For larger cubes, use more moves
    const baseLength = this.cubeSize === 2 ? 10 : 
                      this.cubeSize === 3 ? 20 : 
                      this.cubeSize * 10;
                      
    return this.generateScramble(baseLength);
  }
}

export default Scrambler;