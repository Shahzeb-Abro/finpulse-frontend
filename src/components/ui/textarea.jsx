import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({
  className,
  preComponent = null,
  postComponent = null,
  description = null,
  error = null,
  ...props
}) {
  return (
    <div className="flex flex-col">
      <div className="relative">
        {preComponent && (
          <div className="absolute left-5 -translate-x-1/2 top-3 transform">
            {preComponent}
          </div>
        )}
        <textarea
          data-slot="textarea"
          aria-invalid={!!error}
          className={cn(
            "w-full min-w-0 rounded-[8px] border border-input bg-white px-5 py-3 text-sm transition-colors outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 hover:text-foreground focus:border-foreground resize-none",
            className,
            preComponent ? "pl-8" : "pl-5",
            postComponent ? "pr-8" : "pr-5",
          )}
          {...props}
        />
        {postComponent && (
          <div className="absolute right-5 translate-x-1/2 top-3 transform">
            {postComponent}
          </div>
        )}
      </div>
      {description && !error && (
        <p className="text-sm text-muted-foreground text-right">
          {description}
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export { Textarea };
