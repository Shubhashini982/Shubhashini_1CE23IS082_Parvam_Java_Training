// Import React and hooks for state and lifecycle management
import React, { useEffect, useState } from "react";
// Import the API utility to make HTTP requests
import api from "../api";

// Functional component to display daily collections
export default function DailyCollection() {
  const [collections, setCollections] = useState([]);
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  async function fetchCollections() {
    try {
      const res = await api.get("/daily-collections");
      setCollections(res.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch daily collections");
    }
  }

  async function fetchByDate() {
    if (!date) return;
    try {
      const res = await api.get(`/daily-collections/${date}`);
      setSelected(res.data?.data || null);
    } catch (err) {
      alert("No data for date or error: " + (err.message || err));
      setSelected(null);
    }
  }

  // Custom styles
  const styles = {
    container: {
      backgroundColor: "#f9fafc",
      padding: "20px",
      borderRadius: "12px",
      maxWidth: "800px",
      margin: "40px auto",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      color: "#2a4365",
      textAlign: "center",
      marginBottom: "20px",
    },
    inputSection: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "20px",
      gap: "10px",
    },
    input: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    button: {
      padding: "8px 14px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#3182ce",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    },
    buttonHover: {
      backgroundColor: "#2b6cb0",
    },
    selectedBox: {
      backgroundColor: "#ebf8ff",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "20px",
      border: "1px solid #bee3f8",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      backgroundColor: "#2b6cb0",
      color: "white",
      padding: "10px",
      textAlign: "left",
    },
    td: {
      padding: "8px",
      borderBottom: "1px solid #ddd",
    },
    trHover: {
      backgroundColor: "#ebf8ff",
    },
    noData: {
      textAlign: "center",
      color: "#718096",
      padding: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>💰 Daily Collections</h2>

      {/* Input for selecting date and a button to fetch collection for that date */}
      <div style={styles.inputSection}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchByDate} style={styles.button}>
          Get by Date
        </button>
      </div>

      {/* Display selected collection details if a date is selected */}
      {selected ? (
        <div style={styles.selectedBox}>
          <h3>📅 Collection for {selected.collectionDate}</h3>
          <p>💵 <b>Total recharges:</b> {selected.totalRecharges}</p>
          <p>💸 <b>Total spent:</b> {selected.totalSpent}</p>
          <p>📈 <b>Net collection:</b> {selected.netCollection}</p>
        </div>
      ) : null}

      {/* Display all daily collections in a table */}
      <h3 style={{ color: "#2a4365", marginBottom: "10px" }}>📊 All Daily Collections</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Total Recharges</th>
            <th style={styles.th}>Total Spent</th>
            <th style={styles.th}>Net</th>
          </tr>
        </thead>
        <tbody>
          {collections.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No records found
              </td>
            </tr>
          ) : (
            collections.map((c, i) => (
              <tr
                key={c.collectionId}
                style={{
                  backgroundColor: i % 2 === 0 ? "#f7fafc" : "#edf2f7",
                  transition: "0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#bee3f8")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    i % 2 === 0 ? "#f7fafc" : "#edf2f7")
                }
              >
                <td style={styles.td}>{c.collectionDate}</td>
                <td style={styles.td}>{c.totalRecharges}</td>
                <td style={styles.td}>{c.totalSpent}</td>
                <td style={styles.td}>{c.netCollection}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}