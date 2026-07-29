import { getPublishedPosts } from '@/lib/content/posts';
import { generateRssFeed } from '@/lib/seo/feeds';

export const dynamic = 'force-static';

export function GET() {
  return new Response(generateRssFeed(getPublishedPosts()), {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
