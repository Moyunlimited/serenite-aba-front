import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE from "../config";

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/request-reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            setMessage(data.msg || "Check your email for the reset link.");  // ✅ updated key
        } catch (err) {
            setMessage("Something went wrong.");
        }
        setLoading(false);
    };


const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,                // ✅ Send email
                new_password: newPassword  // ✅ Send new_password
            }),
        });
        const data = await res.json();
        if (res.ok) {
            setMessage("Password updated. Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } else {
            setMessage(data.msg || "Failed to reset password.");
        }
    } catch (err) {
        setMessage("Something went wrong.");
    }
    setLoading(false);
};


    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h3 className="mb-4">{token ? "Set New Password" : "Reset Your Password"}</h3>

            {message && <div className="alert alert-info">{message}</div>}

            {!token ? (
                <form onSubmit={handleRequestReset}>
                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSetNewPassword}>
                    <div className="mb-3">
                        <label>New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-success" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            )}
        </div>
    );
}
