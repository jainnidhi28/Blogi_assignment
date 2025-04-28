import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = localStorage.getItem("username");

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/posts/${id}/`);
        setPost(res.data);
      } catch (e) {
        setError("Post not found");
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${API_BASE}/posts/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Show a success message briefly before redirecting
      setError("");
      alert("Post deleted successfully.");
      navigate("/");
    } catch (e) {
      if (e.response && e.response.status === 403) {
        setError("You are not allowed to delete this post.");
      } else {
        setError("Failed to delete post.");
      }
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="max-w-xl mx-auto p-4 border rounded mt-8">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <div className="text-gray-600 text-sm mb-4">
        By {post.author} | Created: {new Date(post.created_at).toLocaleString()} | Updated: {new Date(post.updated_at).toLocaleString()}
      </div>
      {post.image && <img src={post.image} alt="post" className="mb-4 max-h-60 rounded" />}
      <div className="mb-4 whitespace-pre-line">{post.content}</div>
      {token && post.author === currentUser && (
        <div className="flex space-x-2">
          <Link to={`/post/edit/${post.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</Link>
          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
        </div>
      )}
      {token && post.author !== currentUser && (
        <div className="text-red-500 mt-4">You are not allowed to edit or delete this post.</div>
      )}
    </div>
  );
}

export default PostDetailPage;
