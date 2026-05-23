import { CustomFormGroup } from "@/components/customFormGroup";
import { Controller, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";

const FREQUENCY_OPTIONS = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

export const BillFrequency = ({
  control,
  name,
  label,
  error,
  setValue,
  dueDateName,
}) => {
  const frequency = useWatch({ control, name });

  // Reset due date when frequency changes
  const handleFrequencyChange = (val, fieldOnChange) => {
    fieldOnChange(val);
    setValue(dueDateName, null, { shouldValidate: false });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Frequency dropdown ── */}
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
              value={field.value ?? ""}
              onValueChange={(val) =>
                handleFrequencyChange(val, field.onChange)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="rounded-[8px]">
                {FREQUENCY_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="h-12 px-4 text-sm cursor-pointer"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </CustomFormGroup>

      {/* ── Due date picker — only shown when frequency is selected ── */}
      {frequency && (
        <Controller
          control={control}
          name={dueDateName}
          render={({ field }) => {
            const dateValue =
              field.value instanceof Date
                ? field.value
                : field.value
                  ? new Date(field.value)
                  : null;
            const isValidDate = dateValue && isValid(dateValue);

            const label = frequency === "MONTHLY" ? "Due Day" : "Due Date";

            const placeholder =
              frequency === "MONTHLY"
                ? "Pick a day (e.g. 15th)"
                : "Pick a month and day";

            const displayValue = isValidDate
              ? frequency === "MONTHLY"
                ? format(dateValue, "do") // "15th"
                : format(dateValue, "do MMMM") // "15th March"
              : null;

            return (
              <CustomFormGroup
                label={label}
                name={dueDateName}
                orientation="vertical"
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full flex items-center gap-3 rounded-[8px] border border-input bg-white px-5 py-3 text-sm transition-colors outline-none",
                        "dark:bg-input/30 hover:text-foreground focus:border-foreground",
                        !isValidDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {displayValue ? (
                        <span className="text-foreground">{displayValue}</span>
                      ) : (
                        <span>{placeholder}</span>
                      )}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={isValidDate ? dateValue : undefined}
                      onSelect={field.onChange}
                      // Monthly — only allow days 1-28 for safety across all months
                      disabled={
                        frequency === "MONTHLY"
                          ? (date) => date.getDate() > 28
                          : undefined
                      }
                      // For monthly — always show current month so day selection is clear
                      // For yearly — show full calendar for month+day selection
                      initialFocus
                      // Hide year navigation for monthly since year doesn't matter
                      captionLayout={
                        frequency === "MONTHLY" ? "buttons" : "buttons"
                      }
                    />
                    {frequency === "MONTHLY" && (
                      <p className="text-xs text-grey-500 px-3 pb-3 -mt-1">
                        Only days 1–28 allowed to ensure compatibility across
                        all months.
                      </p>
                    )}
                  </PopoverContent>
                </Popover>
              </CustomFormGroup>
            );
          }}
        />
      )}

      {/* ── Helper text showing the recurrence pattern ── */}
      {frequency && (
        <Controller
          control={control}
          name={dueDateName}
          render={({ field }) => {
            const dateValue =
              field.value instanceof Date
                ? field.value
                : field.value
                  ? new Date(field.value)
                  : null;
            const isValidDate = dateValue && isValid(dateValue);
            if (!isValidDate) return null;

            const description =
              frequency === "MONTHLY"
                ? `This bill repeats on the ${format(dateValue, "do")} of every month`
                : `This bill repeats on ${format(dateValue, "do MMMM")} every year`;

            return <p className="text-xs text-grey-500 -mt-2">{description}</p>;
          }}
        />
      )}
    </div>
  );
};
