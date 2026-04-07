import { createPot, editPot } from "@/api/pot";
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
import { ThemeColorDropdown } from "@/dropdowns/themeColorDropdown";
import { potSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const POT_NAME_MAX_LENGTH = 30;

export const AddEditPotDialog = ({
  isEdit = false,
  pot = null,
  customTrigger = null,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      potName: pot?.name || "",
      target: pot?.targetAmount || "",
      theme: pot?.themeId || "blue",
    },
    resolver: zodResolver(potSchema),
  });

  const { mutate: createPotMutation, isPending: isCreating } = useMutation({
    mutationFn: createPot,
    onSuccess: (data) => {
      console.log("Pot created successfully:", data);
      const newPot = data?.data;
      toast.success("Pot created successfully!", {
        description: `You can now start adding money to your "${newPot?.name}" pot.`,
      });
      queryClient.setQueryData(["pots"], (old) => {
        if (!old) return old;
        console.log("Old pots data:", old);
        return {
          ...old,
          data: {
            ...old.data,
            content: [...(old.data?.content || []), newPot],
          },
        };
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating pot:", error);
      toast.error(
        error?.message ||
          "An error occurred while creating the pot. Please try again.",
      );
    },
  });

  const { mutate: editPotMutation, isPending: isEditing } = useMutation({
    mutationFn: editPot,
    onSuccess: (data) => {
      toast.success("Pot updated successfully!");
      const updatedPot = data?.data;
      queryClient.setQueryData(["pots"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            content: old?.data?.content?.map((p) =>
              p.id === updatedPot.id ? updatedPot : p,
            ),
          },
        };
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error updating pot:", error);
      toast.error(
        error?.message ||
          "An error occurred while updating the pot. Please try again.",
      );
    },
  });

  const onSubmit = (data) => {
    const potRequestData = {
      name: data.potName,
      targetAmount: Number(data.target),
      themeId: data.theme,
    };
    if (isEdit) {
      editPotMutation({ potId: pot?.id, potData: potRequestData });
    } else {
      createPotMutation(potRequestData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={customTrigger && "w-full"} asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button>{isEdit ? "Edit Pot" : "+ Add New Pot"}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="px-5 py-6 lg:p-8 rounded-[12px] bg-white max-w-83.75 md:max-w-140! w-full! flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-5">
          <div className="flex items-start gap-4 justify-between">
            <DialogTitle className="text-lg lg:text-3xl font-bold">
              {isEdit ? "Edit Pot" : "Add New Pot"}
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>

          <DialogDescription>
            {isEdit
              ? "If your saving targets change, feel free to update your pots."
              : "Create a pot to set savings targets. These can help keep you on track as you save for special purchases."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="potName"
            control={form.control}
            render={({ field }) => (
              <CustomFormGroup
                label="Pot Name"
                name="potName"
                error={form.formState.errors.potName?.message}
                description={`${POT_NAME_MAX_LENGTH - form.getValues("potName").length} characters left`}
              >
                <Input
                  {...field}
                  placeholder="e.g. Rainy Days"
                  maxLength={POT_NAME_MAX_LENGTH}
                />
              </CustomFormGroup>
            )}
          />

          <Controller
            name="target"
            control={form.control}
            render={({ field }) => (
              <CustomFormGroup
                label="Target"
                name="target"
                error={form.formState.errors.target?.message}
              >
                <Input
                  {...field}
                  placeholder="e.g. 2000"
                  preComponent={
                    <span className="text-xs font-medium text-grey-500">$</span>
                  }
                />
              </CustomFormGroup>
            )}
          />

          <ThemeColorDropdown
            name="theme"
            label="Theme"
            control={form.control}
            error={form.formState.errors.theme?.message}
            setValue={form.setValue}
            defaultThemeId={isEdit ? pot?.themeId : null}
          />
        </form>

        <DialogFooter className=" pt-0 bg-transparent border-none">
          <Button
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={isCreating || isEditing}
          >
            {isEdit ? "Save Changes" : "Add Pot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
