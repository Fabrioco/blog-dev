"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 

export const useAuthentication = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/protected", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        const userData = data.user;
        setUser(userData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login");
    }
  }, [user, isLoading, router]); 

  return { user, isLoading };
};
