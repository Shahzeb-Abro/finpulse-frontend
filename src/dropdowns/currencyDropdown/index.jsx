import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomFormGroup } from "@/components/customFormGroup";

export const CurrencyDropdown = ({
  name,
  label,
  error,
  control,
  usedCategories = [],
  orientation = "horizontal",
  options = [],
}) => {
  return (
    <CustomFormGroup
      label={label}
      name={name}
      error={error}
      orientation={orientation}
      className={orientation === "horizontal" ? "max-w-60" : ""}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            onValueChange={(val) => field.onChange(val)}
            value={String(field.value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a currency" />
            </SelectTrigger>
            <SelectContent className="rounded-[8px] max-w-60 w-full border">
              {options.map((option) => {
                const isUsed =
                  usedCategories.includes(option.code) &&
                  option.code !== field.value;

                return (
                  <SelectItem
                    key={option.code}
                    value={String(option.code)}
                    className="h-12 px-4 text-sm cursor-pointer"
                  >
                    <span className="mr-auto">
                      {option.label} {option.symbol}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      />
    </CustomFormGroup>
  );
};
