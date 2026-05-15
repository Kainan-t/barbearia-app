import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { criarToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, senha } = await req.json();

  if (!email || !senha) {
    return NextResponse.json({ erro: "Preencha email e senha." }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return NextResponse.json({ erro: "Credenciais inválidas." }, { status: 401 });
  }

  const senhaCorreta = await bcrypt.compare(senha, admin.senha);
  if (!senhaCorreta) {
    return NextResponse.json({ erro: "Credenciais inválidas." }, { status: 401 });
  }

  const token = await criarToken(admin.id, admin.email);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 horas
    path: "/",
  });

  return res;
}
