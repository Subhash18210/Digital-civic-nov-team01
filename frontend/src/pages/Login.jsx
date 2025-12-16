// src/pages/Login.jsx
import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext.jsx'; // For real integration

const LoginPage = ({ onNavigateToRegister, onLoginSuccess }) => {
    // const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Attempting login with:', email);
        // await login(email, password); // Example using context
        
        // Mock successful login for UI development
        if (onLoginSuccess) {
            onLoginSuccess({ name: "Sri", role: "Official", location: "San Diego, CA" });
        }
    };

    return (
        <div className="auth-container">
            <h1 style={{ textAlign: 'center', color: '#007bff' }}>Civix</h1>
            
            {/* Login/Register Tabs [cite: 154, 158] */}
            <div className="auth-header">
                <button className="auth-tab active">Login</button>
                <button className="auth-tab" onClick={onNavigateToRegister}>Register</button>
            </div>

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="your@email.com"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="••••••••"
                        required 
                    />
                </div>
                
                <button type="submit" className="primary-button">
                    Sign In
                </button>
            </form>

            <p className="switch-auth">
                Don't have an account? 
                <a href="#" onClick={onNavigateToRegister} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', marginLeft: '5px' }}>
                    Register now
                </a>
            </p>
        </div>
    );
};

export default LoginPage;