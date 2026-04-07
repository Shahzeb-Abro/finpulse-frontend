import { useForm } from "react-hook-form";
import { DataTable } from "@/components/DataTable";
import { SearchInput } from "@/components/SearchInput";
import { SortByDropdown } from "@/dropdowns";

import { CircleCheck, CircleAlert } from "lucide-react";

const billColumns = [
  {
    accessorKey: "title",
    header: "Bill Title",
    meta: { flex: "1 1 0%" },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: row.original.iconBg }}
        >
          {row.original.icon}
        </div>
        <span className="text-sm font-bold text-grey-900">
          {row.original.title}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    size: 180,
    cell: ({ row }) => {
      const { dueDate, isPaid } = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary-green">{dueDate}</span>
          {isPaid ? (
            <CircleCheck className="w-4 h-4 text-secondary-green" />
          ) : (
            <CircleAlert className="w-4 h-4 text-secondary-red" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <span className="text-right w-full block">Amount</span>,
    size: 120,
    cell: ({ getValue, row }) => (
      <span
        className={`text-sm font-bold text-right w-full block ${
          row.original.isPaid ? "text-grey-900" : "text-secondary-red"
        }`}
      >
        ${getValue().toFixed(2)}
      </span>
    ),
  },
];

const SORT_MAP = {
  1: { id: "dueDate", desc: true }, // Latest
  2: { id: "dueDate", desc: false }, // Oldest
  3: { id: "title", desc: false }, // A to Z
  4: { id: "title", desc: true }, // Z to A
  5: { id: "amount", desc: true }, // Highest
  6: { id: "amount", desc: false }, // Lowest
};

export const Bills = () => {
  const form = useForm({
    defaultValues: { search: "", sortBy: "" },
  });

  const searchValue = form.watch("search");
  const sortByValue = form.watch("sortBy");
  const sorting = SORT_MAP[sortByValue] ? [SORT_MAP[sortByValue]] : [];

  return (
    <div className="py-6 px-5 flex flex-col gap-6 bg-white rounded-[12px]">
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-[280px]">
          <SearchInput
            control={form.control}
            name="search"
            placeholder="Search bills"
            debounceMs={300}
          />
        </div>
        <div className="ml-auto">
          <SortByDropdown
            control={form.control}
            name="sortBy"
            label="Sort by"
          />
        </div>
      </div>

      <DataTable
        data={MOCK_BILLS}
        columns={billColumns}
        pageSize={5}
        globalFilter={searchValue}
        sorting={sorting}
      />
    </div>
  );
};

const MOCK_BILLS = [
  {
    title: "Elevate Education",
    iconBg: "#277C78",
    icon: "🎓",
    dueDate: "Monthly -1st",
    isPaid: true,
    amount: 250.0,
  },
  {
    title: "Bravo Zen Spa",
    iconBg: "#F2CDAC",
    icon: "🧖",
    dueDate: "Monthly -3rd",
    isPaid: true,
    amount: 70.0,
  },
  {
    title: "Charlie Electric Company",
    iconBg: "#C94736",
    icon: "⚡",
    dueDate: "Monthly -5th",
    isPaid: false,
    amount: 10.0,
  },
  {
    title: "Delta Taxi",
    iconBg: "#826CB0",
    icon: "🚕",
    dueDate: "Monthly -6th",
    isPaid: false,
    amount: 30.0,
  },
  {
    title: "Echo Game Store",
    iconBg: "#597C7C",
    icon: "🎮",
    dueDate: "Monthly -12th",
    isPaid: true,
    amount: 5.0,
  },
  {
    title: "Tango Gas Company",
    iconBg: "#F2CDAC",
    icon: "⛽",
    dueDate: "Monthly -22nd",
    isPaid: true,
    amount: 225.0,
  },
  {
    title: "Juliet Restaurant",
    iconBg: "#C94736",
    icon: "🍽️",
    dueDate: "Monthly -28th",
    isPaid: true,
    amount: 950.0,
  },
];
