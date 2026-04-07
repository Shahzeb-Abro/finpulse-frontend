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
import { getBudgetThemes } from "@/api/budget";
import { useEffect } from "react";

export const ThemeColorDropdown = ({
  name,
  label,
  error,
  control,
  usedColors = [],
  setValue,
  defaultThemeId = null,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["themeColors"],
    queryFn: getBudgetThemes,
  });

  const themes = data?.data || [];

  useEffect(() => {
    if (themes.length > 0) {
      setValue(name, defaultThemeId || themes[0].id);
    }
  }, [themes, name, setValue, defaultThemeId]);

  return (
    <CustomFormGroup label={label} name={name} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selectedColor = themes.find(
            (c) => String(c.id) === String(field.value),
          );
          return (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a color">
                  {selectedColor && (
                    <div className="flex items-center gap-3">
                      <span
                        className="size-4 rounded-full shrink-0"
                        style={{ backgroundColor: selectedColor.lookupValue }}
                      />
                      <span>{selectedColor.visibleValue}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-[8px]">
                {themes.map((color) => {
                  const isUsed =
                    usedColors.includes(color?.id) &&
                    String(color?.id) !== String(field?.value);

                  return (
                    <SelectItem
                      key={color?.id}
                      value={String(color.id)}
                      disabled={isUsed}
                      className="h-12 px-4 text-sm cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <span
                            className="size-4 rounded-full shrink-0"
                            style={{ backgroundColor: color?.lookupValue }}
                          />
                          <span>{color?.visibleValue}</span>
                        </div>
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
          );
        }}
      />
    </CustomFormGroup>
  );
};
