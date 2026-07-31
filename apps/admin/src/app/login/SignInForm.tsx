'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@portfolio/ui';
import { createClient } from '@/lib/supabase/client';
import { safeNextPath } from '@/lib/navigation';

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'sent'; email: string }
  | { status: 'error'; message: string };

export function SignInForm({ nextPath }: { nextPath: string }) {
  const [state, setState] = useState<SubmitState>({ status: 'idle' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();

    if (!email) {
      setState({ status: 'error', message: 'Enter your invited email address.' });
      return;
    }

    setState({ status: 'submitting' });
    const redirectPath = safeNextPath(nextPath);
    const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      redirectPath
    )}`;
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
        shouldCreateUser: false,
      },
    });

    if (error) {
      setState({
        status: 'error',
        message: 'Sign-in could not be started. Confirm that this email was invited.',
      });
      return;
    }

    setState({ status: 'sent', email });
  }

  if (state.status === 'sent') {
    return (
      <div className="rounded-lg border border-success/30 bg-green-500/10 p-4" role="status">
        <p className="font-semibold text-text-primary">Check your email</p>
        <p className="mt-1 text-sm text-text-secondary">
          We sent a one-time sign-in link to {state.email}. The link returns you
          to this admin studio.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-text-primary">
          Invited email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-describedby="email-help"
          className="mt-2 h-12 w-full rounded-md border border-border-strong bg-bg-base px-4 text-text-primary shadow-sm transition-colors placeholder:text-text-muted hover:border-primary focus:border-primary"
          placeholder="you@example.com"
        />
        <p id="email-help" className="mt-2 text-sm text-text-muted">
          Access is limited to owner and author accounts already registered by
          the owner.
        </p>
      </div>

      {state.status === 'error' ? (
        <p className="rounded-md border border-error/30 bg-red-500/10 p-3 text-sm text-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={state.status === 'submitting'}
      >
        Send secure sign-in link
      </Button>
    </form>
  );
}
