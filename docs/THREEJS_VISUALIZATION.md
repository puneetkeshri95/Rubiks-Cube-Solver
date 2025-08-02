# Three.js Cube Visualization Design

## Overview
This document describes the implementation of the 3D cube visualization using Three.js and @react-three/fiber. The visualization will show a realistic Rubik's Cube that can be rotated, animated, and manipulated.

## 3D Coordinate System

### Cube Positioning
The cube will be centered at the origin (0, 0, 0) with each sticker positioned appropriately:

```
For a 3x3 cube:
- Stickers are positioned at intervals of 1 unit
- The entire cube spans from -1.5 to 1.5 units in each dimension
- Center of each sticker is at (x, y, z) where x, y, z ∈ {-1, 0, 1}
```

### Face Orientations
Each face has a specific orientation in 3D space:
- Front (F): z = 1.5, normal pointing +Z
- Back (B): z = -1.5, normal pointing -Z
- Right (R): x = 1.5, normal pointing +X
- Left (L): x = -1.5, normal pointing -X
- Up (U): y = 1.5, normal pointing +Y
- Down (D): y = -1.5, normal pointing -Y

## Component Structure

### ThreeCube.jsx (Main Visualization Component)
```jsx
// ThreeCube.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import CubeModel from './CubeModel';
import { useCubeStore } from '../store/cubeStore';

function ThreeCube({ isSolving, currentMove }) {
  const { cubeState, animationState } = useCubeStore();
  
  return (
    <Canvas
      shadows
      camera={{ position: [5, 5, 5], fov: 50 }}
      style={{ background: '#000' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <PerspectiveCamera makeDefault position={[5, 5, 5]} />
      
      <CubeModel 
        cubeState={cubeState} 
        animationState={animationState}
        currentMove={currentMove}
      />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        autoRotate={!isSolving && animationState === 'idle'}
        autoRotateSpeed={1.0}
      />
    </Canvas>
  );
}

export default ThreeCube;
```

### CubeModel.jsx (Cube Geometry)
```jsx
// CubeModel.jsx
import React, { useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useCubeStore } from '../store/cubeStore';

// Sticker component
function Sticker({ position, rotation, color, isRotating, rotationAxis }) {
  const meshRef = React.useRef();
  
  // Animation for rotations
  const { rotation: animRotation } = useSpring({
    rotation: isRotating ? [rotationAxis.x * Math.PI/2, rotationAxis.y * Math.PI/2, rotationAxis.z * Math.PI/2] : [0, 0, 0],
    config: { tension: 300, friction: 20 }
  });
  
  // Color mapping
  const colorMap = {
    'W': '#FFFFFF', // White
    'Y': '#FFD700', // Yellow
    'G': '#00FF00', // Green
    'B': '#1E90FF', // Blue
    'R': '#FF4136', // Red
    'O': '#FF851B'  // Orange
  };
  
  return (
    <animated.mesh 
      ref={meshRef}
      position={position}
      rotation={animRotation}
    >
      <planeGeometry args={[0.9, 0.9]} />
      <meshStandardMaterial 
        color={colorMap[color] || '#808080'} 
        side={THREE.DoubleSide}
        metalness={0.1}
        roughness={0.2}
      />
    </animated.mesh>
  );
}

// Face component
function CubeFace({ face, stickers, size, isRotating, rotationAxis }) {
  const facePositions = {
    'U': [0, size/2, 0],    // Up
    'D': [0, -size/2, 0],   // Down
    'L': [-size/2, 0, 0],   // Left
    'R': [size/2, 0, 0],    // Right
    'F': [0, 0, size/2],    // Front
    'B': [0, 0, -size/2]    // Back
  };
  
  const faceRotations = {
    'U': [0, 0, 0],
    'D': [0, 0, Math.PI],
    'L': [0, Math.PI/2, 0],
    'R': [0, -Math.PI/2, 0],
    'F': [-Math.PI/2, 0, 0],
    'B': [Math.PI/2, 0, 0]
  };
  
  return (
    <group 
      position={facePositions[face]}
      rotation={faceRotations[face]}
    >
      {stickers.map((row, i) => 
        row.map((color, j) => {
          // Calculate sticker position based on size
          const x = (j - (size-1)/2) * 1.05;
          const y = ((size-1)/2 - i) * 1.05;
          
          return (
            <Sticker
              key={`${face}-${i}-${j}`}
              position={[x, y, 0.01]}
              color={color}
              isRotating={isRotating}
              rotationAxis={rotationAxis}
            />
          );
        })
      )}
    </group>
  );
}

// Main cube model
function CubeModel({ cubeState, animationState, currentMove }) {
  const size = cubeState.size;
  const [isRotating, setIsRotating] = useState(false);
  const [rotationAxis, setRotationAxis] = useState({ x: 0, y: 0, z: 0 });
  
  // Handle move animations
  useEffect(() => {
    if (currentMove && animationState === 'rotating') {
      setIsRotating(true);
      
      // Determine rotation axis based on move
      const axisMap = {
        'F': { x: 0, y: 0, z: 1 },
        'B': { x: 0, y: 0, z: -1 },
        'R': { x: 1, y: 0, z: 0 },
        'L': { x: -1, y: 0, z: 0 },
        'U': { x: 0, y: 1, z: 0 },
        'D': { x: 0, y: -1, z: 0 }
      };
      
      const face = currentMove.replace(/'/, '');
      setRotationAxis(axisMap[face] || { x: 0, y: 0, z: 0 });
      
      // Reset rotation after animation
      const timer = setTimeout(() => {
        setIsRotating(false);
      }, 500); // Match animation duration
      
      return () => clearTimeout(timer);
    }
  }, [currentMove, animationState]);
  
  return (
    <group>
      {Object.entries(cubeState.faces).map(([face, stickers]) => (
        <CubeFace
          key={face}
          face={face}
          stickers={stickers}
          size={size}
          isRotating={isRotating && currentMove?.includes(face)}
          rotationAxis={rotationAxis}
        />
      ))}
    </group>
  );
}

export default CubeModel;
```

## Animation System

### Rotation Animations
For smooth cube rotations, we'll use react-spring for physics-based animations:

```jsx
// RotationAnimation.jsx
import { useSpring, animated } from '@react-spring/three';

function RotationAnimation({ face, isRotating, onComplete }) {
  const { rotation } = useSpring({
    rotation: isRotating ? [Math.PI/2, 0, 0] : [0, 0, 0],
    config: { tension: 300, friction: 20 },
    onRest: () => {
      if (isRotating) onComplete();
    }
  });
  
  return (
    <animated.group rotation={rotation}>
      {/* Face components */}
    </animated.group>
  );
}
```

### Folding Animation
For the transition from flat net to 3D cube:

```jsx
// FoldingAnimation.jsx
import { useSpring, animated } from '@react-spring/three';

function FoldingAnimation({ onComplete }) {
  const { progress } = useSpring({
    progress: 1,
    from: { progress: 0 },
    config: { duration: 2000 },
    onRest: onComplete
  });
  
  return (
    <animated.group>
      {/* Animate face positions from flat to 3D based on progress */}
    </animated.group>
  );
}
```

## Performance Optimization

### Instanced Rendering
For better performance with multiple stickers:

```jsx
// OptimizedStickers.jsx
import { useThree, useFrame } from '@react-three/fiber';
import { useMemo } from 'react';

function OptimizedStickers({ cubeState }) {
  const geometry = useMemo(() => new THREE.PlaneGeometry(0.9, 0.9), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ 
    side: THREE.DoubleSide,
    metalness: 0.1,
    roughness: 0.2
  }), []);
  
  // Create instanced mesh for all stickers
  // This reduces draw calls significantly
  
  return (
    <instancedMesh args={[geometry, material, cubeState.size * cubeState.size * 6]}>
      {/* Update instance matrices in useFrame */}
    </instancedMesh>
  );
}
```

### Level of Detail (LOD)
For distant viewing, simplify the cube:

```jsx
// LODCube.jsx
import { LOD } from '@react-three/drei';

function LODCube({ cubeState }) {
  return (
    <LOD>
      <CubeModel args={[cubeState]} distance={0} />
      <SimplifiedCube args={[cubeState]} distance={10} />
      <VerySimplifiedCube distance={20} />
    </LOD>
  );
}
```

## Interaction Handling

### Orbit Controls
Allow users to rotate the camera around the cube:

```jsx
// CustomOrbitControls.jsx
import { OrbitControls } from '@react-three/drei';

function CustomOrbitControls({ isSolving }) {
  return (
    <OrbitControls
      enableZoom={true}
      enablePan={false}
      autoRotate={!isSolving}
      autoRotateSpeed={1.0}
      minDistance={3}
      maxDistance={15}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}
```

### Click Detection
Allow clicking on stickers for debugging or interaction:

```jsx
// InteractiveSticker.jsx
import { useThree } from '@react-three/fiber';

function InteractiveSticker({ position, color, onClick }) {
  const meshRef = React.useRef();
  const { camera, raycaster } = useThree();
  
  const handleClick = (event) => {
    // Raycasting to detect clicks on stickers
    onClick(position, color);
  };
  
  return (
    <mesh 
      ref={meshRef}
      position={position}
      onClick={handleClick}
    >
      <planeGeometry args={[0.9, 0.9]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
```

## Lighting and Materials

### Realistic Materials
Create materials that look like actual Rubik's Cube stickers:

```jsx
// RealisticStickerMaterial.jsx
import * as THREE from 'three';

const createStickerMaterial = (color) => {
  return new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.2,
    metalness: 0.1,
    emissive: new THREE.Color(color).multiplyScalar(0.1),
    side: THREE.DoubleSide
  });
};
```

### Dynamic Lighting
Use multiple light sources for realistic illumination:

```jsx
// DynamicLighting.jsx
function DynamicLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      <hemisphereLight 
        skyColor="#ffffff" 
        groundColor="#444444" 
        intensity={0.2} 
      />
    </>
  );
}
```

## Camera System

### Automatic Camera Positioning
Position camera based on cube size:

```jsx
// AdaptiveCamera.jsx
function AdaptiveCamera({ cubeSize }) {
  const cameraDistance = useMemo(() => {
    // Calculate appropriate distance based on cube size
    return 2 + (cubeSize - 3) * 0.5;
  }, [cubeSize]);
  
  return (
    <PerspectiveCamera 
      makeDefault 
      position={[cameraDistance, cameraDistance, cameraDistance]} 
      fov={50}
    />
  );
}
```

### 360-Degree Rotation
After solving, perform a slow 360-degree rotation:

```jsx
// VictorySpin.jsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function VictorySpin({ isActive }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (isActive && groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  
  return <group ref={groupRef}>{/* Cube components */}</group>;
}
```

## Integration with Application State

### Zustand Store for Cube State
```javascript
// store/cubeStore.js
import { create } from 'zustand';

export const useCubeStore = create((set, get) => ({
  cubeState: null,
  animationState: 'idle', // idle, rotating, folding, solving
  currentMove: null,
  
  setCubeState: (cubeState) => set({ cubeState }),
  setAnimationState: (animationState) => set({ animationState }),
  setCurrentMove: (currentMove) => set({ currentMove }),
  
  // Actions for cube manipulation
  rotateFace: (face, clockwise = true) => {
    const { cubeState } = get();
    // Apply rotation to cube state
    set({ cubeState: newCubeState });
  }
}));
```

## Testing and Debugging

### Visual Debugging
Add debug helpers for development:

```jsx
// DebugHelpers.jsx
function DebugHelpers({ showHelpers }) {
  if (!showHelpers) return null;
  
  return (
    <>
      <axesHelper args={[5]} />
      <gridHelper args={[10, 10]} />
      {/* Additional debug visuals */}
    </>
  );
}
```

## Responsive Design

### Adaptive Rendering
Adjust visualization based on device capabilities:

```jsx
// AdaptiveVisualization.jsx
import { useDetectGPU } from '@react-three/drei';

function AdaptiveVisualization({ cubeState }) {
  const GPUTier = useDetectGPU();
  
  // Adjust quality based on GPU capabilities
  const quality = GPUTier.tier > 2 ? 'high' : 'low';
  
  return (
    <CubeModel 
      cubeState={cubeState} 
      quality={quality}
    />
  );
}
```

This Three.js visualization design provides:

1. **Realistic 3D representation** of the Rubik's Cube
2. **Smooth animations** for rotations and transitions
3. **Performance optimization** through instanced rendering and LOD
4. **Interactive controls** for user manipulation
5. **Dynamic lighting** for realistic appearance
6. **Responsive design** for different devices
7. **Integration with application state** for synchronized visualization
8. **Debugging capabilities** for development

The implementation will create an immersive and visually appealing experience that enhances the user's understanding of the cube-solving process.