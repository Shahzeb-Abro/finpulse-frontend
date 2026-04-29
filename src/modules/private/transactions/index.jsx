import { AddEditTransactionDialog } from "@/dialogs";
import { TransactionsTable } from "./components";
import { Button } from "@/components/ui/button";

export const Transactions = () => {
  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-bold text-foreground">Transactions</h2>
        <AddEditTransactionDialog
          customTrigger={
            <Button className="w-fit">+ Add New Transaction</Button>
          }
        />
      </div>

      <div>
        <TransactionsTable />
      </div>
    </div>
  );
};
