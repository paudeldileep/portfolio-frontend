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

export type AdminIdentity = z.infer<typeof adminIdentitySchema>;

export type AdminIdentityResult =
  | { status: 'authenticated'; identity: AdminIdentity }
  | { status: 'unauthenticated' }
  | { status: 'forbidden' };

async function loadAdminIdentity(): Promise<AdminIdentityResult> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims.sub) {
    return { status: 'unauthenticated' };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    return { status: 'unauthenticated' };
  }

  const response = await fetch(
    `${getPublicEnvironment().NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/v1/admin/me`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  );

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
