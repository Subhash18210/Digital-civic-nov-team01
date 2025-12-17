import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const RegisterPage = ({ onNavigateToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', location: '', role: 'citizen' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      onNavigateToLogin();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Left Panel remains identical for branding consistency */}
      <div className="info-sidebar">
        <div className="brand-section">
          <h1>🏛️ Civix</h1>
          <h2>Digital Civic Engagement Platform</h2>
          <p className="brand-description">Civix enables citizens to engage in local governance through petitions, voting, and tracking officials' responses.</p>
          <div className="feature-list">
             {/* Feature items same as Login for UI consistency */}
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="auth-card" style={{padding: '35px'}}>
          <h2 style={{textAlign: 'center', marginBottom: '10px'}}>Welcome to Civix</h2>
          <p style={{textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '25px'}}>Join our platform to make your voice heard.</p>
          
          <div className="auth-tabs" style={{display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '20px'}}>
            <button className="auth-tab" onClick={onNavigateToLogin} style={{flex: 1, padding: '12px', border: 'none', background: 'none', cursor: 'pointer', color: '#666'}}>Login</button>
            <button className="auth-tab active" style={{flex: 1, padding: '12px', border: 'none', background: 'none', borderBottom: '2px solid var(--primary-color)', fontWeight: 'bold', color: 'var(--primary-color)'}}>Register</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px'}}>Full Name</label>
              <input type="text" placeholder="Jane Doe" onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}} />
            </div>
            <div className="form-group" style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px'}}>Email</label>
              <input type="email" placeholder="your@email.com" onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}} />
            </div>
            <div className="form-group" style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px'}}>Password</label>
              <input type="password" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} required style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}} />
            </div>
            <div className="form-group" style={{marginBottom: '15px'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px'}}>Location</label>
              <input type="text" placeholder="Portland, OR" onChange={(e) => setFormData({...formData, location: e.target.value})} required style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}} />
            </div>
            <div className="form-group" style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '14px'}}>I am registering as:</label>
              <div style={{display: 'flex', gap: '20px', fontSize: '14px'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}>
                  <input type="radio" name="role" value="citizen" checked={formData.role === 'citizen'} onChange={() => setFormData({...formData, role: 'citizen'})} /> Citizen
                </label>
                <label style={{display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer'}}>
                  <input type="radio" name="role" value="official" checked={formData.role === 'official'} onChange={() => setFormData({...formData, role: 'official'})} /> Public Official
                </label>
              </div>
            </div>
            <button type="submit" className="primary-button" style={{width: '100%', padding: '14px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>Create Account</button>
          </form>
          <p style={{textAlign: 'center', marginTop: '15px', fontSize: '13px'}}>
            Already have an account? <span onClick={onNavigateToLogin} style={{color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer'}}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;