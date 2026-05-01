import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPreferences, updatePreferences } from "@/api/user";

const CurrencyContext = createContext();

const CURRENCY_OPTIONS = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "PKR", symbol: "₨", label: "Pakistani Rupee" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", label: "Saudi Riyal" },
];

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem("currency") ?? "USD",
  );

  const { data } = useQuery({
    queryKey: ["userPreferences"],
    queryFn: getPreferences,
  });

  useEffect(() => {
    console.log("Fetched user preferences:", data);
    if (data?.data?.currency) {
      setCurrency(data.data.currency);
      localStorage.setItem("currency", data.data.currency);
    }
  }, [data]);

  const { mutate: saveCurrency } = useMutation({
    mutationFn: (newCurrency) => updatePreferences({ currency: newCurrency }),
    onSuccess: (_, newCurrency) => {
      setCurrency(newCurrency);
      localStorage.setItem("currency", newCurrency);
    },
  });

  const selectedCurrency =
    CURRENCY_OPTIONS.find((c) => c.code === currency) || CURRENCY_OPTIONS[0];

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency.code,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: saveCurrency,
        formatAmount,
        currencyOptions: CURRENCY_OPTIONS,
        selectedCurrency,
        currencySymbol: selectedCurrency.symbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
