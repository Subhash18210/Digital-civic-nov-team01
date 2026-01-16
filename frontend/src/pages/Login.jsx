import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Mail, Lock, LogIn } from "lucide-react";

// --- THE FIX IS IN THIS LINE BELOW ---
export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue to Civix</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.icon} />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              style={styles.input} 
            />
          </div>

          <button type="submit" disabled={loading} style={loading ? styles.disabledBtn : styles.button}>
            {loading ? "Logging in..." : "Login"} <LogIn size={18} style={{ marginLeft: "8px" }}/>
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex", justifyContent: "center", alignItems: "center", height: "100vh",
    backgroundColor: "#e0f2fe", fontFamily: "sans-serif"
  },
  card: {
    backgroundColor: "white", padding: "40px", borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "400px", textAlign: "center"
  },
  title: { fontSize: "2rem", marginBottom: "5px", fontWeight: "bold", color: "#1e3a8a" },
  subtitle: { color: "#64748b", marginBottom: "30px", fontSize: "0.9rem" },
  errorBox: { backgroundColor: "#fee2e2", border: "1px solid #ef4444", color: "#b91c1c", padding: "10px", borderRadius: "5px", marginBottom: "20px", fontSize: "0.9rem" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { position: "relative", display: "flex", alignItems: "center" },
  icon: { position: "absolute", left: "12px", color: "#3b82f6" },
  input: {
    width: "100%", padding: "12px 12px 12px 40px", borderRadius: "8px",
    border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", color: "#334155", fontSize: "1rem", outline: "none"
  },
  button: {
    display: "flex", justifyContent: "center", alignItems: "center", padding: "12px", borderRadius: "8px",
    border: "none", backgroundColor: "#2563eb", color: "white", fontSize: "1rem", fontWeight: "bold",
    cursor: "pointer", marginTop: "10px", transition: "background 0.3s"
  },
  disabledBtn: {
    display: "flex", justifyContent: "center", alignItems: "center", padding: "12px", borderRadius: "8px",
    border: "none", backgroundColor: "#94a3b8", color: "white", fontSize: "1rem", fontWeight: "bold",
    cursor: "not-allowed", marginTop: "10px",
  },
  footerText: { marginTop: "20px", color: "#64748b", fontSize: "0.9rem" },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: "bold" }
};