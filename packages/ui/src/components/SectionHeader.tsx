'use client';

/**
 * SectionHeader Component
 * ────────────────────────
 * Consistent section heading pattern: eyebrow label + heading + optional subtext.
 * Animates in on scroll via Framer Motion (respects prefers-reduced-motion).
 */
import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/cn';

interface SectionHeaderProps {
  eyebrow?: string;
  heading: string;
  subtext?: string;
  align?: 'left' | 'center';
  className?: string;
  /** HTML heading level rendered — defaults to h2 */
  as?: 'h1' | 'h2' | 'h3';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  heading,
  subtext,
  align = 'center',
  className,
  as: Tag = 'h2',
}) => {
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        align === 'left' && 'items-start text-left',
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.01 }}
      variants={containerVariants}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      )}
      <Tag className="text-3xl font-bold text-text-primary tracking-tight">
        {heading}
      </Tag>
      {subtext && (
        <p className="max-w-2xl text-lg text-text-muted leading-relaxed">
          {subtext}
        </p>
      )}
    </motion.div>
  );
};

SectionHeader.displayName = 'SectionHeader';

export { SectionHeader };
