# Animation System Design Using GSAP

## Overview
This document describes the implementation of the animation system using GSAP (GreenSock Animation Platform) for smooth and performant animations in the Rubik's Cube Solver application.

## GSAP Integration

### Installation and Setup
```bash
npm install gsap
```

```javascript
// GSAP imports
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
```

## Core Animation Components

### Folding Animation
Animate the transition from flat net to 3D cube:

```javascript
// FoldingAnimation.js
import gsap from 'gsap';

class FoldingAnimation {
  constructor(cubeVisualizer) {
    this.cubeVisualizer = cubeVisualizer;
    this.timeline = gsap.timeline();
  }
  
  // Animate folding from flat net to 3D cube
  async foldTo3D(flatNetElements, onComplete) {
    // Reset timeline
    this.timeline.clear();
    
    // Animate each face to its 3D position
    const faces = ['U', 'L', 'F', 'R', 'B', 'D'];
    
    faces.forEach((face, index) => {
      const element = flatNetElements[face];
      const targetPosition = this.get3DPosition(face);
      const targetRotation = this.get3DRotation(face);
      
      // Add animation to timeline
      this.timeline.to(element, {
        duration: 0.8,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        rotationX: targetRotation.x,
        rotationY: targetRotation.y,
        rotationZ: targetRotation.z,
        ease: "power2.inOut",
        delay: index * 0.1 // Stagger animations
      }, 0); // Start all at the same time with delays
    });
    
    // Add completion callback
    this.timeline.eventCallback("onComplete", onComplete);
    
    // Play the animation
    return this.timeline.play();
  }
  
  // Get 3D position for each face
  get3DPosition(face) {
    const positions = {
      'U': { x: 0, y: -100, z: 0 },
      'D': { x: 0, y: 100, z: 0 },
      'L': { x: -100, y: 0, z: 0 },
      'R': { x: 100, y: 0, z: 0 },
      'F': { x: 0, y: 0, z: 100 },
      'B': { x: 0, y: 0, z: -100 }
    };
    
    return positions[face] || { x: 0, y: 0, z: 0 };
  }
  
  // Get 3D rotation for each face
  get3DRotation(face) {
    const rotations = {
      'U': { x: 0, y: 0, z: 0 },
      'D': { x: 180, y: 0, z: 0 },
      'L': { x: 0, y: -90, z: 0 },
      'R': { x: 0, y: 90, z: 0 },
      'F': { x: -90, y: 0, z: 0 },
      'B': { x: 90, y: 0, z: 0 }
    };
    
    return rotations[face] || { x: 0, y: 0, z: 0 };
  }
  
  // Stop current animation
  stop() {
    this.timeline.pause();
  }
}

export default FoldingAnimation;
```

### Cube Rotation Animation
Animate individual cube moves:

```javascript
// MoveAnimation.js
import gsap from 'gsap';

class MoveAnimation {
  constructor(cubeVisualizer) {
    this.cubeVisualizer = cubeVisualizer;
  }
  
  // Animate a single cube move
  async animateMove(face, isPrime = false, onComplete) {
    const duration = 0.3; // Duration of rotation
    const rotationAngle = isPrime ? -90 : 90;
    
    // Get the elements to rotate
    const elementsToRotate = this.cubeVisualizer.getFaceElements(face);
    
    // Create timeline for the move
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
    
    // Animate rotation
    timeline.to(elementsToRotate, {
      duration: duration,
      rotation: `+=${rotationAngle}`,
      ease: "power1.inOut"
    });
    
    return timeline;
  }
  
  // Animate multiple moves in sequence
  async animateMoves(moves, onMoveComplete, onComplete) {
    const timeline = gsap.timeline({
      onComplete: onComplete
    });
    
    moves.forEach((move, index) => {
      const face = move.replace(/'/, '');
      const isPrime = move.includes("'");
      
      timeline.add(() => {
        this.animateMove(face, isPrime, () => {
          if (onMoveComplete) onMoveComplete(index + 1, moves.length);
        });
      }, index * 0.4); // Add delay between moves
    });
    
    return timeline;
  }
}

export default MoveAnimation;
```

### Solving Animation
Animate the step-by-step solving process:

```javascript
// SolvingAnimation.js
import gsap from 'gsap';

class SolvingAnimation {
  constructor(cubeVisualizer) {
    this.cubeVisualizer = cubeVisualizer;
    this.currentStep = 0;
    this.isPaused = false;
  }
  
  // Start solving animation
  async startSolving(solution, onStep, onComplete) {
    this.currentStep = 0;
    this.isPaused = false;
    
    // Animate each step of the solution
    await this.animateSolutionSteps(solution, onStep, onComplete);
  }
  
  // Animate solution steps
  async animateSolutionSteps(solution, onStep, onComplete) {
    if (this.currentStep >= solution.length || this.isPaused) {
      if (onComplete) onComplete();
      return;
    }
    
    const move = solution[this.currentStep];
    const face = move.replace(/'/, '');
    const isPrime = move.includes("'");
    
    // Highlight current move
    this.highlightMove(move);
    
    // Animate the move
    await this.animateMove(face, isPrime);
    
    // Update step counter
    this.currentStep++;
    if (onStep) onStep(this.currentStep, solution.length);
    
    // Continue with next step
    setTimeout(() => {
      this.animateSolutionSteps(solution, onStep, onComplete);
    }, 300); // Delay between steps
  }
  
  // Highlight current move in UI
  highlightMove(move) {
    // Add visual highlight to move in solution display
    const moveElement = document.querySelector(`[data-move="${move}"]`);
    if (moveElement) {
      moveElement.classList.add('highlighted');
      
      // Remove highlight after delay
      setTimeout(() => {
        moveElement.classList.remove('highlighted');
      }, 500);
    }
  }
  
  // Pause solving animation
  pause() {
    this.isPaused = true;
  }
  
  // Resume solving animation
  resume() {
    this.isPaused = false;
  }
  
  // Skip to specific step
  skipToStep(step) {
    this.currentStep = step;
  }
}

export default SolvingAnimation;
```

## GSAP Timeline Management

### Complex Animation Sequences
Create complex animation sequences for better user experience:

```javascript
// ComplexAnimation.js
import gsap from 'gsap';

class ComplexAnimation {
  constructor() {
    this.timeline = gsap.timeline();
  }
  
  // Create welcome animation
  createWelcomeAnimation(elements) {
    this.timeline.clear();
    
    // Stagger fade in of elements
    this.timeline.from(elements.title, {
      duration: 0.8,
      opacity: 0,
      y: -50,
      ease: "back.out(1.7)"
    });
    
    this.timeline.from(elements.cubeSelector, {
      duration: 0.6,
      opacity: 0,
      scale: 0.8,
      ease: "elastic.out(1, 0.3)"
    }, "-=0.4");
    
    this.timeline.from(elements.flatNet, {
      duration: 0.8,
      opacity: 0,
      x: -100,
      ease: "power2.out"
    }, "-=0.2");
    
    return this.timeline;
  }
  
  // Create solution complete animation
  createSolutionCompleteAnimation(cubeElement) {
    this.timeline.clear();
    
    // 360-degree rotation
    this.timeline.to(cubeElement, {
      duration: 3,
      rotationY: "+=360",
      ease: "slow(0.7, 0.7, false)"
    });
    
    // Pulse effect
    this.timeline.to(cubeElement, {
      duration: 0.3,
      scale: 1.1,
      repeat: 3,
      yoyo: true,
      ease: "sine.inOut"
    }, "-=2");
    
    // Color flash
    this.timeline.to(cubeElement, {
      duration: 0.1,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      repeat: 5,
      yoyo: true
    }, "-=2");
    
    return this.timeline;
  }
}

export default ComplexAnimation;
```

## Performance Optimization

### Animation Optimization Techniques
```javascript
// OptimizedAnimation.js
import gsap from 'gsap';

class OptimizedAnimation {
  constructor() {
    // Set GSAP global defaults for performance
    gsap.defaults({
      ease: "power1.inOut",
      duration: 0.3
    });
    
    // Configure performance settings
    gsap.ticker.fps(60);
  }
  
  // Use transform properties for better performance
  animateWithTransforms(element, transforms) {
    return gsap.to(element, {
      x: transforms.x || 0,
      y: transforms.y || 0,
      z: transforms.z || 0,
      rotationX: transforms.rotationX || 0,
      rotationY: transforms.rotationY || 0,
      rotationZ: transforms.rotationZ || 0,
      duration: transforms.duration || 0.3,
      ease: transforms.ease || "power1.inOut"
    });
  }
  
  // Batch animations for better performance
  batchAnimate(elements, properties) {
    return gsap.to(elements, {
      ...properties,
      stagger: {
        each: 0.02,
        from: "center"
      }
    });
  }
  
  // Use will-change for complex animations
  prepareForAnimation(element) {
    element.style.willChange = "transform, opacity";
    
    // Clean up after animation
    gsap.ticker.add(() => {
      if (!gsap.isTweening(element)) {
        element.style.willChange = "auto";
      }
    });
  }
}
```

## Responsive Animation

### Adaptive Animations
```javascript
// ResponsiveAnimation.js
class ResponsiveAnimation {
  constructor() {
    this.isMobile = this.checkMobile();
  }
  
  checkMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }
  
  // Adjust animation parameters based on device
  getAnimationParams(baseParams) {
    if (this.isMobile) {
      return {
        ...baseParams,
        duration: baseParams.duration * 1.5, // Slower on mobile
        ease: "power2.out" // Simpler easing
      };
    }
    
    return baseParams;
  }
  
  // Reduce complexity on lower-end devices
  getReducedAnimation(complexAnimation) {
    if (this.isLowEndDevice()) {
      // Return simplified version
      return this.simplifyAnimation(complexAnimation);
    }
    
    return complexAnimation;
  }
  
  isLowEndDevice() {
    // Check device capabilities
    return navigator.hardwareConcurrency <= 2 || 
           /Android.*Chrome/.test(navigator.userAgent);
  }
}
```

## Integration with React Components

### React Hook for Animations
```javascript
// useAnimation.js
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useAnimation = () => {
  const animationRef = useRef(null);
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);
  
  const animateElement = (element, properties) => {
    if (element) {
      animationRef.current = gsap.to(element, properties);
      return animationRef.current;
    }
  };
  
  const staggerAnimate = (elements, properties, stagger = 0.1) => {
    if (elements && elements.length > 0) {
      animationRef.current = gsap.to(elements, {
        ...properties,
        stagger: stagger
      });
      return animationRef.current;
    }
  };
  
  return {
    animateElement,
    staggerAnimate,
    animationRef
  };
};
```

### Animated Component Example
```jsx
// AnimatedCubeFace.jsx
import React, { useRef } from 'react';
import { useAnimation } from '../hooks/useAnimation';

function AnimatedCubeFace({ face, stickers, onRotate }) {
  const faceRef = useRef(null);
  const { animateElement } = useAnimation();
  
  const handleRotate = () => {
    if (faceRef.current) {
      animateElement(faceRef.current, {
        duration: 0.3,
        rotationY: "+=90",
        ease: "power1.inOut",
        onComplete: onRotate
      });
    }
  };
  
  return (
    <div 
      ref={faceRef}
      className="cube-face"
      onClick={handleRotate}
    >
      {stickers.map((row, rowIndex) => 
        row.map((color, colIndex) => (
          <Sticker key={`${rowIndex}-${colIndex}`} color={color} />
        ))
      )}
    </div>
  );
}

export default AnimatedCubeFace;
```

## Animation Control System

### Playback Controls
```javascript
// AnimationController.js
class AnimationController {
  constructor() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentProgress = 0;
  }
  
  play(animation) {
    this.isPlaying = true;
    this.isPaused = false;
    return animation.play();
  }
  
  pause(animation) {
    this.isPlaying = false;
    this.isPaused = true;
    return animation.pause();
  }
  
  resume(animation) {
    this.isPlaying = true;
    this.isPaused = false;
    return animation.resume();
  }
  
  stop(animation) {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentProgress = 0;
    return animation.pause(0);
  }
  
  seek(animation, progress) {
    this.currentProgress = progress;
    return animation.seek(progress);
  }
}
```

## UI Integration

### Animation Controls Component
```jsx
// AnimationControls.jsx
import React, { useState } from 'react';

function AnimationControls({ 
  isPlaying, 
  isPaused, 
  onPlay, 
  onPause, 
  onStop, 
  onSpeedChange 
}) {
  const [speed, setSpeed] = useState(1);
  
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };
  
  return (
    <div className="animation-controls">
      <button 
        onClick={isPlaying ? onPause : onPlay}
        className="play-pause-button"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      
      <button onClick={onStop} className="stop-button">
        Stop
      </button>
      
      <div className="speed-control">
        <label>Speed:</label>
        <select 
          value={speed} 
          onChange={(e) => handleSpeedChange(Number(e.target.value))}
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={5}>5x</option>
        </select>
      </div>
    </div>
  );
}

export default AnimationControls;
```

## Testing and Debugging

### Animation Testing
```javascript
// Animation.test.js
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import AnimatedCubeFace from './AnimatedCubeFace';

describe('Animation System', () => {
  test('animates cube rotation', async () => {
    render(<AnimatedCubeFace face="F" stickers={[]} />);
    
    const faceElement = screen.getByRole('button');
    
    // Mock GSAP animation
    jest.spyOn(window, 'gsap').mockImplementation(() => ({
      to: jest.fn().mockReturnValue({
        play: jest.fn(),
        pause: jest.fn()
      })
    }));
    
    await act(async () => {
      faceElement.click();
    });
    
    // Verify animation was triggered
    expect(window.gsap.to).toHaveBeenCalled();
  });
});
```

## Accessibility Considerations

### Reduced Motion Support
```javascript
// Accessibility.js
class Accessibility {
  static prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  static getAnimationSettings() {
    if (this.prefersReducedMotion()) {
      return {
        duration: 0,
        ease: "none"
      };
    }
    
    return {
      duration: 0.3,
      ease: "power1.inOut"
    };
  }
}
```

This animation system design using GSAP provides:

1. **Smooth and performant animations** for all cube interactions
2. **Complex animation sequences** for engaging user experience
3. **Responsive animations** that adapt to different devices
4. **Performance optimization** techniques for efficient rendering
5. **Integration with React components** for seamless implementation
6. **Playback controls** for user interaction
7. **Accessibility support** for users with motion preferences
8. **Comprehensive testing** for reliability
9. **Modular architecture** for maintainability
10. **Scalable design** for future enhancements

The system ensures that all animations enhance the user experience while maintaining optimal performance across different devices and user preferences.