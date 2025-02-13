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
  const [comment, setComment] = React.useState("");
  const [editComment, setEditComment] = React.useState("");
  const [editingCommentId, setEditingCommentId] = React.useState(null);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
        await fetchComments();
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
      if (!res.ok) throw new Error("Erro ao buscar comentários");

      const data = await res.json();
      const comments = data.comments.sort((a, b) => a.id - b.id);
      setComments(comments);

      const userIds = [...new Set(comments.map((comment) => comment.user_id))];
      const userRequests = userIds.map((userId) =>
        fetch(`http://localhost:5000/api/users/${userId}`, {
          method: "GET",
          credentials: "include",
        }).then((res) => res.json())
      );

      const usersData = await Promise.all(userRequests);
      const usersMap = Object.fromEntries(
        usersData.map((user, index) => [
          userIds[index],
          user.user?.name || "Desconhecido",
        ])
      );

      setUsersComments(usersMap);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchPost();
  }, [id]);

  const handlePostReaction = async (action) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/posts/${action}/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
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

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/posts/comment`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: id, comment }),
      });
      if (res.ok) {
        fetchPost();
        setComment("");
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditComment = async (e, comment_id) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/posts/comment/${comment_id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment: editComment }),
        }
      );

      if (res.ok) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === comment_id ? { ...c, comment: editComment } : c
          )
        );
        setEditingCommentId(null);
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openInput = (comment_id, comment_text) => {
    setEditingCommentId(comment_id);
    setEditComment(comment_text);
  };

  const handleDeleteComment = async (comment_id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/posts/comment/${comment_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        fetchPost();
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
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
          <Heart
            size={20}
            onClick={() => handlePostReaction("like")}
            className="text-red-500"
          />
        ) : (
          <Heart
            size={20}
            className="text-red-500"
            onClick={() => handlePostReaction("dislike")}
            weight="fill"
          />
        )}
        {post.likes.length}
      </span>
      <h2 className="text-2xl">Comentários</h2>
      <form onSubmit={handleComment}>
        <input
          type="text"
          placeholder="Digite seu comentário"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>{" "}
      {comments.map((comment, index) => (
        <div key={index}>
          <p>
            <strong className="text-blue-500 text-xl">
              {usersComments[comment.user_id]}
            </strong>{" "}
            -{" "}
            {editingCommentId === comment.id ? (
              <input
                type="text"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
              />
            ) : (
              comment.comment
            )}
          </p>
          {user.id === comment.user_id && (
            <>
              {editingCommentId === comment.id ? (
                <button
                  type="button"
                  onClick={(e) => handleEditComment(e, comment.id)}
                >
                  Salvar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openInput(comment.id, comment.comment)}
                >
                  Editar
                </button>
              )}
            </>
          )}
          {user.id === comment.user_id && (
            <button
              type="button"
              onClick={() => handleDeleteComment(comment.id)}
            >
              Excluir
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
