'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeader, Badge, cn } from '@portfolio/ui';
import type { Skills } from '@portfolio/api-client';

interface SkillsSectionProps {
  skills: Skills | null;
}

const CATEGORY_META: Record<string, { label: string; description: string; color: string }> = {
  frontend_engineering: {
    label: 'Frontend Engineering',
    description: 'Core frameworks, languages & UI tooling',
    color: 'text-blue-400',
  },
  frontend_architecture_accessibility: {
    label: 'Architecture & Accessibility',
    description: 'Design systems, MFE, WCAG, and component libraries',
    color: 'text-violet-400',
  },
  performance_dev_experience: {
    label: 'Performance & DX',
    description: 'Optimization, bundling, and developer tooling',
    color: 'text-cyan-400',
  },
  backend_apis: {
    label: 'Backend & APIs',
    description: 'Server-side, REST, and microservices',
    color: 'text-emerald-400',
  },
  cloud_devops: {
    label: 'Cloud & DevOps',
    description: 'AWS, Docker, Kubernetes, and CI/CD',
    color: 'text-orange-400',
  },
  testing_quality: {
    label: 'Testing & Quality',
    description: 'Unit, integration, and automated testing',
    color: 'text-rose-400',
  },
  databases: {
    label: 'Databases',
    description: 'Relational and NoSQL data storage',
    color: 'text-yellow-400',
  },
  security: {
    label: 'Security',
    description: 'Auth, encryption, and secure coding',
    color: 'text-red-400',
  },
  ai_emerging_tech: {
    label: 'AI & Emerging Tech',
    description: 'LLMs, RAG, prompt engineering, and AI agents',
    color: 'text-pink-400',
  },
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  const categories = skills ? Object.entries(skills) : [];

  return (
    <section
      id="skills"
      className="section-padding bg-bg-surface border-t border-border"
      aria-labelledby="skills-heading"
    >
      <div className="container-content">
        <SectionHeader
          eyebrow="Skills"
          heading="Technical Expertise"
          subtext="A decade of breadth — from React component atoms to AWS-deployed micro-frontend ecosystems."
          align="center"
          className="mb-14"
        />

        {skills ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(([key, items], i) => {
              const meta = CATEGORY_META[key];
              const isActive = activeCategory === key;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.01 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <div
                    role="region"
                    aria-label={meta?.label ?? key}
                    className={cn(
                      'rounded-card border bg-bg-surface p-6',
                      'transition-all duration-normal cursor-pointer',
                      isActive
                        ? 'border-primary shadow-md shadow-primary/10'
                        : 'border-border hover:border-border-strong hover:shadow-sm'
                    )}
                    onClick={() => setActiveCategory(isActive ? null : key)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveCategory(isActive ? null : key);
                      }
                    }}
                    tabIndex={0}
                    aria-expanded={isActive}
                  >
                    {/* Category Header */}
                    <div className="flex flex-col gap-1 mb-4">
                      <h3 className={cn('text-sm font-semibold', meta?.color ?? 'text-primary')}>
                        {meta?.label ?? key}
                      </h3>
                      <p className="text-xs text-text-muted">{meta?.description}</p>
                    </div>

                    {/* Skill Tags */}
                    <div
                      className="flex flex-wrap gap-2"
                      aria-label={`Skills in ${meta?.label ?? key}`}
                    >
                      {(isActive ? items : items.slice(0, 6)).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {!isActive && items.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{items.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-text-muted py-12">Loading skills…</p>
        )}
      </div>
    </section>
  );
}
