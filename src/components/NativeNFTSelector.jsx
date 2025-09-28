import React, { useState, useEffect } from 'react'
import { nativeMidnightContract } from '../utils/native-contract-integration'

const NativeNFTSelector = ({ userAddress, onNFTSelected, onBack }) => {
  const [ownedNFTs, setOwnedNFTs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedNFT, setSelectedNFT] = useState(null)

  useEffect(() => {
    if (userAddress) {
      fetchOwnedNFTs()
    } else {
      setOwnedNFTs([])
    }
  }, [userAddress])

  const fetchOwnedNFTs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const nfts = await nativeMidnightContract.getOwnedGuardianNFTs()
      setOwnedNFTs(nfts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': 'bg-gray-100 text-gray-800 border-gray-300',
      'Rare': 'bg-blue-100 text-blue-800 border-blue-300',
      'Epic': 'bg-purple-100 text-purple-800 border-purple-300',
      'Legendary': 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
    return colors[rarity] || colors['Common']
  }

  const getPowerBarColor = (power) => {
    if (power >= 95) return 'bg-red-500'
    if (power >= 85) return 'bg-purple-500'
    if (power >= 75) return 'bg-blue-500'
    return 'bg-gray-500'
  }

  if (!userAddress) {
    return (
      <div className="text-center py-8">
        <div className="text-amber-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-amber-100 mb-2 fantasy-text">Connect Your Lace Wallet</h3>
        <p className="text-amber-200">Connect your wallet to view your Midnight Guardian NFTs</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-amber-200">Loading your Midnight Guardian NFTs...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading NFTs</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={fetchOwnedNFTs}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (ownedNFTs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Midnight Guardian NFTs Found</h3>
        <p className="text-gray-600">You don't own any Midnight Guardian NFTs in this wallet.</p>
        <p className="text-sm text-gray-500 mt-2">For demo purposes, we've added a sample NFT below.</p>
      </div>
    )
  }

  return (
    <div className="nft-selector-container">
      <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-amber-100 mb-2 fantasy-text">Your Midnight Guardian NFTs</h3>
        <p className="text-amber-200">Select an NFT to generate a privacy-preserving proof</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ownedNFTs.map((nft) => (
          <div
            key={nft.id}
            className="fantasy-card rounded-lg p-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl border border-amber-400/30 hover:border-amber-400/60"
            onClick={() => {
              setSelectedNFT(nft)
              onNFTSelected(nft)
            }}
          >
            {/* NFT Image Placeholder */}
            <div className="w-full h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-white text-xl font-bold">#{nft.id}</span>
            </div>

            {/* NFT Details */}
            <div className="space-y-2">
              <h4 className="font-semibold text-amber-100 fantasy-text">{nft.name}</h4>
              
              {/* Rarity Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(nft.rarity)}`}>
                  {nft.rarity}
                </span>
                <span className="text-sm text-amber-300">ID: {nft.id}</span>
              </div>

              {/* Power Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-amber-300">
                  <span>Power</span>
                  <span>{nft.power}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getPowerBarColor(nft.power)}`}
                    style={{ width: `${nft.power}%` }}
                  ></div>
                </div>
              </div>

              {/* Collection Info */}
              <div className="text-xs text-amber-400">
                Collection: {nft.collection}
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedNFT?.id === nft.id && (
              <div className="absolute top-2 right-2">
                <div className="bg-purple-500 text-white rounded-full p-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      
      <div className="flex justify-center mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg text-sm"
        >
          ← Back
        </button>
      </div>
      </div>
    </div>
  )
}

export default NativeNFTSelector
