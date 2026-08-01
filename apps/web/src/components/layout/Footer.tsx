import { cn } from '@portfolio/ui';
import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { SOCIAL_LINK_CONFIG, PERSONAL_INFO, TECH_STACK } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border py-8 bg-bg-base"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container-content flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <p>
          &copy; {year}{' '}
          <span className="font-medium text-text-secondary">{PERSONAL_INFO.name}</span>. {TECH_STACK.buildMessage}.
        </p>

        <div className="flex items-center gap-5">
          <Link
            href="/privacy"
            className="rounded-sm text-sm text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
          >
            Privacy
          </Link>
          <nav aria-label="Footer social links">
          <ul className="flex items-center gap-4 list-none" role="list">
            {SOCIAL_LINK_CONFIG.map(({ href, id, ariaLabel: ariaLabelProp }) => {
              const Icon = { email: Mail, github: Github, linkedin: Linkedin }[id];
              return (
                <li key={id}>
                  <a
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    aria-label={ariaLabelProp}
                    className={cn(
                      'inline-flex h-8 w-8 items-center justify-center rounded-md',
                      'hover:text-text-primary hover:bg-bg-elevated',
                      'transition-colors duration-fast',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2'
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
