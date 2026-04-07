import { AddEditPotDialog } from "@/dialogs";
import { PotsList } from "./components";

export const Pots = () => {
  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-bold text-foreground">Pots</h2>
        <AddEditPotDialog />
      </div>

      <PotsList />
    </div>
  );
};
