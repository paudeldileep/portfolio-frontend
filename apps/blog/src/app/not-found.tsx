import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main
      id="main-content"
      className="reading-container flex min-h-[60dvh] items-center py-16"
    >
      <div>
        <p className="font-mono text-sm text-primary">404 / NOTE_NOT_FOUND</p>
        <h1 className="mt-3 text-4xl font-bold">That note is not here.</h1>
        <p className="mt-4 text-text-secondary">
          It may have moved, remained a draft, or never existed.
        </p>
        <Link
          href="/blog"
          className="mt-7 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-text-inverted transition-colors hover:bg-primary-hover"
        >
          Return to the blog
        </Link>
      </div>
    </main>
  );
}
