import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const LoginPage = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      alert(err.message);
    }
  };

  
  return (
    <div className="auth-page-wrapper">
      <div className="info-sidebar">
        <div className="brand-section">
          <h1>🏛️ Civix</h1>
          <h2>Digital Civic Engagement Platform</h2>
          <p className="brand-description">
            Civix enables citizens to engage in local governance through petitions, 
            voting, and tracking officials' responses. Join our platform to make your 
            voice heard and drive positive change in your community. 
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon-box">📝</div>
              <div>
                <h4>Create and Sign Petitions</h4>
                <p>Easily create petitions for issues you care about and gather support from your community.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-box">🗳️</div>
              <div>
                <h4>Participate in Public Polls</h4>
                <p>Vote on local issues and see real-time results of community sentiment.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-box">📈</div>
              <div>
                <h4>Track Official Responses</h4>
                <p>See how local officials respond to community concerns and track progress.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="auth-card">
          <h2 style={{textAlign: 'center', marginBottom: '10px'}}>Welcome to Civix</h2>
          <p style={{textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '30px'}}>
            Join our platform to make your voice heard in local governance.
          </p>
          
          <div className="auth-tabs" style={{display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '25px'}}>
            <button className="auth-tab active" style={{flex: 1, padding: '12px', border: 'none', background: 'none', borderBottom: '2px solid var(--primary-color)', fontWeight: 'bold', color: 'var(--primary-color)'}}>Login</button>
            <button className="auth-tab" onClick={onNavigateToRegister} style={{flex: 1, padding: '12px', border: 'none', background: 'none', cursor: 'pointer', color: '#666'}}>Register</button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Email</label>
              <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}} />
            </div>
            <div className="form-group" style={{marginBottom: '25px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd'}} />
            </div>
            <button type="submit" className="primary-button" style={{width: '100%', padding: '14px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>Sign In</button>
          </form>
          <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px'}}>
            Don't have an account? <span onClick={onNavigateToRegister} style={{color: 'var(--primary-color)', fontWeight: 'bold', cursor: 'pointer'}}>Register now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;