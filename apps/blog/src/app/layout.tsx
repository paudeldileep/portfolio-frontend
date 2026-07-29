import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from '@portfolio/ui';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const portfolioUrl =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Engineering Notes | Dileep T',
    template: '%s | Dileep T',
  },
  description:
    'Practical notes on frontend engineering, accessibility, architecture, and AI-augmented development.',
  alternates: {
    canonical: '/blog',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1e' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-text-inverted focus:shadow-lg"
          >
            Skip to main content
          </a>

          <div className="flex min-h-[100dvh] flex-col">
            <header className="sticky top-0 z-40 border-b border-border bg-bg-base/90 backdrop-blur">
              <nav
                className="blog-container flex min-h-20 items-center justify-between gap-4"
                aria-label="Blog navigation"
              >
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-3 rounded-md font-semibold"
                  aria-label="Dileep T Engineering Notes home"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-strong font-mono text-sm">
                    DT
                  </span>
                  <span className="hidden sm:inline">Engineering Notes</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href="/blog#latest"
                    className="hidden rounded-md px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary sm:inline-flex"
                  >
                    Articles
                  </Link>
                  <a
                    href={portfolioUrl}
                    className="rounded-md px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
                  >
                    Portfolio
                  </a>
                  <ThemeToggle />
                </div>
              </nav>
            </header>

            {children}

            <footer className="mt-auto border-t border-border py-8">
              <div className="blog-container flex flex-col gap-5 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-text-primary">
                    Engineering Notes
                  </p>
                  <p className="mt-1">Thoughtful, accessible writing.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={portfolioUrl}
                    className="rounded-sm hover:text-primary"
                  >
                    Portfolio
                  </a>
                  <Link href="/blog" className="rounded-sm hover:text-primary">
                    Articles
                  </Link>
                  <p>&copy; {new Date().getFullYear()} Dileep T.</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
