import { describe, expect, it } from 'vitest';
import { safeNextPath } from '@/lib/navigation';

describe('safeNextPath', () => {
  it('keeps same-origin relative paths', () => {
    expect(safeNextPath('/posts?status=draft#latest')).toBe(
      '/posts?status=draft#latest'
    );
  });

  it.each([
    ['https://attacker.example', '/dashboard'],
    ['//attacker.example/path', '/dashboard'],
    ['', '/dashboard'],
  ])('rejects unsafe redirect value %s', (value, expected) => {
    expect(safeNextPath(value)).toBe(expected);
  });
});
