import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

function Callout({
  children,
  title = 'Note',
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <aside className="blog-callout" aria-label={title}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}

const components: MDXComponents = {
  Callout,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
