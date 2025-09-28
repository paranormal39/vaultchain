import React, { useState } from 'react'

const ModeSelector = ({ onModeSelect, onLaceWalletClick }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-20 px-4">
      {/* Ornate border */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="w-[90%] h-[80%] rounded-[20px] border-2 opacity-30"
          style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}
        >
          <div 
            className="absolute -inset-[10px] rounded-[25px] border opacity-50"
            style={{ borderColor: 'rgba(212, 175, 55, 0.1)' }}
          ></div>
          <div 
            className="absolute inset-[20px] rounded-[15px] border opacity-40"
            style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}
          ></div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-[10%] left-[10%] w-10 h-10 border-2 border-l-0 border-b-0 rounded-tl-[10px] opacity-60" style={{ borderColor: '#d4af37' }}></div>
      <div className="absolute top-[10%] right-[10%] w-10 h-10 border-2 border-r-0 border-b-0 rounded-tr-[10px] opacity-60" style={{ borderColor: '#d4af37' }}></div>
      <div className="absolute bottom-[10%] left-[10%] w-10 h-10 border-2 border-l-0 border-t-0 rounded-bl-[10px] opacity-60" style={{ borderColor: '#d4af37' }}></div>
      <div className="absolute bottom-[10%] right-[10%] w-10 h-10 border-2 border-r-0 border-t-0 rounded-br-[10px] opacity-60" style={{ borderColor: '#d4af37' }}></div>

      {/* Main content */}
      <div className="text-center max-w-4xl mx-auto">
        {/* Magical logo */}
        <div className="w-32 h-32 mx-auto mb-12 relative flex items-center justify-center">
          <div 
            className="w-full h-full rounded-xl flex items-center justify-center relative overflow-hidden animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #ffd700 50%, #b8860b 100%)',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2)',
              animation: 'magicalGlow 3s ease-in-out infinite'
            }}
          >
            <span className="text-5xl filter drop-shadow-lg">📜</span>
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                  linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)
                `
              }}
            ></div>
          </div>
        </div>

        {/* Title */}
        <div className="relative mb-8">
          <h1 
            className="text-6xl md:text-7xl font-bold text-center mb-8 tracking-[3px] relative fantasy-text"
            style={{
              fontFamily: 'serif'
            }}
          >
            VAULTCHAIN DAO
            <div 
              className="absolute top-1/2 left-0 w-24 h-0.5 -translate-x-32 -translate-y-1/2 hidden md:block"
              style={{
                background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
              }}
            ></div>
            <div 
              className="absolute top-1/2 right-0 w-24 h-0.5 translate-x-32 -translate-y-1/2 hidden md:block"
              style={{
                background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
              }}
            ></div>
          </h1>
        </div>

        {/* Subtitle */}
        <p 
          className="text-xl mb-16 font-light tracking-[2px] uppercase opacity-90"
          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
        >
          Privacy-First • AI-Powered • Zero-Knowledge
        </p>

        {/* Clean LACE Wallet Button */}
        <div className="flex justify-center">
          <button
            className="connect-button group relative px-12 py-6 rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105"
            onClick={onLaceWalletClick}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">🌙</span>
              <div className="text-left">
                <div className="text-xl font-bold tracking-wider uppercase">
                  CONNECT LACE WALLET
                </div>
                <div className="text-sm opacity-80">
                  Access DAO Treasury
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes magicalGlow {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.2);
          }
          50% { 
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.6), 0 0 80px rgba(138, 43, 226, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.2);
          }
        }
      `}</style>
    </div>
  )
}

export default ModeSelector
