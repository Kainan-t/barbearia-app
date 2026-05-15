import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  erro?: string;
}

export function Input({ className, label, erro, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500",
          "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          erro && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {erro && <p className="text-xs text-red-400">{erro}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  erro?: string;
}

export function Textarea({ className, label, erro, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          "w-full px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500",
          "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed resize-none",
          erro && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {erro && <p className="text-xs text-red-400">{erro}</p>}
    </div>
  );
}
