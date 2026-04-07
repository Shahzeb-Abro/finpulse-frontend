import { useQuery } from "@tanstack/react-query";
import { BudgetsSummaryChart } from "..";
import { getBudgetSummary } from "@/api/budget";

const SPENDING_SUMMARY_DATA = [
  {
    id: 1,
    color: "hsl(177, 52%, 32%)",
    category: "Entertainment",
    amountSpent: 15,
    budgetLimit: 150,
  },
  {
    id: 2,
    color: " hsl(190, 52%, 68%)",
    category: "Bills",
    amountSpent: 150,
    budgetLimit: 750,
  },
  {
    id: 3,
    color: "hsl(28, 73%, 81%)",
    category: "Dining Out",
    amountSpent: 133,
    budgetLimit: 75,
  },
  {
    id: 4,
    color: "hsl(259, 30%, 56%)",
    category: "Personal Care",
    amountSpent: 40,
    budgetLimit: 100,
  },
];

export const BudgetsSummary = () => {
  const { data, isLoading } = useQuery({
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
                    ${item.currentSpend.toFixed(2)}
                  </span>
                  <span className="text-xs text-grey-500">
                    of ${item.maximumSpend.toFixed(2)}
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
