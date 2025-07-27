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
        background: "linear-gradient(to right, #f0f4f8, #d9f2ec)",
        padding: "2rem",
      }}
    >
      <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
        <div className="text-center mb-3">
          <img src="/logo.png" alt="Logo" style={{ maxHeight: "70px" }} />
        </div>

        <h3 className="text-center mb-4 text-primary">Create Your Account</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              name="full_name"
              placeholder="Your full name"
              value={form.full_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
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

          <div className="mb-3">
            <label className="form-label">Password</label>
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

          <button className="btn btn-primary w-100 mt-2">Sign Up</button>
        </form>

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none">
              Login here
            </Link>
          </small>
        </div>

        {msg && <div className="alert alert-success mt-3">{msg}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default Signup;
