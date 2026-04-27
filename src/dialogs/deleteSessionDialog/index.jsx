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
import { useDeleteChatSession } from "@/hooks/useAssistant";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteSessionDialog = ({
  sessionId = null,
  customTrigger = null,
}) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    toast.success("Session deleted successfully!");
    setOpen(false);
  };

  const { mutate: deleteMutation, isPending: isLoading } = useDeleteChatSession(
    sessionId,
    handleSuccess,
  );

  const handleDelete = () => {
    deleteMutation();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={customTrigger && "w-full"} asChild>
        {customTrigger ? customTrigger : <Button>Delete Session</Button>}
      </DialogTrigger>
      <DialogContent className="px-5 py-6 lg:p-8  rounded-[12px] bg-white  max-w-83.75 md:max-w-140! w-full! flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-5">
          <div className="flex items-start gap-4 justify-between">
            <DialogTitle className="text-lg lg:text-3xl font-bold">
              Delete Session?
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>

          <DialogDescription>
            Are you sure you want to delete this session? This action cannot be
            reversed, and all the data inside it will be removed forever.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className=" pt-0 bg-transparent border-none flex flex-col! gap-3">
          <Button
            className="w-full"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Yes, Confirm Deletion
          </Button>
          <DialogClose className="w-full">
            <button
              className="w-full text-grey-500 hover:text-foreground cursor-pointer"
              disabled={isLoading}
            >
              No, I want to go back
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
