import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API from "../api"; 
import { 
  LayoutDashboard, FileText, BarChart2, Users, FileBarChart, Settings, 
  HelpCircle, MapPin, Mail, Search, Filter, PlusCircle, AlertCircle, CheckCircle
} from "lucide-react";

export default function OfficialDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Stats State
  const [stats, setStats] = useState({
    totalPetitions: 0,
    activePetitions: 0,
    closedPetitions: 0
  });

  // Petitions State
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    category: "",
    status: "all",
    location: "",
  });

  // Updating State
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/petitions');
        const allPetitions = data.petitions || data || [];

        // Filter by official's location
        const locationPetitions = allPetitions.filter(p => 
          p.location === user?.location
        );

        const active = locationPetitions.filter(p => p.status === 'active').length;
        const closed = locationPetitions.filter(p => p.status === 'closed').length;

        setStats({
          totalPetitions: locationPetitions.length,
          activePetitions: active,
          closedPetitions: closed
        });

        setPetitions(locationPetitions);
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'official') fetchData();
  }, [user]);

  // --- FILTER PETITIONS ---
  const getFilteredPetitions = () => {
    let filtered = petitions;

    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    return filtered;
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePetitionClick = (petitionId) => {
    navigate(`/petitions/${petitionId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- UPDATE PETITION STATUS ---
  const handleStatusUpdate = async (petitionId, newStatus) => {
    setUpdatingId(petitionId);
    setUpdateError("");
    try {
      const { data } = await API.patch(`/petitions/${petitionId}`, {
        status: newStatus
      });
      
      // Update local state
      setPetitions(petitions.map(p => 
        p._id === petitionId ? { ...p, status: newStatus } : p
      ));

      // Update stats
      const active = petitions.filter(p => p.status === 'active' && p._id !== petitionId).length + 
                     (newStatus === 'active' ? 1 : 0);
      const closed = petitions.filter(p => p.status === 'closed' && p._id !== petitionId).length + 
                     (newStatus === 'closed' ? 1 : 0);

      setStats({
        ...stats,
        activePetitions: active,
        closedPetitions: closed
      });

    } catch (err) {
      setUpdateError(err.response?.data?.message || "Failed to update status");
      console.error("Error updating petition:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredPetitions = getFilteredPetitions();

  return (
    <div style={styles.container}>
      {/* CSS for dropdown options */}
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

        <div style={styles.menu}>
          <NavItem icon={<LayoutDashboard size={18}/>} text="Dashboard" active={true} />
          <NavItem icon={<FileText size={18}/>} text="Petitions" to="/petitions" />
          <NavItem icon={<BarChart2 size={18}/>} text="Polls" to="/polls" />
          <NavItem icon={<FileBarChart size={18}/>} text="Reports" to="/reports" />
          <NavItem icon={<Settings size={18}/>} text="Settings" />
          <div style={{marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px"}}>
            <NavItem 
              icon={<HelpCircle size={18}/>} 
              text="Logout" 
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={styles.main}>
        
        <div style={styles.banner}>
          <h2 style={{margin: 0, fontSize: '1.8rem', fontWeight: '700'}}>Governance Dashboard</h2>
          <p style={{margin: '5px 0 0', color: '#cbd5f5'}}>Manage petitions for {user?.location}</p>
        </div>

        {/* --- STATS CARDS --- */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.iconCircle}>📊</div>
            <h3 style={styles.statNumber}>{stats.totalPetitions}</h3>
            <span style={styles.statLabel}>Total Petitions</span>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.iconCircle}>✅</div>
            <h3 style={styles.statNumber}>{stats.activePetitions}</h3>
            <span style={styles.statLabel}>Active</span>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.iconCircle}>🔒</div>
            <h3 style={styles.statNumber}>{stats.closedPetitions}</h3>
            <span style={styles.statLabel}>Closed</span>
          </div>
        </div>

        {/* --- PETITIONS SECTION --- */}
        <div style={{marginTop: '30px'}}>
          <h3 style={{color: 'white', marginBottom: '15px', fontSize: '1.2rem', fontWeight: '600'}}>
            Petitions in {user?.location}
          </h3>

          {/* --- FILTERS --- */}
          <div style={styles.filterBar}>
            <div style={styles.filterGroup}>
              <Filter size={18} color="#cbd5f5" />
              <select 
                name="category" 
                value={filters.category} 
                onChange={handleFilterChange} 
                style={styles.select}
              >
                <option value="">All Categories</option>
                <option value="Environment">Environment</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Education">Education</option>
                <option value="Public safety">Public Safety</option>
                <option value="Health">Health</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <select 
                name="status" 
                value={filters.status} 
                onChange={handleFilterChange} 
                style={styles.select}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="under_review">Under Review</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* --- PETITIONS LIST --- */}
          <div style={styles.petitionsList}>
            {filteredPetitions.length > 0 ? (
              filteredPetitions.map((p) => (
                <div 
                  key={p._id} 
                  style={styles.petitionCard}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                >
                  {updateError && (
                    <div style={styles.errorAlert}>
                      <AlertCircle size={16} /> {updateError}
                    </div>
                  )}

                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px'}}>
                    <div style={{flex: 1, cursor: 'pointer'}} onClick={() => handlePetitionClick(p._id)}>
                      <div style={{marginBottom: '10px'}}>
                        <span style={styles.badge}>{p.category}</span>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: p.status === 'active' ? '#10b981' : p.status === 'under_review' ? '#f59e0b' : '#ef4444',
                          color: 'white',
                          marginLeft: '8px'
                        }}>
                          {p.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <h4 style={styles.petitionTitle}>{p.title}</h4>
                      
                      <p style={styles.petitionMeta}>
                        📍 {p.location}
                      </p>
                      <p style={styles.petitionMeta}>
                        ✍️ <span style={{color: '#fff', fontWeight: 'bold'}}>{p.signatures || p.signatureCount || 0}</span> Signatures
                      </p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={styles.actionButtons}>
                      {p.status === 'active' && (
                        <button 
                          onClick={() => handleStatusUpdate(p._id, 'under_review')}
                          disabled={updatingId === p._id}
                          style={{...styles.actionBtn, ...styles.reviewBtn}}
                          title="Mark as Under Review"
                        >
                          {updatingId === p._id ? '...' : '📋'}
                        </button>
                      )}

                      {p.status === 'under_review' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(p._id, 'active')}
                            disabled={updatingId === p._id}
                            style={{...styles.actionBtn, ...styles.activeBtn}}
                            title="Mark as Active"
                          >
                            {updatingId === p._id ? '...' : '✅'}
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(p._id, 'closed')}
                            disabled={updatingId === p._id}
                            style={{...styles.actionBtn, ...styles.closeBtn}}
                            title="Close Petition"
                          >
                            {updatingId === p._id ? '...' : '🔒'}
                          </button>
                        </>
                      )}

                      {p.status === 'closed' && (
                        <button 
                          onClick={() => handleStatusUpdate(p._id, 'active')}
                          disabled={updatingId === p._id}
                          style={{...styles.actionBtn, ...styles.activeBtn}}
                          title="Reopen Petition"
                        >
                          {updatingId === p._id ? '...' : '🔓'}
                        </button>
                      )}

                      <button 
                        style={styles.viewBtn}
                        onClick={() => handlePetitionClick(p._id)}
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{...styles.petitionCard, textAlign: 'center', cursor: 'default'}}>
                <p style={{color: '#cbd5f5', margin: 0}}>No petitions found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const NavItem = ({ icon, text, active, to, onClick }) => (
  <Link to={to || "#"} onClick={onClick} style={{ textDecoration: "none", color: "inherit" }}>
    <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "10px", 
        padding: "12px", 
        color: active ? "white" : "#cbd5f5", 
        backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
        borderRadius: "8px",
        fontWeight: active ? "600" : "normal",
        transition: "all 0.2s",
        cursor: "pointer"
    }}>
      {icon} <span>{text}</span>
    </div>
  </Link>
);

const styles = {
  container: { 
    display: "flex", 
    minHeight: "100vh", 
    background: "radial-gradient(circle at top, #2a0a4a, #120020)",
    padding: "20px", 
    gap: "30px", 
    fontFamily: "Inter, sans-serif",
    color: "white"
  },
  
  sidebar: { 
    width: "260px", 
    display: "flex", 
    flexDirection: "column", 
    gap: "20px",
    position: "sticky",
    top: "20px",
    height: "fit-content"
  },
  
  profileCard: { 
    backgroundColor: "#1e1b4b",
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
    color: "white",
    flexShrink: 0
  },
  
  profileRow: { display: "flex", alignItems: "center", gap: "5px", fontSize: "0.85rem", marginTop: "4px", color: "#cbd5f5" },
  
  menu: { 
    backgroundColor: "#1e1b4b", 
    borderRadius: "14px", 
    padding: "20px", 
    flex: 1,
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  
  main: { 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    gap: "20px", 
    paddingTop: "10px" 
  },
  
  banner: { 
    padding: "10px 0", 
    textAlign: "left" 
  },

  statsGrid: { 
    display: "flex", 
    gap: "20px",
    flexWrap: "wrap"
  },
  
  statCard: { 
    flex: 1,
    minWidth: "150px",
    height: "140px", 
    backgroundColor: "rgba(255,255,255,0.05)", 
    borderRadius: "16px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: "20px", 
    border: "1px solid rgba(255,255,255,0.1)", 
    cursor: "pointer", 
    transition: "transform 0.2s, background 0.2s"
  },
  
  iconCircle: {
    width: '40px', 
    height: '40px', 
    borderRadius: '50%', 
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: '10px',
    fontSize: '1.5rem'
  },
  
  statNumber: { fontSize: "2rem", margin: 0, fontWeight: "700" },
  
  statLabel: { fontSize: "0.85rem", color: "#cbd5f5", marginTop: "5px" },

  // FILTER BAR
  filterBar: { 
    display: "flex", 
    gap: "15px", 
    marginBottom: "20px", 
    padding: "15px", 
    backgroundColor: "rgba(255,255,255,0.05)", 
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px", 
    flexWrap: "wrap"
  },

  filterGroup: {
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px'
  },

  select: { 
    padding: "10px 12px", 
    borderRadius: "8px", 
    border: "1px solid rgba(255,255,255,0.2)", 
    backgroundColor: "#1e1b4b", 
    color: "white",
    minWidth: "150px",
    cursor: "pointer",
    outline: "none"
  },

  badge: { 
    display: "inline-block", 
    padding: "4px 10px", 
    borderRadius: "20px", 
    backgroundColor: "rgba(96, 165, 250, 0.2)", 
    color: "#93c5fd", 
    fontSize: "0.75rem", 
    fontWeight: "bold"
  },

  statusBadge: {
    display: "inline-block", 
    padding: "4px 10px", 
    borderRadius: "20px", 
    fontSize: "0.75rem", 
    fontWeight: "bold"
  },

  petitionsList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '12px'
  },

  petitionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },

  petitionTitle: { 
    margin: "8px 0", 
    fontSize: "1.1rem", 
    color: "white",
    fontWeight: "600"
  },

  petitionMeta: { 
    color: "#cbd5f5", 
    fontSize: "0.9rem", 
    marginBottom: "6px",
    margin: "4px 0"
  },

  viewBtn: {
    padding: "8px 16px",
    backgroundColor: "rgba(37, 99, 235, 0.3)",
    border: "1px solid rgba(59, 130, 246, 0.5)",
    color: "#60a5fa",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s",
    whiteSpace: "nowrap"
  },

  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignItems: 'center',
    flexShrink: 0
  },

  actionBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    outline: 'none',
    fontWeight: '600'
  },

  reviewBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    border: '1px solid rgba(245, 158, 11, 0.5)',
    color: '#fbbf24'
  },

  activeBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    border: '1px solid rgba(16, 185, 129, 0.5)',
    color: '#6ee7b7'
  },

  closeBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    color: '#fca5a5'
  },

  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
    padding: '8px 12px',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '0.9rem'
  }
};