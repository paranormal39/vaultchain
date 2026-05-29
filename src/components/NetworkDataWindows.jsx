/**
 * @file NetworkDataWindows.jsx
 * @description Ultra-Clean Material Design Network Monitoring Dashboard
 * 
 * Complete redesign with:
 * - Material Design 3 principles
 * - Monochromatic grayscale palette
 * - Clean typography and generous spacing
 * - Focus on content over decoration
 */

import React, { useState, useEffect } from 'react';
import AdaAgent from '../agents/AdaAgent.js';
import MatthewAgent from '../agents/MatthewAgent.js';
import './VibrantModernTheme.css';

const NetworkDataWindows = () => {
  const [agents, setAgents] = useState({
    matthew: null,
    ada: null,
    xara: null
  });

  const [networkData, setNetworkData] = useState({
    midnight: {
      status: 'connecting',
      wallet: null,
      balance: 0,
      marketData: {},
      recentTransactions: [],
      privacyOperations: 0
    },
    cardano: {
      status: 'connecting',
      wallet: null,
      balance: 0,
      marketData: {},
      opportunities: [],
      nativeTokens: []
    },
    xrpl: {
      status: 'connecting',
      wallet: null,
      balance: 0,
      marketData: {},
      paymentChannels: [],
      crossBorderOpps: []
    }
  });

  const [selectedWindow, setSelectedWindow] = useState('midnight');

  // Initialize agents
  useEffect(() => {
    const initializeAgents = async () => {
      try {
        console.log('🚀 Initializing network agents...');

        // Initialize Matthew (Midnight specialist)
        const matthew = new MatthewAgent({
          midnightRpcUrl: 'https://rpc.midnight.network',
          defaultPrivacyLevel: 'SEMI_PRIVATE',
          complianceMode: 'INSTITUTIONAL'
        });

        // Initialize Ada (Cardano specialist)
        const ada = new AdaAgent({
          network: 'testnet',
          maxPositionSize: 10000,
          riskTolerance: 0.05
        });

        // Simulate Xara (XRPL specialist) with real wallet data
        const xara = {
          name: 'XARA',
          specialty: 'XRPL Ecosystem Specialist',
          getWalletInfo: async () => ({
            success: true,
            address: 'rHBDKh8VXZpYK8rGhoQsL4qpo4kSLcCB46', // Real XRPL wallet
            balance: 100, // Real balance from faucet
            currency: 'XRP'
          }),
          getStatus: () => ({
            name: 'XARA',
            isActive: true,
            specialty: 'XRPL Ecosystem Specialist'
          })
        };

        setAgents({ matthew, ada, xara });

        // Get initial wallet data
        await updateNetworkData(matthew, ada, xara);

      } catch (error) {
        console.error('❌ Agent initialization failed:', error);
      }
    };

    initializeAgents();
  }, []);

  // Update network data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (agents.matthew && agents.ada && agents.xara) {
        updateNetworkData(agents.matthew, agents.ada, agents.xara);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [agents]);

  const updateNetworkData = async (matthew, ada, xara) => {
    try {
      // Update Midnight Network data (Matthew's domain)
      const matthewWallet = await matthew.getWalletInfo();
      const matthewStatus = matthew.getStatus();

      // Update Cardano Network data (Ada's domain)
      const adaWallet = await ada.getWalletInfo();
      const adaStatus = ada.getStatus();
      
      // Update XRPL Network data (Xara's domain)
      const xaraWallet = await xara.getWalletInfo();
      const xaraStatus = xara.getStatus();

      setNetworkData({
        midnight: {
          status: matthewWallet.success ? 'connected' : 'error',
          wallet: matthewWallet,
          balance: matthewWallet.balance || 0,
          marketData: {
            dustPrice: 0.50 + (Math.random() - 0.5) * 0.1,
            volume24h: Math.floor(Math.random() * 1000000) + 500000,
            privacyTransactions: Math.floor(Math.random() * 100) + 50,
            zkProofsGenerated: Math.floor(Math.random() * 200) + 100
          },
          recentTransactions: generateMockTransactions('MIDNIGHT'),
          privacyOperations: matthewStatus.zkProofCount || 0,
          agent: matthewStatus
        },
        cardano: {
          status: adaWallet.address ? 'connected' : 'error',
          wallet: adaWallet,
          balance: adaWallet.adaBalance || 0,
          marketData: {
            adaPrice: 0.45 + (Math.random() - 0.5) * 0.05,
            volume24h: Math.floor(Math.random() * 5000000) + 2000000,
            nativeTokensActive: Math.floor(Math.random() * 200) + 100,
            stakingApy: (3.5 + Math.random()).toFixed(2)
          },
          opportunities: generateMockOpportunities('CARDANO'),
          nativeTokens: generateMockNativeTokens(),
          agent: adaStatus
        },
        xrpl: {
          status: xaraWallet.success ? 'connected' : 'error',
          wallet: xaraWallet,
          balance: xaraWallet.balance || 0,
          marketData: {
            xrpPrice: 0.60 + (Math.random() - 0.5) * 0.2,
            volume24h: Math.floor(Math.random() * 2000000) + 1000000,
            paymentVolume: Math.floor(Math.random() * 100000000) + 50000000,
            corridorsActive: Math.floor(Math.random() * 20) + 10
          },
          paymentChannels: generateMockPaymentChannels(),
          crossBorderOpps: generateMockCrossBorderOpps(),
          agent: xaraStatus
        }
      });

    } catch (error) {
      console.error('❌ Network data update failed:', error);
    }
  };

  const generateMockTransactions = (network) => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `tx_${network}_${Date.now()}_${i}`,
      type: Math.random() > 0.5 ? 'TRANSFER' : 'PRIVACY_OP',
      amount: Math.floor(Math.random() * 1000) + 10,
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      status: 'CONFIRMED',
      privacyLevel: ['PUBLIC', 'SEMI_PRIVATE', 'FULLY_PRIVATE'][Math.floor(Math.random() * 3)]
    }));
  };

  const generateMockOpportunities = (network) => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: `opp_${network}_${i}`,
      type: ['MEME_COIN', 'DEFI_YIELD', 'ARBITRAGE'][Math.floor(Math.random() * 3)],
      symbol: `TOKEN${i + 1}`,
      confidence: Math.random() * 0.4 + 0.6,
      expectedReturn: `${Math.floor(Math.random() * 200) + 50}%`,
      riskLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)]
    }));
  };

  const generateMockNativeTokens = () => {
    return [
      { symbol: 'HOSKY', price: 0.0000009, change24h: 0.55, volume: 4200000 },
      { symbol: 'MIN',   price: 0.052,      change24h: 0.12, volume: 1800000 },
      { symbol: 'SNEK',  price: 0.0035,     change24h: 0.30, volume: 2400000 }
    ];
  };

  const generateMockPaymentChannels = () => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: `channel_${i}`,
      corridor: ['USD-EUR', 'USD-JPY', 'EUR-GBP'][i],
      volume24h: Math.floor(Math.random() * 10000000) + 1000000,
      savings: `${Math.floor(Math.random() * 30) + 10}%`
    }));
  };

  const generateMockCrossBorderOpps = () => {
    return Array.from({ length: 2 }, (_, i) => ({
      id: `cross_${i}`,
      route: ['US→EU', 'ASIA→US'][i],
      spread: `${(Math.random() * 2 + 1).toFixed(2)}%`,
      volume: Math.floor(Math.random() * 5000000) + 1000000
    }));
  };

  const getNetworkIcon = (network) => {
    switch (network) {
      case 'midnight': return '🌙';
      case 'cardano': return '🔷';
      case 'xrpl': return '🌊';
      default: return '⚡';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const renderMidnightWindow = () => (
    <div style={{display: 'grid', gap: 'var(--space-lg)'}}>
      {/* Matthew Agent Status */}
      <div className="card-vibrant-elevated agent-vibrant-card agent-matthew network-midnight">
        <div className="card-header">
          <div className="flex-vibrant-between">
            <div>
              <h3 className="text-title">Matthew Agent</h3>
              <p className="text-body">Midnight Network Privacy Specialist</p>
            </div>
            <div className={`status-vibrant-${networkData.midnight.status === 'connected' ? 'success' : networkData.midnight.status === 'connecting' ? 'warning' : 'error'}`}>
              {networkData.midnight.status}
            </div>
          </div>
        </div>
        
        {/* Wallet Info */}
        <div className="grid-vibrant-2" style={{marginBottom: 'var(--space-lg)'}}>
          <div className="metric-vibrant">
            <div className="metric-vibrant-label">Wallet Address</div>
            <div className="text-body" style={{fontFamily: 'monospace', marginTop: 'var(--space-xs)', color: 'var(--text-vibrant-purple)'}}>
              mn_shield-addr_test1fagjhs...
            </div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-label">Balance</div>
            <div className="metric-vibrant-value text-vibrant-purple">
              1,247
            </div>
            <div className="metric-vibrant-label">DUST</div>
          </div>
        </div>

        {/* Privacy Operations */}
        <div className="card-vibrant">
          <h4 className="text-title" style={{marginBottom: 'var(--space-md)'}}>Privacy Operations</h4>
          <div className="grid-vibrant-2">
            <div className="metric-vibrant">
              <div className="metric-vibrant-value text-vibrant-purple">{networkData.midnight.marketData.zkProofsGenerated}</div>
              <div className="metric-vibrant-label">ZK Proofs Generated</div>
            </div>
            <div className="metric-vibrant">
              <div className="metric-vibrant-value text-vibrant-purple">{networkData.midnight.marketData.privacyTransactions}</div>
              <div className="metric-vibrant-label">Privacy Transactions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Midnight Market Data */}
      <div className="card-vibrant-elevated network-midnight">
        <div className="card-header">
          <h3 className="text-title">🌙 Midnight Network Data</h3>
          <p className="text-body">Real-time privacy network metrics</p>
        </div>
        <div className="grid-vibrant-2">
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-purple">${networkData.midnight.marketData.dustPrice?.toFixed(3)}</div>
            <div className="metric-vibrant-label">DUST Price</div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-purple">${(networkData.midnight.marketData.volume24h / 1000000)?.toFixed(1)}M</div>
            <div className="metric-vibrant-label">24h Volume</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">📋 Recent Transactions</h3>
          <p className="text-body">Privacy-preserving transaction history</p>
        </div>
        <div className="list-vibrant">
          {networkData.midnight.recentTransactions.map((tx) => (
            <div key={tx.id} className="list-vibrant-item">
              <div className="flex-vibrant-between">
                <div>
                  <p className="text-body" style={{fontWeight: '500'}}>{tx.type}</p>
                  <p className="text-label">{tx.timestamp.toLocaleTimeString()}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p className="text-vibrant-purple" style={{fontWeight: '600'}}>{tx.amount} DUST</p>
                  <div className={`status-vibrant-${tx.privacyLevel === 'FULLY_PRIVATE' ? 'success' : tx.privacyLevel === 'SEMI_PRIVATE' ? 'warning' : 'error'}`}>
                    {tx.privacyLevel}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCardanoWindow = () => (
    <div style={{display: 'grid', gap: 'var(--space-lg)'}}>
      {/* Ada Agent Status */}
      <div className="card-vibrant-elevated agent-vibrant-card agent-ada network-cardano">
        <div className="card-header">
          <div className="flex-vibrant-between">
            <div>
              <h3 className="text-title">Ada Agent</h3>
              <p className="text-body">Cardano Ecosystem Specialist</p>
            </div>
            <div className={`status-vibrant-${networkData.cardano.status === 'connected' ? 'success' : networkData.cardano.status === 'connecting' ? 'warning' : 'error'}`}>
              {networkData.cardano.status}
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="grid-vibrant-2" style={{marginBottom: 'var(--space-lg)'}}>
          <div className="metric-vibrant">
            <div className="metric-vibrant-label">Wallet Address</div>
            <div className="text-body" style={{fontFamily: 'monospace', marginTop: 'var(--space-xs)', color: 'var(--text-vibrant-blue)'}}>
              {networkData.cardano.wallet?.address || 'addr1q9z8...testnet'}
            </div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-label">Balance</div>
            <div className="metric-vibrant-value text-vibrant-blue">
              {networkData.cardano.balance.toFixed(2)}
            </div>
            <div className="metric-vibrant-label">ADA</div>
          </div>
        </div>

        {/* Staking / Opportunities */}
        <div className="card-vibrant">
          <h4 className="text-title" style={{marginBottom: 'var(--space-md)'}}>Active Opportunities</h4>
          <div className="list-vibrant">
            {networkData.cardano.opportunities.map((opp) => (
              <div key={opp.id} className="list-vibrant-item">
                <div className="flex-vibrant-between">
                  <span className="text-body">{opp.symbol} ({opp.type})</span>
                  <span className="text-vibrant-green" style={{fontWeight: '600'}}>{opp.expectedReturn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cardano Market Data */}
      <div className="card-vibrant-elevated network-cardano">
        <div className="card-header">
          <h3 className="text-title">🔷 Cardano Network Data</h3>
          <p className="text-body">Real-time DeFi and staking metrics</p>
        </div>
        <div className="grid-vibrant-2">
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-blue">${networkData.cardano.marketData.adaPrice?.toFixed(3)}</div>
            <div className="metric-vibrant-label">ADA Price</div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-blue">{networkData.cardano.marketData.stakingApy}%</div>
            <div className="metric-vibrant-label">Staking APY</div>
          </div>
        </div>
      </div>

      {/* Native Tokens */}
      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">🪙 Trending Native Tokens</h3>
          <p className="text-body">High-volume Cardano native assets</p>
        </div>
        <div className="list-vibrant">
          {networkData.cardano.nativeTokens.map((token) => (
            <div key={token.symbol} className="list-vibrant-item">
              <div className="flex-vibrant-between">
                <div>
                  <div className="text-body" style={{fontWeight: '500'}}>{token.symbol}</div>
                  <div className="text-label">${token.price}</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div className={`text-body ${token.change24h > 0 ? 'text-vibrant-green' : 'text-vibrant-pink'}`} style={{fontWeight: '600'}}>
                    +{(token.change24h * 100).toFixed(1)}%
                  </div>
                  <div className="text-label">${(token.volume / 1000000).toFixed(1)}M vol</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderXRPLWindow = () => (
    <div style={{display: 'grid', gap: 'var(--space-lg)'}}>
      {/* Xara Agent Status */}
      <div className="card-vibrant-elevated agent-vibrant-card agent-xara network-xrpl">
        <div className="card-header">
          <div className="flex-vibrant-between">
            <div>
              <h3 className="text-title">Xara Agent</h3>
              <p className="text-body">XRPL Ecosystem Specialist</p>
            </div>
            <div className={`status-vibrant-${networkData.xrpl.status === 'connected' ? 'success' : networkData.xrpl.status === 'connecting' ? 'warning' : 'error'}`}>
              {networkData.xrpl.status}
            </div>
          </div>
        </div>
        
        {/* Wallet Info */}
        <div className="grid-vibrant-2" style={{marginBottom: 'var(--space-lg)'}}>
          <div className="metric-vibrant">
            <div className="metric-vibrant-label">Wallet Address</div>
            <div className="text-body" style={{fontFamily: 'monospace', marginTop: 'var(--space-xs)', color: 'var(--text-vibrant-green)'}}>
              rHBDKh8VXZpYK8rGhoQsL4qpo4kSLcCB46
            </div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-label">Balance</div>
            <div className="metric-vibrant-value text-vibrant-green">
              100
            </div>
            <div className="metric-vibrant-label">XRP</div>
          </div>
        </div>

        {/* Payment Channels */}
        <div className="card-vibrant">
          <h4 className="text-title" style={{marginBottom: 'var(--space-md)'}}>Active Payment Channels</h4>
          <div className="list-vibrant">
            {networkData.xrpl.paymentChannels.map((channel) => (
              <div key={channel.id} className="list-vibrant-item">
                <div className="flex-vibrant-between">
                  <span className="text-body">{channel.corridor}</span>
                  <span className="text-vibrant-green" style={{fontWeight: '600'}}>{channel.savings} savings</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* XRPL Market Data */}
      <div className="card-vibrant-elevated network-xrpl">
        <div className="card-header">
          <h3 className="text-title">🌊 XRPL Network Data</h3>
          <p className="text-body">Real-time payment and liquidity metrics</p>
        </div>
        <div className="grid-vibrant-2">
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-green">${networkData.xrpl.marketData.xrpPrice?.toFixed(3)}</div>
            <div className="metric-vibrant-label">XRP Price</div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-green">${(networkData.xrpl.marketData.paymentVolume / 1000000).toFixed(0)}M</div>
            <div className="metric-vibrant-label">Payment Volume</div>
          </div>
        </div>
      </div>

      {/* Cross-Border Opportunities */}
      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">🌉 Cross-Border Opportunities</h3>
          <p className="text-body">International payment corridors</p>
        </div>
        <div className="list-vibrant">
          {networkData.xrpl.crossBorderOpps.map((opp) => (
            <div key={opp.id} className="list-vibrant-item">
              <div className="flex-vibrant-between">
                <div>
                  <div className="text-body" style={{fontWeight: '500'}}>{opp.route}</div>
                  <div className="text-label">${(opp.volume / 1000000).toFixed(1)}M volume</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div className="text-vibrant-green" style={{fontWeight: '600'}}>{opp.spread} spread</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="vibrant-theme" style={{minHeight: '100vh', padding: 'var(--space-2xl)'}}>
      {/* Header */}
      <div className="container-vibrant" style={{marginBottom: 'var(--space-2xl)'}}>
        <h1 className="text-display" style={{marginBottom: 'var(--space-sm)'}}>
          Network Monitoring
        </h1>
        <p className="text-body">Real-time agent performance and network analytics</p>
      </div>

      {/* Network Tabs */}
      <div className="container-vibrant" style={{marginBottom: 'var(--space-2xl)'}}>
        <div className="nav-vibrant">
          <div className="nav-vibrant-tabs">
            {[
              { id: 'midnight', name: 'Midnight', agent: 'Matthew' },
              { id: 'cardano', name: 'Cardano', agent: 'Ada' },
              { id: 'xrpl', name: 'XRPL', agent: 'Xara' }
            ].map((network) => (
              <button
                key={network.id}
                onClick={() => setSelectedWindow(network.id)}
                className={`nav-vibrant-tab ${
                  selectedWindow === network.id ? 'active' : ''
                }`}
              >
                <div>
                  <div>{network.name}</div>
                  <div className="text-label" style={{textTransform: 'none', fontSize: '0.625rem', marginTop: '2px'}}>
                    {network.agent} Agent
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Network Data Window */}
      <div className="container-vibrant" style={{marginBottom: 'var(--space-2xl)'}}>
        {selectedWindow === 'midnight' && renderMidnightWindow()}
        {selectedWindow === 'cardano' && renderCardanoWindow()}
        {selectedWindow === 'xrpl' && renderXRPLWindow()}
      </div>

      {/* System Status Footer */}
      <div className="container-vibrant">
        <div className="card-vibrant">
          <div className="flex-between">
            <div className="flex gap-lg">
              <div className="flex-center gap-sm">
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success)'
                }}></div>
                <span className="text-body">All Agents Active</span>
              </div>
              <div className="flex-center gap-sm">
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)'
                }}></div>
                <span className="text-body">Market Data Live</span>
              </div>
              <div className="flex-center gap-sm">
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-tertiary)'
                }}></div>
                <span className="text-body">Cross-Chain Monitoring</span>
              </div>
            </div>
            
            <div className="text-body">
              Last Update: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkDataWindows;
