import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => { fetchMembers(); }, []);

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await api.get("/members");
      setMembers(res.data?.data || []);
    } catch (err) {
      alert("Error fetching members: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this member?")) return;
    try {
      await api.delete(`/members/${id}`);
      fetchMembers();
    } catch (err) {
      alert("Delete failed: " + (err.message || err));
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ color: "#2c3e50" }}>Members</h2>

      <div style={{ marginBottom: 12 }}>
        <Link to="/members/add" style={{ textDecoration: "none", color: "#2980b9", fontWeight: "bold" }}>
          + Add Member
        </Link>
      </div>

      {loading ? (
        <p style={{ color: "#e67e22" }}>Loading...</p>
      ) : (
        <table
          width="100%"
          cellPadding="6"
          style={{
            borderCollapse: "collapse",
            backgroundColor: "#ffffff",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}
        >
          <thead style={{ backgroundColor: "#34495e", color: "#ecf0f1" }}>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
              <th>Balance</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "#7f8c8d" }}>No members found</td>
              </tr>
            ) : (
              members.map(m => (
                <tr key={m.memberId} style={{ borderBottom: "1px solid #ddd" }}>
                  <td>{m.memberId}</td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td>{m.balance ?? "-"}</td>
                  <td>{m.status}</td>
                  <td>
                    <button
                      onClick={() => nav(`/members/edit/${m.memberId}`)}
                      style={{
                        backgroundColor: "#27ae60",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                        borderRadius: "4px"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m.memberId)}
                      style={{
                        backgroundColor: "#c0392b",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        marginLeft: 8,
                        cursor: "pointer",
                        borderRadius: "4px"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}