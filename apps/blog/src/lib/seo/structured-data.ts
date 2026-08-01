import {
  absoluteUrl,
  DEFAULT_SOCIAL_IMAGE_PATH,
} from '@/config/site';
import type { PublishedPost } from '@/lib/content/published-posts';
import { getPostPublicUrl } from '@/lib/seo/feeds';

export function getBlogPostingStructuredData(post: PublishedPost) {
  const publicUrl = getPostPublicUrl(post);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: publicUrl,
    url: publicUrl,
    image: absoluteUrl(post.image ?? DEFAULT_SOCIAL_IMAGE_PATH),
    author: {
      '@type': 'Person',
      name: post.authorProfile.name,
    },
    publisher: {
      '@type': 'Person',
      name: post.authorProfile.name,
    },
    keywords: post.tags.join(', '),
  };
}
