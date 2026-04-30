import { IconCaretRight, IconDotsHorizontal } from "@/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AddBudgetTransactionDialog,
  AddEditBudgetDialog,
  DeleteBudgetDialog,
} from "@/dialogs";
import { ROUTES } from "@/routes/routes";
import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

export const Budget = ({ budget }) => {
  return (
    <div className="flex flex-col gap-5 rounded-[12px] px-5 py-6 md:p-8 bg-white ">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <span
            className="size-4 rounded-full shrink-0"
            style={{ backgroundColor: budget?.budgetThemeLookupValue }}
          ></span>
          <span className="text-lg font-bold">
            {budget?.budgetCategoryVisibleValue}
          </span>
        </div>
        <div>
          <BudgetOptionsMenu budget={budget} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-sm text-grey-500">
          Maximum of ${budget?.maximumSpend?.toFixed(2)}
        </div>

        <SpentProgressBar
          amountSpent={budget?.currentSpend}
          budgetLimit={budget?.maximumSpend}
          themeColor={budget?.budgetThemeLookupValue}
        />

        <SpendRemaining
          amountSpent={budget?.currentSpend}
          budgetLimit={budget?.maximumSpend}
          themeColor={budget?.budgetThemeLookupValue}
        />
      </div>

      {budget?.transactions && (
        <div>
          <BudgetTransactions transactions={budget?.transactions} />
        </div>
      )}
    </div>
  );
};

const SpentProgressBar = ({ amountSpent, budgetLimit, themeColor }) => {
  return (
    <div className="h-8 rounded-sm bg-beige-100 w-full relative p-1 overflow-hidden">
      <div
        className="h-6 rounded-sm absolute top-1/2 left-1 translate-y-[-50%]"
        style={{
          backgroundColor: themeColor,
          width: `calc(${(amountSpent / budgetLimit) * 100}% - 8px)`,
        }}
      ></div>
    </div>
  );
};

const SpendRemaining = ({ amountSpent, budgetLimit, themeColor }) => {
  const remaining = budgetLimit - amountSpent;
  return (
    <div className="flex items-center gap-4">
      {/* Spent  */}
      <div className="flex gap-4 flex-1">
        <span
          className="w-1 h-11 rounded-lg "
          style={{ backgroundColor: themeColor }}
        ></span>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-grey-500">Spent</span>
          <span className="text-sm font-bold">${amountSpent?.toFixed(2)}</span>
        </div>
      </div>
      {/* Remaining  */}
      <div className="flex gap-4 flex-1">
        <span className="w-1 h-11 rounded-lg bg-beige-100"></span>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-grey-500">Remaining</span>
          <span className="text-sm font-bold">${remaining.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const BudgetTransactions = ({ transactions }) => {
  return (
    <div className="bg-beige-100 rounded-[12px] p-5 flex flex-col gap-5">
      <div className="flex items-center gap-4 justify-between">
        <h4 className="text-base font-bold">Latest Spendings</h4>
        <Link
          to={ROUTES.categoryWiseTransaction(transactions?.[0]?.categoryId)}
          className="flex items-center gap-3 text-grey-500 text-sm hover:text-foreground"
        >
          <span>See All</span>
          <span>
            <IconCaretRight />
          </span>
        </Link>
      </div>
      <div>
        {transactions?.map((transaction, index) => (
          <>
            <BudgetTransactionItem
              key={transaction.id}
              transaction={transaction}
            />
            {index !== transactions.length - 1 && (
              <hr className="w-full border-t border-grey-500/10 my-4" />
            )}
          </>
        ))}
      </div>
    </div>
  );
};

const BudgetTransactionItem = ({ transaction }) => {
  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="size-10 rounded-full bg-yellow-sec flex items-center justify-center">
        <ArrowUp className="size-4 text-white" />
      </div>
      <div className="text-xs font-bold flex-1">
        {transaction?.description || "Unknown Receiver"}
      </div>

      <div className="flex flex-col gap-1 items-end">
        <div className="text-xs font-bold">
          {transaction?.transactionType === "EXPENSE" ? "-" : "+"}$
          {transaction?.amount?.toFixed(2)}
        </div>
        <div className="text-xs text-grey-500">
          {transaction?.transactionDate || "Unknown Date"}
        </div>
      </div>
    </div>
  );
};

const BudgetOptionsMenu = ({ budget }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <button className="text-grey-500">
          <IconDotsHorizontal />
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex max-w-40 w-full gap-1 flex-col   p-1 rounded-lg bg-white shadow-sm">
        {/* <AddBudgetTransactionDialog
          customTrigger={
            <button className="py-3 px-4 hover:bg-grey-100 rounded-sm text-left">
              Add Transaction
            </button>
          }
          budgetId={budget?.id}
        /> */}

        <hr className="w-full border-t border-gray-100 " />
        <AddEditBudgetDialog
          isEdit
          budget={budget}
          customTrigger={
            <button className="py-3 px-4 hover:bg-grey-100 rounded-sm flex-1 text-left">
              Edit Budget
            </button>
          }
        />
        <hr className="w-full border-t border-gray-100" />

        <DeleteBudgetDialog
          budgetName={budget?.budgetCategoryVisibleValue}
          budgetId={budget?.id}
          customTrigger={
            <button className="py-3 px-4 hover:bg-grey-100 rounded-sm flex-1 text-left text-red-sec">
              Delete Budget
            </button>
          }
        />
      </PopoverContent>
    </Popover>
  );
};
