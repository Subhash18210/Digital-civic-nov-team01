import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API from "../api"; // Import your API helper
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
        // 1. Fetch all petitions to calculate stats
        const { data } = await API.get('/petitions');
        const allPetitions = data.petitions || [];

        // 2. Calculate "My Petitions" (Created by logged-in user)
        // Note: backend response usually has creator object or ID. We check both.
        const myCount = allPetitions.filter(p => 
           (p.creator?._id === user?._id) || (p.creator === user?._id)
        ).length;

        // 3. Calculate "Successful" (Status = closed)
        const successCount = allPetitions.filter(p => p.status === 'closed').length;

        setStats({
          myPetitions: myCount,
          successfulPetitions: successCount,
          pollsCreated: 0 // Placeholder until you build Polls backend
        });

      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    };

    if (user) fetchData();
  }, [user]);

  // --- NAVIGATION HANDLERS ---
  const handleCategoryClick = (category) => {
    // Navigate to Petitions list with the selected category
    navigate(`/petitions?category=${category}`);
  };

  const handleStatClick = (type) => {
    if (type === 'mine') {
       // Ideally you'd filter by 'mine' in the list, for now just go to list
       navigate('/petitions');
    } else if (type === 'successful') {
       navigate('/petitions?status=closed');
    }
  };

  return (
    <div style={styles.container}>
      {/* --- SIDEBAR --- */}
      <div style={styles.sidebar}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.bigAvatar}>{user?.name?.charAt(0).toUpperCase() || "U"}</div>
            <div>
                <h3 style={{margin: 0, fontSize: "1.1rem"}}>{user?.name || "User Name"}</h3>
                <div style={styles.profileRow}><MapPin size={14} /> {user?.location || "Location"}</div>
                <div style={styles.profileRow}><Mail size={14} /> {user?.email || "Email"}</div>
            </div>
          </div>
        </div>
        <div style={styles.menu}>
          <NavItem icon={<LayoutDashboard size={18}/>} text="Dashboard" active />
          <NavItem icon={<FileText size={18}/>} text="Petitions" to="/petitions" />
          <NavItem icon={<BarChart2 size={18}/>} text="Polls" to="/polls" />
          <NavItem icon={<Users size={18}/>} text="Officials" />
          <NavItem icon={<FileBarChart size={18}/>} text="Reports" to="/reports" />
          <NavItem icon={<Settings size={18}/>} text="Settings" />
          <div style={{marginTop: "20px"}}>
             <NavItem icon={<HelpCircle size={18}/>} text="Help & Support" />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={styles.main}>
        
        <div style={styles.banner}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Welcome to Digital Civic Engagement</h2>
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
             <h3 style={styles.statNumber}>{stats.myPetitions}</h3>
             <span style={styles.statLabel}>My Petitions</span>
           </button>
           
           <button style={styles.statCard} onClick={() => handleStatClick('successful')}>
             <h3 style={styles.statNumber}>{stats.successfulPetitions}</h3>
             <span style={styles.statLabel}>Successful (Closed)</span>
           </button>
           
           <button style={styles.statCard}>
             <h3 style={styles.statNumber}>{stats.pollsCreated}</h3>
             <span style={styles.statLabel}>Polls Created</span>
           </button>
        </div>

        {/* DYNAMIC CATEGORY BUTTONS */}
        <h3 style={{color: '#333', marginBottom: '10px'}}>Browse by Category</h3>
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
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", color: active ? "#000080" : "#333", fontWeight: active ? "bold" : "normal" }}>
      {icon} <span>{text}</span>
    </div>
  </Link>
);

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "white", padding: "20px", gap: "30px", fontFamily: "sans-serif" },
  sidebar: { width: "250px", display: "flex", flexDirection: "column", gap: "20px" },
  profileCard: { backgroundColor: "#bfdbfe", border: "2px solid #3b82f6", borderRadius: "10px", padding: "15px" },
  profileHeader: { display: "flex", alignItems: "center", gap: "15px" },
  bigAvatar: { width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem" },
  profileRow: { display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", marginTop: "3px", color: "#333" },
  menu: { backgroundColor: "#bfdbfe", borderRadius: "10px", padding: "20px", flex: 1 },
  
  main: { flex: 1, display: "flex", flexDirection: "column", gap: "30px", paddingTop: "20px" },
  banner: { backgroundColor: "#bfdbfe", padding: "30px", borderRadius: "5px", fontWeight: "bold", textAlign: "left" },
  
  dropdown: { padding: "8px", borderRadius: "5px", color: "#000000", border: "1px solid #3b82f6", backgroundColor: "white", cursor: "pointer", fontWeight: "bold" },

  statsGrid: { display: "flex", gap: "20px" },
  
  // Updated Stat Card for Numbers
  statCard: { flex: 1, height: "150px", backgroundColor: "#bfdbfe", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", border: "none", cursor: "pointer", transition: "0.2s" },
  statNumber: { fontSize: "2.5rem", margin: 0, color: "#1e3a8a" },
  statLabel: { fontSize: "1.1rem", fontWeight: "bold", color: "#1e3a8a" },

  categoryGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "10px" },
  
  oval: { backgroundColor: "#bfdbfe", borderRadius: "50px", padding: "15px", textAlign: "center", fontWeight: "bold", fontStyle: "italic", cursor: "pointer", border: "none", fontSize: "1rem", transition: "0.2s", color: "#1e3a8a" }
};