import { createContext, useContext, useEffect, useState } from "react";
import API_BASE from "../config"; // ✅ Import the new config

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⏳ add loading state

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setUser({ email: data.email, role: data.role, token: data.token });
        return true;
      } else {
        alert(data.error || "Login failed");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Network error");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "null" || token.trim() === "") {
      logout();
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const identity = await res.json();
          setUser({ ...identity, token });
        } else {
          console.warn("Invalid or expired token");
          logout();
        }
      } catch (error) {
        console.error("Failed to fetch /me:", error);
        logout();
      } finally {
        setLoading(false); // ✅ done loading
      }
    };

    fetchUser();
  }, []);

  if (loading) return null; // ⏳ prevent app from loading prematurely

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
