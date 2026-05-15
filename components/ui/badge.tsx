import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variante?: "default" | "sucesso" | "aviso" | "perigo" | "info";
}

export function Badge({ className, variante = "default", ...props }: BadgeProps) {
  const estilos = {
    default: "bg-zinc-700 text-zinc-200",
    sucesso: "bg-green-900/50 text-green-400 border border-green-800",
    aviso:   "bg-yellow-900/50 text-yellow-400 border border-yellow-800",
    perigo:  "bg-red-900/50 text-red-400 border border-red-800",
    info:    "bg-blue-900/50 text-blue-400 border border-blue-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        estilos[variante],
        className
      )}
      {...props}
    />
  );
}
