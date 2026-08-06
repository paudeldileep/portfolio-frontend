'use client';

import { useState, useTransition } from 'react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui';
import { updatePortfolioContent } from '@/app/(protected)/actions';
import type { AdminPortfolio } from '@/lib/admin-api';

const inputClass = 'mt-2 w-full rounded-lg border border-border bg-bg-surface px-3 py-2.5 text-text-primary shadow-sm placeholder:text-text-muted';
const textAreaClass = `${inputClass} min-h-28 font-mono text-sm leading-6`;

type Content = AdminPortfolio['content'];

function skillLines(value: string) {
  return value.split(/[\n,]/).map((item) => item.trim());
}

function highlightSentences(value: string) {
  return value.split(/\s*(?<=[.!?])\s+|\n+/).map((item) => item.trim());
}

function cleanLines(value: string[]) {
  return value.map((item) => item.trim()).filter(Boolean);
}

function cleanContent(value: Content): Content {
  return {
    ...value,
    skills: Object.fromEntries(Object.entries(value.skills).map(([category, skills]) => [category, cleanLines(skills)])),
    experience: value.experience.map((item) => ({ ...item, highlights: cleanLines(highlightSentences((item.highlights ?? []).join(' '))) })),
  };
}

export function PortfolioEditor({ portfolio }: { portfolio: AdminPortfolio }) {
  const [current, setCurrent] = useState(portfolio);
  const [content, setContent] = useState<Content>(portfolio.content);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const update = (next: Content) => { setContent(next); setNotice(null); };
  const save = () => startTransition(async () => {
    const result = await updatePortfolioContent(current, cleanContent(content));
    if (!result.ok) {
      setNotice(result.latestVersion ? `${result.message} Latest version: ${result.latestVersion}. Your edits are still in the form.` : result.message);
      return;
    }
    setCurrent(result.portfolio);
    setContent(result.portfolio.content);
    setNotice('Portfolio saved. The public cache refresh is requested securely.');
  });

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Portfolio</p><h1 className="mt-3 text-4xl">Portfolio content</h1><p className="mt-3 max-w-2xl text-text-secondary">Edit public portfolio content as the verified owner.</p></div>
        <Badge variant="accent">Version {current.version}</Badge>
      </div>
      {notice ? <p role="status" className="rounded-lg border border-border bg-bg-elevated px-4 py-3 text-sm text-text-secondary">{notice}</p> : null}

      <Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader><CardContent className="space-y-5">
        <label className="block text-sm font-medium">Title<input className={inputClass} value={content.profile.title} maxLength={160} onChange={(e) => update({ ...content, profile: { ...content.profile, title: e.target.value } })} /></label>
        <label className="block text-sm font-medium">About paragraphs<textarea className={`${inputClass} min-h-64 leading-6`} value={content.profile.summary.join('\n\n')} onChange={(e) => update({ ...content, profile: { ...content.profile, summary: e.target.value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean) } })} aria-describedby="summary-help" /><span id="summary-help" className="mt-1 block text-xs font-normal text-text-muted">Separate paragraphs with one blank line.</span></label>
      </CardContent></Card>

      <Card><CardHeader><div className="flex items-center justify-between gap-4"><CardTitle>Skills</CardTitle><button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => { const base = 'new category'; let name = base; let index = 2; while (content.skills[name]) name = `${base} ${index++}`; update({ ...content, skills: { ...content.skills, [name]: [] } }); }}>Add category</button></div></CardHeader><CardContent className="grid gap-5 lg:grid-cols-2">
        {Object.entries(content.skills).map(([category, skills]) => <div key={category} className="rounded-lg border border-border p-4"><div className="flex items-end gap-3"><label className="block flex-1 text-sm font-medium">Category title<input className={inputClass} value={category.replaceAll('_', ' ')} onChange={(e) => { const next = e.target.value.trim() || 'untitled category'; const nextSkills = Object.fromEntries(Object.entries(content.skills).map(([key, value]) => [key === category ? next : key, value])); update({ ...content, skills: nextSkills }); }} /></label><button type="button" className="pb-2 text-sm text-text-muted hover:text-text-primary" onClick={() => { const nextSkills = Object.fromEntries(Object.entries(content.skills).filter(([key]) => key !== category)); update({ ...content, skills: nextSkills }); }}>Remove</button></div><label className="mt-3 block text-sm font-medium">Skills<textarea className={textAreaClass} value={skills.join('\n')} onChange={(e) => update({ ...content, skills: { ...content.skills, [category]: skillLines(e.target.value) } })} aria-label={`${category.replaceAll('_', ' ')} skills`} /><span className="mt-1 block text-xs font-normal text-text-muted">Separate skills with commas or new lines.</span></label></div>)}
      </CardContent></Card>

      <Card><CardHeader><CardTitle>Experience</CardTitle></CardHeader><CardContent className="space-y-6">
        {content.experience.map((item, index) => <div key={item.id ?? index} className="rounded-lg border border-border p-4"><div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-medium">Company<input className={inputClass} value={String(item.company ?? '')} onChange={(e) => update({ ...content, experience: content.experience.map((value, i) => i === index ? { ...value, company: e.target.value } : value) })} /></label><label className="text-sm font-medium">Role<input className={inputClass} value={String(item.role ?? '')} onChange={(e) => update({ ...content, experience: content.experience.map((value, i) => i === index ? { ...value, role: e.target.value } : value) })} /></label><label className="text-sm font-medium">Start date<input className={inputClass} value={String(item.start_date ?? '')} onChange={(e) => update({ ...content, experience: content.experience.map((value, i) => i === index ? { ...value, start_date: e.target.value } : value) })} /></label><label className="text-sm font-medium">End date<input className={inputClass} value={String(item.end_date ?? '')} onChange={(e) => update({ ...content, experience: content.experience.map((value, i) => i === index ? { ...value, end_date: e.target.value } : value) })} /></label></div><label className="mt-4 block text-sm font-medium">Summary<textarea className={textAreaClass} value={String(item.summary ?? '')} onChange={(e) => update({ ...content, experience: content.experience.map((value, i) => i === index ? { ...value, summary: e.target.value } : value) })} /></label><label className="mt-4 block text-sm font-medium">Highlights<textarea className={textAreaClass} value={Array.isArray(item.highlights) ? item.highlights.join(' ') : ''} onChange={(e) => update({ ...content, experience: content.experience.map((value, i) => i === index ? { ...value, highlights: highlightSentences(e.target.value) } : value) })} /><span className="mt-1 block text-xs font-normal text-text-muted">One sentence per bullet. Line wrapping is automatic.</span></label></div>)}
      </CardContent></Card>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Education</CardTitle></CardHeader><CardContent className="space-y-5">{content.education.map((item, index) => <div key={item.id ?? index} className="rounded-lg border border-border p-4"><label className="block text-sm font-medium">Degree<input className={inputClass} value={String(item.degree ?? '')} onChange={(e) => update({ ...content, education: content.education.map((value, i) => i === index ? { ...value, degree: e.target.value } : value) })} /></label><label className="mt-3 block text-sm font-medium">Institution<input className={inputClass} value={String(item.institution ?? '')} onChange={(e) => update({ ...content, education: content.education.map((value, i) => i === index ? { ...value, institution: e.target.value } : value) })} /></label><label className="mt-3 block text-sm font-medium">CGPA<input className={inputClass} value={String(item.cgpa ?? '')} onChange={(e) => update({ ...content, education: content.education.map((value, i) => i === index ? { ...value, cgpa: e.target.value } : value) })} /></label></div>)}</CardContent></Card>
        <Card><CardHeader><div className="flex items-center justify-between gap-4"><CardTitle>Certifications</CardTitle><button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => update({ ...content, certifications: [...content.certifications, { name: '', issuer: '', type: 'certification' }] })}>Add certificate</button></div></CardHeader><CardContent className="space-y-5">{content.certifications.map((item, index) => <div key={item.id ?? index} className="rounded-lg border border-border p-4"><div className="flex justify-end"><button type="button" className="text-sm text-text-muted hover:text-text-primary" onClick={() => update({ ...content, certifications: content.certifications.filter((_, i) => i !== index) })}>Remove</button></div><label className="block text-sm font-medium">Name<input className={inputClass} value={String(item.name ?? '')} onChange={(e) => update({ ...content, certifications: content.certifications.map((value, i) => i === index ? { ...value, name: e.target.value } : value) })} /></label><label className="mt-3 block text-sm font-medium">Issuer<input className={inputClass} value={String(item.issuer ?? '')} onChange={(e) => update({ ...content, certifications: content.certifications.map((value, i) => i === index ? { ...value, issuer: e.target.value } : value) })} /></label></div>)}</CardContent></Card>
      </div>
      <div className="sticky bottom-4 z-10 flex justify-end"><Button type="button" onClick={save} disabled={isPending}>{isPending ? 'Saving…' : 'Save portfolio'}</Button></div>
    </section>
  );
}
