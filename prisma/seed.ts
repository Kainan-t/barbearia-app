import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = "postgresql://neondb_owner:npg_7SJbMVjI2cfp@ep-rapid-feather-ackx8dot.sa-east-1.aws.neon.tech/neondb?sslmode=require";
const adapter = new PrismaNeon({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Iniciando seed...");

  // Admin
  const senhaHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@barbearia.com" },
    update: {},
    create: {
      nome: "Administrador",
      email: "admin@barbearia.com",
      senha: senhaHash,
    },
  });
  console.log("✅ Admin criado:", admin.email);

  // Serviços
  const servicos = [
    { nome: "Corte Clássico",        preco: 45,  duracaoMin: 45 },
    { nome: "Barba Completa",         preco: 35,  duracaoMin: 30 },
    { nome: "Corte + Barba",          preco: 70,  duracaoMin: 75 },
    { nome: "Hidratação Capilar",     preco: 55,  duracaoMin: 50 },
    { nome: "Corte Degradê",          preco: 50,  duracaoMin: 50 },
    { nome: "Sobrancelha",            preco: 20,  duracaoMin: 15 },
  ];

  const existentes = await prisma.servico.count();
  if (existentes === 0) {
    await prisma.servico.createMany({ data: servicos });
  }
  console.log("✅ Serviços criados:", servicos.length);

  // Produtos de exemplo
  const produtos = [
    { nome: "Pomada Modeladora",  preco: 39.90, estoque: 20, categoria: "Pomada",  descricao: "Fixação forte, brilho natural. 150g." },
    { nome: "Shampoo Masculino",  preco: 29.90, estoque: 15, categoria: "Shampoo", descricao: "Limpeza profunda com extrato de menta." },
    { nome: "Balm para Barba",    preco: 49.90, estoque: 10, categoria: "Barba",   descricao: "Hidratação e maciez para a barba." },
    { nome: "Óleo de Barba",      preco: 59.90, estoque: 8,  categoria: "Barba",   descricao: "Óleo premium com argan e jojoba." },
    { nome: "Finalizador Capilar",preco: 34.90, estoque: 12, categoria: "Cabelo",  descricao: "Controle e definição para todos os tipos." },
  ];

  for (const p of produtos) {
    await prisma.produto.create({ data: p }).catch(() => {});
  }
  console.log("✅ Produtos criados:", produtos.length);

  console.log("\n🎉 Seed concluído!");
  console.log("📧 Login admin: admin@barbearia.com");
  console.log("🔑 Senha: admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
