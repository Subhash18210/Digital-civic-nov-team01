import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API from "../api";
import { 
  LayoutDashboard, FileText, BarChart2, Users, FileBarChart, Settings, 
  HelpCircle, MapPin, Mail, AlertCircle, CheckCircle, Clock 
} from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for Stats
  const [stats, setStats] = useState({
    myPetitions: 0,
    successfulPetitions: 0,
    pollsCreated: 0,
    // Official Specific Stats
    totalJurisdiction: 0,
    activeJurisdiction: 0,
    closedJurisdiction: 0
  });

  const [recentPetitions, setRecentPetitions] = useState([]);
  const categories = ["Environment", "Infrastructure", "Education", "Public safety", "Health", "Others"];

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // 1. Fetch Petitions
        const { data } = await API.get('/petitions');
        const allPetitions = data.petitions || data || [];

        // --- CITIZEN LOGIC ---
        if (user.role === 'citizen') {
            const myCount = allPetitions.filter(p => 
                (p.creator?._id === user?._id) || (p.creator === user?._id)
            ).length;
            const successCount = allPetitions.filter(p => p.status === 'closed').length;
            
            // Polls count (mock or real)
            let pollsCount = 0;
            try {
                const pollRes = await API.get('/polls');
                const allPolls = pollRes.data.data || pollRes.data || [];
                pollsCount = allPolls.filter(p => p.createdBy === user._id).length;
            } catch (e) {}

            setStats({ myPetitions: myCount, successfulPetitions: successCount, pollsCreated: pollsCount });
        } 
        
        // --- OFFICIAL LOGIC ---
        else if (user.role === 'official') {
            // Filter by Official's Location (Simple string match)
            const jurisdictionPetitions = allPetitions.filter(p => 
                p.location?.toLowerCase().includes(user.location?.toLowerCase())
            );

            setStats({
                totalJurisdiction: jurisdictionPetitions.length,
                activeJurisdiction: jurisdictionPetitions.filter(p => p.status === 'active').length,
                closedJurisdiction: jurisdictionPetitions.filter(p => p.status === 'closed').length
            });

            // Show top 5 recent petitions for quick access
            setRecentPetitions(jurisdictionPetitions.slice(0, 5));
        }

      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };
    
    fetchData();
  }, [user]);

  // --- NAVIGATION HANDLERS ---
  const handleCategoryClick = (category) => navigate(`/petitions?category=${category}`);
  
  const handleStatClick = (type) => {
    if (type === 'mine') navigate('/petitions'); 
    else if (type === 'jurisdiction') navigate(`/petitions?location=${user.location}`);
    else if (type === 'polls') navigate('/polls');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar (Same for both) */}
      <div style={styles.sidebar}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.bigAvatar}>{user?.name?.charAt(0).toUpperCase() || "U"}</div>
            <div>
                <h3 style={{margin: 0, fontSize: "1rem", color: 'white'}}>{user?.name || "User"}</h3>
                <div style={styles.profileRow}><MapPin size={14} /> {user?.location || "Location"}</div>
                <div style={styles.profileRow}><Mail size={14} /> {user?.email || "Email"}</div>
                <div style={styles.roleBadge}>{user?.role?.toUpperCase()}</div>
            </div>
          </div>
        </div>
        <div style={styles.menu}>
          <NavItem icon={<LayoutDashboard size={18}/>} text="Dashboard" active />
          <NavItem icon={<FileText size={18}/>} text="Petitions" to="/petitions" />
          <NavItem icon={<BarChart2 size={18}/>} text="Polls" to="/polls" />
          <NavItem icon={<FileBarChart size={18}/>} text="Reports" to="/reports" />
          <div style={{marginTop: "auto"}}>
             <NavItem icon={<HelpCircle size={18}/>} text="Help & Support" />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={styles.main}>
        
        <div style={styles.banner}>
           <h2 style={{margin: 0, fontSize: '1.8rem'}}>
             {user?.role === 'official' ? 'Governance Overview' : `Welcome Back, ${user?.name}`}
           </h2>
           <p style={{margin: '5px 0 0', color: '#cbd5f5'}}>
             {user?.role === 'official' 
               ? `Monitoring active issues in ${user?.location}` 
               : 'Here is what\'s happening in your community today.'}
           </p>
        </div>

        {/* --- CONDITIONAL RENDERING BASED ON ROLE --- */}
        
        {user?.role === 'official' ? (
            /* [OFFICIAL VIEW] */
            <>
                {/* 1. Governance Stats */}
                <div style={styles.statsGrid}>
                   <StatCard 
                      number={stats.totalJurisdiction} 
                      label="Total Petitions" 
                      icon={<FileText size={24} color="#60a5fa"/>}
                      onClick={() => handleStatClick('jurisdiction')}
                   />
                   <StatCard 
                      number={stats.activeJurisdiction} 
                      label="Active Issues" 
                      icon={<AlertCircle size={24} color="#f87171"/>} 
                   />
                   <StatCard 
                      number={stats.closedJurisdiction} 
                      label="Resolved" 
                      icon={<CheckCircle size={24} color="#4ade80"/>} 
                   />
                </div>

                {/* 2. Priority Inbox (Recent Petitions) */}
                <h3 style={{color: 'white', marginTop: '30px'}}>Priority Inbox ({user.location})</h3>
                <div style={styles.listContainer}>
                    {recentPetitions.length > 0 ? (
                        recentPetitions.map(p => (
                            <div key={p._id} style={styles.listItem} onClick={() => navigate(`/petitions/${p._id}`)}>
                                <div>
                                    <h4 style={{margin: '0 0 5px 0', color: 'white'}}>{p.title}</h4>
                                    <span style={{fontSize: '0.85rem', color: '#94a3b8'}}>{p.category} • {new Date(p.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                    <span style={{color: '#cbd5f5', fontSize: '0.9rem'}}>✍️ {p.signatureCount}</span>
                                    <span style={{
                                        ...styles.statusBadge, 
                                        backgroundColor: p.status === 'active' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(74, 222, 128, 0.2)',
                                        color: p.status === 'active' ? '#f87171' : '#4ade80'
                                    }}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{color: '#cbd5f5', padding: '20px', textAlign: 'center'}}>No petitions found in your jurisdiction.</p>
                    )}
                </div>
            </>
        ) : (
            /* [CITIZEN VIEW] */
            <>
                <div style={styles.statsGrid}>
                   <StatCard 
                      number={stats.myPetitions} 
                      label="My Petitions" 
                      icon={<FileText size={24} color="#60a5fa"/>}
                      onClick={() => handleStatClick('mine')}
                   />
                   <StatCard 
                      number={stats.successfulPetitions} 
                      label="Successful" 
                      icon={<CheckCircle size={24} color="#4ade80"/>} 
                      onClick={() => handleStatClick('successful')}
                   />
                   <StatCard 
                      number={stats.pollsCreated} 
                      label="My Polls" 
                      icon={<BarChart2 size={24} color="#f472b6"/>} 
                      onClick={() => handleStatClick('polls')}
                   />
                </div>

                <h3 style={{color: 'white', marginBottom: '10px', marginTop: '30px'}}>Browse by Category</h3>
                <div style={styles.categoryGrid}>
                   {categories.map((cat, index) => (
                     <button key={index} style={styles.oval} onClick={() => handleCategoryClick(cat)}>
                       {cat}
                     </button>
                   ))}
                </div>
            </>
        )}

      </div>
    </div>
  );
}

// --- SUBCOMPONENTS ---
const StatCard = ({ number, label, icon, onClick }) => (
    <div style={styles.statCard} onClick={onClick}>
        <div style={styles.iconCircle}>{icon}</div>
        <h3 style={styles.statNumber}>{number}</h3>
        <span style={styles.statLabel}>{label}</span>
    </div>
);

const NavItem = ({ icon, text, active, to }) => (
  <Link to={to || "#"} style={{ textDecoration: "none", color: "inherit" }}>
    <div style={{ 
        display: "flex", alignItems: "center", gap: "10px", padding: "12px", 
        color: active ? "white" : "#cbd5f5", 
        backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
        borderRadius: "8px", fontWeight: active ? "600" : "normal", transition: "all 0.2s"
    }}>
      {icon} <span>{text}</span>
    </div>
  </Link>
);

const styles = {
  container: { display: "flex", minHeight: "100vh", background: "radial-gradient(circle at top, #2a0a4a, #120020)", padding: "20px", gap: "30px", fontFamily: "Inter, sans-serif", color: "white" },
  sidebar: { width: "260px", display: "flex", flexDirection: "column", gap: "20px" },
  profileCard: { backgroundColor: "#1e1b4b", borderRadius: "14px", padding: "16px", border: "1px solid rgba(255,255,255,0.1)" },
  profileHeader: { display: "flex", alignItems: "center", gap: "15px" },
  bigAvatar: { width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem", color: "white" },
  profileRow: { display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", marginTop: "4px", color: "#cbd5f5" },
  roleBadge: { marginTop: '8px', fontSize: '0.7rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', width: 'fit-content' },
  menu: { backgroundColor: "#1e1b4b", borderRadius: "14px", padding: "20px", flex: 1, border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column" },
  main: { flex: 1, display: "flex", flexDirection: "column", paddingTop: "10px" },
  banner: { marginBottom: '30px', textAlign: "left" },
  statsGrid: { display: "flex", gap: "20px" },
  statCard: { flex: 1, height: "160px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", transition: "transform 0.2s", color: "white" },
  iconCircle: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' },
  statNumber: { fontSize: "2.5rem", margin: 0, fontWeight: "700" },
  statLabel: { fontSize: "0.9rem", color: "#cbd5f5", marginTop: "5px" },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' },
  statusBadge: { padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' },
  categoryGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" },
  oval: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "50px", padding: "16px", textAlign: "center", fontWeight: "500", cursor: "pointer", border: "1px solid rgba(255,255,255,0.05)", fontSize: "1rem", transition: "background 0.2s", color: "#e0e7ff" }
};