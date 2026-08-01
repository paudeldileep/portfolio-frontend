import readingTime from 'reading-time';
import { z } from 'zod';
import { AUTHORS, type AuthorProfile } from '@/config/authors';
import { extractHeadings, normalizeSlug, type PostHeading } from './posts';

const publicPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()),
  featured: z.boolean(),
  image_path: z.string().nullable(),
  published_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }).optional(),
  author_name: z.string().min(1),
});

const publicPostDetailSchema = publicPostSchema.extend({
  body_markdown: z.string(),
});

type PublicPostRecord = z.infer<typeof publicPostSchema>;

export type PublishedPost = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  tagSlugs: string[];
  featured: boolean;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  authorProfile: AuthorProfile;
  readingTime: string;
  headings: PostHeading[];
  bodyMarkdown?: string;
};

function getApiBaseUrl(): string {
  const configuredUrl = process.env.BLOG_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!configuredUrl) {
    throw new Error('BLOG_API_URL or NEXT_PUBLIC_API_URL must be configured for the API-backed blog.');
  }

  return new URL(configuredUrl).toString().replace(/\/$/, '');
}

function authorProfileFor(name: string): AuthorProfile {
  const normalizedName = normalizeSlug(name);

  return (
    Object.values(AUTHORS).find(
      (author) => author.name === name || author.id === normalizedName,
    ) ?? {
      id: normalizedName || 'author',
      name,
      role: 'Contributor',
      bio: 'Contributor to Engineering Notes.',
    }
  );
}

function toPublishedPost(record: PublicPostRecord, bodyMarkdown?: string): PublishedPost {
  const tagSlugs = record.tags.map(normalizeSlug).filter(Boolean);

  return {
    slug: normalizeSlug(record.slug),
    title: record.title,
    description: record.description,
    tags: record.tags,
    tagSlugs,
    featured: record.featured,
    image: record.image_path ?? undefined,
    publishedAt: record.published_at,
    updatedAt: record.updated_at ?? record.published_at,
    authorProfile: authorProfileFor(record.author_name),
    readingTime: readingTime(bodyMarkdown ?? record.description).text,
    headings: bodyMarkdown ? extractHeadings(bodyMarkdown) : [],
    bodyMarkdown,
  };
}

async function getPublicApi(path: string): Promise<Response> {
  return fetch(`${getApiBaseUrl()}${path}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
}

export async function getPublishedPosts(): Promise<PublishedPost[]> {
  const response = await getPublicApi('/v1/posts');
  if (!response.ok) {
    throw new Error(`Published posts service failed with status ${response.status}`);
  }

  return z
    .array(publicPostSchema)
    .parse(await response.json())
    .map((post) => toPublishedPost(post));
}

export async function getPublishedPostBySlug(slug: string): Promise<PublishedPost | undefined> {
  const response = await getPublicApi(`/v1/posts/${encodeURIComponent(normalizeSlug(slug))}`);
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new Error(`Published post service failed with status ${response.status}`);
  }

  const post = publicPostDetailSchema.parse(await response.json());
  return toPublishedPost(post, post.body_markdown);
}

export async function getPostsByTag(tag: string): Promise<PublishedPost[]> {
  const normalizedTag = normalizeSlug(tag);
  const response = await getPublicApi(`/v1/posts/tags/${encodeURIComponent(normalizedTag)}`);
  if (!response.ok) {
    throw new Error(`Published post tag service failed with status ${response.status}`);
  }

  return z.array(publicPostSchema).parse(await response.json()).map((post) => toPublishedPost(post));
}

export async function getPostNavigation(slug: string): Promise<{ previousPost?: PublishedPost; nextPost?: PublishedPost }> {
  const posts = await getPublishedPosts();
  const index = posts.findIndex((post) => post.slug === normalizeSlug(slug));
  return index === -1 ? {} : { previousPost: posts[index + 1], nextPost: posts[index - 1] };
}
