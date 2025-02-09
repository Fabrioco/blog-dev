"use client";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useRouter } from "next/navigation";
import { PlusCircle } from "@phosphor-icons/react";
import React from "react";

export default function IndexPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthentication();
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/posts/all", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        const posts = data.posts;
        setPosts(posts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, []);

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
      <h1 className="text-3xl border-b border-black w-full ">
        Blog Dev {logo}
      </h1>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="border-b border-black">
            {post.image && <img src={post.image} alt={post.title} />}
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <p className="text-lg">{post.description}</p>
            <span>{post.likes}</span>
          </div>
        ))}
      </div>
      <div className="fixed bottom-4 right-4">
        <PlusCircle size={32} />
      </div>
    </main>
  );
}
