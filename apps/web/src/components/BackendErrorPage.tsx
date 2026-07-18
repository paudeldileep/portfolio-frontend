'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Wifi, Clock } from 'lucide-react';
import { Button } from '@portfolio/ui';

interface BackendErrorPageProps {
  error: string;
  onRetry?: () => void;
}

export default function BackendErrorPage({ error, onRetry }: BackendErrorPageProps) {
  // Determine error type from message
  const isRateLimit = error.includes('429') || error.includes('rate limit');
  const isServerDown = error.includes('5') && error.includes('status');
  const isNetworkError = error.includes('Network') || error.includes('fetch');

  const errorConfig = {
    icon: isRateLimit ? Clock : isServerDown ? AlertCircle : Wifi,
    title: isRateLimit ? 'Too Many Requests' : isServerDown ? 'Server Temporarily Down' : 'Connection Error',
    description: isRateLimit
      ? "You've hit the rate limit. Please wait a minute and try again."
      : isServerDown
        ? 'The backend service is temporarily unavailable. Our team has been notified.'
        : 'Unable to connect to the backend. Please check your internet connection.',
    bgGradient: isRateLimit
      ? 'from-orange-500/10 to-yellow-500/10'
      : isServerDown
        ? 'from-red-500/10 to-pink-500/10'
        : 'from-blue-500/10 to-cyan-500/10',
    borderColor: isRateLimit ? 'border-orange-500/30' : isServerDown ? 'border-red-500/30' : 'border-blue-500/30',
    accentColor: isRateLimit ? 'text-orange-500' : isServerDown ? 'text-red-500' : 'text-blue-500',
  };

  const Icon = errorConfig.icon;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-base via-bg-surface to-bg-base px-4">
      {/* Animated background grid (optional) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-5" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon container with pulse animation */}
        <motion.div
          className={`mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br ${errorConfig.bgGradient} border-2 ${errorConfig.borderColor} flex items-center justify-center`}
          variants={itemVariants}
          animate="animate"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div variants={pulseVariants} animate="animate">
            <Icon className={`w-10 h-10 ${errorConfig.accentColor}`} />
          </motion.div>
        </motion.div>

        {/* Error title */}
        <motion.h1
          className="text-center text-2xl md:text-3xl font-bold text-text-primary mb-2"
          variants={itemVariants}
        >
          {errorConfig.title}
        </motion.h1>

        {/* Error description */}
        <motion.p className="text-center text-text-muted mb-8 leading-relaxed" variants={itemVariants}>
          {errorConfig.description}
        </motion.p>

        {/* Error details (technical) */}
        <motion.div
          className="mb-8 p-4 bg-bg-elevated rounded-lg border border-border"
          variants={itemVariants}
        >
          <p className="text-xs text-text-muted font-mono break-words">
            {error}
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div className="flex flex-col gap-3 sm:flex-row sm:gap-4" variants={itemVariants}>
          <Button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2"
            disabled={!onRetry}
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <a href="/">Go Home</a>
          </Button>
        </motion.div>

        {/* Waiting message for rate limit */}
        {isRateLimit && (
          <motion.p
            className="mt-6 text-center text-sm text-text-muted italic"
            variants={itemVariants}
            animate={{
              opacity: [0.6, 1, 0.6],
              transition: { duration: 2, repeat: Infinity },
            }}
          >
            ⏳ Please wait before retrying...
          </motion.p>
        )}

        {/* Status page link for server down */}
        {isServerDown && (
          <motion.p className="mt-6 text-center text-sm" variants={itemVariants}>
            <a
              href="https://portfolio-rag-backend-b0cm.onrender.com/health"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Check backend status →
            </a>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
