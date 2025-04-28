import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      // Login endpoint remains /users/login/ (custom token view)
      const res = await axios.post(`${API_BASE}/users/login/`, { email, password });
      // Store only the access token string, not the whole response object
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("username", email);
      navigate("/");
    } catch (e) {
      if (e.response && e.response.data) {
        // Try to show the first error message from the backend
        const data = e.response.data;
        let msg = "Login failed.";
        if (typeof data === 'string') {
          msg = data;
        } else if (typeof data === 'object') {
          const firstKey = Object.keys(data)[0];
          if (Array.isArray(data[firstKey])) {
            msg = data[firstKey][0];
          } else if (typeof data[firstKey] === 'string') {
            msg = data[firstKey];
          } else {
            msg = JSON.stringify(data);
          }
        }
        setError(msg);
      } else {
        setError("Login failed. Try again later.");
      }
    }
  };


  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white rounded py-2">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
