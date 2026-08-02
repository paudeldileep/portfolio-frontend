import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/posts/PostCard';
import {
  DEFAULT_SOCIAL_IMAGE_PATH,
  SITE_NAME,
} from '@/config/site';
import {
  getPostsByTag,
} from '@/lib/content/published-posts';
import { normalizeSlug } from '@/lib/content/posts';

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const normalizedTag = normalizeSlug(tag);
  const posts = await getPostsByTag(normalizedTag);

  if (posts.length === 0) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const displayTag =
    posts[0].tags[posts[0].tagSlugs.indexOf(normalizedTag)] ?? tag;
  const title = `${displayTag} articles`;
  const description = `Engineering notes filed under ${displayTag}.`;
  const canonicalUrl = `/tag/${normalizedTag}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalUrl,
      images: [DEFAULT_SOCIAL_IMAGE_PATH],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_SOCIAL_IMAGE_PATH],
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  const displayTag =
    posts[0].tags[posts[0].tagSlugs.indexOf(normalizeSlug(tag))] ?? tag;

  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <section className="blog-container section-padding">
        <Link
          href="/"
          className="rounded-sm text-sm font-medium text-primary hover:underline"
        >
          &larr; All articles
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Topic
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-[1.14] tracking-[-0.008em] sm:text-5xl">
          {displayTag}
        </h1>
        <p className="mt-5 text-text-secondary">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} filed
          under this topic.
        </p>

        <ul className="mt-10 grid list-none gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
