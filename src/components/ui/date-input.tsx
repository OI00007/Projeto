import * as React from "react";
import { cn } from "@/lib/utils";

export type DateInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => (
    <input
      type="date"
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm",
        "bg-background text-foreground",
        "[color-scheme:light] dark:[color-scheme:dark]",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
DateInput.displayName = "DateInput";

export { DateInput };
