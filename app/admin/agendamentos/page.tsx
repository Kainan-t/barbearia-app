"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatarMoeda } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

interface Agendamento {
  id: string;
  data: string;
  status: string;
  observacao: string | null;
  cliente: { nome: string; email: string; telefone: string | null };
  servico: { nome: string; preco: number };
}

const STATUS_MAP: Record<string, { label: string; variante: "default" | "info" | "sucesso" | "perigo" | "aviso" }> = {
  pendente:   { label: "Pendente",   variante: "aviso" },
  confirmado: { label: "Confirmado", variante: "info" },
  concluido:  { label: "Concluído",  variante: "sucesso" },
  cancelado:  { label: "Cancelado",  variante: "perigo" },
};

export default function AgendamentosAdminPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filtro, setFiltro] = useState("todos");
  const [atualizando, setAtualizando] = useState<string | null>(null);

  async function carregar() {
    const res = await fetch("/api/agendamentos");
    setAgendamentos(await res.json());
  }

  useEffect(() => { carregar(); }, []);

  async function mudarStatus(id: string, status: string) {
    setAtualizando(id);
    await fetch("/api/admin/agendamentos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await carregar();
    setAtualizando(null);
  }

  const filtrados = filtro === "todos"
    ? agendamentos
    : agendamentos.filter((a) => a.status === filtro);

  const botoesFiltro = ["todos", "pendente", "confirmado", "concluido", "cancelado"];

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
            <p className="text-zinc-400 text-sm mt-1">{agendamentos.length} agendamento(s) no total</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-6">
          {botoesFiltro.map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filtro === f ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {f === "todos" ? "Todos" : STATUS_MAP[f]?.label}
            </button>
          ))}
        </div>

        {filtrados.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtrados.map((a) => {
              const data = new Date(a.data);
              const s = STATUS_MAP[a.status];
              return (
                <Card key={a.id}>
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-white">{a.cliente.nome}</p>
                          <Badge variante={s.variante}>{s.label}</Badge>
                        </div>
                        <p className="text-sm text-zinc-400">{a.servico.nome} · {formatarMoeda(a.servico.preco)}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {data.toLocaleDateString("pt-BR")} às {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        {a.cliente.telefone && (
                          <p className="text-xs text-zinc-600">{a.cliente.telefone}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {a.status === "pendente" && (
                          <Button
                            variante="secundario"
                            tamanho="sm"
                            disabled={atualizando === a.id}
                            onClick={() => mudarStatus(a.id, "confirmado")}
                          >
                            Confirmar
                          </Button>
                        )}
                        {(a.status === "pendente" || a.status === "confirmado") && (
                          <Button
                            tamanho="sm"
                            disabled={atualizando === a.id}
                            onClick={() => mudarStatus(a.id, "concluido")}
                          >
                            Concluir
                          </Button>
                        )}
                        {a.status !== "cancelado" && a.status !== "concluido" && (
                          <Button
                            variante="perigo"
                            tamanho="sm"
                            disabled={atualizando === a.id}
                            onClick={() => mudarStatus(a.id, "cancelado")}
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
