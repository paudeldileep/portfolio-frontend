import { getPublishedPosts } from '@/lib/content/posts';
import { generateSitemap } from '@/lib/seo/feeds';

export const dynamic = 'force-static';

export function GET() {
  return new Response(generateSitemap(getPublishedPosts()), {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
