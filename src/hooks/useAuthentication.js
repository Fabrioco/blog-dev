"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export const useAuthentication = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const apiUrl = "http://localhost:5000";

    try {
      const res = await fetch(`${apiUrl}/api/protected`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(
          `Erro na requisição: ${res.status} - ${res.statusText}`
        );
      }

      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
      } else {
        throw new Error("Dados do usuário inválidos");
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      router.push("/error");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
};
