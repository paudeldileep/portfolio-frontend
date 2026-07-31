'use client';

import { Button } from '@portfolio/ui';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main-content"
      className="admin-container grid min-h-[70dvh] place-items-center py-14"
    >
      <div className="max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-error">
          Workspace unavailable
        </p>
        <h1 className="mt-3 text-4xl">The admin service could not be reached.</h1>
        <p className="mt-4 text-text-secondary">
          Your session is still protected. Retry after the backend finishes
          waking up, or return later.
        </p>
        <Button className="mt-7" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
