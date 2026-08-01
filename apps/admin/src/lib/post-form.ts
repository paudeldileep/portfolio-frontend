import { z } from 'zod';

export const postFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'A slug is required.')
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens.'),
  title: z.string().trim().min(1, 'A title is required.').max(200),
  description: z.string().trim().min(1, 'A description is required.').max(500),
  body_markdown: z.string().max(250_000),
  tags: z.array(z.string().trim().min(1).max(50)).max(20),
  featured: z.boolean(),
  image_path: z.string().trim().max(500).nullable(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export function toPostFormValues(value?: Partial<PostFormValues>): PostFormValues {
  return {
    slug: value?.slug ?? '',
    title: value?.title ?? '',
    description: value?.description ?? '',
    body_markdown: value?.body_markdown ?? '',
    tags: value?.tags ?? [],
    featured: value?.featured ?? false,
    image_path: value?.image_path ?? null,
  };
}

export function parseTags(value: string): string[] {
  return [...new Set(value.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}
