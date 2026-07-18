'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';
import { SectionHeader, Button, cn } from '@portfolio/ui';

export default function ContactSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      className="section-padding bg-bg-surface border-t border-border"
      aria-labelledby="contact-heading"
    >
      <div className="container-content">
        <SectionHeader
          eyebrow="Contact"
          heading="Let's Build Something Great"
          subtext="Open to senior frontend, full-stack, and architecture roles. Let's talk."
          align="center"
          className="mb-12"
        />

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Button asChild size="lg">
            <a href="mailto:hello@example.com" aria-label="Send email">
              <Mail className="h-4 w-4" aria-hidden />
              Send a message
            </a>
          </Button>
          <Button variant="outline" asChild size="lg">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn — opens in new tab"
            >
              <Linkedin className="h-4 w-4" aria-hidden />
              LinkedIn
            </a>
          </Button>
          <Button variant="ghost" asChild size="lg">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub — opens in new tab"
            >
              <Github className="h-4 w-4" aria-hidden />
              GitHub
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
