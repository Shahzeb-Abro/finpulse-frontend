import { IconBillsOutlined } from "@/components/icons";

export const RecurringBillsSummary = () => {
  return (
    <div className="flex flex-col md:flex-row lg:flex-col gap-6 lg:max-w-84.25 w-full ">
      <div className="bg-grey-900 flex-1 py-6 px-5 rounded-[12px] flex gap-5 md:gap-8 md:flex-col text-white">
        <div className="flex items-center justify-center md:justify-start ">
          <IconBillsOutlined />
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <div className="text-sm">Total Bills</div>
          <div className="text-3xl font-bold">$384.98</div>
        </div>
      </div>

      <div className="flex flex-col gap-5 flex-1 bg-white rounded-[12px] p-5">
        <h3 className="text-lg font-bold">Summary</h3>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 justify-between text-xs">
            <span className=" text-grey-500">Paid Bills</span>
            <span className="font-bold">2 ($320.00)</span>
          </div>
          <hr className="border-t border-grey-900/10" />
          <div className="flex items-center gap-4 justify-between text-xs">
            <span>Total Upcoming</span>
            <span>6 ($1230.00)</span>
          </div>
          <hr className="border-t border-grey-900/10" />
          <div className="flex items-center gap-4 justify-between text-xs text-red-sec">
            <span>Due Soon</span>
            <span className="font-bold">2 ($40.00)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
