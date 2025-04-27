import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const BLOG_TYPE_CHOICES = [
  { value: "tech", label: "Tech" },
  { value: "travel", label: "Travel" },
  { value: "food", label: "Food" },
  { value: "education", label: "Education" },
  { value: "lifestyle", label: "Lifestyle" },
];

function CreateEditPostPage({ editMode }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("tech");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (editMode && id) {
      const fetchPost = async () => {
        try {
          const res = await axios.get(`${API_BASE}/posts/${id}/`);
          setTitle(res.data.title);
          setContent(res.data.content);
          setType(res.data.type || "tech");
          setImagePreview(res.data.image || null);
        } catch (e) {
          setError("Failed to load post");
        }
      };
      fetchPost();
    }
  }, [editMode, id]);

  const handleImageChange = e => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("type", type);
    if (image) formData.append("image", image);
    const token = localStorage.getItem("token");
    try {
      if (editMode && id) {
        await axios.patch(`${API_BASE}/posts/${id}/`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API_BASE}/posts/`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/");
    } catch (e) {
      setError("Failed to save post. Make sure you are logged in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl mb-4">{editMode ? "Edit" : "Create"} Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        >
          {BLOG_TYPE_CHOICES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full border px-2 py-1 rounded h-32"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
        {imagePreview && (
          <img src={imagePreview} alt="preview" className="max-h-52 rounded object-cover mx-auto" />
        )}
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white rounded py-2" disabled={submitting}>{submitting ? (editMode ? "Updating..." : "Creating...") : (editMode ? "Update" : "Create Post")}</button>
      </form>
    </div>
  );
}

export default CreateEditPostPage;
