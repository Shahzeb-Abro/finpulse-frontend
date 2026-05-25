import { IconCaretRight, IconJarOutlined } from "@/components/icons";
import { useCurrency } from "@/context/CurrencyContext";
import { ROUTES } from "@/routes/routes";
import { Link } from "react-router-dom";

export const PotsCard = () => {
  const { formatAmount } = useCurrency();
  return (
    <div className="py-6 px-5 md:p-8 rounded-[12px] bg-white flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold text-foreground">Pots</div>
        <Link
          to={ROUTES.pots}
          className="flex items-center gap-3 text-grey-500 text-sm hover:text-foreground"
        >
          <span>See All</span>
          <span>
            <IconCaretRight />
          </span>
        </Link>
      </div>

      <div className="flex  gap-5 justify-between flex-col sm:flex-row">
        <div className="gap-6 p-6 rounded-[12px] bg-beige-100 flex items-center sm:max-w-[350px]">
          <div className="text-green-sec">
            <IconJarOutlined />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm text-grey-500">Total Saved</span>
            <div className="text-2xl font-bold">{formatAmount(500)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div className="flex items-center gap-4 ">
            <span className="w-1 h-10 bg-green-sec rounded-full shrink-0"></span>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-grey-500">Savings</span>
              <div className="text-sm font-bold">{formatAmount(159)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 ">
            <span className="w-1 h-10 bg-cyan-sec rounded-full shrink-0"></span>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-grey-500">Gift</span>
              <div className="text-sm font-bold">{formatAmount(40)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 ">
            <span className="w-1 h-10 bg-navy-sec rounded-full shrink-0"></span>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-grey-500">Concert Ticket</span>
              <div className="text-sm font-bold">{formatAmount(100)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 ">
            <span className="w-1 h-10 bg-yellow-sec rounded-full shrink-0"></span>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-grey-500">New Laptop</span>
              <div className="text-sm font-bold">{formatAmount(10)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
