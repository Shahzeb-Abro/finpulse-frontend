import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomFormGroup } from "@/components/customFormGroup";
import { getBudgetCategories } from "@/api/budget";
import { useQuery } from "@tanstack/react-query";

export const BudgetCategoryDropdown = ({
  name,
  label,
  error,
  control,
  usedCategories = [],
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["budgetCategories"],
    queryFn: getBudgetCategories,
  });

  const categories = data?.data || [];

  return (
    <CustomFormGroup label={label} name={name} error={error}>
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
            <SelectContent className="rounded-[8px]">
              {categories.map((category) => {
                const isUsed =
                  usedCategories.includes(category.id) &&
                  category.id !== field.value;

                return (
                  <SelectItem
                    key={category.id}
                    value={String(category.id)}
                    disabled={isUsed}
                    className="h-12 px-4 text-sm cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{category.visibleValue}</span>
                      {isUsed && (
                        <span className="text-xs text-grey-500">
                          Already used
                        </span>
                      )}
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
