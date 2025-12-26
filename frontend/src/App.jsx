// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Petitions from './pages/Petitions.jsx';
import PetitionList from './pages/petitionList.jsx';
//import Polls from './pages/Polls.jsx';
//import Officials from './pages/Officials.jsx';
//import Reports from './pages/Reports.jsx';
//import Settings from './pages/Settings.jsx';
//import './App.css';

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/petition" element={<Petitions />} />
        <Route path="/petitionlist" element={<PetitionList />} />
        


        {/* fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;