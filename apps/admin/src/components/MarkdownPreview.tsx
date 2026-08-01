'use client';

import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

export function MarkdownPreview({ markdown }: { markdown: string }) {
  if (!markdown.trim()) {
    return <p className="text-sm text-text-muted">Start writing to see a safe preview.</p>;
  }

  return (
    <div className="space-y-4 break-words text-text-secondary [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-bg-elevated [&_code]:px-1 [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_h1]:text-text-primary [&_h2]:text-text-primary [&_h3]:text-text-primary [&_li]:ml-5 [&_li]:list-disc [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-bg-elevated [&_pre]:p-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} skipHtml>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
