import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "cyber"
    | "success";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-blue-600 text-white shadow hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-600 font-medium",
      destructive:
        "bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.98] dark:bg-red-600 dark:hover:bg-red-700",
      outline:
        "border border-slate-300 bg-white shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200",
      secondary:
        "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
      ghost:
        "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
      link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
      cyber:
        "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] border border-blue-400/30",
      success:
        "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-700",
    };

    const sizes = {
      default: "h-9 px-4 py-2 text-sm",
      sm: "h-7 rounded-md px-2.5 text-xs",
      lg: "h-11 rounded-md px-6 text-base",
      icon: "h-9 w-9",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 gap-1.5 cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
