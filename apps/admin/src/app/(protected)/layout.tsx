import Link from 'next/link';
import { Badge, Button, ThemeToggle } from '@portfolio/ui';
import { requireAdminIdentity } from '@/lib/admin-api';
import { signOut } from './actions';

export const dynamic = 'force-dynamic';

const navigation = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/posts', label: 'Articles' },
  { href: '/portfolio', label: 'Portfolio' },
];

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const identity = await requireAdminIdentity();

  return (
    <div className="min-h-[100dvh]">
      <header className="sticky top-0 z-40 border-b border-border bg-bg-base/90 backdrop-blur">
        <nav
          className="admin-container flex min-h-20 items-center justify-between gap-4"
          aria-label="Admin navigation"
        >
          <Link href="/dashboard" className="flex items-center gap-3 rounded-md">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-border-strong bg-bg-surface font-mono text-xs font-semibold">
              DT
            </span>
            <span className="hidden sm:block">
              <span className="block font-semibold leading-tight">Admin Studio</span>
              <span className="block text-xs text-text-muted">Content operations</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Badge variant={identity.role === 'owner' ? 'accent' : 'default'}>
              {identity.role}
            </Badge>
            <ThemeToggle />
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </nav>

        <nav
          className="admin-container flex gap-1 overflow-x-auto pb-3"
          aria-label="Workspace sections"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main id="main-content" className="admin-container py-10 sm:py-14">
        {children}
      </main>
    </div>
  );
}
