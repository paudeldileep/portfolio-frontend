import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'Privacy information for Dileep T portfolio and Engineering Notes.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-base text-text-primary">
      <header className="border-b border-border">
        <div className="container-content flex min-h-20 items-center justify-between">
          <Link
            href="/"
            className="rounded-sm font-semibold transition-colors hover:text-primary"
          >
            Dileep T
          </Link>
          <Link
            href="/"
            className="rounded-sm text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            Back to portfolio
          </Link>
        </div>
      </header>

      <main id="main-content" className="container-content w-full flex-1 py-16 sm:py-24">
        <article className="max-w-3xl">
          <p className="font-mono text-sm uppercase tracking-widest text-primary">
            Privacy
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl">Privacy notice</h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            This notice explains the limited information used by the Dileep T
            portfolio and Engineering Notes blog.
          </p>

          <div className="mt-12 space-y-10 text-text-secondary">
            <section>
              <h2 className="text-2xl">Analytics</h2>
              <p className="mt-3 leading-relaxed">
                We use Vercel Web Analytics to understand aggregate visits,
                popular pages, referrers, and broad device or location trends.
                It is configured as cookie-less analytics and is not used to
                identify you or follow you across websites.
              </p>
              <p className="mt-3 leading-relaxed">
                Vercel processes this analytics data for us. Read{' '}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4 hover:text-primary-hover"
                >
                  Vercel&apos;s Privacy Policy
                </a>{' '}
                for its data-handling details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl">Likes and sharing</h2>
              <p className="mt-3 leading-relaxed">
                Blog sharing uses your device&apos;s share tools or copies a link;
                we do not receive the contents of what you share. If anonymous
                likes are introduced, we will publish only aggregate counts and
                will not make a list of people who liked an article public.
              </p>
            </section>

            <section>
              <h2 className="text-2xl">Contact</h2>
              <p className="mt-3 leading-relaxed">
                If you have a privacy question, contact{' '}
                <a
                  href="mailto:i.am.dileept@gmail.com"
                  className="text-primary underline underline-offset-4 hover:text-primary-hover"
                >
                  i.am.dileept@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
