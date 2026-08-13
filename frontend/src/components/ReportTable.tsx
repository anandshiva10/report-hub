import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type SortingState
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { LoadingRows } from "./StateViews";

interface ReportTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading: boolean;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
}

export function ReportTable<T>({ columns, data, loading, sorting, onSortingChange }: ReportTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    manualSorting: true,
    onSortingChange,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line">
          <thead className="bg-surface">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <th key={header.id} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1.5 hover:text-ink"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : null}
                        {sorted === "desc" ? <ArrowDown className="h-3.5 w-3.5" /> : null}
                        {!sorted ? <ChevronsUpDown className="h-3.5 w-3.5" /> : null}
                      </button>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-line bg-white text-sm text-ink">
            {loading ? (
              <LoadingRows columns={columns.length} />
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-4 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
