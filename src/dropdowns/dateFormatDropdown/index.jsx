import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomFormGroup } from "@/components/customFormGroup";

export const DateFormatDropdown = ({
  name,
  label,
  error,
  control,
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
              <SelectValue placeholder="Select a date format" />
            </SelectTrigger>
            <SelectContent className="rounded-[8px] max-w-60 w-full border">
              {options.map((option) => {
                return (
                  <SelectItem
                    key={option.value}
                    value={String(option.value)}
                    className="h-12 px-4 text-sm cursor-pointer"
                  >
                    <span className="mr-auto">{option.label}</span>
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
