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

    // safe environment detection for different bundlers (CRA, Vite, etc.)
    let API_BASE = 'http://localhost:5000';
    try {
        // CRA / webpack
        if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
            API_BASE = process.env.REACT_APP_API_URL;
        }
    } catch (e) { /* ignore */ }
    try {
        // Vite
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
            API_BASE = import.meta.env.VITE_API_URL;
        }
    } catch (e) { /* ignore */ }
    // allow an override via window.env if you prefer to inject at runtime
    if (typeof window !== 'undefined' && window.env && window.env.API_URL) {
        API_BASE = window.env.API_URL;
    }

    // login against backend
    const login = async ({ email, password }) => {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
            const message = data?.message || 'Login failed';
            throw new Error(message);
        }

        // expect { token, user }
        const { token, user: userObj } = data;
        localStorage.setItem('civix_token', token);
        localStorage.setItem('civix_user', JSON.stringify(userObj));
        setUser(userObj);
        return userObj;
    };

    // register against backend
    const register = async (registrationData) => {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData),
        });

        const data = await res.json();
        if (!res.ok) {
            const message = data?.message || 'Registration failed';
            throw new Error(message);
        }

        const { token, user: userObj } = data;
        localStorage.setItem('civix_token', token);
        localStorage.setItem('civix_user', JSON.stringify(userObj));
        setUser(userObj);
        return userObj;
    };

    // logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('civix_user');
        localStorage.removeItem('civix_token');
    };

    // Check for user data on initial load (loading state management)
    useEffect(() => {
        const storedUser = localStorage.getItem('civix_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('civix_user');
            }
        }
        setLoading(false);
    }, []);

    // The context value provides the state and functions
    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
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