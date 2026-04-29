import { Controller } from "react-hook-form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * TransactionTypeToggle
 *
 * Props:
 *  - control  → from useForm()
 *  - name     → field name in your form (e.g. "type")
 *  - error    → fieldState.error from formState
 */
export function TransactionTypeToggle({ control, name, error }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5">
          <ToggleGroup
            type="single"
            value={field.value}
            onValueChange={(val) => {
              // Prevent deselecting — a type must always be selected
              if (val) field.onChange(val);
            }}
            className="grid grid-cols-2 gap-2 w-full"
          >
            {/* ── EXPENSE ── */}
            <ToggleGroupItem
              value="EXPENSE"
              className={cn(
                "flex items-center justify-center gap-2 h-11 rounded-lg border text-sm font-medium transition-all duration-200",
                "data-[state=off]:bg-transparent data-[state=off]:border-border data-[state=off]:text-muted-foreground",
                "data-[state=on]:bg-destructive/10 data-[state=on]:border-destructive/40 data-[state=on]:text-destructive",
                "hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive",
              )}
            >
              <ArrowDownCircle className="h-4 w-4" />
              Expense
            </ToggleGroupItem>

            {/* ── INCOME ── */}
            <ToggleGroupItem
              value="INCOME"
              className={cn(
                "flex items-center justify-center gap-2 h-11 rounded-lg border text-sm font-medium transition-all duration-200",
                "data-[state=off]:bg-transparent data-[state=off]:border-border data-[state=off]:text-muted-foreground",
                "data-[state=on]:bg-emerald-500/10 data-[state=on]:border-emerald-500/40 data-[state=on]:text-emerald-600",
                "dark:data-[state=on]:text-emerald-400",
                "hover:bg-emerald-500/5 hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400",
              )}
            >
              <ArrowUpCircle className="h-4 w-4" />
              Income
            </ToggleGroupItem>
          </ToggleGroup>

          {error && <p className="text-xs text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}
