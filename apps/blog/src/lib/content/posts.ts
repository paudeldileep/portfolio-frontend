import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { z } from 'zod';
import { getAuthor, type AuthorProfile } from '@/config/authors';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');
const POST_EXTENSION = '.mdx';

const isoDateSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.iso.datetime({ offset: true }),
);

export const postMetadataSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(240),
    author: z.string().trim().min(1),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema.optional(),
    tags: z.array(z.string().trim().min(1).max(40)).min(1),
    image: z.string().trim().min(1).optional(),
    featured: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
    canonicalUrl: z.url().optional(),
  })
  .strict();

export type PostMetadata = z.infer<typeof postMetadataSchema>;

export type PostSummary = PostMetadata & {
  slug: string;
  tagSlugs: string[];
  readingTime: string;
  authorProfile: AuthorProfile;
  headings: PostHeading[];
};

export type PostHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

type ParsedPost = {
  metadata: PostSummary;
  body: string;
};

export function normalizeSlug(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanHeadingText(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim();
}

export function extractHeadings(content: string): PostHeading[] {
  const slugCounts = new Map<string, number>();
  const headings: PostHeading[] = [];

  for (const match of content.matchAll(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm)) {
    const text = cleanHeadingText(match[2]);
    const baseId = normalizeSlug(text);
    if (!baseId) {
      continue;
    }

    const occurrence = slugCounts.get(baseId) ?? 0;
    slugCounts.set(baseId, occurrence + 1);
    headings.push({
      id: occurrence === 0 ? baseId : `${baseId}-${occurrence}`,
      text,
      level: match[1].length as 2 | 3,
    });
  }

  return headings;
}

function formatValidationError(filename: string, error: z.ZodError): Error {
  const details = error.issues
    .map((issue) => `${issue.path.join('.') || 'frontmatter'}: ${issue.message}`)
    .join('; ');

  return new Error(`Invalid post metadata in ${filename}: ${details}`);
}

export function parsePostSource(source: string, filename: string): ParsedPost {
  const { data, content } = matter(source);
  const parsed = postMetadataSchema.safeParse(data);

  if (!parsed.success) {
    throw formatValidationError(filename, parsed.error);
  }

  const slug = normalizeSlug(path.basename(filename, POST_EXTENSION));
  if (!slug) {
    throw new Error(`Invalid post filename "${filename}": slug is empty.`);
  }

  const authorProfile = getAuthor(parsed.data.author);
  if (!authorProfile) {
    throw new Error(
      `Invalid post metadata in ${filename}: author "${parsed.data.author}" is not configured.`,
    );
  }

  const tagSlugs = parsed.data.tags.map(normalizeSlug);
  if (tagSlugs.some((tagSlug) => !tagSlug)) {
    throw new Error(
      `Invalid post metadata in ${filename}: every tag must produce a non-empty slug.`,
    );
  }

  if (new Set(tagSlugs).size !== tagSlugs.length) {
    throw new Error(
      `Invalid post metadata in ${filename}: tags must be unique after normalization.`,
    );
  }

  return {
    metadata: {
      ...parsed.data,
      slug,
      tagSlugs,
      readingTime: readingTime(content).text,
      authorProfile,
      headings: extractHeadings(content),
    },
    body: content,
  };
}

function getPostFilenames(): string[] {
  return readdirSync(POSTS_DIRECTORY)
    .filter((filename) => filename.endsWith(POST_EXTENSION))
    .sort();
}

function readPost(filename: string): ParsedPost {
  const fullPath = path.join(POSTS_DIRECTORY, filename);
  return parsePostSource(readFileSync(fullPath, 'utf8'), filename);
}

function readAllPosts(): ParsedPost[] {
  const posts = getPostFilenames().map(readPost);
  const slugs = posts.map(({ metadata }) => metadata.slug);

  if (new Set(slugs).size !== slugs.length) {
    throw new Error('Post filenames must produce unique normalized slugs.');
  }

  return posts.sort(
    (left, right) =>
      Date.parse(right.metadata.publishedAt) -
      Date.parse(left.metadata.publishedAt),
  );
}

export function getPublishedPosts(): PostSummary[] {
  return readAllPosts()
    .filter(({ metadata }) => !metadata.draft)
    .map(({ metadata }) => metadata);
}

export function getPostBySlug(slug: string): PostSummary | undefined {
  const normalizedSlug = normalizeSlug(slug);
  return getPublishedPosts().find((post) => post.slug === normalizedSlug);
}

export function getPostsByTag(tag: string): PostSummary[] {
  const normalizedTag = normalizeSlug(tag);
  return getPublishedPosts().filter((post) =>
    post.tagSlugs.includes(normalizedTag),
  );
}

export function getPublishedTagSlugs(): string[] {
  return Array.from(
    new Set(getPublishedPosts().flatMap((post) => post.tagSlugs)),
  ).sort();
}

export function resolveAdjacentPosts<T extends { slug: string }>(
  posts: T[],
  slug: string,
): {
  previousPost?: T;
  nextPost?: T;
} {
  const index = posts.findIndex((post) => post.slug === normalizeSlug(slug));
  if (index === -1) {
    return {};
  }

  return {
    previousPost: posts[index + 1],
    nextPost: posts[index - 1],
  };
}

export function getPostNavigation(slug: string): {
  previousPost?: PostSummary;
  nextPost?: PostSummary;
} {
  return resolveAdjacentPosts(getPublishedPosts(), slug);
}

export async function loadPublishedPost(slug: string) {
  const post = getPostBySlug(slug);
  if (!post) {
    return undefined;
  }

  const postModule = await import(`../../../content/posts/${post.slug}.mdx`);
  return { ...post, Content: postModule.default };
}
