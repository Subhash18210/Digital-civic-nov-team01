import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API from "../api"; 
import { 
  LayoutDashboard, FileText, BarChart2, Users, FileBarChart, Settings, 
  HelpCircle, MapPin, Mail 
} from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State to store real data counts
  const [stats, setStats] = useState({
    myPetitions: 0,
    successfulPetitions: 0,
    pollsCreated: 0
  });

  const categories = ["Environment", "Infrastructure", "Education", "Public safety", "Health", "Others"];

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/petitions');
        const allPetitions = data.petitions || data || [];

        const myCount = allPetitions.filter(p => 
           (p.creator?._id === user?._id) || (p.creator === user?._id)
        ).length;

        const successCount = allPetitions.filter(p => p.status === 'closed').length;

        let pollsCount = 0;
        try {
            const pollRes = await API.get('/polls');
            const allPolls = pollRes.data.data || pollRes.data || [];
            pollsCount = allPolls.filter(p => 
                (p.createdBy?._id === user?._id) || (p.createdBy === user?._id)
            ).length;
        } catch (e) {
            console.log("Polls API not ready yet");
        }

        setStats({
          myPetitions: myCount,
          successfulPetitions: successCount,
          pollsCreated: pollsCount
        });

      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    };

    if (user) fetchData();
  }, [user]);

  // --- NAVIGATION HANDLERS ---
  const handleCategoryClick = (category) => {
    navigate(`/petitions?category=${category}`);
  };

  const handleStatClick = (type) => {
    if (type === 'mine') {
       navigate('/petitions'); 
    } else if (type === 'successful') {
       navigate('/petitions');
    } else if (type === 'polls') {
       navigate('/polls');
    }
  };

  

  return (
    <div style={styles.container}>
      {/* CSS Hack to force Options to be Black text if browser defaults to white bg */}
      <style>
        {`
          select option {
            background-color: #1e1b4b;
            color: white;
          }
        `}
      </style>

      {/* --- SIDEBAR --- */}
      <div style={styles.sidebar}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.bigAvatar}>{user?.name?.charAt(0).toUpperCase() || "U"}</div>
            <div>
                <h3 style={{margin: 0, fontSize: "1rem", color: 'white'}}>{user?.name || "User Name"}</h3>
                <div style={styles.profileRow}><MapPin size={14} /> {user?.location || "Location"}</div>
                <div style={styles.profileRow}><Mail size={14} /> {user?.email || "Email"}</div>
            </div>
          </div>
        </div>
        <div className={"navbar-hover"} style={styles.menu}>
          <NavItem icon={<LayoutDashboard size={18}/>} text="Dashboard" />
          <NavItem icon={<FileText size={18}/>} text="Petitions" to="/petitions" />
          <NavItem icon={<BarChart2 size={18}/>} text="Polls" to="/polls" />
          <NavItem icon={<Users size={18}/>} text="Officials" />
          <NavItem icon={<FileBarChart size={18}/>} text="Reports" to="/reports" />
          <NavItem icon={<Settings size={18}/>} text="Settings" />
          <div className="navbar-hover" style={{marginTop: "20px"}}>
             <NavItem icon={<HelpCircle size={18}/>} text="Help & Support" />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={styles.main}>
        
        <div style={styles.banner}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h2 style={{margin: 0, fontSize: '1.8rem'}}>Welcome Back, {user?.name}</h2>
                <p style={{margin: '5px 0 0', color: '#cbd5f5'}}>Here is what's happening in your community today.</p>
            </div>
            
            <select style={styles.dropdown}>
              <option value="last_30">Last 30 Days</option>
              <option value="last_6_months">Last 6 Months</option>
              <option value="this_year">This Year</option>
            </select>
          </div>
        </div>

        {/* DYNAMIC STAT BUTTONS */}
        <div style={styles.statsGrid}>
           <button style={styles.statCard} onClick={() => handleStatClick('mine')}>
             <div style={styles.iconCircle}><FileText size={24} color="#60a5fa" /></div>
             <h3 style={styles.statNumber}>{stats.myPetitions}</h3>
             <span style={styles.statLabel}>My Petitions</span>
           </button>
           
           <button style={styles.statCard} onClick={() => handleStatClick('successful')}>
             <div style={styles.iconCircle}><Users size={24} color="#4ade80" /></div>
             <h3 style={styles.statNumber}>{stats.successfulPetitions}</h3>
             <span style={styles.statLabel}>Successful Petitions</span>
           </button>
           
           <button style={styles.statCard} onClick={() => handleStatClick('polls')}>
             <div style={styles.iconCircle}><BarChart2 size={24} color="#f472b6" /></div>
             <h3 style={styles.statNumber}>{stats.pollsCreated}</h3>
             <span style={styles.statLabel}>My Polls</span>
           </button>
        </div>

        {/* DYNAMIC CATEGORY BUTTONS */}
        <h3 style={{color: 'white', marginBottom: '10px', marginTop: '10px'}}>Browse by Category</h3>
        <div style={styles.categoryGrid}>
           {categories.map((cat, index) => (
             <button 
               key={index} 
               style={styles.oval}
               onClick={() => handleCategoryClick(cat)}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}

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

const styles = {
  container: { 
    display: "flex", 
    minHeight: "100vh", 
    background: "radial-gradient(circle at top, #2a0a4a, #120020)", // PURPLE THEME
    padding: "20px", 
    gap: "30px", 
    fontFamily: "Inter, sans-serif",
    color: "white"
  },
  
  sidebar: { width: "260px", display: "flex", flexDirection: "column", gap: "20px" },
  
  profileCard: { 
    backgroundColor: "#1e1b4b", // Dark Blue/Purple
    borderRadius: "14px", 
    padding: "16px",
    border: "1px solid rgba(255,255,255,0.1)"
  },
  
  profileHeader: { display: "flex", alignItems: "center", gap: "15px" },
  
  bigAvatar: { 
    width: "48px", 
    height: "48px", 
    borderRadius: "50%", 
    backgroundColor: "#2563eb", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontWeight: "bold", 
    fontSize: "1.2rem",
    color: "white"
  },
  
  profileRow: { display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", marginTop: "4px", color: "#cbd5f5" },
  
  menu: { 
    backgroundColor: "#1e1b4b", 
    borderRadius: "14px", 
    padding: "20px", 
    flex: 1,
    border: "1px solid rgba(255,255,255,0.1)"
  },
  
  main: { flex: 1, display: "flex", flexDirection: "column", gap: "25px", paddingTop: "10px" },
  
  banner: { 
    padding: "10px 0", 
    textAlign: "left" 
  },
  
  dropdown: { 
    padding: "8px 12px", 
    borderRadius: "8px", 
    color: "white", 
    border: "1px solid rgba(255,255,255,0.2)", 
    // FIXED: Use a solid dark color so browser knows it's dark mode
    backgroundColor: "#1e1b4b", 
    cursor: "pointer", 
    outline: "none"
  },

  statsGrid: { display: "flex", gap: "20px" },
  
  statCard: { 
    flex: 1, 
    height: "160px", 
    backgroundColor: "rgba(255,255,255,0.05)", 
    borderRadius: "16px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: "20px", 
    border: "1px solid rgba(255,255,255,0.1)", 
    cursor: "pointer", 
    transition: "transform 0.2s",
    color: "white"
  },
  
  iconCircle: {
      width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'
  },
  
  statNumber: { fontSize: "2.5rem", margin: 0, fontWeight: "700" },
  statLabel: { fontSize: "0.9rem", color: "#cbd5f5", marginTop: "5px" },

  categoryGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" },
  
  oval: { 
    backgroundColor: "rgba(255,255,255,0.08)", 
    borderRadius: "50px", 
    padding: "16px", 
    textAlign: "center", 
    fontWeight: "500", 
    cursor: "pointer", 
    border: "1px solid rgba(255,255,255,0.05)", 
    fontSize: "1rem", 
    transition: "background 0.2s", 
    color: "#e0e7ff"
  }
};