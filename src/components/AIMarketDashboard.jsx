/**
 * @file AIMarketDashboard.jsx
 * @description Real-time AI Market Analysis Dashboard
 * 
 * Displays live market scanning results, meme coin opportunities,
 * volume spikes, and AI agent insights in an easy-to-use interface.
 */

import React, { useState, useEffect } from 'react';
import AIMarketAnalyzer from '../services/AIMarketAnalyzer.js';
import '../components/ModernMinimalTheme.css';

const AIMarketDashboard = () => {
  const [marketAnalyzer, setMarketAnalyzer] = useState(null);
  const [marketState, setMarketState] = useState({
    isScanning: false,
    opportunities: [],
    alerts: [],
    aiInsights: [],
    ecosystemData: {}
  });
  const [selectedEcosystem, setSelectedEcosystem] = useState('ALL');
  const [alertFilter, setAlertFilter] = useState('ALL');

  // Initialize market analyzer
  useEffect(() => {
    const analyzer = new AIMarketAnalyzer({
      quickScanInterval: 30000,  // 30 seconds
      ecosystems: ['XRPL', 'CARDANO', 'MIDNIGHT', 'BASE'],
      volumeSpikeThreshold: 5.0,
      socialMentionThreshold: 100
    });

    setMarketAnalyzer(analyzer);

    // Subscribe to market updates
    const subscription = analyzer.marketState$.subscribe(state => {
      setMarketState(state);
    });

    return () => {
      subscription.unsubscribe();
      analyzer.stopMarketMonitoring();
    };
  }, []);

  // Filter opportunities by ecosystem
  const filteredOpportunities = marketState.opportunities.filter(opp => 
    selectedEcosystem === 'ALL' || opp.ecosystem === selectedEcosystem
  );

  // Filter alerts by priority
  const filteredAlerts = marketState.alerts.filter(alert =>
    alertFilter === 'ALL' || alert.priority === alertFilter
  );

  const getOpportunityIcon = (type) => {
    switch (type) {
      case 'MEME_COIN': return '🐸';
      case 'VOLUME_SPIKE': return '📈';
      case 'NEW_TOKEN': return '🆕';
      case 'DEFI_OPPORTUNITY': return '🏦';
      default: return '💎';
    }
  };

  const getEcosystemIcon = (ecosystem) => {
    switch (ecosystem) {
      case 'XRPL': return '🌊';
      case 'ETHEREUM': return '⟠';
      case 'CARDANO': return '🔷';
      case 'BASE': return '🔵';
      default: return '⚡';
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🤖 AI Market Analyzer</h1>
            <p className="text-gray-400">Real-time opportunity detection across multiple ecosystems</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Scanning Status */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              marketState.isScanning ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${marketState.isScanning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">
                {marketState.isScanning ? 'Scanning Markets...' : 'Monitoring Active'}
              </span>
            </div>
            
            {/* Last Scan Time */}
            {marketState.lastScan && (
              <div className="text-sm text-gray-400">
                Last scan: {new Date(marketState.lastScan).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Opportunities</p>
                <p className="text-2xl font-bold text-white">{marketState.opportunities.length}</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400">💎</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">High Priority Alerts</p>
                <p className="text-2xl font-bold text-white">
                  {marketState.alerts.filter(a => a.priority === 'URGENT' || a.priority === 'HIGH').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-red-400">🚨</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">AI Insights</p>
                <p className="text-2xl font-bold text-white">{marketState.aiInsights.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400">🤖</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Meme Coins Detected</p>
                <p className="text-2xl font-bold text-white">
                  {marketState.opportunities.filter(o => o.type === 'MEME_COIN').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400">🐸</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Ecosystem Filter</label>
          <select
            value={selectedEcosystem}
            onChange={(e) => setSelectedEcosystem(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="ALL">All Ecosystems</option>
            <option value="XRPL">🌊 XRPL</option>
            <option value="ETHEREUM">⟠ Ethereum</option>
            <option value="CARDANO">🔷 Cardano</option>
            <option value="BASE">🔵 Base</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Alert Priority</label>
          <select
            value={alertFilter}
            onChange={(e) => setAlertFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="ALL">All Alerts</option>
            <option value="URGENT">🚨 Urgent</option>
            <option value="HIGH">⚠️ High</option>
            <option value="MEDIUM">ℹ️ Medium</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Opportunities Panel */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">💎 Market Opportunities</h2>
              <p className="text-sm text-gray-400">Real-time detection of high-potential assets</p>
            </div>
            
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {filteredOpportunities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-400">No opportunities detected yet</p>
                  <p className="text-sm text-gray-500">AI agents are scanning markets...</p>
                </div>
              ) : (
                filteredOpportunities.map((opp, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getOpportunityIcon(opp.type)}</span>
                        <div>
                          <h3 className="font-semibold text-white">
                            {opp.asset.symbol} {getEcosystemIcon(opp.ecosystem)}
                          </h3>
                          <p className="text-sm text-gray-400">{opp.asset.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getConfidenceColor(opp.opportunity.confidence)}`}>
                          {(opp.opportunity.confidence * 100).toFixed(0)}% Confidence
                        </div>
                        <div className={`text-xs ${getRiskColor(opp.opportunity.riskLevel)}`}>
                          {opp.opportunity.riskLevel} Risk
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Expected Return</p>
                        <p className="text-sm font-medium text-green-400">{opp.opportunity.expectedReturn}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Timeframe</p>
                        <p className="text-sm font-medium text-white">{opp.opportunity.timeframe}</p>
                      </div>
                    </div>

                    {opp.asset.priceChange24h && (
                      <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                        <div>
                          <p className="text-gray-400">Price Change</p>
                          <p className={`font-medium ${opp.asset.priceChange24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(opp.asset.priceChange24h * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Volume 24h</p>
                          <p className="text-white">${opp.asset.volume24h?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Market Cap</p>
                          <p className="text-white">${opp.asset.marketCap?.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-800/50 rounded p-2 mb-3">
                      <p className="text-xs text-gray-400 mb-1">AI Analysis</p>
                      <p className="text-sm text-gray-300">{opp.opportunity.reasoning}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(opp.timestamp).toLocaleTimeString()}
                      </span>
                      
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                          Add to Watchlist
                        </button>
                        <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors">
                          Analyze Further
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Alerts & AI Insights Panel */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">🚨 Live Alerts</h2>
              <p className="text-sm text-gray-400">High-priority market events</p>
            </div>
            
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">No alerts at this time</p>
                </div>
              ) : (
                filteredAlerts.slice(0, 5).map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    alert.priority === 'URGENT' ? 'bg-red-900/30 border-red-700' :
                    alert.priority === 'HIGH' ? 'bg-yellow-900/30 border-yellow-700' :
                    'bg-blue-900/30 border-blue-700'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        alert.priority === 'URGENT' ? 'bg-red-600 text-white' :
                        alert.priority === 'HIGH' ? 'bg-yellow-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {alert.priority}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-white">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">🤖 AI Insights</h2>
              <p className="text-sm text-gray-400">Agent analysis & recommendations</p>
            </div>
            
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {marketState.aiInsights.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">AI agents analyzing...</p>
                </div>
              ) : (
                marketState.aiInsights.slice(-3).map((insight, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-lg p-3 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-400">
                        {insight.agent} AI
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(insight.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{insight.analysis}</p>
                    <p className="text-xs text-green-400">{insight.recommendation}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Manual Scan Button */}
          <button
            onClick={() => marketAnalyzer?.performQuickScan()}
            disabled={marketState.isScanning}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
          >
            {marketState.isScanning ? 'Scanning...' : '🔍 Force Scan Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIMarketDashboard;
