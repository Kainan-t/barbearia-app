import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const produtos = await prisma.produto.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json(produtos);
}

export async function POST(req: Request) {
  const body = await req.json();
  const produto = await prisma.produto.create({ data: body });
  return NextResponse.json(produto, { status: 201 });
}
