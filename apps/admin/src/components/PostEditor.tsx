'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui';
import { archivePost, createPost, publishPost, updatePost } from '@/app/(protected)/actions';
import type { AdminPost } from '@/lib/admin-api';
import { parseTags, toPostFormValues, type PostFormValues } from '@/lib/post-form';
import { MarkdownPreview } from './MarkdownPreview';

type EditorPost = Pick<AdminPost, 'id' | 'status' | 'version'> & PostFormValues;

const inputClass =
  'mt-2 w-full rounded-lg border border-border bg-bg-surface px-3 py-2.5 text-text-primary shadow-sm placeholder:text-text-muted';

export function PostEditor({ post }: { post?: EditorPost }) {
  const [values, setValues] = useState<PostFormValues>(toPostFormValues(post));
  const [current, setCurrent] = useState<EditorPost | undefined>(post);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateValue = <K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setNotice(null);
  };

  const applyResult = (result: Awaited<ReturnType<typeof createPost>>, success: string) => {
    if (!result.ok) {
      setNotice(
        result.latestVersion
          ? `${result.message} The latest saved version is ${result.latestVersion}; your edits are still in the form.`
          : result.message
      );
      return;
    }

    const next = { ...result.post, image_path: result.post.image_path ?? null };
    setCurrent(next);
    setValues(toPostFormValues(next));
    setNotice(success);
  };

  const save = () => {
    startTransition(async () => {
      const result = current
        ? await updatePost(current.id, current.version, values)
        : await createPost(values);
      applyResult(result, current ? 'Draft saved.' : 'Draft created.');
    });
  };

  const publish = () => {
    if (!current) {
      setNotice('Save the draft before publishing.');
      return;
    }
    startTransition(async () => applyResult(await publishPost(current.id, current.version), 'Article published.'));
  };

  const archive = () => {
    if (!current) return;
    startTransition(async () => applyResult(await archivePost(current.id, current.version), 'Article archived.'));
  };

  const status = current?.status ?? 'new';
  const canPublish = current?.status === 'draft' || current?.status === 'published';

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/posts" className="text-sm text-primary underline-offset-4 hover:underline">
            ← Articles
          </Link>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-primary">Publishing</p>
          <h1 className="mt-3 text-4xl">{current ? 'Edit article' : 'New article'}</h1>
          <p className="mt-3 max-w-2xl text-text-secondary">Draft safely, preview Markdown, then publish when it is ready.</p>
        </div>
        <Badge variant={status === 'published' ? 'accent' : status === 'archived' ? 'warning' : 'default'}>
          {status}
        </Badge>
      </div>

      {notice ? <p role="status" className="rounded-lg border border-border bg-bg-elevated px-4 py-3 text-sm text-text-secondary">{notice}</p> : null}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]">
        <Card>
          <CardHeader><CardTitle>Article details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <label className="block text-sm font-medium">Title
              <input className={inputClass} value={values.title} disabled={status === 'archived'} onChange={(event) => updateValue('title', event.target.value)} maxLength={200} />
            </label>
            <label className="block text-sm font-medium">Slug
              <input className={inputClass} value={values.slug} disabled={status === 'archived'} onChange={(event) => updateValue('slug', event.target.value)} placeholder="my-article-title" maxLength={160} aria-describedby="slug-help" />
              <span id="slug-help" className="mt-1 block text-xs font-normal text-text-muted">Lowercase letters, numbers, and hyphens only.</span>
            </label>
            <label className="block text-sm font-medium">Description
              <textarea className={inputClass} value={values.description} disabled={status === 'archived'} onChange={(event) => updateValue('description', event.target.value)} rows={3} maxLength={500} />
            </label>
            <label className="block text-sm font-medium">Tags
              <input className={inputClass} value={values.tags.join(', ')} disabled={status === 'archived'} onChange={(event) => updateValue('tags', parseTags(event.target.value))} placeholder="accessibility, nextjs" />
            </label>
            <label className="flex items-center gap-3 text-sm font-medium">
              <input type="checkbox" checked={values.featured} disabled={status === 'archived'} onChange={(event) => updateValue('featured', event.target.checked)} />
              Feature this article
            </label>
            <label className="block text-sm font-medium">Markdown
              <textarea className={`${inputClass} min-h-80 font-mono text-sm leading-6`} value={values.body_markdown} disabled={status === 'archived'} onChange={(event) => updateValue('body_markdown', event.target.value)} spellCheck="true" />
            </label>
            <div className="flex flex-wrap gap-3 pt-2">
              {status !== 'archived' ? <Button type="button" onClick={save} disabled={isPending}>{isPending ? 'Saving…' : 'Save draft'}</Button> : null}
              {canPublish ? <Button type="button" variant="secondary" onClick={publish} disabled={isPending}>{isPending ? 'Working…' : status === 'published' ? 'Publish updates' : 'Publish'}</Button> : null}
              {current && status !== 'archived' ? <Button type="button" variant="ghost" onClick={archive} disabled={isPending}>Archive</Button> : null}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit xl:sticky xl:top-36">
          <CardHeader><CardTitle>Safe preview</CardTitle></CardHeader>
          <CardContent><MarkdownPreview markdown={values.body_markdown} /></CardContent>
        </Card>
      </div>
    </section>
  );
}
