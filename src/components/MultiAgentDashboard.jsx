/**
 * @file MultiAgentDashboard.jsx
 * @description Multi-Agent AI Dashboard showcasing Matthew, Xara, and Ada
 * 
 * This dashboard displays the coordinated analysis from all three AI agents:
 * - Matthew: Midnight Network privacy & treasury specialist
 * - Xara: XRPL/Xahau ecosystem specialist
 * - Ada: Cardano ecosystem specialist
 * 
 * Features real-time Birdeye integration and cross-chain opportunity detection.
 */

import React, { useState, useEffect } from 'react';
import EnhancedAIMarketAnalyzer from '../services/EnhancedAIMarketAnalyzer.js';
import AdaAgent from '../agents/AdaAgent.js';
import '../components/ModernMinimalTheme.css';

const MultiAgentDashboard = () => {
  const [enhancedAnalyzer, setEnhancedAnalyzer] = useState(null);
  const [dashboardState, setDashboardState] = useState({
    isLoading: true,
    agents: {
      matthew: { status: 'initializing', opportunities: [], performance: {} },
      xara: { status: 'initializing', opportunities: [], performance: {} },
      ada: { status: 'initializing', opportunities: [], performance: {} }
    },
    crossChainOpportunities: [],
    coordinatedRecommendations: [],
    marketCorrelations: {},
    riskAssessment: {},
    totalOpportunities: 0,
    highConfidenceOpportunities: 0
  });

  // Initialize enhanced analyzer
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        console.log('🚀 Initializing Multi-Agent AI System...');
        
        const analyzer = new EnhancedAIMarketAnalyzer({
          birdeyeApiKey: process.env.BIRDEYE_API_KEY,
          enableMultiAgent: true,
          crossChainAnalysis: true,
          ecosystems: ['CARDANO', 'XRPL', 'MIDNIGHT']
        });

        setEnhancedAnalyzer(analyzer);

        // Subscribe to enhanced state updates
        analyzer.enhancedState$.subscribe(state => {
          updateDashboardFromAnalyzer(state);
        });

        setDashboardState(prev => ({ ...prev, isLoading: false }));
        console.log('✅ Multi-Agent system initialized');

      } catch (error) {
        console.error('❌ System initialization failed:', error);
        setDashboardState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeSystem();
  }, []);

  const updateDashboardFromAnalyzer = (analyzerState) => {
    const opportunities = analyzerState.opportunities || [];
    
    // Group opportunities by agent/ecosystem
    const agentOpportunities = {
      matthew: opportunities.filter(opp => 
        opp.ecosystem === 'MIDNIGHT' || opp.agent === 'MATTHEW'
      ),
      xara: opportunities.filter(opp => 
        opp.ecosystem === 'XRPL' || opp.agent === 'XARA'
      ),
      ada: opportunities.filter(opp => 
        opp.ecosystem === 'CARDANO' || opp.agent === 'ADA'
      )
    };

    setDashboardState(prev => ({
      ...prev,
      agents: {
        matthew: {
          ...prev.agents.matthew,
          status: 'active',
          opportunities: agentOpportunities.matthew,
          performance: calculateAgentPerformance(agentOpportunities.matthew)
        },
        xara: {
          ...prev.agents.xara,
          status: 'active',
          opportunities: agentOpportunities.xara,
          performance: calculateAgentPerformance(agentOpportunities.xara)
        },
        ada: {
          ...prev.agents.ada,
          status: 'active',
          opportunities: agentOpportunities.ada,
          performance: calculateAgentPerformance(agentOpportunities.ada)
        }
      },
      crossChainOpportunities: analyzerState.crossChainOpportunities || [],
      coordinatedRecommendations: analyzerState.coordinatedRecommendations || [],
      marketCorrelations: analyzerState.marketCorrelations || {},
      riskAssessment: analyzerState.riskAssessment || {},
      totalOpportunities: opportunities.length,
      highConfidenceOpportunities: opportunities.filter(opp => opp.confidence > 0.8).length
    }));
  };

  const calculateAgentPerformance = (opportunities) => {
    if (opportunities.length === 0) return { avgConfidence: 0, topOpportunity: null };
    
    const avgConfidence = opportunities.reduce((sum, opp) => sum + opp.confidence, 0) / opportunities.length;
    const topOpportunity = opportunities.reduce((best, current) => 
      current.confidence > (best?.confidence || 0) ? current : best, null
    );

    return {
      avgConfidence,
      topOpportunity,
      opportunityCount: opportunities.length
    };
  };

  const getAgentIcon = (agentName) => {
    switch (agentName) {
      case 'matthew': return '🏛️';
      case 'xara': return '🌊';
      case 'ada': return '🔷';
      default: return '🤖';
    }
  };

  const getAgentColor = (agentName) => {
    switch (agentName) {
      case 'matthew': return 'purple';
      case 'xara': return 'blue';
      case 'ada': return 'teal';
      default: return 'gray';
    }
  };

  const getEcosystemIcon = (ecosystem) => {
    switch (ecosystem) {
      case 'CARDANO': return '🔷';
      case 'ETHEREUM': return '⟠';
      case 'XRPL': return '🌊';
      case 'MIDNIGHT': return '🌙';
      default: return '⚡';
    }
  };

  const triggerManualScan = async () => {
    if (enhancedAnalyzer) {
      console.log('🔍 Triggering manual scan...');
      await enhancedAnalyzer.performQuickScan();
    }
  };

  if (dashboardState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Initializing Multi-Agent AI System...</div>
          <div className="text-gray-400 text-sm mt-2">Loading Matthew, Xara, and Ada agents</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🤖 Multi-Agent AI Command Center</h1>
            <p className="text-gray-400">Coordinated analysis from Matthew, Xara, and Ada agents</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">All Agents Active</span>
            </div>
            
            <button
              onClick={triggerManualScan}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔍 Force Scan
            </button>
          </div>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Opportunities</p>
                <p className="text-2xl font-bold text-white">{dashboardState.totalOpportunities}</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400">💎</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">High Confidence</p>
                <p className="text-2xl font-bold text-white">{dashboardState.highConfidenceOpportunities}</p>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Cross-Chain Opps</p>
                <p className="text-2xl font-bold text-white">{dashboardState.crossChainOpportunities.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400">🌉</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Coordinated Recs</p>
                <p className="text-2xl font-bold text-white">{dashboardState.coordinatedRecommendations.length}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400">🤝</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(dashboardState.agents).map(([agentName, agentData]) => (
          <div key={agentName} className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getAgentIcon(agentName)}</span>
                  <div>
                    <h3 className="font-semibold text-white capitalize">{agentName} AI</h3>
                    <p className="text-xs text-gray-400">
                      {agentName === 'matthew' && 'Midnight Privacy & Treasury Specialist'}
                      {agentName === 'xara' && 'XRPL Ecosystem Specialist'}
                      {agentName === 'ada' && 'Cardano Ecosystem Specialist'}
                    </p>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded text-xs ${
                  agentData.status === 'active' ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
                }`}>
                  {agentData.status}
                </div>
              </div>

              {/* Agent Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Opportunities</p>
                  <p className="text-white font-medium">{agentData.opportunities.length}</p>
                </div>
                <div>
                  <p className="text-gray-400">Avg Confidence</p>
                  <p className="text-white font-medium">
                    {(agentData.performance.avgConfidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Agent Opportunities */}
            <div className="p-4 max-h-64 overflow-y-auto">
              {agentData.opportunities.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">No opportunities detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {agentData.opportunities.slice(0, 3).map((opp, index) => (
                    <div key={index} className="bg-gray-900/50 rounded p-3 border border-gray-600">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span>{getEcosystemIcon(opp.ecosystem)}</span>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {opp.token?.symbol || opp.asset?.symbol || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-400">{opp.ecosystem}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            opp.confidence > 0.8 ? 'text-green-400' :
                            opp.confidence > 0.6 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {(opp.confidence * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs text-gray-400">Confidence</p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-300 mb-2">
                        {opp.analysis?.reasoning || opp.reasoning || 'AI analysis in progress'}
                      </p>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Type: {opp.type}</span>
                        <span className="text-gray-400">
                          Expected: {opp.analysis?.expectedReturn || opp.expectedReturn || 'TBD'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cross-Chain Opportunities */}
      {dashboardState.crossChainOpportunities.length > 0 && (
        <div className="mb-8">
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white flex items-center">
                🌉 Cross-Chain Opportunities
                <span className="ml-2 px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-sm">
                  {dashboardState.crossChainOpportunities.length}
                </span>
              </h2>
              <p className="text-sm text-gray-400">Arbitrage and bridge opportunities across ecosystems</p>
            </div>
            
            <div className="p-4 space-y-4">
              {dashboardState.crossChainOpportunities.map((opp, index) => (
                <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">{opp.symbol} Arbitrage</h3>
                      <p className="text-sm text-gray-400">Cross-chain price difference detected</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">
                        +{(opp.estimatedProfit * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-400">Est. Profit</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {opp.opportunities.slice(0, 2).map((chainOpp, idx) => (
                      <div key={idx} className="bg-gray-800/50 rounded p-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <span>{getEcosystemIcon(chainOpp.ecosystem)}</span>
                          <span className="text-sm text-white">{chainOpp.ecosystem}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          Price: ${chainOpp.token?.price || chainOpp.asset?.price || 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Coordinated Recommendations */}
      {dashboardState.coordinatedRecommendations.length > 0 && (
        <div className="mb-8">
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white flex items-center">
                🤝 Coordinated Agent Recommendations
                <span className="ml-2 px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-sm">
                  High Consensus
                </span>
              </h2>
              <p className="text-sm text-gray-400">Opportunities with strong agreement from multiple agents</p>
            </div>
            
            <div className="p-4 space-y-4">
              {dashboardState.coordinatedRecommendations.map((rec, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">
                        {rec.opportunity.token?.symbol || rec.opportunity.asset?.symbol}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {rec.consensus.agentScores.length} agents in agreement
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-400">
                        {rec.consensus.recommendation}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(rec.consensus.agreement * 100).toFixed(0)}% consensus
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 mb-3">
                    {rec.consensus.agentScores.map((score, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span>{getAgentIcon(score.agent)}</span>
                        <span className="text-sm text-gray-300">
                          {(score.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-800/50 rounded p-2">
                    <p className="text-xs text-gray-300">
                      Average Score: {(rec.consensus.averageScore * 100).toFixed(0)}% | 
                      Agreement Level: {(rec.consensus.agreement * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Status Footer */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Birdeye API Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Multi-Chain Scanning Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm text-gray-300">Agent Coordination Online</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            Last Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiAgentDashboard;
