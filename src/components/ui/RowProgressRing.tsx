import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RowProgressRingProps {
  submissionId: string;
  status: string;
  processingIds: Set<string>;
}

const SIZE   = 28;
const STROKE = 3;
const R      = (SIZE - STROKE) / 2;
const CIRC   = 2 * Math.PI * R;

export const RowProgressRing: React.FC<RowProgressRingProps> = ({
  submissionId,
  status,
  processingIds,
}) => {
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'done' | 'hidden'>('idle');

  const isProcessing = processingIds.has(submissionId);
  const isDone       = !isProcessing && (status === 'passed' || status === 'flagged' || status === 'failed');

  useEffect(() => {
    if (isProcessing) {
      setPhase('spinning');
    }
  }, [isProcessing]);

  useEffect(() => {
    if (phase === 'spinning' && isDone) {
      setPhase('done');
      const timer = setTimeout(() => setPhase('hidden'), 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, isDone]);

  if (phase === 'idle' || (phase as string) === 'hidden') return null;

  return (
    <AnimatePresence>
      {(phase === 'spinning' || phase === 'done') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
          style={{ width: SIZE, height: SIZE }}
        >
          {phase === 'spinning' && (
            <motion.svg
              width={SIZE} height={SIZE}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              {/* Track */}
              <circle
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                fill="none"
                stroke="rgba(99,102,241,0.2)"
                strokeWidth={STROKE}
              />
              {/* Spinning arc */}
              <circle
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                fill="none"
                stroke="url(#spinGrad)"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * 0.25}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              />
              <defs>
                <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </motion.svg>
          )}

          {phase === 'done' && (
            <motion.svg
              width={SIZE} height={SIZE}
              initial={{ rotate: -90 }}
              animate={{ rotate: -90 }}
            >
              {/* Full green circle */}
              <motion.circle
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                fill="none"
                stroke="#22c55e"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              {/* Checkmark */}
              <motion.path
                d={`M ${SIZE * 0.28} ${SIZE * 0.5} L ${SIZE * 0.44} ${SIZE * 0.66} L ${SIZE * 0.72} ${SIZE * 0.36}`}
                fill="none"
                stroke="#22c55e"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              />
            </motion.svg>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};