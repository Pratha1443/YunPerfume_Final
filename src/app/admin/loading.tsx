export default function AdminLoading() {
  return (
    <div className="space-y-12 animate-pulse">
      <header className="border-b border-border/40 pb-8">
        <div className="h-4 w-24 bg-muted mb-4" />
        <div className="h-16 w-64 bg-muted" />
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-sm border border-border/60 bg-card p-8">
            <div className="h-3 w-20 bg-muted mb-4" />
            <div className="h-12 w-16 bg-muted" />
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-border/60 bg-card p-8 min-h-[400px]">
        <div className="h-6 w-32 bg-muted mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full bg-muted/50 rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
