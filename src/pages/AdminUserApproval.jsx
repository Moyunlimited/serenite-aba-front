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
    return <div className="container mt-5">🚫 Admin access only</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Pending User Approvals</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : pendingUsers.length === 0 ? (
        <p>No pending users.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.full_name}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => approveUser(u.id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUserApproval;
