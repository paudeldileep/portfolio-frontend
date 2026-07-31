import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { safeNextPath } from '@/lib/navigation';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type') as EmailOtpType | null;
  const nextPath = safeNextPath(request.nextUrl.searchParams.get('next'));
  const supabase = await createClient();

  let error: Error | null = null;
  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }));
  } else {
    error = new Error('Missing authentication callback parameters');
  }

  const redirectUrl = new URL(error ? '/login' : nextPath, request.url);
  if (error) {
    redirectUrl.searchParams.set('error', 'callback');
  }

  return NextResponse.redirect(redirectUrl);
}
