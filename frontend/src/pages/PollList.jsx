import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API from "../api"; // <--- 1. Import API Helper
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

  // Normalize role (Backend usually sends lowercase 'official'/'admin')
  const role = user?.role?.toLowerCase(); 

  const [activeTab, setActiveTab] = useState("Active Polls");
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH POLLS (REAL) ---------------- */
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        // API.get('/polls') automatically uses the logged-in user's location
        // based on the backend logic we wrote earlier.
        const { data } = await API.get('/polls');
        
        // Backend returns: { success: true, count: 5, data: [...] } OR just [...] 
        // depending on your controller. Our controller returns { ..., data: [] }
        setPolls(data.data || data || []); 
      } catch (err) {
        console.error("Failed to fetch polls:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPolls();
  }, [user]);

  /* ---------------- FILTER POLLS ---------------- */
  const filteredPolls = polls.filter((poll) => {
    // Note: Backend 'status' might not exist yet if not in Schema, 
    // assuming 'createdAt' logic or adding a status field later.
    // For now, we assume all fetched polls are "Active" unless we add logic.
    
    // Check if the poll is closed (mock logic or real field if you added it)
    // Since our backend doesn't explicitly have 'status' field in Model yet,
    // we will treat everything as ACTIVE for now.
    const isClosed = false; 

    switch (activeTab) {
      case "Active Polls":
        return !isClosed;
      case "Closed Polls":
        return isClosed;
      case "My Polls":
        // Check if creator ID matches logged-in User ID
        // Backend populates createdBy, so we check ._id
        return (poll.createdBy?._id === user?._id) || (poll.createdBy === user?._id);
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
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>{user?.name || "User"}</h3>
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
          {(role === "official" || role === "admin") && (
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
                <h3>No polls found</h3>
                <p>There are no polls in this category for your location.</p>
              </div>
            ) : (
              <div style={styles.pollList}>
                {filteredPolls.map((poll) => (
                  <div
                    key={poll._id} // MongoDB uses _id
                    style={styles.pollCard}
                    onClick={() => navigate(`/polls/${poll._id}`)}
                  >
                    <div>
                      <h3 style={styles.pollTitle}>{poll.title}</h3>
                      <p style={styles.pollLocation}>📍 {poll.targetLocation}</p>
                      <small style={{color: '#6b7280'}}>
                        Created by: {poll.createdBy?.name || "Official"}
                      </small>
                    </div>

                    <div style={styles.voteBox}>
                      {/* Backend usually doesn't send totalVotes on list view unless we aggregated it.
                          If your backend 'getPolls' doesn't include totalVotes, this might show 0.
                          We can fix the backend later if needed, but for now 0 is safe. */}
                      <span style={styles.voteCount}>{poll.totalVotes || 0}</span>
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