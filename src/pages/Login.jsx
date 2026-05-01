import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';


export default function Login() {
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('/images/avatar1.jpg');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name) return;
    login({ name, profilePic });
    navigate('/home');
  };

  const handleGoogleLogin = () => {
    login({ name: 'Google User', profilePic: '/images/avatar2.jpg' });
    navigate('/home');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome</h1>
        <p className="auth-subtitle">Create your personalized greetings</p>
        
        <button className="btn btn-outline" onClick={handleGoogleLogin}>
          Continue with Google
        </button>
        
        <div className="divider">or</div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Profile Picture URL (Optional)</label>
            <input 
              type="url" 
              className="form-input" 
              placeholder="https://..."
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{marginTop: '10px'}}>
            Continue as Guest
          </button>
        </form>
      </div>
    </div>
  );
}
