import Link from 'next/link';
import { Badge } from '@portfolio/ui';
import { PostCard } from '@/components/posts/PostCard';
import { TagList } from '@/components/posts/TagList';
import { getPublishedPosts } from '@/lib/content/published-posts';

export const dynamic = 'force-dynamic';

export default async function BlogLandingPage() {
  const posts = await getPublishedPosts();
  const featuredPost = posts.find((post) => post.featured) ?? posts[0];
  const recentPosts = posts.filter((post) => post.slug !== featuredPost?.slug);

  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <section className="blog-container section-padding grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:items-center">
        <div>
          <Badge variant="outline" className="mb-5">
            Engineering notes
          </Badge>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.14] tracking-[-0.008em] sm:text-5xl lg:text-6xl">
            Notes from building for the modern web.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-[1.75] tracking-[0.008em] text-text-secondary">
            Practical writing about accessible interfaces, durable frontend
            architecture, and responsible AI-augmented development.
          </p>
        </div>

        {featuredPost ? (
          <article className="overflow-hidden rounded-2xl border border-border bg-bg-surface shadow-md">
            {featuredPost.image ? (
              <div
                className="aspect-[16/8] border-b border-border bg-bg-elevated bg-cover bg-center"
                style={{ backgroundImage: `url(${featuredPost.image})` }}
                aria-hidden="true"
              />
            ) : null}
            <div className="p-6 sm:p-7">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                Featured article
              </p>
              <h2 className="mt-4 text-2xl font-semibold leading-snug">
                <Link
                  href={`/${featuredPost.slug}`}
                  className="rounded-sm hover:text-primary"
                >
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {featuredPost.description}
              </p>
              <div className="mt-5">
                <TagList
                  tags={featuredPost.tags}
                  tagSlugs={featuredPost.tagSlugs}
                />
              </div>
            </div>
          </article>
        ) : null}
      </section>

      <section
        id="latest"
        className="scroll-mt-20 border-y border-border bg-bg-surface"
        aria-labelledby="published-posts-heading"
      >
        <div className="blog-container section-padding">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            Published writing
          </p>
          <h2 id="published-posts-heading" className="mt-3 text-3xl font-bold">
            Recent articles
          </h2>

          {recentPosts.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-border-strong bg-bg-base p-8 sm:p-10">
              <h3 className="text-xl font-semibold">
                More notes are on the way.
              </h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
                The first article is available above. New writing will appear
                here as it is reviewed and published.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
