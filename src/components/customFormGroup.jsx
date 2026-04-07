import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

export const CustomFormGroup = ({
  label,
  name,
  description,
  error,
  children,
  orientation = "vertical",
  className = "",
}) => {
  return (
    <Field
      orientation={orientation}
      data-invalid={error ? true : undefined}
      className={cn(
        "flex",
        orientation === "horizontal"
          ? "flex-row items-center gap-2"
          : "flex-col gap-1",
        className,
      )}
    >
      {label && (
        <FieldLabel
          htmlFor={name}
          className={cn(
            "text-xs font-bold text-grey-500",
            orientation === "horizontal" && "whitespace-nowrap",
          )}
        >
          {label}
        </FieldLabel>
      )}
      {children}
      {description && !error && (
        <FieldDescription className="text-xs text-right text-grey-500 w-full">
          {description}
        </FieldDescription>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};
