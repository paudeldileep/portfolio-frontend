import { getPublishedPosts } from '@/lib/content/published-posts';
import { generateSitemap } from '@/lib/seo/feeds';

export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(generateSitemap(await getPublishedPosts()), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
