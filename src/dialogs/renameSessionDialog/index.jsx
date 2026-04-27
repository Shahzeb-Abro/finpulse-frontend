import { CustomFormGroup } from "@/components/customFormGroup";
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
import { Input } from "@/components/ui/input";
import { useRenameChatSession } from "@/hooks/useAssistant";
import { sessionSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const SESSION_NAME_MAX_LENGTH = 50;

export const RenameSessionDialog = ({
  session = null,
  customTrigger = null,
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: session?.title || "",
    },
    resolver: zodResolver(sessionSchema),
  });

  const { mutate: editSessionTitle, isPending: isEditingTitle } =
    useRenameChatSession(session?.id, form.getValues("title"), () => {
      toast.success("Session renamed successfully!");
      setOpen(false);
    });

  const onSubmit = (data) => {
    editSessionTitle();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={customTrigger && "w-full"} asChild>
        {customTrigger ? customTrigger : <Button>Rename Session</Button>}
      </DialogTrigger>
      <DialogContent className="px-5 py-6 lg:p-8 rounded-[12px] bg-white max-w-83.75 md:max-w-140! w-full! flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-5">
          <div className="flex items-start gap-4 justify-between">
            <DialogTitle className="text-lg lg:text-3xl font-bold">
              Rename Session
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>

          <DialogDescription>
            Rename your session to better reflect its purpose.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field }) => (
              <CustomFormGroup
                label="Session Title"
                name="title"
                error={form.formState.errors.title?.message}
                description={`${SESSION_NAME_MAX_LENGTH - form.getValues("title").length} characters left`}
              >
                <Input
                  {...field}
                  placeholder="e.g. Rainy Days"
                  maxLength={SESSION_NAME_MAX_LENGTH}
                />
              </CustomFormGroup>
            )}
          />
        </form>

        <DialogFooter className=" pt-0 bg-transparent border-none">
          <Button
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isEditingTitle}
            isLoading={isEditingTitle}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
