"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scissors, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEntrando(true);
    setErro("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setErro(data.erro || "Erro ao entrar.");
      }
    } catch {
      setErro("Erro de conexão.");
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Scissors className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
          <p className="text-zinc-400 text-sm mt-1">BarberShop</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Lock className="h-4 w-4" />
            <span className="text-sm">Acesso restrito</span>
          </div>

          <Input
            label="E-mail"
            type="email"
            placeholder="admin@barbearia.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            required
          />

          {erro && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">{erro}</p>
          )}

          <Button type="submit" className="w-full" tamanho="lg" disabled={entrando}>
            {entrando ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
