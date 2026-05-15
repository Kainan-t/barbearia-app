import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const clientes = await prisma.cliente.findMany({
    include: {
      agendamentos: {
        include: { servico: true },
        orderBy: { data: "desc" },
      },
      _count: { select: { agendamentos: true, pedidos: true } },
    },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(clientes);
}
