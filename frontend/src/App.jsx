import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthContext, { AuthProvider } from "./context/AuthContext";

// Import Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
//import PetitionList from "./pages/PetitionList";
//import CreatePetition from "./pages/CreatePetition";
//import PollList from "./pages/PollList";
//import CreatePoll from "./pages/CreatePoll";
//import Reports from "./pages/Reports";

// Component to protect routes (Redirect to login if not signed in)
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* --- DEFAULT ROUTE: Redirect to Login --- */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Only for logged-in users) */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        
    
      </Routes>
    </AuthProvider>
  );
}