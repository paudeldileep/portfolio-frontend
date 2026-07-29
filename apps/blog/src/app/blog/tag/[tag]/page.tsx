import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/posts/PostCard';
import {
  getPostsByTag,
  getPublishedTagSlugs,
  normalizeSlug,
} from '@/lib/content/posts';

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedTagSlugs().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Posts tagged ${tag}`,
    description: `Engineering notes filed under ${tag}.`,
    alternates: { canonical: `/blog/tag/${normalizeSlug(tag)}` },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  const displayTag =
    posts[0].tags[posts[0].tagSlugs.indexOf(normalizeSlug(tag))] ?? tag;

  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <section className="blog-container section-padding">
        <Link
          href="/blog"
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
