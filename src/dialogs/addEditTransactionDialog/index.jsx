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
import { TransactionTypeToggle } from "./components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "@/lib/validations";
import { CustomFormGroup } from "@/components/customFormGroup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";
import { TransactionCategoryDropdown } from "@/dropdowns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction, editTransaction } from "@/api/transaction";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const DESCRIPTION_MAX_LENGTH = 150;

export const AddEditTransactionDialog = ({
  isEdit = false,
  transaction = null,
  customTrigger = null,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}) => {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, else internal
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  const form = useForm({
    defaultValues: {
      type: transaction?.type || "EXPENSE",
      amount: transaction?.amount || "",
      description: transaction?.description || "",
      date: transaction?.transactionDate
        ? new Date(transaction.transactionDate)
        : new Date(),
      receiverName: transaction?.receiverName || "",
      category: transaction?.categoryId || "",
    },
    resolver: zodResolver(transactionSchema),
  });

  useEffect(() => {
    if (isEdit && transaction) {
      form.reset({
        type: transaction.transactionType,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.transactionDate
          ? new Date(transaction.transactionDate)
          : new Date(),
        receiverName: transaction.receiverName,
        category: transaction.categoryId,
      });
    }
  }, [isEdit, transaction]);

  const {
    mutate: createTransactionMutation,
    isPending: isCreatingTransaction,
  } = useMutation({
    mutationFn: createTransaction,
    onSuccess: (data) => {
      console.log("Transaction created successfully:", data);
      toast.success("Transaction created successfully!");
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction. Please try again.");
    },
  });

  const { mutate: editTransactionMutation, isPending: isEditingTransaction } =
    useMutation({
      mutationFn: editTransaction,
      onSuccess: (data) => {
        console.log("Transaction edited successfully:", data);
        toast.success("Transaction updated successfully!");
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["transactions"] });

        setOpen(false);
      },
      onError: (error) => {
        console.error("Error editing transaction:", error);
        toast.error("Failed to update transaction. Please try again.");
      },
    });

  const onSubmit = (data) => {
    if (!isEdit) {
      const requestBody = {
        transactionType: data.type,
        amount: parseFloat(data.amount),
        description: data.description,
        transactionDate: data.date.toISOString(),
        categoryId: data.category,
      };

      createTransactionMutation(requestBody);
    } else {
      const requestBody = {
        transactionType: data?.type,
        amount: parseFloat(data.amount),
        description: data.description,
        transactionDate: data.date.toISOString(),
        categoryId: data.category,
      };

      editTransactionMutation({ id: transaction.id, data: requestBody });
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
              {isEdit ? "Edit Transaction" : "Add New Transaction"}
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>

          <DialogDescription>
            {isEdit
              ? "If your saving targets change, feel free to update your transactions."
              : "Create a transaction to track your spending and savings. These can help keep you on track as you manage your finances."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <TransactionTypeToggle
            control={form.control}
            name="type"
            error={form.formState.errors.type?.message}
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
                    <span className="text-xs font-medium text-grey-500">$</span>
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
                  placeholder="e.g. Groceries for the week"
                  description={
                    <span className="text-xs text-grey-500">
                      {DESCRIPTION_MAX_LENGTH - field.value?.length || 0}{" "}
                      characters left
                    </span>
                  }
                  maxLength={DESCRIPTION_MAX_LENGTH}
                />
              </CustomFormGroup>
            )}
          />
          <DatePicker
            name="date"
            control={form.control}
            error={form.formState.errors.date?.message}
            disabled={{ after: new Date() }}
          />

          <TransactionCategoryDropdown
            name="category"
            label="Transaction Category"
            error={form.formState.errors.category?.message}
            control={form.control}
            transactionType={form.watch("type")}
          />
        </form>

        <DialogFooter className=" pt-0 bg-transparent border-none">
          <Button
            className="w-full"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isEditingTransaction || isCreatingTransaction}
            isLoading={isEditingTransaction || isCreatingTransaction}
          >
            {isEdit ? "Save Changes" : "Add Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
