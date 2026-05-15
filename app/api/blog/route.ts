import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const post = await prisma.blogPost.create({ data: body });
  return NextResponse.json(post, { status: 201 });
}
