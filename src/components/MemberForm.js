// Import React and hooks: useState (to store form values), useEffect (to fetch existing data if editing)
import React, { useEffect, useState } from "react";

// Import axios instance for API calls
import api from "../api";

// Import useNavigate (to redirect after save) and useParams (to read :id from URL)
import { useNavigate, useParams } from "react-router-dom";

// Main component for MemberForm
export default function MemberForm() {
  // Extract "id" from URL (e.g., /members/edit/5 → id=5)
  const { id } = useParams(); // If id exists, we are editing; if not, we are adding

  // Hook for programmatic navigation
  const nav = useNavigate();

  // State to store form fields (initial empty values for adding)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "ACTIVE" // Default status
  });

  // State to track whether API request is ongoing
  const [loading, setLoading] = useState(false);

  // If "id" is present → load existing member data when component loads
  useEffect(() => {
    if (id) loadMember(id);
  }, [id]);

  // Function to fetch member data for editing
  async function loadMember(id) {
    try {
      // GET request to backend: /members/{id}
      const res = await api.get(`/members/${id}`);
      const m = res.data?.data;
      if (m) {
        // Fill form state with existing member data
        setForm({
          name: m.name || "",
          email: m.email || "",
          phone: m.phone || "",
          status: m.status || "ACTIVE"
        });
      }
    } catch (err) {
      alert("Failed to load member: " + (err.message || err));
    }
  }

  // Generic input change handler
  // Updates the "form" state when user types in input fields
  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value })); // Update only the changed field
  }

  // Function called when form is submitted
  async function onSubmit(e) {
    e.preventDefault(); // Prevent page refresh
    setLoading(true); // Start loading
    try {
      if (id) {
        // If id exists → Update existing member
        await api.put(`/members/${id}`, form);
        alert("Member updated");
      } else {
        // Otherwise → Create new member
        await api.post("/members", form);
        alert("Member created");
      }
      // After saving → go back to members list
      nav("/members");
    } catch (err) {
      // Show error from backend (if available)
      alert("Save failed: " + (err.response?.data?.message || err.message || err));
    } finally {
      setLoading(false); // Stop loading
    }
  }

  // UI returned (form fields + buttons)
  return (
    <div>
      {/* Heading changes depending on add vs edit */}
      <h2>{id ? "Edit Member" : "Add Member"}</h2>

      {/* Form submission handled by onSubmit */}
      <form onSubmit={onSubmit}>

        {/* Name input field */}
        <div style={{ marginBottom: 8 }}>
          <label>Name</label><br />
          <input name="name" value={form.name} onChange={onChange} required />
        </div>

        {/* Email input field */}
        <div style={{ marginBottom: 8 }}>
          <label>Email</label><br />
          <input name="email" value={form.email} onChange={onChange} type="email" />
        </div>

        {/* Phone input field */}
        <div style={{ marginBottom: 8 }}>
          <label>Phone</label><br />
          <input name="phone" value={form.phone} onChange={onChange} />
        </div>

        {/* Status dropdown */}
        <div style={{ marginBottom: 8 }}>
          <label>Status</label><br />
          <select name="status" value={form.status} onChange={onChange}>
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </select>
        </div>

        {/* Save button → disabled while loading */}
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>

        {/* Cancel button → navigate back without saving */}
        <button type="button" onClick={() => nav("/members")} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      </form>
    </div>
  );
}