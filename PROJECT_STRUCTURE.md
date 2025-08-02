# Rubik's Cube Solver Project Structure

## Directory Structure
```
src/
├── components/
│   ├── CubeVisualizer.jsx          # 3D cube visualization component
│   ├── FlatCubeNet.jsx             # Flat unfolded cube for coloring
│   ├── ColorPalette.jsx            # Color selection palette
│   ├── Controls.jsx                # UI controls (scramble, solve, etc.)
│   └── CubeSelector.jsx            # Component for selecting cube size
├── logic/
│   ├── Cube.js                     # Core cube data structure and operations
│   ├── Solver.js                   # Solving algorithms
│   ├── RotationLogic.js            # Cube rotation implementations
│   └── Scrambler.js                # Scramble generation logic
├── animations/
│   ├── FoldingAnimation.js         # Animation for folding flat net to 3D
│   └── SolvingAnimation.js         # Step-by-step solving animations
├── utils/
│   ├── constants.js                # Color constants, rotation names, etc.
│   └── helpers.js                  # Utility functions
├── styles/
│   └── main.css                    # Global styles
├── App.jsx                         # Main application component
└── main.jsx                        # Entry point
```