import React, { useState } from 'react'

const NFTSelector = ({ userAddress, onSelect, onBack }) => {
  const [selectedId, setSelectedId] = useState(null)

  // Wandering Soul NFT collection data
  const nftCollections = [
    {
      id: 1,
      name: "VaultChain Guardian - Crimson",
      image: null, // Use CSS-based visual instead
      icon: "🛡️",
      color: "#DC2626",
      rarity: "Legendary",
      attributes: ["Treasury Founder", "Privacy Shield", "ZK Proof Master"],
      description: "The original VaultChain guardian with crimson glow, representing the founding members of the privacy-first treasury DAO.",
      gradient: "from-red-600 to-red-800"
    },
    {
      id: 2,
      name: "VaultChain Guardian - Violet",
      image: null,
      icon: "🛡️",
      color: "#7C3AED",
      rarity: "Epic",
      attributes: ["Treasury Keeper", "Shadow Walker", "Proof Validator"],
      description: "The violet guardian embodies the mystical nature of zero-knowledge proofs and anonymous governance.",
      gradient: "from-purple-600 to-purple-800"
    },
    {
      id: 3,
      name: "VaultChain Guardian - Azure",
      image: null,
      icon: "🛡️",
      color: "#0EA5E9",
      rarity: "Rare", 
      attributes: ["Treasury Member", "Night Watcher", "ZK Circuit"],
      description: "The azure guardian represents the depth of privacy and the clarity of decentralized treasury management.",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      id: 4,
      name: "Midnight Guardian #001",
      image: null,
      icon: "🌙",
      color: "#4C1D95",
      rarity: "Legacy",
      attributes: ["Legacy Member", "Guild Founder", "Ancient Wisdom"],
      description: "Original Midnight Network guardian from the early days of privacy-preserving blockchain technology.",
      gradient: "from-indigo-700 to-purple-900"
    },
    {
      id: 5,
      name: "Wandering Soul #007",
      image: null,
      icon: "👻",
      color: "#EC4899",
      rarity: "Mythic",
      attributes: ["Soul Keeper", "Privacy Veil", "Ethereal Form"],
      description: "A mystical wandering soul that bridges the gap between the physical and digital realms of privacy.",
      gradient: "from-pink-500 to-rose-700"
    }
  ]

  const handleSelect = () => {
    console.log('🔍 NFTSelector - handleSelect called with selectedId:', selectedId)
    if (selectedId) {
      const nft = nftCollections.find(n => n.id === selectedId)
      console.log('🔍 NFTSelector - Selected NFT:', nft)
      console.log('🔍 NFTSelector - Calling onSelect with NFT')
      onSelect(nft)
    }
  }

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'Common': return 'text-gray-300'
      case 'Rare': return 'text-blue-300'
      case 'Epic': return 'text-purple-300'
      case 'Legendary': return 'text-yellow-300'
      case 'Mythic': return 'text-pink-300'
      case 'Legacy': return 'text-orange-300'
      default: return 'text-white'
    }
  }

  return (
    <div className="text-center">
      <div className="mb-12">
        <p 
          className="text-lg mb-8 font-light tracking-[1px] opacity-90"
          style={{ color: '#d4af37' }}
        >
          Select the NFT you own to generate a Privacy-Preserving Proof
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {nftCollections.map((nft) => (
          <div
            key={nft.id}
            onClick={() => setSelectedId(nft.id)}
            className={`group cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
              selectedId === nft.id 
                ? 'shadow-lg ring-2' 
                : 'hover:bg-white/20'
            }`}
            style={{
              borderColor: selectedId === nft.id ? '#d4af37' : 'rgba(212, 175, 55, 0.3)',
              background: selectedId === nft.id 
                ? 'rgba(212, 175, 55, 0.15)' 
                : 'rgba(255, 255, 255, 0.05)',
              boxShadow: selectedId === nft.id 
                ? '0 0 30px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                : '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* NFT Visual */}
            <div className={`w-full h-40 rounded-2xl mb-6 bg-gradient-to-br ${nft.gradient} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="text-6xl mb-2 opacity-90" style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}>
                  {nft.icon}
                </div>
                <div 
                  className="text-sm font-bold uppercase tracking-wider opacity-80"
                  style={{ 
                    color: nft.color,
                    textShadow: '0 0 10px rgba(255,255,255,0.5)',
                    filter: 'brightness(1.5)'
                  }}
                >
                  {nft.rarity}
                </div>
              </div>
              {selectedId === nft.id && (
                <div className="absolute top-3 right-3 bg-black/60 rounded-full p-1" style={{ color: '#d4af37' }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* NFT Info */}
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-lg mb-2 transition-colors" style={{ 
                color: selectedId === nft.id ? '#d4af37' : '#ffffff',
                fontFamily: 'serif'
              }}>
                {nft.name}
              </h3>
              <p className={`text-sm font-medium ${getRarityColor(nft.rarity)}`}>
                {nft.rarity}
              </p>
              <p className="text-amber-200/70 text-sm leading-relaxed px-2">
                {nft.description}
              </p>
            </div>

            {/* Selection Indicator */}
            {selectedId === nft.id && (
              <div className="mt-6 text-center">
                <span 
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm border font-medium"
                  style={{
                    background: 'rgba(212, 175, 55, 0.2)',
                    color: '#d4af37',
                    borderColor: 'rgba(212, 175, 55, 0.4)'
                  }}
                >
                  ✓ Selected
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-6 justify-center">
        <button
          onClick={onBack}
          className="px-8 py-4 font-semibold rounded-2xl border transition-all duration-300 text-lg hover:scale-105"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(212, 175, 55, 0.3)',
            color: '#d4af37',
            fontFamily: 'serif'
          }}
        >
          ← Back
        </button>
        <button
          onClick={handleSelect}
          disabled={!selectedId}
          className="px-10 py-4 font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105 text-lg border-2"
          style={{
            background: !selectedId 
              ? 'rgba(100, 100, 100, 0.3)' 
              : 'linear-gradient(135deg, #d4af37 0%, #ffd700 50%, #b8860b 100%)',
            borderColor: !selectedId ? 'rgba(100, 100, 100, 0.5)' : '#ffd700',
            color: !selectedId ? '#666' : '#1a0d2e',
            fontFamily: 'serif',
            boxShadow: !selectedId 
              ? 'none' 
              : '0 0 20px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          Generate ZK Proof →
        </button>
      </div>
    </div>
  )
}

export default NFTSelector
