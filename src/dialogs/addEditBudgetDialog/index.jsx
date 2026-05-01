import { createBudget, editBudget } from "@/api/budget";
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
import { BudgetCategoryDropdown } from "@/dropdowns/budgetCategoryDropdown";
import { ThemeColorDropdown } from "@/dropdowns/themeColorDropdown";
import { budgetSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { BudgetPeriod } from "./components";
import { useCurrency } from "@/context/CurrencyContext";

export const AddEditBudgetDialog = ({
  isEdit = false,
  budget = null,

  customTrigger = null,
}) => {
  const { currencySymbol } = useCurrency();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      budgetCategoryId: budget?.budgetCategoryId || "",
      maximumSpend: budget?.maximumSpend || "",
      budgetThemeId: budget?.budgetThemeId || "blue",
      budgetPeriodId: budget?.budgetPeriodId || "",
      startDate: budget?.startDate ? new Date(budget.startDate) : null,
      endDate: budget?.endDate ? new Date(budget.endDate) : null,
    },
    resolver: zodResolver(budgetSchema),
  });

  const { mutate: createBudgetMutate, isPending: isCreating } = useMutation({
    mutationFn: createBudget,
    onSuccess: (data) => {
      console.log("Budget created successfully:", data);
      toast.success("Budget created successfully!");

      queryClient.setQueryData(["budgets"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [...old.data, data?.data],
        };
      });
      queryClient.invalidateQueries(["budgetSummary"]);
      setOpen(false);

      form.reset();
    },
    onError: (error) => {
      console.error("Error creating budget:", error);
      toast.error(
        error?.message || "Failed to create budget. Please try again.",
      );
    },
  });

  const { mutate: editBudgetMutate, isPending: isEditing } = useMutation({
    mutationFn: (data) => editBudget(budget.id, data),
    onSuccess: (data) => {
      console.log("Budget edited successfully:", data);
      toast.success("Budget updated successfully!");
      queryClient.setQueryData(["budgets"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((b) => (b.id === budget.id ? data?.data : b)),
        };
      });
      queryClient.invalidateQueries(["budgetSummary"]);
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error editing budget:", error);
      toast.error(
        error?.message || "Failed to update budget. Please try again.",
      );
    },
  });

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
    if (isEdit) {
      editBudgetMutate(data);
    } else {
      createBudgetMutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={customTrigger && "w-full"} asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button>{isEdit ? "Edit Budget" : "+ Add New Budget"}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="px-5 py-6 lg:p-8 rounded-[12px] bg-white max-w-83.75 md:max-w-140! w-full! flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-5">
          <div className="flex items-start gap-4 justify-between">
            <DialogTitle className="text-lg lg:text-3xl font-bold">
              {isEdit ? "Edit Budget" : "Add New Budget"}
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>

          <DialogDescription>
            {isEdit
              ? "As your budgets change, feel free to update your spending limits."
              : "Choose a category to set a spending budget. These categories can help you monitor spending."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <BudgetCategoryDropdown
            name="budgetCategoryId"
            label="Budget Category"
            error={form.formState.errors.budgetCategoryId?.message}
            control={form.control}
          />

          <Controller
            name="maximumSpend"
            control={form.control}
            render={({ field }) => (
              <CustomFormGroup
                label="Maximum Spend"
                name="maximumSpend"
                error={form.formState.errors.maximumSpend?.message}
              >
                <Input
                  {...field}
                  placeholder="e.g. 2000"
                  preComponent={
                    <span className="text-xs font-medium text-grey-500">
                      {currencySymbol}
                    </span>
                  }
                />
              </CustomFormGroup>
            )}
          />

          <BudgetPeriod
            control={form.control}
            name="budgetPeriodId"
            startDateName="startDate"
            endDateName="endDate"
            label="Budget Period"
            setValue={form.setValue}
            error={form.formState.errors.budgetPeriodId?.message}
            defaultPeriodId={isEdit ? budget?.budgetPeriodId : null}
            defaultStartDate={
              isEdit && budget?.startDate ? new Date(budget.startDate) : null
            }
            defaultEndDate={
              isEdit && budget?.endDate ? new Date(budget.endDate) : null
            }
          />

          <ThemeColorDropdown
            name="budgetThemeId"
            label="Theme"
            control={form.control}
            error={form.formState.errors.budgetThemeId?.message}
            setValue={form.setValue}
            defaultThemeId={isEdit ? budget?.budgetThemeId : null}
          />
        </form>

        <DialogFooter className=" pt-0 bg-transparent border-none">
          <Button
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isCreating || isEditing}
            isLoading={isCreating || isEditing}
          >
            {isEdit ? "Save Changes" : "Add Budget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
