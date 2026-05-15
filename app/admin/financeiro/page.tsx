"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatarMoeda } from "@/lib/utils";
import { TrendingUp, Users, CalendarDays, Clock } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface DadosFinanceiros {
  totalGeral: number;
  totalClientes: number;
  totalAgendamentos: number;
  agendamentosPendentes: number;
  grafico: { mes: string; total: number }[];
  topServicos: { nome: string; qtd: number; total: number }[];
}

export default function FinanceiroPage() {
  const [dados, setDados] = useState<DadosFinanceiros | null>(null);

  useEffect(() => {
    fetch("/api/admin/financeiro").then((r) => r.json()).then(setDados);
  }, []);

  if (!dados) {
    return (
      <div className="flex min-h-screen bg-zinc-950">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="text-zinc-500">Carregando dados...</div>
        </main>
      </div>
    );
  }

  const cards = [
    { titulo: "Receita Total",         valor: formatarMoeda(dados.totalGeral),    icone: TrendingUp,   cor: "text-green-400" },
    { titulo: "Total de Clientes",     valor: dados.totalClientes,                icone: Users,        cor: "text-blue-400" },
    { titulo: "Total de Agendamentos", valor: dados.totalAgendamentos,            icone: CalendarDays, cor: "text-purple-400" },
    { titulo: "Aguardando Atendimento",valor: dados.agendamentosPendentes,        icone: Clock,        cor: "text-yellow-400" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Financeiro</h1>
          <p className="text-zinc-400 text-sm mt-1">Levantamento baseado nos atendimentos concluídos</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <Card key={card.titulo}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-400">{card.titulo}</p>
                  <card.icone className={`h-4 w-4 ${card.cor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">{card.valor}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Receita por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              {dados.grafico.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-zinc-500 text-sm">
                  Nenhum dado disponível ainda.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dados.grafico}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="mes" stroke="#71717a" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#71717a" tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px" }}
                      labelStyle={{ color: "#e4e4e7" }}
                      formatter={(v: number) => [formatarMoeda(v), "Receita"]}
                    />
                    <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Top Serviços */}
          <Card>
            <CardHeader>
              <CardTitle>Top Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              {dados.topServicos.length === 0 ? (
                <p className="text-zinc-500 text-sm">Nenhum dado disponível.</p>
              ) : (
                <div className="space-y-3">
                  {dados.topServicos.map((s, i) => (
                    <div key={s.nome} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500 w-4">{i + 1}º</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{s.nome}</p>
                        <p className="text-xs text-zinc-500">{s.qtd}x realizados</p>
                      </div>
                      <span className="text-sm text-amber-400 font-semibold">{formatarMoeda(s.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
