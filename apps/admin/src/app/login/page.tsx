import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@portfolio/ui';
import { safeNextPath } from '@/lib/navigation';
import { SignInForm } from './SignInForm';

export const metadata = {
  title: 'Sign in',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const parameters = await searchParams;
  const nextPath = safeNextPath(parameters.next ?? null);

  return (
    <main
      id="main-content"
      className="admin-grid grid min-h-[100dvh] place-items-center px-4 py-10"
    >
      <div className="w-full max-w-md">
        <div className="mb-7 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-border-strong bg-bg-surface font-mono text-sm font-semibold shadow-sm">
            DT
          </span>
          <div>
            <p className="font-semibold">Admin Studio</p>
            <p className="text-sm text-text-muted">Private publishing workspace</p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              Passwordless access
            </p>
            <CardTitle className="text-3xl">Welcome back</CardTitle>
            <CardDescription>
              Use the email address connected to your invited Supabase account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {parameters.error === 'callback' ? (
              <p
                className="mb-5 rounded-md border border-error/30 bg-red-500/10 p-3 text-sm text-error"
                role="alert"
              >
                That sign-in link is invalid or expired. Request a new one below.
              </p>
            ) : null}
            <SignInForm nextPath={nextPath} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
