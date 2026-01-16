import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AuthContext from "../context/AuthContext";
import { ArrowLeft, MapPin, Tag, User, PenTool, CheckCircle, AlertTriangle } from "lucide-react"; // Added Icons

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
      await API.post(`/petitions/${id}/sign`);
      alert("Successfully signed!");
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Error signing petition");
    }
  };

  if (loading) return <div style={styles.loader}>Loading petition...</div>;
  if (error) return <div style={styles.loader}>{error}</div>;

  // Calculate progress (Goal: 100 signatures for visual demo)
  const signatureCount = petition.signatureCount || 0;
  const goal = 100; 
  const progressPercent = Math.min((signatureCount / goal) * 100, 100);

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/petitions")} style={styles.backBtn}>
        <ArrowLeft size={18} /> Back to Petitions
      </button>

      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <span style={{
                    ...styles.statusBadge,
                    backgroundColor: petition.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: petition.status === 'active' ? '#4ade80' : '#f87171'
                }}>
                    {petition.status.toUpperCase()}
                </span>
            </div>

            <h1 style={styles.title}>{petition.title}</h1>

            <div style={styles.metaRow}>
                <div style={styles.metaItem}>
                    <Tag size={16} /> {petition.category}
                </div>
                <div style={styles.metaItem}>
                    <MapPin size={16} /> {petition.location}
                </div>
                <div style={styles.metaItem}>
                    <User size={16} /> Created by {petition.creator?.name || "Citizen"}
                </div>
            </div>
        </div>

        {/* Content Section */}
        <div style={styles.content}>
            <h3 style={styles.sectionTitle}>About this Petition</h3>
            <p style={styles.description}>{petition.description}</p>
        </div>

        {/* Action / Support Section */}
        <div style={styles.actionBox}>
            <div style={{textAlign: 'left', width: '100%'}}>
                 <h3 style={{margin: '0 0 10px 0', fontSize: '1.4rem'}}>
                    {signatureCount} <span style={{fontSize: '1rem', color: '#cbd5f5', fontWeight: 'normal'}}>supporters</span>
                 </h3>
                 
                 <div style={styles.barContainer}>
                    <div style={{...styles.progressBar, width: `${progressPercent}%`}}></div>
                 </div>
                 <p style={styles.goalText}>
                    {goal - signatureCount > 0 ? `${goal - signatureCount} more needed to reach next goal!` : "Goal reached!"}
                 </p>
            </div>
            
            <div style={styles.divider}></div>

            {/* ACTION BUTTON LOGIC */}
            {user?.role === "citizen" && petition.status === "active" ? (
                // Check if already signed (If backend provides 'signedBy' array in future, use it here)
                // For now, we assume user can try to sign, and backend will reject duplicates
                <button onClick={handleSign} style={styles.signBtn}>
                   <PenTool size={18} /> Sign this Petition
                </button>
            ) : (
                user?.role === "official" ? (
                   <div style={styles.infoBox}>
                      <AlertTriangle size={18} /> Officials view only. You cannot sign petitions.
                   </div>
                ) : (
                   <button disabled style={styles.disabledBtn}>
                      <CheckCircle size={18} /> Signatures Closed
                   </button>
                )
            )}
        </div>
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
    fontFamily: "Inter, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  loader: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at top, #2a0a4a, #120020)",
    color: "#cbd5f5"
  },

  backBtn: { 
    alignSelf: "flex-start",
    maxWidth: "800px",
    width: "100%",
    margin: "0 auto 20px auto",
    background: "none", 
    border: "none", 
    color: "#cbd5f5", 
    cursor: "pointer", 
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "1rem",
    padding: 0
  },

  card: {
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "rgba(255,255,255,0.05)", // Glassmorphism
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "40px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
  },

  header: { marginBottom: "30px" },

  statusBadge: { 
    padding: "6px 12px", 
    borderRadius: "20px", 
    fontWeight: "bold", 
    fontSize: "0.8rem", 
    letterSpacing: "1px" 
  },

  title: { 
    fontSize: "2.5rem", 
    margin: "15px 0", 
    fontWeight: "700",
    lineHeight: "1.2"
  },

  metaRow: { 
    display: "flex", 
    gap: "20px", 
    flexWrap: "wrap",
    marginTop: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)"
  },

  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#cbd5f5",
    fontSize: "0.95rem"
  },

  content: { marginBottom: "40px" },

  sectionTitle: { fontSize: "1.2rem", color: "white", marginBottom: "10px" },

  description: { 
    fontSize: "1.1rem", 
    lineHeight: "1.8", 
    color: "#e2e8f0" 
  },

  // ACTION BOX (Right side or Bottom)
  actionBox: { 
    backgroundColor: "rgba(0,0,0,0.2)", 
    padding: "30px", 
    borderRadius: "16px", 
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  barContainer: { 
    width: "100%", 
    height: "12px", 
    backgroundColor: "rgba(255,255,255,0.1)", 
    borderRadius: "10px", 
    margin: "10px 0", 
    overflow: "hidden" 
  },

  progressBar: { 
    height: "100%", 
    backgroundColor: "#3b82f6", 
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" // Glow effect
  },

  goalText: { fontSize: "0.9rem", color: "#94a3b8", margin: 0 },

  divider: {
      width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '20px 0'
  },

  signBtn: { 
    width: "100%",
    padding: "16px", 
    fontSize: "1.1rem", 
    backgroundColor: "#2563eb", 
    color: "white", 
    border: "none", 
    borderRadius: "10px", 
    cursor: "pointer", 
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "background 0.2s"
  },

  disabledBtn: { 
    width: "100%",
    padding: "16px", 
    fontSize: "1.1rem", 
    backgroundColor: "rgba(255,255,255,0.1)", 
    color: "#94a3b8", 
    border: "none", 
    borderRadius: "10px", 
    cursor: "not-allowed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  },

  infoBox: {
    width: "100%",
    padding: "15px",
    backgroundColor: "rgba(234, 179, 8, 0.1)", // Yellow tint
    color: "#fde047",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "0.9rem"
  }
};