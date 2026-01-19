import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AuthContext from "../context/AuthContext";
import { ArrowLeft, MapPin, Tag, User, PenTool, CheckCircle, AlertTriangle, Send } from "lucide-react";

export default function PetitionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ NEW: Official Response State
  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch Single Petition Data
  useEffect(() => {
    const fetchPetition = async () => {
      try {
        const { data } = await API.get(`/petitions/${id}`);
        setPetition(data);
        setNewStatus(data.status); // Set initial status
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

  // ✅ NEW: Handle Official Response & Status Update
  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    
    if (!responseText.trim() && newStatus === petition.status) {
      alert("Please enter a response or change the status");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await API.post(`/petitions/${id}/response`, {
        response: responseText,
        status: newStatus,
      });
      
      setPetition(data);
      setResponseText("");
      setSuccessMsg("✓ Response submitted successfully!");
      
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit response");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ FIXED: Quick Status Update (without response)
  const handleQuickStatusUpdate = async (newStat) => {
    setSubmitting(true);
    try {
      // Try PUT method instead
      const { data } = await API.put(`/petitions/${id}`, {
        status: newStat
      });
      
      setPetition(data);
      setNewStatus(newStat);
      setSuccessMsg(`✓ Petition marked as ${newStat}`);
      
      setTimeout(() => {
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      console.error("Error updating petition:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={styles.loader}>Loading petition...</div>;
  if (error) return <div style={styles.loader}>{error}</div>;

  const signatureCount = petition.signatureCount || 0;
  const goal = 100; 
  const progressPercent = Math.min((signatureCount / goal) * 100, 100);
  const isOfficial = user?.role === 'official';

  return (
    <div style={styles.container}>
      {successMsg && (
        <div style={styles.successAlert}>{successMsg}</div>
      )}

      <button onClick={() => navigate("/petitions")} style={styles.backBtn}>
        <ArrowLeft size={18} /> Back to Petitions
      </button>

      <div style={styles.mainContent}>
        {/* LEFT: Petition Details */}
        <div style={styles.card}>
          {/* Header Section */}
          <div style={styles.header}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <span style={{
                      ...styles.statusBadge,
                      backgroundColor: petition.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : petition.status === 'under_review' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: petition.status === 'active' ? '#4ade80' : petition.status === 'under_review' ? '#fbbf24' : '#f87171'
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
              {!isOfficial && petition.status === "active" ? (
                  <button onClick={handleSign} style={styles.signBtn}>
                     <PenTool size={18} /> Sign this Petition
                  </button>
              ) : isOfficial ? (
                  <div style={styles.infoBox}>
                      <AlertTriangle size={18} /> Officials view only. Use response section to manage petition.
                  </div>
              ) : (
                  <button disabled style={styles.disabledBtn}>
                      <CheckCircle size={18} /> Signatures Closed
                  </button>
              )}
          </div>

          {/* ✅ NEW: Official Response Display */}
          {petition.officialResponse && (
            <div style={styles.officialResponseBox}>
              <h3 style={{margin: '0 0 10px', color: '#60a5fa'}}>📋 Official Response</h3>
              <p style={{color: '#e2e8f0', margin: '10px 0'}}>{petition.officialResponse.text}</p>
              <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0}}>
                📅 {new Date(petition.officialResponse.date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* ✅ NEW: RIGHT: Official Response Form (Officials Only) */}
        {isOfficial && (
          <div style={styles.card}>
            <h2 style={{margin: '0 0 20px', color: 'white'}}>Official Actions</h2>

            <form onSubmit={handleSubmitResponse} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              
              {/* Response Text */}
              <div>
                <label style={styles.label}>Response Message</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter your official response to this petition..."
                  style={styles.textarea}
                  rows="5"
                  disabled={submitting}
                />
              </div>

              {/* Status Dropdown */}
              <div>
                <label style={styles.label}>Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={styles.select}
                  disabled={submitting}
                >
                  <option value="active">✅ Active</option>
                  <option value="under_review">📋 Under Review</option>
                  <option value="closed">🔒 Closed</option>
                </select>
              </div>

              {/* Quick Status Buttons */}
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                {petition.status !== 'active' && (
                  <button
                    type="button"
                    onClick={() => handleQuickStatusUpdate('active')}
                    disabled={submitting}
                    style={{...styles.quickBtn, ...styles.activateBtn}}
                  >
                    ✅ Mark Active
                  </button>
                )}
                
                {petition.status !== 'under_review' && (
                  <button
                    type="button"
                    onClick={() => handleQuickStatusUpdate('under_review')}
                    disabled={submitting}
                    style={{...styles.quickBtn, ...styles.reviewBtn}}
                  >
                    📋 Under Review
                  </button>
                )}
                
                {petition.status !== 'closed' && (
                  <button
                    type="button"
                    onClick={() => handleQuickStatusUpdate('closed')}
                    disabled={submitting}
                    style={{...styles.quickBtn, ...styles.closeBtn}}
                  >
                    🔒 Close
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                style={{...styles.submitBtn, opacity: submitting ? 0.6 : 1}}
                disabled={submitting}
              >
                <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </form>
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
    background: "radial-gradient(circle at top, #2a0a4a, #120020)",
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

  successAlert: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    zIndex: 9999
  },

  backBtn: { 
    alignSelf: "flex-start",
    maxWidth: "1200px",
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

  mainContent: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: "30px"
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
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
    boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)"
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
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    color: "#fde047",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "0.9rem"
  },

  // ✅ NEW: Official Response Display
  officialResponseBox: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '30px'
  },

  // ✅ NEW: Official Response Form Styles
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#cbd5f5'
  },

  textarea: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: 'white',
    fontFamily: 'Inter, sans-serif',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none'
  },

  select: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#1e1b4b',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    outline: 'none'
  },

  quickBtn: {
    flex: 1,
    minWidth: '100px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s'
  },

  activateBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    border: '1px solid rgba(16, 185, 129, 0.5)',
    color: '#6ee7b7'
  },

  reviewBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    border: '1px solid rgba(245, 158, 11, 0.5)',
    color: '#fbbf24'
  },

  closeBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    color: '#fca5a5'
  },

  submitBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background 0.2s'
  }
};