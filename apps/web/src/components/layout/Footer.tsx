import { cn } from '@portfolio/ui';
import { Github, Linkedin, Mail } from 'lucide-react';

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
          <span className="font-medium text-text-secondary">Dileep T</span>. Built with Next.js 15 &amp; TypeScript.
        </p>

        <nav aria-label="Footer social links">
          <ul className="flex items-center gap-4 list-none" role="list">
            {[
              { href: 'mailto:hello@example.com', label: 'Email', icon: Mail },
              { href: 'https://github.com', label: 'GitHub', icon: Github },
              { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin },
            ].map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  aria-label={label}
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
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
