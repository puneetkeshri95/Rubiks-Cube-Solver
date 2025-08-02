import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {colors.map((color, index) => (
        <motion.button
          key={color.code}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`
            px-4 py-3 rounded-lg font-exo font-semibold text-sm transition-all duration-300
            border-2 relative overflow-hidden
            ${selectedColor === color.code
              ? 'border-aerospace-400 shadow-glow-blue transform scale-105'
              : 'border-aerospace-500/30 hover:border-aerospace-400'
            }
            ${color.class === 'white' ? 'bg-white text-black' :
              color.class === 'yellow' ? 'bg-yellow-400 text-black' :
              color.class === 'green' ? 'bg-green-500 text-white' :
              color.class === 'blue' ? 'bg-blue-500 text-white' :
              color.class === 'red' ? 'bg-red-500 text-white' :
              'bg-orange-500 text-white'
            }
          `}
          onClick={() => onColorSelect(color.code)}
          title={color.name}
        >
          <span className="relative z-10">{color.name}</span>
          {selectedColor === color.code && (
            <motion.div
              layoutId="colorActiveIndicator"
              className="absolute inset-0 bg-gradient-to-r from-aerospace-500/20 to-aerospace-600/20 rounded-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}

export default ColorPalette;