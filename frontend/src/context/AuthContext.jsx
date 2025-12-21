import { createContext, useState, useEffect, useContext } from "react"; // Added useContext
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// --- THIS IS THE MISSING PART THAT FIXES YOUR ERROR ---
export const useAuth = () => {
  return useContext(AuthContext);
};
// -----------------------------------------------------

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Check if user is already logged in
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get("http://localhost:5000/api/auth/me", config);
          setUser(data);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  // 2. Login Function
  const login = async (formData) => {
    const { data } = await axios.post("http://localhost:5000/api/auth/login", formData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    navigate("/dashboard");
  };

  // 3. Register Function
  const register = async (formData) => {
    const { data } = await axios.post("http://localhost:5000/api/auth/register", formData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    navigate("/dashboard");
  };

  // 4. Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;