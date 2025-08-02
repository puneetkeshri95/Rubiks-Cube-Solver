# UI Controls and Layout Design

## Overview
This document describes the implementation of the user interface controls and overall layout for the Rubik's Cube Solver application. The design focuses on creating an intuitive, accessible, and visually appealing interface.

## Overall Layout Structure

### Desktop Layout
```
+-----------------------------------------------------+
| Header: Rubik's Cube Solver                         |
+----------------------+------------------------------+
| Control Panel       | 3D Visualization             |
|                      |                              |
| - Cube Selector      |                              |
| - Flat Cube Net      |                              |
| - Color Palette      |                              |
| - Controls           |                              |
| - Solution Display   |                              |
+----------------------+------------------------------+
| Footer: Status Information                          |
+-----------------------------------------------------+
```

### Mobile Layout
```
+---------------------------------+
| Header: Rubik's Cube Solver     |
+---------------------------------+
| Cube Selector                   |
+---------------------------------+
| Flat Cube Net / 3D View         |
+---------------------------------+
| Color Palette                   |
+---------------------------------+
| Controls                        |
+---------------------------------+
| Solution Display                |
+---------------------------------+
| Footer                          |
+---------------------------------+
```

## Component Implementation

### Header Component
```jsx
// Header.jsx
import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <h1>Rubik's Cube Solver</h1>
      <div className="header-subtitle">
        Solve any 2x2, 3x3, or 4x4 cube with step-by-step visualization
      </div>
    </header>
  );
}

export default Header;
```

### Main Layout Component
```jsx
// MainLayout.jsx
import React from 'react';
import './MainLayout.css';

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
}

export default MainLayout;
```

### Control Panel Component
```jsx
// ControlPanel.jsx
import React from 'react';
import './ControlPanel.css';

function ControlPanel({ children }) {
  return (
    <div className="control-panel">
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
}

export default ControlPanel;
```

### Visualization Panel Component
```jsx
// VisualizationPanel.jsx
import React from 'react';
import './VisualizationPanel.css';

function VisualizationPanel({ children }) {
  return (
    <div className="visualization-panel">
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
}

export default VisualizationPanel;
```

## UI Controls Implementation

### Cube Selector
```jsx
// CubeSelector.jsx
import React from 'react';
import './CubeSelector.css';

function CubeSelector({ selectedSize, onSizeChange }) {
  const sizes = [
    { value: 2, label: '2x2 Cube' },
    { value: 3, label: '3x3 Cube' },
    { value: 4, label: '4x4 Cube' }
  ];
  
  return (
    <div className="cube-selector">
      <h2 className="section-title">Select Cube Size</h2>
      <div className="size-options">
        {sizes.map(size => (
          <button
            key={size.value}
            className={`size-button ${selectedSize === size.value ? 'selected' : ''}`}
            onClick={() => onSizeChange(size.value)}
            aria-label={size.label}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CubeSelector;
```

### Main Controls Component
```jsx
// Controls.jsx
import React from 'react';
import './Controls.css';

function Controls({ 
  coloringMode, 
  onStart, 
  onScramble, 
  onSolve, 
  onPause, 
  isSolving, 
  isPaused,
  showSolution 
}) {
  return (
    <div className="controls">
      {coloringMode ? (
        <button 
          className="primary-button start-button"
          onClick={onStart}
          aria-label="Start solving the cube"
        >
          Start Solving
        </button>
      ) : (
        <div className="control-buttons">
          <button 
            className="secondary-button"
            onClick={onScramble}
            disabled={isSolving}
            aria-label="Scramble the cube"
          >
            Scramble
          </button>
          
          <button 
            className="primary-button"
            onClick={onSolve}
            disabled={isSolving}
            aria-label="Solve the cube"
          >
            Solve
          </button>
          
          {isSolving && (
            <button 
              className="secondary-button"
              onClick={isPaused ? onResume : onPause}
              aria-label={isPaused ? "Resume solving" : "Pause solving"}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
          
          <button 
            className="secondary-button"
            onClick={showSolution}
            aria-label="Show solution steps"
          >
            Show Solution
          </button>
        </div>
      )}
    </div>
  );
}

export default Controls;
```

### Solution Display Component
```jsx
// SolutionDisplay.jsx
import React from 'react';
import './SolutionDisplay.css';

function SolutionDisplay({ solution, currentStep, isVisible }) {
  if (!isVisible || !solution || solution.length === 0) {
    return null;
  }
  
  return (
    <div className="solution-display">
      <h3 className="section-title">Solution Steps</h3>
      <div className="solution-content">
        <div className="step-counter">
          Step {currentStep + 1} of {solution.length}
        </div>
        <div className="solution-steps">
          {solution.map((move, index) => (
            <span 
              key={index}
              className={`solution-move ${index === currentStep ? 'current' : ''}`}
              data-move={move}
            >
              {move}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SolutionDisplay;
```

## Responsive Design

### CSS Media Queries
```css
/* MainLayout.css */
.main-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 20px;
  padding: 20px;
}

.layout-content {
  display: contents;
}

/* Desktop layout */
@media (min-width: 1024px) {
  .control-panel {
    grid-column: 1;
    grid-row: 2;
  }
  
  .visualization-panel {
    grid-column: 2;
    grid-row: 2;
  }
}

/* Tablet layout */
@media (min-width: 768px) and (max-width: 1023px) {
  .main-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
  }
  
  .control-panel {
    grid-column: 1;
    grid-row: 2;
  }
  
  .visualization-panel {
    grid-column: 1;
    grid-row: 3;
  }
}

/* Mobile layout */
@media (max-width: 767px) {
  .main-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    padding: 10px;
    gap: 15px;
  }
  
  .control-panel {
    grid-column: 1;
    grid-row: 2;
  }
  
  .visualization-panel {
    grid-column: 1;
    grid-row: 3;
  }
}
```

### Flexible Components
```jsx
// ResponsiveFlatCubeNet.jsx
import React from 'react';
import './ResponsiveFlatCubeNet.css';

function ResponsiveFlatCubeNet({ size, cubeState, selectedColor, onStickerClick }) {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const stickerSize = isMobile ? 20 : 30;
  
  return (
    <div className={`flat-cube-net size-${size} ${isMobile ? 'mobile' : 'desktop'}`}>
      {/* Render cube net with responsive sticker sizes */}
    </div>
  );
}

export default ResponsiveFlatCubeNet;
```

## Accessibility Features

### Keyboard Navigation
```jsx
// AccessibleControls.jsx
import React, { useEffect } from 'react';

function AccessibleControls({ 
  coloringMode, 
  onStart, 
  onScramble, 
  onSolve 
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Handle keyboard shortcuts
      switch (event.key) {
        case ' ':
          event.preventDefault();
          if (coloringMode) onStart();
          break;
        case 's':
        case 'S':
          event.preventDefault();
          onScramble();
          break;
        case 'Enter':
          event.preventDefault();
          onSolve();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [coloringMode, onStart, onScramble, onSolve]);
  
  return (
    <div className="controls" role="toolbar" aria-label="Cube controls">
      {/* Control buttons with proper ARIA attributes */}
    </div>
  );
}

export default AccessibleControls;
```

### Screen Reader Support
```jsx
// AccessibleSticker.jsx
import React from 'react';

function AccessibleSticker({ 
  color, 
  position, 
  face, 
  isSelected, 
  onClick 
}) {
  const colorNames = {
    'W': 'White',
    'Y': 'Yellow',
    'G': 'Green',
    'B': 'Blue',
    'R': 'Red',
    'O': 'Orange'
  };
  
  const faceNames = {
    'U': 'Up',
    'D': 'Down',
    'L': 'Left',
    'R': 'Right',
    'F': 'Front',
    'B': 'Back'
  };
  
  return (
    <div
      className={`sticker ${colorClasses[color]} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${colorNames[color]} sticker on ${faceNames[face]} face at position ${position.row}, ${position.col}`}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {isSelected && (
        <span className="sr-only">Selected</span>
      )}
    </div>
  );
}

export default AccessibleSticker;
```

## Visual Design System

### Color Palette
```css
/* Colors.css */
:root {
  /* Primary colors */
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --primary-active: #1d4ed8;
  
  /* Cube colors */
  --white: #ffffff;
  --yellow: #fbbf24;
  --green: #10b981;
  --blue: #3b82f6;
  --red: #ef4444;
  --orange: #f97316;
  
  /* UI colors */
  --background: #0f172a;
  --surface: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border: #334155;
  
  /* Status colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

### Typography
```css
/* Typography.css */
:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-small: 0.875rem;
  --font-size-base: 1rem;
  --font-size-large: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  color: var(--text-primary);
  background-color: var(--background);
}
```

## User Feedback System

### Loading States
```jsx
// LoadingIndicator.jsx
import React from 'react';
import './LoadingIndicator.css';

function LoadingIndicator({ isVisible, message }) {
  if (!isVisible) return null;
  
  return (
    <div className="loading-overlay" role="status">
      <div className="loading-spinner"></div>
      <div className="loading-message">{message}</div>
    </div>
  );
}

export default LoadingIndicator;
```

### Status Messages
```jsx
// StatusMessage.jsx
import React from 'react';
import './StatusMessage.css';

function StatusMessage({ type, message, isVisible }) {
  if (!isVisible || !message) return null;
  
  const typeClasses = {
    success: 'status-success',
    warning: 'status-warning',
    error: 'status-error',
    info: 'status-info'
  };
  
  return (
    <div className={`status-message ${typeClasses[type]}`} role="alert">
      {message}
    </div>
  );
}

export default StatusMessage;
```

## Performance Considerations

### Lazy Loading
```jsx
// LazyLoadedVisualization.jsx
import React, { Suspense } from 'react';

const ThreeCube = React.lazy(() => import('./ThreeCube'));

function LazyLoadedVisualization({ cubeState, isSolving }) {
  return (
    <Suspense fallback={<div className="loading">Loading 3D visualization...</div>}>
      <ThreeCube cubeState={cubeState} isSolving={isSolving} />
    </Suspense>
  );
}

export default LazyLoadedVisualization;
```

### Memoization
```jsx
// OptimizedComponents.jsx
import React, { memo } from 'react';

const MemoizedSticker = memo(({ color, onClick }) => {
  return (
    <div 
      className={`sticker ${colorClasses[color]}`}
      onClick={onClick}
    />
  );
});

const MemoizedCubeFace = memo(({ face, stickers, onStickerClick }) => {
  return (
    <div className="cube-face">
      {stickers.map((row, rowIndex) => 
        row.map((color, colIndex) => (
          <MemoizedSticker
            key={`${rowIndex}-${colIndex}`}
            color={color}
            onClick={() => onStickerClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
});

export { MemoizedSticker, MemoizedCubeFace };
```

## Integration with Application State

### Context Provider
```jsx
// UIContext.js
import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('info');
  
  const value = {
    isMobile,
    setIsMobile,
    isLoading,
    setIsLoading,
    statusMessage,
    setStatusMessage,
    statusType,
    setStatusType
  };
  
  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};
```

## Testing Strategy

### UI Component Tests
```jsx
// Controls.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Controls from './Controls';

describe('Controls Component', () => {
  test('renders start button in coloring mode', () => {
    render(
      <Controls 
        coloringMode={true} 
        onStart={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Start Solving')).toBeInTheDocument();
  });
  
  test('renders control buttons in solving mode', () => {
    render(
      <Controls 
        coloringMode={false} 
        onScramble={jest.fn()}
        onSolve={jest.fn()}
      />
    );
    
    expect(screen.getByText('Scramble')).toBeInTheDocument();
    expect(screen.getByText('Solve')).toBeInTheDocument();
  });
  
  test('calls onStart when start button is clicked', () => {
    const onStart = jest.fn();
    render(<Controls coloringMode={true} onStart={onStart} />);
    
    fireEvent.click(screen.getByText('Start Solving'));
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
```

## Dark Mode Support

### Theme Toggle
```jsx
// ThemeToggle.jsx
import React from 'react';
import './ThemeToggle.css';

function ThemeToggle({ isDarkMode, onToggle }) {
  return (
    <button 
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
```

### CSS Variables for Themes
```css
/* themes.css */
[data-theme="light"] {
  --background: #ffffff;
  --surface: #f8fafc;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --border: #cbd5e1;
}

[data-theme="dark"] {
  --background: #0f172a;
  --surface: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border: #334155;
}
```

This UI controls and layout design provides:

1. **Responsive layout** that works on all device sizes
2. **Intuitive controls** for all application features
3. **Accessibility features** for all users
4. **Visual design system** with consistent styling
5. **Performance optimizations** for smooth interaction
6. **User feedback mechanisms** for better experience
7. **Dark mode support** for user preference
8. **Comprehensive testing** for reliability
9. **Modular component structure** for maintainability
10. **Scalable architecture** for future enhancements

The design ensures that users can easily interact with the application while providing a visually appealing and accessible interface that enhances the cube-solving experience.