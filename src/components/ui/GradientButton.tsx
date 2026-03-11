import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  loadingText?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  className = '',
  loadingText = 'Processing...',
  type = 'button',
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={`relative px-8 py-3 font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <motion.div
          className="flex items-center justify-center gap-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{loadingText}</span>
        </motion.div>
      ) : (
        children
      )}
    </motion.button>
  );
};
