import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-ink">Report not found</h1>
        <p className="mt-3 text-muted">The report you requested does not exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-brand">
          Back to reports
        </Link>
      </div>
    </main>
  );
}
