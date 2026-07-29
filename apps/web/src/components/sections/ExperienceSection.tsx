'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, Building2, Calendar } from 'lucide-react';
import { SectionHeader, cn } from '@portfolio/ui';
import type { Experience } from '@portfolio/api-client';

interface ExperienceSectionProps {
  experience: Experience[];
}

function ExperienceCard({ item, index }: { item: Experience; index: number }) {
  const [expanded, setExpanded] = React.useState(index === 0);
  const reduceMotion = useReducedMotion();
  const id = `experience-${index}`;
  const panelId = `experience-panel-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: reduceMotion ? 0 : -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.01 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-border"
    >
      {/* Timeline dot */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-0 top-2 -translate-x-1/2',
          'h-3 w-3 rounded-full border-2',
          index === 0
            ? 'border-primary bg-primary shadow-glow'
            : 'border-border-strong bg-bg-surface'
        )}
      />

      {/* Card */}
      <div
        className={cn(
          'rounded-card border bg-bg-surface',
          'transition-all duration-normal',
          'hover:border-border-strong hover:shadow-md',
          expanded ? 'border-border-strong shadow-sm' : 'border-border'
        )}
      >
        {/* Header — always visible */}
        <button
          type="button"
          id={id}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((prev) => !prev)}
          className={cn(
            'w-full flex items-start justify-between gap-4 p-6 text-left',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-inset rounded-card'
          )}
        >
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <span className="text-lg font-semibold text-text-primary">{item.role}</span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <Building2 className="h-4 w-4 shrink-0" aria-hidden />
              {item.company}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-text-muted">
              <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {item.start_date} — {item.end_date}
            </span>
          </div>
          <ChevronDown
            className={cn(
              'h-5 w-5 shrink-0 text-text-muted transition-transform duration-normal mt-1',
              expanded && 'rotate-180'
            )}
            aria-hidden
          />
        </button>

        {/* Expandable details */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-0 space-y-4 border-t border-border">
                <p className="text-sm text-text-muted leading-relaxed pt-4">{item.summary}</p>
                <ul className="space-y-2.5" role="list" aria-label={`Key highlights at ${item.company}`}>
                  {item.highlights.map((hl, hi) => (
                    <li
                      key={hi}
                      className="flex gap-3 text-sm text-text-secondary leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                      {hl}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      className="section-padding"
      aria-labelledby="experience-heading"
    >
      <div className="container-content">
        <SectionHeader
          eyebrow="Experience"
          heading="Professional Journey"
          subtext="Building high-impact products across financial services, healthcare, and enterprise technology."
          align="center"
          className="mb-14"
        />

        <div className="max-w-3xl mx-auto space-y-6">
          {experience.length > 0 ? (
            experience.map((item, i) => (
              <ExperienceCard key={`${item.company}-${i}`} item={item} index={i} />
            ))
          ) : (
            <p className="text-center text-text-muted py-12">Loading experience…</p>
          )}
        </div>
      </div>
    </section>
  );
}
