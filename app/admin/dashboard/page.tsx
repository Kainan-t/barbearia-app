import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { formatarMoeda } from "@/lib/utils";
import { Users, CalendarDays, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [totalClientes, totalAgendamentos, pendentes, concluidos] = await Promise.all([
    prisma.cliente.count(),
    prisma.agendamento.count(),
    prisma.agendamento.count({ where: { status: "pendente" } }),
    prisma.agendamento.findMany({
      where: { status: "concluido" },
      include: { servico: true },
    }),
  ]);

  const receitaTotal = concluidos.reduce((s, a) => s + a.servico.preco, 0);

  const proximosAgendamentos = await prisma.agendamento.findMany({
    where: { status: { in: ["pendente", "confirmado"] }, data: { gte: new Date() } },
    include: {
      cliente: true,
      servico: true,
    },
    orderBy: { data: "asc" },
    take: 5,
  });

  const cards = [
    { titulo: "Total de Clientes",    valor: totalClientes,                icone: Users,         cor: "text-blue-400" },
    { titulo: "Agendamentos",          valor: totalAgendamentos,             icone: CalendarDays,  cor: "text-purple-400" },
    { titulo: "Pendentes",             valor: pendentes,                     icone: Clock,         cor: "text-yellow-400" },
    { titulo: "Receita (concluídos)",  valor: formatarMoeda(receitaTotal),   icone: TrendingUp,    cor: "text-green-400" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Visão geral da barbearia</p>
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

        {/* Próximos agendamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {proximosAgendamentos.length === 0 ? (
              <p className="text-zinc-500 text-sm py-4 text-center">Nenhum agendamento futuro.</p>
            ) : (
              <div className="space-y-3">
                {proximosAgendamentos.map((a) => {
                  const data = new Date(a.data);
                  return (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">{a.cliente.nome}</p>
                        <p className="text-xs text-zinc-400">{a.servico.nome}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-zinc-300">
                          {data.toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <span className={`ml-4 text-xs px-2 py-1 rounded-full ${
                        a.status === "confirmado"
                          ? "bg-blue-900/50 text-blue-400"
                          : "bg-yellow-900/50 text-yellow-400"
                      }`}>
                        {a.status === "confirmado" ? "Confirmado" : "Pendente"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
