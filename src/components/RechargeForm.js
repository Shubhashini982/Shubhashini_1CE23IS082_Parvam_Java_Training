// src/components/RechargeForm.js

import React, { useEffect, useState } from "react";
import { getMembers, getRecharges, createRecharge } from "../api";

export default function RechargeForm() {
  const [members, setMembers] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ memberId: "", amount: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchHistory();
  }, []);

  async function fetchMembers() {
    try {
      const res = await getMembers();
      setMembers(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchHistory() {
    try {
      const res = await getRecharges();
      setHistory(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await createRecharge({
        memberId: Number(form.memberId),
        amount: Number(form.amount),
      });
      alert("Recharged successfully ✅");
      setForm({ memberId: "", amount: "" });
      fetchHistory();
    } catch (err) {
      alert(
        "Recharge failed: " +
          (err.response?.data?.message || err.message || err)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: "40px 20px",
        minHeight: "100vh",
        background: "#f1f5f9",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: 24,
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: "#1e3a8a",
            borderBottom: "2px solid #3b82f6",
            paddingBottom: 8,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          💳 Recharge Wallet
        </h2>

        {/* Form Section */}
        <form onSubmit={onSubmit} style={{ marginBottom: 30 }}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontWeight: 600,
                color: "#1e40af",
                display: "block",
                marginBottom: 6,
              }}
            >
              Member
            </label>
            <select
              name="memberId"
              value={form.memberId}
              onChange={onChange}
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: 15,
              }}
            >
              <option value="">Select member</option>
              {members.map((m) => (
                <option key={m.memberId} value={m.memberId}>
                  {m.name} (ID:{m.memberId})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontWeight: 600,
                color: "#1e40af",
                display: "block",
                marginBottom: 6,
              }}
            >
              Amount
            </label>
            <input
              name="amount"
              value={form.amount}
              onChange={onChange}
              type="number"
              step="0.01"
              required
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: 15,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#93c5fd" : "#3b82f6",
              color: "#fff",
              padding: 12,
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s",
            }}
          >
            {loading ? "Processing..." : "Recharge"}
          </button>
        </form>

        {/* History Section */}
        <div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#1e3a8a",
              borderBottom: "1px solid #3b82f6",
              paddingBottom: 8,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            🔄 Recharge History
          </h3>

          <div
            style={{
              overflowX: "auto",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
            }}
          >
            <table
              width="100%"
              cellPadding="10"
              style={{
                borderCollapse: "collapse",
                fontSize: 14,
                width: "100%",
              }}
            >
              <thead style={{ background: "#dbeafe", color: "#1e3a8a" }}>
                <tr>
                  <th align="left">ID</th>
                  <th align="left">Member ID</th>
                  <th align="left">Amount</th>
                  <th align="left">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: 12,
                        color: "#64748b",
                      }}
                    >
                      No recharges yet
                    </td>
                  </tr>
                ) : (
                  history.map((r, i) => (
                    <tr
                      key={r.rechargeId}
                      style={{
                        background: i % 2 === 0 ? "#fff" : "#f1f5f9",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <td>{r.rechargeId}</td>
                      <td>{r.memberId}</td>
                      <td
                        style={{
                          color: "#16a34a",
                          fontWeight: "bold",
                        }}
                      >
                        ₹{r.amount}
                      </td>
                      <td>{new Date(r.rechargeDate).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}