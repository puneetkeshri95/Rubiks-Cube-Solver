// Test script to verify all dependencies are properly installed
import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

console.log('Dependency test results:');
console.log('React:', React.version);
console.log('ReactDOM:', ReactDOM.version);
console.log('Three.js:', THREE.REVISION);
console.log('All dependencies are properly installed!');

export default function DependencyTest() {
  return (
    <div>
      <h1>Dependency Test</h1>
      <p>All dependencies are properly installed and working!</p>
    </div>
  );
}