import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleNavigation } from '@/components/posts/ArticleNavigation';
import { TableOfContents } from '@/components/posts/TableOfContents';
import { TagList } from '@/components/posts/TagList';
import { DEFAULT_SOCIAL_IMAGE_PATH } from '@/config/site';
import {
  getPostBySlug,
  getPostNavigation,
  getPublishedPosts,
  loadPublishedPost,
} from '@/lib/content/posts';
import { getPostPublicUrl } from '@/lib/seo/feeds';
import { getBlogPostingStructuredData } from '@/lib/seo/structured-data';

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = getPostPublicUrl(post);
  const socialImage = DEFAULT_SOCIAL_IMAGE_PATH;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    authors: [{ name: post.authorProfile.name }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.authorProfile.name],
      tags: post.tags,
      url: canonicalUrl,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [socialImage],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await loadPublishedPost(slug);

  if (!post) {
    notFound();
  }

  const { previousPost, nextPost } = getPostNavigation(slug);
  const structuredData = getBlogPostingStructuredData(post);

  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <div className="article-layout blog-container section-padding">
        <article className="min-w-0">
          <Link
            href="/blog"
            className="inline-flex rounded-sm text-sm font-medium text-primary hover:underline"
          >
            &larr; All articles
          </Link>

          <header className="mt-8 border-b border-border pb-8">
            <TagList tags={post.tags} tagSlugs={post.tagSlugs} />
            <h1 className="mt-5 text-4xl font-bold leading-[1.14] tracking-[-0.008em] sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-6 text-lg leading-[1.75] tracking-[0.008em] text-text-secondary">
              {post.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-muted">
              <span className="font-medium text-text-primary">
                {post.authorProfile.name}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>
                {new Intl.DateTimeFormat('en', {
                  dateStyle: 'long',
                }).format(new Date(post.publishedAt))}
              </time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}</span>
            </div>
          </header>

          <div className="blog-prose mt-10">
            <post.Content />
          </div>

          <aside className="mt-12 rounded-2xl border border-border bg-bg-surface p-6 sm:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
              About the author
            </p>
            <h2 className="mt-3 text-xl font-semibold">
              {post.authorProfile.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-text-muted">
              {post.authorProfile.role}
            </p>
            <p className="mt-4 leading-relaxed text-text-secondary">
              {post.authorProfile.bio}
            </p>
          </aside>

          <ArticleNavigation
            previousPost={previousPost}
            nextPost={nextPost}
          />
        </article>

        <aside className="hidden lg:block">
          <TableOfContents headings={post.headings} />
        </aside>
      </div>
    </main>
  );
}
