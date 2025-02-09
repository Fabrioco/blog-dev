"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const logo = "</>";

  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        const token = data.token;
        document.cookie = `token=${token};path=/`;
        router.push("/");
        toast.success("Login realizado com sucesso!");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex- items-center justify-center gap-10">
      <div className="hidden  w-[500px] h-[600px] md:grid grid-cols-2 shadow-xl rounded-2xl ">
        <div className="w-full h-full bg-gradient-to-tr from-blue-600 via-blue-400 to-blue-600 rounded-tl-2xl"></div>
        <div className="w-full h-full bg-gradient-to-tl from-blue-600 via-blue-400 to-blue-600 rounded-tr-2xl"></div>
        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600 rounded-bl-2xl"></div>
        <div className="w-full h-full bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-600 rounded-br-2xl"></div>
      </div>
      <div className="flex flex-col items-center justify-center w-11/12 h-auto md:w-1/2 xl:w-1/4">
        <h1 className="text-3xl font-bold">
          Login <span className="text-blue-600">{logo}</span>
        </h1>
        <form
          className="flex flex-col items-center justify-center gap-4 w-full h-auto border-2 border-gray-300 p-4 rounded-lg mt-5 shadow-md"
          onSubmit={handleLogin}
        >
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
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
          <div className="w-full flex items-center justify-center">
            <Link href={"/register"} className="text-blue-600 hover:underline">
              Não possui uma conta? <span className="font-bold">Cadastre-se</span>
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}
