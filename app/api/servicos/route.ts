import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const servicos = await prisma.servico.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json(servicos);
}

export async function POST(req: Request) {
  const body = await req.json();
  const servico = await prisma.servico.create({ data: body });
  return NextResponse.json(servico, { status: 201 });
}
