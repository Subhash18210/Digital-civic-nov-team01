import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api"; // <--- FIXED: Use our API helper
import AuthContext from "../context/AuthContext";
import { ArrowRight } from "lucide-react";

export default function CreatePetition() { 
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: user?.location || "",
    description: ""
    // Removed signatureGoal unless you added it to your Backend Model
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // <--- FIXED: Uses API.post so the Token is sent automatically
      await API.post("/petitions", formData);
      alert("Petition Created!");
      navigate("/petitions");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating petition");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.header}>Create a New Petition</h2>
        <Link to="/petitions" style={styles.viewBtn}>
          View All Petitions <ArrowRight size={16} />
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          type="text" 
          name="title" 
          value={formData.title} 
          onChange={handleChange}
          placeholder="Petition Title"
          required
          style={{ ...styles.input, height: "50px", border: "2px solid #3b82f6" }} 
        />

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Category</label>
            <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                required 
                style={styles.input}
            >
              <option value="">Select...</option>
              <option value="Environment">Environment</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Education">Education</option>
              <option value="Public safety">Public Safety</option>
              <option value="Health">Health</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Location</label>
            <input 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                required 
                style={styles.input} 
            />
          </div>
        </div>

        <label style={styles.label}>Description</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          required
          style={{ ...styles.input, height: "150px", resize: "none" }} // Made it taller
        ></textarea>

        <button type="submit" style={styles.createBtn}>Create</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px", margin: "0 auto", padding: "40px", fontFamily: "sans-serif"
  },
  headerRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px"
  },
  header: { fontSize: "1.5rem", fontWeight: "bold", margin: 0 },
  viewBtn: {
    textDecoration: "none",
    color: "#3b82f6", 
    fontWeight: "bold",
    display: "flex", alignItems: "center", gap: "5px",
    border: "1px solid #3b82f6",
    padding: "8px 15px", borderRadius: "5px"
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: {
    width: "100%", padding: "10px", backgroundColor: "#bfdbfe",
    border: "1px solid #ccc", borderRadius: "5px", outline: "none", boxSizing: "border-box"
  },
  label: { fontWeight: "bold", marginBottom: "5px", display: "block" },
  row: { display: "flex", gap: "40px" },
  createBtn: {
    padding: "10px 40px", backgroundColor: "#1d4ed8", color: "white", 
    border: "none", borderRadius: "5px", fontWeight: "bold", fontSize: "1.2rem", 
    height: "50px", cursor: "pointer", marginTop: "10px"
  }
};