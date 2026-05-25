import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPreferences, updatePreferences } from "@/api/user";

const DateFormatContext = createContext();

export const DATE_FORMAT_OPTIONS = [
  {
    value: "MM/DD/YYYY",
    label: "MM/DD/YYYY",
    locale: "en-US",
    options: { month: "2-digit", day: "2-digit", year: "numeric" },
  },
  {
    value: "DD/MM/YYYY",
    label: "DD/MM/YYYY",
    locale: "en-GB",
    options: { day: "2-digit", month: "2-digit", year: "numeric" },
  },
  {
    value: "YYYY-MM-DD",
    label: "YYYY-MM-DD (ISO 8601)",
    locale: "en-CA",
    options: { year: "numeric", month: "2-digit", day: "2-digit" },
  },
  {
    value: "DD MMM YYYY",
    label: "DD MMM YYYY",
    locale: "en-GB",
    options: { day: "2-digit", month: "short", year: "numeric" },
  },
  {
    value: "MMM DD, YYYY",
    label: "MMM DD, YYYY",
    locale: "en-US",
    options: { month: "short", day: "2-digit", year: "numeric" },
  },
  {
    value: "MMMM DD, YYYY",
    label: "MMMM DD, YYYY",
    locale: "en-US",
    options: { month: "long", day: "2-digit", year: "numeric" },
  },
  {
    value: "DD MMMM YYYY",
    label: "DD MMMM YYYY",
    locale: "en-GB",
    options: { day: "2-digit", month: "long", year: "numeric" },
  },
];

export const DateFormatProvider = ({ children }) => {
  const [dateFormat, setDateFormat] = useState(
    () => localStorage.getItem("dateFormat") ?? "MM/DD/YYYY",
  );

  const { data } = useQuery({
    queryKey: ["userPreferences"],
    queryFn: getPreferences,
  });

  useEffect(() => {
    if (data?.data?.dateFormat) {
      setDateFormat(data.data.dateFormat);
      localStorage.setItem("dateFormat", data.data.dateFormat);
    }
  }, [data]);

  const { mutate: saveDateFormat } = useMutation({
    mutationFn: (newDateFormat) =>
      updatePreferences({ dateFormat: newDateFormat }),
    onSuccess: (_, newDateFormat) => {
      setDateFormat(newDateFormat);
      localStorage.setItem("dateFormat", newDateFormat);
    },
  });

  const selectedDateFormat =
    DATE_FORMAT_OPTIONS.find((f) => f.value === dateFormat) ??
    DATE_FORMAT_OPTIONS[0];

  const formatDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(
      selectedDateFormat.locale,
      selectedDateFormat.options,
    ).format(d);
  };

  return (
    <DateFormatContext.Provider
      value={{
        dateFormat,
        setDateFormat: saveDateFormat,
        formatDate,
        dateFormatOptions: DATE_FORMAT_OPTIONS,
        selectedDateFormat,
      }}
    >
      {children}
    </DateFormatContext.Provider>
  );
};

export const useDateFormat = () => useContext(DateFormatContext);
