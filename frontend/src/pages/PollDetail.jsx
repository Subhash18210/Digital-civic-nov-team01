import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { CheckCircle } from "lucide-react";

export default function PollDetail() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  /* ---------------- FETCH POLL DETAILS ---------------- */
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // 🔁 Simulated API call
    setTimeout(() => {
      setPoll({
        id: pollId,
        question: "Priority for city cleanliness?",
        location: user.location || "Your Area",
        options: [
          "More garbage bins",
          "Daily street cleaning",
          "Strict fines for littering",
          "Public awareness programs",
        ],
        totalVotes: 56,
        votedUsers: ["demo@gmail.com"], // simulate voted users
      });

      // simulate already voted check
      if (["demo@gmail.com"].includes(user.email)) {
        setHasVoted(true);
      }

      setLoading(false);
    }, 800);
  }, [pollId, user]);

  /* ---------------- ROLE CHECKS ---------------- */
  const isCitizen = user?.role === "CITIZEN";
  const canVote = isCitizen && !hasVoted;

  /* ---------------- HANDLE VOTE ---------------- */
  const handleVote = () => {
    if (!selectedOption) return;

    setHasVoted(true);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      navigate("/polls");
    }, 1800);
  };

  if (loading) {
    return <div style={styles.loader}>Loading poll details…</div>;
  }

  if (!poll) {
    return <div style={styles.loader}>Poll not found</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <h1 style={styles.question}>{poll.question}</h1>
        <p style={styles.meta}>📍 {poll.location}</p>

        {/* Options */}
        <div style={styles.options}>
          {poll.options.map((option, index) => (
            <label
              key={index}
              style={{
                ...styles.optionCard,
                borderColor:
                  selectedOption === option ? "#2563eb" : "transparent",
                opacity: hasVoted ? 0.7 : 1,
              }}
            >
              <input
                type="radio"
                name="pollOption"
                value={option}
                disabled={!canVote}
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
                style={{ marginRight: "12px" }}
              />
              {option}
            </label>
          ))}
        </div>

        {/* Vote Button / Messages */}
        {isCitizen && (
          <button
            onClick={handleVote}
            disabled={!canVote || !selectedOption}
            style={{
              ...styles.voteBtn,
              opacity: !canVote || !selectedOption ? 0.6 : 1,
            }}
          >
            {hasVoted ? "You have already voted" : "Vote"}
          </button>
        )}

        {!isCitizen && (
          <p style={styles.info}>
            Only citizens are allowed to vote in polls.
          </p>
        )}

        {/* Success Feedback */}
        {success && (
          <div style={styles.success}>
            <CheckCircle size={18} /> Vote submitted successfully!



          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #2a0a4a, #120020)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "80px",
    fontFamily: "Inter, sans-serif",
    color: "white",
  },

  card: {
    width: "100%",
    maxWidth: "700px",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: "18px",
    padding: "36px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  question: {
    fontSize: "1.6rem",
    marginBottom: "10px",
  },

  meta: {
    color: "#cbd5f5",
    marginBottom: "25px",
  },

  options: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  optionCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    color: "#111827",
    padding: "14px 18px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    border: "2px solid transparent",
    transition: "all 0.2s ease",
  },

  voteBtn: {
    marginTop: "30px",
    width: "100%",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },

  info: {
    marginTop: "20px",
    fontSize: "0.9rem",
    color: "#cbd5f5",
  },

  success: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#4ade80",
    fontWeight: "500",
  },

  loader: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.1rem",
    color: "#cbd5f5",
    background: "radial-gradient(circle at top, #2a0a4a, #120020)",
  },
};
