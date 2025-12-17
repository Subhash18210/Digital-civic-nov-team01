// src/context/AuthContext.jsx - VERIFY THIS CODE EXACTLY
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create a custom hook and EXPORT it
export const useAuth = () => useContext(AuthContext); 

// 3. Create the Provider component and EXPORT it
export const AuthProvider = ({ children }) => {
    // State to hold the user information (null if not logged in)
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock function for login
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('civix_user', JSON.stringify(userData));
    };

    // Mock function for logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('civix_user');
    };

    // Check for user data on initial load (loading state management)
    useEffect(() => {
        const storedUser = localStorage.getItem('civix_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // The context value provides the state and functions
    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        isOfficial: user ? user.role === 'official' : false,
        location: user ? user.location : null,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Render children only when loading is complete */}
            {!loading ? children : <div>Loading...</div>} 
        </AuthContext.Provider>
    );
};