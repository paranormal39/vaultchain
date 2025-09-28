import React, { useState, useEffect } from 'react'
import './ModernOnChainDashboard.css'
import { onChainDAO } from '../services/OnChainDAOService.js'
import AIAgentChat from './AIAgentChat.jsx'

const ModernOnChainDashboard = () => {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [treasuryStats, setTreasuryStats] = useState(null)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [membershipStatus, setMembershipStatus] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [contractStatus, setContractStatus] = useState(null)
  const [cryptoData, setCryptoData] = useState([])
  const [mcpStatus, setMcpStatus] = useState('disconnected')
  const [aiAgentStatus, setAiAgentStatus] = useState('demo')
  const [walletData, setWalletData] = useState(null)
  const [sendAmount, setSendAmount] = useState('')
  const [sendAddress, setSendAddress] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔗 Loading dashboard data...')
      
      // Load all data
      const [treasuryResponse, proposalsResponse, tokenResponse, membershipResponse, contractResponse, walletResponse, cryptoResponse] = await Promise.all([
        onChainDAO.getTreasuryBalance(),
        onChainDAO.getProposals(),
        onChainDAO.getTokenBalance(),
        onChainDAO.getMembershipStatus(),
        onChainDAO.getContractStatus(),
        onChainDAO.getWalletBalance(),
        onChainDAO.getTopCryptos()
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
      
      setProposals(proposalsResponse.active || [])
      setTokenBalance(tokenResponse)
      setMembershipStatus(membershipResponse)
      setContractStatus(contractResponse)
      setWalletData(walletResponse)
      setCryptoData(cryptoResponse)
      
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
        const walletResponse = await onChainDAO.getWalletBalance()
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
            <div className="stat-item">
              <span className="stat-label">Status</span>
              <span className={`stat-value status-${mcpStatus}`}>
                {mcpStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
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
                    <span className="card-status active">Active</span>
                  </div>
                  <div className="card-content">
                    <div className="main-stat">
                      <span className="stat-number">{tokenBalance?.balance || '0'}</span>
                      <span className="stat-unit">{tokenBalance?.symbol || 'VLT'}</span>
                    </div>
                    <p className="stat-description">Governance Tokens</p>
                  </div>
                </div>
              </div>

              {/* Market Data */}
              {cryptoData.length > 0 && (
                <div className="market-section">
                  <h3>📈 Market Overview</h3>
                  <div className="crypto-grid">
                    {cryptoData.map((crypto) => (
                      <div key={crypto.id} className="crypto-card">
                        <div className="crypto-header">
                          <h4>{crypto.symbol}</h4>
                          <span className={`crypto-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                            {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                          </span>
                        </div>
                        <p className="crypto-name">{crypto.name}</p>
                        <p className="crypto-price">
                          ${crypto.price.toLocaleString(undefined, { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Treasury Tab */}
          {activeTab === 'treasury' && (
            <div className="tab-content treasury-tab">
              <div className="treasury-overview">
                <h3>💰 Treasury Management</h3>
                <div className="treasury-total">
                  <span className="amount">{treasuryStats?.totalBalance?.toFixed(6) || '0'}</span>
                  <span className="unit">DUST</span>
                </div>
                <p className="treasury-subtitle">Decentralized Asset Management</p>
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
                <h4>Active Proposals</h4>
                {proposals.length > 0 ? (
                  <div className="proposals-list">
                    {proposals.map((proposal) => (
                      <div key={proposal.id} className="proposal-card">
                        <div className="proposal-header">
                          <h5>{proposal.title}</h5>
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
                        <div className="proposal-actions">
                          <button className="vote-btn yes">👍 Vote Yes</button>
                          <button className="vote-btn no">👎 Vote No</button>
                        </div>
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
                    <h4>Your Tokens</h4>
                    <div className="token-display">
                      <span className="token-amount">{tokenBalance.balance}</span>
                      <span className="token-symbol">{tokenBalance.symbol}</span>
                    </div>
                    <p className="token-description">Governance Token Balance</p>
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
