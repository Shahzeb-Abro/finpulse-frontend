import { PieChart, Pie, Cell } from "recharts";
import { FormattedNumber } from "react-intl";
import { useCurrency } from "@/context/CurrencyContext";

export const BudgetsSummaryChart = ({ data }) => {
  const { formatAmount } = useCurrency();
  const budegtSummaryItems = data?.budgetSummaryItems || [];
  return (
    <div className="relative size-60 flex items-center justify-center">
      <PieChart width={240} height={240}>
        <Pie
          data={budegtSummaryItems}
          cx="50%"
          cy="50%"
          innerRadius={80} // bigger inner hole
          outerRadius={120}
          paddingAngle={0}
          dataKey="maximumSpend"
          stroke="none"
        >
          {budegtSummaryItems?.map((item, index) => (
            <Cell key={`cell-${index}`} fill={item?.theme} />
          ))}
        </Pie>
      </PieChart>

      {/* Overlay faded white circle */}
      <div className="absolute flex items-center justify-center w-[187.5px] h-[187.5px] bg-white/25 rounded-full">
        {/* Inner solid white circle */}
        <div className="flex items-center justify-center w-[160px] h-[160px] bg-white rounded-full">
          {/* Centered Content */}
          <div className="text-center flex flex-col gap-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {formatAmount(data?.totalCurrentSpend)}
            </h3>
            <p className="text-sm text-gray-500">
              of {formatAmount(data?.totalMaximumSpend)} limit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
