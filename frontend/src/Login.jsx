import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page from reloading
    console.log("1. Submit button clicked"); 
    console.log("2. Form Data being sent:", formData);

    try {
      await login(formData);
      console.log("3. Login function finished successfully");
      // If successful, the AuthContext should redirect you
    } catch (err) {
      console.error("4. Login Error:", err);
      // Show the error on screen so you know what happened
      alert("Login Failed: " + (err.response?.data?.message || err.message || "Server not reachable"));
    }
  };

  return (
    <div className="auth-container">
      <h2>Login Debug Mode</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})} 
          required
        />
        <br />
        <input 
          type="password" 
          placeholder="Password" 
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})} 
          required
        />
        <br />
        {/* IMPORTANT: Verify type="submit" is here */}
        <button type="submit" style={{backgroundColor: 'blue', color: 'white', padding: '10px'}}>
            Login (Click Me)
        </button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;