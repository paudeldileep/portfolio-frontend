import 'server-only';

import { cache } from 'react';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getPublicEnvironment } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

const adminIdentitySchema = z.object({
  email: z.email().nullable(),
  display_name: z.string().min(1),
  role: z.enum(['owner', 'author']),
});

const postStatusSchema = z.enum(['draft', 'published', 'archived']);

export const adminPostSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body_markdown: z.string(),
  tags: z.array(z.string()),
  status: postStatusSchema,
  author_id: z.string().uuid(),
  author_name: z.string(),
  featured: z.boolean(),
  image_path: z.string().nullable(),
  published_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  version: z.number().int().positive(),
});

export type AdminIdentity = z.infer<typeof adminIdentitySchema>;
export type AdminPost = z.infer<typeof adminPostSchema>;

export type AdminIdentityResult =
  | { status: 'authenticated'; identity: AdminIdentity }
  | { status: 'unauthenticated' }
  | { status: 'forbidden' };

async function loadAdminIdentity(): Promise<AdminIdentityResult> {
  const accessToken = await getVerifiedAccessToken();
  if (!accessToken) {
    return { status: 'unauthenticated' };
  }

  const response = await fetchAdminApi('/v1/admin/me', accessToken);

  if (response.status === 401) {
    return { status: 'unauthenticated' };
  }
  if (response.status === 403) {
    return { status: 'forbidden' };
  }
  if (!response.ok) {
    throw new Error(`Admin identity service failed with status ${response.status}`);
  }

  return {
    status: 'authenticated',
    identity: adminIdentitySchema.parse(await response.json()),
  };
}

export async function getVerifiedAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims.sub) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    return null;
  }

  return session.access_token;
}

export async function fetchAdminApi(path: string, accessToken: string, init?: RequestInit) {
  return fetch(
    `${getPublicEnvironment().NEXT_PUBLIC_API_URL.replace(/\/$/, '')}${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        ...init?.headers,
      },
      cache: 'no-store',
    }
  );
}

export async function getAdminPosts(): Promise<AdminPost[]> {
  const accessToken = await getVerifiedAccessToken();
  if (!accessToken) {
    redirect('/login');
  }

  const response = await fetchAdminApi('/v1/admin/posts', accessToken);
  if (response.status === 401) redirect('/login');
  if (response.status === 403) redirect('/unauthorized');
  if (!response.ok) {
    throw new Error(`Admin posts service failed with status ${response.status}`);
  }

  return z.array(adminPostSchema).parse(await response.json());
}

export async function getAdminPost(postId: string): Promise<AdminPost> {
  const accessToken = await getVerifiedAccessToken();
  if (!accessToken) redirect('/login');

  const response = await fetchAdminApi(`/v1/admin/posts/${encodeURIComponent(postId)}`, accessToken);
  if (response.status === 401) redirect('/login');
  if (response.status === 403) redirect('/unauthorized');
  if (response.status === 404) redirect('/posts');
  if (!response.ok) {
    throw new Error(`Admin post service failed with status ${response.status}`);
  }

  return adminPostSchema.parse(await response.json());
}

export const getAdminIdentity = cache(loadAdminIdentity);

export async function requireAdminIdentity(): Promise<AdminIdentity> {
  const result = await getAdminIdentity();
  if (result.status === 'unauthenticated') {
    redirect('/login');
  }
  if (result.status === 'forbidden') {
    redirect('/unauthorized');
  }
  return result.identity;
}
