import { addMoneyToPot, withdrawMoneyFromPot } from "@/api/pot";
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
import { cn } from "@/lib/utils";
import { addWithdrawPotSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export const AddWithdrawPotDialog = ({
  pot = null,
  isAdd = false,
  isWithdraw = false,
  customTrigger = null,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      amount: "",
    },
    resolver: zodResolver(addWithdrawPotSchema),
  });

  const {
    mutate: addWithdrawMoneyMutation,
    isPending: isAddingWithdrawingMoney,
  } = useMutation({
    mutationFn: isAdd ? addMoneyToPot : withdrawMoneyFromPot,
    onSuccess: (data) => {
      toast.success(
        `Money ${isAdd ? "added to" : "withdrawn from"} pot successfully!`,
      );
      const newPot = data?.data;
      queryClient.setQueryData(["pots"], (old) => {
        if (!old) return old;
        console.log("Old pots:", old);
        return {
          ...old,
          data: {
            ...old.data,
            content: old.data?.content?.map((p) =>
              p.id === newPot.id ? newPot : p,
            ),
          },
        };
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error?.message ||
          `Failed to ${isAdd ? "add money to" : "withdraw money from"} pot. Please try again.`,
      );
    },
  });

  const onSubmit = (data) => {
    addWithdrawMoneyMutation({
      potId: pot?.id,
      amount: data.amount,
    });
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger className={customTrigger && "w-full"} asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button>
            {isAdd && `Add Money`}
            {isWithdraw && `Withdraw Money`}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="px-5 py-6 lg:p-8 rounded-[12px] bg-white max-w-83.75 md:max-w-140! w-full! flex flex-col gap-5">
        <DialogHeader className="flex flex-col gap-5">
          <div className="flex items-start gap-4 justify-between">
            <DialogTitle className="text-lg lg:text-3xl font-bold">
              {isAdd && `Add to '${pot?.name}'`}
              {isWithdraw && `Withdraw from '${pot?.name}'`}
            </DialogTitle>
            <DialogClose className="text-grey-500 hover:text-grey-900">
              <IconClose />
            </DialogClose>
          </div>

          <DialogDescription>
            {isAdd &&
              `Add money to your '${pot?.name}' pot to help you reach your savings goals!`}
            {isWithdraw && `Withdraw money from your '${pot?.name}' pot.`}
          </DialogDescription>
        </DialogHeader>

        <div>
          <NewAmountDataAndProgress
            amountSaved={pot?.totalSaved || 0}
            targetAmount={pot?.targetAmount}
            addWithdrawAmont={form.watch("amount")}
            isWithdraw={isWithdraw}
            isAdd={isAdd}
          />

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Controller
              name="amount"
              control={form.control}
              render={({ field }) => (
                <CustomFormGroup
                  label={`Amount to ${isAdd ? "Add" : isWithdraw ? "Withdraw" : ""}`}
                  name="amount"
                  error={form.formState.errors.amount?.message}
                >
                  <Input
                    {...field}
                    placeholder="e.g. 2000"
                    preComponent={
                      <span className="text-xs font-medium text-grey-500">
                        $
                      </span>
                    }
                    autoFocus
                    max={100000000} // 100 Millions
                  />
                </CustomFormGroup>
              )}
            />
          </form>
        </div>

        <DialogFooter className=" pt-0 bg-transparent border-none">
          <Button
            className="w-full"
            isLoading={isAddingWithdrawingMoney}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isAdd && `Confirm Addition`}
            {isWithdraw && `Confirm Withdrawal`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const NewAmountDataAndProgress = ({
  amountSaved,
  targetAmount,
  addWithdrawAmont,
  isWithdraw,
  isAdd,
}) => {
  const newAmount = isAdd
    ? amountSaved + parseFloat(addWithdrawAmont || 0)
    : amountSaved - parseFloat(addWithdrawAmont || 0);

  const savedPercent = (amountSaved / targetAmount) * 100;
  const changePercent =
    (parseFloat(addWithdrawAmont || 0) / targetAmount) * 100;

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex items-center gap-4 justify-between">
        <span className="text-sm text-grey-500">New Amount</span>
        <span className="text-3xl font-bold">${newAmount.toFixed(2)}</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Progress Bar  */}
        <div className="h-2 rounded-sm bg-beige-100 w-full relative p-1 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-sm bg-black absolute top-0 left-0",
              addWithdrawAmont > 0 && "rounded-r-none",
            )}
            style={{
              width: `${isWithdraw ? savedPercent - changePercent : savedPercent}%`,
            }}
          />

          {isWithdraw && (
            <div
              className="h-full rounded-r-sm bg-red-sec absolute top-0"
              style={{
                left: `calc(${savedPercent - changePercent}% + 2px)`,
                width: `${changePercent}%`,
              }}
            />
          )}

          {isAdd && (
            <div
              className={cn(
                "h-full rounded-r-sm bg-green-sec absolute top-0",
                amountSaved === 0 && "rounded-sm",
              )}
              style={{
                left: `calc(${savedPercent}% + 2px)`,
                width: `${changePercent}%`,
              }}
            />
          )}
        </div>

        <div className="flex items-center text-xs">
          <span
            className={cn(
              "font-bold flex-1",
              isWithdraw && "text-red-sec",
              isAdd && "text-green-sec",
            )}
          >
            {((newAmount / targetAmount) * 100).toFixed(2)}%
          </span>
          <span className="flex-1 text-grey-500 text-right">
            Target of ${targetAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
