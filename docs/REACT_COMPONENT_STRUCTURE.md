# React Component Structure Design

## Overview
This document describes the React component structure for the Rubik's Cube Solver application. The application will be organized into reusable, maintainable components that handle specific aspects of the UI and functionality.

## Component Hierarchy

```
App.jsx
├── CubeSelector.jsx
├── FlatCubeNet.jsx
│   └── Sticker.jsx
├── ColorPalette.jsx
├── Controls.jsx
├── CubeVisualizer.jsx
│   ├── ThreeCube.jsx
│   ├── FoldingAnimation.jsx
│   └── SolvingAnimation.jsx
└── SolutionDisplay.jsx
```

## Component Descriptions

### 1. App.jsx (Root Component)
The main application component that manages global state and orchestrates the other components.

```jsx
// App.jsx
import React, { useState, useEffect } from 'react';
import CubeSelector from './components/CubeSelector';
import FlatCubeNet from './components/FlatCubeNet';
import ColorPalette from './components/ColorPalette';
import Controls from './components/Controls';
import CubeVisualizer from './components/CubeVisualizer';

function App() {
  const [cubeSize, setCubeSize] = useState(3); // Default to 3x3
  const [cubeState, setCubeState] = useState(null);
  const [coloringMode, setColoringMode] = useState(true);
  const [solution, setSolution] = useState([]);
  const [isSolving, setIsSolving] = useState(false);
  
  return (
    <div className="app">
      <header>
        <h1>Rubik's Cube Solver</h1>
      </header>
      
      <main>
        <div className="control-panel">
          <CubeSelector 
            selectedSize={cubeSize} 
            onSizeChange={setCubeSize} 
          />
          
          {coloringMode && (
            <>
              <FlatCubeNet 
                size={cubeSize}
                cubeState={cubeState}
                onStickerClick={handleStickerClick}
              />
              <ColorPalette 
                onColorSelect={handleColorSelect}
              />
            </>
          )}
          
          <Controls 
            coloringMode={coloringMode}
            onStart={handleStart}
            onScramble={handleScramble}
            onSolve={handleSolve}
            isSolving={isSolving}
          />
        </div>
        
        <div className="visualization-panel">
          <CubeVisualizer 
            cubeState={cubeState}
            solution={solution}
            isSolving={isSolving}
            onVisualizationComplete={handleVisualizationComplete}
          />
        </div>
      </main>
    </div>
  );
}
```

### 2. CubeSelector.jsx
Allows users to select the cube size (2x2, 3x3, 4x4).

```jsx
// CubeSelector.jsx
import React from 'react';

function CubeSelector({ selectedSize, onSizeChange }) {
  const sizes = [2, 3, 4];
  
  return (
    <div className="cube-selector">
      <h2>Select Cube Size</h2>
      <div className="size-options">
        {sizes.map(size => (
          <button
            key={size}
            className={selectedSize === size ? 'selected' : ''}
            onClick={() => onSizeChange(size)}
          >
            {size}x{size}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CubeSelector;
```

### 3. FlatCubeNet.jsx
Displays the unfolded cube for manual coloring.

```jsx
// FlatCubeNet.jsx
import React from 'react';
import Sticker from './Sticker';

function FlatCubeNet({ size, cubeState, onStickerClick }) {
  // Render the unfolded cube net based on size
  // Each face is represented as a grid of Sticker components
  
  return (
    <div className={`flat-cube-net size-${size}`}>
      {/* Render unfolded cube net with Sticker components */}
    </div>
  );
}

export default FlatCubeNet;
```

### 4. Sticker.jsx
Represents a single sticker on the cube face.

```jsx
// Sticker.jsx
import React from 'react';

function Sticker({ color, position, onClick }) {
  const colorClasses = {
    'W': 'white',
    'Y': 'yellow',
    'G': 'green',
    'B': 'blue',
    'R': 'red',
    'O': 'orange'
  };
  
  return (
    <div 
      className={`sticker ${colorClasses[color]}`}
      onClick={() => onClick(position)}
    />
  );
}

export default Sticker;
```

### 5. ColorPalette.jsx
Provides color selection for manual cube configuration.

```jsx
// ColorPalette.jsx
import React from 'react';

function ColorPalette({ onColorSelect }) {
  const colors = [
    { code: 'W', name: 'White' },
    { code: 'Y', name: 'Yellow' },
    { code: 'G', name: 'Green' },
    { code: 'B', name: 'Blue' },
    { code: 'R', name: 'Red' },
    { code: 'O', name: 'Orange' }
  ];
  
  return (
    <div className="color-palette">
      <h3>Select Color</h3>
      <div className="colors">
        {colors.map(color => (
          <button
            key={color.code}
            className={`color-button ${color.code.toLowerCase()}`}
            onClick={() => onColorSelect(color.code)}
            title={color.name}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ColorPalette;
```

### 6. Controls.jsx
Provides UI controls for scrambling, starting, and solving the cube.

```jsx
// Controls.jsx
import React from 'react';

function Controls({ coloringMode, onStart, onScramble, onSolve, isSolving }) {
  return (
    <div className="controls">
      {coloringMode ? (
        <button onClick={onStart} className="start-button">
          Start Solving
        </button>
      ) : (
        <>
          <button onClick={onScramble} disabled={isSolving}>
            Scramble
          </button>
          <button onClick={onSolve} disabled={isSolving}>
            Solve
          </button>
        </>
      )}
    </div>
  );
}

export default Controls;
```

### 7. CubeVisualizer.jsx
Manages the 3D visualization of the cube.

```jsx
// CubeVisualizer.jsx
import React from 'react';
import ThreeCube from './ThreeCube';
import FoldingAnimation from './FoldingAnimation';
import SolvingAnimation from './SolvingAnimation';

function CubeVisualizer({ cubeState, solution, isSolving, onVisualizationComplete }) {
  const [animationState, setAnimationState] = useState('flat'); // flat, folding, 3d, solving
  
  return (
    <div className="cube-visualizer">
      {animationState === 'flat' && (
        // Show flat representation
      )}
      
      {animationState === 'folding' && (
        <FoldingAnimation 
          onComplete={() => setAnimationState('3d')}
        />
      )}
      
      {animationState === '3d' && (
        <ThreeCube 
          cubeState={cubeState}
          isSolving={isSolving}
        />
      )}
      
      {animationState === 'solving' && (
        <SolvingAnimation 
          solution={solution}
          onComplete={onVisualizationComplete}
        />
      )}
    </div>
  );
}

export default CubeVisualizer;
```

### 8. ThreeCube.jsx
Renders the 3D cube using Three.js and @react-three/fiber.

```jsx
// ThreeCube.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function CubeModel({ cubeState }) {
  // Implementation of 3D cube rendering
  // Each sticker is represented as a mesh in 3D space
  
  return (
    // 3D cube representation using Three.js
  );
}

function ThreeCube({ cubeState, isSolving }) {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CubeModel cubeState={cubeState} />
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        autoRotate={!isSolving}
      />
    </Canvas>
  );
}

export default ThreeCube;
```

### 9. FoldingAnimation.jsx
Animates the transition from flat net to 3D cube.

```jsx
// FoldingAnimation.jsx
import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

function FoldingAnimation({ onComplete }) {
  // GSAP or React Spring animation for folding
  
  useEffect(() => {
    // Start folding animation
    // Call onComplete when finished
  }, []);
  
  return (
    <div className="folding-animation">
      {/* Animation elements */}
    </div>
  );
}

export default FoldingAnimation;
```

### 10. SolvingAnimation.jsx
Animates the step-by-step solving process.

```jsx
// SolvingAnimation.jsx
import React, { useEffect, useState } from 'react';

function SolvingAnimation({ solution, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    if (currentStep < solution.length) {
      // Execute current move animation
      // Move to next step after delay
    } else {
      onComplete();
    }
  }, [currentStep, solution]);
  
  return (
    <div className="solving-animation">
      <div className="step-counter">
        Step {currentStep + 1} of {solution.length}
      </div>
      <div className="current-move">
        Current move: {solution[currentStep]}
      </div>
    </div>
  );
}

export default SolvingAnimation;
```

## State Management

### Global State
The application will use React Context or a state management library like Redux for:
- Current cube size
- Cube state (colors on each sticker)
- Selected color for manual input
- Solution steps
- Animation state
- Solving progress

### Component State
Each component will manage its own local state for:
- UI interactions
- Animation progress
- User selections

## Styling Approach

### CSS Modules
Each component will have its own CSS module for scoped styling:
```
components/
├── CubeSelector.jsx
├── CubeSelector.module.css
├── FlatCubeNet.jsx
├── FlatCubeNet.module.css
└── ...
```

### Responsive Design
The application will be responsive and work on different screen sizes:
- Mobile: Stacked layout with controls above visualization
- Desktop: Side-by-side layout with controls on left, visualization on right

## Performance Considerations

### Memoization
Use React.memo for components that render frequently:
```jsx
const Sticker = React.memo(({ color, position, onClick }) => {
  // Component implementation
});
```

### Lazy Loading
Load heavy components (like Three.js) only when needed:
```jsx
const ThreeCube = React.lazy(() => import('./ThreeCube'));
```

### Animation Optimization
Use requestAnimationFrame for smooth animations and avoid unnecessary re-renders during animations.

## Accessibility

### Keyboard Navigation
Support keyboard navigation for all controls:
- Tab to navigate between controls
- Enter/space to activate buttons
- Arrow keys for color selection

### Screen Reader Support
Provide proper labels and ARIA attributes for screen readers.

## Testing Strategy

### Unit Tests
Test each component in isolation:
- Rendering with different props
- Event handling
- State changes

### Integration Tests
Test component interactions:
- Color selection updating flat cube
- Start button triggering folding animation
- Solve button executing solution

### End-to-End Tests
Test complete user flows:
- Select cube size → Color cube → Start → Solve
- Scramble cube → Solve

This component structure provides:
- Clear separation of concerns
- Reusable components
- Maintainable code organization
- Good performance characteristics
- Accessibility support
- Comprehensive testing coverage