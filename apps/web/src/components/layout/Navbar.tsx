'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@portfolio/ui';
import { Menu, X, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { cn } from '@portfolio/ui';

const NAV_LINKS = [
  { href: '#hero',           label: 'Home' },
  { href: '#about',          label: 'About' },
  { href: '#experience',     label: 'Experience' },
  { href: '#skills',         label: 'Skills' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#contact',        label: 'Contact' },
];

const BLOG_URL =
  process.env.NEXT_PUBLIC_BLOG_URL ??
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/blog'
    : '/blog');

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('hero');
  const { scrollY } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => setScrolled(y > 40));
    return unsubscribe;
  }, [scrollY]);

  // Highlight active nav link based on scroll position
  React.useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = React.useCallback(() => setOpen(false), []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[var(--z-sticky)] transition-all duration-normal',
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200 shadow-sm dark:bg-bg-base/85 dark:border-border dark:text-text-inverted'
          : 'bg-transparent border-b border-transparent'
      )}
      role="banner"
    >
      <nav
        className="container-content flex h-20 items-center justify-between"
        aria-label="Main navigation"
      >
        {/* ── Logo ─────────────────────────────────── */}
        <Link
          href="#hero"
          className={cn(
            'flex items-center gap-2.5 select-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 rounded-sm'
          )}
          aria-label="Dileep T — Back to top"
        >
          <span className="flex items-center justify-center rounded-full px-3 py-1 border border-slate-400 text-slate-700 text-sm font-bold tracking-tight dark:border-border dark:text-text-primary">
            DT
          </span>
          <span className="font-semibold text-base text-slate-700 hidden sm:block dark:text-text-primary">
            Dileep T
          </span>
        </Link>

        {/* ── Desktop Nav Links ────────────────────── */}
        <ul className="hidden md:flex items-center gap-2 list-none" role="list">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = activeSection === href.replace('#', '');
            return (
              <li key={href}>
                <a
                  href={href}
                  className={cn(
                    'relative isolate px-4 py-2 text-[15px] font-medium rounded-full transition-all duration-fast',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2',
                    isActive
                      ? ''
                      : 'text-slate-700 hover:text-slate-900 dark:text-text-muted dark:hover:text-text-primary'
                  )}
                >
                  <span
                    className={cn(
                      'relative z-10',
                      isActive
                        ? 'text-blue-600 dark:text-primary'
                        : ''
                    )}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-blue-50 dark:bg-primary/10 -z-10 pointer-events-none"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
          <li>
            <a
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Blog (opens in a new tab)"
              className={cn(
                'relative isolate inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium',
                'text-slate-700 hover:text-blue-600 dark:text-text-muted dark:hover:text-primary',
                'transition-all duration-fast',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2'
              )}
            >
              Blog
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </li>
        </ul>

        {/* ── Right actions ────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-label="Download CV (coming soon)"
            aria-disabled="true"
            className={cn(
              'hidden md:inline-flex items-center gap-2',
              'h-10 rounded-full px-7 text-sm font-semibold',
              'bg-blue-600 text-white',
              'hover:bg-blue-700',
              'transition-all duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2'
            )}
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Download CV
          </a>

          <button
            type="button"
            className={cn(
              'md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full',
              'text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-text-muted dark:hover:text-text-primary dark:hover:bg-bg-elevated',
              'transition-all duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2'
            )}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ──────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 dark:bg-bg-base/95 dark:border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ul className="container-content flex flex-col py-3 list-none" role="list">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={handleNavClick}
                    className={cn(
                      'block rounded-lg px-4 py-3 text-sm font-medium',
                      'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-text-secondary dark:hover:bg-bg-elevated dark:hover:text-text-primary',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-inset',
                      'transition-colors duration-fast'
                    )}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={BLOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleNavClick}
                  aria-label="Blog (opens in a new tab)"
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium',
                    'text-slate-700 hover:bg-slate-100 hover:text-blue-600 dark:text-text-secondary dark:hover:bg-bg-elevated dark:hover:text-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-inset',
                    'transition-colors duration-fast'
                  )}
                >
                  Blog
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
              <li className="pt-2 pb-1">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick();
                  }}
                  aria-label="Download CV (coming soon)"
                  aria-disabled="true"
                  className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white w-fit"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  Download CV
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

