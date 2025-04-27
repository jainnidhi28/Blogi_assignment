import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function PublicProfilePage() {
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const { email } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [blogCount, setBlogCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      console.log('PublicProfilePage: email param:', email);

      try {
        const res = await axios.get(`${API_BASE}/users/profile/${encodeURIComponent(email)}/`);
        console.log('PublicProfilePage: user API response:', res.data);
        setUser(res.data);
        const postsRes = await axios.get(`${API_BASE}/posts/?author__email=${email}&page=${page}&page_size=5`);
        setPosts(postsRes.data.results.filter(p => p.author === email));
        setBlogCount(postsRes.data.count);
        setNext(postsRes.data.next);
        setPrevious(postsRes.data.previous);
      } catch (e) {
        // Log error details
        if (e.response) {
          console.error('API error:', e.response.status, e.response.data);
        } else {
          console.error('Network or unknown error:', e);
        }
        setUser(null);
        setPosts([]);
      }
      setLoading(false);
    };
    if (email) fetchUser();
  }, [email, page]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6 text-red-500">Could not load user details. Check browser console for debug info.</div>;

  const { profile } = user;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{(user.first_name || "") + (user.last_name ? ' ' + user.last_name : "") || user.email || "User"}</h2>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          {profile && profile.avatar ? (
            <img src={profile.avatar} alt="avatar" className="rounded-full w-20 h-20 object-cover border" />
          ) : (
            <div className="rounded-full bg-blue-200 w-20 h-20 flex items-center justify-center text-4xl font-bold text-blue-800">
              {(user.email ? user.email[0] : "U").toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold text-lg">{(user.first_name || "") + (user.last_name ? ' ' + user.last_name : "") || user.email || "User"}</div>
            {profile && profile.location && <div className="text-gray-600">{profile.location}</div>}
          </div>
        </div>
        {profile && profile.bio && <div className="text-gray-700 mb-2">{profile.bio}</div>}
        <div className="text-gray-500">Joined: {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : "-"}</div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Blogs by {(user.first_name || "") + (user.last_name ? ' ' + user.last_name : "") || user.email || "User"}</h3>
        <div className="mb-2 text-blue-700 font-medium">Blogs created: {blogCount}</div>
        {posts.length === 0 ? (
          <div className="text-gray-500">No blogs found.</div>
        ) : (
          <ul className="space-y-3">
            {posts.map(post => (
              <li key={post.id} className="border rounded p-3 flex flex-col md:flex-row md:items-center gap-4">
                {post.image && <img src={post.image} alt="blog" className="w-24 h-16 object-cover rounded" />}
                <div className="flex-1">
                  <div className="font-semibold text-blue-800">{post.title}</div>
                  <div className="text-xs text-gray-500">{post.type.charAt(0).toUpperCase() + post.type.slice(1)}</div>
                  <div className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PublicProfilePage;
