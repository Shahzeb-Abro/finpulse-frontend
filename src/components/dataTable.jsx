import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── DataTable ───────────────────────────────────────────────
// A headless, fully-styled table built on TanStack Table.
//
// Props:
//   data       – array of row objects
//   columns    – TanStack column defs (see examples below)
//   pageSize   – rows per page (default 10)
//   globalFilter / onGlobalFilterChange – controlled search
//   sorting / onSortingChange           – controlled sorting
//   manualPagination / pageCount        – server-side paging
// ──────────────────────────────────────────────────────────────

export const DataTable = ({
  data,
  columns,
  pageSize = 10,
  // Controlled global filter (from your SearchInput)
  globalFilter = "",
  onGlobalFilterChange,
  // Controlled sorting (from your SortByDropdown)
  sorting: controlledSorting,
  onSortingChange,
  // Server-side pagination (optional)
  manualPagination = false,
  pageCount: controlledPageCount,
}) => {
  // Internal state fallbacks when not controlled externally
  const [internalSorting, setInternalSorting] = useState([]);
  const [internalFilter, setInternalFilter] = useState("");

  const sorting = controlledSorting ?? internalSorting;
  const handleSortingChange = onSortingChange ?? setInternalSorting;
  const filter = globalFilter ?? internalFilter;
  const handleFilterChange = onGlobalFilterChange ?? setInternalFilter;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: filter,
    },
    onSortingChange: handleSortingChange,
    onGlobalFilterChange: handleFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...(manualPagination && {
      manualPagination: true,
      pageCount: controlledPageCount,
    }),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const { pageIndex } = table.getState().pagination;
  const totalPages = table.getPageCount();

  return (
    <div className="flex flex-col gap-0">
      {/* ── Header ── */}
      <div className="flex items-center px-4 py-3 border-b border-grey-100">
        {table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} className="flex items-center w-full">
            {headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className="text-xs font-normal text-grey-500"
                style={{
                  width: header.getSize(),
                  minWidth: header.column.columnDef.minSize,
                  maxWidth: header.column.columnDef.maxSize,
                  flex: header.column.columnDef.meta?.flex ?? "none",
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Rows ── */}
      <div className="flex flex-col">
        {table.getRowModel().rows.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-grey-500">
            No results found.
          </div>
        ) : (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center px-4 py-4 border-b border-grey-100 last:border-b-0 transition-colors hover:bg-beige-100/50"
            >
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  style={{
                    width: cell.column.getSize(),
                    minWidth: cell.column.columnDef.minSize,
                    maxWidth: cell.column.columnDef.maxSize,
                    flex: cell.column.columnDef.meta?.flex ?? "none",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-[8px] border border-grey-200 transition-colors",
              table.getCanPreviousPage()
                ? "hover:bg-grey-100 cursor-pointer text-grey-900"
                : "opacity-40 cursor-not-allowed text-grey-400",
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <div className="flex items-center gap-1">
            <PageButtons
              currentPage={pageIndex}
              totalPages={totalPages}
              onPageChange={(page) => table.setPageIndex(page)}
            />
          </div>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-[8px] border border-grey-200 transition-colors",
              table.getCanNextPage()
                ? "hover:bg-grey-100 cursor-pointer text-grey-900"
                : "opacity-40 cursor-not-allowed text-grey-400",
            )}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Pagination button logic ─────────────────────────────────
// Shows: 1 ... 4 [5] 6 ... 10  (with ellipsis for large sets)

const PageButtons = ({ currentPage, totalPages, onPageChange }) => {
  const pages = getVisiblePages(currentPage, totalPages);

  return pages.map((page, i) => {
    if (page === "...") {
      return (
        <span key={`ellipsis-${i}`} className="px-2 text-sm text-grey-400">
          …
        </span>
      );
    }

    const isActive = page === currentPage;
    return (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={cn(
          "w-9 h-9 flex items-center justify-center text-sm rounded-[8px] transition-colors",
          isActive
            ? "bg-grey-900 text-white"
            : "text-grey-700 hover:bg-grey-100 cursor-pointer",
        )}
      >
        {page + 1}
      </button>
    );
  });
};

function getVisiblePages(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const pages = [];
  // Always show first page
  pages.push(0);

  if (current > 2) pages.push("...");

  // Window around current
  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) pages.push("...");

  // Always show last page
  pages.push(total - 1);

  return pages;
}
