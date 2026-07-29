import { describe, expect, it } from 'vitest';
import {
  getBlogZoneRewrites,
  normalizeBlogOrigin,
} from '../../src/config/blog-zone';

describe('blog zone configuration', () => {
  it('keeps rewrites disabled when BLOG_ORIGIN is not configured', () => {
    expect(getBlogZoneRewrites(undefined)).toEqual([]);
  });

  it('normalizes the deployment origin and creates all proxy rewrites', () => {
    const origin = 'https://iamdileep-blog.vercel.app/';

    expect(normalizeBlogOrigin(origin)).toBe(
      'https://iamdileep-blog.vercel.app',
    );
    expect(getBlogZoneRewrites(origin)).toEqual([
      {
        source: '/blog-static/:path*',
        destination:
          'https://iamdileep-blog.vercel.app/blog-static/:path*',
      },
      {
        source: '/blog',
        destination: 'https://iamdileep-blog.vercel.app/blog',
      },
      {
        source: '/blog/:path*',
        destination: 'https://iamdileep-blog.vercel.app/blog/:path*',
      },
    ]);
  });

  it.each([
    'iamdileep-blog.vercel.app',
    'ftp://iamdileep-blog.vercel.app',
    'https://iamdileep-blog.vercel.app/blog',
    'https://user:secret@iamdileep-blog.vercel.app',
  ])('rejects an unsafe or malformed origin: %s', (origin) => {
    expect(() => normalizeBlogOrigin(origin)).toThrow(/BLOG_ORIGIN/);
  });
});
