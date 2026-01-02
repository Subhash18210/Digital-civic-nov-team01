import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { 
  LayoutDashboard, FileText, BarChart2, Users, FileBarChart, Settings, 
  HelpCircle, MapPin, Mail, Download 
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// --- THE FIX IS IN THIS LINE BELOW ---
export default function Reports() {
  const { user } = useContext(AuthContext);

  // Stats Data
  const stats = {
    petitions: 3,
    polls: 0,
    engagement: 3
  };

  // Data for the Pie Chart
  const petitionData = [
    { name: 'Active', value: 2 },
    { name: 'Closed', value: 1 },
  ];
  const COLORS = ['#a855f7', '#e0e7ff']; // Purple and Light Blue

  return (
    <div style={styles.container}>
      
      {/* --- SIDEBAR --- */}
      <div style={styles.sidebar}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.bigAvatar}>{user?.name?.charAt(0).toUpperCase() || "U"}</div>
            <div>
                <h3 style={{margin: 0, fontSize: "1.1rem"}}>{user?.name || "Name"}</h3>
                <div style={styles.profileRow}><MapPin size={14} /> {user?.location || "Location"}</div>
                <div style={styles.profileRow}><Mail size={14} /> {user?.email || "Email"}</div>
            </div>
          </div>
        </div>

        <div style={styles.menu}>
          <NavItem icon={<LayoutDashboard size={18}/>} text="Dashboard" to="/dashboard" />
          <NavItem icon={<FileText size={18}/>} text="Petitions" to="/petitions" />
          <NavItem icon={<BarChart2 size={18}/>} text="Polls" to="/polls" />
          <NavItem icon={<Users size={18}/>} text="Officials" />
          <NavItem icon={<FileBarChart size={18}/>} text="Reports" active />
          <NavItem icon={<Settings size={18}/>} text="Settings" />
          <div style={{marginTop: "20px"}}>
             <NavItem icon={<HelpCircle size={18}/>} text="Help & Support" />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={styles.main}>
        
      
        {/* Page Title & Export Button */}
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px"}}>
            <div>
                <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: 0 }}>Reports & Analytics</h1>
                <p style={{margin: "5px 0 0 0", color: "#555", fontStyle: "italic"}}>
                    Track the civic Engagement & Measure the impact of petitions and polls
                </p>
            </div>
            <button style={styles.exportBtn}>
                <Download size={16} /> Export Data
            </button>
        </div>

        {/* 3 Stats Cards Row */}
        <div style={styles.statsRow}>
           <StatCard title="Total Petitions" value={stats.petitions} />
           <StatCard title="Total Polls" value={stats.polls} />
           <StatCard title="Activity Engagement" value={stats.engagement} />
        </div>

        {/* Charts Row */}
        <div style={styles.chartsRow}>
            
            {/* Chart 1: Petitions Status */}
            <div style={styles.chartBox}>
                <h3 style={styles.chartTitle}>Petitions Status Breakdown</h3>
                <div style={{width: "100%", height: "200px"}}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={petitionData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                            >
                                {petitionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

// Helper Components
const NavItem = ({ icon, text, active, to }) => (
  <Link to={to || "#"} style={{ textDecoration: "none", color: "inherit" }}>
    <div style={{
      display: "flex", alignItems: "center", gap: "10px", padding: "10px",
      color: active ? "#000080" : "#333", fontWeight: active ? "bold" : "normal"
    }}>
      {icon} <span>{text}</span>
    </div>
  </Link>
);

const StatCard = ({ title, value }) => (
    <div style={styles.statCard}>
        <p style={{margin: "0 0 10px 0", color: "#555"}}>{title}</p>
        <h2 style={{margin: 0, fontSize: "2rem"}}>{value}</h2>
    </div>
);

// --- STYLES ---
const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "white", padding: "20px", gap: "30px", fontFamily: "sans-serif" },
  sidebar: { width: "250px", display: "flex", flexDirection: "column", gap: "20px" },
  profileCard: { backgroundColor: "#bfdbfe", border: "2px solid #3b82f6", borderRadius: "10px", padding: "15px" },
  profileHeader: { display: "flex", alignItems: "center", gap: "15px" },
  bigAvatar: { width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem" },
  profileRow: { display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", marginTop: "3px", color: "#333" },
  menu: { backgroundColor: "#bfdbfe", borderRadius: "10px", padding: "20px", flex: 1 },
  main: { flex: 1, display: "flex", flexDirection: "column", gap: "30px" },
  topHeader: { display: "flex", marginBottom: "10px" },
  topLinks: { display: "flex", gap: "30px" },
  topLink: { textDecoration: "none", color: "#9333ea", fontWeight: "800", fontSize: "1rem", textTransform: "uppercase" },
  exportBtn: {
      backgroundColor: "#60a5fa", color: "white", border: "none", padding: "8px 15px", 
      borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontWeight: "bold"
  },
  statsRow: { display: "flex", gap: "20px" },
  statCard: {
      flex: 1, backgroundColor: "#bfdbfe", padding: "20px", borderRadius: "5px", textAlign: "center"
  },
  chartsRow: { display: "flex", gap: "20px", marginTop: "20px" },
  chartBox: {
      flex: 1, backgroundColor: "#bfdbfe", padding: "20px", borderRadius: "5px", minHeight: "300px"
  },
  chartTitle: { margin: "0 0 20px 0", fontSize: "1.1rem" }
};