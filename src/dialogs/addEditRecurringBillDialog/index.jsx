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
import { Textarea } from "@/components/ui/textarea";
import { useCurrency } from "@/context/CurrencyContext";
import { recurringBillSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BillFrequency } from "./components";
import { TransactionCategoryDropdown } from "@/dropdowns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecurringBill, editBill } from "@/api/recurringBill";
import { format } from "date-fns";
import { toast } from "sonner";

const BILL_TITLE_MAX_LENGTH = 30;
const BILL_DESCRIPTION_MAX_LENGTH = 150;

export const AddEditRecurringBillDialog = ({
  isEdit = false,
  bill = null,
  customTrigger = null,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}) => {
  const { currencySymbol } = useCurrency();
  const [internalOpen, setInternalOpen] = useState(false);
  const queryClient = useQueryClient();

  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const form = useForm({
    defaultValues: {
      title: bill?.title || "",
      amount: bill?.amount || "",
      description: bill?.description || "",
      frequency: bill?.frequency || "",
      dueDate: bill?.dueDate || null,
      categoryId: bill?.categoryId || "",
    },
    resolver: zodResolver(recurringBillSchema),
  });

  console.log("Bill", bill);

  useEffect(() => {
    if (isEdit && bill) {
      form.reset({
        title: bill?.title || "",
        amount: bill?.amount || "",
        description: bill?.description || "",
        frequency: bill?.frequency || "",
        dueDate: bill?.dueDate || null,
        categoryId: bill?.categoryId || "",
      });
    }
  }, [isEdit, bill]);

  const {
    mutate: createRecurringBillMutation,
    isPending: isCreatingRecurringBill,
  } = useMutation({
    mutationFn: createRecurringBill,
    onSuccess: () => {
      toast.success("Recurring bill created successfully!");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["recurringBills"] });
      form.reset();
    },
    onError: (err) => {
      toast.error("Failed to create recurring bill. Please try again.");
      console.error("Create recurring bill error:", err);
    },
  });

  const { mutate: editBillMutation, isPending: isEdittingBill } = useMutation({
    mutationFn: editBill,
    onSuccess: () => {
      toast.success("Recurring bill edited successfully!");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["recurringBills"] });
      form.reset();
    },
    onError: (err) => {
      toast.error(
        err?.message || "Failed to edit recurring bill. Please try again.",
      );
    },
  });

  const onSubmit = (data) => {
    console.log("In Submit", data);
    const requestBody = {
      title: data.title,
      amount: data.amount,
      description: data.description || null,
      frequency: data.frequency,
      categoryId: Number(data.categoryId),
      dueDate: format(data.dueDate, "yyyy-MM-dd"),
    };

    if (isEdit) {
      console.log("In Edit", data);
      const editRequestBody = {
        id: bill?.id,
        data: requestBody,
      };
      editBillMutation(editRequestBody);
    } else {
      createRecurringBillMutation(requestBody);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={customTrigger && "w-full"} asChild>
        {customTrigger && customTrigger}
      </DialogTrigger>
      <DialogContent className="px-5 py-6 lg:p-8 rounded-[12px] bg-white max-w-83.75 md:max-w-140! w-full! flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-5">
          <div className="flex items-start gap-4 justify-between">
            <DialogTitle className="text-lg lg:text-3xl font-bold">
              {isEdit ? "Edit Bill" : "Add New Bill"}
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>

          <DialogDescription>
            {isEdit
              ? "Make changes to your bill details. Keeping your bills updated can help you stay on top of your recurring expenses and manage your finances effectively."
              : "Create a bill to set recurring expenses. These can help keep you on track as you save for special purchases."}
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
                label="Bill Title"
                name="title"
                error={form.formState.errors.title?.message}
                description={`${BILL_TITLE_MAX_LENGTH - form.getValues("title").length} characters left`}
              >
                <Input
                  {...field}
                  placeholder="e.g. Youtube Premium"
                  maxLength={BILL_TITLE_MAX_LENGTH}
                />
              </CustomFormGroup>
            )}
          />

          <Controller
            name="amount"
            control={form.control}
            render={({ field }) => (
              <CustomFormGroup
                label="Amount"
                name="amount"
                error={form.formState.errors.amount?.message}
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

          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <CustomFormGroup
                label="Description"
                name="description"
                error={form.formState.errors.description?.message}
              >
                <Textarea
                  {...field}
                  placeholder="e.g. Youtube Premium subscription for ad-free videos and offline downloads"
                  description={
                    <span className="text-xs text-grey-500">
                      {BILL_DESCRIPTION_MAX_LENGTH - field.value?.length || 0}{" "}
                      characters left
                    </span>
                  }
                  maxLength={BILL_DESCRIPTION_MAX_LENGTH}
                />
              </CustomFormGroup>
            )}
          />

          <TransactionCategoryDropdown
            name="categoryId"
            label="Bill Category"
            error={form.formState.errors.categoryId?.message}
            control={form.control}
            transactionType={"EXPENSE"}
          />

          <BillFrequency
            control={form.control}
            name="frequency"
            label="Frequency"
            error={form.formState.errors.frequency?.message}
            setValue={form.setValue}
            dueDateName="dueDate"
          />
        </form>

        <DialogFooter className=" pt-0 bg-transparent border-none">
          <Button
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isCreatingRecurringBill || isEdittingBill}
            isLoading={isCreatingRecurringBill || isEdittingBill}
          >
            {isEdit ? "Save Changes" : "Add Bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
