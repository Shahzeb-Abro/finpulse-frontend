import { useQuery } from "@tanstack/react-query";
import { Budget } from "..";
import { getAllBudgets } from "@/api/budget";

export const BudgetList = () => {
  const { data } = useQuery({
    queryKey: ["budgets"],
    queryFn: getAllBudgets,
  });

  const budgets = data?.data || [];

  return (
    <div className="flex flex-col gap-6">
      {budgets.map((budget) => (
        <Budget key={budget.id} budget={budget} />
      ))}
    </div>
  );
};
