import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config";

const AdminUserApproval = () => {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/pending-users`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || "Failed to fetch users");
      }

      const data = await res.json();
      setPendingUsers(data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error loading pending users");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/approve-user/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || "Failed to approve user");
      }

      const data = await res.json();
      alert(data.msg);
      fetchPendingUsers();
    } catch (err) {
      console.error("Approval error:", err);
      alert(err.message || "Approval failed");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPendingUsers();
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return <div className="container mt-5 text-center text-danger">🚫 Admin access only</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-primary fw-bold text-center mb-4">Pending User Approvals</h2>

      {loading ? (
        <div className="text-center text-muted">Loading...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : pendingUsers.length === 0 ? (
        <div className="text-center text-success">🎉 No pending users.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Email</th>
                <th scope="col">Full Name</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td style={{ wordBreak: "break-word" }}>{u.email}</td>
                  <td style={{ wordBreak: "break-word" }}>{u.full_name}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => approveUser(u.id)}
                    >
                      ✅ Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserApproval;
