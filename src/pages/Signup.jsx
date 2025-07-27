import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE from "../config";

function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg(data.msg);
        setForm({ email: "", password: "", full_name: "" });
        setTimeout(() => navigate("/login"), 2000); // Redirect after signup
      } else {
        setError(data.msg || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e3fdfd, #fcfefe, #a6e3e9)",
        padding: "1rem",
      }}
    >
      <div
        className="card shadow-lg p-4 p-md-5 w-100"
        style={{
          maxWidth: "450px",
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.95)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-3">
          <img src="/logo.png" alt="Logo" style={{ maxHeight: "70px" }} />
        </div>

        <h3 className="text-center mb-4 text-primary fw-bold">
          Create Your Account
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              name="full_name"
              placeholder="Your full name"
              value={form.full_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button className="btn btn-primary w-100 mt-3 py-2">Sign Up</button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none fw-semibold">
              Login here
            </Link>
          </small>
        </div>

        {/* Alerts */}
        {msg && <div className="alert alert-success mt-3">{msg}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default Signup;
