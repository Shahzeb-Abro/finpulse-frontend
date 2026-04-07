import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { IconMagnifyGlass } from "./icons";

export const SearchInput = ({
  control,
  name,
  placeholder = "Search transaction",
  debounceMs = 300,
  onSearchChange,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <DebouncedInput
          value={field.value}
          onChange={(val) => {
            field.onChange(val);
            onSearchChange?.(val);
          }}
          placeholder={placeholder}
          debounceMs={debounceMs}
        />
      )}
    />
  );
};

const DebouncedInput = ({ value, onChange, placeholder, debounceMs }) => {
  const [localValue, setLocalValue] = useState(value ?? "");
  const timeoutRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    timeoutRef.current = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timeoutRef.current);
  }, [localValue, debounceMs]);

  return (
    <Input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      postComponent={
        <span>
          <IconMagnifyGlass />
        </span>
      }
    />
  );
};
