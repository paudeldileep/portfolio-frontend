import { describe, expect, it } from 'vitest';
import {
  extractHeadings,
  getPublishedPosts,
  normalizeSlug,
  parsePostSource,
  resolveAdjacentPosts,
} from '../../src/lib/content/posts';
import { getAuthor } from '../../src/config/authors';
import {
  generateRssFeed,
  generateSitemap,
  getSitemapEntries,
} from '../../src/lib/seo/feeds';
import { getBlogPostingStructuredData } from '../../src/lib/seo/structured-data';

const validPost = `---
title: "A valid article"
description: "A useful description for readers."
author: "dileep"
publishedAt: "2026-07-29T12:00:00Z"
tags:
  - "Frontend Architecture"
  - "Accessibility"
---

# Article

Enough words to calculate a reading time.
`;

describe('post content utilities', () => {
  it('exposes the configured public profile for Shraddha', () => {
    expect(getAuthor('shraddha')).toMatchObject({
      name: 'Shraddha',
      role: 'Full-stack engineer',
    });
  });

  it('normalizes filenames and tags into URL-safe slugs', () => {
    expect(normalizeSlug('  React & Accessibility  ')).toBe(
      'react-accessibility',
    );
    expect(normalizeSlug("What's New")).toBe('whats-new');
  });

  it('parses and enriches valid post metadata', () => {
    const post = parsePostSource(validPost, 'A Valid Article.mdx');

    expect(post.metadata).toMatchObject({
      slug: 'a-valid-article',
      author: 'dileep',
      tagSlugs: ['frontend-architecture', 'accessibility'],
      featured: false,
      draft: false,
    });
    expect(post.metadata.authorProfile.name).toBe('Dileep T');
    expect(post.metadata.readingTime).toMatch(/min read$/);
  });

  it('reports the filename and invalid field', () => {
    expect(() =>
      parsePostSource(
        validPost.replace('title: "A valid article"', 'title: ""'),
        'broken-post.mdx',
      ),
    ).toThrow(/broken-post\.mdx.*title/i);
  });

  it('rejects publication dates that are not ISO 8601 timestamps', () => {
    expect(() =>
      parsePostSource(
        validPost.replace(
          'publishedAt: "2026-07-29T12:00:00Z"',
          'publishedAt: "July 29, 2026"',
        ),
        'invalid-date.mdx',
      ),
    ).toThrow(/invalid-date\.mdx.*publishedAt/i);
  });

  it('rejects unknown authors', () => {
    expect(() =>
      parsePostSource(
        validPost.replace('author: "dileep"', 'author: "unknown"'),
        'unknown-author.mdx',
      ),
    ).toThrow(/unknown-author\.mdx.*author "unknown" is not configured/i);
  });

  it('rejects tags that collide after normalization', () => {
    expect(() =>
      parsePostSource(
        validPost.replace(
          '  - "Accessibility"',
          '  - "Frontend-Architecture"',
        ),
        'duplicate-tags.mdx',
      ),
    ).toThrow(/duplicate-tags\.mdx.*tags must be unique/i);
  });

  it('keeps draft files out of the published content API', () => {
    const posts = getPublishedPosts();

    expect(posts.some(({ slug }) => slug === 'draft-content-fixture')).toBe(
      false,
    );
    expect(
      posts.some(
        ({ slug }) => slug === 'building-an-accessible-content-pipeline',
      ),
    ).toBe(true);
  });

  it('extracts level-two and level-three headings with stable duplicate IDs', () => {
    expect(
      extractHeadings(`
## Start here
### Details
## Start here
# Page title is ignored
`),
    ).toEqual([
      { id: 'start-here', text: 'Start here', level: 2 },
      { id: 'details', text: 'Details', level: 3 },
      { id: 'start-here-1', text: 'Start here', level: 2 },
    ]);
  });

  it('resolves older and newer adjacent posts from publication order', () => {
    const posts = [
      { slug: 'newest' },
      { slug: 'current' },
      { slug: 'oldest' },
    ];

    expect(resolveAdjacentPosts(posts, 'current')).toEqual({
      previousPost: { slug: 'oldest' },
      nextPost: { slug: 'newest' },
    });
  });

  it('generates a draft-free RSS feed with each published post once', () => {
    const posts = getPublishedPosts();
    const feed = generateRssFeed(posts);

    expect(feed).toContain('<rss version="2.0"');
    expect(feed).toContain(
      '<atom:link href="http://localhost:3001/rss.xml"',
    );
    expect(feed.match(/<item>/g)).toHaveLength(posts.length);
    expect(feed).not.toContain('draft-content-fixture');

    for (const post of posts) {
      expect(feed.match(new RegExp(`<title>${post.title}</title>`, 'g'))).toHaveLength(
        1,
      );
    }
  });

  it('generates one sitemap entry per landing, tag, and published post route', () => {
    const posts = getPublishedPosts();
    const entries = getSitemapEntries(posts);
    const sitemap = generateSitemap(posts);
    const expectedEntryCount =
      1 + new Set(posts.flatMap((post) => post.tagSlugs)).size + posts.length;

    expect(entries).toHaveLength(expectedEntryCount);
    expect(new Set(entries.map(({ url }) => url)).size).toBe(
      expectedEntryCount,
    );
    expect(sitemap.match(/<url>/g)).toHaveLength(expectedEntryCount);
    expect(sitemap).not.toContain('draft-content-fixture');
  });

  it('builds complete BlogPosting structured data for published articles', () => {
    const post = getPublishedPosts()[0];
    const structuredData = getBlogPostingStructuredData(post);

    expect(structuredData).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.publishedAt,
      mainEntityOfPage: `http://localhost:3001/${post.slug}`,
      author: {
        '@type': 'Person',
        name: post.authorProfile.name,
      },
    });
    expect(structuredData.image).toMatch(/^http:\/\/localhost:3001\//);
  });
});
