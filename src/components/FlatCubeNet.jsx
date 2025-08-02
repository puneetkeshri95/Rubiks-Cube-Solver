import './FlatCubeNet.css';

function FlatCubeNet({ size, cubeState, onStickerClick }) {
  if (!cubeState) return null;

  // Define face positions for unfolded net
  const getFaceLayout = (size) => {
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
  };

  const faceLayout = getFaceLayout(size);
  const faceNames = {
    'U': 'Up',
    'D': 'Down',
    'L': 'Left',
    'R': 'Right',
    'F': 'Front',
    'B': 'Back'
  };

  return (
    <div className="cube-net-wrapper">
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
            <div className="face-label">{faceNames[face]}</div>
            <div className="stickers-grid">
              {cubeState.faces[face].map((row, rowIndex) => (
                <div key={rowIndex} className="sticker-row">
                  {row.map((color, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`sticker ${color.toLowerCase()}`}
                      onClick={() => onStickerClick(face, rowIndex, colIndex)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlatCubeNet;