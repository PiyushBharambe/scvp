import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  const skeletonVariants = {
    loading: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (type === 'card') {
    return (
      <div className="space-y-6">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className="glass-effect p-6 rounded-2xl shadow-lg border border-white/30"
            variants={skeletonVariants}
            animate="loading"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-gray-300 dark:bg-slate-500 rounded-full mr-3"></div>
                  <div className="h-6 bg-gray-300 dark:bg-slate-500 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-slate-500 rounded w-3/4 mb-2"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-6 bg-gray-300 dark:bg-slate-500 rounded w-20"></div>
                <div className="h-8 w-8 bg-gray-300 dark:bg-slate-500 rounded-xl"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/30 dark:bg-slate-700/30 p-3 rounded-xl">
                <div className="h-4 bg-gray-300 dark:bg-slate-500 rounded w-16 mb-1"></div>
                <div className="h-4 bg-gray-300 dark:bg-slate-500 rounded w-24"></div>
              </div>
              <div className="bg-white/30 dark:bg-slate-700/30 p-3 rounded-xl">
                <div className="h-4 bg-gray-300 dark:bg-slate-500 rounded w-20 mb-1"></div>
                <div className="h-4 bg-gray-300 dark:bg-slate-500 rounded w-28"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <motion.div
        className="glass-effect p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl h-full"
        variants={skeletonVariants}
        animate="loading"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gray-300 dark:bg-slate-500 rounded-2xl mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 dark:bg-slate-500 rounded w-32 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-slate-500 rounded w-48 mx-auto"></div>
        </div>
        <div className="flex items-center justify-center" style={{ height: '300px' }}>
          <div className="w-48 h-48 bg-gray-300 dark:bg-slate-500 rounded-full"></div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default LoadingSkeleton;