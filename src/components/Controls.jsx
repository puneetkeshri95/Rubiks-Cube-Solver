import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import './Controls.css';

function Controls({
  coloringMode,
  onStart,
  onScramble,
  onColorScramble,
  onSolve,
  onPause,
  onResume,
  isSolving,
  isPaused,
  isScrambling,
  onShowSolution,
  showSolutionSteps,
  humanSolving,
  onToggleHumanSolving,
  humanMethod,
  onChangeHumanMethod
}) {
  return (
    <div className="space-y-6">
      {coloringMode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="data-panel rounded-lg p-4">
            <h3 className="font-orbitron text-lg font-bold text-aerospace-200 mb-2 uppercase tracking-wider">
              Configuration Mode
            </h3>
            <p className="text-sm text-aerospace-400 font-rajdhani">
              Click on the cube stickers to color them, or use the scramble options below.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="aerospace-button px-6 py-3 rounded-lg font-exo text-sm font-semibold"
              onClick={onStart}
              disabled={isScrambling}
              aria-label="Start solving mode"
            >
              <span className="relative z-10">
                {isScrambling ? 'SCRAMBLING...' : 'INITIATE SOLVING SEQUENCE'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-aerospace-600 to-aerospace-700 hover:from-aerospace-500 hover:to-aerospace-600
                         text-white px-6 py-3 rounded-lg font-exo text-sm font-semibold border border-aerospace-500/50
                         shadow-lg hover:shadow-glow-blue transition-all duration-300"
              onClick={onScramble}
              disabled={isSolving || isScrambling}
              aria-label="Scramble the cube"
            >
              <span className="relative z-10">SCRAMBLE</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-collins-600 to-collins-700 hover:from-collins-500 hover:to-collins-600
                         text-white px-6 py-3 rounded-lg font-exo text-sm font-semibold border border-collins-500/50
                         shadow-lg hover:shadow-glow-green transition-all duration-300"
              onClick={onColorScramble}
              disabled={isSolving || isScrambling}
              aria-label="Scramble cube colors"
            >
              <span className="relative z-10">SCRAMBLE COLOURS</span>
            </motion.button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-aerospace-200 font-rajdhani">
                Human-like Solving
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleHumanSolving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-aerospace-500 focus:ring-offset-2 ${
                  humanSolving ? 'bg-aerospace-600' : 'bg-gray-600'
                }`}
                aria-label="Toggle human-like solving"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    humanSolving ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>

            {humanSolving && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-aerospace-200 mb-2 font-rajdhani">
                  Method
                </label>
                <select
                  value={humanMethod}
                  onChange={(e) => onChangeHumanMethod(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm
                             focus:outline-none focus:ring-2 focus:ring-aerospace-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner (LBL)</option>
                  <option value="advanced">Advanced (CFOP)</option>
                </select>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="data-panel rounded-lg p-4">
            <h3 className="font-orbitron text-lg font-bold text-aerospace-200 mb-2 uppercase tracking-wider">
              Solving Interface
            </h3>
            <p className="text-sm text-aerospace-400 font-rajdhani">
              Execute solving algorithms and control the animation playback.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600
                       text-white px-6 py-3 rounded-lg font-exo text-sm font-semibold border border-gray-500/50
                       shadow-lg transition-all duration-300"
            onClick={onStart}
            disabled={isSolving}
            aria-label="Back to configuration"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>←</span>
              <span>BACK TO CONFIGURATION</span>
            </span>
          </motion.button>

          <div className="grid grid-cols-1 gap-4">
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                y: -4,
                boxShadow: "0 15px 30px rgba(59, 130, 246, 0.4)",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
              }}
              whileTap={{ scale: 0.95, y: -1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="relative overflow-hidden aerospace-button px-8 py-5 rounded-xl font-exo text-lg font-bold
                         shadow-xl border-2 border-aerospace-400/50 backdrop-blur-sm"
              onClick={onSolve}
              disabled={isSolving || isScrambling}
              aria-label="Solve the cube"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <motion.span
                  animate={isSolving ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isSolving ? Infinity : 0, ease: "linear" }}
                >
                  {isSolving ? '⚡' : '🎯'}
                </motion.span>
                <span>
                  {isSolving ? 'SOLVING...' : 'EXECUTE SOLVE'}
                </span>
              </span>
            </motion.button>

            <AnimatePresence>
              {isSolving && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileHover={{
                    scale: 1.05,
                    y: -3,
                    boxShadow: isPaused
                      ? "0 15px 30px rgba(34, 197, 94, 0.4)"
                      : "0 15px 30px rgba(251, 191, 36, 0.4)"
                  }}
                  whileTap={{ scale: 0.95, y: -1 }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                  className={`relative overflow-hidden px-8 py-4 rounded-xl font-exo text-lg font-semibold
                             shadow-xl border-2 backdrop-blur-sm transition-all duration-500
                             ${isPaused
                               ? 'bg-gradient-to-r from-green-600 to-green-700 border-green-400/50 hover:from-green-500 hover:to-green-600'
                               : 'bg-gradient-to-r from-yellow-600 to-yellow-700 border-yellow-400/50 hover:from-yellow-500 hover:to-yellow-600'
                             } text-white`}
                  onClick={isPaused ? onResume : onPause}
                  aria-label={isPaused ? "Resume solving" : "Pause solving"}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <motion.span
                      animate={{ scale: isPaused ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.6, repeat: isPaused ? Infinity : 0 }}
                    >
                      {isPaused ? '▶️' : '⏸️'}
                    </motion.span>
                    <span>
                      {isPaused ? 'RESUME' : 'PAUSE'}
                    </span>
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                boxShadow: "0 15px 30px rgba(6, 182, 212, 0.4)",
                background: showSolutionSteps 
                  ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
                  : "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
              }}
              whileTap={{ scale: 0.95, y: -1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 200
              }}
              className={`relative overflow-hidden px-8 py-4 rounded-xl font-exo text-lg font-semibold
                         shadow-xl border-2 backdrop-blur-sm transition-all duration-500
                         ${showSolutionSteps 
                           ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-400/50 hover:from-red-500 hover:to-red-600' 
                           : 'bg-gradient-to-r from-collins-600 to-collins-700 border-collins-400/50 hover:from-collins-500 hover:to-collins-600'
                         } text-white`}
              onClick={onShowSolution}
              aria-label={showSolutionSteps ? "Hide solution steps" : "Show solution steps"}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <motion.span
                  animate={{ 
                    rotate: showSolutionSteps ? 180 : 0,
                    scale: showSolutionSteps ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {showSolutionSteps ? '🙈' : '👁️'}
                </motion.span>
                <span>
                  {showSolutionSteps ? 'HIDE SOLUTION' : 'SHOW SOLUTION'}
                </span>
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Controls;
