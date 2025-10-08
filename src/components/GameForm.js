// src/components/GameForm.js

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGameById, createGame, updateGame } from "../api";

export default function GameForm() {
  const { id } = useParams();  // Read game ID from URL
  const nav = useNavigate();

  const [form, setForm] = useState({
    gameName: "",
    costPerHour: "",
    status: "AVAILABLE",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) loadGame(id);
  }, [id]);

  async function loadGame(id) {
    try {
      const res = await getGameById(id);
      const g = res.data?.data;
      if (g) {
        setForm({
          gameName: g.gameName || "",
          costPerHour: g.costPerHour ?? "",
          status: g.status || "AVAILABLE",
        });
      }
    } catch (err) {
      alert("Load game failed: " + (err.message || err));
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateGame(id, form);
        alert("Game updated");
      } else {
        await createGame(form);
        alert("Game created");
      }
      nav("/games");
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>{id ? "Edit Game" : "Add Game"}</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Game Name</label><br />
          <input name="gameName" value={form.gameName} onChange={onChange} required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Cost per hour</label><br />
          <input
            name="costPerHour"
            value={form.costPerHour}
            onChange={onChange}
            type="number"
            step="0.01"
            required
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Status</label><br />
          <select name="status" value={form.status} onChange={onChange}>
            <option>AVAILABLE</option>
            <option>UNAVAILABLE</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={() => nav("/games")} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      </form>
    </div>
  );
}