// src/App.jsx
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import './App.css'; 

// Component that handles the actual view switching
const AppRouter = () => {
    const { isAuthenticated, login, user } = useAuth();
    const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'

    // If authenticated, always show dashboard, otherwise respect current view state
    useEffect(() => {
        if (isAuthenticated) {
            setCurrentView('dashboard');
        } else if (currentView === 'dashboard') {
            setCurrentView('login');
        }
    }, [isAuthenticated]);

    // Handlers to pass to Login/Register pages
    const handleLoginSuccess = (userData) => {
        login(userData);
        setCurrentView('dashboard');
    };

    const handleRegisterSuccess = () => {
        setCurrentView('login');
    };

    if (isAuthenticated) {
        return <Dashboard user={user} />;
    }

    switch (currentView) {
        case 'register':
            return <RegisterPage 
                        onNavigateToLogin={() => setCurrentView('login')} 
                        onRegisterSuccess={handleRegisterSuccess}
                    />;
        case 'login':
        default:
            return <LoginPage 
                        onNavigateToRegister={() => setCurrentView('register')} 
                        onLoginSuccess={handleLoginSuccess}
                    />;
    }
};

// Main App component wrapped in the AuthProvider
const App = () => (
    <AuthProvider>
        <AppRouter />
    </AuthProvider>
);

export default App;