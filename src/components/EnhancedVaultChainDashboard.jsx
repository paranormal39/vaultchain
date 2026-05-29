/**
 * @file EnhancedVaultChainDashboard.jsx
 * @description Enhanced VaultChain dashboard using Midnight Kitties patterns
 * 
 * Key Enhancements:
 * - Uses VaultChainAPI instead of basic OnChainDAOService
 * - Integrates EnhancedMidnightWallet for advanced wallet features
 * - AI Portfolio Optimizer for genetic algorithm-based treasury optimization
 * - Real-time state management with observables
 * - Privacy-aware operations and UI
 * - Cross-chain integration with enhanced UX
 */

import React, { useState, useEffect, useMemo } from 'react';
import { EnhancedWalletProvider, EnhancedWalletWidget, useEnhancedWallet } from './EnhancedMidnightWallet.jsx';
import VaultChainAPI from '../services/VaultChainAPI.js';
import AIPortfolioOptimizer from '../services/AIPortfolioOptimizer.js';
import AIMarketDashboard from './AIMarketDashboard.jsx';
import MultiAgentDashboard from './MultiAgentDashboard.jsx';
import NetworkDataWindows from './NetworkDataWindows.jsx';
import { DemoAgentsContent, DemoMarketContent, DemoProposalsContent, DemoTreasuryContent } from './DemoContent.jsx';
import './ModernOnChainDashboard.css';
import './VibrantModernTheme.css';

// =====================
// ENHANCED DASHBOARD COMPONENT
// =====================

const EnhancedVaultChainDashboard = () => {
  // Enhanced state management
  const [vaultChainAPI, setVaultChainAPI] = useState(null);
  const [portfolioOptimizer, setPortfolioOptimizer] = useState(null);
  const [dashboardState, setDashboardState] = useState({
    activeTab: 'overview',
    loading: true,
    error: null,
    treasuryStats: null,
    proposals: [],
    aiRecommendations: [],
    optimizationResults: null,
    privacyMode: 'PUBLIC'
  });

  // Real-time data subscriptions
  const [apiState, setApiState] = useState(null);
  const [optimizerState, setOptimizerState] = useState(null);

  // =====================
  // INITIALIZATION
  // =====================

  useEffect(() => {
    initializeEnhancedVaultChain();
  }, []);

  const initializeEnhancedVaultChain = async () => {
    try {
      console.log('🚀 Initializing Enhanced VaultChain...');
      
      // Initialize VaultChain API with enhanced features
      const api = await VaultChainAPI.deploy({
        // Mock providers for demo
        publicDataProvider: { type: 'mock' },
        walletProvider: { type: 'mock' },
        zkConfigProvider: { type: 'mock' },
        proofProvider: { type: 'mock' },
        midnightProvider: { type: 'mock' },
        // Enhanced providers
        aiAgentProvider: { type: 'mock', models: ['MATTHEW', 'XARA'] },
        xrplProvider: { type: 'mock' },
        treasuryAnalyticsProvider: { type: 'mock' }
      }, {
        enableAI: true,
        enableXRPL: true,
        privacyLevel: 'PUBLIC',
        aiModels: ['MATTHEW', 'XARA']
      });

      setVaultChainAPI(api);

      // Initialize AI Portfolio Optimizer
      const optimizer = new AIPortfolioOptimizer({
        populationSize: 20,
        maxGenerations: 10,
        mutationRate: 0.1,
        crossoverRate: 0.8
      });

      setPortfolioOptimizer(optimizer);

      // Subscribe to real-time state updates
      api.state$.subscribe(state => {
        setApiState(state);
        setDashboardState(prev => ({
          ...prev,
          treasuryStats: {
            balance: state.treasuryBalance,
            memberCount: state.memberCount,
            crossChainBalances: state.crossChainBalances
          },
          proposals: state.activeProposals,
          aiRecommendations: state.aiRecommendations
        }));
      });

      optimizer.state$.subscribe(state => {
        setOptimizerState(state);
      });

      // Load initial data
      await loadDashboardData(api);
      
      setDashboardState(prev => ({ ...prev, loading: false }));
      console.log('✅ Enhanced VaultChain initialized successfully');

    } catch (error) {
      console.error('❌ Enhanced VaultChain initialization failed:', error);
      setDashboardState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  };

  const loadDashboardData = async (api) => {
    try {
      // Load treasury data with privacy awareness
      const treasuryBalance = await api.getTreasuryBalance(dashboardState.privacyMode);
      const crossChainBalances = await api.getCrossChainBalances();
      
      // Load initial proposals
      const initialProposals = [
        {
          id: 1,
          title: "🤖 AI-Optimized Emergency Fund",
          description: "AI-generated allocation strategy for emergency reserves with genetic algorithm optimization.",
          allocation: { reserves: 45, development: 25, incentives: 20, community: 10 },
          status: "active",
          votes: { yes: 15, no: 2, abstain: 1 },
          aiGenerated: true,
          privacyLevel: 'PUBLIC'
        },
        {
          id: 2,
          title: "🌉 Cross-Chain Expansion Strategy",
          description: "Expand treasury operations to XRPL with privacy-preserving cross-chain management.",
          allocation: { reserves: 30, development: 40, incentives: 20, community: 10 },
          status: "pending",
          votes: { yes: 8, no: 1, abstain: 0 },
          aiGenerated: false,
          privacyLevel: 'SEMI_PRIVATE'
        }
      ];

      setDashboardState(prev => ({
        ...prev,
        treasuryStats: {
          balance: treasuryBalance.amount,
          currency: treasuryBalance.currency,
          crossChainBalances: crossChainBalances.balances
        },
        proposals: initialProposals
      }));

    } catch (error) {
      console.error('❌ Dashboard data loading failed:', error);
    }
  };

  // =====================
  // ENHANCED ACTIONS
  // =====================

  const generateAIProposal = async (options = {}) => {
    try {
      if (!vaultChainAPI) return;

      console.log('🤖 Generating AI proposal with enhanced features...');
      
      const result = await vaultChainAPI.generateAIProposal({
        privacyLevel: dashboardState.privacyMode,
        includeXRPL: true,
        riskTolerance: options.riskTolerance || 'MODERATE',
        aiModel: options.aiModel || 'MATTHEW'
      });

      if (result.success) {
        setDashboardState(prev => ({
          ...prev,
          proposals: [...prev.proposals, result.proposal],
          aiRecommendations: [...prev.aiRecommendations, result.aiInsights]
        }));

        return { success: true, proposal: result.proposal };
      }

      return result;

    } catch (error) {
      console.error('❌ AI proposal generation failed:', error);
      return { success: false, error: error.message };
    }
  };

  const optimizePortfolioWithAI = async (currentAllocation) => {
    try {
      if (!portfolioOptimizer) return;

      console.log('🧬 Starting AI portfolio optimization...');
      
      const result = await portfolioOptimizer.optimizePortfolio({
        currentAllocation: currentAllocation || {
          reserves: 40,
          development: 30,
          incentives: 20,
          community: 10
        },
        marketConditions: {
          volatility: 'MODERATE',
          trend: 'BULLISH'
        },
        riskProfile: 'MODERATE',
        timeHorizon: '1_YEAR'
      });

      if (result.success) {
        setDashboardState(prev => ({
          ...prev,
          optimizationResults: result
        }));

        // Auto-generate proposal from optimization
        await generateAIProposal({
          allocation: result.optimizedAllocation,
          aiModel: 'GENETIC_OPTIMIZER'
        });
      }

      return result;

    } catch (error) {
      console.error('❌ Portfolio optimization failed:', error);
      return { success: false, error: error.message };
    }
  };

  const castPrivateVote = async (proposalId, vote, privacyLevel = 'PUBLIC') => {
    try {
      if (!vaultChainAPI) return;

      console.log('🗳️ Casting private vote...');
      
      const result = await vaultChainAPI.castPrivateVote({
        proposalId,
        vote,
        privacyLevel,
        generateZKProof: privacyLevel !== 'PUBLIC'
      });

      if (result.success) {
        // Update proposal vote counts
        setDashboardState(prev => ({
          ...prev,
          proposals: prev.proposals.map(p => 
            p.id === proposalId 
              ? { ...p, votes: { ...p.votes, [vote]: p.votes[vote] + 1 } }
              : p
          )
        }));
      }

      return result;

    } catch (error) {
      console.error('❌ Private vote casting failed:', error);
      return { success: false, error: error.message };
    }
  };

  const switchPrivacyMode = async (newMode) => {
    try {
      console.log('🔐 Switching privacy mode to:', newMode);
      
      setDashboardState(prev => ({ ...prev, privacyMode: newMode }));
      
      // Refresh data with new privacy level
      if (vaultChainAPI) {
        await loadDashboardData(vaultChainAPI);
      }

      return { success: true, privacyMode: newMode };

    } catch (error) {
      console.error('❌ Privacy mode switch failed:', error);
      return { success: false, error: error.message };
    }
  };

  // =====================
  // RENDER METHODS
  // =====================

  const renderEnhancedOverview = () => (
    <div style={{display: 'grid', gap: 'var(--space-2xl)'}}>
      {/* Enhanced Treasury Stats */}
      <div className="grid-vibrant-3">
        <div className="card-vibrant-elevated animate-pulse-glow">
          <div className="card-header">
            <h3 className="text-title">Treasury Balance</h3>
            <p className="text-body">Total managed assets</p>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value">
              {dashboardState.privacyMode === 'FULLY_PRIVATE' 
                ? '***' 
                : `${dashboardState.treasuryStats?.balance || 1247} DUST`
              }
            </div>
            <div className="metric-vibrant-label">Privacy: {dashboardState.privacyMode}</div>
          </div>
        </div>

        <div className="card-vibrant-elevated">
          <div className="card-header">
            <h3 className="text-title">Cross-Chain Assets</h3>
            <p className="text-body">Multi-network portfolio</p>
          </div>
          <div style={{display: 'grid', gap: 'var(--space-sm)'}}>
            {dashboardState.treasuryStats?.crossChainBalances ? 
             Object.entries(dashboardState.treasuryStats.crossChainBalances).map(([chain, data]) => (
              <div className="flex-vibrant-between">
                <span className="text-body" style={{textTransform: 'capitalize'}}>{chain}:</span>
                <span className="text-vibrant-blue" style={{fontWeight: '600'}}>{data.balance} {data.currency}</span>
              </div>
            )) : (
              <>
                <div className="flex-vibrant-between">
                  <span className="text-body">Midnight:</span>
                  <span className="text-vibrant-purple" style={{fontWeight: '600'}}>1247 DUST</span>
                </div>
                <div className="flex-vibrant-between">
                  <span className="text-body">Cardano:</span>
                  <span className="text-vibrant-blue" style={{fontWeight: '600'}}>12,450 ADA</span>
                </div>
                <div className="flex-vibrant-between">
                  <span className="text-body">XRPL:</span>
                  <span className="text-vibrant-green" style={{fontWeight: '600'}}>8,420 XRP</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card-vibrant-elevated">
          <div className="card-header">
            <h3 className="text-title">AI Optimization</h3>
            <p className="text-body">Portfolio performance</p>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-green">
              {optimizerState?.bestFitness ? 
                `${(optimizerState.bestFitness * 100).toFixed(1)}%` : 
                '94.2%'
              }
            </div>
            <div className="metric-label">
              {optimizerState?.isOptimizing ? 
                `Gen ${optimizerState.generation}/${portfolioOptimizer?.config.maxGenerations || 10}` :
                'Optimization Score'
              }
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">AI Recommendations</h3>
          <p className="text-body">Intelligent portfolio insights</p>
        </div>
        <div className="list-vibrant">
          {dashboardState.aiRecommendations.length > 0 ? 
            dashboardState.aiRecommendations.slice(-3).map((rec, index) => (
              <div key={index} className="list-vibrant-item">
                <div className="flex-vibrant-between" style={{marginBottom: 'var(--space-xs)'}}>
                  <span className="text-body" style={{fontWeight: '500'}}>AI Model: {rec.aiModel}</span>
                  <span className="text-label">Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="text-body">{rec.reasoning}</p>
              </div>
            )) : (
              <div className="list-vibrant-item">
                <div className="flex-vibrant-between" style={{marginBottom: 'var(--space-xs)'}}>
                  <span className="text-body" style={{fontWeight: '500'}}>AI Model: Portfolio Optimizer</span>
                  <span className="text-label">Confidence: 92%</span>
                </div>
                <p className="text-body">Current allocation shows strong diversification. Consider increasing XRPL exposure for cross-border payment opportunities.</p>
              </div>
            )
          }
        </div>
      </div>

      {/* Portfolio Optimization Results */}
      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">Portfolio Allocation</h3>
          <p className="text-body">Optimized asset distribution</p>
        </div>
        <div className="grid-vibrant-4">
          {dashboardState.optimizationResults ? 
            Object.entries(dashboardState.optimizationResults.optimizedAllocation).map(([key, value]) => (
              <div key={key} className="metric-vibrant">
                <div className="metric-vibrant-value text-vibrant-blue">{value}%</div>
                <div className="metric-vibrant-label" style={{textTransform: 'capitalize'}}>{key}</div>
              </div>
            )) : (
              <>
                <div className="metric-vibrant">
                  <div className="metric-vibrant-value text-vibrant-blue">40%</div>
                  <div className="metric-vibrant-label">Reserves</div>
                </div>
                <div className="metric-vibrant">
                  <div className="metric-vibrant-value text-vibrant-green">30%</div>
                  <div className="metric-vibrant-label">Development</div>
                </div>
                <div className="metric-vibrant">
                  <div className="metric-vibrant-value text-vibrant-purple">20%</div>
                  <div className="metric-vibrant-label">Incentives</div>
                </div>
                <div className="metric-vibrant">
                  <div className="metric-vibrant-value text-vibrant-gold">10%</div>
                  <div className="metric-vibrant-label">Community</div>
                </div>
              </>
            )
          }
        </div>
        {dashboardState.optimizationResults && (
          <div className="text-body" style={{marginTop: 'var(--space-md)', textAlign: 'center'}}>
            Fitness Score: {(dashboardState.optimizationResults.allocationDNA.fitness * 100).toFixed(1)}% | 
            Generations: {dashboardState.optimizationResults.optimizationSummary.generations} | 
            Risk Profile: {dashboardState.optimizationResults.aiInsights.riskProfile}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-vibrant-md" style={{flexWrap: 'wrap'}}>
        <button
          onClick={() => generateAIProposal()}
          className="btn-vibrant-primary"
        >
          Generate AI Proposal
        </button>
        <button
          onClick={() => optimizePortfolioWithAI()}
          disabled={optimizerState?.isOptimizing}
          className="btn-vibrant-secondary"
          style={{
            opacity: optimizerState?.isOptimizing ? 0.6 : 1,
            cursor: optimizerState?.isOptimizing ? 'not-allowed' : 'pointer'
          }}
        >
          {optimizerState?.isOptimizing ? 'Optimizing...' : 'Optimize Portfolio'}
        </button>
        <button
          onClick={() => switchPrivacyMode(
            dashboardState.privacyMode === 'PUBLIC' ? 'SEMI_PRIVATE' : 
            dashboardState.privacyMode === 'SEMI_PRIVATE' ? 'FULLY_PRIVATE' : 'PUBLIC'
          )}
          className="btn-vibrant-secondary"
        >
          Switch Privacy ({dashboardState.privacyMode})
        </button>
      </div>
    </div>
  );

  const renderEnhancedProposals = () => (
    <div style={{display: 'grid', gap: 'var(--space-2xl)'}}>
      <div className="flex-between">
        <div>
          <h2 className="text-display">Proposals</h2>
          <p className="text-body">AI-generated treasury proposals</p>
        </div>
        <button
          onClick={() => generateAIProposal()}
          className="btn-primary"
        >
          Generate AI Proposal
        </button>
      </div>

      <div className="space-y-4">
        {dashboardState.proposals.map(proposal => (
          <div key={proposal.id} className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{proposal.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{proposal.description}</p>
                
                {/* Enhanced proposal info */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {proposal.aiGenerated && (
                    <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">
                      🤖 AI Generated
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs ${
                    proposal.privacyLevel === 'PUBLIC' ? 'bg-blue-600/30 text-blue-300' :
                    proposal.privacyLevel === 'SEMI_PRIVATE' ? 'bg-yellow-600/30 text-yellow-300' :
                    'bg-red-600/30 text-red-300'
                  }`}>
                    {proposal.privacyLevel === 'PUBLIC' ? '👁️ Public' :
                     proposal.privacyLevel === 'SEMI_PRIVATE' ? '🔐 Semi-Private' :
                     '🔒 Fully Private'}
                  </span>
                </div>

                {/* Allocation display */}
                {proposal.allocation && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {Object.entries(proposal.allocation).map(([key, value]) => (
                      <div key={key} className="text-center bg-gray-800/50 rounded p-2">
                        <div className="text-sm font-bold text-white">{value}%</div>
                        <div className="text-xs text-gray-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className={`px-3 py-1 rounded text-sm ${
                  proposal.status === 'active' ? 'bg-green-600/30 text-green-300' :
                  'bg-yellow-600/30 text-yellow-300'
                }`}>
                  {proposal.status}
                </div>
              </div>
            </div>

            {/* Voting */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-4 text-sm">
                <span className="text-green-400">👍 {proposal.votes.yes}</span>
                <span className="text-red-400">👎 {proposal.votes.no}</span>
                <span className="text-gray-400">🤷 {proposal.votes.abstain || 0}</span>
              </div>
              
              <div className="flex space-x-2">
                {['yes', 'no', 'abstain'].map(vote => (
                  <button
                    key={vote}
                    onClick={() => castPrivateVote(proposal.id, vote, dashboardState.privacyMode)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      vote === 'yes' ? 'bg-green-600 hover:bg-green-700' :
                      vote === 'no' ? 'bg-red-600 hover:bg-red-700' :
                      'bg-gray-600 hover:bg-gray-700'
                    } text-white`}
                  >
                    {vote === 'yes' ? '👍' : vote === 'no' ? '👎' : '🤷'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // =====================
  // MAIN RENDER
  // =====================

  if (dashboardState.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Initializing Enhanced VaultChain...</div>
          <div className="text-gray-400 text-sm mt-2">Loading AI systems and privacy features</div>
        </div>
      </div>
    );
  }

  if (dashboardState.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">❌ Initialization Failed</div>
          <div className="text-gray-300">{dashboardState.error}</div>
        </div>
      </div>
    );
  }

  return (
    <EnhancedWalletProvider config={{ 
      enablePrivacy: true, 
      enableXRPL: true, 
      autoConnect: false,
      privacyLevel: dashboardState.privacyMode 
    }}>
      <div className="vibrant-theme">
        {/* Enhanced Header */}
        <header style={{borderBottom: '1px solid var(--glass-border)', padding: 'var(--space-lg) 0', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)'}}>
          <div className="container-vibrant">
            <div className="flex-between">
              <div className="flex-center gap-md">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-glow-blue)'
                }}>
                  <span style={{color: 'white', fontWeight: '700', fontSize: '1.25rem'}}>V</span>
                </div>
                <div>
                  <h1 className="text-display">VaultChain DAO</h1>
                  <p className="text-body">AI-Powered Treasury Management</p>
                </div>
              </div>
              
              {/* Enhanced Status Indicators */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Enhanced API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">AI Optimizer</span>
                </div>
                <EnhancedWalletWidget compact={true} />
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Navigation */}
        <nav className="nav-vibrant">
          <div className="container-vibrant">
            <div className="nav-vibrant-tabs">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'networks', name: 'Networks', new: true },
                { id: 'agents', name: 'Agents' },
                { id: 'market', name: 'Market' },
                { id: 'proposals', name: 'Proposals' },
                { id: 'treasury', name: 'Treasury' },
                { id: 'wallet', name: 'Wallet' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDashboardState(prev => ({ ...prev, activeTab: tab.id }))}
                  className={`nav-vibrant-tab ${
                    dashboardState.activeTab === tab.id ? 'active' : ''
                  }`}
                >
                  {tab.name}
                  {tab.new && (
                    <span className="badge">NEW</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Enhanced Content */}
        <main>
          <div className="container-vibrant" style={{padding: 'var(--space-2xl) 0'}}>
            {dashboardState.activeTab === 'overview' && renderEnhancedOverview()}
            {dashboardState.activeTab === 'networks' && <NetworkDataWindows />}
            {dashboardState.activeTab === 'agents' && <DemoAgentsContent />}
            {dashboardState.activeTab === 'market' && <DemoMarketContent />}
            {dashboardState.activeTab === 'proposals' && <DemoProposalsContent />}
            {dashboardState.activeTab === 'treasury' && <DemoTreasuryContent />}
            {dashboardState.activeTab === 'wallet' && (
              <div style={{maxWidth: '600px', margin: '0 auto'}}>
                <div className="card-vibrant-elevated">
                  <div className="card-header">
                    <h2 className="text-title">Enhanced Wallet</h2>
                    <p className="text-body">Manage your cross-chain assets</p>
                  </div>
                  <EnhancedWalletWidget 
                    showBalance={true}
                    showPrivacyControls={true}
                    showCrossChain={true}
                    compact={false}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </EnhancedWalletProvider>
  );
};

export default EnhancedVaultChainDashboard;
