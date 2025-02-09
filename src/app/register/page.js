"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const logo = "</>";
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Cadastro realizado com sucesso!");
        router.push("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Erro no fetch", error);
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">
        Registro <span className="text-blue-600">{logo}</span>
      </h1>
      <form
        className="flex flex-col items-center justify-center gap-4 w-11/12 h-auto border-2 border-gray-300 p-4 rounded-lg mt-5 shadow-md"
        onSubmit={handleRegister}
      >
        <input
          type="text"
          placeholder="Nome"
          className="w-full px-4 py-2 rounded-full border-gray-400 border focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded-full border-gray-400 border focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded-full border-gray-400 border focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <button
          className={`w-full px-4 py-2 rounded-full bg-blue-600 text-white active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Registrar"}
        </button>
        <div className="w-full flex items-center justify-center">
          <Link href={"/login"} className="text-blue-600 hover:underline">
            Possui uma conta? <span className="font-bold">Faça login</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
