"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatarData } from "@/lib/utils";
import { FileText, Plus, X } from "lucide-react";

interface Post {
  id: string;
  titulo: string;
  conteudo: string;
  publicado: boolean;
  criadoEm: string;
  imagem: string | null;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ titulo: "", conteudo: "", imagem: "", publicado: false });
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const res = await fetch("/api/blog");
    setPosts(await res.json());
  }

  useEffect(() => { carregar(); }, []);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: form.titulo,
        conteudo: form.conteudo,
        imagem: form.imagem || null,
        publicado: form.publicado,
      }),
    });
    await carregar();
    setModal(false);
    setForm({ titulo: "", conteudo: "", imagem: "", publicado: false });
    setSalvando(false);
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Blog</h1>
            <p className="text-zinc-400 text-sm mt-1">{posts.length} post(s) criado(s)</p>
          </div>
          <Button onClick={() => setModal(true)}>
            <Plus className="h-4 w-4" />
            Novo Post
          </Button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">Nenhum post criado ainda.</p>
            <Button className="mt-4" onClick={() => setModal(true)}>Criar primeiro post</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <Card key={p.id}>
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{p.titulo}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{formatarData(p.criadoEm)}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    p.publicado ? "bg-green-900/50 text-green-400" : "bg-zinc-700 text-zinc-400"
                  }`}>
                    {p.publicado ? "Publicado" : "Rascunho"}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Novo Post */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setModal(false)} />
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">Novo Post</h2>
                <button onClick={() => setModal(false)} className="text-zinc-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSalvar} className="space-y-4">
                <Input label="Título" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
                <Input label="URL da imagem (opcional)" placeholder="https://..." value={form.imagem} onChange={(e) => setForm({ ...form, imagem: e.target.value })} />
                <Textarea label="Conteúdo" value={form.conteudo} onChange={(e) => setForm({ ...form, conteudo: e.target.value })} rows={10} required />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.publicado}
                    onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-sm text-zinc-300">Publicar imediatamente</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variante="fantasma" className="flex-1" onClick={() => setModal(false)}>Cancelar</Button>
                  <Button type="submit" className="flex-1" disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
