import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const agendamentos = await prisma.agendamento.findMany({
    include: {
      cliente: { select: { nome: true, email: true, telefone: true } },
      servico: { select: { nome: true, preco: true } },
    },
    orderBy: { data: "desc" },
  });
  return NextResponse.json(agendamentos);
}

export async function POST(req: Request) {
  const { nome, email, telefone, servicoId, data, hora } = await req.json();

  if (!nome || !email || !servicoId || !data || !hora) {
    return NextResponse.json({ erro: "Preencha todos os campos obrigatórios." }, { status: 400 });
  }

  // Buscar ou criar cliente
  let cliente = await prisma.cliente.findUnique({ where: { email } });
  if (!cliente) {
    cliente = await prisma.cliente.create({ data: { nome, email, telefone } });
  }

  const dataHora = new Date(`${data}T${hora}:00`);

  const agendamento = await prisma.agendamento.create({
    data: { clienteId: cliente.id, servicoId, data: dataHora, status: "pendente" },
  });

  return NextResponse.json(agendamento, { status: 201 });
}
