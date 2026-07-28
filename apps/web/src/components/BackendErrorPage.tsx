'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Radio, WifiOff } from 'lucide-react';
import { Button } from '@portfolio/ui';

interface BackendErrorPageProps {
  error: string;
  onRetry?: () => void;
}

export default function BackendErrorPage({ error, onRetry }: BackendErrorPageProps) {
  const reduceMotion = useReducedMotion();
  const [isRetrying, startRetry] = React.useTransition();
  const isRateLimit = /429|rate limit/i.test(error);
  const isTimeout = /timed out|abort/i.test(error);
  const isServerDown = /server error|50[0-9]|fetch|network/i.test(error);
  const Icon = isRateLimit ? Radio : isTimeout ? WifiOff : AlertTriangle;

  const retry = () => {
    startRetry(() => {
      if (onRetry) onRetry();
      else window.location.reload();
    });
  };

  const title = isRateLimit
    ? 'Signal rate limited'
    : isTimeout
      ? 'Wake-up took too long'
      : isServerDown
        ? 'Backend temporarily offline'
        : 'Connection interrupted';

  const description = isRateLimit
    ? 'The service received too many requests. Give it a minute, then reconnect.'
    : isTimeout
      ? 'The free-tier service did not finish waking within the expected window. A retry usually resolves it.'
      : 'The portfolio service could not be reached. It may be restarting or waking from sleep.';

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#07101f] px-5 text-slate-100">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(248,113,113,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(248,113,113,.12) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          maskImage: 'radial-gradient(circle at center, black, transparent 78%)',
        }}
      />
      <div aria-hidden className="absolute h-80 w-80 rounded-full bg-rose-500/10 blur-[100px]" />

      <motion.section
        className="relative w-full max-w-xl"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-rose-300">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-400" />
          Connection exception
        </div>

        <div className="overflow-hidden rounded-2xl border border-rose-400/20 bg-slate-950/75 shadow-2xl shadow-rose-950/50 backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="ml-2 font-mono text-[11px] text-slate-500">portfolio.status</span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-rose-400/25 bg-rose-400/10 text-rose-300">
              <Icon className="h-7 w-7" aria-hidden />
            </div>

            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-rose-400">
              Error: service_unavailable
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{title}</h1>
            <p className="mt-3 leading-relaxed text-slate-400">{description}</p>

            <details className="mt-6 rounded-lg border border-white/10 bg-black/25 px-4 py-3">
              <summary className="cursor-pointer font-mono text-xs text-slate-500">
                View diagnostic details
              </summary>
              <p className="mt-3 break-words font-mono text-xs leading-relaxed text-slate-500">
                {error}
              </p>
            </details>

            <div className="mt-7">
              <Button onClick={retry} loading={isRetrying} className="w-full">
                {!isRetrying && <RefreshCw className="h-4 w-4" aria-hidden />}
                Reconnect
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-widest text-slate-600">
          Your browser and portfolio UI are working normally
        </p>
      </motion.section>
    </div>
  );
}
