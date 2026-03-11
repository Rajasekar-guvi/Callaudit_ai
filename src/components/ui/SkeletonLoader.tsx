import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  type?: 'text' | 'card' | 'table-row' | 'button';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'text',
  count = 1,
  className = '',
}) => {
  const variants = {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
  };

  if (type === 'text') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full"
            animate="animate"
            initial="initial"
            variants={variants}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <motion.div
        className={`bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 ${className}`}
        animate="animate"
        initial="initial"
        variants={variants}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 w-3/4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6" />
        </div>
      </motion.div>
    );
  }

  if (type === 'table-row') {
    return (
      <motion.div
        className={`flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
        animate="animate"
        initial="initial"
        variants={variants}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1" />
        ))}
      </motion.div>
    );
  }

  if (type === 'button') {
    return (
      <motion.div
        className={`h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full ${className}`}
        animate="animate"
        initial="initial"
        variants={variants}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    );
  }

  return null;
};
