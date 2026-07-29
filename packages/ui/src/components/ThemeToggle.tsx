'use client';

/**
 * ThemeToggle Component
 * ──────────────────────
 * Accessible dark/light mode toggle using next-themes.
 * Announces state change to screen readers via aria-label.
 * Supports keyboard activation (Enter / Space).
 */
import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../lib/cn';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch — render only after mount
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          'h-10 w-10 rounded-md bg-bg-elevated animate-pulse',
          className
        )}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-md',
        'text-text-muted hover:text-text-primary hover:bg-bg-elevated',
        'transition-all duration-fast',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle };
