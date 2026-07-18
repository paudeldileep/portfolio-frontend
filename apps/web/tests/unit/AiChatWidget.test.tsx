import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

// Mock next-themes before imports
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: vi.fn(), resolvedTheme: 'dark' }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock @portfolio/api-client
vi.mock('@portfolio/api-client', () => ({
  sendChatMessage: vi.fn().mockResolvedValue({
    success: true,
    data: { reply: 'Dileep has 7+ years of experience in frontend engineering.' },
  }),
}));

import AiChatWidget from '../../src/components/AiChatWidget';

describe('AiChatWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the trigger button', () => {
    render(<AiChatWidget />);
    expect(screen.getByRole('button', { name: /open ai portfolio assistant/i })).toBeInTheDocument();
  });

  it('opens the dialog when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<AiChatWidget />);

    await user.click(screen.getByRole('button', { name: /open ai portfolio assistant/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders all suggested prompts', async () => {
    const user = userEvent.setup();
    render(<AiChatWidget />);
    await user.click(screen.getByRole('button', { name: /open ai portfolio assistant/i }));

    expect(screen.getByRole('button', { name: /Micro Frontends/i })).toBeInTheDocument();
  });

  it('sends a message and displays response', async () => {
    const user = userEvent.setup();
    render(<AiChatWidget />);
    await user.click(screen.getByRole('button', { name: /open ai portfolio assistant/i }));

    const input = screen.getByRole('textbox', { name: /type your question/i });
    await user.type(input, 'Tell me about Dileep');

    const sendBtn = screen.getByRole('button', { name: /send message/i });
    await user.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText('Tell me about Dileep')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/7\+ years/i)).toBeInTheDocument();
    });
  });

  it('trigger button has no WCAG 2.1 AA accessibility violations', async () => {
    const { container } = render(<AiChatWidget />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
