import Link from 'next/link';
import { Badge } from '@portfolio/ui';

export function TagList({
  tags,
  tagSlugs,
}: {
  tags: string[];
  tagSlugs: string[];
}) {
  return (
    <ul className="flex list-none flex-wrap gap-2" aria-label="Article topics">
      {tags.map((tag, index) => (
        <li key={tagSlugs[index]}>
          <Link
            href={`/blog/tag/${tagSlugs[index]}`}
            className="inline-flex rounded-full"
          >
            <Badge variant="secondary">{tag}</Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}
