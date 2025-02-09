"use client";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useRouter } from "next/navigation";

export default function IndexPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthentication();

  if (isLoading) {
    return (
      <main className="w-full h-full flex flex-col items-center justify-center">
        <h1>Carregando...</h1>
      </main>
    );
  }

  const logo = "</>";
  return (
    <main className="w-full h-full flex flex-col items-center justify-center">
      <h1>Blog Dev {logo}</h1>
      {user ? <p>Bem-vindo, {user.name}!</p> : <p>Usuário não autenticado</p>}
    </main>
  );
}
