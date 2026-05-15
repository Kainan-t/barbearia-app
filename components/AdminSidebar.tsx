"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Scissors,
  LayoutDashboard,
  Users,
  CalendarDays,
  ShoppingBag,
  FileText,
  TrendingUp,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/admin/dashboard",    label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin/clientes",     label: "Clientes",      icon: Users },
  { href: "/admin/agendamentos", label: "Agendamentos",  icon: CalendarDays },
  { href: "/admin/loja",         label: "Loja",          icon: ShoppingBag },
  { href: "/admin/blog",         label: "Blog",          icon: FileText },
  { href: "/admin/financeiro",   label: "Financeiro",    icon: TrendingUp },
];

export function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-zinc-800">
        <Scissors className="h-6 w-6 text-amber-400" />
        <div>
          <p className="font-bold text-white leading-tight">BarberShop</p>
          <p className="text-xs text-zinc-500">Painel Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-900/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
