import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  const agendamento = await prisma.agendamento.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json(agendamento);
}
