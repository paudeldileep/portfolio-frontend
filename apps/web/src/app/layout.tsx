import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import { PageLoadingProvider } from '@/providers/PageLoadingProvider';
import { PERSONAL_INFO } from '@/lib/constants';
import './globals.css';

// ── Font Loading ───────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  // Preload common weight variants
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

// ── Metadata ───────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: PERSONAL_INFO.fullTitle,
    template: `%s | ${PERSONAL_INFO.name}`,
  },
  description:
    'Senior Frontend Engineer with 7+ years building scalable, accessible enterprise applications. Expertise in React, TypeScript, Angular, micro-frontends, and AI-augmented development.',
  keywords: [
    'Frontend Engineer',
    'React',
    'TypeScript',
    'Angular',
    'Micro Frontends',
    'Design Systems',
    'WCAG',
    'Accessibility',
    'Next.js',
    'Full Stack Engineer',
    'AI-augmented development',
    'Portfolio',
  ],
  authors: [{ name: PERSONAL_INFO.name }],
  creator: PERSONAL_INFO.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: PERSONAL_INFO.fullTitle,
    description:
      'Senior Frontend Engineer specializing in scalable, accessible enterprise web applications.',
    siteName: `${PERSONAL_INFO.name} Portfolio`,
    images: [
      {
        url: '/assets/images/profile.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: {
    icon: '/assets/images/profile.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: PERSONAL_INFO.fullTitle,
    description:
      'Senior Frontend Engineer specializing in scalable, accessible enterprise web applications.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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

// ── Root Layout ────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <PageLoadingProvider>
            {/* Skip navigation — WCAG 2.1 AA bypass block */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-toast)] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-text-inverted focus:shadow-lg"
            >
              Skip to main content
            </a>

            {children}
          </PageLoadingProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
