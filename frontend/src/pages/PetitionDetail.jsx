import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api"; // <--- FIXED: Use our API helper
import AuthContext from "../context/AuthContext";

export default function PetitionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Single Petition Data
  useEffect(() => {
    const fetchPetition = async () => {
      try {
        // <--- FIXED: Use API.get (Handles Base URL)
        const { data } = await API.get(`/petitions/${id}`);
        setPetition(data);
        setLoading(false);
      } catch (err) {
        setError("Petition not found");
        setLoading(false);
      }
    };
    fetchPetition();
  }, [id]);

  // Handle Sign Petition
  const handleSign = async () => {
    try {
      // <--- FIXED: API.post automatically attaches the Token from localStorage
      await API.post(`/petitions/${id}/sign`);
      
      alert("Successfully signed!");
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Error signing petition");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/petitions")} style={styles.backBtn}>← Back</button>
      
      <span style={styles.statusBadge}>{petition.status}</span>
      <h1 style={styles.title}>{petition.title}</h1>
      
      <div style={styles.metaRow}>
        <p><strong>Category:</strong> {petition.category}</p>
        <p><strong>Location:</strong> {petition.location}</p>
        <p><strong>Created By:</strong> {petition.creator?.name || "Unknown"}</p>
      </div>

      <div style={styles.content}>
        <h3>Description</h3>
        <p style={{lineHeight: "1.6"}}>{petition.description}</p>
      </div>

      <div style={styles.actionBox}>
        {/* <--- FIXED: Used 'signatureCount' to match Backend */}
        <h3>{petition.signatureCount || 0} Supporters</h3>
        
        <div style={styles.barContainer}>
            {/* Simple visual progress bar (Goal: 100 for now) */}
            <div style={{...styles.progressBar, width: `${Math.min(petition.signatureCount || 0, 100)}%`}}></div>
        </div>
        
        {/* CHECKLIST: Role Based Signing */}
        {user?.role === "citizen" && petition.status === "active" ? (
          <button onClick={handleSign} style={styles.signBtn}>
            ✍️ Sign this Petition
          </button>
        ) : (
           user?.role === "official" ? (
             <p style={styles.officialNote}>Officials cannot sign petitions.</p>
           ) : (
             <button disabled style={styles.disabledBtn}>Signatures Closed</button>
           )
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" },
  backBtn: { border: "none", background: "none", cursor: "pointer", color: "#64748b", marginBottom: "20px" },
  statusBadge: { backgroundColor: "#dcfce7", color: "#166534", padding: "5px 10px", borderRadius: "15px", fontWeight: "bold", fontSize: "0.8rem", textTransform: "uppercase" },
  title: { fontSize: "2.5rem", margin: "10px 0 20px 0", color: "#0f172a" },
  metaRow: { display: "flex", gap: "30px", borderBottom: "1px solid #e2e8f0", paddingBottom: "20px", marginBottom: "20px", color: "#475569" },
  content: { marginBottom: "40px", fontSize: "1.1rem", color: "#334155" },
  actionBox: { backgroundColor: "#f8fafc", padding: "30px", borderRadius: "15px", textAlign: "center", border: "1px solid #e2e8f0" },
  barContainer: { width: "100%", height: "10px", backgroundColor: "#e2e8f0", borderRadius: "5px", margin: "15px 0", overflow: "hidden" },
  progressBar: { height: "100%", backgroundColor: "#2563eb" },
  signBtn: { padding: "15px 40px", fontSize: "1.2rem", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  disabledBtn: { padding: "15px 40px", fontSize: "1.2rem", backgroundColor: "#cbd5e1", color: "white", border: "none", borderRadius: "8px", cursor: "not-allowed" },
  officialNote: { color: "#64748b", fontStyle: "italic" }
};