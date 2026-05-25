import { IconCaretRight } from "@/components/icons";
import { useCurrency } from "@/context/CurrencyContext";
import { ROUTES } from "@/routes/routes";
import { Link } from "react-router-dom";

export const RecurringBillsCard = () => {
  const { formatAmount } = useCurrency();
  return (
    <div className="py-6 px-5 md:p-8 rounded-[12px] bg-white flex flex-col gap-5 w-full">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-foreground">Recurring Bills</div>
        <Link
          to={ROUTES.recurringBills}
          className="flex items-center gap-3 text-grey-500 text-sm hover:text-foreground"
        >
          <span>See All</span>
          <span>
            <IconCaretRight />
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex py-5 px-4 rounded-[8px] items-center gap-4 justify-between bg-beige-100 border-l-4 border-green-sec">
          <span className="text-sm text-grey-500">Paid Bills</span>
          <span className="text-sm font-bold">{formatAmount(190)}</span>
        </div>

        <div className="flex py-5 px-4 rounded-[8px] items-center gap-4 justify-between bg-beige-100 border-l-4 border-yellow-sec">
          <span className="text-sm text-grey-500">Total Upcoming</span>
          <span className="text-sm font-bold">{formatAmount(194.98)}</span>
        </div>

        <div className="flex py-5 px-4 rounded-[8px] items-center gap-4 justify-between bg-beige-100 border-l-4 border-cyan-sec">
          <span className="text-sm text-grey-500">Due Soon</span>
          <span className="text-sm font-bold">{formatAmount(59.98)}</span>
        </div>
      </div>
    </div>
  );
};
