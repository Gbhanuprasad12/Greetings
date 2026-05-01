import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { templates } from '../data/templates';
import { Share2, Download, ArrowLeft, Check } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function Share() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shared, setShared] = useState(false);

  // If no user is logged in, redirect to login
  if (!user) {
    navigate('/');
    return null;
  }

  const template = templates.find(t => t.id === id);

  if (!template) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Template not found</div>;
  }

  const generateImage = async () => {
    if (!editorRef.current) {
      alert("Error: Card layout not found!");
      return null;
    }
    setIsProcessing(true);
    try {
      // Reduced caching and sizes to ensure < 1s render matching browser gesture limits
      const dataUrl = await toPng(editorRef.current, { cacheBust: false, pixelRatio: 1 });
      if (!dataUrl) {
         alert("Error: rendering library returned an empty image.");
         setIsProcessing(false);
         return null;
      }
      setIsProcessing(false);
      return dataUrl;
    } catch (err) {
      console.error('Error generating image', err);
      alert('Failed to generate image: ' + err.message);
      setIsProcessing(false);
      return null;
    }
  };

  const handleShare = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    try {
      // Create a blob from dataUrl
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'greeting.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My Custom Greeting',
            text: 'Check out this personalized greeting I made!',
            files: [file],
          });
          setShared(true);
          alert("Shared successfully!");
        } catch (shareErr) {
          console.error('Share API rejected or timed out:', shareErr);
          alert("Native Share API canceled or timed out. Falling back to direct download.");
          handleDownload(dataUrl);
        }
      } else {
        alert("Your web browser does not natively support the OS Share sheet. Downloading instead.");
        handleDownload(dataUrl);
      }
    } catch (err) {
      console.error('Error sharing', err);
      alert("Error sharing: " + err.message + ". Downloading instead.");
      handleDownload(dataUrl);
    }
  };

  const handleDownload = async (preGeneratedUrl) => {
    const url = typeof preGeneratedUrl === 'string' ? preGeneratedUrl : await generateImage();
    if (!url) return;
    
    const link = document.createElement('a');
    link.download = 'greeting.png';
    link.href = url;
    link.click();
    setShared(true);
  };

  return (
    <>
      <nav className="navbar" style={{ position: 'relative' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={20} /> Back
        </button>
        <div className="nav-brand">Personalize</div>
        <div style={{ width: 60 }}></div>
      </nav>

      <div className="editor-container">
        {/* Editor Preview matching exact Card styles */}
        <div className="editor-preview-wrapper" ref={editorRef}>
          <img src={template.imageUrl} alt={template.title} className="card-bg-img" />
          
          <div className="preview-overlay">
            <div className="preview-header-area">
              <img src={user.profilePic} alt="avatar" className="preview-avatar" />
              <div className="preview-name">{user.name}</div>
            </div>
            <div className="preview-text">{template.text}</div>
          </div>
        </div>

        <div className="action-bar">
          <button className="btn btn-outline" onClick={handleDownload} disabled={isProcessing} style={{ flex: 1 }}>
            <Download size={20} /> {isProcessing ? 'Processing' : 'Download'}
          </button>
          
          <button className="btn btn-primary" onClick={handleShare} disabled={isProcessing} style={{ flex: 1 }}>
            {shared || isProcessing ? <Check size={20} /> : <Share2 size={20} />} {isProcessing ? 'Processing...' : (shared ? 'Shared!' : 'Share Image')}
          </button>
        </div>
      </div>
    </>
  );
}
