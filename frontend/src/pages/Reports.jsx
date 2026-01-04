import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API from "../api"; // Import API to fetch real data
import { 
  LayoutDashboard, FileText, BarChart2, Users, FileBarChart, Settings, 
  HelpCircle, MapPin, Mail, Download, PieChart as PieIcon, Activity
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function Reports() {
  const { user } = useContext(AuthContext);

  // State for Real Data
  const [stats, setStats] = useState({
    totalPetitions: 0,
    activePetitions: 0,
    closedPetitions: 0,
    totalPolls: 0,
    totalSignatures: 0
  });

  const [loading, setLoading] = useState(true);

  // --- FETCH REAL DATA ---
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // 1. Fetch Petitions
        const { data: petData } = await API.get('/petitions');
        const petitions = petData.petitions || petData || [];

        const active = petitions.filter(p => p.status === 'active').length;
        const closed = petitions.filter(p => p.status === 'closed' || p.status === 'resolved').length;
        const signatures = petitions.reduce((acc, curr) => acc + (curr.signatureCount || 0), 0);

        // 2. Fetch Polls (Mocking if API not ready, or real if ready)
        let pollsCount = 0;
        try {
            const { data: pollData } = await API.get('/polls');
            const polls = pollData.data || pollData || [];
            pollsCount = polls.length;
        } catch (e) {
            console.log("Polls API skipped");
        }

        setStats({
          totalPetitions: petitions.length,
          activePetitions: active,
          closedPetitions: closed,
          totalPolls: pollsCount,
          totalSignatures: signatures
        });
        setLoading(false);

      } catch (err) {
        console.error("Error fetching report data", err);
        setLoading(false);
      }
    };

    if (user) fetchReportData();
  }, [user]);

  // Data for the Pie Chart
  const petitionChartData = [
    { name: 'Active', value: stats.activePetitions },
    { name: 'Closed/Resolved', value: stats.closedPetitions },
  ];
  
  // Colors: Bright Blue & Purple for Dark Theme
  const COLORS = ['#3b82f6', '#a855f7']; 

  return (
    <div style={styles.container}>
      
      {/* --- SIDEBAR --- */}
      <div style={styles.sidebar}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.bigAvatar}>{user?.name?.charAt(0).toUpperCase() || "U"}</div>
            <div>
                <h3 style={{margin: 0, fontSize: "1rem", color: 'white'}}>{user?.name || "User"}</h3>
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
        <div style={styles.headerRow}>
            <div>
                <h1 style={styles.pageTitle}>Reports & Analytics</h1>
                <p style={styles.pageSubtitle}>
                    Track civic engagement and measure impact.
                </p>
            </div>
            <button style={styles.exportBtn}>
                <Download size={16} /> Export CSV
            </button>
        </div>

        {/* 3 Stats Cards Row */}
        <div style={styles.statsRow}>
           <StatCard 
              title="Total Petitions" 
              value={stats.totalPetitions} 
              icon={<FileText size={24} color="#60a5fa"/>} 
           />
           <StatCard 
              title="Total Polls" 
              value={stats.totalPolls} 
              icon={<PieIcon size={24} color="#f472b6"/>} 
           />
           <StatCard 
              title="Total Signatures" 
              value={stats.totalSignatures} 
              icon={<Activity size={24} color="#4ade80"/>} 
           />
        </div>

        {/* Charts Row */}
        <div style={styles.chartsRow}>
            
            {/* Chart 1: Petitions Status */}
            <div style={styles.chartBox}>
                <h3 style={styles.chartTitle}>Petition Status Breakdown</h3>
                <div style={{width: "100%", height: "250px"}}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={petitionChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {petitionChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{backgroundColor: '#1e1b4b', border: 'none', borderRadius: '8px', color: '#fff'}}
                                itemStyle={{color: '#fff'}}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Placeholder for Second Chart (e.g., Monthly Activity) */}
            <div style={styles.chartBox}>
                <h3 style={styles.chartTitle}>Engagement Summary</h3>
                <div style={styles.summaryText}>
                    <p><strong>{stats.activePetitions}</strong> active petitions are currently gathering signatures.</p>
                    <p><strong>{stats.totalSignatures}</strong> citizens have engaged with causes in your area.</p>
                    <p style={{marginTop: '20px', fontSize: '0.9rem', color: '#cbd5f5'}}>
                        * More detailed analytics will appear here as more data is collected over time.
                    </p>
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
        display: "flex", 
        alignItems: "center", 
        gap: "10px", 
        padding: "12px", 
        color: active ? "white" : "#cbd5f5", 
        backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
        borderRadius: "8px",
        fontWeight: active ? "600" : "normal",
        transition: "all 0.2s"
    }}>
      {icon} <span>{text}</span>
    </div>
  </Link>
);

const StatCard = ({ title, value, icon }) => (
    <div style={styles.statCard}>
        <div style={styles.iconCircle}>
            {icon}
        </div>
        <div>
            <h2 style={styles.statValue}>{value}</h2>
            <p style={styles.statTitle}>{title}</p>
        </div>
    </div>
);

// --- STYLES ---
const styles = {
  container: { 
    display: "flex", 
    minHeight: "100vh", 
    background: "radial-gradient(circle at top, #2a0a4a, #120020)", // Purple Theme
    padding: "20px", 
    gap: "30px", 
    fontFamily: "Inter, sans-serif",
    color: "white"
  },
  
  sidebar: { width: "260px", display: "flex", flexDirection: "column", gap: "20px" },
  
  profileCard: { 
    backgroundColor: "#1e1b4b", 
    borderRadius: "14px", 
    padding: "16px",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  

  profileHeader: { display: "flex", alignItems: "center", gap: "15px" },
  
  bigAvatar: { 
    width: "48px", height: "48px", borderRadius: "50%", 
    backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", 
    fontWeight: "bold", fontSize: "1.2rem", color: "white"
  },
  
  profileRow: { display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", marginTop: "4px", color: "#cbd5f5" },
  
  menu: { 
    backgroundColor: "#1e1b4b", borderRadius: "14px", padding: "20px", flex: 1, border: "1px solid rgba(255,255,255,0.1)"
  },
  
  main: { flex: 1, display: "flex", flexDirection: "column", gap: "30px", paddingTop: "10px" },
  
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  
  pageTitle: { fontSize: "1.8rem", fontWeight: "700", margin: 0 },
  pageSubtitle: { margin: "5px 0 0 0", color: "#cbd5f5" },
  
  exportBtn: {
      backgroundColor: "#2563eb", color: "white", border: "none", padding: "10px 18px", 
      borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600",
      transition: "background 0.2s"
  },
  
  statsRow: { display: "flex", gap: "20px" },
  
  statCard: {
      flex: 1, 
      backgroundColor: "rgba(255,255,255,0.05)", // Glassmorphism
      padding: "24px", 
      borderRadius: "16px", 
      display: "flex",
      alignItems: "center",
      gap: "20px",
      border: "1px solid rgba(255,255,255,0.1)"
  },
  
  iconCircle: {
      width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  
  statValue: { margin: 0, fontSize: "2rem", fontWeight: "700" },
  statTitle: { margin: "5px 0 0 0", color: "#cbd5f5", fontSize: "0.9rem" },

  chartsRow: { display: "flex", gap: "20px", marginTop: "10px" },
  
  chartBox: {
      flex: 1, 
      backgroundColor: "rgba(255,255,255,0.05)", // Glassmorphism
      padding: "24px", 
      borderRadius: "16px", 
      minHeight: "300px",
      border: "1px solid rgba(255,255,255,0.1)"
  },
  
  chartTitle: { margin: "0 0 20px 0", fontSize: "1.1rem", fontWeight: "600" },
  
  summaryText: {
      color: "#e2e8f0", lineHeight: "1.6", fontSize: "1rem"
  }
};