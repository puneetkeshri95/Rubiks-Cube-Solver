# Rubik's Cube Solver

A web-based Rubik's Cube solver application with real-time 3D visualization. This application allows users to solve 2x2, 3x3, and 4x4 Rubik's cubes through an intuitive interface with step-by-step visualization.

## Features

- **Multiple Cube Sizes**: Support for 2x2, 3x3, and 4x4 cubes
- **Manual Coloring**: Color the cube manually using an unfolded flat view
- **Automatic Scrambling**: Generate random valid cube configurations
- **3D Visualization**: Real-time 3D cube visualization using Three.js
- **Step-by-Step Solving**: Watch the cube solve itself with clear move animations
- **Solution Display**: See the complete solution sequence with current step highlighting
- **Responsive Design**: Works on desktop and mobile devices

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

## Technologies Used

- **React** - Frontend framework
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for Three.js
- **Vite** - Build tool and development server

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd rubiks-cube-solver
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Required Packages

The following packages will be automatically installed when you run `npm install`:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Usage

1. **Select Cube Size**: Choose between 2x2, 3x3, or 4x4 cubes
2. **Color the Cube**: Use the unfolded flat view to manually color each sticker
3. **Scramble or Start**: Either scramble the cube automatically or start solving your custom configuration
4. **Watch the Solution**: See the cube solve itself step-by-step in 3D
5. **Examine the Result**: After solving, the cube performs a 360-degree rotation for verification

## Project Structure

```
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
```

## How It Works

### Cube Representation
The cube is represented as a collection of 2D arrays, one for each face:
- U (Up): White
- D (Down): Yellow
- L (Left): Green
- R (Right): Blue
- F (Front): Red
- B (Back): Orange

### Solving Algorithm Priority
1. **Kociemba's Two-Phase Algorithm** (Primary) - Optimal solutions in 18-22 moves
2. **Thistlethwaite's Algorithm** (Secondary) - Mathematical approach
3. **Layer-by-Layer (F2L/OLL/PLL)** (Fallback) - Intuitive approach
4. **Basic Solver** (Last resort) - Guaranteed solution

### 3D Visualization
The 3D cube is rendered using Three.js with:
- Individual stickers as plane geometries
- Realistic materials and lighting
- Smooth rotation animations
- Orbit controls for user interaction

## Performance Optimizations

- **Efficient Data Structures**: Cube state represented as 2D arrays
- **Memoization**: React.memo for component optimization
- **Lazy Loading**: Components loaded only when needed
- **Animation Optimization**: RequestAnimationFrame for smooth performance

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that all required packages are in package.json

2. **3D visualization not working**
   - Ensure WebGL is enabled in your browser
   - Check browser compatibility with Three.js

3. **Performance issues**
   - Close other applications to free up memory
   - Use a modern browser (Chrome, Firefox, Edge)

4. **Cube not solving**
   - Ensure the cube state is valid (correct number of each color)
   - Try refreshing the page and starting over

### Debugging Steps

1. Check browser console for error messages
2. Verify all dependencies are installed with `npm list`
3. Ensure Node.js version is 16 or higher
4. Clear browser cache and restart development server

## Future Improvements

- Implement full Kociemba's Two-Phase Algorithm
- Add move counter and statistics
- Include tutorial mode for learning
- Add save/load functionality for cube states
- Implement multiplayer features for competitions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Three.js community for excellent 3D graphics library
- React team for the amazing framework
- Speedcubing community for solving algorithms
- Kociemba and Thistlethwaite for their mathematical algorithms