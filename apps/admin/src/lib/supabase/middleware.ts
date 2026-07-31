import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getPublicEnvironment } from '@/lib/env';

const protectedPrefixes = ['/dashboard', '/posts', '/portfolio'];

function isProtectedPath(pathname: string): boolean {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function redirectWithCookies(
  response: NextResponse,
  redirectUrl: URL
): NextResponse {
  const redirectResponse = NextResponse.redirect(redirectUrl);
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });
  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  const environment = getPublicEnvironment();
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: claimsData } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(claimsData?.claims.sub);

  if (!isAuthenticated && isProtectedPath(request.nextUrl.pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set(
      'next',
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );
    return redirectWithCookies(response, loginUrl);
  }

  if (isAuthenticated && request.nextUrl.pathname === '/login') {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    dashboardUrl.search = '';
    return redirectWithCookies(response, dashboardUrl);
  }

  return response;
}
