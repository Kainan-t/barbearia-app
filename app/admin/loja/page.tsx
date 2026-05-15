"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatarMoeda } from "@/lib/utils";
import { ShoppingBag, Plus, X } from "lucide-react";

interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  estoque: number;
  categoria: string | null;
  ativo: boolean;
}

export default function LojaAdminPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nome: "", descricao: "", preco: "", estoque: "", categoria: "" });
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    const res = await fetch("/api/produtos?admin=1");
    setProdutos(await res.json());
  }

  useEffect(() => { carregar(); }, []);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        descricao: form.descricao || null,
        preco: parseFloat(form.preco),
        estoque: parseInt(form.estoque),
        categoria: form.categoria || null,
      }),
    });
    await carregar();
    setModal(false);
    setForm({ nome: "", descricao: "", preco: "", estoque: "", categoria: "" });
    setSalvando(false);
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Loja</h1>
            <p className="text-zinc-400 text-sm mt-1">{produtos.length} produto(s) cadastrado(s)</p>
          </div>
          <Button onClick={() => setModal(true)}>
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">Nenhum produto cadastrado.</p>
            <Button className="mt-4" onClick={() => setModal(true)}>Adicionar produto</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtos.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {p.categoria && <p className="text-xs text-amber-400 mb-1">{p.categoria}</p>}
                      <p className="font-semibold text-white">{p.nome}</p>
                      {p.descricao && <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{p.descricao}</p>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.ativo ? "bg-green-900/50 text-green-400" : "bg-zinc-700 text-zinc-400"}`}>
                      {p.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
                    <span className="text-amber-400 font-bold">{formatarMoeda(p.preco)}</span>
                    <span className="text-xs text-zinc-400">Estoque: {p.estoque}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Novo Produto */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setModal(false)} />
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white">Novo Produto</h2>
                <button onClick={() => setModal(false)} className="text-zinc-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSalvar} className="space-y-4">
                <Input label="Nome do produto" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
                <Textarea label="Descrição (opcional)" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Preço (R$)" type="number" step="0.01" min="0" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} required />
                  <Input label="Estoque" type="number" min="0" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} required />
                </div>
                <Input label="Categoria (opcional)" placeholder="Ex: Pomada, Shampoo" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
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
