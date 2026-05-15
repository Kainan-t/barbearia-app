"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import { formatarData, formatarMoeda } from "@/lib/utils";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  criadoEm: string;
  _count: { agendamentos: number; pedidos: number };
  agendamentos: Array<{
    id: string;
    data: string;
    status: string;
    servico: { nome: string; preco: number };
  }>;
}

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente", confirmado: "Confirmado", concluido: "Concluído", cancelado: "Cancelado",
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [expandido, setExpandido] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/clientes").then((r) => r.json()).then(setClientes);
  }, []);

  const filtrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Clientes</h1>
            <p className="text-zinc-400 text-sm mt-1">{clientes.length} cliente(s) cadastrado(s)</p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full md:w-80 px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-6"
        />

        {filtrados.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">Nenhum cliente encontrado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtrados.map((c) => (
              <Card key={c.id}>
                <CardContent className="py-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandido(expandido === c.id ? null : c.id)}
                  >
                    <div>
                      <p className="font-semibold text-white">{c.nome}</p>
                      <p className="text-sm text-zinc-400">{c.email}</p>
                      {c.telefone && <p className="text-xs text-zinc-500">{c.telefone}</p>}
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center hidden md:block">
                        <p className="text-sm font-bold text-amber-400">{c._count.agendamentos}</p>
                        <p className="text-xs text-zinc-500">agendamentos</p>
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-xs text-zinc-500">desde {formatarData(c.criadoEm)}</p>
                      </div>
                      {expandido === c.id
                        ? <ChevronUp className="h-4 w-4 text-zinc-500" />
                        : <ChevronDown className="h-4 w-4 text-zinc-500" />
                      }
                    </div>
                  </div>

                  {/* Histórico */}
                  {expandido === c.id && c.agendamentos.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <p className="text-xs font-semibold text-zinc-400 uppercase mb-2">Histórico de visitas</p>
                      <div className="space-y-2">
                        {c.agendamentos.slice(0, 10).map((a) => (
                          <div key={a.id} className="flex items-center justify-between text-sm bg-zinc-800/50 rounded-lg px-3 py-2">
                            <span className="text-zinc-300">{a.servico.nome}</span>
                            <span className="text-zinc-500">{formatarData(a.data)}</span>
                            <span className="text-amber-400">{formatarMoeda(a.servico.preco)}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              a.status === "concluido" ? "bg-green-900/50 text-green-400"
                              : a.status === "cancelado" ? "bg-red-900/50 text-red-400"
                              : "bg-zinc-700 text-zinc-400"
                            }`}>
                              {STATUS_LABEL[a.status]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {expandido === c.id && c.agendamentos.length === 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <p className="text-sm text-zinc-500">Nenhuma visita registrada ainda.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
