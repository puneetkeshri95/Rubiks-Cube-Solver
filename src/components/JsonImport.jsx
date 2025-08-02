import React, { useState } from 'react';
import './JsonImport.css';

function JsonImport({ onImport, cubeSize }) {
  const [jsonInput, setJsonInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  const handleImport = () => {
    try {
      setError('');
      const cubeData = JSON.parse(jsonInput);
      
      // Validate the JSON structure
      if (!validateCubeData(cubeData)) {
        setError('Invalid cube data format. Please check the JSON structure.');
        return;
      }
      
      // Import the cube data
      onImport(cubeData);
      setJsonInput('');
      setIsExpanded(false);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  const validateCubeData = (data) => {
    // Check if data has faces property
    if (!data.faces || typeof data.faces !== 'object') {
      return false;
    }

    const requiredFaces = ['U', 'D', 'L', 'R', 'F', 'B'];
    const validColors = ['W', 'Y', 'G', 'B', 'R', 'O'];

    // Check if all required faces exist
    for (const face of requiredFaces) {
      if (!data.faces[face] || !Array.isArray(data.faces[face])) {
        return false;
      }

      // Check if face has correct dimensions
      if (data.faces[face].length !== cubeSize) {
        return false;
      }

      // Check each row
      for (const row of data.faces[face]) {
        if (!Array.isArray(row) || row.length !== cubeSize) {
          return false;
        }

        // Check if all colors are valid
        for (const color of row) {
          if (!validColors.includes(color)) {
            return false;
          }
        }
      }
    }

    return true;
  };

  const generateSampleJson = () => {
    const sampleCube = {
      size: cubeSize,
      faces: {}
    };

    const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
    const colors = ['W', 'Y', 'G', 'B', 'R', 'O'];

    faces.forEach((face, faceIndex) => {
      sampleCube.faces[face] = [];
      for (let row = 0; row < cubeSize; row++) {
        sampleCube.faces[face][row] = [];
        for (let col = 0; col < cubeSize; col++) {
          // Create a mixed pattern for demonstration
          const colorIndex = (faceIndex + row + col) % colors.length;
          sampleCube.faces[face][row][col] = colors[colorIndex];
        }
      }
    });

    return JSON.stringify(sampleCube, null, 2);
  };

  const loadSample = () => {
    setJsonInput(generateSampleJson());
  };

  const clearInput = () => {
    setJsonInput('');
    setError('');
  };

  return (
    <div className="json-import">
      <div className="json-import-header">
        <h3 className="section-title">Advanced: JSON Import</h3>
        <button 
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse JSON import" : "Expand JSON import"}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="json-import-content">
          <p className="json-description">
            Import a scrambled cube configuration using JSON format. 
            This is useful for advanced users who want to test specific cube states.
          </p>

          <div className="json-input-container">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`Paste your ${cubeSize}x${cubeSize} cube JSON here...`}
              className="json-textarea"
              rows={8}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="json-actions">
            <button 
              className="secondary-button sample-button"
              onClick={loadSample}
            >
              Load Sample
            </button>
            
            <button 
              className="secondary-button clear-button"
              onClick={clearInput}
            >
              Clear
            </button>
            
            <button 
              className="primary-button import-button"
              onClick={handleImport}
              disabled={!jsonInput.trim()}
            >
              Import Cube
            </button>
          </div>

          <div className="json-format-info">
            <h4>Expected JSON Format:</h4>
            <pre className="format-example">
{`{
  "size": ${cubeSize},
  "faces": {
    "U": [["W","W","W"], ...],  // Up (White)
    "D": [["Y","Y","Y"], ...],  // Down (Yellow)
    "L": [["G","G","G"], ...],  // Left (Green)
    "R": [["B","B","B"], ...],  // Right (Blue)
    "F": [["R","R","R"], ...],  // Front (Red)
    "B": [["O","O","O"], ...]   // Back (Orange)
  }
}`}
            </pre>
            <p className="format-note">
              Colors: W=White, Y=Yellow, G=Green, B=Blue, R=Red, O=Orange
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default JsonImport;
