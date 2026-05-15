"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ShoppingBag, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatarMoeda } from "@/lib/utils";

interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  estoque: number;
  categoria: string | null;
  imagem: string | null;
}

interface ItemCarrinho {
  produto: Produto;
  qtd: number;
}

export default function LojaPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("todas");
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  useEffect(() => {
    fetch("/api/produtos").then((r) => r.json()).then(setProdutos);
  }, []);

  const categorias = ["todas", ...Array.from(new Set(produtos.map((p) => p.categoria).filter(Boolean) as string[]))];
  const produtosFiltrados = categoriaAtiva === "todas"
    ? produtos
    : produtos.filter((p) => p.categoria === categoriaAtiva);

  function adicionarAoCarrinho(produto: Produto) {
    setCarrinho((prev) => {
      const existe = prev.find((i) => i.produto.id === produto.id);
      if (existe) {
        return prev.map((i) => i.produto.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i);
      }
      return [...prev, { produto, qtd: 1 }];
    });
  }

  function removerDoCarrinho(id: string) {
    setCarrinho((prev) => prev.filter((i) => i.produto.id !== id));
  }

  const totalCarrinho = carrinho.reduce((s, i) => s + i.produto.preco * i.qtd, 0);
  const qtdItens = carrinho.reduce((s, i) => s + i.qtd, 0);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Nossa Loja</h1>
            <p className="text-zinc-400">Produtos premium para cuidar do seu visual</p>
          </div>
          <button
            onClick={() => setCarrinhoAberto(true)}
            className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            Carrinho
            {qtdItens > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {qtdItens}
              </span>
            )}
          </button>
        </div>

        {/* Categorias */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categoriaAtiva === cat
                  ? "bg-amber-500 text-black"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Produtos */}
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {produtosFiltrados.map((p) => (
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all group">
                <div className="h-48 bg-zinc-800 flex items-center justify-center">
                  {p.imagem
                    ? <img src={p.imagem} alt={p.nome} className="w-full h-full object-cover" />
                    : <ShoppingBag className="h-12 w-12 text-zinc-600" />
                  }
                </div>
                <div className="p-4">
                  {p.categoria && (
                    <span className="text-xs text-amber-400 font-medium">{p.categoria}</span>
                  )}
                  <h3 className="font-semibold text-white mt-1 mb-1">{p.nome}</h3>
                  {p.descricao && <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{p.descricao}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-amber-400 font-bold">{formatarMoeda(p.preco)}</span>
                    <button
                      onClick={() => adicionarAoCarrinho(p)}
                      disabled={p.estoque === 0}
                      className="text-xs bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {p.estoque === 0 ? "Esgotado" : "Adicionar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Carrinho Sidebar */}
      {carrinhoAberto && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60" onClick={() => setCarrinhoAberto(false)} />
          <div className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="font-semibold text-white">Carrinho</h2>
              <button onClick={() => setCarrinhoAberto(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {carrinho.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8">Seu carrinho está vazio.</p>
              ) : (
                carrinho.map((item) => (
                  <div key={item.produto.id} className="flex items-center gap-3 bg-zinc-800 rounded-lg p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.produto.nome}</p>
                      <p className="text-xs text-zinc-400">{item.qtd}x {formatarMoeda(item.produto.preco)}</p>
                    </div>
                    <button onClick={() => removerDoCarrinho(item.produto.id)} className="text-zinc-500 hover:text-red-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {carrinho.length > 0 && (
              <div className="p-4 border-t border-zinc-800 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Total</span>
                  <span className="font-bold text-amber-400">{formatarMoeda(totalCarrinho)}</span>
                </div>
                <Button className="w-full">Finalizar Pedido</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
