import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "secundario" | "perigo" | "fantasma";
  tamanho?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variante = "primario",
  tamanho = "md",
  ...props
}: ButtonProps) {
  const variantStyles = {
    primario:   "bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow",
    secundario: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",
    perigo:     "bg-red-600 hover:bg-red-700 text-white",
    fantasma:   "bg-transparent hover:bg-zinc-800 text-zinc-300 border border-zinc-700",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-xl",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variante],
        sizeStyles[tamanho],
        className
      )}
      {...props}
    />
  );
}
