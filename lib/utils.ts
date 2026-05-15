import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function formatarData(data: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(data));
}

export function formatarDataHora(data: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(data));
}

export const STATUS_AGENDAMENTO: Record<string, { label: string; cor: string }> = {
  pendente:   { label: "Pendente",   cor: "bg-yellow-100 text-yellow-800" },
  confirmado: { label: "Confirmado", cor: "bg-blue-100 text-blue-800" },
  concluido:  { label: "Concluído",  cor: "bg-green-100 text-green-800" },
  cancelado:  { label: "Cancelado",  cor: "bg-red-100 text-red-800" },
};
