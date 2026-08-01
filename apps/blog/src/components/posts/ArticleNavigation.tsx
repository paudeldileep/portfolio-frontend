import Link from 'next/link';
import type { PublishedPost } from '@/lib/content/published-posts';

export function ArticleNavigation({
  previousPost,
  nextPost,
}: {
  previousPost?: PublishedPost;
  nextPost?: PublishedPost;
}) {
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <nav
      aria-label="Article navigation"
      className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {previousPost ? (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="rounded-xl border border-border p-5 transition-colors hover:border-border-strong hover:bg-bg-surface"
        >
          <span className="font-mono text-xs uppercase tracking-wide text-text-muted">
            Previous article
          </span>
          <span className="mt-2 block font-semibold">{previousPost.title}</span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="rounded-xl border border-border p-5 text-left transition-colors hover:border-border-strong hover:bg-bg-surface sm:text-right"
        >
          <span className="font-mono text-xs uppercase tracking-wide text-text-muted">
            Next article
          </span>
          <span className="mt-2 block font-semibold">{nextPost.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
