'use client';

import { motion, useReducedMotion } from 'framer-motion';

const BOOT_STEPS = [
  'Establishing secure connection',
  'Waking portfolio services',
  'Loading experience data',
];

export default function Loading() {
  const reduceMotion = useReducedMotion();

  return (
    <main
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#07101f] px-5 text-slate-100"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(56,189,248,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,.12) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          maskImage: 'radial-gradient(circle at center, black, transparent 78%)',
        }}
      />
      <div aria-hidden className="absolute h-80 w-80 rounded-full bg-sky-500/10 blur-[90px]" />

      <section className="relative w-full max-w-xl">
        <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-sky-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          System boot sequence
        </div>

        <motion.div
          className="overflow-hidden rounded-2xl border border-sky-400/20 bg-slate-950/70 shadow-2xl shadow-sky-950/60 backdrop-blur-xl"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-2 font-mono text-[11px] text-slate-500">portfolio.init</span>
          </div>

          <div className="relative space-y-5 p-6 sm:p-8">
            {!reduceMotion && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-300/70 to-transparent"
                animate={{ top: ['4%', '96%', '4%'] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <div>
              <p className="font-mono text-sm text-sky-400">
                <span className="text-emerald-400">visitor@portfolio</span>:~$ initialize
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-sky-400 align-middle" />
              </p>
              <div className="mt-5 flex items-center gap-4">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-sky-400/25 border-t-sky-300"
                    animate={reduceMotion ? undefined : { rotate: 360 }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.span
                    aria-hidden
                    className="absolute inset-2 rounded-full border border-cyan-300/20 border-b-cyan-300"
                    animate={reduceMotion ? undefined : { rotate: -360 }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.span
                    aria-hidden
                    className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,.9)]"
                    animate={reduceMotion ? undefined : { scale: [0.75, 1.25, 0.75] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                </div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  Bringing the backend online
                </h1>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                The free-tier service may need a few seconds to wake up. The portfolio will appear automatically.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {BOOT_STEPS.map((step, index) => (
                <motion.div
                  key={step}
                  className="flex items-center gap-3 text-slate-400"
                  animate={reduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 2.1, repeat: Infinity, delay: index * 0.45 }}
                >
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,.8)]"
                    animate={reduceMotion ? undefined : { scale: [0.7, 1.4, 0.7] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.35 }}
                  />
                  <span>{step}</span>
                  <span className="ml-auto text-sky-500/70">...</span>
                </motion.div>
              ))}
            </div>

            <div className="relative h-1.5 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className="absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-transparent via-sky-300 to-transparent shadow-[0_0_14px_rgba(56,189,248,.9)]"
                animate={reduceMotion ? { left: '30%' } : { left: ['-45%', '105%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>

        <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-widest text-slate-600">
          Cold starts typically take 20–30 seconds
        </p>
      </section>
    </main>
  );
}
