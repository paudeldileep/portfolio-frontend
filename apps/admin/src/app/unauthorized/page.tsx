import { Button, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui';
import { signOut } from '@/app/(protected)/actions';

export const metadata = {
  title: 'Access unavailable',
};

export default function UnauthorizedPage() {
  return (
    <main
      id="main-content"
      className="admin-grid grid min-h-[100dvh] place-items-center px-4 py-10"
    >
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-error">
            Authorization required
          </p>
          <CardTitle className="text-3xl">This account has no admin role</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-secondary">
            Your Supabase identity is valid, but FastAPI did not find an owner or
            author profile. Ask the owner to complete your profile assignment.
          </p>
          <form action={signOut} className="mt-6">
            <Button type="submit" variant="outline">
              Sign out and use another account
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
