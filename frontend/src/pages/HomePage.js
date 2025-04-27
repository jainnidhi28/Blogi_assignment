import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const BLOG_TYPES = [
  { value: "tech", label: "Tech", color: "bg-blue-100 text-blue-800" },
  { value: "travel", label: "Travel", color: "bg-green-100 text-green-800" },
  { value: "food", label: "Food", color: "bg-yellow-100 text-yellow-800" },
  { value: "education", label: "Education", color: "bg-purple-100 text-purple-800" },
  { value: "lifestyle", label: "Lifestyle", color: "bg-pink-100 text-pink-800" },
];

function getTypeMeta(typeVal) {
  return BLOG_TYPES.find(t => t.value === typeVal) || { label: typeVal, color: "bg-gray-100 text-gray-800" };
}

function HomePage() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/posts/?page=1&page_size=5`);
        setRecentPosts(res.data.results);
      } catch (e) {
        setRecentPosts([]);
      }
      setLoading(false);
    };
    fetchRecentPosts();
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-white min-h-screen">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-blue-900">Welcome to Blogi!</h1>
        <p className="text-lg text-gray-600 mb-6">A modern platform to share your thoughts, stories, and expertise with the world.</p>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {BLOG_TYPES.map(type => (
            <span key={type.value} className={`px-3 py-1 rounded-full text-sm font-semibold ${type.color}`}>{type.label}</span>
          ))}
        </div>
      </div>
      {/* Recent Blogs Section */}
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Recently Added Blogs</h2>
        {loading ? (
          <div>Loading...</div>
        ) : recentPosts.length === 0 ? (
          <div className="text-gray-500">No blogs found.</div>
        ) : (
          <ul className="space-y-4">
            {recentPosts.map(post => (
              <li key={post.id} className="border rounded p-4">
                <div className="flex items-center gap-4">
                  {post.image && <img src={post.image} alt="blog" className="w-20 h-14 object-cover rounded" />}
                  <div className="flex-1">
                    <div className="font-semibold text-blue-800 text-lg">{post.title}</div>
                    <div className="text-xs text-gray-500">{post.type.charAt(0).toUpperCase() + post.type.slice(1)}</div>
                    <div className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-gray-500">By {post.author}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HomePage;
