import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProfileForm from "../components/EditProfileForm";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      console.log('ProfilePage: Using token for API:', token);
      try {
        const res = await axios.get(`${API_BASE}/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        const postsRes = await axios.get(`${API_BASE}/posts/?search=${username}`);
        setPosts(postsRes.data.results.filter(p => p.author === username));
      } catch (e) {
        setUser(null);
        setPosts([]);
      }
      setLoading(false);
    };
    if (token && username) fetchUser();
  }, [token, username]);

  const handleProfileSave = newUser => {
    setUser(newUser);
    setEditMode(false);
  };

  if (!token) return <div className="p-6">Please login to view your profile.</div>;
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6 text-red-500">Could not load user details.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          {user.profile?.avatar ? (
            <img src={user.profile.avatar} alt="avatar" className="rounded-full w-16 h-16 object-cover border" />
          ) : (
            <div className="rounded-full bg-blue-200 w-16 h-16 flex items-center justify-center text-3xl font-bold text-blue-800">
              {user.username[0].toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold text-lg">{user.username || `${user.first_name} ${user.last_name}`}</div>
            <div className="text-gray-600">{user.email || "No email set"}</div>
            {user.profile?.location && <div className="text-gray-500">{user.profile.location}</div>}
          </div>
        </div>
        {user.profile?.bio && <div className="text-gray-700 mb-2">{user.profile.bio}</div>}
        <div className="text-gray-700">Joined: {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : "-"}</div>
        <button onClick={() => setEditMode(e => !e)} className="mt-4 px-4 py-1 rounded bg-blue-600 text-white">{editMode ? "Cancel" : "Edit Profile"}</button>
        {editMode && <EditProfileForm user={user} onSave={handleProfileSave} />}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Your Blogs</h3>
        {posts.length === 0 ? (
          <div className="text-gray-500">No blogs posted yet.</div>
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

export default ProfilePage;
