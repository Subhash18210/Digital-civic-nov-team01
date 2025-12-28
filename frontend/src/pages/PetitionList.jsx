import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom"; // Added useLocation
import API from "../api"; 
import AuthContext from "../context/AuthContext";

export default function PetitionList() {
  const { user } = useContext(AuthContext);
  const location = useLocation(); // Hook to read the URL

  const [petitions, setPetitions] = useState([]);
  
  // Initial state for filters
  const [filters, setFilters] = useState({
    category: "",
    status: "active",
    location: "",
  });

  // --- 1. SYNC FILTERS WITH URL (e.g. from Dashboard) ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const statusParam = params.get("status");

    // Only update if params exist, otherwise keep defaults
    if (categoryParam || statusParam) {
      setFilters(prev => ({
        ...prev,
        category: categoryParam || prev.category,
        status: statusParam || prev.status
      }));
    }
  }, [location.search]);

  // --- 2. FETCH PETITIONS WHEN FILTERS CHANGE ---
  useEffect(() => {
    const fetchPetitions = async () => {
      try {
        const { data } = await API.get('/petitions', { 
          params: {
            category: filters.category || undefined, // undefined removes empty keys
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
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Community Petitions</h2>
        {/* Check Role: Only Citizens see "Start Petition" */}
        {user?.role === "citizen" && (
          <Link to="/create-petition" style={styles.createBtn}>+ Start Petition</Link>
        )}
      </div>

      {/* --- FILTERS --- */}
      <div style={styles.filterBar}>
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

        <input 
          name="location" 
          value={filters.location}
          placeholder="Filter by City..." 
          onChange={handleFilterChange} 
          style={styles.input}
        />
      </div>

      {/* --- LIST VIEW --- */}
      <div style={styles.grid}>
        {petitions.map((p) => (
          <div key={p._id} style={styles.card}>
            <span style={styles.badge}>{p.category}</span>
            <h3 style={styles.cardTitle}>{p.title}</h3>
            
            <p style={styles.meta}>📍 {p.location} • ✍️ {p.signatureCount || 0} Signatures</p>
            
            <Link to={`/petitions/${p._id}`} style={styles.linkBtn}>View Details →</Link>
          </div>
        ))}
        
        {petitions.length === 0 && (
            <p style={{color: '#666', gridColumn: '1 / -1', textAlign: 'center'}}>
                No petitions found matching these filters.
            </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { fontSize: "2rem", color: "#1e293b", margin: 0 },
  createBtn: { backgroundColor: "#2563eb", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" },
  filterBar: { display: "flex", gap: "10px", marginBottom: "30px", padding: "15px", backgroundColor: "#f1f5f9", borderRadius: "10px", flexWrap: "wrap" },
  select: { padding: "8px", borderRadius: "5px", border: "1px solid #cbd5e1", minWidth: "120px" },
  input: { padding: "8px", borderRadius: "5px", border: "1px solid #cbd5e1", flex: 1 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  card: { padding: "20px", border: "1px solid #e2e8f0", borderRadius: "10px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" },
  badge: { display: "inline-block", padding: "4px 8px", borderRadius: "4px", backgroundColor: "#dbeafe", color: "#1e40af", fontSize: "0.8rem", fontWeight: "bold", marginBottom: "10px", width: "fit-content" },
  cardTitle: { margin: "0 0 10px 0", fontSize: "1.2rem", color: "#334155" },
  meta: { color: "#64748b", fontSize: "0.9rem", marginBottom: "15px" },
  linkBtn: { display: "block", textAlign: "center", padding: "8px", backgroundColor: "#f8fafc", color: "#2563eb", borderRadius: "6px", textDecoration: "none", fontWeight: "bold", border: "1px solid #e2e8f0", marginTop: "auto" }
};