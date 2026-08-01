import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPublishedPostBySlug, getPublishedPosts } from '@/lib/content/published-posts';

const apiPost = {
  slug: 'published-from-api',
  title: 'Published from the API',
  description: 'A post returned by the public publishing endpoint.',
  tags: ['Accessibility'],
  featured: false,
  image_path: null,
  published_at: '2026-08-01T12:00:00+00:00',
  author_name: 'dileep',
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('published post API', () => {
  it('maps only public API records to display-ready posts', async () => {
    vi.stubEnv('BLOG_API_URL', 'https://api.example.test');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([apiPost]), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(getPublishedPosts()).resolves.toMatchObject([
      {
        slug: 'published-from-api',
        tagSlugs: ['accessibility'],
        authorProfile: {
          name: 'Dileep T',
          role: 'Frontend-focused full-stack engineer',
        },
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/v1/posts',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    );
  });

  it('treats a missing public article as absent instead of exposing a draft', async () => {
    vi.stubEnv('BLOG_API_URL', 'https://api.example.test');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })));

    await expect(getPublishedPostBySlug('private-draft')).resolves.toBeUndefined();
  });
});
