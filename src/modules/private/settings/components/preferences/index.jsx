import { useCurrency } from "@/context/CurrencyContext";
import { CurrencyDropdown } from "@/dropdowns";
import { preferencesSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const Preferences = () => {
  const { currency, setCurrency, currencyOptions } = useCurrency();
  const form = useForm({
    defaultValues: {
      currency: currency || "",
    },
    resolver: zodResolver(preferencesSchema),
  });

  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (
        name === "currency" &&
        values.currency &&
        values.currency !== currency
      ) {
        setCurrency(values.currency);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setCurrency]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <h3 className="text-2xl font-semibold ">Preferences</h3>

      <div className="flex flex-col gap-4 p-6 rounded-lg bg-white border">
        <form className="flex flex-col gap-6 w-full">
          <div className="flex items-center gap-4 justify-between">
            <span className="text-lg font-medium">Currency</span>
            <CurrencyDropdown
              name="currency"
              control={form.control}
              error={form.formState.errors?.currency?.message}
              options={currencyOptions}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
