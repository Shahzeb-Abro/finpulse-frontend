import { Download, FilterIcon, SlidersHorizontal, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SortByDropdown } from "@/dropdowns";
import { DatePicker } from "@/components/DatePicker";
import { CustomFormGroup } from "@/components/customFormGroup";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const TransactionFilters = ({
  form,
  categoryOptions,
  onApply,
  onClear,
  activeFilterCount,
  onExport,
}) => {
  return (
    <div className="flex items-center gap-3 ml-auto">
      {/* ── Filters popover ── */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            pre
            className={cn(activeFilterCount > 0 ? "relative" : "")}
          >
            <div className="flex items-center gap-2">
              <FilterIcon className="w-4 h-4" />
              Filters
            </div>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-beige-100 text-xs font-bold absolute -top-2 -right-2">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="max-w-[450px] w-full p-5 rounded-[12px] flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Filters</span>
            {activeFilterCount > 0 && (
              <button
                onClick={onClear}
                className="text-xs text-grey-500 hover:text-foreground flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>

          {/* Type */}
          <FilterSelect
            control={form.control}
            name="type"
            label="Type"
            options={[
              { value: "ALL", label: "All Types" },
              { value: "EXPENSE", label: "Expense" },
              { value: "INCOME", label: "Income" },
            ]}
            placeholder="All Types"
          />

          {/* Category */}
          <FilterSelect
            control={form.control}
            name="category"
            label="Category"
            options={categoryOptions}
            placeholder="All Categories"
          />

          {/* Sort by */}
          <SortByDropdown
            control={form.control}
            name="sortBy"
            label="Sort by"
            orientation="vertical"
          />

          {/* Date range */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-grey-500">
              Date Range
            </label>
            <div className="flex gap-2">
              <DatePicker control={form.control} name="dateFrom" label="" />
              <DatePicker control={form.control} name="dateTo" label="" />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* ── Export button — always visible, separate from filters ── */}
      <Button onClick={onExport}>
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </div>
      </Button>
    </div>
  );
};

// ─── Inline filter select — matches SortByDropdown style ──────
const FilterSelect = ({ control, name, label, options, placeholder }) => (
  <CustomFormGroup label={label} name={name} orientation="vertical">
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          onValueChange={(val) => field.onChange(val)}
          value={field.value}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="rounded-[8px]">
            {options.map((opt) => (
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
);
