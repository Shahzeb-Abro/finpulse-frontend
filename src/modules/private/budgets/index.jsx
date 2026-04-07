import { AddEditBudgetDialog } from "@/dialogs";

import { BudgetList, BudgetsSummary } from "./components";

export const Budgets = () => {
  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-bold text-foreground">Budgets</h2>
        <AddEditBudgetDialog />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="lg:max-w-107 w-full">
          <BudgetsSummary />
        </div>
        <div className="flex-1">
          <BudgetList />
        </div>
      </div>
    </div>
  );
};
