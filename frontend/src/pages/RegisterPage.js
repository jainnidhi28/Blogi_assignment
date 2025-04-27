import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API_BASE}/users/register/`, {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        bio: bio
      });
      navigate("/login");
    } catch (e) {
      setError("Registration failed. Email may already exist.");
    }
  };


  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl mb-4">Register</h2>
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
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <textarea
          placeholder="Bio / Details about you"
          value={bio}
          onChange={e => setBio(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          rows={3}
        />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full bg-green-600 text-white rounded py-2">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
