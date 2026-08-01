'use client';

import { Heart, Link2, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type EngagementResponse = {
  like_count: number;
  liked?: boolean;
};

const VISITOR_ID_KEY = 'engineering-notes-visitor-id';
const likedStorageKey = (slug: string) => `engineering-notes-liked:${slug}`;

function visitorId(): string {
  const existing = window.localStorage.getItem(VISITOR_ID_KEY);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  window.localStorage.setItem(VISITOR_ID_KEY, generated);
  return generated;
}

async function copyToClipboard(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

export function ArticleEngagement({ slug, title }: { slug: string; title: string }) {
  const [likeCount, setLikeCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLiked(window.localStorage.getItem(likedStorageKey(slug)) === 'true');

    fetch(`/blog/api/posts/${encodeURIComponent(slug)}/engagement`, {
      cache: 'no-store',
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load likes');
        return (await response.json()) as EngagementResponse;
      })
      .then((data) => setLikeCount(data.like_count))
      .catch(() => setMessage('Likes are temporarily unavailable.'));
  }, [slug]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        setMessage('Share menu opened.');
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    setMessage((await copyToClipboard(url)) ? 'Link copied.' : 'Unable to copy the link.');
  };

  const like = async () => {
    if (liked || isLiking) return;

    setIsLiking(true);
    setMessage('');
    try {
      const response = await fetch(
        `/blog/api/posts/${encodeURIComponent(slug)}/engagement`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitor_id: visitorId() }),
        },
      );
      if (!response.ok) throw new Error('Unable to like article');

      const data = (await response.json()) as EngagementResponse;
      setLikeCount(data.like_count);
      setLiked(true);
      window.localStorage.setItem(likedStorageKey(slug), 'true');
      setMessage(data.liked === false ? 'You already liked this article.' : 'Thanks for the like.');
    } catch {
      setMessage('Unable to record your like. Please try again later.');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <section
      className="mt-12 flex flex-col gap-4 rounded-2xl border border-border bg-bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"
      aria-label="Article engagement"
    >
      <div>
        <h2 className="text-lg font-semibold">Was this useful?</h2>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">
          Share it with someone who may enjoy it, or leave an anonymous like.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={like}
          disabled={liked || isLiking}
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border-strong px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:cursor-default disabled:border-primary disabled:text-primary"
          aria-pressed={liked}
        >
          <Heart className="h-4 w-4" aria-hidden="true" fill={liked ? 'currentColor' : 'none'} />
          {liked ? 'Liked' : 'Like'}
          {likeCount === null ? '' : ` (${likeCount})`}
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-text-inverted transition-colors hover:bg-primary-hover"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share
        </button>
        <button
          type="button"
          onClick={async () =>
            setMessage((await copyToClipboard(window.location.href)) ? 'Link copied.' : 'Unable to copy the link.')
          }
          className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
          Copy link
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </section>
  );
}
