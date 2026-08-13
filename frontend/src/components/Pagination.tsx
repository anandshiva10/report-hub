import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

export function Pagination({ page, size, totalElements, totalPages, onPageChange, onSizeChange }: PaginationProps) {
  const start = totalElements === 0 ? 0 : page * size + 1;
  const end = Math.min(totalElements, (page + 1) * size);

  return (
    <div className="flex flex-col gap-3 border-t border-line bg-white px-4 py-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {start}-{end} of {totalElements}
      </span>
      <div className="flex items-center gap-3">
        <select
          value={size}
          onChange={(event) => onSizeChange(Number(event.target.value))}
          className="rounded-md border border-line bg-white px-2 py-1 text-ink"
          aria-label="Rows per page"
        >
          {[10, 25, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="rounded-md border border-line p-2 text-ink disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-16 text-center text-ink">
          {page + 1} / {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          className="rounded-md border border-line p-2 text-ink disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
