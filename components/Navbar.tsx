"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Scissors } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/",        label: "Início" },
  { href: "/agendar", label: "Agendar" },
  { href: "/loja",    label: "Loja" },
  { href: "/blog",    label: "Blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
          <Scissors className="h-6 w-6" />
          <span className="font-bold text-xl tracking-tight">BarberShop</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-white"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <div className="space-y-1">
            <span className={cn("block h-0.5 w-6 bg-current transition-all", menuAberto && "rotate-45 translate-y-1.5")} />
            <span className={cn("block h-0.5 w-6 bg-current transition-all", menuAberto && "opacity-0")} />
            <span className={cn("block h-0.5 w-6 bg-current transition-all", menuAberto && "-rotate-45 -translate-y-1.5")} />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuAberto && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuAberto(false)}
                  className={cn(
                    "block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-amber-500/10 text-amber-400"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
