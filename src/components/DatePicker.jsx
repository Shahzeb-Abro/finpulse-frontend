import { Controller } from "react-hook-form";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CustomFormGroup } from "./customFormGroup";

export const DatePicker = ({
  control,
  name,
  error,
  label = "Date",
  disabled,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const dateValue = field.value
          ? field.value instanceof Date
            ? field.value
            : new Date(field.value)
          : null;

        const isValidDate = dateValue && isValid(dateValue);
        return (
          <CustomFormGroup label={label} name={name} error={error}>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 rounded-[8px] border border-input bg-white px-5 py-3 text-sm transition-colors outline-none",
                    "dark:bg-input/30 hover:text-foreground focus:border-foreground",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {isValidDate ? (
                    <span className="text-foreground shrink-0">
                      {format(dateValue, "PPP")}
                    </span>
                  ) : (
                    <span>Pick a date</span>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={field.onChange}
                  disabled={disabled}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CustomFormGroup>
        );
      }}
    />
  );
};
