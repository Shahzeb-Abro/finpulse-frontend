import { IconDotsHorizontal } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrency } from "@/context/CurrencyContext";
import {
  AddEditPotDialog,
  AddWithdrawPotDialog,
  DeletePotDialog,
} from "@/dialogs";

export const Pot = ({ pot }) => {
  return (
    <div className="py-6 px-5 rounded-[12px] bg-white flex flex-col gap-8">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <span
            className="size-4 rounded-full shrink-0"
            style={{ backgroundColor: pot?.themeLookupValue }}
          ></span>
          <span className="text-lg font-bold">{pot?.name}</span>
        </div>
        <div>
          <PotOptionsMenu pot={pot} />
        </div>
      </div>

      <PotProgressAndData
        amountSaved={pot?.totalSaved || 0}
        targetAmount={pot?.targetAmount}
        themeColor={pot?.themeLookupValue}
      />

      <PotActions pot={pot} />
    </div>
  );
};

const PotActions = ({ pot }) => {
  return (
    <div className="flex gap-4">
      <AddWithdrawPotDialog
        isAdd
        pot={pot}
        customTrigger={
          <Button variant="secondary" className="flex-1">
            + Add Money
          </Button>
        }
      />
      <AddWithdrawPotDialog
        isWithdraw
        pot={pot}
        customTrigger={
          <Button variant="secondary" className="flex-1">
            + Withdraw
          </Button>
        }
      />
    </div>
  );
};

const PotProgressAndData = ({ amountSaved, targetAmount, themeColor }) => {
  const { formatAmount } = useCurrency();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 justify-between">
        <div className="text-sm text-grey-500">Total Saved</div>
        <div className="text-3xl font-bold">{formatAmount(amountSaved)}</div>
      </div>
      <div className="flex flex-col gap-3">
        <PotProgressBar
          amountSaved={amountSaved}
          targetAmount={targetAmount}
          themeColor={themeColor}
        />
        <div className="flex items-center text-grey-500 text-xs">
          <span className="font-bold flex-1">
            {((amountSaved / targetAmount) * 100 || 0).toFixed(2)}%
          </span>
          <span className="flex-1 text-right">
            Target of {formatAmount(targetAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

const PotProgressBar = ({ amountSaved, targetAmount, themeColor }) => {
  return (
    <div className="h-2 rounded-sm bg-beige-100 w-full relative p-1 overflow-hidden">
      <div
        className="h-2 rounded-sm absolute top-1/2 left-0 translate-y-[-50%]"
        style={{
          backgroundColor: themeColor,
          width: `calc(${(amountSaved / targetAmount) * 100}%)`,
        }}
      ></div>
    </div>
  );
};

const PotOptionsMenu = ({ pot }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <button className="text-grey-500">
          <IconDotsHorizontal />
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex max-w-40 w-full gap-1 flex-col   p-1 rounded-lg bg-white shadow-sm">
        <AddEditPotDialog
          isEdit
          pot={pot}
          customTrigger={
            <button className="py-3 px-4 hover:bg-grey-100 rounded-sm flex-1 text-left">
              Edit Pot
            </button>
          }
        />
        <hr className="w-full border-t border-gray-100" />

        <DeletePotDialog
          potName={pot?.name}
          potId={pot?.id}
          customTrigger={
            <button className="py-3 px-4 hover:bg-grey-100 rounded-sm flex-1 text-left text-red-sec">
              Delete Pot
            </button>
          }
        />
      </PopoverContent>
    </Popover>
  );
};
