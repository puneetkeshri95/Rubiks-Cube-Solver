# Rubik's Cube Solver

A web-based Rubik's Cube solver application with real-time 3D visualization. This application allows users to solve 2x2, 3x3, and 4x4 Rubik's cubes through an intuitive interface with step-by-step visualization.

## Advanced Solving Algorithms

This application implements several advanced solving algorithms:

### 1. Kociemba's Two-Phase Algorithm
- Optimal solver that guarantees solutions in 18-22 moves
- Uses coordinate representation and pruning tables
- Most efficient algorithm for minimal move count

### 2. Thistlethwaite's Algorithm
- Mathematical approach that solves through subgroups
- Guaranteed to solve in 52 moves or less
- Educational approach showing algorithmic thinking

### 3. Layer-by-Layer Approach (F2L, OLL, PLL)
- First Two Layers (F2L) solving
- Orient Last Layer (OLL) algorithms
- Permute Last Layer (PLL) algorithms
- Intuitive approach for learning

## Project Structure

src/
├── components/          # React components
│   ├── CubeSelector.jsx     # Cube size selection
│   ├── FlatCubeNet.jsx      # Unfolded cube view
│   ├── ColorPalette.jsx     # Color selection
│   ├── Controls.jsx         # UI controls
│   ├── CubeVisualizer.jsx   # 3D visualization
│   └── SolutionDisplay.jsx  # Solution steps display
├── logic/               # Core logic
│   ├── Cube.js          # Cube data structure and operations
│   ├── Solver.js        # Solving algorithms (Kociemba, Thistlethwaite, F2L/OLL/PLL)
│   └── Scrambler.js     # Scramble generation
├── App.jsx              # Main application component
├── main.jsx             # Entry point
├── App.css              # Main styles
└── index.css            # Global styles

