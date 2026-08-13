import { AlertCircle, SearchX } from "lucide-react";
import type { ReactNode } from "react";

export function LoadingCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading reports">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-56 animate-pulse rounded-lg border border-line bg-white p-5">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="mt-8 h-6 w-40 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-full rounded bg-slate-200" />
          <div className="mt-3 h-4 w-2/3 rounded bg-slate-200" />
          <div className="mt-10 h-9 w-32 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function LoadingRows({ columns }: { columns: number }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((row) => (
        <tr key={row}>
          {Array.from({ length: columns }).map((_, column) => (
            <td key={column} className="px-4 py-4">
              <div className="h-4 animate-pulse rounded bg-slate-200" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function EmptyState({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-line bg-white px-6 text-center">
      <SearchX className="h-10 w-10 text-muted" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ title, message, onRetry }: { title: string; message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 text-center">
      <AlertCircle className="h-10 w-10 text-red-700" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold text-red-950">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-red-800">{message}</p>
      <button type="button" onClick={onRetry} className="mt-5 rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800">
        Try Again
      </button>
    </div>
  );
}
