"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, CheckCircle } from "lucide-react";

interface Servico {
  id: string;
  nome: string;
  preco: number;
  duracaoMin: number;
}

export default function AgendarPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [form, setForm] = useState({
    nome: "", email: "", telefone: "",
    servicoId: "", data: "", hora: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/api/servicos").then((r) => r.json()).then(setServicos);
  }, []);

  const horarios = [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "13:00","13:30","14:00","14:30","15:00","15:30",
    "16:00","16:30","17:00","17:30","18:00","18:30","19:00",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro("");

    try {
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.erro || "Erro ao agendar. Tente novamente.");
      } else {
        setSucesso(true);
      }
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-4 p-8">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Agendamento Confirmado!</h2>
            <p className="text-zinc-400">Você receberá uma confirmação em breve.</p>
            <Button onClick={() => { setSucesso(false); setForm({ nome:"",email:"",telefone:"",servicoId:"",data:"",hora:"" }); }}>
              Fazer novo agendamento
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-amber-500/10 border border-amber-500/20">
              <CalendarDays className="h-6 w-6 text-amber-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Agendar Horário</h1>
          <p className="text-zinc-400">Preencha os dados e escolha seu horário preferido</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
            <Input
              label="Telefone"
              placeholder="(11) 9 9999-9999"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
          </div>

          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300">Serviço</label>
            <select
              className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={form.servicoId}
              onChange={(e) => setForm({ ...form, servicoId: e.target.value })}
              required
            >
              <option value="">Selecione um serviço</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} — R$ {s.preco.toFixed(2)} ({s.duracaoMin} min)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Data"
              type="date"
              value={form.data}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              required
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-300">Horário</label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
                required
              >
                <option value="">Selecione um horário</option>
                {horarios.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          {erro && <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">{erro}</p>}

          <Button type="submit" tamanho="lg" className="w-full" disabled={enviando}>
            {enviando ? "Agendando..." : "Confirmar Agendamento"}
          </Button>
        </form>
      </div>
    </div>
  );
}
