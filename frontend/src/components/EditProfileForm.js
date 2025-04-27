import React, { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function EditProfileForm({ user, onSave }) {
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [email] = useState(user.email || ""); // Email is shown but cannot be edited
  const [phone, setPhone] = useState(user.profile?.phone_number || "");
  const [bio, setBio] = useState(user.profile?.bio || "");
  const [location, setLocation] = useState(user.profile?.location || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.profile?.avatar || null);
  // Password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwChangeMessage, setPwChangeMessage] = useState("");
  const [pwChangeError, setPwChangeError] = useState("");
  const token = localStorage.getItem("token");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      // Nested profile fields: profile.bio, profile.phone_number, etc.
      formData.append("profile.bio", bio);
      formData.append("profile.location", location);
      formData.append("profile.phone_number", phone);
      if (avatar) formData.append("profile.avatar", avatar);
      const token = localStorage.getItem("token");
      const res = await axios.patch(`${API_BASE}/users/me/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onSave(res.data);
    } catch (e) {
      setError("Failed to update profile.");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div>
          <label className="block font-semibold mb-1">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border px-2 py-1 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-1">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          rows={3}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      <div className="mt-6 border-t pt-4">
        <div className="font-semibold mb-2">Change Password</div>
        <div className="mb-2">
          <label className="block mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            autoComplete="current-password"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            autoComplete="new-password"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            autoComplete="new-password"
          />
        </div>
        <button
          type="button"
          className="bg-yellow-600 text-white rounded px-4 py-2 mt-2"
          disabled={!currentPassword || !newPassword || !confirmNewPassword}
          onClick={async () => {
            setPwChangeMessage(""); setPwChangeError("");
            if (newPassword !== confirmNewPassword) {
              setPwChangeError("New passwords do not match.");
              return;
            }
            try {
              await axios.post(`${API_BASE}/users/change-password/`, {
                old_password: currentPassword,
                new_password: newPassword
              }, { headers: { Authorization: `Bearer ${token}` } });
              setPwChangeMessage("Password changed successfully.");
              setCurrentPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
            } catch (err) {
              setPwChangeError(err.response?.data?.detail || "Failed to change password.");
            }
          }}
        >Change Password</button>
        {pwChangeMessage && <div className="text-green-600 mt-2">{pwChangeMessage}</div>}
        {pwChangeError && <div className="text-red-600 mt-2">{pwChangeError}</div>}
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2" disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export default EditProfileForm;
