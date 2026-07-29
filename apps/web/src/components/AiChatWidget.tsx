'use client';

/**
 * AI RAG Chat Widget
 * ───────────────────
 * Floating chat assistant powered by the FastAPI RAG backend (`POST /chat`).
 *
 * Features:
 * - Radix UI Dialog for accessible modal with focus trap and ARIA
 * - Suggested prompt chips for guided exploration
 * - Typing animation while waiting for backend response
 * - Markdown rendering for structured AI responses (via react-markdown)
 * - Persists message history within the session
 * - Full keyboard navigation (Tab, Esc, Enter)
 * - WCAG 2.1 AA: focus management, aria-live regions, contrast compliant
 */

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Bot, Send, X, MessageCircle, RotateCcw } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button, cn } from '@portfolio/ui';
import { sendChatMessage } from '@portfolio/api-client';
import ChatErrorOverlay from './ChatErrorOverlay';

// ── Types ──────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ── Suggested Prompts ──────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  "What's Dileep's experience with Micro Frontends?",
  'Tell me about his work at Fidelity Investments.',
  'What accessibility achievements has he had?',
  'What AI and emerging tech skills does he have?',
  'What cloud and DevOps experience does he have?',
];

// ── Sub-components ─────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-1 px-4 py-3 rounded-chat rounded-bl-sm bg-bg-elevated max-w-max"
      role="status"
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-text-muted"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
          aria-hidden
        />
      ))}
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <span
          className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle border border-primary/20"
          aria-hidden
        >
          <Bot className="h-4 w-4 text-primary" />
        </span>
      )}
      <div
        className={cn(
          'max-w-[85%] rounded-chat px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'rounded-br-sm bg-primary text-text-inverted'
            : 'rounded-bl-sm bg-bg-elevated text-text-secondary border border-border'
        )}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
              code: ({ children }) => (
                <code className="rounded bg-bg-code px-1 py-0.5 font-mono text-xs text-primary">
                  {children}
                </code>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-text-primary">{children}</strong>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        <time
          dateTime={message.timestamp.toISOString()}
          className="sr-only"
        >
          {message.timestamp.toLocaleTimeString()}
        </time>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function AiChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  // Auto-scroll to latest message
  React.useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }, [messages, loading, open, reduceMotion]);

  // Focus input when dialog opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const sendMessage = React.useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput('');

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const result = await sendChatMessage({ message: trimmed });

    setLoading(false);

    if (result.success) {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } else {
      // Pass the actual error message from the API
      setError(result.error);
    }
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const isEmpty = messages.length === 0;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* ── Trigger Button ─────────────────────────────── */}
      <Dialog.Trigger asChild>
        <motion.button
          type="button"
          className={cn(
            'fixed bottom-6 right-6 z-[var(--z-overlay)]',
            'flex items-center gap-2.5 rounded-full px-5 py-3',
            'bg-primary text-text-inverted shadow-xl shadow-primary/30',
            'hover:bg-primary-hover active:scale-95',
            'transition-all duration-fast',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2'
          )}
          aria-label="Open AI portfolio assistant"
          animate={reduceMotion ? {} : { y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bot className="h-5 w-5" aria-hidden />
          <span className="text-sm font-medium">Ask AI</span>
        </motion.button>
      </Dialog.Trigger>

      {/* ── Dialog Modal ──────────────────────────────── */}
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[var(--z-modal)] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />

        <Dialog.Content
          className={cn(
            'fixed bottom-6 right-6 z-[var(--z-modal)]',
            'flex flex-col',
            'w-[min(92vw,26rem)] h-[min(85dvh,640px)]',
            'rounded-chat bg-bg-surface border border-border shadow-xl',
            'focus:outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4'
          )}
          aria-describedby="chat-description"
        >
          <VisuallyHidden>
            <Dialog.Title>AI Portfolio Assistant</Dialog.Title>
            <p id="chat-description">
              Ask me anything about Dileep Kumar’s professional experience, skills, and background.
            </p>
          </VisuallyHidden>

          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle border border-primary/20"
                aria-hidden
              >
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Portfolio AI</p>
                <p className="text-xs text-text-muted flex items-center gap-1">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-success"
                    aria-hidden
                  />
                  RAG-powered assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-md',
                    'text-text-muted hover:text-text-primary hover:bg-bg-elevated',
                    'transition-colors duration-fast',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]'
                  )}
                  aria-label="Clear conversation"
                  title="Clear conversation"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                </button>
              )}
              <Dialog.Close asChild>
                <button
                  type="button"
                  className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-md',
                    'text-text-muted hover:text-text-primary hover:bg-bg-elevated',
                    'transition-colors duration-fast',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]'
                  )}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Messages area */}
          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain"
            role="log"
            aria-label="Conversation messages"
            aria-live="polite"
            aria-relevant="additions"
          >
            {isEmpty && (
              <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-2">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle border border-primary/20"
                  aria-hidden
                >
                  <MessageCircle className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary mb-1">
                    Ask me about Dileep
                  </p>
                  <p className="text-xs text-text-muted">
                    Powered by RAG — I have access to his full professional background.
                  </p>
                </div>

                {/* Suggested Prompts */}
                <div
                  className="flex flex-col gap-2 w-full"
                  aria-label="Suggested questions"
                >
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className={cn(
                        'w-full rounded-lg border border-border px-3 py-2.5 text-left text-xs text-text-secondary',
                        'hover:bg-bg-elevated hover:border-border-strong hover:text-text-primary',
                        'transition-all duration-fast',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]'
                      )}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {loading && (
              <div className="flex justify-start">
                <span className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle border border-primary/20" aria-hidden>
                  <Bot className="h-4 w-4 text-primary" />
                </span>
                <TypingIndicator />
              </div>
            )}

            {error && (
              <ChatErrorOverlay
                error={error}
                onDismiss={() => setError(null)}
                onRetry={() => {
                  if (messages.length > 0) {
                    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
                    if (lastUserMessage) {
                      sendMessage(lastUserMessage.content);
                    }
                  }
                }}
              />
            )}

            <div ref={messagesEndRef} aria-hidden />
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-border p-3"
            aria-label="Send a message"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Dileep…"
                disabled={loading}
                aria-label="Type your question"
                aria-disabled={loading}
                maxLength={500}
                className={cn(
                  'flex-1 rounded-lg border bg-bg-elevated px-3 py-2 text-sm text-text-primary',
                  'placeholder:text-text-muted border-border',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-transparent',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-colors duration-fast'
                )}
              />
              <Button
                type="submit"
                size="icon"
                loading={loading}
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
