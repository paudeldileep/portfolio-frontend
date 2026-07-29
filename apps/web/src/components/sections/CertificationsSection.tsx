'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Award, GraduationCap } from 'lucide-react';
import { SectionHeader, Card, CardContent, Badge } from '@portfolio/ui';
import type { Certification, Education } from '@portfolio/api-client';

interface CertificationsSectionProps {
  certifications: Certification[];
  education: Education[];
}

export default function CertificationsSection({
  certifications,
  education,
}: CertificationsSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="certifications"
      className="section-padding"
      aria-labelledby="certifications-heading"
    >
      <div className="container-content">
        <SectionHeader
          eyebrow="Credentials"
          heading="Education & Certifications"
          subtext="Continuous learning — from formal education to cloud and AI certifications."
          align="center"
          className="mb-14"
        />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Education */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary mb-6">
              <GraduationCap className="h-5 w-5 text-primary" aria-hidden />
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.01 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{edu.degree}</p>
                        {edu.institution && (
                          <p className="text-xs text-text-muted mt-0.5">{edu.institution}</p>
                        )}
                      </div>
                      <Badge variant="success">GPA {edu.cgpa}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary mb-6">
              <Award className="h-5 w-5 text-accent" aria-hidden />
              Certifications
            </h3>
            <div className="space-y-4">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.01 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                >
                  <Card className="hover:shadow-md hover:border-border-strong transition-all duration-normal">
                    <CardContent className="pt-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{cert.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{cert.issuer}</p>
                      </div>
                      <Badge variant="accent">Verified</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
