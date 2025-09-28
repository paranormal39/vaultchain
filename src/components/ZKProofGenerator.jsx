import { useState } from 'react'
import { generateRealZKProof } from '../utils/contract-integration'
import { nativeMidnightContract } from '../utils/native-contract-integration'

const ZKProofGenerator = ({ nft, userAddress, onProofGenerated, onBack, isNativeMode = false }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [proof, setProof] = useState(null)
  const [currentMessage, setCurrentMessage] = useState('')

  const handleGenerateProof = async () => {
    console.log('🔍 ZKProofGenerator - handleGenerateProof called')
    console.log('🔍 ZKProofGenerator - selectedNFT:', nft)
    console.log('🔍 ZKProofGenerator - userAddress:', userAddress)
    
    setIsGenerating(true)
    setCurrentMessage('')
    setProgress(0)

    try {
      console.log('🔍 ZKProofGenerator - Calling nativeMidnightContract.generateZKProof...')
      let proof
      if (isNativeMode) {
        // Use native Midnight contract proof generation
        proof = await nativeMidnightContract.generateZKProof(
          nft.id, 
          userAddress, 
          (progress, message) => {
            console.log(`🔍 ZKProofGenerator - Progress update: ${progress}% - ${message}`)
            setProgress(progress)
            setCurrentMessage(message)
          }
        )
      } else {
        // Use XRPL demo proof generation
        proof = await generateRealZKProof(
          nft.id, 
          userAddress, 
          (progress, message) => {
            console.log(`🔍 ZKProofGenerator - Progress update: ${progress}% - ${message}`)
            setProgress(progress)
            setCurrentMessage(message)
          }
        )
      }
      
      console.log('🔍 ZKProofGenerator - Proof generated:', proof)
      setProgress(100)
      setCurrentMessage('Proof generated successfully!')
      
      // Brief delay to show completion
      setTimeout(() => {
        console.log('🔍 ZKProofGenerator - Calling onProofGenerated with proof')
        onProofGenerated(proof)
      }, 1000)
      
    } catch (error) {
      console.error('❌ ZKProofGenerator - Proof generation failed:', error)
      setCurrentMessage('Falling back to demo mode...')
      
      // Fallback to mock for demo if real proof fails
      const mockProof = {
        nftId: nft.id,
        merkleProof: isNativeMode ? "Midnight Guardians Collection" : "6620677555389692082",
        nullifier: Math.floor(Math.random() * 1000000000).toString(),
        zkProof: "0x" + Math.random().toString(16).substr(2, 64),
        timestamp: Date.now(),
        isReal: false,
        mode: isNativeMode ? 'native' : 'xrpl'
      }
      console.log('🔍 ZKProofGenerator - Fallback mock proof:', mockProof)
      onProofGenerated(mockProof)
      setProof(mockProof)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="text-center">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Generate ZK Proof</h2>
        <div className="bg-white/10 rounded-xl p-3 inline-block border border-white/20">
          <p className="text-midnight-100 text-sm">Connected: <span className="text-white font-mono text-xs">{userAddress.slice(0, 8)}...{userAddress.slice(-6)}</span></p>
        </div>
      </div>

      <div className="max-w-md mx-auto mb-6">
        <div className={`bg-gradient-to-br ${nft.gradient} rounded-xl p-4 border border-white/30 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
          <div className="relative z-10 text-center space-y-2">
            <div className="text-3xl mb-2">👻</div>
            <h3 className="text-white font-bold text-lg">{nft.name}</h3>
            <p className="text-white/90 text-sm">#{nft.id} • {nft.rarity}</p>
            <p className="text-white/70 text-xs leading-relaxed px-2">{nft.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto mb-6">
        <div className="bg-white/10 rounded-xl p-4 mb-4 border border-white/20">
          <h4 className="text-white font-semibold mb-3 text-base text-center">Verification Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-midnight-200">Wallet:</span>
              <span className="text-white font-mono text-xs">{userAddress.slice(0, 8)}...{userAddress.slice(-6)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-midnight-200">Collection:</span>
              <span className="text-white text-xs">{isNativeMode ? 'Midnight Guardians' : 'Wandering Soul'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-midnight-200">Privacy:</span>
              <span className="text-green-300 text-xs">✓ Zero-Knowledge</span>
            </div>
          </div>
        </div>

        {!isGenerating && !proof && (
          <>
            <div className="bg-white/10 rounded-xl p-4 mb-4 border border-white/20">
              <h4 className="text-white font-semibold mb-3 text-base text-center">Privacy Protection</h4>
              <ul className="text-midnight-100 text-xs space-y-2 text-left">
                <li className="flex items-start"><span className="text-yellow-400 mr-2">•</span> Your wallet address remains private</li>
                <li className="flex items-start"><span className="text-yellow-400 mr-2">•</span> Only NFT ownership is verified</li>
                <li className="flex items-start"><span className="text-yellow-400 mr-2">•</span> Zero-knowledge proof ensures anonymity</li>
                <li className="flex items-start"><span className="text-yellow-400 mr-2">•</span> No personal data is stored or transmitted</li>
              </ul>
            </div>
            
            <button
              onClick={handleGenerateProof}
              className="w-full px-6 py-3 bg-gradient-to-r from-midnight-600 to-purple-600 hover:from-midnight-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105 text-sm"
            >
              🔐 Generate {isNativeMode ? 'Native' : 'Real'} ZK Proof
            </button>
          </>
        )}
      </div>

      {isGenerating && (
        <div className="max-w-md mx-auto mb-4">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
              <span className="ml-3 text-white font-medium text-sm">Connecting to Proof Server...</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-midnight-100 text-xs text-center">{progress}% complete</p>
            {currentMessage && (
              <p className="text-yellow-300 text-xs text-center mt-1">{currentMessage}</p>
            )}
          </div>
        </div>
      )}

      {proof && (
        <div className="max-w-md mx-auto mb-4">
          <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
            <div className="text-center">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="text-white font-bold text-base mb-3">ZK Proof Generated!</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-midnight-200">Proof Type:</span>
                  <span className={proof.isReal ? "text-green-300" : "text-yellow-300"}>
                    {proof.isReal ? "🔐 Real ZK Proof" : "🎮 Demo Mode"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-midnight-200">NFT ID:</span>
                  <span className="text-white">#{proof.nftId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-midnight-200">Nullifier:</span>
                  <span className="text-white font-mono text-xs">{proof.nullifier.slice(0, 8)}...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          disabled={isGenerating}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-gray-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed text-sm"
        >
          ← Back
        </button>
        
        {proof && (
          <button
            onClick={() => onProofGenerated(proof)}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-105 text-sm"
          >
            Access Guild Content →
          </button>
        )}
      </div>
    </div>
  )
}

export default ZKProofGenerator
