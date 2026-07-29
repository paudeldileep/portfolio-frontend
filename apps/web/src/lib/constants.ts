/**
 * Social Media & Contact Links Constants
 * Centralized place to manage all social media URLs and contact information
 * Update these values in one place and they'll be reflected everywhere
 */

export const SOCIAL_LINKS = {
  email: 'i.am.dileept@gmail.com',
  github: 'https://github.com/paudeldileep',
  linkedin: 'https://www.linkedin.com/in/dileepkt/',
} as const;

/**
 * Formatted URLs for use in href attributes
 */
export const SOCIAL_URLS = {
  email: `mailto:${SOCIAL_LINKS.email}`,
  github: SOCIAL_LINKS.github,
  linkedin: SOCIAL_LINKS.linkedin,
} as const;

/**
 * Social Link configuration with metadata
 * Used for rendering social link UI components
 */
export const SOCIAL_LINK_CONFIG = [
  {
    id: 'email',
    label: 'Email',
    href: SOCIAL_URLS.email,
    ariaLabel: 'Send email',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: SOCIAL_URLS.github,
    ariaLabel: 'GitHub — opens in new tab',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: SOCIAL_URLS.linkedin,
    ariaLabel: 'LinkedIn — opens in new tab',
  },
] as const;

/**
 * Personal & Brand Information
 * Update once, reflected everywhere
 */
export const PERSONAL_INFO = {
  name: 'Dileep T',
  title: 'Full Stack Engineer',
  email: SOCIAL_LINKS.email,
  fullTitle: 'Dileep T — Full Stack Engineer',
} as const;

/**
 * Tech Stack & Build Info
 */
export const TECH_STACK = {
  framework: 'Next.js 15',
  language: 'TypeScript',
  buildMessage: 'Built with Next.js 15 & TypeScript',
} as const;

/**
 * Page Metadata
 */
export const PAGE_METADATA = {
  title: PERSONAL_INFO.fullTitle,
  description: `${PERSONAL_INFO.title} specializing in web applications, design systems, and scalable architecture.`,
  keywords: ['frontend', 'engineer', 'typescript', 'react', 'next.js'],
} as const;
