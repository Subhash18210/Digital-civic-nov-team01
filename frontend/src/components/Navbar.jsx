import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={styles.nav}>
      <div style={{ flex: 1 }}></div> {/* Spacer */}

      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>HOME</Link>
        <Link to="/petitions" style={styles.link}>PETITIONS</Link>
        <Link to="/polls" style={styles.link}>POLLS</Link>
        <Link to="/reports" style={styles.link}>REPORTS</Link>
      </div>

      <div style={styles.avatarSection}>
        {user ? (
          <div style={styles.avatarCircle} onClick={logout} title="Click to Logout">
            {user.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <Link to="/login" style={styles.loginLink}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex", alignItems: "center", padding: "15px 40px",
    backgroundColor: "white", borderBottom: "1px solid #eee",
  },
  links: { display: "flex", gap: "30px", fontWeight: "bold" },
  link: { textDecoration: "none", color: "#9333ea", fontSize: "1rem", textTransform: "uppercase", fontWeight: "800" },
  avatarSection: { flex: 1, display: "flex", justifyContent: "flex-end" },
  avatarCircle: {
    width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#bfdbfe",
    color: "black", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "bold", cursor: "pointer", border: "1px solid #999",
  },
  loginLink: { color: "#3b82f6", fontWeight: "bold", textDecoration: "none" }
};

export default Navbar;