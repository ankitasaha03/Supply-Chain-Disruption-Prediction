"use client";

import React from "react";
import { useSupplyChain } from "@/context/SupplyChainContext";
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useSupplyChain();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
          critical: <AlertOctagon className="h-5 w-5 text-red-400 shrink-0" />,
          info: <Info className="h-5 w-5 text-blue-400 shrink-0" />,
        };

        const borderColors = {
          success: "border-emerald-500/40 bg-slate-900/95 text-emerald-100",
          warning: "border-amber-500/40 bg-slate-900/95 text-amber-100",
          critical: "border-red-500/40 bg-slate-900/95 text-red-100",
          info: "border-blue-500/40 bg-slate-900/95 text-blue-100",
        };

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3",
              borderColors[toast.type]
            )}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-white truncate">{toast.title}</p>
                <span className="text-[10px] text-slate-400">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
