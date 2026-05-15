import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { formatarData } from "@/lib/utils";
import { FileText } from "lucide-react";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { publicado: true },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Blog</h1>
          <p className="text-zinc-400">Novidades, dicas e tendências da barbearia</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">Nenhum post publicado ainda.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-500/30 transition-all group">
                  {post.imagem && (
                    <div className="h-48 rounded-lg overflow-hidden mb-4 bg-zinc-800">
                      <img src={post.imagem} alt={post.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                        {post.titulo}
                      </h2>
                      <p className="text-zinc-400 text-sm line-clamp-3">
                        {post.conteudo.replace(/<[^>]+>/g, "").slice(0, 200)}...
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 mt-4">{formatarData(post.criadoEm)}</p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
