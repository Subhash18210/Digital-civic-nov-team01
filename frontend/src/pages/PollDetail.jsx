import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import API from "../api";
import { CheckCircle, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showResults, setShowResults] = useState(false);

  /* ---------------- FETCH POLL (WITH AUTO-REFRESH) ---------------- */
  useEffect(() => {
    // 1. Define the fetch function
    const fetchPoll = async () => {
      try {
        const { data } = await API.get(`/polls/${id}`);
        const pollData = data.data || data;
        setPoll(pollData);

        // Official/Admin: Show results immediately
        if (user?.role === 'official' || user?.role === 'admin') {
          setShowResults(true);
        }
        
        // If already voted? (Logic depends on backend implementation)
        // For now, we rely on the user seeing the results view after action
      } catch (err) {
        console.error("Error fetching poll:", err);
        if (loading) setError("Poll not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPoll(); // Initial Fetch

      // 2. Set up Auto-Refresh (Every 5 seconds)
      const interval = setInterval(fetchPoll, 5000);

      // 3. Cleanup on unmount
      return () => clearInterval(interval);
    }
  }, [id, user, loading]); // Added loading to dependency to prevent loop issues

  /* ---------------- HANDLE VOTE ---------------- */
  const handleVote = async () => {
    if (!selectedOption) return;

    try {
      await API.post(`/polls/${id}/vote`, { selectedOption });
      setSuccess(true);
      
      // Refresh immediately
      const { data } = await API.get(`/polls/${id}`);
      setPoll(data.data || data);
      
      setTimeout(() => {
        setSuccess(false);
        setShowResults(true);
      }, 1500);

    } catch (err) {
      const msg = err.response?.data?.message || "Error voting";
      if (msg.includes("already voted")) {
        alert("You have already voted! Showing results...");
        setShowResults(true);
      } else {
        alert(msg);
      }
    }
  };

  if (loading) return <div style={styles.loader}>Loading poll details…</div>;
  if (error) return <div style={styles.loader}>{error}</div>;

  const chartData = poll?.results || [];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button onClick={() => navigate("/polls")} style={styles.backBtn}>← Back</button>

        <span style={styles.badge}>{poll.status || "ACTIVE"}</span>
        <h1 style={styles.question}>{poll.title}</h1>
        <p style={styles.meta}>
          📍 {poll.targetLocation} • Created by {poll.createdBy?.name || "Official"}
        </p>

        {/* ---------------- RESULTS VIEW ---------------- */}
        {showResults ? (
          <div style={styles.resultsContainer}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{color: '#cbd5f5'}}>📊 Live Results</h3>
              <span style={styles.liveBadge}>● Live Updates</span>
            </div>
            
            <p style={{marginBottom: '20px', color: '#94a3b8'}}>Total Votes: {poll.totalVotes}</p>
            
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="option" type="category" width={100} tick={{fill: '#cbd5f5', fontSize: 12}} />
                  <Tooltip contentStyle={{backgroundColor: '#1e1b4b', border: 'none', color: '#fff'}} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                  <Bar dataKey="count" barSize={20} radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#3b82f6" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{marginTop: '20px'}}>
              {chartData.map((res, i) => (
                 <div key={i} style={styles.resultRow}>
                    <span>{res.option}</span>
                    <span style={{fontWeight: 'bold', color: '#60a5fa'}}>
                       {res.percentage}% ({res.count})
                    </span>
                 </div>
              ))}
            </div>
          </div>
        ) : (
        /* ---------------- VOTING VIEW ---------------- */
          <>
            <div style={styles.options}>
              {poll.options.map((option, index) => (
                <label
                  key={index}
                  style={{
                    ...styles.optionCard,
                    borderColor: selectedOption === option ? "#2563eb" : "transparent",
                    backgroundColor: selectedOption === option ? "rgba(37, 99, 235, 0.1)" : "rgba(255,255,255,0.95)"
                  }}
                >
                  <input
                    type="radio"
                    name="pollOption"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                    style={{ marginRight: "12px", accentColor: "#2563eb" }}
                  />
                  {option}
                </label>
              ))}
            </div>

            {user?.role === "citizen" ? (
              <button
                onClick={handleVote}
                disabled={!selectedOption}
                style={{
                  ...styles.voteBtn,
                  opacity: !selectedOption ? 0.6 : 1,
                  cursor: !selectedOption ? "not-allowed" : "pointer",
                }}
              >
                Submit Vote
              </button>
            ) : (
              <div style={styles.infoBox}>
                 <AlertTriangle size={18}/> Officials cannot vote. Showing results...
                 {setTimeout(() => setShowResults(true), 1500) && ""}
              </div>
            )}

            {success && (
              <div style={styles.success}>
                <CheckCircle size={18} /> Vote submitted! Loading results...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "radial-gradient(circle at top, #2a0a4a, #120020)", display: "flex", justifyContent: "center", paddingTop: "40px", fontFamily: "Inter, sans-serif", color: "white", paddingBottom: "40px" },
  card: { width: "100%", maxWidth: "700px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "18px", padding: "36px", border: "1px solid rgba(255,255,255,0.1)", position: 'relative' },
  backBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '10px' },
  badge: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' },
  liveBadge: { color: '#ef4444', fontSize: '0.75rem', fontWeight: 'bold', animation: 'pulse 2s infinite' },
  question: { fontSize: "1.8rem", marginBottom: "10px", marginTop: "10px" },
  meta: { color: "#cbd5f5", marginBottom: "30px", fontSize: "0.9rem" },
  options: { display: "flex", flexDirection: "column", gap: "14px" },
  optionCard: { color: "#111827", padding: "16px 18px", borderRadius: "12px", display: "flex", alignItems: "center", cursor: "pointer", border: "2px solid transparent", transition: "all 0.2s ease", fontWeight: "500" },
  voteBtn: { marginTop: "30px", width: "100%", padding: "14px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", fontWeight: "600", cursor: "pointer" },
  infoBox: { marginTop: "20px", padding: "15px", backgroundColor: "rgba(234, 179, 8, 0.2)", color: "#fde047", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px" },
  success: { marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#4ade80", fontWeight: "500", backgroundColor: "rgba(74, 222, 128, 0.1)", padding: "10px", borderRadius: "8px" },
  resultsContainer: { padding: "20px", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "12px" },
  resultRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  loader: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.1rem", color: "#cbd5f5", background: "radial-gradient(circle at top, #2a0a4a, #120020)" },
};