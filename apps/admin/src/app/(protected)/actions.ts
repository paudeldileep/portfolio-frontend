'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { adminPortfolioSchema, adminPostSchema, fetchAdminApi, getVerifiedAccessToken, type AdminPortfolio } from '@/lib/admin-api';
import { portfolioProfileFormSchema, profileValuesToContent, type PortfolioProfileFormValues } from '@/lib/portfolio-form';
import { postFormSchema, type PostFormValues } from '@/lib/post-form';
import { createClient } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: 'local' });
  redirect('/login');
}

export type PostActionResult =
  | { ok: true; post: z.infer<typeof adminPostSchema> }
  | { ok: false; message: string; latestVersion?: number };

export type PortfolioActionResult =
  | { ok: true; portfolio: AdminPortfolio }
  | { ok: false; message: string; latestVersion?: number };

function failureFrom(
  response: Response,
  detail: unknown
): Extract<PostActionResult, { ok: false }> {
  const message =
    typeof detail === 'string'
      ? detail
      : typeof detail === 'object' && detail !== null && 'message' in detail
        ? String(detail.message)
        : `The request could not be completed (${response.status}).`;

  return {
    ok: false,
    message,
    latestVersion:
      typeof detail === 'object' && detail !== null && 'latest_version' in detail
        ? Number(detail.latest_version)
        : undefined,
  };
}

async function writePost(
  path: string,
  method: 'POST' | 'PATCH',
  payload: unknown
): Promise<PostActionResult> {
  const accessToken = await getVerifiedAccessToken();
  if (!accessToken) {
    return { ok: false, message: 'Your session has expired. Sign in again.' };
  }

  const response = await fetchAdminApi(path, accessToken, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    return { ok: true, post: adminPostSchema.parse(await response.json()) };
  }

  const body: unknown = await response.json().catch(() => undefined);
  const detail =
    typeof body === 'object' && body !== null && 'detail' in body ? body.detail : body;
  return failureFrom(response, detail);
}

export async function createPost(values: PostFormValues): Promise<PostActionResult> {
  const parsed = postFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the post details.' };
  }

  return writePost('/v1/admin/posts', 'POST', parsed.data);
}

export async function updatePost(
  postId: string,
  version: number,
  values: PostFormValues
): Promise<PostActionResult> {
  const parsed = postFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the post details.' };
  }

  return writePost(`/v1/admin/posts/${encodeURIComponent(postId)}`, 'PATCH', {
    ...parsed.data,
    version,
  });
}

export async function publishPost(postId: string, version: number): Promise<PostActionResult> {
  return writePost(`/v1/admin/posts/${encodeURIComponent(postId)}/publish`, 'POST', { version });
}

export async function archivePost(postId: string, version: number): Promise<PostActionResult> {
  return writePost(`/v1/admin/posts/${encodeURIComponent(postId)}/archive`, 'POST', { version });
}

export async function updatePortfolioProfile(
  portfolio: AdminPortfolio,
  values: PortfolioProfileFormValues
): Promise<PortfolioActionResult> {
  const parsed = portfolioProfileFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Check the profile details.' };
  }

  const accessToken = await getVerifiedAccessToken();
  if (!accessToken) return { ok: false, message: 'Your session has expired. Sign in again.' };

  const response = await fetchAdminApi('/v1/admin/portfolio', accessToken, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      version: portfolio.version,
      content: profileValuesToContent(portfolio, parsed.data),
    }),
  });

  if (response.ok) {
    return { ok: true, portfolio: adminPortfolioSchema.parse(await response.json()) };
  }

  const body: unknown = await response.json().catch(() => undefined);
  const detail = typeof body === 'object' && body !== null && 'detail' in body ? body.detail : body;
  const failure = failureFrom(response, detail);
  return { ok: false, message: failure.message, latestVersion: failure.latestVersion };
}

export async function updatePortfolioContent(
  portfolio: AdminPortfolio,
  content: AdminPortfolio['content']
): Promise<PortfolioActionResult> {
  const accessToken = await getVerifiedAccessToken();
  if (!accessToken) return { ok: false, message: 'Your session has expired. Sign in again.' };

  const response = await fetchAdminApi('/v1/admin/portfolio', accessToken, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: portfolio.version, content }),
  });

  if (response.ok) return { ok: true, portfolio: adminPortfolioSchema.parse(await response.json()) };

  const body: unknown = await response.json().catch(() => undefined);
  const detail = typeof body === 'object' && body !== null && 'detail' in body ? body.detail : body;
  const failure = failureFrom(response, detail);
  return { ok: false, message: failure.message, latestVersion: failure.latestVersion };
}

export async function reindexPortfolio(): Promise<{ ok: true; indexedChunks: number } | { ok: false; message: string }> {
  const accessToken = await getVerifiedAccessToken();
  if (!accessToken) return { ok: false, message: 'Your session has expired. Sign in again.' };

  const response = await fetchAdminApi('/v1/admin/portfolio/reindex', accessToken, { method: 'POST' });
  if (response.ok) {
    const body = (await response.json()) as { indexed_chunks?: number };
    return { ok: true, indexedChunks: body.indexed_chunks ?? 0 };
  }

  const body: unknown = await response.json().catch(() => undefined);
  const detail = typeof body === 'object' && body !== null && 'detail' in body ? body.detail : body;
  return { ok: false, message: typeof detail === 'string' ? detail : `Reindex failed (${response.status}).` };
}
