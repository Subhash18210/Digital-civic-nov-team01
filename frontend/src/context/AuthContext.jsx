import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ---------------- RESTORE SESSION ---------------- */
  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // ✅ Restore user immediately (prevents redirect)
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // ✅ Validate token with backend (optional but good)
      if (token) {
        try {
          const { data } = await API.get("/auth/me");
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } catch (err) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }

      setLoading(false);
    };

    restoreUser();
  }, []);

  /* ---------------- REGISTER ---------------- */
  const register = async (userData) => {
    const { data } = await API.post("/auth/register", userData);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user || data));

    setUser(data.user || data);
    navigate("/dashboard");
  };

  /* ---------------- LOGIN ---------------- */
  const login = async (credentials) => {
    const { data } = await API.post("/auth/login", credentials);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user || data));

    setUser(data.user || data);
    navigate("/dashboard");
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
