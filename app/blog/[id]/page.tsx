import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { formatarData } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id, publicado: true } });
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Blog
        </Link>

        {post.imagem && (
          <div className="h-64 rounded-xl overflow-hidden mb-8 bg-zinc-800">
            <img src={post.imagem} alt={post.titulo} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="text-4xl font-bold text-white mb-3">{post.titulo}</h1>
        <p className="text-zinc-500 text-sm mb-8">{formatarData(post.criadoEm)}</p>
        <div className="prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {post.conteudo}
        </div>
      </div>
    </div>
  );
}
