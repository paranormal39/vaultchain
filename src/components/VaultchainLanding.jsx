import React, { useState } from 'react';
import './VaultchainLanding.css';

const VaultchainLanding = ({ onEnterApp }) => {
  const [email, setEmail] = useState('');

  return (
    <div className="vaultchain-landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <div className="logo-container">
            {/* Replace this SVG with your updated VaultChain logo */}
            <svg viewBox="0 0 100 100" className="brand-logo">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c77c6" />
                  <stop offset="50%" stopColor="#ff77c6" />
                  <stop offset="100%" stopColor="#77c6ff" />
                </linearGradient>
              </defs>
              {/* VaultChain Shield with Tree - Update with your new SVG path */}
              <path d="M50 5 L20 20 L20 50 Q20 75 50 95 Q80 75 80 50 L80 20 Z" 
                    fill="none" stroke="url(#logoGradient)" strokeWidth="2"/>
              <rect x="47" y="65" width="6" height="15" fill="url(#logoGradient)"/>
              <ellipse cx="50" cy="40" rx="4" ry="6" fill="url(#logoGradient)"/>
              <circle cx="50" cy="45" r="2" fill="url(#logoGradient)"/>
            </svg>
          </div>
          <span className="brand-text">Vaultchain</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#chains">Chains</a>
          <button className="nav-cta" onClick={onEnterApp}>Get early access</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <h1>Multichain Treasury AI — Powered by ZK</h1>
            <p>Start on Midnight with private governance via Lace Wallet. Link XRPL/EVM for analytics and AI-ranked proposals.</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={onEnterApp}>Connect Lace Wallet</button>
              <button className="btn-secondary">See features</button>
            </div>
            <div className="hero-chips">
              <span className="chip">🌙 Midnight + Lace (ZK)</span>
              <span className="chip">📊 XRPL / EVM (analytics)</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="dashboard-mock">
              <div className="mock-header">
                <h3>Treasury Overview</h3>
                <div className="mock-balance">$2,450,000</div>
              </div>
              <div className="mock-assets">
                <div className="asset-item"><span>MID</span><span>1,200,000</span></div>
                <div className="asset-item"><span>XRP</span><span>850,000</span></div>
                <div className="asset-item"><span>ETH</span><span>400,000</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Privacy on Midnight</h3>
            <p>Zero-knowledge proofs ensure private governance</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Multichain View</h3>
            <p>Unified dashboard across all chains</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Proposals</h3>
            <p>Intelligent treasury optimization</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏛️</div>
            <h3>Modular Governance</h3>
            <p>Flexible voting mechanisms</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VaultchainLanding;
