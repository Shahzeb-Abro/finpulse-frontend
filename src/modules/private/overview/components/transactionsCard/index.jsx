import { getTransactions } from "@/api/transaction";
import { DataTable } from "@/components/dataTable";
import { IconCaretRight } from "@/components/icons";
import { useCurrency } from "@/context/CurrencyContext";
import { useDateFormat } from "@/context/DateFormatContext";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/routes";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp } from "lucide-react";
import { FormattedDate } from "react-intl";
import { Link } from "react-router-dom";

const buildColumns = (formatAmount, formatDate) => [
  {
    accessorKey: "overview",
    header: "",
    meta: { flex: "1 1 0%" },
    cell: ({ row }) => {
      const { description, transactionType, transactionDate, amount } =
        row.original;

      const isIncome = transactionType === "INCOME";
      return (
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <span className="size-10 rounded-full flex items-center justify-center bg-beige-100">
              {isIncome ? <ArrowDown /> : <ArrowUp />}
            </span>
            <span className="text-sm font-medium">{description}</span>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={cn(
                "text-sm font-bold",
                isIncome ? "text-green-sec" : "text-foreground",
              )}
            >
              {isIncome ? "+" : "-"}
              {formatAmount(amount)}
            </span>
            <span className="text-xs text-grey-500">
              {formatDate(transactionDate)}
            </span>
          </div>
        </div>
      );
    },
  },
];

export const TransactionsCard = () => {
  const { formatAmount } = useCurrency();
  const { formatDate } = useDateFormat();
  const { data, isFetching } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => {
      return getTransactions({
        page: 0,
        pageSize: 5,
        sort: `transactionDate,desc`,
      });
    },
  });

  const columns = buildColumns(formatAmount, formatDate);

  const transactions = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 0;
  const totalElements = data?.data?.totalElements ?? 0;

  console.log("TransactionsCard data:", transactions);

  return (
    <div className="py-6 px-5 md:p-8 rounded-[12px] bg-white flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-foreground">Transactions</div>
        <Link
          to={ROUTES.transactions}
          className="flex items-center gap-3 text-grey-500 text-sm hover:text-foreground"
        >
          <span>See All</span>
          <span>
            <IconCaretRight />
          </span>
        </Link>
      </div>

      <div>
        <DataTable
          data={transactions}
          columns={columns}
          isLoading={isFetching}
          showPagination={false}
          manualPagination
          pageCount={totalPages}
          pagination={{ pageIndex: 0, pageSize: 5 }}
          setPagination={(updater) => {}}
          totalElements={totalElements}
        />
      </div>
    </div>
  );
};
