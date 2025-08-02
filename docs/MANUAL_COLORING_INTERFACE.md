# Manual Coloring Interface Design

## Overview
This document describes the implementation of the manual coloring interface that allows users to input their cube configuration by coloring an unfolded cube net.

## Unfolded Cube Net Layout

### 3x3 Cube Net
The standard "cross" layout for a 3x3 cube:
```
    [ U ]
[ L ][ F ][ R ][ B ]
    [ D ]
```

### 2x2 Cube Net
Simplified layout for 2x2 cube:
```
[ U ]
[ L ][ F ][ R ]
[ D ]
```

### 4x4 Cube Net
Extended layout for 4x4 cube:
```
      [ U ]
[ L ][ F ][ R ][ B ]
      [ D ]
```

## Component Structure

### FlatCubeNet.jsx
```jsx
// FlatCubeNet.jsx
import React from 'react';
import CubeFace from './CubeFace';
import './FlatCubeNet.css';

function FlatCubeNet({ size, cubeState, selectedColor, onStickerClick }) {
  // Define face positions for unfolded net
  const faceLayout = getFaceLayout(size);
  
  return (
    <div className={`flat-cube-net size-${size}`}>
      {Object.entries(faceLayout).map(([face, position]) => (
        <div
          key={face}
          className="face-container"
          style={{
            gridRow: position.row,
            gridColumn: position.col
          }}
        >
          <CubeFace
            face={face}
            stickers={cubeState.faces[face]}
            size={size}
            selectedColor={selectedColor}
            onStickerClick={(row, col) => onStickerClick(face, row, col)}
          />
        </div>
      ))}
    </div>
  );
}

// Get layout positions based on cube size
function getFaceLayout(size) {
  if (size === 2) {
    return {
      'U': { row: 1, col: 2 },
      'L': { row: 2, col: 1 },
      'F': { row: 2, col: 2 },
      'R': { row: 2, col: 3 },
      'D': { row: 3, col: 2 }
    };
  } else if (size === 3) {
    return {
      'U': { row: 1, col: 2 },
      'L': { row: 2, col: 1 },
      'F': { row: 2, col: 2 },
      'R': { row: 2, col: 3 },
      'B': { row: 2, col: 4 },
      'D': { row: 3, col: 2 }
    };
  } else {
    // 4x4 and larger
    return {
      'U': { row: 1, col: 2 },
      'L': { row: 2, col: 1 },
      'F': { row: 2, col: 2 },
      'R': { row: 2, col: 3 },
      'B': { row: 2, col: 4 },
      'D': { row: 3, col: 2 }
    };
  }
}

export default FlatCubeNet;
```

### CubeFace.jsx
```jsx
// CubeFace.jsx
import React from 'react';
import Sticker from './Sticker';
import './CubeFace.css';

function CubeFace({ face, stickers, size, selectedColor, onStickerClick }) {
  const faceNames = {
    'U': 'Up',
    'D': 'Down',
    'L': 'Left',
    'R': 'Right',
    'F': 'Front',
    'B': 'Back'
  };
  
  return (
    <div className={`cube-face size-${size}`}>
      <div className="face-label">{faceNames[face]}</div>
      <div className="stickers-grid">
        {stickers.map((row, rowIndex) => (
          <div key={rowIndex} className="sticker-row">
            {row.map((color, colIndex) => (
              <Sticker
                key={`${rowIndex}-${colIndex}`}
                color={color}
                isSelected={selectedColor === color}
                onClick={() => onStickerClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CubeFace;
```

### Sticker.jsx
```jsx
// Sticker.jsx
import React from 'react';
import './Sticker.css';

function Sticker({ color, isSelected, onClick }) {
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
      className={`sticker ${colorClasses[color]} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {isSelected && <div className="selection-indicator" />}
    </div>
  );
}

export default Sticker;
```

### ColorPalette.jsx
```jsx
// ColorPalette.jsx
import React from 'react';
import './ColorPalette.css';

function ColorPalette({ selectedColor, onColorSelect }) {
  const colors = [
    { code: 'W', name: 'White', class: 'white' },
    { code: 'Y', name: 'Yellow', class: 'yellow' },
    { code: 'G', name: 'Green', class: 'green' },
    { code: 'B', name: 'Blue', class: 'blue' },
    { code: 'R', name: 'Red', class: 'red' },
    { code: 'O', name: 'Orange', class: 'orange' }
  ];
  
  return (
    <div className="color-palette">
      <h3>Select Color</h3>
      <div className="colors">
        {colors.map(color => (
          <button
            key={color.code}
            className={`color-button ${color.class} ${selectedColor === color.code ? 'active' : ''}`}
            onClick={() => onColorSelect(color.code)}
            title={color.name}
          >
            <span className="color-name">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ColorPalette;
```

## State Management

### Cube State Representation
```javascript
// Initial cube state
const initialCubeState = (size) => {
  const faces = {
    'U': [], // Up
    'D': [], // Down
    'L': [], // Left
    'R': [], // Right
    'F': [], // Front
    'B': []  // Back
  };
  
  // Initialize each face with default colors
  const defaultColors = {
    'U': 'W', // White
    'D': 'Y', // Yellow
    'L': 'G', // Green
    'R': 'B', // Blue
    'F': 'R', // Red
    'B': 'O'  // Orange
  };
  
  for (const face in faces) {
    faces[face] = Array(size).fill().map(() => 
      Array(size).fill(defaultColors[face])
    );
  }
  
  return {
    size,
    faces,
    colors: defaultColors
  };
};
```

### Color Selection State
```javascript
// Color selection management
const useColorSelection = () => {
  const [selectedColor, setSelectedColor] = useState('W');
  
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };
  
  return {
    selectedColor,
    handleColorSelect
  };
};
```

### Sticker Click Handling
```javascript
// Sticker click handling
const useStickerClick = (cubeState, setCubeState, selectedColor) => {
  const handleStickerClick = (face, row, col) => {
    setCubeState(prevState => {
      const newState = { ...prevState };
      const newFaces = { ...newState.faces };
      const newFace = [...newFaces[face]];
      
      // Update the specific sticker
      newFace[row] = [...newFace[row]];
      newFace[row][col] = selectedColor;
      
      newFaces[face] = newFace;
      newState.faces = newFaces;
      
      return newState;
    });
  };
  
  return {
    handleStickerClick
  };
};
```

## Validation System

### Color Validation
Ensure the cube configuration is valid:
```javascript
// Validation functions
const validateCubeConfiguration = (cubeState) => {
  const { size, faces } = cubeState;
  
  // Check 1: Each face has correct number of stickers
  for (const face in faces) {
    if (faces[face].length !== size) return false;
    for (const row of faces[face]) {
      if (row.length !== size) return false;
    }
  }
  
  // Check 2: Correct number of each color
  const colorCount = {};
  const expectedCount = size * size;
  
  for (const face in faces) {
    for (const row of faces[face]) {
      for (const color of row) {
        colorCount[color] = (colorCount[color] || 0) + 1;
      }
    }
  }
  
  // For a valid cube, each color should appear exactly size*size times
  for (const color in colorCount) {
    if (colorCount[color] !== expectedCount) {
      return {
        valid: false,
        error: `Color ${color} appears ${colorCount[color]} times, expected ${expectedCount}`
      };
    }
  }
  
  return { valid: true };
};
```

### Center Piece Validation
For 3x3 and larger cubes, center pieces are fixed:
```javascript
// Center piece validation
const validateCenterPieces = (cubeState) => {
  const { size, faces } = cubeState;
  
  // Only applicable for 3x3 and larger
  if (size < 3) return { valid: true };
  
  const expectedCenters = {
    'U': 'W',
    'D': 'Y',
    'L': 'G',
    'R': 'B',
    'F': 'R',
    'B': 'O'
  };
  
  for (const face in expectedCenters) {
    const centerRow = Math.floor(size / 2);
    const centerCol = Math.floor(size / 2);
    const centerColor = faces[face][centerRow][centerCol];
    
    if (centerColor !== expectedCenters[face]) {
      return {
        valid: false,
        error: `Center of ${face} face should be ${expectedCenters[face]}, but is ${centerColor}`
      };
    }
  }
  
  return { valid: true };
};
```

## User Experience Enhancements

### Visual Feedback
Provide clear visual feedback during coloring:
```css
/* Sticker.css */
.sticker {
  width: 30px;
  height: 30px;
  border: 1px solid #333;
  cursor: pointer;
  position: relative;
  transition: transform 0.1s ease;
}

.sticker:hover {
  transform: scale(1.1);
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
}

.sticker.selected {
  border: 2px solid #000;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #000;
}
```

### Keyboard Shortcuts
Allow keyboard navigation for faster coloring:
```javascript
// Keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (event) => {
    const keyMap = {
      'w': 'W', 'y': 'Y', 'g': 'G',
      'b': 'B', 'r': 'R', 'o': 'O'
    };
    
    if (keyMap[event.key.toLowerCase()]) {
      onColorSelect(keyMap[event.key.toLowerCase()]);
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [onColorSelect]);
```

### Auto-Correction
Help users by auto-correcting common mistakes:
```javascript
// Auto-correction for center pieces
const autoCorrectCenterPieces = (cubeState) => {
  const { size, faces } = cubeState;
  
  // Only for 3x3 and larger
  if (size < 3) return cubeState;
  
  const correctedState = { ...cubeState };
  const correctedFaces = { ...faces };
  
  const expectedCenters = {
    'U': 'W',
    'D': 'Y',
    'L': 'G',
    'R': 'B',
    'F': 'R',
    'B': 'O'
  };
  
  for (const face in expectedCenters) {
    const centerRow = Math.floor(size / 2);
    const centerCol = Math.floor(size / 2);
    
    // Preserve the center piece color
    correctedFaces[face] = [...correctedFaces[face]];
    correctedFaces[face][centerRow] = [...correctedFaces[face][centerRow]];
    correctedFaces[face][centerRow][centerCol] = expectedCenters[face];
  }
  
  correctedState.faces = correctedFaces;
  return correctedState;
};
```

## Integration with Main Application

### State Flow
```jsx
// App.jsx integration
function App() {
  const [cubeSize, setCubeSize] = useState(3);
  const [cubeState, setCubeState] = useState(initialCubeState(3));
  const [selectedColor, setSelectedColor] = useState('W');
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState('');
  
  // Update cube state when size changes
  useEffect(() => {
    setCubeState(initialCubeState(cubeSize));
  }, [cubeSize]);
  
  // Validate cube configuration
  useEffect(() => {
    const validation = validateCubeConfiguration(cubeState);
    if (!validation.valid) {
      setIsValid(false);
      setValidationError(validation.error);
      return;
    }
    
    const centerValidation = validateCenterPieces(cubeState);
    if (!centerValidation.valid) {
      setIsValid(false);
      setValidationError(centerValidation.error);
      return;
    }
    
    setIsValid(true);
    setValidationError('');
  }, [cubeState]);
  
  return (
    <div className="app">
      <CubeSelector 
        selectedSize={cubeSize} 
        onSizeChange={setCubeSize} 
      />
      
      <FlatCubeNet
        size={cubeSize}
        cubeState={cubeState}
        selectedColor={selectedColor}
        onStickerClick={handleStickerClick}
      />
      
      <ColorPalette
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />
      
      {!isValid && (
        <div className="validation-error">
          {validationError}
        </div>
      )}
      
      <Controls
        isValid={isValid}
        onStart={handleStart}
      />
    </div>
  );
}
```

## Accessibility Features

### Screen Reader Support
```jsx
// Accessible Sticker Component
function Sticker({ color, isSelected, onClick, rowIndex, colIndex, face }) {
  const colorNames = {
    'W': 'White',
    'Y': 'Yellow',
    'G': 'Green',
    'B': 'Blue',
    'R': 'Red',
    'O': 'Orange'
  };
  
  return (
    <div
      className={`sticker ${colorClasses[color]} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${colorNames[color]} sticker at position ${rowIndex}, ${colIndex} on ${face} face`}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {isSelected && <div className="selection-indicator" />}
    </div>
  );
}
```

### Keyboard Navigation
```jsx
// Keyboard navigation for the entire net
useEffect(() => {
  const handleKeyDown = (event) => {
    // Implement arrow key navigation between stickers
    // Implement color selection with number keys
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

## Responsive Design

### Adaptive Layout
```css
/* FlatCubeNet.css */
.flat-cube-net {
  display: grid;
  gap: 10px;
  justify-content: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .flat-cube-net {
    gap: 5px;
    padding: 10px;
  }
  
  .sticker {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .flat-cube-net {
    gap: 3px;
    padding: 5px;
  }
  
  .sticker {
    width: 15px;
    height: 15px;
  }
}
```

## Performance Considerations

### Memoization
```jsx
// Memoized components
const Sticker = React.memo(({ color, isSelected, onClick }) => {
  // Component implementation
});

const CubeFace = React.memo(({ face, stickers, size, selectedColor, onStickerClick }) => {
  // Component implementation
});
```

### Efficient State Updates
```javascript
// Batch state updates for better performance
const batchUpdateStickers = (updates) => {
  setCubeState(prevState => {
    const newState = { ...prevState };
    const newFaces = { ...newState.faces };
    
    for (const update of updates) {
      const { face, row, col, color } = update;
      if (!newFaces[face]) continue;
      
      newFaces[face] = [...newFaces[face]];
      newFaces[face][row] = [...newFaces[face][row]];
      newFaces[face][row][col] = color;
    }
    
    newState.faces = newFaces;
    return newState;
  });
};
```

This manual coloring interface design provides:

1. **Intuitive unfolded cube net** for easy color input
2. **Visual feedback** for selected colors and stickers
3. **Validation system** to ensure valid cube configurations
4. **Accessibility features** for all users
5. **Responsive design** for different screen sizes
6. **Performance optimizations** for smooth interaction
7. **Keyboard shortcuts** for power users
8. **Auto-correction** for common mistakes

The interface allows users to easily input their cube configuration while providing guidance to ensure they create a valid cube state that can be solved by the algorithm.