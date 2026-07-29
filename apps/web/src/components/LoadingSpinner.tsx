'use client';

import { motion } from 'framer-motion';
import { cn } from '@portfolio/ui';

interface LoadingSpinnerProps {
  /**
   * Size variant: 'sm' (24px), 'md' (40px), 'lg' (64px)
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional label text displayed below spinner
   */
  label?: string;
  /**
   * Optional className for the container
   */
  className?: string;
  /**
   * If true, show full-screen overlay (useful for page-level loading)
   */
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  label,
  className,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const spinnerSize = sizeMap[size];

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/90 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className={cn(
              'rounded-full border-3 border-border',
              'border-t-primary border-r-primary border-b-transparent border-l-transparent',
              spinnerSize
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            aria-label="Loading"
          />
          {label && (
            <motion.p
              className="text-text-muted text-sm font-medium"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {label}
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        className
      )}
    >
      <motion.div
        className={cn(
          'rounded-full border-3 border-border',
          'border-t-primary border-r-primary border-b-transparent border-l-transparent',
          spinnerSize
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        aria-label="Loading"
      />
      {label && (
        <motion.p
          className="text-text-muted text-sm font-medium"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}
