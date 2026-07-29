'use client';

/**
 * Button Component
 * ─────────────────
 * Accessible, polymorphic button built on Radix UI Slot.
 * Variants: primary | secondary | ghost | outline | destructive
 * Sizes: sm | md | lg | icon
 *
 * WCAG 2.1 AA: visible focus ring, 4.5:1 contrast, disabled state aria handling.
 */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  // Base styles applied to every variant
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium whitespace-nowrap select-none',
    'rounded-md transition-all duration-fast easing-default',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]',
    'disabled:pointer-events-none disabled:opacity-50',
    'text-sm',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-text-inverted',
          'hover:bg-primary-hover',
          'active:scale-[0.98]',
          'shadow-sm',
        ],
        secondary: [
          'bg-bg-elevated text-text-primary border border-border',
          'hover:bg-bg-surface hover:border-border-strong',
          'active:scale-[0.98]',
        ],
        outline: [
          'border border-primary text-primary bg-transparent',
          'hover:bg-primary-subtle',
          'active:scale-[0.98]',
        ],
        ghost: [
          'text-text-secondary bg-transparent',
          'hover:bg-bg-elevated hover:text-text-primary',
        ],
        destructive: [
          'bg-error text-white',
          'hover:bg-red-700',
          'active:scale-[0.98]',
        ],
        link: [
          'text-primary underline-offset-4 hover:underline',
          'h-auto p-0',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child element (e.g., <Link>) via Radix Slot */
  asChild?: boolean;
  /** Show loading spinner and disable interactions */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            <span className="sr-only">Loading…</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
