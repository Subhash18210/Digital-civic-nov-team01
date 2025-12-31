import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function PollResults() {
  const { pollId } = useParams();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH RESULTS ---------------- */
  const fetchResults = () => {
    setLoading(true);

    // 🔁 Simulated API call
    setTimeout(() => {
      const mockResults = {
        id: pollId,
        question: "Priority for city cleanliness?",
        totalVotes: 120,
        options: [
          { text: "More garbage bins", votes: 40 },
          { text: "Daily street cleaning", votes: 32 },
          { text: "Strict fines for littering", votes: 28 },
          { text: "Public awareness programs", votes: 20 },
        ],
      };

      setPoll(mockResults);
      setLoading(false);
    }, 600);
  };

  /* ---------------- AUTO REFRESH (POLLING) ---------------- */
  useEffect(() => {
    fetchResults();

    const interval = setInterval(() => {
      fetchResults();
    }, 5000); // refresh every 5 sec

    return () => clearInterval(interval);
  }, [pollId]);

  if (loading || !poll) {
    return <div style={styles.loader}>Loading results…</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.question}>{poll.question}</h1>
        <p style={styles.subText}>Live voting results</p>

        <div style={styles.results}>
          {poll.options.map((opt, index) => {
            const percent = ((opt.votes / poll.totalVotes) * 100).toFixed(1);

            return (
              <div key={index} style={styles.resultRow}>
                <div style={styles.optionHeader}>
                  <span>{opt.text}</span>
                  <span>{opt.votes} votes ({percent}%)</span>
                </div>

                <div style={styles.barBg}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${percent}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Link to={`/polls/${pollId}`} style={styles.backLink}>
          ← Back to Poll
        </Link>
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
    paddingTop: "80px",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "700px",
    padding: "36px",
    borderRadius: "18px",
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  question: {
    fontSize: "1.5rem",
    marginBottom: "6px",
  },

  subText: {
    color: "#cbd5f5",
    marginBottom: "30px",
  },

  results: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  resultRow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  optionHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.95rem",
  },

  barBg: {
    width: "100%",
    height: "10px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "999px",
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: "999px",
    transition: "width 0.5s ease",
  },

  backLink: {
    display: "inline-block",
    marginTop: "30px",
    color: "#93c5fd",
    textDecoration: "none",
    fontWeight: "500",
  },

  loader: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#cbd5f5",
    background: "radial-gradient(circle at top, #2a0a4a, #120020)",
  },
};
