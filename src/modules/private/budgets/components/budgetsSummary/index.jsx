import { useQuery } from "@tanstack/react-query";
import { BudgetsSummaryChart } from "..";
import { getBudgetSummary } from "@/api/budget";
import { useCurrency } from "@/context/CurrencyContext";

export const BudgetsSummary = () => {
  const { formatAmount } = useCurrency();
  const { data } = useQuery({
    queryKey: ["budgetsSummary"],
    queryFn: getBudgetSummary,
  });

  const summary = data?.data || {};
  return (
    <div className="bg-white rounded-[12px] flex flex-col gap-8 px-5 py-6 p-8">
      <div className="flex items-center justify-center">
        <BudgetsSummaryChart data={summary} />
      </div>
      {/* Spending Summary  */}
      <div className="flex flex-col gap-6">
        <h3 className="text-lg font-bold">Spending Summary</h3>
        <div className="flex flex-col">
          {summary?.budgetSummaryItems?.map((item, index) => (
            <>
              <div className="flex items-center gap-4 justify-between">
                <div className="flex gap-4">
                  <span
                    className="w-1 h-6 rounded-lg"
                    style={{ backgroundColor: item.theme }}
                  ></span>
                  <span className="text-sm text-grey-500">{item.name}</span>
                </div>{" "}
                <div className="flex items-center gap-1">
                  <span className="text-base font-bold">
                    {formatAmount(item.currentSpend)}
                  </span>
                  <span className="text-xs text-grey-500">
                    of {formatAmount(item.maximumSpend)}
                  </span>
                </div>
              </div>
              {index !== summary?.budgetSummaryItems?.length - 1 && (
                <hr className="my-4 border-t border-gray-100" />
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
