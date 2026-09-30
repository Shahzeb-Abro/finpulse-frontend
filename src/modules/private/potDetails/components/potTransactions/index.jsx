import { useCurrency } from "@/context/CurrencyContext";
import { useDateFormat } from "@/context/DateFormatContext";
import { cn } from "@/lib/utils";

export const PotTransactions = ({ potTransactions }) => {
  const { formatDate } = useDateFormat();
  const { formatAmount } = useCurrency();

  return (
    <div className="py-6 px-5 rounded-[12px] bg-white flex flex-col gap-8">
      <div className="text-lg font-bold">Pot Transactions</div>

      <div>
        {potTransactions?.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No transactions yet.
          </div>
        ) : (
          <div className="space-y-4">
            {potTransactions?.map((transaction) => (
              <div
                key={transaction.id}
                className="border-b border-gray-200 pb-4 flex items-center justify-between"
              >
                <div
                  className={cn(
                    transaction?.isAddition
                      ? "text-green-sec"
                      : "text-foreground",
                    "text-lg font-medium",
                  )}
                >
                  {transaction?.isAddition ? "+" : "-"}
                  {formatAmount(transaction.amount)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(transaction.createdDate)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
