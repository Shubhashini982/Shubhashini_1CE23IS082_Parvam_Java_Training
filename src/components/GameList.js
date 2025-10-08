// src/components/GameList.js

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGames, deleteGame } from "../api"; // use named helpers

export default function GameList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => { fetchGames(); }, []);

  async function fetchGames() {
    setLoading(true);
    try {
      const res = await getGames();
      setGames(res.data?.data || []);
    } catch (err) {
      alert("Error fetching games: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this game?")) return;
    try {
      await deleteGame(id);
      fetchGames();
    } catch (err) {
      alert("Delete failed: " + (err.message || err));
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎮 Game Management</h2>

      <div style={{ marginBottom: 16 }}>
        <Link to="/games/add" style={styles.addButton}>+ Add Game</Link>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th>ID</th>
              <th>Name</th>
              <th>Cost/Hour</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>No games found</td>
              </tr>
            ) : (
              games.map((g) => (
                <tr key={g.gameId} style={styles.tableRow}>
                  <td>{g.gameId}</td>
                  <td>{g.gameName}</td>
                  <td>₹{g.costPerHour}</td>
                  <td style={{ color: g.status === "Available" ? "green" : "red" }}>
                    {g.status}
                  </td>
                  <td>
                    <button
                      onClick={() => nav(`/games/edit/${g.gameId}`)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(g.gameId)}
                      style={styles.deleteButton}
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

// 🎨 Styling
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#1e3a8a",
    marginBottom: "20px",
  },
  addButton: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  tableHeader: {
    backgroundColor: "#1e40af",
    color: "white",
    textAlign: "left",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  editButton: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "8px",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  noData: {
    textAlign: "center",
    padding: "12px",
    color: "#6b7280",
  },
};