import type { PostHeading } from '@/lib/content/posts';

export function TableOfContents({ headings }: { headings: PostHeading[] }) {
  if (headings.length < 3) {
    return null;
  }

  return (
    <nav
      aria-labelledby="table-of-contents-title"
      className="article-toc"
    >
      <p
        id="table-of-contents-title"
        className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-text-muted"
      >
        On this page
      </p>
      <ol className="mt-4 space-y-3 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? 'pl-3' : undefined}
          >
            <a
              href={`#${heading.id}`}
              className="rounded-sm text-text-muted transition-colors hover:text-primary"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
