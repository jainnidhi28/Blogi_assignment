import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Blogi</Link>
      <div className="flex items-center space-x-4">
        <a href="#allblogs" className="hover:underline">View All Blogs</a>
        {token && username && (
          <Link to={`/profile/${username}`} className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
            </svg>
            <span>{username}</span>
          </Link>
        )}
        {token ? (
          <>
            <Link to="/post/new" className="bg-blue-600 px-3 py-1 rounded">New Post</Link>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-600 px-3 py-1 rounded">Login</Link>
            <Link to="/register" className="bg-green-600 px-3 py-1 rounded">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
