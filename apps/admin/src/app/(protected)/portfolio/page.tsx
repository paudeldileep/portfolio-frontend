import { Badge, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui';
import { requireAdminIdentity } from '@/lib/admin-api';

export const metadata = {
  title: 'Portfolio',
};

export default async function PortfolioPage() {
  const identity = await requireAdminIdentity();
  const isOwner = identity.role === 'owner';

  return (
    <section className="max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            Portfolio
          </p>
          <h1 className="mt-3 text-4xl">Portfolio content</h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Profile and experience management remains isolated until publishing
            is stable.
          </p>
        </div>
        <Badge variant={isOwner ? 'accent' : 'outline'}>
          {isOwner ? 'Owner access verified' : 'Owner only'}
        </Badge>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{isOwner ? 'Management planned' : 'Restricted capability'}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-text-secondary">
          {isOwner
            ? 'ADMIN-070 will introduce typed forms and optimistic concurrency for portfolio content.'
            : 'Your author role can manage your own articles, but cannot change portfolio content.'}
        </CardContent>
      </Card>
    </section>
  );
}
