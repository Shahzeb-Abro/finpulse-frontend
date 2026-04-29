import { deleteTransaction } from "@/api/transaction";
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

export const DeleteTransactionDialog = ({
  transactionId = null,
  customTrigger = null,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}) => {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, else internal
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  const { mutate: deleteTransactionMutation, isPending } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      toast.success("Transaction deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(
        error?.message || "Failed to delete transaction. Please try again.",
      );
    },
  });

  const handleDelete = () => {
    deleteTransactionMutation(transactionId);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={customTrigger && "w-full"} asChild>
        {customTrigger && customTrigger}
      </DialogTrigger>
      <DialogContent className="px-5 py-6 lg:p-8  rounded-[12px] bg-white  max-w-83.75 md:max-w-140! w-full! flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-5">
          <div className="flex items-start gap-4 justify-between">
            <DialogTitle className="text-lg lg:text-3xl font-bold">
              Delete transaction?
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>

          <DialogDescription>
            Are you sure you want to delete this transaction? This action cannot
            be reversed, and all the data inside it will be removed forever.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className=" pt-0 bg-transparent border-none flex flex-col! gap-3">
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            isLoading={isPending}
          >
            Yes, Confirm Deletion
          </Button>
          <DialogClose className="w-full">
            <button className="w-full text-grey-500 hover:text-foreground cursor-pointer">
              No, I want to go back
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
