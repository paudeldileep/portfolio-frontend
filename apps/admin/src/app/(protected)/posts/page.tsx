import Link from 'next/link';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui';
import { getAdminPosts } from '@/lib/admin-api';

export const metadata = { title: 'Articles' };

const statusVariant = {
  draft: 'default',
  published: 'accent',
  archived: 'warning',
} as const;

export default async function PostsPage() {
  const posts = await getAdminPosts();

  return (
    <section className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Publishing</p>
          <h1 className="mt-3 text-4xl">Articles</h1>
          <p className="mt-3 max-w-2xl text-text-secondary">Manage your drafts and published writing from one private workspace.</p>
        </div>
        <Button asChild><Link href="/posts/new">New article</Link></Button>
      </div>

      {posts.length === 0 ? (
        <Card className="mt-8 border-dashed">
          <CardHeader><CardTitle>Your writing starts here</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm text-text-secondary">
            <p>Create a private Markdown draft. It never appears on the public blog until you publish it.</p>
            <Button asChild size="sm"><Link href="/posts/new">Create first draft</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 space-y-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`} className="block rounded-xl focus:outline-none">
              <Card className="transition-colors hover:border-border-strong hover:bg-bg-elevated">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold">{post.title}</h2>
                    <p className="mt-1 truncate text-sm text-text-secondary">/{post.slug} · {post.author_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-xs text-text-muted sm:inline">v{post.version}</span>
                    <Badge variant={statusVariant[post.status]}>{post.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
