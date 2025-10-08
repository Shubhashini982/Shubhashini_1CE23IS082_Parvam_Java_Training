import React, { useEffect, useState } from "react";
import api from "../api";

export default function TransactionManager() {
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialForm = {
    transactionId: null,
    memberId: "",
    gameId: "",
    playTimeHrs: "",
    cost: "",
    transactionDate: "",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [tRes, mRes, gRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/members"),
        api.get("/games"),
      ]);

      const txData = tRes.data?.data || tRes.data?.transactions || [];
      const memberData = mRes.data?.data || [];
      const gameData = gRes.data?.data || [];

      setTransactions(txData);
      setMembers(memberData);
      setGames(gameData);
    } catch (err) {
      alert(
        "Error loading transactions: " +
          (err.response?.data?.message || err.message || err)
      );
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        memberId: Number(form.memberId),
        gameId: Number(form.gameId),
        playTimeHrs: Number(form.playTimeHrs),
        cost: Number(form.cost),
        transactionDate: form.transactionDate,
      };

      if (form.transactionId) {
        await api.put(`/transactions/${form.transactionId}`, payload);
        alert("✅ Transaction updated successfully!");
      } else {
        await api.post("/transactions", payload);
        alert("✅ Transaction added successfully!");
      }

      resetForm();
      fetchAll();
    } catch (err) {
      alert(
        "Save failed: " +
          (err.response?.data?.message || err.message || err)
      );
    }
  }

  function handleEdit(tx) {
    // Fix: ensure correct date format for datetime-local input
    const formattedDate = tx.transactionDate
      ? new Date(tx.transactionDate).toISOString().slice(0, 16)
      : "";

    setForm({
      transactionId: tx.transactionId,
      memberId: String(tx.memberId),
      gameId: String(tx.gameId),
      playTimeHrs: String(tx.playTimeHrs),
      cost: String(tx.cost),
      transactionDate: formattedDate,
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchAll();
    } catch (err) {
      alert(
        "Delete failed: " +
          (err.response?.data?.message || err.message || err)
      );
    }
  }

  // --- Styles ---
  const tableStyle = { width: "100%", borderCollapse: "collapse" };
  const thStyle = {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "8px",
  };
  const tdStyle = { padding: "8px", textAlign: "center" };
  const inputStyle = {
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  };
  const buttonStyle = {
    padding: "6px 12px",
    margin: "4px 0",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 20 }}>
      <h2 style={{ color: "#007BFF" }}>Transactions</h2>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        style={{
          marginBottom: 20,
          maxWidth: 400,
          background: "#f9f9f9",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <label>Member:</label>
          <br />
          <select
            name="memberId"
            value={form.memberId}
            onChange={onChange}
            required
            style={inputStyle}
          >
            <option value="">Select member</option>
            {members.map((m) => (
              <option key={m.memberId} value={m.memberId}>
                {m.name} (ID:{m.memberId})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Game:</label>
          <br />
          <select
            name="gameId"
            value={form.gameId}
            onChange={onChange}
            required
            style={inputStyle}
          >
            <option value="">Select game</option>
            {games.map((g) => (
              <option key={g.gameId} value={g.gameId}>
                {g.gameName} (ID:{g.gameId})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Play Hours:</label>
          <br />
          <input
            type="number"
            name="playTimeHrs"
            value={form.playTimeHrs}
            onChange={onChange}
            step="0.1"
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Cost:</label>
          <br />
          <input
            type="number"
            name="cost"
            value={form.cost}
            onChange={onChange}
            step="0.01"
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Date & Time:</label>
          <br />
          <input
            type="datetime-local"
            name="transactionDate"
            value={form.transactionDate}
            onChange={onChange}
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          style={{
            ...buttonStyle,
            backgroundColor: "#28a745",
            color: "white",
          }}
        >
          {form.transactionId ? "Update" : "Add"} Transaction
        </button>

        {form.transactionId && (
          <button
            type="button"
            onClick={resetForm}
            style={{
              ...buttonStyle,
              backgroundColor: "#dc3545",
              color: "white",
              marginLeft: 8,
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={tableStyle} border="1" cellPadding="6">
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Member</th>
              <th style={thStyle}>Game</th>
              <th style={thStyle}>Play Hrs</th>
              <th style={thStyle}>Cost</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" style={tdStyle}>
                  No transactions
                </td>
              </tr>
            ) : (
              transactions.map((tx, index) => (
                <tr
                  key={tx.transactionId}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f1f1f1" : "white",
                  }}
                >
                  <td style={tdStyle}>{tx.transactionId}</td>
                  <td style={tdStyle}>
                    {members.find((m) => m.memberId === tx.memberId)?.name ??
                      tx.memberId}
                  </td>
                  <td style={tdStyle}>
                    {games.find((g) => g.gameId === tx.gameId)?.gameName ??
                      tx.gameId}
                  </td>
                  <td style={tdStyle}>{tx.playTimeHrs}</td>
                  <td style={tdStyle}>{tx.cost}</td>
                  <td style={tdStyle}>
                    {new Date(tx.transactionDate).toLocaleString()}
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleEdit(tx)}
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#ffc107",
                        color: "black",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tx.transactionId)}
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#dc3545",
                        color: "white",
                        marginLeft: 6,
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