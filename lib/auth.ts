import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "barbearia-secret-key-super-segura-2024"
);

export async function criarToken(adminId: string, email: string) {
  return await new SignJWT({ adminId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verificarToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { adminId: string; email: string };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return await verificarToken(token);
}
