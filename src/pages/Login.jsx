import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Google avatar fallback using DiceBear (no API key needed)
const getGoogleAvatar = (email) =>
  `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}&backgroundColor=b6e3f4`;

export default function Login() {
  const [mode, setMode] = useState('gmail'); // 'gmail' | 'guest'
  const [gmail, setGmail] = useState('');
  const [gmailError, setGmailError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  // Extract a display name from Gmail e.g. "john.doe@gmail.com" → "John Doe"
  const nameFromEmail = (email) => {
    const local = email.split('@')[0];
    return local
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const handleGmailLogin = (e) => {
    e.preventDefault();
    const trimmed = gmail.trim();
    if (!trimmed) {
      setGmailError('Please enter your Gmail address.');
      return;
    }
    if (!/^[^\s@]+@(gmail\.com)$/i.test(trimmed)) {
      setGmailError('Please enter a valid @gmail.com address.');
      return;
    }
    if (!username.trim() || password.length < 6) {
      setGmailError('Username required and Password must be 6+ chars.');
      return;
    }
    setGmailError('');
    setIsLoading(true);

    // Simulate a short loading (like OAuth handshake)
    setTimeout(() => {
      login({
        name: username.trim(),
        email: trimmed,
        profilePic: profilePic.trim() || getGoogleAvatar(trimmed),
      });
      navigate('/home');
    }, 1200);
  };

  const handleGuestLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || password.length < 6) return;
    setIsLoading(true);
    setTimeout(() => {
      login({
        name: username.trim(),
        profilePic: profilePic.trim() || getGoogleAvatar(username.trim()),
      });
      navigate('/home');
    }, 600);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-logo">
          <span className="auth-logo-emoji">🎉</span>
        </div>
        <h1 className="auth-title">Greetings</h1>
        <p className="auth-subtitle">Personalize & share beautiful greeting cards</p>

        {/* Tab Toggle */}
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${mode === 'gmail' ? 'active' : ''}`}
            onClick={() => setMode('gmail')}
            type="button"
          >
            <GoogleIcon /> Gmail Login
          </button>
          <button
            className={`auth-tab-btn ${mode === 'guest' ? 'active' : ''}`}
            onClick={() => setMode('guest')}
            type="button"
          >
            👤 Guest
          </button>
        </div>

        {/* Common Profile Pic Field (Optional) */}
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label">Profile Picture URL (Optional)</label>
          <input
            type="url"
            className="form-input"
            placeholder="https://..."
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
          />
        </div>

        <div className="divider">Login Details</div>

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            placeholder="choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-with-icon">
            <input
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Gmail Login Form */}
        {mode === 'gmail' && (
          <form onSubmit={handleGmailLogin} className="auth-form">
            <div className="form-group">
              <label className="form-label">Gmail Address</label>
              <div className="input-with-icon">
                <span className="input-icon"><GoogleIcon size={16} /></span>
                <input
                  type="email"
                  className={`form-input with-icon ${gmailError ? 'input-error' : ''}`}
                  placeholder="you@gmail.com"
                  value={gmail}
                  onChange={(e) => { setGmail(e.target.value); setGmailError(''); }}
                  autoFocus
                />
              </div>
              {gmailError && <p className="field-error">{gmailError}</p>}
            </div>
            <button
              type="submit"
              className="btn btn-google"
              disabled={isLoading}
            >
              {isLoading ? (
                <><span className="spinner" /> Signing in…</>
              ) : (
                <><GoogleIcon /> Continue with Gmail</>
              )}
            </button>
          </form>
        )}

        {/* Guest Login Form */}
        {mode === 'guest' && (
          <form onSubmit={handleGuestLogin} className="auth-form">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? <><span className="spinner" /> Loading…</> : '👤 Continue as Guest'}
            </button>
          </form>
        )}

        <p className="auth-footer">
          By continuing, you agree to our&nbsp;
          <span className="auth-link">Terms</span> &amp;&nbsp;
          <span className="auth-link">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ verticalAlign: 'middle' }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}
