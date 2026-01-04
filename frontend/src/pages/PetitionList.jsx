import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api"; 
import AuthContext from "../context/AuthContext";
import { Search, Filter, PlusCircle } from "lucide-react"; // Added Icons

export default function PetitionList() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [petitions, setPetitions] = useState([]);
  
  // Initial state for filters
  const [filters, setFilters] = useState({
    category: "",
    status: "active",
    location: "",
  });

  // --- 1. SYNC FILTERS WITH URL ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const statusParam = params.get("status");

    if (categoryParam || statusParam) {
      setFilters(prev => ({
        ...prev,
        category: categoryParam || prev.category,
        status: statusParam || prev.status
      }));
    }
  }, [location.search]);

  // --- 2. FETCH PETITIONS ---
  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const { data } = await API.get('/petitions', { 
          params: {
            category: filters.category || undefined,
            status: filters.status || undefined,
            location: filters.location || undefined
          }
        });
        
        setPetitions(data.petitions || []); 
      } catch (err) {
        console.error("Error fetching petitions", err);
      }
    };
    fetchPetitions();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.container}>
      {/* Fix for Dropdown Options Visibility */}
      <style>{`select option { background-color: #1e1b4b; color: white; }`}</style>

      <div style={styles.headerRow}>
        <div>
           <h2 style={styles.title}>Community Petitions</h2>
           <p style={styles.subtitle}>View, sign, and support local causes.</p>
        </div>
        
        {/* Check Role: Only Citizens see "Start Petition" */}
        {user?.role === "citizen" && (
          <Link to="/create-petition" style={styles.createBtn}>
            <PlusCircle size={18} /> Start Petition
          </Link>
        )}
      </div>

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
              <option value="active">Active</option>
              <option value="under_review">Under Review</option>
              <option value="closed">Closed</option>
            </select>
        </div>

        <div style={styles.searchGroup}>
            <Search size={18} color="#cbd5f5" />
            <input 
              name="location" 
              value={filters.location}
              placeholder="Filter by City..." 
              onChange={handleFilterChange} 
              style={styles.input}
            />
        </div>
      </div>

      {/* --- LIST VIEW --- */}
      <div style={styles.grid}>
        {petitions.map((p) => (
          <div key={p._id} style={styles.card}>
            <div style={{marginBottom: '10px'}}>
               <span style={styles.badge}>{p.category}</span>
               <span style={{...styles.statusBadge, 
                  backgroundColor: p.status === 'active' ? '#dcfce7' : '#fee2e2',
                  color: p.status === 'active' ? '#166534' : '#991b1b'
               }}>
                  {p.status.replace('_', ' ')}
               </span>
            </div>
            
            <h3 style={styles.cardTitle}>{p.title}</h3>
            
            <p style={styles.meta}>
               📍 {p.location || "Local"}
            </p>
            <p style={styles.meta}>
               ✍️ <span style={{color: '#fff', fontWeight: 'bold'}}>{p.signatureCount || 0}</span> Signatures
            </p>
            
            <Link to={`/petitions/${p._id}`} style={styles.linkBtn}>
               View Details →
            </Link>
          </div>
        ))}
        
        {petitions.length === 0 && (
            <div style={styles.emptyState}>
               <h3>No petitions found</h3>
               <p>Try adjusting your filters to see more results.</p>
            </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { 
    minHeight: "100vh",
    padding: "40px 20px", 
    background: "radial-gradient(circle at top, #2a0a4a, #120020)", // Purple Theme
    color: "white",
    fontFamily: "Inter, sans-serif" 
  },

  headerRow: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "30px",
    maxWidth: "1000px",
    margin: "0 auto 30px auto"
  },

  title: { fontSize: "2rem", margin: 0, fontWeight: "700" },
  subtitle: { color: "#cbd5f5", marginTop: "5px" },

  createBtn: { 
    backgroundColor: "#2563eb", 
    color: "white", 
    padding: "12px 20px", 
    borderRadius: "8px", 
    textDecoration: "none", 
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "transform 0.2s",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)"
  },

  // FILTER BAR
  filterBar: { 
    display: "flex", 
    gap: "15px", 
    marginBottom: "30px", 
    padding: "15px", 
    backgroundColor: "rgba(255,255,255,0.05)", 
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px", 
    flexWrap: "wrap",
    maxWidth: "1000px",
    margin: "0 auto 30px auto"
  },

  filterGroup: {
     display: 'flex', alignItems: 'center', gap: '8px'
  },
  
  searchGroup: {
     display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px'
  },

  select: { 
    padding: "10px 14px", 
    borderRadius: "8px", 
    border: "1px solid rgba(255,255,255,0.2)", 
    backgroundColor: "rgba(0,0,0,0.2)", 
    color: "white",
    minWidth: "140px",
    cursor: "pointer",
    outline: "none"
  },

  input: { 
    padding: "10px 14px", 
    borderRadius: "8px", 
    border: "1px solid rgba(255,255,255,0.2)", 
    backgroundColor: "rgba(0,0,0,0.2)",
    color: "white",
    flex: 1,
    outline: "none"
  },

  // GRID
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
    gap: "20px",
    maxWidth: "1000px",
    margin: "0 auto"
  },

  // CARDS
  card: { 
    padding: "24px", 
    border: "1px solid rgba(255,255,255,0.1)", 
    borderRadius: "16px", 
    backgroundColor: "rgba(255,255,255,0.05)", // Glassmorphism
    backdropFilter: "blur(10px)",
    display: "flex", 
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default"
  },

  badge: { 
    display: "inline-block", 
    padding: "4px 10px", 
    borderRadius: "20px", 
    backgroundColor: "rgba(96, 165, 250, 0.2)", 
    color: "#93c5fd", 
    fontSize: "0.75rem", 
    fontWeight: "bold", 
    marginRight: "8px"
  },

  statusBadge: {
    display: "inline-block", 
    padding: "4px 10px", 
    borderRadius: "20px", 
    fontSize: "0.75rem", 
    fontWeight: "bold", 
    textTransform: "uppercase"
  },

  cardTitle: { 
    margin: "10px 0", 
    fontSize: "1.3rem", 
    color: "white",
    fontWeight: "600"
  },

  meta: { 
    color: "#cbd5f5", 
    fontSize: "0.9rem", 
    marginBottom: "8px" 
  },

  linkBtn: { 
    display: "block", 
    textAlign: "center", 
    padding: "10px", 
    backgroundColor: "rgba(255,255,255,0.1)", 
    color: "#white", 
    borderRadius: "8px", 
    textDecoration: "none", 
    fontWeight: "600", 
    border: "1px solid rgba(255,255,255,0.1)", 
    marginTop: "20px",
    transition: "background 0.2s"
  },

  emptyState: {
     gridColumn: '1 / -1', 
     textAlign: 'center', 
     color: '#cbd5f5', 
     padding: '40px',
     backgroundColor: 'rgba(255,255,255,0.02)',
     borderRadius: '16px'
  }
};