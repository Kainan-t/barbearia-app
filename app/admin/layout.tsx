import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Não proteger a página de login
  return <AdminLayoutInner>{children}</AdminLayoutInner>;
}

async function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
