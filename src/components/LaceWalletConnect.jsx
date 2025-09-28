import React, { useState, useEffect } from 'react'
import { nativeMidnightContract, detectLaceWallet } from '../utils/native-contract-integration'

const LaceWalletConnect = ({ onWalletConnect, onWalletDisconnect }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [laceAvailable, setLaceAvailable] = useState(false)
  const [previewWalletAvailable, setPreviewWalletAvailable] = useState(false)
  const [walletType, setWalletType] = useState(null) // 'lace', 'preview', or 'demo'
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if Lace wallet is available
    const laceDetected = detectLaceWallet()
    setLaceAvailable(laceDetected)
    
    // Check if Preview Wallet (MCP server) is available
    checkPreviewWallet()
    
    // Check if already connected
    if (nativeMidnightContract.isWalletConnected()) {
      const address = nativeMidnightContract.walletAddress
      setIsConnected(true)
      setWalletAddress(address)
      setWalletType('lace')
      // Automatically proceed if already connected
      onWalletConnect && onWalletConnect({ success: true, address, type: 'lace' })
    }
  }, [onWalletConnect])

  const checkPreviewWallet = async () => {
    try {
      // Check if MCP server (preview wallet) is running on port 3000
      const response = await fetch('http://localhost:3000/health', { 
        timeout: 2000 
      })
      if (response.ok) {
        setPreviewWalletAvailable(true)
        console.log('✅ Preview Wallet (MCP Server) detected on port 3000')
      }
    } catch (error) {
      console.log('❌ Preview Wallet not available:', error.message)
      setPreviewWalletAvailable(false)
    }
  }

  const handleConnectLace = async () => {
    console.log('🔍 LaceWalletConnect - handleConnectLace called')
    setIsConnecting(true)
    setError(null)
    
    try {
      console.log('🔍 LaceWalletConnect - Calling nativeMidnightContract.connectLaceWallet()')
      const result = await nativeMidnightContract.connectLaceWallet()
      console.log('🔍 LaceWalletConnect - connectLaceWallet result:', result)
      
      if (result.success) {
        console.log('🔍 LaceWalletConnect - Connection successful, updating local state')
        console.log('🔍 LaceWalletConnect - Result address:', result.address)
        setIsConnected(true)
        setWalletAddress(result.address)
        setWalletType('lace')
        console.log('🔍 LaceWalletConnect - Calling onWalletConnect with result:', result)
        onWalletConnect && onWalletConnect({ ...result, type: 'lace' })
      } else {
        console.log('🔍 LaceWalletConnect - Connection failed:', result.error)
        setError(result.error)
      }
    } catch (err) {
      console.log('🔍 LaceWalletConnect - Exception caught:', err.message)
      setError(err.message)
    } finally {
      console.log('🔍 LaceWalletConnect - Setting isConnecting to false')
      setIsConnecting(false)
    }
  }

  const handleConnectPreview = async () => {
    console.log('🔍 LaceWalletConnect - handleConnectPreview called')
    setIsConnecting(true)
    setError(null)
    
    try {
      // Connect to Preview Wallet via MCP server
      const response = await fetch('http://localhost:3000/wallet/address')
      if (response.ok) {
        const walletData = await response.json()
        const address = walletData.address
        
        console.log('✅ Preview Wallet connected:', address)
        setIsConnected(true)
        setWalletAddress(address)
        setWalletType('preview')
        onWalletConnect && onWalletConnect({ 
          success: true, 
          address: address, 
          type: 'preview',
          isPreview: true 
        })
      } else {
        throw new Error('Failed to connect to Preview Wallet')
      }
    } catch (err) {
      console.log('❌ Preview Wallet connection failed:', err.message)
      setError(err.message)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    await nativeMidnightContract.disconnectLaceWallet()
    setIsConnected(false)
    setWalletAddress(null)
    onWalletDisconnect && onWalletDisconnect()
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 12)}...${address.slice(-8)}`
  }

  if (!laceAvailable) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Lace Wallet Required
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Please install the{' '}
                <a 
                  href="https://www.lace.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-yellow-600"
                >
                  Lace Wallet
                </a>
                {' '}extension to use native Midnight features.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lace-wallet-connect">
      {!isConnected ? (
        <div className="connect-section">
          <div className="connect-header">
            <h2>Connect to Midnight Network</h2>
            <p>Connect your Lace wallet to access privacy-first DAO treasury management</p>
          </div>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="connect-button"
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                </svg>
                Connect Lace Wallet
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Lace Wallet Connected
                </h3>
                <p className="text-sm text-green-700 font-mono">
                  {formatAddress(walletAddress)}
                </p>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="ml-3 inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Connection Error
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LaceWalletConnect
