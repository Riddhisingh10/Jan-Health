import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "emerald";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variantStyles = {
      default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-700/20",
      emerald: "bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm shadow-emerald-800/25",
      outline: "border border-emerald-300 text-emerald-800 bg-white hover:bg-emerald-50 hover:border-emerald-400",
      secondary: "bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
      ghost: "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800",
      destructive: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-600/20",
    };

    const sizeStyles = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-11 rounded-lg px-6 text-base font-semibold",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
