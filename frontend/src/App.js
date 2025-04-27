import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateEditPostPage from "./pages/CreateEditPostPage";
import PostDetailPage from "./pages/PostDetailPage";
import Navbar from "./components/Navbar";
import PublicProfilePage from "./pages/PublicProfilePage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/post/new" element={<CreateEditPostPage />} />
        <Route path="/post/edit/:id" element={<CreateEditPostPage editMode={true} />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/profile/:email" element={<PublicProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
