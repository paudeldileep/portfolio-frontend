import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

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

function ScrollableTable(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div
      className="blog-table-scroll"
      role="region"
      aria-label="Scrollable data table"
      tabIndex={0}
    >
      <table {...props} />
    </div>
  );
}

const components: MDXComponents = {
  Callout,
  table: ScrollableTable,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
