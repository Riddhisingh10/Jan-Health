import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "brand" | "warning";
  children?: React.ReactNode;
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-emerald-600 text-white",
    brand: "border-emerald-300 bg-emerald-50 text-emerald-800 font-medium",
    secondary: "border-transparent bg-slate-100 text-slate-800",
    destructive: "border-transparent bg-rose-100 text-rose-700 font-medium",
    warning: "border-amber-200 bg-amber-50 text-amber-800 font-medium",
    outline: "text-slate-800 border-slate-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge };
