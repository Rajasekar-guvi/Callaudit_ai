import React from 'react';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl dark:bg-slate-900/40 dark:border-slate-700/30 ${className}`}
    >
      {children}
    </div>
  );
};
