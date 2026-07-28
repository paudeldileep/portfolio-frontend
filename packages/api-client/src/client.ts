/**
 * Portfolio API Client
 * ─────────────────────
 * Typed, async fetch wrapper for the FastAPI backend.
 *
 * Features:
 * - Configurable base URL via environment variable (NEXT_PUBLIC_API_URL)
 * - Automatic retry with exponential back-off (retryable network/5xx errors only)
 * - Strict TypeScript return types via ApiResult<T> discriminated union
 * - No external dependencies — pure fetch() for minimal bundle impact
 */

import type {
  PortfolioContent,
  ChatRequest,
  ChatResponse,
  ApiResult,
} from './types';

// ── Configuration ──────────────────────────────────────────────

function getBaseUrl(): string {
  // Works in Next.js (browser & server) and Node test environments
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  throw new Error('NEXT_PUBLIC_API_URL is not configured');
}

// ── Internal helpers ───────────────────────────────────────────

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 2;
const BASE_DELAY_MS = 500;
// Render's free tier can take roughly 30 seconds to wake from sleep.
// Keep this below the former 60-second static-generation deadline while
// allowing a normal cold start to complete.
const CONTENT_REQUEST_TIMEOUT_MS = 45_000;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`Request timed out after ${timeoutMs}ms`)),
      timeoutMs
    );
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  attempt = 0
): Promise<Response> {
  try {
    const res = await fetch(url, options);

    if (!res.ok && RETRYABLE_STATUS_CODES.has(res.status) && attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, attempt + 1);
    }

    return res;
  } catch (err) {
    // Network-level error (no response) — retry
    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw err;
  }
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Fetch the canonical portfolio content document.
 * Uses ISR-friendly cache revalidation when called from Next.js Server Components.
 */
export async function getPortfolioContent(
  nextOptions?: { revalidate?: number | false; tags?: string[] }
): Promise<ApiResult<PortfolioContent>> {
  try {
    const res = await withTimeout(
      fetch(`${getBaseUrl()}/content`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Abort the underlying request where the runtime supports it. The
        // Promise timeout also protects builds whose patched fetch ignores it.
        signal: AbortSignal.timeout(CONTENT_REQUEST_TIMEOUT_MS),
        // Next.js App Router extended fetch options for ISR
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(nextOptions ? { next: nextOptions } : { cache: 'no-store' as any }),
      }),
      CONTENT_REQUEST_TIMEOUT_MS
    );

    if (!res.ok) {
      // Provide user-friendly error messages
      if (res.status === 429) {
        return {
          success: false,
          error: 'Rate limited (429): Too many requests. Please wait a moment and refresh.',
        };
      }
      if (res.status >= 500) {
        return {
          success: false,
          error: `Backend server error (${res.status}): The service is temporarily unavailable. Please try again later.`,
        };
      }
      return {
        success: false,
        error: `Failed to fetch portfolio content: ${res.status} ${res.statusText}`,
      };
    }

    const data: PortfolioContent = await res.json();
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: `Network error: ${message}` };
  }
}

/**
 * Send a chat message to the AI RAG assistant.
 * Always bypasses cache — each chat interaction is real-time.
 */
export async function sendChatMessage(
  request: ChatRequest
): Promise<ApiResult<ChatResponse>> {
  try {
    const res = await fetchWithRetry(`${getBaseUrl()}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      // Provide user-friendly error messages
      if (res.status === 429) {
        return {
          success: false,
          error: 'Rate limited (429): You are sending messages too quickly. The backend allows 10 requests per minute per IP. Please wait before trying again.',
        };
      }
      if (res.status >= 500) {
        return {
          success: false,
          error: `Backend server error (${res.status}): The AI service is temporarily unavailable. Please try again in a moment.`,
        };
      }
      return {
        success: false,
        error: `Chat request failed: ${res.status} ${res.statusText}`,
      };
    }

    const data: ChatResponse = await res.json();
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: `Connection error: ${message}` };
  }
}

/**
 * Health check — verify backend is reachable.
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${getBaseUrl()}/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
