import { useEffect, useState } from "react";
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

export const DataTable = ({
  data,
  columns,
  globalFilter = "",
  onGlobalFilterChange,
  sorting: controlledSorting = [],
  onSortingChange,
  manualPagination = false,
  pageCount: controlledPageCount,
  pagination, // ← single source of truth
  setPagination,
  totalElements,
  isLoading = false,
}) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: controlledSorting,
      globalFilter,
      pagination,
    },
    onSortingChange,
    onGlobalFilterChange,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination,
    pageCount: controlledPageCount ?? -1,
    enableSorting: false,
  });

  const totalPages = manualPagination
    ? (controlledPageCount ?? 0)
    : table.getPageCount();

  useEffect(() => {
    console.log("Pagination changed", pagination);
  }, [pagination.pageSize, pagination.pageIndex]);

  return (
    <div className="flex flex-col gap-0 h-[calc(100vh-350px)]! lg:h-[calc(100vh-260px)]!">
      {/* ── Header ── */}
      <div className="flex items-center px-4 py-3 border-b border-grey-100">
        {table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} className="flex items-center w-full">
            {headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className={cn(
                  "text-xs font-normal text-grey-500 select-none",
                  header.column.getCanSort() &&
                    "cursor-pointer hover:text-grey-900 transition-colors",
                )}
                style={{
                  width: header.getSize(),
                  minWidth: header.column.columnDef.minSize,
                  maxWidth: header.column.columnDef.maxSize,
                  flex: header.column.columnDef.meta?.flex ?? "none",
                }}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div className="flex items-center gap-1">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  {header.column.getCanSort() && (
                    <span className="text-grey-300">
                      {{ asc: "↑", desc: "↓" }[header.column.getIsSorted()] ??
                        "↕"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Rows ── */}
      <div className="flex flex-col h-full overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-sm text-grey-500">
            Loading...
          </div>
        ) : table.getRowModel().rows.length === 0 ? (
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
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        {/* Left — record count */}
        {totalElements != null ? (
          <span className="text-xs text-grey-500">
            {totalElements} record{totalElements !== 1 ? "s" : ""}
          </span>
        ) : (
          <span />
        )}

        {/* Center — page number buttons */}
        <div className="flex items-center gap-1">
          <PageButtons
            currentPage={pagination.pageIndex}
            totalPages={totalPages}
            onPageChange={(p) => {
              console.log("Page button clicked:", p);
              table.setPageIndex(p);
            }}
          />
        </div>

        {/* Right — Prev / Next */}
        <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
};

// ─── Page number buttons with ellipsis ────────────────────────
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
  pages.push(0);
  if (current > 2) pages.push("...");

  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 3) pages.push("...");
  pages.push(total - 1);

  return pages;
}
