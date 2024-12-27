import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: boolean;
  icon?: React.ReactNode;
  actions?: "clear" | "focus";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, iconLeft, icon, actions, ...props }, _ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const handleIconClick = () => {
      if (inputRef && typeof inputRef !== "function" && inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handleClear = () => {
      if (inputRef && typeof inputRef !== "function" && inputRef.current) {
        inputRef.current.value = "";
      }
    };

    return (
      <div className="relative flex items-center">
        {icon && iconLeft && (
          <span
            className="absolute right-0 text-gray-400 cursor-pointer"
            onClick={() =>
              actions === "clear" ? handleClear() : handleIconClick()
            }
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={inputRef}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
