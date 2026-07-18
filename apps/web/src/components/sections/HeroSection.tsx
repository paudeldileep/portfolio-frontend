'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@portfolio/ui';
import type { Profile } from '@portfolio/api-client';
import { SOCIAL_URLS } from '@/lib/constants';

interface HeroSectionProps {
  profile: Profile | null;
}

const TECH_BADGES = [
  { label: 'Next', imagePath: '/assets/images/nextjs.svg', className: 'top-[12%] right-[6%] bg-[#0f2746] text-[#38bdf8]', title: 'Next.js' },
  { label: 'AI', imagePath: undefined, className: 'top-[2%] left-[8%] bg-[#3a1408] text-[#f59e0b]', title: 'AI' },
  { label: 'Nd', imagePath: '/assets/images/nodejs.webp', className: 'bottom-[24%] right-[2%] bg-[#0f2746] text-[#86efac]', title: 'Node.js' },
  { label: 'React', imagePath: '/assets/images/react.webp', className: 'bottom-[8%] left-[6%] bg-[#0f2746] text-[#38bdf8]', title: 'React' },
];

const SOCIAL_LINKS = [
  { href: SOCIAL_URLS.github,  label: 'GitHub',   icon: Github   },
  { href: SOCIAL_URLS.linkedin, label: 'LinkedIn', icon: Linkedin },
  { href: SOCIAL_URLS.email,    label: 'Email',    icon: Mail     },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export default function HeroSection({ profile }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const [imageError, setImageError] = React.useState(false);
  const [badgeImageErrors, setBadgeImageErrors] = React.useState<Record<string, boolean>>({});

  const title   = profile?.title   ?? 'Senior Frontend Engineer';
  // Split title to accent the last word — e.g. "Senior Frontend Engineer" → accent "Engineer"
  const words   = title.split(' ');
  const accentWord  = words.pop();
  const titlePrefix = words.join(' ');
  const summary = profile?.summary?.[1] ?? profile?.summary?.[0] ?? '';

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[#fbfcff] dark:bg-bg-base"
      aria-label="Hero — Introduction"
    >
      {/* ── Decorative geometric background ───────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={cn(
          'absolute -top-24 right-[-14rem] h-[620px] w-[620px] rotate-[38deg] rounded-[5rem]',
          'bg-slate-100/80 dark:bg-bg-elevated/25'
        )} />
        <div className={cn(
          'absolute -bottom-24 -left-24 h-[420px] w-[420px] rotate-[35deg] rounded-[4rem]',
          'bg-slate-100/70 dark:bg-bg-elevated/10'
        )} />
        {!reduceMotion && (
          <motion.div
            className="absolute right-[6%] top-1/2 -translate-y-1/2 h-[460px] w-[460px] rounded-full bg-blue-100/70 blur-[80px] dark:bg-primary/8"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="container-content relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center min-h-[100dvh] pt-28 pb-20">

        {/* ── Left: Text ─────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="text-blue-600 dark:text-primary font-semibold text-[33px] mb-3 tracking-wide leading-none"
          >
            Hello
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-[68px] font-extrabold text-slate-800 dark:text-text-primary leading-[1.06] tracking-tight mb-3"
          >
            I&apos;m{' '}
            <span className="text-[#17365b] dark:gradient-text">Dileep T</span>
          </motion.h1>

          {/* Role — last word accented */}
          <motion.p
            variants={fadeUp}
            className="text-2xl sm:text-[38px] font-semibold text-slate-700 dark:text-text-secondary mb-5"
          >
            {titlePrefix}{' '}
            <span className="text-blue-600 dark:text-primary">{accentWord}</span>
          </motion.p>

          {/* Summary — one focused sentence */}
          {summary && (
            <motion.p
              variants={fadeUp}
              className="text-[17px] text-slate-600 dark:text-text-muted leading-relaxed max-w-xl mb-9"
            >
              {summary.length > 180 ? summary.slice(0, 180).trimEnd() + '…' : summary}
            </motion.p>
          )}

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mb-10">
            <a
              href="#about"
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold',
                'bg-[#193a5e] text-white hover:bg-[#102944]',
                'active:scale-95 transition-all duration-fast',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2'
              )}
            >
              About Me
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Download CV (coming soon)"
              aria-disabled="true"
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold',
                'border-2 border-[#193a5e] text-[#193a5e] dark:border-text-primary dark:text-text-primary',
                'cursor-not-allowed transition-all duration-fast opacity-80',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2'
              )}
            >
              Download CV
            </a>
          </motion.div>

          {/* Social links — icon row */}
          <motion.div variants={fadeUp} className="flex items-center gap-5">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                aria-label={`${label}${href.startsWith('mailto') ? '' : ' — opens in new tab'}`}
                className={cn(
                  'text-slate-600 hover:text-blue-600 dark:text-text-muted dark:hover:text-primary transition-colors duration-fast',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] rounded-sm'
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: Profile photo + floating tech badges ────────────── */}
        <motion.div
          className="relative flex items-center justify-center min-h-[560px]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        >
          <div
            aria-hidden
            className="absolute inset-0 m-auto h-[430px] w-[430px] rounded-full border-[1.5px] border-blue-300/70 dark:border-blue-300/28"
          />
          <div
            aria-hidden
            className="absolute inset-0 m-auto h-[510px] w-[510px] rounded-full border border-blue-200/60 dark:border-blue-200/16"
          />

          <div
            className={cn(
              'relative z-10 h-[520px] w-[390px] overflow-hidden',
              '[mask-image:linear-gradient(to_bottom,black_0%,black_64%,transparent_100%)]',
              '[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_64%,transparent_100%)]'
            )}
          >
            <Image
              src="/assets/images/profile.png"
              alt="Dileep Kumar — Senior Frontend Engineer"
              fill
              sizes="(max-width: 1024px) 80vw, 390px"
              className="object-contain object-top scale-[1.02]"
              priority
              onError={() => setImageError(true)}
            />
            {/* Extra soft veil at the bottom to remove hard cut-lines over light/dark backgrounds */}
            <div
              aria-hidden
              className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#fbfcff] via-[#fbfcff]/92 to-transparent dark:from-bg-base dark:via-bg-base/92"
            />
            <div
              aria-hidden
              className="absolute bottom-0 left-0 right-0 h-16 bg-[#fbfcff] dark:bg-bg-base"
            />
            <div
              aria-hidden
              className="absolute bottom-12 left-0 right-0 h-24 bg-gradient-to-t from-[#fbfcff] via-[#fbfcff]/85 to-transparent dark:from-bg-base dark:via-bg-base/85"
            />
            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-muted">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                DK
              </div>
              <p className="text-xs text-center px-4">Missing Dileep's profile image<br />profile.png</p>
              </div>
            )}
          </div>

          {/* Foreground veil: hides remaining hard lower cut-line from source image */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 bottom-[-24px] z-[19] h-[150px] w-[620px] -translate-x-1/2 rounded-[50%] bg-[#fbfcff]/96 blur-[16px] dark:bg-bg-base/96"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 bottom-[-46px] z-[18] h-[280px] w-[640px] -translate-x-1/2 rounded-[50%] bg-gradient-to-t from-[#fbfcff] via-[#fbfcff]/95 to-transparent dark:from-bg-base dark:via-bg-base/95"
          />

          {TECH_BADGES.map(({ label, imagePath, className, title }, i) => (
            <motion.div
              key={label}
              className={cn(
                'absolute z-20 flex items-center justify-center',
                'h-16 w-16 rounded-full border border-slate-200 shadow-xl dark:border-border',
                className
              )}
              animate={reduceMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
              title={title}
            >
              {imagePath && !badgeImageErrors[label] ? (
                <Image
                  src={imagePath}
                  alt={title}
                  width={40}
                  height={40}
                  className="w-8 h-8 object-contain"
                  onError={() => setBadgeImageErrors(prev => ({ ...prev, [label]: true }))}
                />
              ) : (
                <span className="text-3xl font-extrabold leading-none">{label}</span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      {!reduceMotion && (
        <motion.button
          type="button"
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-none p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 pointer-events-auto"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Scroll to about section"
          title="Scroll down"
        >
          {/* Mouse icon */}
          <div className="h-8 w-5 rounded-full border-2 border-text-muted flex items-start justify-center pt-1.5">
            <motion.div
              className="h-1.5 w-0.5 rounded-full bg-text-muted"
              animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden
            />
          </div>
        </motion.button>
      )}
    </section>
  );
}

