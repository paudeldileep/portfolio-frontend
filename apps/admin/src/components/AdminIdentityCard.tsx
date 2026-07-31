import { Badge, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui';
import type { AdminIdentity } from '@/lib/admin-api';

export function AdminIdentityCard({ identity }: { identity: AdminIdentity }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
            Verified session
          </p>
          <CardTitle className="mt-2">{identity.display_name}</CardTitle>
        </div>
        <Badge variant={identity.role === 'owner' ? 'accent' : 'default'}>
          {identity.role}
        </Badge>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm">
          <div className="grid gap-1">
            <dt className="text-text-muted">Email</dt>
            <dd className="font-medium text-text-primary">
              {identity.email ?? 'Not provided'}
            </dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-text-muted">Access</dt>
            <dd className="text-text-secondary">
              {identity.role === 'owner'
                ? 'Publishing, authors, and portfolio management'
                : 'Create, edit, and publish your own articles'}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
