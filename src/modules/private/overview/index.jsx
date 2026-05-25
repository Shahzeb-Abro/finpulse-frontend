import {
  BalanceCards,
  BudgetsCard,
  PotsCard,
  RecurringBillsCard,
  TransactionsCard,
} from "./components";

export const Overview = () => {
  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-bold text-foreground">Overview</h2>
      </div>

      <div className="flex flex-col gap-8">
        <BalanceCards />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-4 lg:flex-1">
            <PotsCard />
            <TransactionsCard />
          </div>
          <div className="flex flex-col gap-4 lg:max-w-125 lg:w-full">
            <BudgetsCard />
            <RecurringBillsCard />
          </div>
        </div>
      </div>
    </div>
  );
};
