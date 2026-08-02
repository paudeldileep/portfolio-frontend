import {
  absoluteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/config/site';
import type { PublishedPost } from '@/lib/content/published-posts';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function getPostPublicUrl(post: PublishedPost): string {
  return absoluteUrl(`/${post.slug}`);
}

export function generateRssFeed(posts: PublishedPost[]): string {
  const blogUrl = absoluteUrl('/');
  const feedUrl = absoluteUrl('/rss.xml');
  const lastBuildDate =
    posts.length > 0
      ? new Date(
          Math.max(
            ...posts.map((post) =>
              Date.parse(post.updatedAt ?? post.publishedAt),
            ),
          ),
        ).toUTCString()
      : new Date(0).toUTCString();

  const items = posts
    .map((post) => {
      const postUrl = getPostPublicUrl(post);
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join('');

      return [
        '<item>',
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(postUrl)}</link>`,
        `<guid isPermaLink="true">${escapeXml(postUrl)}</guid>`,
        `<description>${escapeXml(post.description)}</description>`,
        `<dc:creator>${escapeXml(post.authorProfile.name)}</dc:creator>`,
        `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
        categories,
        '</item>',
      ].join('');
    })
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '<channel>',
    `<title>${escapeXml(SITE_NAME)}</title>`,
    `<link>${escapeXml(blogUrl)}</link>`,
    `<description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    '<language>en</language>',
    `<lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    items,
    '</channel>',
    '</rss>',
  ].join('');
}

type SitemapEntry = {
  url: string;
  lastModified?: string;
};

export function getSitemapEntries(posts: PublishedPost[]): SitemapEntry[] {
  const tagSlugs = Array.from(
    new Set(posts.flatMap((post) => post.tagSlugs)),
  ).sort();

  return [
    { url: absoluteUrl('/') },
    ...tagSlugs.map((tag) => ({
      url: absoluteUrl(`/tag/${tag}`),
    })),
    ...posts.map((post) => ({
      url: getPostPublicUrl(post),
      lastModified: post.updatedAt ?? post.publishedAt,
    })),
  ];
}

export function generateSitemap(posts: PublishedPost[]): string {
  const entries = getSitemapEntries(posts)
    .map(
      ({ url, lastModified }) =>
        `<url><loc>${escapeXml(url)}</loc>${
          lastModified
            ? `<lastmod>${escapeXml(lastModified)}</lastmod>`
            : ''
        }</url>`,
    )
    .join('');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
  ].join('');
}
