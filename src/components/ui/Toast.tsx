import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <AnimatePresence>
      <div className="fixed top-6 right-6 z-50 max-w-md space-y-3 pointer-events-none">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle className="w-5 h-5" />,
            error: <XCircle className="w-5 h-5" />,
            info: <Info className="w-5 h-5" />,
          };

          const styles = {
            success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
            error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
            info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, x: 400 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className={`flex items-start gap-3 px-4 py-3 rounded-lg border pointer-events-auto ${styles[toast.type]}`}
            >
              {icons[toast.type]}
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
};
