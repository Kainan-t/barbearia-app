import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Scissors, Clock, Star, MapPin, Phone,
  CalendarDays, ShoppingBag, ChevronRight,
} from "lucide-react";

const servicos = [
  { nome: "Corte Clássico",     preco: "R$ 45", duracao: "45 min", icon: "✂️" },
  { nome: "Barba Completa",     preco: "R$ 35", duracao: "30 min", icon: "🪒" },
  { nome: "Corte + Barba",      preco: "R$ 70", duracao: "75 min", icon: "💈" },
  { nome: "Hidratação Capilar", preco: "R$ 55", duracao: "50 min", icon: "✨" },
];

const depoimentos = [
  { nome: "Carlos M.",  texto: "Melhor barbearia da cidade! Atendimento incrível e resultado impecável.", nota: 5 },
  { nome: "Rafael S.",  texto: "Sempre saio satisfeito. Profissionais de primeira, ambiente top.", nota: 5 },
  { nome: "João Pedro", texto: "Recomendo demais! Ótimo custo-benefício e muito capricho no trabalho.", nota: 5 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-zinc-950" />
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-36 relative">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5">
              <Scissors className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">Barbearia Premium</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
              Estilo &amp; Precisão<br />
              <span className="text-amber-400">em cada corte</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl">
              Transformamos seu visual com maestria. Agendamento online, atendimento premium e produtos exclusivos.
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link href="/agendar">
                <Button tamanho="lg">
                  <CalendarDays className="h-5 w-5" />
                  Agendar Horário
                </Button>
              </Link>
              <Link href="/loja">
                <Button tamanho="lg" variante="fantasma">
                  <ShoppingBag className="h-5 w-5" />
                  Ver Produtos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info rápida */}
      <section className="border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Horário de funcionamento</p>
                <p className="text-sm text-zinc-400">Seg–Sex: 9h–20h · Sáb: 9h–18h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Localização</p>
                <p className="text-sm text-zinc-400">Rua das Flores, 123 – Centro</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">Contato</p>
                <p className="text-sm text-zinc-400">(11) 9 9999-9999</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Nossos Serviços</h2>
          <p className="text-zinc-400">Qualidade e precisão em cada detalhe</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {servicos.map((s) => (
            <div
              key={s.nome}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-amber-500/40 transition-all hover:shadow-lg hover:shadow-amber-500/5"
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-semibold text-white mb-1">{s.nome}</h3>
              <p className="text-xs text-zinc-500 mb-3">{s.duracao}</p>
              <p className="text-amber-400 font-bold text-lg">{s.preco}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/agendar">
            <Button>
              Agendar agora
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="bg-zinc-900/50 border-y border-zinc-800 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">O que dizem nossos clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {depoimentos.map((d) => (
              <div key={d.nome} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array(d.nota).fill(0).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm mb-4">"{d.texto}"</p>
                <p className="text-amber-400 text-sm font-semibold">{d.nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pronto para um novo visual?</h2>
        <p className="text-zinc-400 mb-8">Agende agora e garanta seu horário</p>
        <Link href="/agendar">
          <Button tamanho="lg">
            <CalendarDays className="h-5 w-5" />
            Agendar meu horário
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Scissors className="h-5 w-5" />
            <span className="font-bold">BarberShop</span>
          </div>
          <p className="text-xs text-zinc-500">© 2024 BarberShop. Todos os direitos reservados.</p>
          <a href="#" className="text-zinc-500 hover:text-amber-400 transition-colors text-sm font-medium">
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}
