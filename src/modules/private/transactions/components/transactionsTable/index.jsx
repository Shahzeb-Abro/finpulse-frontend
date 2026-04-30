import { useForm } from "react-hook-form";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { SearchInput } from "@/components/SearchInput";
import { ArrowDownCircle, ArrowUpCircle, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getTransactionCategories, getTransactions } from "@/api/transaction";
import { AddEditTransactionDialog, DeleteTransactionDialog } from "@/dialogs";
import { useSearchParams } from "react-router-dom";
import { TransactionFilters } from "..";

// ─── Sort map — IDs aligned to SortByDropdown options ─────────
// Latest=1, Oldest=2, A to Z=3, Z to A=4, Highest=5, Lowest=6
const SORT_MAP = {
  1: { sortBy: "transactionDate", sortDir: "desc" }, // Latest
  2: { sortBy: "transactionDate", sortDir: "asc" }, // Oldest
  3: { sortBy: "description", sortDir: "asc" }, // A to Z
  4: { sortBy: "description", sortDir: "desc" }, // Z to A
  5: { sortBy: "amount", sortDir: "desc" }, // Highest
  6: { sortBy: "amount", sortDir: "asc" }, // Lowest
};

// ─── Column definitions ────────────────────────────────────────
const buildColumns = (onEdit, onDelete) => [
  {
    accessorKey: "description",
    header: "Description",
    meta: { flex: "1 1 0%" },
    cell: ({ row }) => {
      const { description, categoryVisibleValue, transactionType } =
        row.original;
      const isIncome = transactionType === "INCOME";
      return (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              isIncome ? "bg-green-sec/10" : "bg-foreground/10",
            )}
          >
            {isIncome ? (
              <ArrowDownCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ArrowUpCircle className="w-4 h-4 text-foreground" />
            )}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-bold text-grey-900 truncate">
              {description || "—"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "categoryVisibleValue",
    header: "Category",
    size: 140,
    cell: ({ getValue }) => {
      return <span className="text-xs text-grey-500">{getValue() || "—"}</span>;
    },
  },
  {
    accessorKey: "transactionDate",
    header: "Date",
    size: 130,
    cell: ({ getValue }) => {
      const val = getValue();
      return (
        <span className="text-xs text-grey-500">
          {val ? format(new Date(val), "dd MMM yyyy") : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <span className="text-right w-full block">Amount</span>,
    size: 130,
    cell: ({ row }) => {
      const { amount, transactionType } = row.original;
      const isIncome = transactionType === "INCOME";
      return (
        <span
          className={cn(
            "text-sm font-bold text-right w-full block",
            isIncome && "text-green-sec ",
          )}
        >
          {isIncome ? "+" : "-"}${Number(amount).toFixed(2)}
        </span>
      );
    },
  },
  // ── Edit column ──
  {
    id: "actions",
    header: () => <span className="text-right w-full block">Actions</span>,
    size: 160,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={() => onEdit(row.original)}
          className="flex items-center justify-center w-8 h-8 rounded-[8px] text-grey-500 hover:text-grey-900 hover:bg-grey-100 transition-colors"
          aria-label="Edit transaction"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(row.original)}
          className="flex items-center justify-center w-8 h-8 rounded-[8px] text-grey-500 hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label="Delete transaction"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];

// ─── Main Component ────────────────────────────────────────────
export const TransactionsTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 0);
  const pageSize = Number(searchParams.get("pageSize") ?? 10);
  const searchValue = searchParams.get("search") ?? "";
  const sortByValue = searchParams.get("sortBy") ?? "";
  const typeFilter = searchParams.get("type") ?? "ALL";
  const categoryFilter = searchParams.get("category") ?? "ALL";
  const dateFrom = searchParams.get("dateFrom") ?? null;
  const dateTo = searchParams.get("dateTo") ?? null;

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  const form = useForm({
    defaultValues: {
      search: searchValue,
      sortBy: sortByValue,
      type: typeFilter,
      category: categoryFilter,
      dateFrom: null,
      dateTo: null,
    },
  });

  const updateParams = (updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "ALL"
        ) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  };

  const handleExportPdf = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const searchParts = [];
    if (typeFilter !== "ALL")
      searchParts.push(`transactionType::${typeFilter}`);
    if (categoryFilter !== "ALL")
      searchParts.push(`category.id::${categoryFilter}`);
    if (dateFrom) searchParts.push(`transactionDate>=${dateFrom}`);
    if (dateTo) searchParts.push(`transactionDate<=${dateTo}`);

    const params = new URLSearchParams();
    if (searchParts.length) params.set("search", searchParts.join(","));
    if (searchValue) params.set("wildSearch", searchValue);

    window.open(
      `${apiUrl}/transactions/export/pdf?${params.toString()}`,
      "_blank",
    );
  };

  const resetPage = () => updateParams({ page: 0 });

  const isClearingRef = useRef(false);

  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === undefined) return; // skip programmatic resets

      if (isClearingRef.current) return;

      let value = values[name];
      // Format dates as yyyy-MM-dd for URL params
      if ((name === "dateFrom" || name === "dateTo") && value instanceof Date) {
        value = format(value, "yyyy-MM-dd");
      }

      updateParams({
        [name]: value,
        page: 0, // any filter change resets pagination
      });
    });
    return () => subscription.unsubscribe();
  }, [form, setSearchParams]);

  const sortParams = SORT_MAP[sortByValue] ?? {
    sortBy: "transactionDate",
    sortDir: "desc",
  };

  const { data, isFetching } = useQuery({
    queryKey: [
      "transactions",
      page,
      pageSize,
      searchValue,
      sortParams,
      categoryFilter,
      typeFilter,
      dateFrom,
      dateTo,
    ],
    queryFn: () => {
      const searchParts = [];
      if (typeFilter !== "ALL")
        searchParts.push(`transactionType::${typeFilter}`);
      if (categoryFilter !== "ALL")
        searchParts.push(`category.id::${categoryFilter}`);
      if (dateFrom) searchParts.push(`transactionDate>=${dateFrom}`); // ← add
      if (dateTo) searchParts.push(`transactionDate<=${dateTo}`);

      return getTransactions({
        page,
        pageSize,
        sort: `${sortParams.sortBy},${sortParams.sortDir}`,
        wildSearch: searchValue || undefined,
        search: searchParts.join(",") || undefined,
      });
    },
    placeholderData: keepPreviousData,
  });

  const transactions = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 0;
  const totalElements = data?.data?.totalElements ?? 0;

  // ── Categories for filter dropdown ───────────────────────────
  const { data: categoryData } = useQuery({
    queryKey: ["transactionCategories"],
    queryFn: getTransactionCategories,
  });
  const allCategories = categoryData?.data ?? [];
  const visibleCategories =
    typeFilter === "ALL"
      ? allCategories
      : allCategories.filter((c) => c.hiddenValue === typeFilter);

  const categoryOptions = [
    { value: "ALL", label: "All Categories" },
    ...visibleCategories.map((c) => ({
      value: String(c.id),
      label: c.visibleValue,
    })),
  ];

  const columns = buildColumns(setEditingTransaction, setDeletingTransaction);

  const activeFilterCount = [
    typeFilter !== "ALL",
    categoryFilter !== "ALL",
    sortByValue !== "",
    dateFrom !== null,
    dateTo !== null,
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    isClearingRef.current = true;
    // 1. Clear URL params
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("sortBy");
      next.delete("type");
      next.delete("category");
      next.delete("dateFrom");
      next.delete("dateTo");
      next.set("page", "0");

      return next;
    });

    // 2. Sync form values to match cleared URL
    form.setValue("sortBy", "");
    form.setValue("type", "ALL");
    form.setValue("category", "ALL");
    form.setValue("dateFrom", null);
    form.setValue("dateTo", null);

    setTimeout(() => {
      isClearingRef.current = false;
    }, 0);
  };
  return (
    <div className="py-6 px-5 flex flex-col gap-6 bg-white rounded-[12px]">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="flex-1 max-w-[280px] mr-auto">
          <SearchInput
            control={form.control}
            name="search"
            placeholder="Search transactions"
            debounceMs={300}
            onChange={resetPage}
          />
        </div>

        <TransactionFilters
          form={form}
          categoryOptions={categoryOptions}
          onClear={handleClearFilters}
          onExport={handleExportPdf}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* ── Table ── */}
      <DataTable
        data={transactions}
        columns={columns}
        manualPagination
        pageCount={totalPages}
        pagination={{ pageIndex: page, pageSize }}
        setPagination={(updater) => {
          const newPagination =
            typeof updater === "function"
              ? updater({ pageIndex: page, pageSize })
              : updater;
          updateParams({ page: newPagination.pageIndex });
        }}
        totalElements={totalElements}
        sorting={[]}
        isLoading={isFetching} // pass isFetching, not isLoading — works with placeholderData
      />

      <AddEditTransactionDialog
        isEdit
        transaction={editingTransaction}
        open={editingTransaction !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTransaction(null);
        }}
      />

      <DeleteTransactionDialog
        transactionId={deletingTransaction?.id}
        open={deletingTransaction !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingTransaction(null);
        }}
      />
    </div>
  );
};
