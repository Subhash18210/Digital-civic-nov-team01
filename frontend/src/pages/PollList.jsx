import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Users,
  FileBarChart,
  Settings,
  HelpCircle,
  MapPin,
  Mail,
} from "lucide-react";

export default function PollList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const role = user?.role?.toUpperCase(); // ✅ ROLE NORMALIZATION

  const [activeTab, setActiveTab] = useState("Active Polls");
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH POLLS (SAFE) ---------------- */
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    setTimeout(() => {
      setPolls([
        {
          id: "1",
          title: "Should plastic bags be banned?",
          location: user.location || "Your Area",
          totalVotes: 142,
          status: "ACTIVE",
          createdBy: "ADMIN",
        },
        {
          id: "2",
          title: "Which emergency service needs improvement?",
          location: user.location || "Your Area",
          totalVotes: 89,
          status: "ACTIVE",
          createdBy: "OFFICIAL",
        },
        {
          id: "3",
          title: "Priority for city cleanliness?",
          location: user.location || "Your Area",
          totalVotes: 56,
          status: "CLOSED",
          createdBy: user.email,
        },
      ]);

      setLoading(false);
    }, 900);
  }, [user]);

  /* ---------------- FILTER POLLS ---------------- */
  const filteredPolls = polls.filter((poll) => {
    switch (activeTab) {
      case "Active Polls":
        return poll.status === "ACTIVE";
      case "Closed Polls":
        return poll.status === "CLOSED";
      case "My Polls":
        return poll.createdBy === user?.email;
      default:
        return true;
    }
  });

  return (
    <div style={styles.container}>
      {/* ---------------- SIDEBAR ---------------- */}
      <div style={styles.sidebar}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.bigAvatar}>
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{user?.name || "User"}</h3>
              <div style={styles.profileRow}>
                <MapPin size={14} /> {user?.location || "Not specified"}
              </div>
              <div style={styles.profileRow}>
                <Mail size={14} /> {user?.email || "email"}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.menu}>
          <NavItem icon={<LayoutDashboard size={18} />} text="Dashboard" to="/dashboard" />
          <NavItem icon={<FileText size={18} />} text="Petitions" to="/petitions" />
          <NavItem icon={<BarChart2 size={18} />} text="Polls" active />
          <NavItem icon={<Users size={18} />} text="Officials" />
          <NavItem icon={<FileBarChart size={18} />} text="Reports" to="/reports" />
          <NavItem icon={<Settings size={18} />} text="Settings" />
          <div style={{ marginTop: "20px" }}>
            <NavItem icon={<HelpCircle size={18} />} text="Help & Support" />
          </div>
        </div>
      </div>

      {/* ---------------- MAIN ---------------- */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.pageTitle}>Polls</h1>
            <p style={styles.pageSubtitle}>
              Polls in {user?.location || "your area"}
            </p>
          </div>

          {/* ✅ CREATE POLL — OFFICIAL & ADMIN ONLY */}
          {(role === "OFFICIAL" || role === "ADMIN") && (
            <Link to="/create-poll" style={styles.createBtn}>
              + Create Poll
            </Link>
          )}
        </div>

        {/* Polls Container */}
        <div style={styles.pollsContainer}>
          {/* Tabs */}
          <div style={styles.tabsRow}>
            {["Active Polls", "My Polls", "Closed Polls"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tabBtn,
                  backgroundColor: activeTab === tab ? "#2563eb" : "transparent",
                  color: activeTab === tab ? "white" : "#cbd5f5",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={styles.contentArea}>
            {loading ? (
              <div style={styles.loader}>Loading polls…</div>
            ) : filteredPolls.length === 0 ? (
              <div style={styles.emptyState}>
                <h3>No polls available</h3>
                <p>Create a poll to start community engagement.</p>
              </div>
            ) : (
              <div style={styles.pollList}>
                {filteredPolls.map((poll) => (
                  <div
                    key={poll.id}
                    style={styles.pollCard}
                    onClick={() => navigate(`/polls/${poll.id}`)}
                  >
                    <div>
                      <h3 style={styles.pollTitle}>{poll.title}</h3>
                      <p style={styles.pollLocation}>📍 {poll.location}</p>
                    </div>

                    <div style={styles.voteBox}>
                      <span style={styles.voteCount}>{poll.totalVotes}</span>
                      <span style={styles.voteLabel}>Votes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- NAV ITEM ---------------- */
const NavItem = ({ icon, text, active, to }) => (
  <Link to={to || "#"} style={{ textDecoration: "none", color: "inherit" }}>
    <div style={{ display: "flex", gap: "10px", padding: "10px", opacity: active ? 1 : 0.85 }}>
      {icon} <span>{text}</span>
    </div>
  </Link>
);

/* ---------------- STYLES ---------------- */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    padding: "20px",
    gap: "30px",
    background: "radial-gradient(circle at top, #2a0a4a, #120020)",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },

  sidebar: { width: "260px", display: "flex", flexDirection: "column", gap: "20px" },

  profileCard: {
    backgroundColor: "#1e1b4b",
    borderRadius: "14px",
    padding: "16px",
  },

  profileHeader: { display: "flex", gap: "15px", alignItems: "center" },

  bigAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  profileRow: {
    fontSize: "0.8rem",
    color: "#cbd5f5",
    marginTop: "4px",
    display: "flex",
    gap: "5px",
  },

  menu: {
    backgroundColor: "#1e1b4b",
    borderRadius: "14px",
    padding: "20px",
    flex: 1,
  },

  main: { flex: 1, display: "flex", flexDirection: "column", gap: "20px" },

  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },

  pageTitle: { fontSize: "2rem", margin: 0 },

  pageSubtitle: { margin: "5px 0 0", color: "#cbd5f5" },

  createBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 28px",
    borderRadius: "8px",
    fontWeight: "600",
    textDecoration: "none",
  },

  pollsContainer: {
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "12px",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  tabsRow: {
    display: "flex",
    gap: "10px",
    padding: "6px",
    borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  tabBtn: {
    border: "none",
    padding: "8px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    background: "transparent",
  },

  contentArea: { padding: "25px" },

  pollList: { display: "flex", flexDirection: "column", gap: "14px" },

  pollCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    color: "#111827",
    padding: "18px 22px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },

  pollTitle: { margin: 0, fontSize: "1.05rem", fontWeight: "600" },

  pollLocation: { margin: "6px 0 0", fontSize: "0.85rem", color: "#6b7280" },

  voteBox: {
    backgroundColor: "#eef2ff",
    padding: "10px 14px",
    borderRadius: "10px",
    textAlign: "center",
    minWidth: "70px",
  },

  voteCount: { fontSize: "1.2rem", fontWeight: "700", color: "#1d4ed8" },

  voteLabel: { fontSize: "0.75rem", color: "#4b5563" },

  emptyState: { textAlign: "center", padding: "60px", color: "#cbd5f5" },

  loader: { textAlign: "center", padding: "40px", opacity: 0.8 },
};
