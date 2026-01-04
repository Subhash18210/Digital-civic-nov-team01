import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { LogOut } from "lucide-react"; // Optional icon for visual clarity

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav style={styles.nav}>
      {/* Logo / Brand Area */}
      <div style={{ flex: 1 }}>
         <h2 style={styles.brand}>CIVIC CONNECT</h2>
      </div> 

      {/* Navigation Links */}
      <div style={styles.links}>
        <NavLink to="/dashboard" label="HOME" active={isActive('/dashboard')} />
        <NavLink to="/petitions" label="PETITIONS" active={isActive('/petitions')} />
        <NavLink to="/polls" label="POLLS" active={isActive('/polls')} />
        <NavLink to="/reports" label="REPORTS" active={isActive('/reports')} />
      </div>

      {/* User / Logout Section */}
      <div style={styles.avatarSection}>
        {user ? (
          <div style={styles.userContainer} onClick={logout} title="Click to Logout">
             <span style={styles.welcomeText}>Hi, {user.name.split(' ')[0]}</span>
             <div style={styles.avatarCircle}>
               {user.name.charAt(0).toUpperCase()}
             </div>
             <div style={styles.logoutHint}>
                <LogOut size={14} />
             </div>
          </div>
        ) : (
          <Link to="/login" style={styles.loginLink}>Login</Link>
        )}
      </div>
    </nav>
  );
};

// Helper Component for Links
const NavLink = ({ to, label, active }) => (
    <Link 
      to={to} 
      style={{
        ...styles.link,
        color: active ? "#ffffff" : "#cbd5f5",
        borderBottom: active ? "2px solid #3b82f6" : "2px solid transparent"
      }}
    >
      {label}
    </Link>
);

const styles = {
  nav: {
    display: "flex", 
    alignItems: "center", 
    padding: "0 40px",
    height: "70px",
    // Deep Purple Background to match pages
    backgroundColor: "#1e1b4b", 
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
  },

  brand: {
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "800",
    letterSpacing: "1px",
    margin: 0
  },

  links: { 
    display: "flex", 
    gap: "40px", 
    fontWeight: "bold",
    height: "100%",
    alignItems: "center"
  },

  link: { 
    textDecoration: "none", 
    fontSize: "0.9rem", 
    textTransform: "uppercase", 
    fontWeight: "700",
    letterSpacing: "0.5px",
    transition: "color 0.2s, border-bottom 0.2s",
    padding: "24px 0", // Expands click area vertically
    display: "inline-block"
  },

  avatarSection: { flex: 1, display: "flex", justifyContent: "flex-end" },

  userContainer: {
     display: "flex",
     alignItems: "center",
     gap: "10px",
     cursor: "pointer",
     padding: "5px 10px",
     borderRadius: "30px",
     transition: "background 0.2s",
     ":hover": { backgroundColor: "rgba(255,255,255,0.1)" }
  },

  welcomeText: {
      color: "#cbd5f5",
      fontSize: "0.9rem",
      fontWeight: "500"
  },

  avatarCircle: {
    width: "36px", height: "36px", borderRadius: "50%", 
    backgroundColor: "#2563eb", // Bright Blue
    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "bold", 
    boxShadow: "0 0 10px rgba(37, 99, 235, 0.5)"
  },
  
  logoutHint: {
      color: "#f87171", // Red tint to indicate logout
      display: "flex",
      alignItems: "center"
  },

  loginLink: { 
      color: "#60a5fa", fontWeight: "bold", textDecoration: "none",
      border: "1px solid #60a5fa", padding: "8px 16px", borderRadius: "6px"
  }
};

export default Navbar;