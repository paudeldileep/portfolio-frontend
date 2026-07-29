'use client';

/**
 * Badge Component
 * ────────────────
 * Inline status indicators — skill tags, certification labels, role highlights.
 * WCAG 2.1 AA: sufficient contrast across all variants in both themes.
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-primary-subtle text-primary border border-primary/20',
        secondary:   'bg-bg-elevated text-text-secondary border border-border',
        accent:      'bg-accent-subtle text-accent border border-accent/20',
        success:     'bg-green-500/10 text-success border border-green-500/20',
        warning:     'bg-amber-500/10 text-warning border border-amber-500/20',
        error:       'bg-red-500/10 text-error border border-red-500/20',
        outline:     'border border-border text-text-muted bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
