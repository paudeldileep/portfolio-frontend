import '@testing-library/jest-dom';
import { expect, Assertion, vi } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): any;
  }
}

// Mock DOM APIs that jsdom doesn't provide
Element.prototype.scrollIntoView = vi.fn();

// Extend Vitest matchers with jest-axe accessibility matchers
expect.extend(toHaveNoViolations);

// Clean up DOM after each test to avoid state leakage
afterEach(() => cleanup());
