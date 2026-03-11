import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showLabel = true,
  size = 'md',
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayPercentage(Math.min(100, Math.max(0, percentage)));
    }, 50);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getColor = (percent: number) => {
    if (percent >= 85) return 'from-green-400 to-green-600';
    if (percent >= 70) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={`flex items-center gap-2`}>
      <div className={`flex-1 ${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${getColor(displayPercentage)} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-fit">
          {displayPercentage}%
        </span>
      )}
    </div>
  );
};
