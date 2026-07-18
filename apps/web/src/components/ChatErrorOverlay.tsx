'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@portfolio/ui';

interface ChatErrorOverlayProps {
  error: string | null;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export default function ChatErrorOverlay({ error, onDismiss, onRetry }: ChatErrorOverlayProps) {
  if (!error) return null;

  const isRateLimit = error.includes('429') || error.includes('rate limit');

  const errorConfig = {
    icon: isRateLimit ? Clock : AlertCircle,
    title: isRateLimit ? 'Rate Limited' : 'Chat Error',
    bgColor: isRateLimit ? 'bg-orange-500/10' : 'bg-red-500/10',
    borderColor: isRateLimit ? 'border-orange-500/30' : 'border-red-500/30',
    accentColor: isRateLimit ? 'text-orange-500' : 'text-red-500',
  };

  const Icon = errorConfig.icon;

  return (
    <AnimatePresence>
      <motion.div
        className={`p-4 rounded-lg border-2 ${errorConfig.borderColor} ${errorConfig.bgColor} backdrop-blur-sm`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${errorConfig.accentColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <h3 className={`font-semibold ${errorConfig.accentColor} mb-1`}>{errorConfig.title}</h3>
            <p className="text-sm text-text-muted mb-3">{error}</p>

            <div className="flex gap-2">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </Button>
              )}
              {onDismiss && (
                <Button
                  onClick={onDismiss}
                  size="sm"
                  variant="ghost"
                  className="h-8"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
