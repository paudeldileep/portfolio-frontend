import { Badge, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui';

export const metadata = {
  title: 'Articles',
};

export default function PostsPage() {
  return (
    <section className="max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            Publishing
          </p>
          <h1 className="mt-3 text-4xl">Articles</h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            The authenticated shell is ready. Draft listing and the Markdown
            editor arrive in ADMIN-050.
          </p>
        </div>
        <Badge variant="warning">Foundation only</Badge>
      </div>

      <Card className="mt-8 border-dashed">
        <CardHeader>
          <CardTitle>No editor wired yet</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-text-secondary">
          This deliberate boundary keeps authentication review separate from
          content mutation. The next slice will connect the tested post API.
        </CardContent>
      </Card>
    </section>
  );
}
