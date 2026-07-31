import Link from 'next/link';
import { Button } from '@portfolio/ui';

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="admin-container grid min-h-[70dvh] place-items-center py-14"
    >
      <div className="max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          404
        </p>
        <h1 className="mt-3 text-4xl">Workspace page not found</h1>
        <p className="mt-4 text-text-secondary">
          The requested admin route does not exist.
        </p>
        <Button asChild className="mt-7">
          <Link href="/dashboard">Return to overview</Link>
        </Button>
      </div>
    </main>
  );
}
