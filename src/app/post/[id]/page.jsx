"use client";
import { Heart } from "@phosphor-icons/react";
import { useParams } from "next/navigation";
import React from "react";

export default function PostPage() {
  const { id } = useParams();

  const [post, setPost] = React.useState({});
  const [user, setUser] = React.useState({});
  const [usersComments, setUsersComments] = React.useState([]);
  const [comments, setComments] = React.useState([]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
        fetchUser();
        fetchComments();
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setUser(data.user);
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
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
        console.log(usersData);
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
  return (
    <div>
      <h1>{post.title}</h1>
      {post.image && <img src={post.image} alt={post.title} />}
      <p>
        <strong className="text-blue-500 text-xl">{user.name}</strong> -{" "}
        {post.description}
      </p>
      <span className="flex flex-row items-center gap-2">
        <Heart size={20} className="text-red-500" />
        {post.likes}
      </span>
      <h2 className="text-2xl">Comentários</h2>
      {comments.map((comment) => (
        <div key={comment.id}>
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
