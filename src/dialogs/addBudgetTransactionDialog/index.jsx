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
import { budgetTransactionSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const BUDGET_TRANSACTION_DESCRIPTION_MAX_LENGTH = 150;

export const AddBudgetTransactionDialog = ({
  budgetId = null,
  budgetName = "",
  customTrigger = null,
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      amount: "",
      description: "",
      date: "",
      receiverName: "",
    },
    resolver: zodResolver(budgetTransactionSchema),
  });

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={customTrigger && "w-full"} asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button>{"Add Transaction to " + budgetName}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="px-5 py-6 lg:p-8 rounded-[12px] bg-white max-w-83.75 md:max-w-140! w-full! flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-5">
          <div className="flex items-start gap-4 justify-between">
            <DialogTitle className="text-lg lg:text-3xl font-bold">
              {"Add Transaction"}
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>

          <DialogDescription>
            {"Add a transaction to this budget to keep track of your spending."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
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
                      {BUDGET_TRANSACTION_DESCRIPTION_MAX_LENGTH -
                        field.value?.length || 0}{" "}
                      characters left
                    </span>
                  }
                  maxLength={BUDGET_TRANSACTION_DESCRIPTION_MAX_LENGTH}
                />
              </CustomFormGroup>
            )}
          />

          <Controller
            name="receiverName"
            control={form.control}
            render={({ field }) => (
              <CustomFormGroup
                label="Receiver Name"
                name="receiverName"
                error={form.formState.errors.receiverName?.message}
              >
                <Input {...field} placeholder="e.g. John Doe" />
              </CustomFormGroup>
            )}
          />
        </form>

        <DialogFooter className=" pt-0 bg-transparent border-none">
          <Button className="w-full" onClick={form.handleSubmit(onSubmit)}>
            Add Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
