import { getPublishedPosts } from '@/lib/content/published-posts';
import { generateRssFeed } from '@/lib/seo/feeds';

export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(generateRssFeed(await getPublishedPosts()), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
