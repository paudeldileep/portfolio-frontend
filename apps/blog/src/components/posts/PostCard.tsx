import Link from 'next/link';
import { Card, CardContent } from '@portfolio/ui';
import type { PublishedPost } from '@/lib/content/published-posts';
import { TagList } from './TagList';

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
});

export function PostCard({ post }: { post: PublishedPost }) {
  return (
    <Card className="group h-full transition-transform duration-200 hover:-translate-y-1">
      <CardContent className="flex h-full flex-col p-6 sm:p-7">
        <TagList tags={post.tags} tagSlugs={post.tagSlugs} />
        <h3 className="mt-5 text-2xl font-semibold leading-snug">
          <Link
            href={`/${post.slug}`}
            className="rounded-sm transition-colors group-hover:text-primary"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 leading-relaxed text-text-secondary">
          {post.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-muted">
          <span>{post.authorProfile.name}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt}>
            {dateFormatter.format(new Date(post.publishedAt))}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}
