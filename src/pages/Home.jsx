import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { templates, categories } from '../data/templates';
import { Crown, X, LogOut, Sparkles, Gift, Heart } from 'lucide-react';

export default function Home() {
  const { user, logout } = useUser();
  const [activeTab, setActiveTab] = useState('All');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const filteredTemplates = activeTab === 'All'
    ? templates
    : templates.filter(t => t.category === activeTab);

  const freeCount = templates.filter(t => !t.isPremium).length;
  const totalCount = templates.length;
  const categoryCount = categories.length - 1; // exclude "All"

  const handleTemplateClick = (template) => {
    if (template.isPremium) {
      setShowPremiumModal(true);
    } else {
      navigate(`/share/${template.id}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">Greetings</div>
        <div className="nav-profile">
          <img src={user.profilePic} alt={user.name} className="nav-profile-img" />
          <span style={{ fontWeight: 500, fontSize: '14px' }}>{user.name.split(' ')[0]}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: '10px' }}>
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Hero / Welcome Banner */}
      <div className="hero-banner">
        <div className="hero-text">
          <h1 className="hero-title">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
          <p className="hero-subtitle">Pick a greeting card, personalize it, and share it with your loved ones in seconds.</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <Sparkles size={22} className="stat-icon" />
            <div className="stat-number">{totalCount}</div>
            <div className="stat-label">Templates</div>
          </div>
          <div className="stat-card">
            <Gift size={22} className="stat-icon" />
            <div className="stat-number">{freeCount}</div>
            <div className="stat-label">Free</div>
          </div>
          <div className="stat-card">
            <Heart size={22} className="stat-icon" />
            <div className="stat-number">{categoryCount}</div>
            <div className="stat-label">Categories</div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Section heading */}
        <div className="section-heading">
          <h2 className="section-title">
            {activeTab === 'All' ? '✨ All Greetings' : `✨ ${activeTab}`}
          </h2>
          <span className="section-count">{filteredTemplates.length} cards</span>
        </div>

        <div className="tabs">
          {categories.map(cat => (
            <div
              key={cat}
              className={`tab ${activeTab === cat ? 'active' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </div>
          ))}
        </div>

        <div className="grid">
          {filteredTemplates.map(template => (
            <div key={template.id} className="card" onClick={() => handleTemplateClick(template)}>
              <div className="card-img-wrapper">
                <img src={template.imageUrl} alt={template.title} className="card-bg-img" />
              </div>

              {template.isPremium ? (
                <div className="premium-badge"><Crown size={14} /> Premium</div>
              ) : (
                <div className="free-badge">Free</div>
              )}

              <div className="card-title-bar">{template.title}</div>

              {/* Live Preview Overlay */}
              <div className="preview-overlay">
                <div className="preview-header-area">
                  <img src={user.profilePic} alt="avatar" className="preview-avatar" />
                  <div className="preview-name">{user.name}</div>
                </div>
                <div className="preview-text">{template.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPremiumModal && (
        <div className="modal-overlay" onClick={() => setShowPremiumModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPremiumModal(false)}>
              <X size={24} />
            </button>
            <div className="premium-icon">
              <Crown size={32} color="white" />
            </div>
            <h2 className="modal-title">Unlock Premium</h2>
            <p className="modal-desc">
              Get access to all premium greeting cards, unlimited customizations, and high-resolution downloads.
            </p>
            <div className="premium-features">
              <div className="premium-feature-item">✅ Unlimited premium cards</div>
              <div className="premium-feature-item">✅ High-resolution downloads</div>
              <div className="premium-feature-item">✅ Priority new designs</div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => setShowPremiumModal(false)}>
              Upgrade to Premium 🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
}
