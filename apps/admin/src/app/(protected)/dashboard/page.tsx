import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@portfolio/ui';
import { AdminIdentityCard } from '@/components/AdminIdentityCard';
import { requireAdminIdentity } from '@/lib/admin-api';

export const metadata = {
  title: 'Overview',
};

const capabilities = [
  {
    eyebrow: 'Publishing',
    title: 'Article workspace',
    description:
      'Draft, preview, publish, and archive Markdown articles with conflict-safe saves.',
    status: 'Next milestone',
  },
  {
    eyebrow: 'Portfolio',
    title: 'Content management',
    description:
      'Owner-only editing for profile, experience, skills, and project content.',
    status: 'Planned',
  },
  {
    eyebrow: 'Operations',
    title: 'One secure identity',
    description:
      'Supabase handles sessions while FastAPI remains the source of role permissions.',
    status: 'Active',
  },
];

export default async function DashboardPage() {
  const identity = await requireAdminIdentity();

  return (
    <div className="space-y-10">
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Workspace overview
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl">
          Content operations, without the deployment ceremony.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-text-secondary">
          This private studio will become the control surface for your blog and
          portfolio. Authentication and role verification are active now.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-5 sm:grid-cols-2">
          {capabilities.map((capability) => (
            <Card key={capability.title} className="first:sm:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
                    {capability.eyebrow}
                  </p>
                  <span className="text-xs font-medium text-text-muted">
                    {capability.status}
                  </span>
                </div>
                <CardTitle>{capability.title}</CardTitle>
                <CardDescription>{capability.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <AdminIdentityCard identity={identity} />
      </section>
    </div>
  );
}
