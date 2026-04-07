import { deleteBudget } from "@/api/budget";
import { IconClose } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteBudgetDialog = ({
  budgetName = "",
  budgetId = null,
  customTrigger = null,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteBudgetMutate, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteBudget(budgetId),
    onSuccess: (data) => {
      console.log("Budget deleted successfully:", data);
      toast.success("Budget deleted successfully!");

      queryClient.setQueryData(["budgets"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((b) => b.id !== budgetId),
        };
      });
      queryClient.invalidateQueries(["budgetSummary"]);
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting budget:", error);
      toast.error(
        error?.message || "Failed to delete budget. Please try again.",
      );
    },
  });

  const handleDelete = () => {
    deleteBudgetMutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={customTrigger && "w-full"} asChild>
        {customTrigger ? customTrigger : <Button>Delete Budget</Button>}
      </DialogTrigger>
      <DialogContent className="px-5 py-6 lg:p-8  rounded-[12px] bg-white  max-w-83.75 md:max-w-140! w-full! flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-5">
          <div className="flex items-start gap-4 justify-between">
            <DialogTitle className="text-lg lg:text-3xl font-bold">
              Delete '{budgetName}'?
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>

          <DialogDescription>
            Are you sure you want to delete this budget? This action cannot be
            reversed, and all the data inside it will be removed forever.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className=" pt-0 bg-transparent border-none flex flex-col! gap-3">
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            isLoading={isDeleting}
          >
            Yes, Confirm Deletion
          </Button>
          <DialogClose className="w-full">
            <button className="w-full text-grey-500 hover:text-foreground cursor-pointer">
              No, Go Back
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
