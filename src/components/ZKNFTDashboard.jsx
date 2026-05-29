/**
 * ZK NFT Dashboard - Privacy-Preserving NFT Management Interface
 * Integrates with ZK NFT Service and AI NFT Plugin
 */

import React, { useState, useEffect } from 'react';
import { ZKNFTService } from '../services/ZKNFTService.js';
import { AINFTPlugin } from '../plugins/ai-nft-plugin.js';

const ZKNFTDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [nftService] = useState(new ZKNFTService());
  const [aiPlugin] = useState(new AINFTPlugin({ autoMintEnabled: true }));
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [mintResult, setMintResult] = useState(null);

  // Form states
  const [singleNFTForm, setSingleNFTForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    category: 'art'
  });

  const [collectionForm, setCollectionForm] = useState({
    name: '',
    description: '',
    concept: '',
    totalSupply: 100,
    autoMint: 5
  });

  const [aiPromptForm, setAIPromptForm] = useState({
    prompt: '',
    generateImage: true,
    style: 'digital'
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await nftService.getStats();
      const aiInsights = await aiPlugin.getAIInsights();
      setStats({ ...statsData, ...aiInsights });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        totalSupply: 0,
        collectionCount: 0,
        mintingEnabled: true,
        aiRecommendation: 'Unable to load recommendations'
      });
    }
  };

  const handleSingleNFTMint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMintResult(null);

    try {
      const metadata = {
        name: singleNFTForm.name,
        description: singleNFTForm.description,
        image: singleNFTForm.imageUrl,
        attributes: [
          { trait_type: 'Category', value: singleNFTForm.category },
          { trait_type: 'Minted By', value: 'User' },
          { trait_type: 'Privacy Level', value: 'ZK Protected' }
        ]
      };

      const result = await nftService.mintSingleNFT(metadata, 'user-secret-key');
      setMintResult(result);
      
      if (result.success) {
        setSingleNFTForm({ name: '', description: '', imageUrl: '', category: 'art' });
        await loadStats();
      }
    } catch (error) {
      setMintResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMintResult(null);

    try {
      const result = await aiPlugin.createCollectionFromConcept(
        collectionForm.concept,
        {
          totalSupply: collectionForm.totalSupply,
          autoMintCount: collectionForm.autoMint,
          userSecret: 'collection-creator-secret'
        }
      );

      setMintResult(result);
      
      if (result.success) {
        setCollectionForm({ name: '', description: '', concept: '', totalSupply: 100, autoMint: 5 });
        await loadStats();
      }
    } catch (error) {
      setMintResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAIPromptMint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMintResult(null);

    try {
      const result = await aiPlugin.createNFTFromPrompt(
        aiPromptForm.prompt,
        {
          generateImage: aiPromptForm.generateImage,
          style: aiPromptForm.style,
          userSecret: 'ai-prompt-secret'
        }
      );

      setMintResult(result);
      
      if (result.success) {
        setAIPromptForm({ prompt: '', generateImage: true, style: 'digital' });
        await loadStats();
      }
    } catch (error) {
      setMintResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAutonomousMint = async () => {
    setLoading(true);
    setMintResult(null);

    try {
      const result = await aiPlugin.autonomousMint('user_request', {
        timestamp: Date.now(),
        trigger: 'manual'
      });

      setMintResult(result);
      await loadStats();
    } catch (error) {
      setMintResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Total NFTs</p>
              <p className="text-white text-2xl font-bold">{stats.totalSupply || 0}</p>
            </div>
            <div className="text-purple-400 text-3xl">🎨</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Collections</p>
              <p className="text-white text-2xl font-bold">{stats.collectionCount || 0}</p>
            </div>
            <div className="text-purple-400 text-3xl">🏛️</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Minting Status</p>
              <p className="text-white text-lg font-semibold">
                {stats.mintingEnabled ? '🟢 Active' : '🔴 Disabled'}
              </p>
            </div>
            <div className="text-purple-400 text-3xl">⚡</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Privacy Level</p>
              <p className="text-white text-lg font-semibold">🌙 ZK Protected</p>
            </div>
            <div className="text-purple-400 text-3xl">🛡️</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/20">
        <h3 className="text-white text-xl font-bold mb-4 flex items-center">
          🤖 AI Insights & Recommendations
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-purple-200 text-sm">AI Recommendation</p>
            <p className="text-white">{stats.aiRecommendation || 'Loading recommendations...'}</p>
          </div>
          <div>
            <p className="text-purple-200 text-sm">Market Sentiment</p>
            <p className="text-white capitalize">{stats.marketSentiment || 'Analyzing...'}</p>
          </div>
          <div>
            <p className="text-purple-200 text-sm">Suggested Next Action</p>
            <p className="text-white capitalize">{stats.nextAction?.replace('_', ' ') || 'Standby...'}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/20">
        <h3 className="text-white text-xl font-bold mb-4">🚀 Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('single')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
          >
            🎨 Mint Single NFT
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
          >
            🏛️ Create Collection
          </button>
          <button
            onClick={handleAutonomousMint}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
          >
            🤖 {loading ? 'Minting...' : 'AI Auto Mint'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSingleNFT = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/20">
        <h3 className="text-white text-xl font-bold mb-6 flex items-center">
          🎨 Mint Single NFT with ZK Privacy
        </h3>
        
        <form onSubmit={handleSingleNFTMint} className="space-y-4">
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              NFT Name
            </label>
            <input
              type="text"
              value={singleNFTForm.name}
              onChange={(e) => setSingleNFTForm({...singleNFTForm, name: e.target.value})}
              className="w-full bg-white/10 border border-purple-300/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
              placeholder="Enter NFT name"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={singleNFTForm.description}
              onChange={(e) => setSingleNFTForm({...singleNFTForm, description: e.target.value})}
              className="w-full bg-white/10 border border-purple-300/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
              placeholder="Describe your NFT"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={singleNFTForm.imageUrl}
              onChange={(e) => setSingleNFTForm({...singleNFTForm, imageUrl: e.target.value})}
              className="w-full bg-white/10 border border-purple-300/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
              placeholder="https://example.com/image.png"
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Category
            </label>
            <select
              value={singleNFTForm.category}
              onChange={(e) => setSingleNFTForm({...singleNFTForm, category: e.target.value})}
              className="w-full bg-white/10 border border-purple-300/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="art">🎨 Art</option>
              <option value="gaming">🎮 Gaming</option>
              <option value="collectible">💎 Collectible</option>
              <option value="aiGenerated">🤖 AI Generated</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            {loading ? '🔄 Minting with ZK Privacy...' : '🌙 Mint NFT Privately'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderCollection = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/20">
        <h3 className="text-white text-xl font-bold mb-6 flex items-center">
          🏛️ Create NFT Collection with AI
        </h3>
        
        <form onSubmit={handleCollectionCreate} className="space-y-4">
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Collection Concept
            </label>
            <input
              type="text"
              value={collectionForm.concept}
              onChange={(e) => setCollectionForm({...collectionForm, concept: e.target.value})}
              className="w-full bg-white/10 border border-purple-300/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
              placeholder="e.g., 'Mystical Creatures', 'Digital Landscapes', 'Abstract Emotions'"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Total Supply
              </label>
              <input
                type="number"
                value={collectionForm.totalSupply}
                onChange={(e) => setCollectionForm({...collectionForm, totalSupply: parseInt(e.target.value)})}
                className="w-full bg-white/10 border border-purple-300/20 rounded-lg px-4 py-2 text-white"
                min="1"
                max="10000"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Auto-Mint Count
              </label>
              <input
                type="number"
                value={collectionForm.autoMint}
                onChange={(e) => setCollectionForm({...collectionForm, autoMint: parseInt(e.target.value)})}
                className="w-full bg-white/10 border border-purple-300/20 rounded-lg px-4 py-2 text-white"
                min="0"
                max="100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            {loading ? '🔄 Creating Collection...' : '🤖 Create AI Collection'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderAIPrompt = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/20">
        <h3 className="text-white text-xl font-bold mb-6 flex items-center">
          🤖 AI-Generated NFT from Prompt
        </h3>
        
        <form onSubmit={handleAIPromptMint} className="space-y-4">
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              AI Prompt
            </label>
            <textarea
              value={aiPromptForm.prompt}
              onChange={(e) => setAIPromptForm({...aiPromptForm, prompt: e.target.value})}
              className="w-full bg-white/10 border border-purple-300/20 rounded-lg px-4 py-2 text-white placeholder-purple-300"
              placeholder="Describe what you want the AI to create..."
              rows="4"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Art Style
              </label>
              <select
                value={aiPromptForm.style}
                onChange={(e) => setAIPromptForm({...aiPromptForm, style: e.target.value})}
                className="w-full bg-white/10 border border-purple-300/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="digital">🖥️ Digital</option>
                <option value="realistic">📸 Realistic</option>
                <option value="abstract">🎨 Abstract</option>
                <option value="cartoon">🎭 Cartoon</option>
                <option value="pixel">🕹️ Pixel Art</option>
                <option value="minimalist">⚪ Minimalist</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center text-purple-200">
                <input
                  type="checkbox"
                  checked={aiPromptForm.generateImage}
                  onChange={(e) => setAIPromptForm({...aiPromptForm, generateImage: e.target.checked})}
                  className="mr-2"
                />
                Generate Image
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            {loading ? '🔄 AI Creating NFT...' : '✨ Generate AI NFT'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!mintResult) return null;

    return (
      <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border ${
        mintResult.success ? 'border-green-300/20' : 'border-red-300/20'
      }`}>
        <h3 className={`text-xl font-bold mb-4 flex items-center ${
          mintResult.success ? 'text-green-400' : 'text-red-400'
        }`}>
          {mintResult.success ? '✅ Success!' : '❌ Error'}
        </h3>
        
        {mintResult.success ? (
          <div className="space-y-2 text-white">
            {mintResult.nftId && <p><strong>NFT ID:</strong> #{mintResult.nftId}</p>}
            {mintResult.collectionId && <p><strong>Collection ID:</strong> #{mintResult.collectionId}</p>}
            {mintResult.transactionHash && <p><strong>Transaction:</strong> {mintResult.transactionHash}</p>}
            {mintResult.mockMode && <p className="text-yellow-400">⚠️ Demo Mode - Real blockchain integration pending</p>}
          </div>
        ) : (
          <p className="text-red-400">{mintResult.error}</p>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'single', label: '🎨 Single NFT', icon: '🎨' },
    { id: 'collection', label: '🏛️ Collection', icon: '🏛️' },
    { id: 'ai-prompt', label: '🤖 AI Prompt', icon: '🤖' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🌙 ZK NFT Minting Platform
          </h1>
          <p className="text-purple-200">
            Privacy-First • AI-Powered • Zero-Knowledge Protected
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 bg-white/10 backdrop-blur-md rounded-xl p-2 border border-purple-300/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg mx-1 mb-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-200 hover:bg-purple-700/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'single' && renderSingleNFT()}
          {activeTab === 'collection' && renderCollection()}
          {activeTab === 'ai-prompt' && renderAIPrompt()}
          
          {renderResult()}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-purple-300">
          <p>Powered by Midnight Network • Zero-Knowledge Privacy • AI Automation</p>
        </div>
      </div>
    </div>
  );
};

export default ZKNFTDashboard;
