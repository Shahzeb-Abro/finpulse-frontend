import { useCurrency } from "@/context/CurrencyContext";

export const BalanceCards = () => {
  const { formatAmount } = useCurrency();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-5 md:p-6 rounded-[12px] bg-primary flex flex-col gap-3 text-white">
        <h3 className="text-sm">Current Balance</h3>
        <div className="text-3xl font-bold">{formatAmount(1000)}</div>
      </div>

      <div className="p-5 md:p-6 rounded-[12px]  flex flex-col gap-3  bg-white">
        <h3 className="text-sm text-grey-500">Income</h3>
        <div className="text-3xl font-bold">{formatAmount(2000)}</div>
      </div>

      <div className="p-5 md:p-6 rounded-[12px]  flex flex-col gap-3  bg-white">
        <h3 className="text-sm text-grey-500">Expenses</h3>
        <div className="text-3xl font-bold">{formatAmount(1500)}</div>
      </div>
    </div>
  );
};
