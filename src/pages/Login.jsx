import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailLowered = form.email.trim().toLowerCase(); // normalize email
    const success = await login(emailLowered, form.password);
    if (success) navigate("/");
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f0f4f8, #d9f2ec)",
        padding: "2rem",
      }}
    >
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "500px" }}>
        {/* Logo */}
        <div className="text-center mb-3">
          <img src="/logo.png" alt="Serenité ABA Logo" style={{ maxHeight: "80px" }} />
        </div>

        <h3 className="text-center mb-4 text-primary">Welcome Back</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div className="d-flex justify-content-end mb-3">
            <Link to="/forgot-password" className="small text-muted">
              Forgot Password?
            </Link>
          </div>

          <button className="btn btn-primary w-100">Login</button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">Don't have an account?</span>{" "}
          <Link to="/signup" className="text-primary fw-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
