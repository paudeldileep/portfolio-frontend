'use client';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main-content"
      className="reading-container flex min-h-[60dvh] items-center py-16"
    >
      <div>
        <p className="font-mono text-sm text-error">BLOG_RUNTIME_ERROR</p>
        <h1 className="mt-3 text-4xl font-bold">This page could not load.</h1>
        <p className="mt-4 text-text-secondary">
          The rest of the portfolio is unaffected. Try loading this page again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-text-inverted transition-colors hover:bg-primary-hover"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
