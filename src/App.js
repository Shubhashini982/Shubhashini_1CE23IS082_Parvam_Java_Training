import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import MemberList from "./components/MemberList";
import MemberForm from "./components/MemberForm";
import GameList from "./components/GameList";
import GameForm from "./components/GameForm";
import RechargeForm from "./components/RechargeForm";
import TransactionList from "./components/TransactionList";
import DailyCollection from "./components/DailyCollection";

// ✅ Navigation bar with styled buttons
function Nav() {
  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "bold",
    textDecoration: "none",
    transition: "background 0.3s",
  };

  const navStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    borderBottom: "2px solid #eee",
    backgroundColor: "#f9f9f9",
  };

  const hoverStyle = {
    backgroundColor: "#0056b3",
  };

  return (
    <nav style={navStyle}>
      {[
        { to: "/", label: "Home" },
        { to: "/members", label: "Members" },
        { to: "/games", label: "Games" },
        { to: "/recharge", label: "Recharge" },
        { to: "/transactions", label: "Transactions" },
        { to: "/daily-collections", label: "Daily Collections" },
      ].map((link) => (
        <Link
          key={link.to}
          to={link.to}
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = hoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = buttonStyle.backgroundColor)
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

// ✅ Home Page with clickable dashboard cards
function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "👥 Manage Members",
      desc: "Add, edit, and view all club members easily.",
      path: "/members",
    },
    {
      title: "🎲 Game Records",
      desc: "Track and manage games efficiently.",
      path: "/games",
    },
    {
      title: "💰 Recharge & Transactions",
      desc: "View recharges and transaction histories.",
      path: "/transactions",
    },
    {
      title: "📅 Daily Collections",
      desc: "Monitor daily revenue and performance.",
      path: "/daily-collections",
    },
  ];

  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px 20px",
        background: "linear-gradient(135deg, #e0f7fa, #e1bee7)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h1
        style={{
          color: "#333",
          fontSize: "2.5rem",
          marginBottom: "10px",
        }}
      >
        🎮 Welcome to the Gaming Club Admin Panel
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#555",
          maxWidth: "700px",
          margin: "0 auto 30px auto",
        }}
      >
        Manage your club’s members, games, transactions, and collections — all
        from one sleek dashboard.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
              padding: "20px",
              width: "250px",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => navigate(card.path)}
          >
            <h3 style={{ color: "#007bff" }}>{card.title}</h3>
            <p style={{ color: "#555" }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ Main App component
export default function App() {
  return (
    <div
      style={{
        fontFamily: "Poppins, Arial, sans-serif",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <Nav />

      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/members/add" element={<MemberForm />} />
          <Route path="/members/edit/:id" element={<MemberForm />} />
          <Route path="/games" element={<GameList />} />
          <Route path="/games/add" element={<GameForm />} />
          <Route path="/games/edit/:id" element={<GameForm />} />
          <Route path="/recharge" element={<RechargeForm />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/daily-collections" element={<DailyCollection />} />
        </Routes>
      </div>
    </div>
  );
}