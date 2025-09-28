import React, { useState, useRef, useEffect } from 'react';
import './AIChatInterface.css';

const AIChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "🏰 **Welcome to Vaultchain** ⚔️\n\n*Powered by the Oracle of the Midnight Realm*\n\nI am your AI Treasury CFO, transforming governance from spreadsheets into stories. Built on Midnight Network's privacy-first foundation, I help DAOs, NFT collections, and gaming guilds manage treasuries across multiple blockchains.\n\n**🌟 Vaultchain Capabilities:**\n• 🔮 **AI Treasury Proposals** - Risk-analyzed, impact-scored recommendations\n• 🛡️ **Privacy-Preserving Governance** - ZK proofs protect your identity\n• 🌙 **Midnight Network Integration** - Real blockchain operations\n• ⚔️ **Story-Driven Engagement** - Make governance feel like an adventure\n• 🏰 **Multichain Ready** - Expanding to XRPL and EVM chains\n\n*Ready to showcase with Kingdom of Gold - the first Web3 game powered by Vaultchain!*\n\nWhat treasury quest shall we embark upon? ✨",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      let response, data, aiMessage;
      
      // Check if user is asking for a treasury proposal
      const isProposalRequest = currentMessage.toLowerCase().includes('proposal') || 
                               currentMessage.toLowerCase().includes('treasury') ||
                               currentMessage.toLowerCase().includes('generate') ||
                               currentMessage.toLowerCase().includes('quest');
      
      if (isProposalRequest) {
        // Generate a treasury proposal
        response = await fetch('http://localhost:3004/api/proposal/generate', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`Treasury agent not responding (${response.status})`);
        }

        data = await response.json();
        
        if (data.success && data.proposal) {
          const proposal = data.proposal;
          aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            content: `🌙 **${proposal.summary.title}** ⚔️

✨ *The Oracle has divined a new quest for the Sacred Treasury!*

**📜 Quest Description:**
${proposal.summary.description}

**🎯 Mystical Allocation:**
• 🛡️ **Reserves**: ${proposal.allocation.reserves}% - ${proposal.summary.keyPoints[0]?.split(' - ')[1] || 'Protective barriers'}
• ⚒️ **Development**: ${proposal.allocation.development}% - ${proposal.summary.keyPoints[1]?.split(' - ')[1] || 'Forge of innovation'}
• 🌟 **Incentives**: ${proposal.allocation.incentives}% - ${proposal.summary.keyPoints[2]?.split(' - ')[1] || 'Guild rewards'}
• 🏰 **Community**: ${proposal.allocation.community}% - ${proposal.summary.keyPoints[3]?.split(' - ')[1] || 'Realm expansion'}

**🔮 Risk Assessment:** ${(proposal.riskScore * 100).toFixed(1)}% - ${proposal.recommendedAction.message}

**⭐ Oracle's Confidence:** ${(proposal.aiConfidence * 100).toFixed(0)}%

*Shall the Guild proceed with this mystical quest?*`,
            timestamp: new Date(),
            proposalData: proposal // Store proposal data for voting
          };
        } else {
          aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            content: "🌙 The mystical energies are disrupted. I cannot divine a treasury quest at this moment. Please try again, Guardian.",
            timestamp: new Date()
          };
        }
      } else {
        // Handle general conversation
        aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: `🔮 Greetings, Guardian! I sense you seek wisdom about the Sacred Treasury. 

I can help you with:
• **"Generate a treasury proposal"** - Divine new mystical quests
• **"Show market analysis"** - Reveal cosmic conditions
• **"Treasury status"** - Check the realm's magical energy
• **"Quest types"** - Explore available adventures

What mysteries shall we explore together? ⚔️✨`,
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error connecting to ElizaOS agent:', error);
      
      // Fallback to treasury agent if ElizaOS is not available
      try {
        const fallbackResponse = await handleFallbackResponse(currentMessage);
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: fallbackResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (fallbackError) {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: "🤖 I'm having trouble connecting to my ElizaOS agent. Please make sure it's running:\n\n1. Start ElizaOS agent: `cd zk-guild-gate/eliza-agent && npm start`\n2. Or use the enhanced startup script: `./start-enhanced-dao.sh`\n\nI need the full ElizaOS framework to have proper conversations with memory and context!",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }

    setIsLoading(false);
  };

  const handleFallbackResponse = async (message) => {
    // Fallback to treasury agent API when ElizaOS is not available
    const messageText = message.toLowerCase();
    
    if (messageText.includes('proposal') || messageText.includes('generate')) {
      return await handleProposalRequest(message);
    } else if (messageText.includes('market') || messageText.includes('analysis')) {
      return await handleMarketAnalysis();
    } else if (messageText.includes('zk') || messageText.includes('privacy') || messageText.includes('proof')) {
      return handleZKExplanation();
    } else if (messageText.includes('meme') || messageText.includes('yolo')) {
      return await handleMemeCoinRequest();
    } else {
      return "🤖 I'm running in fallback mode. For full AI conversations, please start the ElizaOS agent!\n\nTry asking about:\n• Generate proposals\n• Market analysis\n• ZK proofs\n• Meme coin investments";
    }
  };

  const handleProposalRequest = async (message) => {
    try {
      // Extract proposal type from message
      const proposalTypes = [
        'treasury_allocation', 'emergency_fund', 'development_sprint',
        'marketing_campaign', 'partnership_fund', 'research_grant',
        'security_audit', 'infrastructure_upgrade', 'community_event',
        'token_buyback', 'yield_farming', 'cross_chain_expansion', 'meme_coin_yolo'
      ];
      
      let selectedType = null;
      const messageText = message.toLowerCase();
      
      for (const type of proposalTypes) {
        if (messageText.includes(type.replace('_', ' '))) {
          selectedType = type;
          break;
        }
      }
      
      // Special cases
      if (messageText.includes('meme') || messageText.includes('yolo')) {
        selectedType = 'meme_coin_yolo';
      } else if (messageText.includes('emergency')) {
        selectedType = 'emergency_fund';
      } else if (messageText.includes('development') || messageText.includes('dev')) {
        selectedType = 'development_sprint';
      }

      const url = selectedType 
        ? `http://localhost:3001/api/proposal/generate?type=${selectedType}`
        : `http://localhost:3001/api/proposal/generate`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        const proposal = data.proposal;
        const riskColor = proposal.riskScore > 0.7 ? "🔴" : 
                        proposal.riskScore > 0.4 ? "🟡" : "🟢";
        
        return `🤖 **AI Treasury Proposal Generated**\n\n` +
               `**${proposal.summary.title}**\n` +
               `${proposal.summary.description}\n\n` +
               `📊 **Risk Score**: ${riskColor} ${(proposal.riskScore * 100).toFixed(1)}%\n` +
               `🎯 **AI Confidence**: ${(proposal.aiConfidence * 100).toFixed(1)}%\n` +
               `💰 **Funding**: ${proposal.fundingAmount}\n` +
               `⏱️ **Duration**: ${proposal.duration}\n\n` +
               `**Key Points:**\n${proposal.summary.keyPoints.map(point => `• ${point}`).join('\n')}\n\n` +
               `**Recommendation**: ${proposal.recommendedAction.action} - ${proposal.recommendedAction.message}`;
      } else {
        throw new Error("Failed to generate proposal");
      }
    } catch (error) {
      return "🤖 I'm having trouble generating proposals right now. Make sure the treasury agent is running on port 3001!";
    }
  };

  const handleMarketAnalysis = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/market/analysis');
      const data = await response.json();
      
      if (data.success) {
        const analysis = data.analysis;
        
        return `📊 **Market Analysis Report**\n\n` +
               `🌊 **Volatility**: ${(analysis.volatility * 100).toFixed(1)}%\n` +
               `💧 **Liquidity Needs**: ${(analysis.liquidityNeeds * 100).toFixed(1)}%\n` +
               `⚡ **Development Priority**: ${(analysis.developmentPriority * 100).toFixed(1)}%\n` +
               `🌱 **Community Growth**: ${(analysis.communityGrowth * 100).toFixed(1)}%\n` +
               `🎯 **AI Confidence**: ${(analysis.confidence * 100).toFixed(1)}%\n\n` +
               `**Recommendation**: ${analysis.volatility > 0.4 ? 
                 "🛡️ Conservative approach - consider emergency fund or security audit" :
                 analysis.developmentPriority > 0.35 ?
                 "⚡ Growth focus - development sprint or infrastructure upgrade recommended" :
                 "⚖️ Balanced approach - standard treasury allocation optimal"}`;
      }
    } catch (error) {
      return "📊 Market analysis unavailable - treasury agent offline. Start with: `node eliza-treasury-agent.js`";
    }
  };

  const handleZKExplanation = () => {
    return `🔐 **Zero-Knowledge Privacy Explained**\n\n` +
           `**What are ZK Proofs?**\n` +
           `Zero-knowledge proofs let you prove something is true without revealing the actual information. ` +
           `Like proving you own an NFT without showing your wallet address!\n\n` +
           `**Our Privacy Features:**\n` +
           `🛡️ **Membership Verification**: Prove NFT ownership anonymously\n` +
           `🗳️ **Anonymous Voting**: Vote on proposals without revealing identity\n` +
           `🔒 **Nullifier Protection**: Prevents double-voting while maintaining privacy\n` +
           `🌙 **Midnight Network**: Built on privacy-first blockchain technology\n\n` +
           `**Contract Address**: \`02003adbb41861f75f18482c9bcf9d1ffee56bd9bc96ab725f9daafcf6dfc1828f5b\`\n` +
           `**Merkle Root**: \`6620677555389692082\`\n\n` +
           `Your wallet address never leaves your device - that's true privacy! 🔐✨`;
  };

  const handleMemeCoinRequest = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/proposal/generate?type=meme_coin_yolo');
      const data = await response.json();
      
      if (data.success) {
        const proposal = data.proposal;
        return `🚀 **YOLO MEME COIN PROPOSAL** 🚀\n\n` +
               `**${proposal.summary.title}**\n\n` +
               `💎🙌 **Diamond Hands Mode Activated!**\n` +
               `${proposal.summary.description}\n\n` +
               `🌶️ **Spicy Details:**\n${proposal.summary.keyPoints.map(point => `• ${point}`).join('\n')}\n\n` +
               `⚠️ **Risk Level**: MAXIMUM CHAOS (${(proposal.riskScore * 100).toFixed(1)}%)\n` +
               `🎯 **AI Confidence**: ${(proposal.aiConfidence * 100).toFixed(1)}% (I have no idea what I'm doing)\n\n` +
               `**Recommendation**: ${proposal.recommendedAction.message}\n\n` +
               `${proposal.disclaimer || "🎢 Buckle up for maximum volatility!"}`;
      }
    } catch (error) {
      return "🚀 YOLO mode unavailable! Start the treasury agent to access maximum chaos mode! 💎🙌";
    }
  };

  const handleGeneralResponse = (message) => {
    const responses = [
      "🤖 I'm ElizaDAO, your AI treasury manager! Ask me about proposals, market analysis, or ZK privacy.",
      "💡 Try asking me to 'generate a proposal' or 'analyze market conditions'!",
      "🔐 I specialize in privacy-first DAO governance. What treasury challenge can I help with?",
      "📊 I can create 13 different types of proposals - from conservative allocations to YOLO meme coins!",
      "🌙 Built on Midnight Network for maximum privacy. Your secrets are safe with me!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: "📜 Conjure Proposal", action: "Conjure a mystical treasury proposal" },
    { label: "🎭 Jester's Gambit", action: "Create a legendary meme coin quest" },
    { label: "🔮 Divine Markets", action: "Divine the cosmic market prophecies" },
    { label: "⚡ Arcane Secrets", action: "Reveal the secrets of zero-knowledge enchantments" }
  ];

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <div className="ai-avatar">🔮</div>
        <div className="ai-info">
          <h3>Midnight Oracle</h3>
          <p>Keeper of Sacred Treasury</p>
        </div>
        <div className="status-indicator online"></div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="message-content typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="quick-action-btn"
            onClick={() => {
              setInputMessage(action.action);
              setTimeout(() => handleSendMessage(), 100);
            }}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="input-container">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Commune with the Oracle about sacred treasury, mystical quests, or arcane enchantments..."
          className="message-input"
          rows="2"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="send-button"
        >
          {isLoading ? '🔮' : '✨'}
        </button>
      </div>
    </div>
  );
};

export default AIChatInterface;
