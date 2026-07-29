export default function Loading() {
  return (
    <main
      className="blog-container flex min-h-[60dvh] items-center justify-center py-16"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="text-center">
        <span
          aria-hidden
          className="mx-auto block h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary motion-reduce:animate-none"
        />
        <p className="mt-4 font-mono text-sm text-text-muted">
          Loading engineering notes…
        </p>
      </div>
    </main>
  );
}
