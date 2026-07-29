/**
 * Tailwind CSS Preset — `@portfolio/tokens`
 * ──────────────────────────────────────────
 * Bridges CSS custom properties (from tokens) into Tailwind utility classes.
 * Import in each app's tailwind.config.ts:
 *   presets: [require('@portfolio/tokens/tailwind')]
 *
 * Result: `text-primary`, `bg-surface`, `shadow-glow`, `rounded-card`, etc.
 * work everywhere — and theme changes propagate by editing CSS vars only.
 */
import type { Config } from 'tailwindcss';

const preset: Partial<Config> = {
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds
        'bg-base':     'var(--color-bg-base)',
        'bg-surface':  'var(--color-bg-surface)',
        'bg-elevated': 'var(--color-bg-elevated)',
        'bg-code':     'var(--color-bg-code)',

        // ── Text
        'text-primary':   'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted':     'var(--color-text-muted)',
        'text-inverted':  'var(--color-text-inverted)',

        // ── Brand
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover:   'var(--color-primary-hover)',
          subtle:  'var(--color-primary-subtle)',
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover:   'var(--color-secondary-hover)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          subtle:  'var(--color-accent-subtle)',
        },

        // ── Status
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error:   'var(--color-error)',
        info:    'var(--color-info)',

        // ── Borders
        border:        'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
      },

      fontFamily: {
        sans:    ['var(--font-sans)'],
        mono:    ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },

      fontSize: {
        xs:   ['var(--text-xs)',   { lineHeight: 'var(--leading-normal)' }],
        sm:   ['var(--text-sm)',   { lineHeight: 'var(--leading-normal)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-relaxed)' }],
        lg:   ['var(--text-lg)',   { lineHeight: 'var(--leading-relaxed)' }],
        xl:   ['var(--text-xl)',   { lineHeight: 'var(--leading-snug)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-snug)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
        '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-tight)' }],
        '6xl': ['var(--text-6xl)', { lineHeight: '1' }],
      },

      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
        card: 'var(--radius-lg)',
        chat: 'var(--radius-xl)',
      },

      boxShadow: {
        sm:   'var(--shadow-sm)',
        md:   'var(--shadow-md)',
        lg:   'var(--shadow-lg)',
        xl:   'var(--shadow-xl)',
        glow: 'var(--shadow-glow)',
      },

      transitionDuration: {
        fast:   'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow:   'var(--duration-slow)',
      },

      transitionTimingFunction: {
        default: 'var(--easing-default)',
        spring:  'var(--easing-spring)',
        out:     'var(--easing-out)',
      },

      ringColor: {
        focus: 'var(--color-focus-ring)',
      },

      ringOffsetColor: {
        base: 'var(--color-bg-base)',
      },
    },
  },
};

export default preset;
