"use client";
import { Heart } from "@phosphor-icons/react";
import { useParams } from "next/navigation";
import React from "react";
import { useAuthentication } from "../../../hooks/useAuthentication";

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuthentication();

  const [post, setPost] = React.useState({});
  const [usersComments, setUsersComments] = React.useState([]);
  const [comments, setComments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
        fetchComments();
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/posts/${id}/comments`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        const userRequests = data.comments.map(async (comment) => {
          return await fetch(
            `http://localhost:5000/api/users/${comment.user_id}`,
            {
              method: "GET",
              credentials: "include",
            }
          ).then((res) =>
            res.json().then((data) => ({
              [comment.user_id]: data.user?.name || "Desconhecido",
            }))
          );
        });
        const usersData = await Promise.all(userRequests);
        setUsersComments(Object.assign({}, ...usersData));
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchPost();
  }, []);

  const handleLikePost = async () => {
    const res = await fetch(`http://localhost:5000/api/posts/like/${id}`, {
      method: "put",
      credentials: "include",
    });
    if (res.ok) {
      fetchPost();
    } else if (!res.ok) {
      console.log(res);
    }
  };

  const handleDislikePost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/dislike/${id}`, {
        method: "put",
        credentials: "include",
      });
      if (res.ok) {
        fetchPost();
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyLike = () => {
    const res = post.likes.includes(user.id);
    return res;
  };

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      {post.image && <img src={post.image} alt={post.title} />}
      <p>
        <strong className="text-blue-500 text-xl">{user.name}</strong> -{" "}
        {post.description}
      </p>
      <span className="flex flex-row items-center gap-2">
        {!verifyLike() ? (
          <Heart size={20} onClick={handleLikePost} className="text-red-500" />
        ) : (
          <Heart
            size={20}
            className="text-red-500"
            onClick={handleDislikePost}
            weight="fill"
          />
        )}
        {post.likes.length}
      </span>
      <h2 className="text-2xl">Comentários</h2>
      {comments.map((comment, index) => (
        <div key={index}>
          <p>
            <strong className="text-blue-500 text-xl">
              {usersComments[comment.user_id]}
            </strong>{" "}
            - {comment.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
