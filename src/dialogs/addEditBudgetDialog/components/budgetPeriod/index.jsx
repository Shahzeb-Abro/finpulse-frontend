import { findAllLookupsByType } from "@/api/lookup";
import { CustomFormGroup } from "@/components/customFormGroup";
import { DatePicker } from "@/components/DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  startOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  format,
  addDays,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";

// Given a period lookupValue and a start date, compute the end date
const computeEndDate = (periodValue, startDate) => {
  const start = startDate ?? new Date();
  switch (periodValue) {
    case "weekly":
      return addDays(start, 6); // 7 day window
    case "monthly":
      return addDays(start, 29); // 30 day window
    case "quarterly":
      return addDays(start, 89); // 90 day window
    case "yearly":
      return addDays(start, 364); // 365 day window
    case "custom":
      return null;
    default:
      return null;
  }
};

// Given a period lookupValue, compute the smart default start date
const computeDefaultStart = (periodValue) => {
  switch (periodValue) {
    case "weekly":
      return startOfWeek(new Date(), { weekStartsOn: 1 });
    case "monthly":
      return startOfMonth(new Date());
    case "quarterly":
      return startOfQuarter(new Date());
    case "yearly":
      return startOfYear(new Date());
    case "custom":
      return new Date();
    default:
      return startOfMonth(new Date());
  }
};

export const BudgetPeriod = ({
  control,
  label,
  error,
  name,
  setValue,
  startDateName,
  endDateName,
  defaultPeriodId,
  defaultStartDate,
  defaultEndDate,
}) => {
  const { data } = useQuery({
    queryKey: ["budgetPeriods"],
    queryFn: () => findAllLookupsByType("PERIOD"),
  });

  const budgetPeriods = data?.data || [];

  // Watch the selected period ID
  const selectedPeriodId = useWatch({ control, name });

  // Resolve the lookupValue of the selected period (e.g. "MONTHLY", "CUSTOM")
  const selectedPeriod = budgetPeriods.find((p) => p.id === selectedPeriodId);
  const selectedPeriodValue = selectedPeriod?.lookupValue ?? null;
  const isCustom = selectedPeriodValue === "custom";

  // Auto-select Monthly on initial load
  useEffect(() => {
    if (budgetPeriods.length === 0) return;
    const monthly = budgetPeriods.find((p) => p.lookupValue === "monthly");
    if (monthly) {
      setValue(name, monthly.id, { shouldValidate: false });
    }
  }, [budgetPeriods]);

  // When period changes — reset start + auto-calculate end
  useEffect(() => {
    if (!selectedPeriodValue) return;

    const defaultStart = computeDefaultStart(selectedPeriodValue);
    setValue(startDateName, defaultStart, { shouldValidate: false });

    if (!isCustom) {
      const defaultEnd = computeEndDate(selectedPeriodValue, defaultStart);
      setValue(endDateName, defaultEnd, { shouldValidate: false });
    } else {
      // Clear end date so user picks manually
      setValue(endDateName, null, { shouldValidate: false });
    }
  }, [selectedPeriodValue]);

  // Watch start date — if user changes it (only relevant for CUSTOM),
  // don't auto-recalculate. But for non-custom periods, keep end in sync.
  const startDate = useWatch({ control, name: startDateName });

  console.log("Selected period:", selectedPeriodValue);
  console.log("Start date:", startDate);

  useEffect(() => {
    if (!selectedPeriodValue || isCustom) return;
    if (!startDate) return;

    const newEnd = computeEndDate(selectedPeriodValue, startDate);
    setValue(endDateName, newEnd, { shouldValidate: false });
  }, [startDate]);

  return (
    <div className="flex flex-col gap-4">
      {/* ── Period dropdown ── */}
      <CustomFormGroup
        label={label}
        name={name}
        error={error}
        orientation="vertical"
      >
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Select
              onValueChange={(val) => field.onChange(Number(val))}
              value={field.value ? String(field.value) : ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a period" />
              </SelectTrigger>
              <SelectContent className="rounded-[8px]">
                {budgetPeriods.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={String(option.id)}
                    className="h-12 px-4 text-sm cursor-pointer"
                  >
                    {option.visibleValue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </CustomFormGroup>

      {/* ── Date pickers ── */}
      <div className="flex gap-4">
        {/* Start date — only editable for CUSTOM */}
        <div className="flex-1">
          <DatePicker
            label="Start Date"
            name={startDateName}
            control={control}
            disabled={{ before: new Date() }}
          />
        </div>

        {/* End date — only editable for CUSTOM */}
        <div className="flex-1">
          <DatePicker
            label="End Date"
            name={endDateName}
            control={control}
            disabled={!isCustom ? true : { before: startDate ?? new Date() }}
          />
        </div>
      </div>

      {/* ── Helper text for non-custom periods ── */}
      {selectedPeriodValue && !isCustom && startDate && (
        <p className="text-xs text-grey-500 -mt-2">
          This budget runs from{" "}
          <span className="font-medium text-foreground">
            {format(startDate, "dd MMM yyyy")}
          </span>{" "}
          to{" "}
          <span className="font-medium text-foreground">
            {format(
              computeEndDate(selectedPeriodValue, startDate),
              "dd MMM yyyy",
            )}
          </span>
        </p>
      )}
    </div>
  );
};
