import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdminIdentityCard } from '@/components/AdminIdentityCard';
import { SignInForm } from '@/app/login/SignInForm';

describe('admin foundation components', () => {
  it('renders the verified owner identity and permissions', () => {
    render(
      <AdminIdentityCard
        identity={{
          email: 'owner@example.test',
          display_name: 'Dileep',
          role: 'owner',
        }}
      />
    );

    expect(screen.getByText('Dileep')).toBeInTheDocument();
    expect(screen.getByText('owner')).toBeInTheDocument();
    expect(
      screen.getByText('Publishing, authors, and portfolio management')
    ).toBeInTheDocument();
  });

  it('provides an accessible invited-email sign-in form', () => {
    render(<SignInForm nextPath="/dashboard" />);

    const email = screen.getByRole('textbox', { name: 'Invited email' });
    expect(email).toHaveAttribute('type', 'email');
    expect(email).toHaveAccessibleDescription(
      'Access is limited to owner and author accounts already registered by the owner.'
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Send secure sign-in link' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter your invited email address.'
    );
  });
});
