import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomFormGroup } from "@/components/customFormGroup";
import { useQuery } from "@tanstack/react-query";
import { getTransactionCategories } from "@/api/transaction";

export const TransactionCategoryDropdown = ({
  name,
  label,
  error,
  control,
  usedCategories = [],
  transactionType = "EXPENSE", // Can be "EXPENSE" or "INCOME"
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["transactionCategories"],
    queryFn: getTransactionCategories,
  });

  const allCategories = data?.data || [];

  const categories = allCategories.filter(
    (category) => category.hiddenValue === transactionType,
  );

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
