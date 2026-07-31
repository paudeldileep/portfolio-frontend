import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPublicEnvironment } from '@/lib/env';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('getPublicEnvironment', () => {
  it('accepts only the browser-safe admin variables', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'test-publishable-key');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.test');

    expect(getPublicEnvironment()).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-publishable-key',
      NEXT_PUBLIC_API_URL: 'https://api.example.test',
    });
  });

  it('reports variable names without exposing values', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'not-a-url');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'visible-but-invalid-context');
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');

    expect(() => getPublicEnvironment()).toThrow(
      'Admin public environment is invalid: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_API_URL'
    );
  });
});
