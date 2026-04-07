import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomFormGroup } from "@/components/customFormGroup";

const SORT_OPTIONS = [
  {
    id: 1,
    visibleValue: "Latest",
  },
  {
    id: 2,
    visibleValue: "Oldest",
  },
  {
    id: 3,
    visibleValue: "A to Z",
  },
  {
    id: 4,
    visibleValue: "Z to A",
  },
  {
    id: 5,
    visibleValue: "Highest",
  },
  {
    id: 6,
    visibleValue: "Lowest",
  },
];

export const SortByDropdown = ({
  name,
  label,
  error,
  control,
  usedCategories = [],
}) => {
  return (
    <CustomFormGroup
      label={label}
      name={name}
      error={error}
      orientation="horizontal"
      className="max-w-40"
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            onValueChange={(val) => field.onChange(Number(val))}
            value={String(field.value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="rounded-[8px] max-w-26 ">
              {SORT_OPTIONS.map((option) => {
                const isUsed =
                  usedCategories.includes(option.id) &&
                  option.id !== field.value;

                return (
                  <SelectItem
                    key={option.id}
                    value={String(option.id)}
                    className="h-12 px-4 text-sm cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option.visibleValue}</span>
                    </div>
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
