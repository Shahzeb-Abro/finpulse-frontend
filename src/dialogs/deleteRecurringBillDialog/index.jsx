import { deleteBill } from "@/api/recurringBill";
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

export const DeleteRecurringBillDialog = ({
  billId = null,
  billTitle = "",
  customTrigger = null,
  open: controlledOpen,
  onOpenChange: onChangeControlledOpen,
}) => {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onChangeControlledOpen ?? setInternalOpen;

  const { mutate: deleteBillMutation, isPending: isDeletingBill } = useMutation(
    {
      mutationFn: deleteBill,
      onSuccess: () => {
        toast.success("Recurring bill deleted successfully!");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["recurringBills"] });
      },
      onError: (err) => {
        toast.error(
          err?.message || "Failed to delete recurring bill. Please try again.",
        );
      },
    },
  );

  const handleDelete = () => {
    deleteBillMutation(billId);
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
              Delete '{billTitle}'?
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>

          <DialogDescription>
            Are you sure you want to delete this recurring bill? This action
            cannot be reversed, and all the data inside it will be removed
            forever.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className=" pt-0 bg-transparent border-none flex flex-col! gap-3">
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeletingBill}
            isLoading={isDeletingBill}
          >
            Yes, Confirm Deletion
          </Button>
          <DialogClose className="w-full">
            <button
              className="w-full text-grey-500 hover:text-foreground cursor-pointer"
              disabled={isDeletingBill}
            >
              No, I want to go back
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
