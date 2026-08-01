import { describe, expect, it } from 'vitest';
import { parseTags, postFormSchema, toPostFormValues } from '@/lib/post-form';

describe('post form contract', () => {
  it('normalizes tag input without losing valid unique tags', () => {
    expect(parseTags(' Next.js, accessibility, next.js, ')).toEqual([
      'next.js',
      'accessibility',
    ]);
  });

  it('rejects unsafe public slugs before a write request', () => {
    expect(postFormSchema.safeParse({ ...toPostFormValues(), slug: 'Not a slug' }).success).toBe(false);
  });
});
