import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const agendamentos = await prisma.agendamento.findMany({
    where: { status: "concluido" },
    include: { servico: true },
    orderBy: { data: "desc" },
  });

  const totalGeral = agendamentos.reduce((s, a) => s + a.servico.preco, 0);

  // Agrupamento por mês
  const porMes: Record<string, number> = {};
  for (const a of agendamentos) {
    const chave = new Date(a.data).toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
    porMes[chave] = (porMes[chave] || 0) + a.servico.preco;
  }

  const grafico = Object.entries(porMes)
    .slice(-6)
    .map(([mes, total]) => ({ mes, total }));

  // Serviços mais realizados
  const porServico: Record<string, { nome: string; qtd: number; total: number }> = {};
  for (const a of agendamentos) {
    if (!porServico[a.servicoId]) {
      porServico[a.servicoId] = { nome: a.servico.nome, qtd: 0, total: 0 };
    }
    porServico[a.servicoId].qtd += 1;
    porServico[a.servicoId].total += a.servico.preco;
  }
  const topServicos = Object.values(porServico).sort((a, b) => b.qtd - a.qtd).slice(0, 5);

  const totalClientes = await prisma.cliente.count();
  const totalAgendamentos = await prisma.agendamento.count();
  const agendamentosPendentes = await prisma.agendamento.count({ where: { status: "pendente" } });

  return NextResponse.json({
    totalGeral,
    totalClientes,
    totalAgendamentos,
    agendamentosPendentes,
    grafico,
    topServicos,
  });
}
