import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { User, Mail, Lock, MapPin, Briefcase } from "lucide-react";

// --- MAP IMPORTS ---
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet marker icon missing in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
    location: ""
  });

  // Map State (Default: Hyderabad)
  const [mapCoords, setMapCoords] = useState([17.3850, 78.4867]); 
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- MAP COMPONENT TO HANDLE CLICKS ---
  function LocationMarker() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setMapCoords([lat, lng]); // Move marker visual
        
        // Reverse Geocoding (Get City Name)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.county || "Selected Location";
          
          // Auto-fill the existing location input
          setFormData((prev) => ({ ...prev, location: city }));
        } catch (error) {
          // Fallback if API fails
          setFormData((prev) => ({ ...prev, location: `${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
        }
      },
    });

    return mapCoords === null ? null : (
      <Marker position={mapCoords}></Marker>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join your community today</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.inputGroup}>
            <User size={18} style={styles.icon} />
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.icon} />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <Briefcase size={18} style={styles.icon} />
            <select name="role" value={formData.role} onChange={handleChange} style={styles.select}>
              <option value="citizen">Citizen</option>
              <option value="official">Public Official</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <MapPin size={18} style={styles.icon} />
            <input type="text" name="location" placeholder="City, State (e.g. Hyderabad)" value={formData.location} onChange={handleChange} required style={styles.input} />
          </div>

          {/* --- NEW MAP SECTION --- */}
          <div style={styles.mapWrapper}>
            <MapContainer 
                center={[17.3850, 78.4867]} 
                zoom={11} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
            </MapContainer>
            <p style={styles.mapHint}>Click map to auto-fill location</p>
          </div>
          {/* ----------------------- */}

          <button type="submit" style={styles.button}>Register</button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

// Light Blue Theme Styles (Unchanged + Map styles)
const styles = {
  container: {
    display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", // Changed height to minHeight for scrolling
    backgroundColor: "#e0f2fe",
    fontFamily: "sans-serif",
    padding: "20px" // Added padding for small screens
  },
  card: {
    backgroundColor: "white", padding: "40px", borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "400px", textAlign: "center"
  },
  title: { fontSize: "2rem", marginBottom: "5px", fontWeight: "bold", color: "#1e3a8a" },
  subtitle: { color: "#64748b", marginBottom: "20px", fontSize: "0.9rem" },
  errorBox: { backgroundColor: "#fee2e2", border: "1px solid #ef4444", color: "#b91c1c", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "0.9rem" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { position: "relative", display: "flex", alignItems: "center" },
  icon: { position: "absolute", left: "12px", color: "#3b82f6" },
  input: {
    width: "100%", padding: "12px 12px 12px 40px", borderRadius: "8px",
    border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", color: "#334155", fontSize: "1rem", outline: "none"
  },
  select: {
    width: "100%", padding: "12px 12px 12px 40px", borderRadius: "8px",
    border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", color: "#334155", fontSize: "1rem", outline: "none", appearance: "none"
  },
  button: {
    padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#2563eb",
    color: "white", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", marginTop: "10px", transition: "background 0.3s"
  },
  footerText: { marginTop: "20px", color: "#64748b", fontSize: "0.9rem" },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: "bold" },
  
  // --- NEW STYLES FOR MAP ---
  mapWrapper: {
    height: "180px", 
    width: "100%", 
    borderRadius: "8px", 
    overflow: "hidden", 
    border: "1px solid #cbd5e1",
    position: "relative"
  },
  mapHint: {
    position: "absolute",
    bottom: "0",
    left: "0",
    right: "0",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.75rem",
    padding: "4px",
    margin: "0",
    color: "#64748b",
    zIndex: 1000 // Ensure it sits on top of map
  }
};

export default Register;