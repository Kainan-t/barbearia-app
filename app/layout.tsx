import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { config } from "@/lib/config";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${config.nome} — Barbearia Premium`,
  description: config.descricao,
  metadataBase: new URL(config.siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">
        {children}
      </body>
    </html>
  );
}
