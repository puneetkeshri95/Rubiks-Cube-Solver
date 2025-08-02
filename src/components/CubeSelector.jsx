import React from 'react';
import { motion } from 'framer-motion';
import './CubeSelector.css';

function CubeSelector({ selectedSize, onSizeChange }) {
  const sizes = [
    { value: 2, label: '2x2 Cube' },
    { value: 3, label: '3x3 Cube' },
    { value: 4, label: '4x4 Cube' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="data-panel rounded-lg p-4 mb-6"
    >
      <h2 className="font-orbitron text-lg font-bold text-aerospace-200 mb-4 uppercase tracking-wider">
        Cube Configuration
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {sizes.map((size, index) => (
          <motion.button
            key={size.value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`
              px-4 py-3 rounded-lg font-exo font-semibold text-sm transition-all duration-300
              border-2 relative overflow-hidden
              ${selectedSize === size.value
                ? 'bg-gradient-to-r from-aerospace-600 to-aerospace-700 border-aerospace-400 text-white shadow-glow-blue'
                : 'bg-black/20 border-aerospace-500/30 text-aerospace-300 hover:border-aerospace-400 hover:bg-aerospace-500/10'
              }
            `}
            onClick={() => onSizeChange(size.value)}
            aria-label={size.label}
          >
            <span className="relative z-10">{size.label}</span>
            {selectedSize === size.value && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-gradient-to-r from-aerospace-500/20 to-aerospace-600/20 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default CubeSelector;