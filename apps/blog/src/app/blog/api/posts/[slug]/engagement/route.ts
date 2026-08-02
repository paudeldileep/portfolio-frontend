import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BLOG_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

function backendUrl(slug: string, resource = 'engagement'): string {
  if (!API_BASE_URL) {
    throw new Error('BLOG_API_URL or NEXT_PUBLIC_API_URL must be configured.');
  }

  return `${API_BASE_URL.replace(/\/$/, '')}/v1/posts/${encodeURIComponent(slug)}/${resource}`;
}

async function proxy(response: Response): Promise<NextResponse> {
  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return proxy(await fetch(backendUrl(slug), { cache: 'no-store' }));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const payload = await request.text();

  return proxy(
    await fetch(backendUrl(slug, 'likes'), {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: payload,
    }),
  );
}
