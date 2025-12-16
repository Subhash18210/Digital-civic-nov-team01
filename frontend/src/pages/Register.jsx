// src/pages/Register.jsx - CORRECTED CODE
import React, { useState } from 'react';

const RegisterPage = ({ onNavigateToLogin, onRegisterSuccess }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');
    const [role, setRole] = useState('citizen'); [cite_start]// Default role: citizen [cite: 46]

    const handleRegister = (e) => {
        e.preventDefault();
        console.log('Attempting registration with:', { fullName, email, location, role });
        
        // Mock successful registration for UI development
        if (onRegisterSuccess) {
            alert('Registration Successful! Please log in.');
            onRegisterSuccess(); // Typically navigates to Login after success
        }
    };

    return (
        <div className="auth-container">
            <h1 style={{ textAlign: 'center', color: '#007bff' }}>Welcome to Civix</h1>
            
            {/* Login/Register Tabs */}
            <div className="auth-header">
                <button className="auth-tab" onClick={onNavigateToLogin}>Login</button>
                <button className="auth-tab active">Register</button>
            </div>

            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input 
                        type="text" 
                        id="fullName" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        placeholder="Jane Doe"
                        required 
                    />
                </div>
                
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

                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input 
                        type="text" 
                        id="location" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        placeholder="San Diego, CA"
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>I am registering as:</label>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <label>
                            <input 
                                type="radio" 
                                name="role" 
                                value="citizen" 
                                checked={role === 'citizen'} 
                                onChange={() => setRole('citizen')}
                                style={{ marginRight: '5px' }}
                            />
                            Citizen
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="role" 
                                value="official" 
                                checked={role === 'official'} 
                                onChange={() => setRole('official')}
                                style={{ marginRight: '5px' }}
                            />
                            Public Official
                        </label>
                    </div>
                </div>
                
                <button type="submit" className="primary-button">
                    Create Account
                </button>
            </form>

            <p className="switch-auth">
                Already have an account? 
                <a href="#" onClick={onNavigateToLogin} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', marginLeft: '5px' }}>
                    Sign in
                </a>
            </p>
        </div>
    );
};

export default RegisterPage;