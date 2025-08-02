import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AboutSection.css';

function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="max-w-6xl mx-auto px-6 mb-8"
    >
      <div className="mission-control-panel rounded-2xl overflow-hidden">
        <motion.div
          className="cursor-pointer p-6 flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
          transition={{ duration: 0.2 }}
        >
          <div>
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-aerospace-200 uppercase tracking-wider">
              Mission Briefing
            </h2>
            <p className="font-rajdhani text-aerospace-400 mt-2">
              Algorithm Analysis & System Specifications
            </p>
          </div>
          <motion.button
            className="text-aerospace-300 hover:text-aerospace-100 text-2xl p-2 rounded-lg hover:bg-aerospace-500/20 transition-colors"
            aria-label={isExpanded ? "Collapse about section" : "Expand about section"}
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▶
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="border-t border-aerospace-500/30"
            >
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="control-interface rounded-xl p-6 h-full"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-3 h-3 bg-aerospace-500 rounded-full mr-3 animate-pulse"></div>
                      <h3 className="font-orbitron text-lg font-bold text-aerospace-200 uppercase tracking-wider">
                        Computer Algorithm
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="data-panel rounded-lg p-4">
                        <h4 className="font-rajdhani text-aerospace-300 font-semibold mb-2">
                          Kociemba's Two-Phase Algorithm
                        </h4>
                        <p className="text-sm text-aerospace-400 leading-relaxed mb-3">
                          Our default solver uses a simplified implementation of Herbert Kociemba's
                          famous two-phase algorithm, which is considered one of the most efficient
                          methods for computer-based cube solving.
                        </p>
                        <div className="space-y-2 text-xs text-aerospace-300">
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-aerospace-400 rounded-full mr-2"></span>
                            <span><strong>Phase 1:</strong> Get cube to G1 group (corners oriented, edges in slice)</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-aerospace-400 rounded-full mr-2"></span>
                            <span><strong>Phase 2:</strong> Solve the cube completely</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            <span><strong>Average moves:</strong> 18-22 moves</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                            <span><strong>Optimal for:</strong> Speed and efficiency</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2 xl:col-span-2"
                  >
                    <div className="control-interface rounded-xl p-6 h-full">
                      <div className="flex items-center mb-6">
                        <div className="w-3 h-3 bg-collins-500 rounded-full mr-3 animate-pulse"></div>
                        <h3 className="font-orbitron text-lg font-bold text-aerospace-200 uppercase tracking-wider">
                          Human-Like Solving Methods
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Layer by Layer (LBL) Method */}
                        <div className="data-panel rounded-lg p-4">
                          <h4 className="font-rajdhani text-collins-300 font-semibold mb-3 text-center">
                            Layer by Layer (LBL) - Beginner
                          </h4>
                          <div className="space-y-3">
                            <p className="text-sm text-aerospace-400 leading-relaxed">
                              The most intuitive method for beginners, solving the cube layer by layer
                              using simple, easy-to-understand algorithms.
                            </p>
                            <div className="space-y-2">
                              <div className="text-xs text-aerospace-300">
                                White Cross → White Corners → Middle Layer
                              </div>
                              <div className="text-xs text-aerospace-300">
                                Yellow Cross → Orient Last Layer → Permute Last Layer
                              </div>
                            </div>
                            <div className="space-y-2 text-xs text-aerospace-300 pt-2 border-t border-aerospace-500/30">
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                                <span><strong>Average moves:</strong> 50-100 moves</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                <span><strong>Optimal for:</strong> Learning and understanding</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* CFOP Method */}
                        <div className="data-panel rounded-lg p-4">
                          <h4 className="font-rajdhani text-collins-300 font-semibold mb-3 text-center">
                            CFOP Method - Advanced
                          </h4>
                          <div className="space-y-3">
                            <p className="text-sm text-aerospace-400 leading-relaxed">
                              The most popular speedcubing method used by competitive solvers worldwide.
                              More efficient than LBL but requires memorizing more algorithms.
                            </p>
                            <div className="space-y-2 text-xs text-aerospace-300">
                              <div className="flex items-start">
                                <span className="w-2 h-2 bg-red-400 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                                <span><strong>Cross:</strong> Solve bottom cross efficiently</span>
                              </div>
                              <div className="flex items-start">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                                <span><strong>F2L:</strong> First Two Layers simultaneously</span>
                              </div>
                              <div className="flex items-start">
                                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                                <span><strong>OLL:</strong> Orient Last Layer (57 algorithms)</span>
                              </div>
                              <div className="flex items-start">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                                <span><strong>PLL:</strong> Permute Last Layer (21 algorithms)</span>
                              </div>
                            </div>
                            <div className="space-y-2 text-xs text-aerospace-300 pt-2 border-t border-aerospace-500/30">
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                                <span><strong>Average moves:</strong> 50-60 moves</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                <span><strong>Optimal for:</strong> Speed solving competitions</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default AboutSection;
