import { getBudgetSummary } from "@/api/budget";
import { IconCaretRight } from "@/components/icons";
import { useCurrency } from "@/context/CurrencyContext";
import { BudgetsSummaryChart } from "@/modules/private/budgets/components";
import { ROUTES } from "@/routes/routes";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export const BudgetsCard = () => {
  const { formatAmount } = useCurrency();
  const { data } = useQuery({
    queryKey: ["budgetsSummary"],
    queryFn: getBudgetSummary,
  });
  return (
    <div className="py-6 px-5 md:p-8 rounded-[12px] bg-white flex flex-col gap-5 w-full">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-foreground">Budgets</div>
        <Link
          to={ROUTES.budgets}
          className="flex items-center gap-3 text-grey-500 text-sm hover:text-foreground"
        >
          <span>See All</span>
          <span>
            <IconCaretRight />
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-4 items-center md:flex-row md:items-center">
        <div className="flex-1">
          <BudgetsSummaryChart data={data?.data} />
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-4 md:grid-cols-1">
          <div className="flex items-center gap-4 ">
            <span className="w-1 h-10 bg-green-sec rounded-full shrink-0"></span>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-grey-500">Entertainment</span>
              <div className="text-sm font-bold">{formatAmount(50)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 ">
            <span className="w-1 h-10 bg-cyan-sec rounded-full shrink-0"></span>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-grey-500">Bills</span>
              <div className="text-sm font-bold">{formatAmount(750)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 ">
            <span className="w-1 h-10 bg-navy-sec rounded-full shrink-0"></span>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-grey-500">Dining Out</span>
              <div className="text-sm font-bold">{formatAmount(75)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 ">
            <span className="w-1 h-10 bg-yellow-sec rounded-full shrink-0"></span>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-grey-500">Personal Care</span>
              <div className="text-sm font-bold">{formatAmount(100)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
