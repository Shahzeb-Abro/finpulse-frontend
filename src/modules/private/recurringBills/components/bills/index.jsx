import { useForm } from "react-hook-form";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { SearchInput } from "@/components/SearchInput";
import { SortByDropdown } from "@/dropdowns";
import { CircleCheck, CircleAlert, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { getRecurringBills } from "@/api/recurringBill";
import {
  AddEditRecurringBillDialog,
  DeleteRecurringBillDialog,
} from "@/dialogs";
import { useDateFormat } from "@/context/DateFormatContext";
const SORT_MAP = {
  1: { sortBy: "nextPaymentDate", sortDir: "asc" }, // Soonest
  2: { sortBy: "nextPaymentDate", sortDir: "desc" }, // Latest
  3: { sortBy: "title", sortDir: "asc" }, // A to Z
  4: { sortBy: "title", sortDir: "desc" }, // Z to A
  5: { sortBy: "amount", sortDir: "desc" }, // Highest
  6: { sortBy: "amount", sortDir: "asc" }, // Lowest
};

const buildColumns = (formatAmount, onEdit, onDelete, formatDate) => [
  {
    accessorKey: "title",
    header: "Bill Title",
    meta: { flex: "1 1 0%" },
    cell: ({ row }) => {
      const { title, categoryVisibleValue } = row.original;
      return (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-bold text-grey-900 truncate">
            {title}
          </span>
          {categoryVisibleValue && (
            <span className="text-xs text-grey-500">
              {categoryVisibleValue}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "nextPaymentDate",
    header: "Next Due",
    size: 160,
    cell: ({ row }) => {
      const { nextPaymentDate, status, frequency } = row.original;
      const isPaid = status === "PAID";
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <span
              className={cn(
                "text-xs font-medium",
                isPaid ? "text-green-sec" : "text-grey-900",
              )}
            >
              {nextPaymentDate ? formatDate(new Date(nextPaymentDate)) : "—"}
            </span>
            <span className="text-xs text-grey-500 capitalize">
              {frequency?.toLowerCase()}
            </span>
          </div>
          {isPaid ? (
            <CircleCheck className="w-4 h-4 text-green-sec shrink-0" />
          ) : (
            <CircleAlert className="w-4 h-4 text-destructive shrink-0" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <span className="text-right w-full block">Amount</span>,
    size: 120,
    cell: ({ row }) => {
      const { amount } = row.original;
      return (
        <span className={cn("text-sm font-bold text-right w-full block")}>
          {formatAmount(amount)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="text-right w-full block">Actions</span>,
    size: 160,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={() => onEdit(row.original)}
          className="flex items-center justify-center w-8 h-8 rounded-[8px] text-grey-500 hover:text-grey-900 hover:bg-grey-100 transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(row.original)}
          className="flex items-center justify-center w-8 h-8 rounded-[8px] text-grey-500 hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];

export const Bills = () => {
  const { formatAmount } = useCurrency();
  const { formatDate } = useDateFormat();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [edittingBill, setEdittingBill] = useState(null);
  const [deletingBill, setDeletingBill] = useState(null);

  const form = useForm({
    defaultValues: { search: "", sortBy: "" },
  });

  const searchValue = form.watch("search");
  const sortByValue = form.watch("sortBy");
  const sortParams = SORT_MAP[sortByValue] ?? {
    sortBy: "nextPaymentDate",
    sortDir: "asc",
  };

  const { data, isFetching } = useQuery({
    queryKey: ["recurringBills", pagination.pageIndex, searchValue, sortParams],
    queryFn: () =>
      getRecurringBills({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sort: `${sortParams.sortBy},${sortParams.sortDir}`,
        wildSearch: searchValue || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const bills = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 0;
  const totalElements = data?.data?.totalElements ?? 0;

  const columns = buildColumns(
    formatAmount,
    setEdittingBill,
    setDeletingBill,
    formatDate,
  );

  return (
    <div className="py-6 px-5 flex flex-col gap-6 bg-white rounded-[12px]">
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-[280px]">
          <SearchInput
            control={form.control}
            name="search"
            placeholder="Search bills"
            debounceMs={300}
            onChange={() => setPagination((p) => ({ ...p, pageIndex: 0 }))}
          />
        </div>
        <div className="ml-auto">
          <SortByDropdown
            control={form.control}
            name="sortBy"
            label="Sort by"
            onChange={() => setPagination((p) => ({ ...p, pageIndex: 0 }))}
          />
        </div>
      </div>

      <DataTable
        data={bills}
        columns={columns}
        manualPagination
        pageCount={totalPages}
        pagination={pagination}
        setPagination={setPagination}
        totalElements={totalElements}
        sorting={[]}
        isLoading={isFetching}
      />

      <AddEditRecurringBillDialog
        open={edittingBill !== null}
        onOpenChange={(open) => {
          if (!open) setEdittingBill(null);
        }}
        bill={edittingBill}
        isEdit
      />

      <DeleteRecurringBillDialog
        open={deletingBill !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingBill(null);
        }}
        billId={deletingBill?.id}
        billTitle={deletingBill?.title}
      />
    </div>
  );
};
