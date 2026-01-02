import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CreatePoll() {
  const navigate = useNavigate();
  const userRole = "OFFICIAL"; // ADMIN | OFFICIAL

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ---------------- ACCESS CONTROL ---------------- */
  useEffect(() => {
    if (userRole !== "ADMIN" && userRole !== "OFFICIAL") {
      navigate("/unauthorized");
    }
  }, [userRole, navigate]);

  /* ---------------- OPTIONS ---------------- */
  const addOption = () => setOptions([...options, ""]);
  const removeOption = (i) =>
    options.length > 2 &&
    setOptions(options.filter((_, idx) => idx !== i));

  const handleOptionChange = (i, val) => {
    const copy = [...options];
    copy[i] = val;
    setOptions(copy);
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Poll title is required";
    if (!location.trim()) e.location = "Location is required";
    if (options.filter((o) => o.trim()).length < 2)
      e.options = "Minimum 2 options required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const isFormReady =
    title.trim() &&
    location.trim() &&
    options.filter((o) => o.trim()).length >= 2;

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate("/polls"), 1500);
    }, 1200);
  };

  return (
    <div style={styles.page}>
      <style>{fadeStyle}</style>

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Create a New Poll</h1>
          <Link to="/polls" style={styles.viewLink}>
            View All Polls →
          </Link>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Poll Title */}
          <input
            type="text"
            placeholder="Poll Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            onFocus={focus}
            onBlur={blur}
          />
          <small style={styles.helper}>
            Ask a clear question citizens can easily understand
          </small>
          {errors.title && <span style={styles.error}>{errors.title}</span>}

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={styles.input}
            onFocus={focus}
            onBlur={blur}
          />
          <small style={styles.helper}>
            Poll will be visible only in this location
          </small>
          {errors.location && (
            <span style={styles.error}>{errors.location}</span>
          )}

          {/* Options */}
          <div>
            <small style={styles.helper}>
              Add at least two options for voting
            </small>

            {options.map((opt, i) => (
              <div key={i} style={styles.optionRowAnimated}>
                <input
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(i, e.target.value)
                  }
                  style={styles.input}
                  onFocus={focus}
                  onBlur={blur}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    style={styles.removeBtn}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {errors.options && (
              <span style={styles.error}>{errors.options}</span>
            )}

            <button
              type="button"
              onClick={addOption}
              style={styles.addBtn}
            >
              + Add Option
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div style={styles.successBox}>
              ✅ Poll created successfully! Redirecting…
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormReady || loading}
            style={{
              ...styles.createBtn,
              opacity: !isFormReady || loading ? 0.6 : 1,
              cursor: !isFormReady ? "not-allowed" : "pointer",
            }}
            onMouseEnter={hoverIn}
            onMouseLeave={hoverOut}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- INTERACTION HELPERS ---------------- */
const focus = (e) =>
  (e.target.style.border = "2px solid #3b82f6");
const blur = (e) =>
  (e.target.style.border = "2px solid transparent");
const hoverIn = (e) => {
  e.target.style.transform = "translateY(-1px)";
  e.target.style.boxShadow =
    "0 10px 25px rgba(29,78,216,0.4)";
};
const hoverOut = (e) => {
  e.target.style.transform = "translateY(0)";
  e.target.style.boxShadow = "none";
};

const fadeStyle = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

/* ---------------- STYLES ---------------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #2a0a4a, #120020)",
    display: "flex",
    justifyContent: "center",
    paddingTop: "80px",
    fontFamily: "Inter, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "900px",
    padding: "40px",
    color: "white",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "25px",
  },

  title: { fontSize: "1.8rem", fontWeight: "600" },

  viewLink: {
    color: "#60a5fa",
    textDecoration: "none",
    border: "1px solid #60a5fa",
    padding: "8px 16px",
    borderRadius: "8px",
  },

  form: { display: "flex", flexDirection: "column", gap: "14px" },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "8px",
    border: "2px solid transparent",
    backgroundColor: "#c7e0ff",
    fontSize: "1rem",
    transition: "all 0.25s ease",
  },

  helper: {
    fontSize: "0.8rem",
    color: "#bfdbfe",
  },

  optionRowAnimated: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    animation: "fadeIn 0.3s ease",
  },

  addBtn: {
    marginTop: "10px",
    background: "transparent",
    color: "#93c5fd",
    border: "1px dashed #93c5fd",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    width: "160px",
  },

  removeBtn: {
    background: "#ef4444",
    border: "none",
    color: "white",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
  },

  createBtn: {
    marginTop: "25px",
    padding: "16px",
    backgroundColor: "#1d4ed8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.05rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },

  successBox: {
    padding: "12px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "500",
  },

  error: { color: "#fca5a5", fontSize: "0.85rem" },
};
