import { AddEditRecurringBillDialog } from "@/dialogs";
import { Bills, RecurringBillsSummary } from "./components";
import { Button } from "@/components/ui/button";

export const RecurringBills = () => {
  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-bold text-foreground">Recurring Bills</h2>
        <AddEditRecurringBillDialog
          customTrigger={<Button className="w-fit">+ Add New Bill</Button>}
        />
      </div>

      <div className="flex lg:items-start flex-col gap-6 lg:flex-row ">
        <div className="w-full lg:max-w-84.25">
          <RecurringBillsSummary />
        </div>
        <div className="flex-1">
          <Bills />
        </div>
      </div>
    </div>
  );
};
