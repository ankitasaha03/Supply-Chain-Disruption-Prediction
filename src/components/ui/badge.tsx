import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "critical" | "high" | "medium" | "low" | "success" | "cyber";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900",
    secondary: "border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
    destructive: "border-transparent bg-red-500/15 text-red-500 border border-red-500/30",
    outline: "text-slate-950 dark:text-slate-50 border border-slate-300 dark:border-slate-700",
    critical: "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 font-semibold tracking-wide",
    high: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 font-semibold tracking-wide",
    medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-medium",
    low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-medium",
    success: "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40",
    cyber: "bg-cyan-500/15 text-cyan-500 border border-cyan-500/30 font-mono tracking-tight",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
