import React from 'react';
import { motion } from 'framer-motion';

interface SegmentedControlProps {
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  label,
}) => {
  return (
    <div className="mb-6">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{label}</label>}

      <div className="flex gap-3 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex-1 relative px-4 py-2.5 text-sm font-medium transition-colors"
          >
            {value === option.value && (
              <motion.div
                layoutId="activeSegment"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
                transition={{ type: 'spring', bounce: 0.2 }}
              />
            )}
            <span className={`relative z-10 ${value === option.value ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
