import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SolutionDisplay.css';

function SolutionDisplay({ solution, currentStep, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && solution && solution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="mt-6"
        >
          <div className="control-interface rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-orbitron text-lg font-bold text-aerospace-200 uppercase tracking-wider">
                Solution Sequence
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-rajdhani text-sm text-aerospace-300">
                  Step {currentStep + 1} of {solution.length}
                </span>
              </div>
            </div>

            <div className="data-panel rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {solution.map((move, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`
                      px-3 py-2 rounded-lg font-exo font-bold text-sm border transition-all duration-300
                      ${index === currentStep
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400 text-black shadow-lg animate-pulse'
                        : index < currentStep
                          ? 'bg-gradient-to-r from-green-600 to-green-700 border-green-400 text-white'
                          : 'bg-black/30 border-aerospace-500/30 text-aerospace-300'
                      }
                    `}
                  >
                    {move}
                  </motion.span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-aerospace-400">
                <span>Progress: {Math.round((currentStep / solution.length) * 100)}%</span>
                <span>Remaining: {solution.length - currentStep} moves</span>
              </div>

              <div className="mt-2 w-full bg-black/30 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-aerospace-500 to-aerospace-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / solution.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SolutionDisplay;