export default function Loading() {
  return (
    <main
      id="main-content"
      className="admin-container py-14"
      aria-busy="true"
      aria-label="Loading admin workspace"
    >
      <div className="animate-pulse space-y-5">
        <div className="h-4 w-32 rounded bg-bg-elevated" />
        <div className="h-12 max-w-2xl rounded bg-bg-elevated" />
        <div className="h-5 max-w-xl rounded bg-bg-elevated" />
        <div className="grid gap-5 pt-5 sm:grid-cols-2">
          <div className="h-48 rounded-card border border-border bg-bg-surface" />
          <div className="h-48 rounded-card border border-border bg-bg-surface" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </main>
  );
}
