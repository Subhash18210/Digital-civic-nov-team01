import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // <--- 1. Import this

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // <--- 2. Initialize this

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/dashboard'); // <--- 3. Force redirect to Dashboard
    } catch (err) {
      alert("Login Failed: " + (err.response?.data?.message || "Check your email/password"));
    }
  };

  
  return (
    <div className="auth-container" style={{ padding: '20px' }}>
      <h2>Login to Civix</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" placeholder="Email" required 
          onChange={e => setFormData({...formData, email: e.target.value})} 
        /><br/>
        <input 
          type="password" placeholder="Password" required 
          onChange={e => setFormData({...formData, password: e.target.value})} 
        /><br/>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;