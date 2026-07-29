'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeader, Card, CardContent } from '@portfolio/ui';
import type { Profile } from '@portfolio/api-client';

interface AboutSectionProps {
  profile: Profile | null;
}

const HIGHLIGHTS = [
  { label: '7+ Years', description: 'Enterprise frontend experience' },
  { label: 'WCAG 2.1 AA', description: 'Accessibility expert' },
  { label: 'Micro Frontends', description: 'Scalable architecture' },
  { label: 'AI / RAG', description: 'Emerging tech practitioner' },
];

export default function AboutSection({ profile }: AboutSectionProps) {
  const reduceMotion = useReducedMotion();

  const summary = profile?.summary ?? [];

  const cardVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
    }),
  };

  return (
    <section
      id="about"
      className="section-padding bg-bg-surface border-t border-border"
      aria-labelledby="about-heading"
    >
      <div className="container-content">
        <SectionHeader
          eyebrow="About"
          heading="Crafting Enterprise-Grade Experiences"
          subtext="Bridging engineering precision with user-first design thinking across regulated industries."
          align="center"
          as="h2"
          className="mb-14"
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Summary paragraphs */}
          <div className="space-y-5">
            {summary.length > 0 ? (
              summary.map((para, i) => (
                <motion.p
                  key={i}
                  className="text-base text-text-secondary leading-relaxed"
                  initial={{ opacity: 0, x: reduceMotion ? 0 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.01 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  {para}
                </motion.p>
              ))
            ) : (
              <p className="text-base text-text-muted">
                Loading profile…
              </p>
            )}
          </div>

          {/* Highlight Cards */}
          <div className="grid grid-cols-2 gap-4">
            {HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={item.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.01 }}
              >
                <Card className="h-full hover:shadow-md hover:border-border-strong transition-all duration-normal group">
                  <CardContent className="pt-6 flex flex-col gap-2">
                    <span className="text-2xl font-bold gradient-text group-hover:opacity-90">
                      {item.label}
                    </span>
                    <span className="text-sm text-text-muted">{item.description}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
