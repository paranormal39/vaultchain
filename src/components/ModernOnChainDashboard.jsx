import React, { useState, useEffect } from 'react'
import './ModernOnChainDashboard.css'
import { onChainDAO } from '../services/OnChainDAOService-multichain.js'
import AIAgentChat from './AIAgentChat.jsx'

const ModernOnChainDashboard = () => {
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "🛡️ Emergency Fund Allocation",
      description: "Allocate 500 DUST to emergency reserves for market volatility protection and unexpected treasury needs.",
      amount: 500,
      status: "active",
      votes: { yes: 12, no: 3 }
    },
    {
      id: 2,
      title: "🔧 Development Sprint Funding",
      description: "Fund Q1 2025 development sprint for cross-chain bridge enhancements and AI agent improvements.",
      amount: 1200,
      status: "pending",
      votes: { yes: 8, no: 1 }
    },
    {
      id: 3,
      title: "🌉 XRPL Integration Expansion",
      description: "Expand cross-chain capabilities to include automated market making and liquidity provision on XRPL.",
      amount: 800,
      status: "active",
      votes: { yes: 15, no: 2 }
    }
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [treasuryStats, setTreasuryStats] = useState(null)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [membershipStatus, setMembershipStatus] = useState({
    membershipLevel: "Gold Member",
    votingPower: "2.5x",
    isMember: true
  })
  const [activeTab, setActiveTab] = useState('overview')
  const [contractStatus, setContractStatus] = useState(null)
  const [cryptoData, setCryptoData] = useState([])
  const [mcpStatus, setMcpStatus] = useState('disconnected')
  const [aiAgentStatus, setAiAgentStatus] = useState('demo')
  const [walletData, setWalletData] = useState(null)
  const [sendAmount, setSendAmount] = useState('')
  const [sendAddress, setSendAddress] = useState('')
  const [sending, setSending] = useState(false)
  const [multiChainData, setMultiChainData] = useState(null)
  const [xrplWallets, setXrplWallets] = useState([])
  const [crossChainAmount, setCrossChainAmount] = useState('')
  const [crossChainTarget, setCrossChainTarget] = useState('xrpl')
  const [crossChainProcessing, setCrossChainProcessing] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setError(null)
      
      console.log('🔗 Loading dashboard data...')
      
      // Load all data - separate treasury from user wallet
      const [treasuryResponse, proposalsResponse, tokenResponse, membershipResponse, contractResponse, userWalletResponse, cryptoResponse, multiChainResponse, xrplWalletsResponse] = await Promise.all([
        onChainDAO.getTreasuryBalance(),
        onChainDAO.getProposals(),
        onChainDAO.getTokenBalance(),
        onChainDAO.getMembershipStatus(),
        onChainDAO.getContractStatus(),
        onChainDAO.getUserWalletBalance(),
        onChainDAO.getCryptoData(),
        onChainDAO.getMultiChainDashboard(),
        onChainDAO.getXRPLWallets()
      ])
      
      // Set treasury stats with proper structure
      setTreasuryStats({
        totalBalance: treasuryResponse.balance || 0,
        allocations: {
          emergency: (treasuryResponse.balance || 0) * 0.2,
          development: (treasuryResponse.balance || 0) * 0.3,
          marketing: (treasuryResponse.balance || 0) * 0.15,
          reserves: (treasuryResponse.balance || 0) * 0.35
        },
        currency: treasuryResponse.currency || 'DUST',
        status: treasuryResponse.status || 'connected'
      })
      
      // Only update proposals if we get valid data, otherwise keep existing ones
      if (proposalsResponse && Array.isArray(proposalsResponse)) {
        setProposals(proposalsResponse)
      } else if (proposalsResponse && proposalsResponse.active && Array.isArray(proposalsResponse.active)) {
        setProposals(proposalsResponse.active)
      }
      // If no valid proposals from contract, keep existing proposals (don't clear them)
      setTokenBalance(tokenResponse)
      setMembershipStatus(membershipResponse)
      setContractStatus(contractResponse)
      setWalletData(userWalletResponse)
      setCryptoData(cryptoResponse)
      
      // Set multi-chain data
      if (multiChainResponse.success) {
        setMultiChainData(multiChainResponse.data)
      }
      
      // Set XRPL wallets
      if (xrplWalletsResponse.success) {
        setXrplWallets(xrplWalletsResponse.wallets)
      }
      
      // Update connection status based on successful data loading
      if (treasuryResponse.success || userWalletResponse.success) {
        setMcpStatus('connected')
      } else {
        setMcpStatus('disconnected')
      }
      
      // Update wallet data with connection status
      if (userWalletResponse && userWalletResponse.address) {
        setWalletData({
          ...userWalletResponse,
          status: 'connected'
        })
      } else {
        setWalletData({
          status: 'disconnected',
          balance: 0,
          address: null
        })
      }
      
      console.log('✅ Dashboard data loaded successfully')
      
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendFunds = async () => {
    if (!sendAddress || !sendAmount) {
      alert('Please enter both address and amount')
      return
    }
    
    try {
      setSending(true)
      const result = await onChainDAO.sendFunds(sendAddress, sendAmount)
      
      if (result.success) {
        alert(`✅ Successfully sent ${sendAmount} DUST!\nTransaction: ${result.txHash}`)
        setSendAddress('')
        setSendAmount('')
        // Refresh wallet data
        const walletResponse = await onChainDAO.getUserWalletBalance()
        setWalletData(walletResponse)
      } else {
        alert(`❌ Transaction failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Send funds error:', error)
      alert(`❌ Transaction failed: ${error.message}`)
    } finally {
      setSending(false)
    }
  }

  const handleCrossChainDeposit = async () => {
    if (!crossChainAmount) {
      alert('Please enter an amount for cross-chain deposit')
      return
    }
    
    try {
      setCrossChainProcessing(true)
      const result = await onChainDAO.initiateCrossChainDeposit(crossChainAmount, crossChainTarget)
      
      if (result.success) {
        // Show detailed wallet creation popup
        if (result.xrplWallet) {
          const walletInfo = `🎉 XRPL Wallet Created Successfully!

💰 Deposit: ${result.amount} DUST → Treasury
🔗 XRPL Wallet Address: ${result.xrplWallet.address}
👤 User ID: ${result.userId}
📋 Transaction: ${result.transactionId}

🔍 Check on XRPL Explorer:
https://testnet.xrpl.org/accounts/${result.xrplWallet.address}

💧 Fund with testnet XRP:
https://xrpl.org/xrp-testnet-faucet.html`
          
          alert(walletInfo)
          
          // Copy address to clipboard
          if (navigator.clipboard) {
            navigator.clipboard.writeText(result.xrplWallet.address)
            console.log('📋 XRPL address copied to clipboard!')
          }
        } else {
          alert(`🌉 ${result.message}\n\nTransaction ID: ${result.transactionId}\nEstimated Time: ${result.estimatedTime}`)
        }
        
        setCrossChainAmount('')
        
        // Refresh all data to show new wallet
        loadDashboardData()
      } else {
        alert(`❌ Cross-chain deposit failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Cross-chain deposit error:', error)
      alert(`❌ Cross-chain deposit failed: ${error.message}`)
    } finally {
      setCrossChainProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading VaultChain DAO Dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="retry-button">
          🔄 Retry
        </button>
      </div>
    )
  }

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-main">
            <h1>🌙 VaultChain DAO</h1>
            <p className="header-subtitle">Privacy-First Treasury Management</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Treasury</span>
              <span className="stat-value">{treasuryStats?.totalBalance?.toFixed(2) || '0'} DUST</span>
            </div>
            <div className="stat-item wallet-status-item">
              <span className="stat-label">Wallet</span>
              <span className={`stat-value status-${walletData?.status || 'disconnected'}`}>
                {walletData?.status === 'connected' ? '🟢 Connected' : 
                 walletData?.address ? '🟡 Detected' : '🔴 Disconnected'}
              </span>
              {(!walletData?.status || walletData?.status === 'disconnected') && (
                <button 
                  className="connect-wallet-btn"
                  onClick={async () => {
                    try {
                      // Refresh wallet data to check connection
                      const walletResponse = await onChainDAO.getUserWalletBalance();
                      if (walletResponse && walletResponse.address) {
                        setWalletData({
                          ...walletResponse,
                          status: 'connected'
                        });
                        alert('✅ Wallet connected successfully!');
                      } else {
                        alert('❌ No wallet detected. Please ensure your Midnight wallet is active.');
                      }
                    } catch (error) {
                      alert(`❌ Connection failed: ${error.message}`);
                    }
                  }}
                >
                  Connect
                </button>
              )}
            </div>
            <div className="stat-item">
              <span className="stat-label">Network</span>
              <span className={`stat-value status-${mcpStatus}`}>
                {mcpStatus === 'connected' ? '🌙 Midnight' : '❌ Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'treasury', icon: '💰', label: 'Treasury' },
            { id: 'governance', icon: '🏛️', label: 'Governance' },
            { id: 'wallet', icon: '👛', label: 'Wallet' },
            { id: 'tokens', icon: '🪙', label: 'Tokens' },
            { id: 'ai-agent', icon: '🤖', label: 'AI Agent' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="content-container">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content overview-tab">
              <div className="overview-grid">
                <div className="overview-card treasury-card">
                  <div className="card-header">
                    <h3>💰 Treasury</h3>
                    <span className="card-status connected">Connected</span>
                  </div>
                  <div className="card-content">
                    <div className="main-stat">
                      <span className="stat-number">{treasuryStats?.totalBalance?.toFixed(2) || '0'}</span>
                      <span className="stat-unit">DUST</span>
                    </div>
                    <p className="stat-description">Total Treasury Balance</p>
                  </div>
                </div>

                <div className="overview-card governance-card">
                  <div className="card-header">
                    <h3>🏛️ Governance</h3>
                    <span className="card-status active">Active</span>
                  </div>
                  <div className="card-content">
                    <div className="main-stat">
                      <span className="stat-number">{proposals.length}</span>
                      <span className="stat-unit">Proposals</span>
                    </div>
                    <p className="stat-description">Active Governance Proposals</p>
                  </div>
                </div>

                <div className="overview-card wallet-card">
                  <div className="card-header">
                    <h3>👛 Wallet</h3>
                    <span className={`card-status ${walletData?.status || 'disconnected'}`}>
                      {walletData?.status === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="card-content">
                    <div className="main-stat">
                      <span className="stat-number">{walletData?.balance?.toFixed(2) || '0'}</span>
                      <span className="stat-unit">DUST</span>
                    </div>
                    <p className="stat-description">Wallet Balance</p>
                  </div>
                </div>

                <div className="overview-card tokens-card">
                  <div className="card-header">
                    <h3>🪙 Tokens</h3>
                  </div>
                  <div className="card-content">
                    <div className="token-balance">
                      <span className="token-amount">{tokenBalance?.userBalance || 0}</span>
                      <span className="token-symbol">VLT</span>
                    </div>
                    <p className="token-description">DAO Governance Tokens</p>
                  </div>
                </div>
              </div>

              {cryptoData.length > 0 && (
                <div className="market-section">
                  <h3>📈 Market Overview</h3>
                  <div className="crypto-grid">
                    {cryptoData && cryptoData.length > 0 ? cryptoData.map((crypto) => (
                      <div key={crypto.id || crypto.symbol} className="crypto-card">
                        <div className="crypto-header">
                          <h4>{crypto.symbol || 'N/A'}</h4>
                          <span className={`crypto-change ${(crypto.change24h || 0) >= 0 ? 'positive' : 'negative'}`}>
                            {(crypto.change24h || 0) >= 0 ? '+' : ''}{(crypto.change24h || 0).toFixed(2)}%
                          </span>
                        </div>
                        <p className="crypto-name">{crypto.name || crypto.symbol || 'Unknown'}</p>
                        <p className="crypto-price">
                          ${(crypto.price || 0).toLocaleString(undefined, { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6
                          })}
                        </p>
                      </div>
                    )) : (
                      <div className="crypto-loading">
                        <p>Loading market data...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Treasury Tab */}
          {activeTab === 'treasury' && (
            <div className="tab-content treasury-tab">
              <div className="treasury-header">
                <h3>💰 Multi-Chain Treasury Management</h3>
                <p>Monitor and manage DAO treasury funds across Midnight and XRPL networks</p>
              </div>
              <div className="treasury-overview">
                <div className="treasury-balances">
                  <div className="treasury-balance-item midnight">
                    <div className="balance-header">
                      <span className="chain-icon">🌙</span>
                      <span className="chain-name">Midnight Network</span>
                    </div>
                    <div className="balance-amount">
                      <span className="amount">{treasuryStats?.totalBalance?.toFixed(2) || '0'}</span>
                      <span className="unit">DUST</span>
                    </div>
                  </div>
                  
                  <div className="treasury-balance-item xrpl">
                    <div className="balance-header">
                      <span className="chain-icon">🔗</span>
                      <span className="chain-name">XRPL Network</span>
                    </div>
                    <div className="balance-amount">
                      <span className="amount">
                        {multiChainData?.chains?.xrpl?.wallets?.filter(w => w.isTreasuryWallet)?.length || 1}
                      </span>
                      <span className="unit">Treasury Wallets</span>
                    </div>
                    {multiChainData?.chains?.xrpl?.wallets?.find(w => w.isTreasuryWallet) && (
                      <div className="treasury-xrpl-address">
                        <code onClick={() => {
                          const treasuryWallet = multiChainData.chains.xrpl.wallets.find(w => w.isTreasuryWallet);
                          if (navigator.clipboard && treasuryWallet) {
                            navigator.clipboard.writeText(treasuryWallet.address);
                            alert('📋 Treasury XRPL address copied!');
                          }
                        }}>
                          {multiChainData.chains.xrpl.wallets.find(w => w.isTreasuryWallet)?.address?.substring(0, 12)}...
                        </code>
                        <button 
                          onClick={() => {
                            const treasuryWallet = multiChainData.chains.xrpl.wallets.find(w => w.isTreasuryWallet);
                            if (navigator.clipboard && treasuryWallet) {
                              navigator.clipboard.writeText(treasuryWallet.address);
                              alert('📋 Address copied!');
                            }
                          }}
                          className="copy-btn-small"
                        >
                          📋
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="treasury-subtitle">Multi-Chain Decentralized Asset Management</p>
              </div>
              {treasuryStats?.allocations && (
                <div className="allocation-grid">
                  {Object.entries(treasuryStats.allocations).map(([key, value]) => (
                    <div key={key} className="allocation-card">
                      <div className="allocation-header">
                        <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                        <span className="allocation-percentage">
                          {((value / treasuryStats.totalBalance) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="allocation-amount">{value.toLocaleString()} DUST</p>
                      <div className="allocation-bar">
                        <div 
                          className="allocation-fill" 
                          style={{width: `${(value / treasuryStats.totalBalance) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="treasury-actions">
                <h4>🎯 Treasury Actions</h4>
                <div className="treasury-action-grid">
                  <button 
                    onClick={() => onChainDAO.addEmergencyFunds(500)}
                    className="treasury-action-btn emergency"
                  >
                    <div className="action-icon">🛡️</div>
                    <div className="action-info">
                      <h5>Emergency Fund</h5>
                      <p>Add 500 DUST to emergency reserves</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => onChainDAO.addToken()}
                    className="treasury-action-btn development"
                  >
                    <div className="action-icon">🪙</div>
                    <div className="action-info">
                      <h5>Mint Tokens</h5>
                      <p>Create new governance tokens</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={loadDashboardData}
                    className="treasury-action-btn refresh"
                  >
                    <div className="action-icon">🔄</div>
                    <div className="action-info">
                      <h5>Refresh Data</h5>
                      <p>Update treasury information</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Multi-Chain Assets Section */}
              <div className="multichain-assets">
                <h4>🌐 Cross-Chain Assets</h4>
                
                {/* Midnight Network */}
                <div className="chain-section midnight-chain">
                  <div className="chain-header">
                    <h5>🌙 Midnight Network</h5>
                    <span className="chain-balance">{treasuryStats?.totalBalance?.toFixed(2) || '0'} DUST</span>
                  </div>
                  <p className="chain-description">Primary treasury holding ZK-privacy tokens</p>
                </div>

                {/* XRPL Network */}
                <div className="chain-section xrpl-chain">
                  <div className="chain-header">
                    <h5>🔗 XRPL Network</h5>
                    <span className="chain-balance">{multiChainData?.chains?.xrpl?.totalWallets || 0} Wallets</span>
                  </div>
                  <p className="chain-description">Cross-chain wallets managed by Xara AI</p>
                  
                  {multiChainData?.chains?.xrpl?.wallets && multiChainData.chains.xrpl.wallets.length > 0 && (
                    <div className="xrpl-wallets-list">
                      <h6>📋 Managed XRPL Wallets:</h6>
                      <div className="wallets-grid">
                        {multiChainData.chains.xrpl.wallets.map((wallet, index) => (
                          <div key={wallet.address} className={`wallet-item ${wallet.isUserWallet ? 'user-wallet' : 'system-wallet'}`}>
                            <div className="wallet-header">
                              <span className="wallet-type">
                                {wallet.isUserWallet ? '👤 User' : '🤖 System'}
                              </span>
                              {wallet.userId && (
                                <span className="user-id">ID: {wallet.userId}</span>
                              )}
                            </div>
                            <div className="wallet-address">
                              <code onClick={() => {
                                if (navigator.clipboard) {
                                  navigator.clipboard.writeText(wallet.address)
                                  alert('📋 Address copied to clipboard!')
                                }
                              }} style={{cursor: 'pointer', textDecoration: 'underline'}}>
                                {wallet.address.substring(0, 12)}...{wallet.address.substring(-8)}
                              </code>
                              <button 
                                onClick={() => {
                                  if (navigator.clipboard) {
                                    navigator.clipboard.writeText(wallet.address)
                                    alert('📋 Address copied!')
                                  }
                                }}
                                className="copy-btn"
                                title="Copy address"
                              >
                                📋
                              </button>
                            </div>
                            <div className="wallet-balance">
                              <span>{wallet.balance} XRP</span>
                              {wallet.error && (
                                <small className="wallet-error">⚠️ Unfunded</small>
                              )}
                            </div>
                            <div className="wallet-actions">
                              <a 
                                href={`https://testnet.xrpl.org/accounts/${wallet.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="explorer-link"
                              >
                                🔍 Explorer
                              </a>
                              <a 
                                href="https://xrpl.org/xrp-testnet-faucet.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="faucet-link"
                              >
                                💧 Fund
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Governance Tab */}
          {activeTab === 'governance' && (
            <div className="tab-content governance-tab">
              <div className="governance-header">
                <h3>🏛️ DAO Governance</h3>
                <p>Participate in decentralized decision making</p>
              </div>

              {membershipStatus && (
                <div className="membership-status">
                  <h4>Your Membership</h4>
                  <div className="membership-info">
                    <span className="membership-level">{membershipStatus.membershipLevel}</span>
                    <span className="voting-power">Voting Power: {membershipStatus.votingPower}</span>
                    <span className={`member-badge ${membershipStatus.isMember ? 'active' : 'inactive'}`}>
                      {membershipStatus.isMember ? '✅ Active Member' : '❌ Not a Member'}
                    </span>
                  </div>
                </div>
              )}

              <div className="proposals-section">
                <div className="proposals-header">
                  <h4>Active Proposals</h4>
                  <div className="proposal-actions-header">
                    <button 
                      className="generate-proposal-btn"
                      onClick={() => {
                        // Generate a new AI proposal
                        const newProposal = {
                          id: proposals.length + 1,
                          title: "🤖 AI-Generated Treasury Optimization",
                          description: "Matthew AI recommends diversifying treasury holdings by allocating 300 DUST to cross-chain liquidity pools for enhanced yield generation and risk mitigation.",
                          amount: 300,
                          status: "active",
                          votes: { yes: 0, no: 0 },
                          contractAddress: onChainDAO.contracts?.daoGovernance || '02003f8e2a8b2724669742c076fa2f8112f29bd6100c4753802afc3ee2fae5451817',
                          onChain: true,
                          network: "Midnight TestNet",
                          aiGenerated: true,
                          isRealContract: true
                        }
                        setProposals(prev => [newProposal, ...prev])
                        alert('🤖 Matthew AI has generated a new treasury optimization proposal! Check the proposals list below.')
                      }}
                    >
                      <span className="btn-icon">🤖</span>
                      <span>Generate AI Proposal</span>
                    </button>
                    
                    <button 
                      className="create-proposal-btn"
                      onClick={() => {
                        const title = prompt("Enter proposal title:");
                        if (!title) return;
                        
                        const description = prompt("Enter proposal description:");
                        if (!description) return;
                        
                        const amount = prompt("Enter DUST amount:");
                        if (!amount || isNaN(amount)) return;
                        
                        // Create proposal using real contract service
                        onChainDAO.createProposal(title, description, parseInt(amount))
                          .then(result => {
                            if (result.success) {
                              alert(`✅ ${result.message}\n\nProposal ID: ${result.proposalId}\nTx: ${result.txHash}\nContract: ${result.contractAddress}`);
                              loadDashboardData(); // Refresh proposals
                            } else {
                              alert(`❌ Failed to create proposal: ${result.error}`);
                            }
                          })
                          .catch(error => {
                            alert(`❌ Error: ${error.message}`);
                          });
                      }}
                    >
                      <span className="btn-icon">📝</span>
                      <span>Create Proposal</span>
                    </button>
                    
                    <button 
                      className="clear-proposals-btn"
                      onClick={() => {
                        if (confirm("Are you sure you want to clear all proposals? This will remove both AI-generated and contract proposals.")) {
                          setProposals([]);
                          alert('🗑️ All proposals cleared successfully!');
                        }
                      }}
                    >
                      <span className="btn-icon">🗑️</span>
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>
                {proposals.length > 0 ? (
                  <div className="proposals-list">
                    {proposals.map((proposal) => (
                      <div key={proposal.id} className={`proposal-card ${proposal.onChain ? 'on-chain' : 'simulated'}`}>
                        <div className="proposal-header">
                          <h5>{proposal.title}</h5>
                          {proposal.onChain && (
                            <div className="proposal-badges">
                              <span className="badge on-chain-badge">🌙 On-Chain</span>
                              {proposal.aiGenerated && (
                                <span className="badge ai-badge">🤖 AI Generated</span>
                              )}
                            </div>
                          )}
                          <span className={`proposal-status ${proposal.status}`}>{proposal.status}</span>
                        </div>
                        <p className="proposal-description">{proposal.description}</p>
                        <div className="proposal-details">
                          <span className="proposal-amount">{proposal.amount} DUST</span>
                          <div className="vote-counts">
                            <span className="yes-votes">👍 {proposal.votes.yes}</span>
                            <span className="no-votes">👎 {proposal.votes.no}</span>
                          </div>
                        </div>
                        
                        {proposal.isRealContract && (
                          <div className="proposal-actions">
                            <button 
                              onClick={async () => {
                                try {
                                  const result = await onChainDAO.voteOnProposal(proposal.id, 'yes');
                                  if (result.success) {
                                    alert(`✅ ${result.message}\n\nTx: ${result.txHash}\nContract: ${result.contractAddress}`);
                                    loadDashboardData(); // Refresh data
                                  } else {
                                    alert(`❌ Vote failed: ${result.error}`);
                                  }
                                } catch (error) {
                                  alert(`❌ Error: ${error.message}`);
                                }
                              }}
                              className="vote-btn yes-btn"
                            >
                              👍 Vote Yes
                            </button>
                            <button 
                              onClick={async () => {
                                try {
                                  const result = await onChainDAO.voteOnProposal(proposal.id, 'no');
                                  if (result.success) {
                                    alert(`✅ ${result.message}\n\nTx: ${result.txHash}\nContract: ${result.contractAddress}`);
                                    loadDashboardData(); // Refresh data
                                  } else {
                                    alert(`❌ Vote failed: ${result.error}`);
                                  }
                                } catch (error) {
                                  alert(`❌ Error: ${error.message}`);
                                }
                              }}
                              className="vote-btn no-btn"
                            >
                              👎 Vote No
                            </button>
                          </div>
                        )}
                        
                        {proposal.contractAddress && (
                          <div className="proposal-contract-info">
                            <small>
                              <strong>Contract:</strong> <code>{proposal.contractAddress.substring(0, 12)}...</code>
                              {proposal.fallbackMode && <span className="fallback-badge"> (Fallback Mode)</span>}
                              {proposal.isRealContract && <span className="real-contract-badge"> (Real Contract)</span>}
                            </small>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-proposals">
                    <p>No active proposals at this time</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="tab-content wallet-tab">
              <div className="wallet-header">
                <h3>👛 Wallet Management</h3>
                <p>Manage your DUST tokens and transactions</p>
              </div>

              {walletData ? (
                <div className="wallet-overview">
                  <div className="wallet-balance-card">
                    <h4>Current Balance</h4>
                    <div className="balance-display">
                      <span className="balance-amount">{walletData.balance?.toFixed(6) || '0'}</span>
                      <span className="balance-currency">DUST</span>
                    </div>
                    <div className="balance-usd">
                      ≈ ${((walletData.balance || 0) * 0.85).toFixed(2)} USD
                    </div>
                  </div>

                  <div className="wallet-info-card">
                    <h4>Wallet Information</h4>
                    <div className="wallet-details">
                      <div className="detail-item">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">{walletData.address || 'Not connected'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Network:</span>
                        <span className="detail-value">{walletData.network || 'Unknown'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className={`detail-value status-${walletData.status}`}>
                          {walletData.status === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="wallet-loading">
                  <p>Loading wallet data...</p>
                </div>
              )}

              <div className="send-funds-section">
                <h4>💸 Send Funds</h4>
                <div className="treasury-quick-actions">
                  <button 
                    onClick={() => setSendAddress('midnight1dao7reasurer0racle0f7he0midnight0realm')}
                    className="quick-action-btn"
                  >
                    🏛️ Send to Treasury
                  </button>
                  <button 
                    onClick={() => setSendAddress('')}
                    className="quick-action-btn"
                  >
                    🔄 Clear Address
                  </button>
                </div>
                <div className="send-form">
                  <div className="form-group">
                    <label>Recipient Address</label>
                    <input
                      type="text"
                      value={sendAddress}
                      onChange={(e) => setSendAddress(e.target.value)}
                      placeholder="Enter recipient address"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount (DUST)</label>
                    <input
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="form-input"
                    />
                  </div>
                  <button 
                    onClick={handleSendFunds}
                    disabled={sending || !sendAddress || !sendAmount}
                    className="send-btn"
                  >
                    {sending ? '⏳ Sending...' : '💸 Send DUST'}
                  </button>
                </div>
              </div>

              <div className="cross-chain-section">
                <div className="cross-chain-header">
                  <h4>🌉 Cross-Chain Bridge</h4>
                  <p>Deposit DUST to automatically create wallets on other chains via Matthew AI</p>
                </div>
                
                <div className="cross-chain-form">
                  <div className="form-group">
                    <label>Target Chain</label>
                    <select
                      value={crossChainTarget}
                      onChange={(e) => setCrossChainTarget(e.target.value)}
                      className="form-input chain-select"
                    >
                      <option value="xrpl">🔗 XRPL (XRP Ledger)</option>
                      <option value="ethereum" disabled>⚡ Ethereum (Coming Soon)</option>
                      <option value="bitcoin" disabled>₿ Bitcoin (Coming Soon)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Amount (DUST)</label>
                    <input
                      type="number"
                      value={crossChainAmount}
                      onChange={(e) => setCrossChainAmount(e.target.value)}
                      placeholder="Enter amount to bridge"
                      className="form-input bridge-amount"
                    />
                  </div>
                  <button 
                    onClick={handleCrossChainDeposit}
                    disabled={crossChainProcessing || !crossChainAmount}
                    className="cross-chain-btn enhanced"
                  >
                    {crossChainProcessing ? (
                      <>
                        <span className="btn-icon">⏳</span>
                        <span>Processing Bridge...</span>
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">🌉</span>
                        <span>Bridge to {crossChainTarget.toUpperCase()}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Wallet Display */}
                <div className="generated-wallet-card">
                  <div className="wallet-card-header">
                    <h5>🔗 Generated XRPL Wallet</h5>
                    <span className="chain-badge xrpl">XRP Ledger</span>
                  </div>
                  <div className="wallet-details-grid">
                    <div className="wallet-detail">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value address">rXRPL...Demo123</span>
                    </div>
                    <div className="wallet-detail">
                      <span className="detail-label">Balance:</span>
                      <span className="detail-value balance">0.00 XRP</span>
                    </div>
                    <div className="wallet-detail">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value status ready">Ready for Bridge</span>
                    </div>
                  </div>
                </div>

                {/* Hackathon Info Box */}
                <div className="hackathon-info-box">
                  <div className="hackathon-header">
                    <span className="hackathon-icon">🏆</span>
                    <h6>DEGA Hackathon Demo</h6>
                  </div>
                  <div className="hackathon-details">
                    <p><strong>Privacy-First DAO Treasury</strong></p>
                    <p>• ZK Proofs for Anonymous Governance</p>
                    <p>• AI-Powered Cross-Chain Bridge</p>
                    <p>• Midnight Network Integration</p>
                    <p>• Real-Time Treasury Management</p>
                  </div>
                  <div className="hackathon-tech">
                    <span className="tech-badge">Midnight.js</span>
                    <span className="tech-badge">ElizaOS</span>
                    <span className="tech-badge">XRPL</span>
                  </div>
                </div>

                <div className="cross-chain-info">
                  <p>💡 Matthew AI will automatically create your {crossChainTarget.toUpperCase()} wallet upon deposit confirmation</p>
                </div>
              </div>
            </div>
          )}

          {/* Tokens Tab */}
          {activeTab === 'tokens' && (
            <div className="tab-content tokens-tab">
              <div className="tokens-header">
                <h3>🪙 Token Management</h3>
                <p>Manage your governance and utility tokens</p>
              </div>

              {tokenBalance && (
                <div className="token-overview">
                  <div className="token-balance-card">
                    <h4>🪙 VaultChain DAO Tokens</h4>
                    <div className="token-display">
                      <span className="token-amount">{tokenBalance.userBalance || tokenBalance.balance}</span>
                      <span className="token-symbol">{tokenBalance.symbol || 'VLT'}</span>
                    </div>
                    <p className="token-description">{tokenBalance.description || 'Governance Token Balance'}</p>
                    
                    {tokenBalance.contractAddress && (
                      <div className="token-contract-info">
                        <p><strong>Contract:</strong> <code>{tokenBalance.contractAddress}</code></p>
                        <p><strong>Network:</strong> {tokenBalance.network || 'Midnight TestNet'}</p>
                        <p><strong>Total Supply:</strong> {tokenBalance.totalSupply || 'N/A'} tokens</p>
                      </div>
                    )}
                    
                    {tokenBalance.canReceive && (
                      <button 
                        onClick={async () => {
                          try {
                            const result = await onChainDAO.requestDAOTokens()
                            if (result.success) {
                              alert(`🎉 ${result.message}\n\nAmount: ${result.amount} ${result.symbol}\nTx: ${result.txHash}\n\n${result.description}`)
                              // Refresh token balance
                              loadDashboardData()
                            } else {
                              alert(`❌ Failed to request tokens: ${result.error}`)
                            }
                          } catch (error) {
                            alert(`❌ Error: ${error.message}`)
                          }
                        }}
                        className="request-tokens-btn"
                      >
                        <span className="btn-icon">🎁</span>
                        <span>Request DAO Tokens</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {contractStatus?.contracts && (
                <div className="contracts-section">
                  <h4>📋 Contract Addresses</h4>
                  <div className="contracts-list">
                    {Object.entries(contractStatus.contracts).map(([name, address]) => (
                      <div key={name} className="contract-item">
                        <span className="contract-name">{name.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="contract-address">{address}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Agent Tab */}
          {activeTab === 'ai-agent' && (
            <div className="tab-content ai-agent-tab">
              <div className="ai-agent-header">
                <h3>🤖 Matthew - AI Treasury Agent</h3>
                <p>Chat with Matthew for treasury management, DAO formation, and compliance guidance</p>
              </div>
              
              <div className="ai-chat-wrapper">
                <AIAgentChat agentStatus={aiAgentStatus || 'demo'} />
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default ModernOnChainDashboard
