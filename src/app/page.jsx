"use client";
import { useRouter } from "next/navigation";
import { Chat, PlusCircle } from "@phosphor-icons/react";
import React from "react";
import { Heart } from "@phosphor-icons/react/dist/ssr";
import { useAuthentication } from "../hooks/useAuthentication";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuthentication();
  const [posts, setPosts] = React.useState([]);
  const [users, setUsers] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/posts/all", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      const posts = data.posts.sort((a, b) => a.id - b.id);
      setPosts(posts);

      const userRequests = data.posts.map((post) =>
        fetch(`http://localhost:5000/api/users/${post.user_id}`, {
          method: "GET",
          credentials: "include",
        }).then((res) =>
          res.json().then((data) => ({
            [post.user_id]: data.user?.name || "Desconhecido",
          }))
        )
      );

      const usersData = await Promise.all(userRequests);
      setUsers(Object.assign({}, ...usersData));
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const handleLikePost = async (post_id) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/posts/like/${post_id}`,
        {
          method: "put",
          credentials: "include",
        }
      );
      if (res.ok) {
        fetchPosts();
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDislikePost = async (post_id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/posts/dislike/${post_id}`,
        {
          method: "put",
          credentials: "include",
        }
      );
      if (res.ok) {
        fetchPosts();
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyLike = (post_id) => {
    const post = posts.find((post) => post.id === post_id);
    if (!post || !post.likes || !Array.isArray(post.likes)) {
      return false;
    }
    return post.likes.includes(user.id);
  };

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
        {posts.map((post, index) => (
          <div key={index} className="border-b border-black">
            {post.image && <img src={post.image} alt={post.title} />}
            <h2 className="text-2xl font-bold">
              {post.title} - {users[post.user_id]}
            </h2>
            <button
              onClick={() => {
                router.push(`/post/${post.id}`);
              }}
            >
              Ver post
            </button>
            <p className="text-lg">{post.description}</p>
            <div className="flex gap-2">
              <span className="flex gap-2 items-center">
                {!verifyLike(post.id) ? (
                  <Heart
                    size={20}
                    onClick={() => handleLikePost(post.id)}
                    className="text-red-500"
                  />
                ) : (
                  <Heart
                    size={20}
                    className="text-red-500"
                    onClick={() => handleDislikePost(post.id)}
                    weight="fill"
                  />
                )}
                {post.likes?.length || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-4 right-4">
        <PlusCircle size={32} />
      </div>
    </main>
  );
}
