import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  preComponent = null,
  postComponent = null,
  ...props
}) {
  return (
    <div className="relative">
      {preComponent && (
        <div className="absolute left-5 -translate-x-1/2 top-1/2 transform -translate-y-1/2 ">
          {preComponent}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "w-full min-w-0 rounded-[8px] border border-input bg-white px-5 py-3 text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50  hover:text-foreground  focus:border-foreground",
          className,
          preComponent ? "pl-8" : "pl-5",
          postComponent ? "pr-8" : "pr-5",
        )}
        {...props}
      />
      {postComponent && (
        <div className="absolute right-5 translate-x-1/2 top-1/2 transform -translate-y-1/2 ">
          {postComponent}
        </div>
      )}
    </div>
  );
}

export { Input };
