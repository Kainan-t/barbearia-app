/**
 * Configurações da Barbearia
 * Todas as variáveis são definidas nas Environment Variables da Vercel.
 * Valores padrão são usados caso a variável não esteja definida.
 */

export const config = {
  // Identidade
  nome:        process.env.NEXT_PUBLIC_NOME        ?? "BarberShop",
  slogan:      process.env.NEXT_PUBLIC_SLOGAN      ?? "Estilo & Precisão em cada corte",
  descricao:   process.env.NEXT_PUBLIC_DESCRICAO   ?? "Transformamos seu visual com maestria. Agendamento online, atendimento premium e produtos exclusivos.",

  // Contato
  telefone:    process.env.NEXT_PUBLIC_TELEFONE    ?? "(11) 9 9999-9999",
  instagram:   process.env.NEXT_PUBLIC_INSTAGRAM   ?? "@barbershop",
  instagramUrl:process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "#",

  // Localização
  endereco:    process.env.NEXT_PUBLIC_ENDERECO    ?? "Rua das Flores, 123 – Centro",
  cidade:      process.env.NEXT_PUBLIC_CIDADE      ?? "São Paulo – SP",

  // Horários
  horarioSemana: process.env.NEXT_PUBLIC_HORARIO_SEMANA ?? "Seg–Sex: 9h–20h",
  horarioSabado: process.env.NEXT_PUBLIC_HORARIO_SABADO ?? "Sáb: 9h–18h",

  // SEO / Metadata
  siteUrl:     process.env.NEXT_PUBLIC_SITE_URL    ?? "https://barbearia-app-iota.vercel.app",
};
