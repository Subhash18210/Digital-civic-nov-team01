import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Petition Pages
import PetitionList from "./pages/PetitionList";
import CreatePetition from "./pages/CreatePetition";
import PetitionDetail from "./pages/PetitionDetail";

// Poll Pages
import PollList from "./pages/PollList";
import CreatePoll from "./pages/CreatePoll";
import PollDetail from "./pages/PollDetail";

// Other
import Reports from "./pages/Reports";
import ProtectedRoute from "./routes/ProtectedRoute";

// global css
import "./App.css";


function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

// Layout component to handle conditional Navbar
const Layout = () => {
  const location = useLocation();

  // Define paths where Navbar should be HIDDEN
  const hideNavbarPaths = ["/", "/login", "/register"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {/* Show Navbar only on inner pages */}
      {showNavbar && <Navbar />}

      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/officialDashboard" element={<OfficialDashboard />} />
        

        {/* ---------- Protected Routes ---------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Petitions */}
          <Route path="/petitions" element={<PetitionList />} />
          <Route path="/create-petition" element={<CreatePetition />} />
          <Route path="/petitions/:id" element={<PetitionDetail />} />

          {/* Polls */}
          <Route path="/polls" element={<PollList />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          
          {/* ⚠️ CRITICAL FIX: Changed ':pollId' to ':id' to match PollDetail.js */}
          <Route path="/polls/:id" element={<PollDetail />} />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;