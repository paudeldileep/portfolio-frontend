import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

function secretsMatch(provided: string | null, expected: string | undefined) {
  if (!provided || !expected) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
  if (!secretsMatch(token, process.env.PORTFOLIO_REVALIDATE_SECRET)) {
    return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
  }

  revalidateTag('portfolio-content');
  return NextResponse.json({ revalidated: true });
}
