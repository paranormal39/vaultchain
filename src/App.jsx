import { useState } from 'react'
import NFTSelector from './components/NFTSelector'
import ZKProofGenerator from './components/ZKProofGenerator'
import ModernOnChainDashboard from './components/ModernOnChainDashboard'
import VaultchainLanding from './components/VaultchainLanding'
import LaceWalletConnect from './components/LaceWalletConnect'
import './App.css'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [walletConnected, setWalletConnected] = useState(false)
  const [userAddress, setUserAddress] = useState(null)
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [zkProof, setZkProof] = useState(null)
  const [accessGranted, setAccessGranted] = useState(false)

  if (showLanding) {
    return <VaultchainLanding onEnterApp={() => setShowLanding(false)} />
  }

  return (
    <div className="vaultchain-app">
      {/* Step 1: Preview Wallet Auto-Connection */}
      {!walletConnected && (
        <div className="preview-wallet-connect">
          <div className="connect-header">
            <h2>🌙 Midnight Preview Wallet</h2>
            <p>Connecting to your preview wallet via MCP server...</p>
          </div>
          <button
            onClick={async () => {
              console.log('🔍 Attempting to connect to preview wallet...')
              try {
                // Try multiple endpoints to find the wallet
                const endpoints = [
                  'http://localhost:3000/wallet/balance',
                  'http://localhost:3000/wallet/address', 
                  'http://localhost:3000/health'
                ]
                
                let connected = false
                let walletAddress = null
                
                for (const endpoint of endpoints) {
                  try {
                    console.log(`🔍 Trying endpoint: ${endpoint}`)
                    const response = await fetch(endpoint, { timeout: 2000 })
                    if (response.ok) {
                      const data = await response.json()
                      console.log(`✅ Response from ${endpoint}:`, data)
                      
                      // Extract address from different response formats
                      walletAddress = data.address || data.walletAddress || data.wallet?.address
                      if (walletAddress) {
                        connected = true
                        break
                      }
                    }
                  } catch (err) {
                    console.log(`❌ ${endpoint} failed:`, err.message)
                  }
                }
                
                if (connected && walletAddress) {
                  setWalletConnected(true)
                  setUserAddress(walletAddress)
                  console.log('✅ Preview Wallet connected:', walletAddress)
                } else {
                  console.log('🔄 MCP server not available, using demo mode')
                  // Use a realistic demo address
                  const demoAddress = 'mn_shield-addr_test1demo_preview_wallet_for_hackathon_testing'
                  setWalletConnected(true)
                  setUserAddress(demoAddress)
                  console.log('✅ Demo mode activated with address:', demoAddress)
                }
              } catch (error) {
                console.error('❌ Preview wallet connection error:', error)
                // Fall back to demo mode with realistic address
                const demoAddress = 'mn_shield-addr_test1demo_preview_wallet_for_hackathon_testing'
                setWalletConnected(true)
                setUserAddress(demoAddress)
                console.log('✅ Demo mode activated with address:', demoAddress)
              }
            }}
            className="preview-connect-btn"
          >
            🔗 Connect Preview Wallet
          </button>
        </div>
      )}

      {/* Step 2: NFT Selection */}
      {walletConnected && !selectedNFT && (
        <NFTSelector 
          userAddress={userAddress || "demo-address"}
          onSelect={(nft) => {
            console.log('🔍 App - NFT selected:', nft)
            setSelectedNFT(nft)
          }}
          onBack={() => setWalletConnected(false)}
        />
      )}

      {/* Step 2: ZK Proof Generation */}
      {selectedNFT && !zkProof && (
        <ZKProofGenerator 
          nft={selectedNFT}
          userAddress={userAddress || "demo-address"}
          onProofGenerated={(proof) => {
            console.log('🔍 App - ZK Proof generated:', proof)
            setZkProof(proof)
            setAccessGranted(true)
          }}
          onBack={() => setSelectedNFT(null)}
          isNativeMode={false}
        />
      )}

      {/* Step 3: DAO Dashboard */}
      {accessGranted && (
        <ModernOnChainDashboard />
      )}
    </div>
  )
}

export default App
