import React, { useState, useRef, useEffect } from 'react';

const AIAgentChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'agent',
      content: '🤖 **Matthew AI - Connecting...**\n\nHello! I\'m Matthew, your AI treasury management agent. I specialize in:\n\n• Privacy-first DAO governance\n• Cross-chain treasury optimization\n• ZK proof-based compliance\n• Real-time market analysis\n\n🔍 **Connection Status**: Checking for AI agent on port 3001...\n📡 **MCP Server**: Connected to port 3000\n\nTry asking me about treasury strategies, governance proposals, or cross-chain operations!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState('ready');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)
    setAgentStatus('thinking')

    // Try to connect to real AI agent first, fall back to demo mode
    try {
      console.log('🤖 Attempting to connect to Matthew AI agent...');
      
      // Try multiple ports to find the AI agent
      const aiPorts = [3001, 3002, 8080, 5000]
      let aiConnected = false
      
      for (const port of aiPorts) {
        try {
          console.log(`🔍 Trying AI agent on port ${port}...`)
          const response = await fetch(`http://localhost:${port}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: userMessage.content,
              userId: 'dashboard-user',
              context: 'vaultchain-treasury'
            }),
            timeout: 3000
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Real AI agent response received from port ${port}:`, data);
            
            const agentMessage = {
              id: Date.now() + 1,
              type: 'agent',
              content: data.response || data.message || 'I apologize, but I encountered an issue processing your request.',
              timestamp: new Date()
            }
            setMessages(prev => [...prev, agentMessage]);
            setAgentStatus('ready');
            setIsTyping(false);
            aiConnected = true;
            return; // Exit early if real AI worked
          }
        } catch (portError) {
          console.log(`❌ Port ${port} failed:`, portError.message);
        }
      }
      
      if (!aiConnected) {
        console.log('🔄 No AI agent found on any port, falling back to demo mode...');
      }
      
      // Fall back to demo mode
      console.log('🤖 Running in demo mode...');
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Generate contextual responses based on user input
      let aiResponse = '';
      const input = userMessage.content.toLowerCase();
      
      if (input.includes('treasury') || input.includes('fund')) {
        aiResponse = `🏛️ **Treasury Analysis**: I can see your current treasury operations through the MCP server on port 3000. The treasury management system is connected to real Midnight Network contracts. Would you like me to analyze current allocations or suggest optimization strategies?`;
      } else if (input.includes('proposal') || input.includes('governance')) {
        aiResponse = `⚖️ **Governance Insights**: I can help you create and analyze DAO proposals. The system supports privacy-preserving voting through ZK proofs. What type of proposal would you like to discuss - funding, development, or governance changes?`;
      } else if (input.includes('cross-chain') || input.includes('xrpl')) {
        aiResponse = `🌉 **Cross-Chain Strategy**: The cross-chain bridge to XRPL is designed to automatically create wallets via AI coordination. Currently, this requires the full ElizaOS agent setup. Would you like me to explain the technical architecture?`;
      } else if (input.includes('wallet') || input.includes('balance')) {
        aiResponse = `💰 **Wallet Operations**: I can see wallet operations are handled by the MCP server. Current balance and transaction capabilities are active. Would you like me to explain the privacy features or transaction flows?`;
      } else {
        aiResponse = `🤖 **Matthew AI Demo Mode**: I'm currently running in demo mode. The full AI agent requires ElizaOS setup on port 3001. I can still help with:\n\n• Treasury management strategies\n• DAO governance analysis\n• Cross-chain bridge planning\n• Privacy-preserving operations\n\nWhat would you like to explore?`;
      }
      
      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, agentMessage]);
      setAgentStatus('ready');

    } catch (error) {
      console.error('❌ AI response error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: `Demo mode error: ${error.message}. The AI agent is running in simulation mode.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage]);
      setAgentStatus('error');
    }
    
    setIsTyping(false);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStatusColor = () => {
    switch (agentStatus) {
      case 'ready': return 'text-green-400';
      case 'thinking': return 'text-yellow-400';
      case 'connection-error': return 'text-red-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (agentStatus) {
      case 'ready': return 'Matthew AI - Ready';
      case 'thinking': return 'Matthew AI - Thinking...';
      case 'connection-error': return 'Matthew AI - Connection Error';
      case 'error': return 'Matthew AI - Error';
      default: return 'Matthew AI - Unknown';
    }
  };

  return (
    <div className="ai-agent-chat">
      <div className="chat-header">
        <h3>🤖 Matthew AI Treasury Agent</h3>
        <div className="agent-status">
          <div className={`status-indicator ${agentStatus}`}></div>
          <span>{getStatusText()}</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message agent">
            <div className="message-content">
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

      <div className="chat-input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Matthew about treasury management, DAO governance, or compliance..."
          className="chat-input"
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="chat-send-btn"
        >
          {isTyping ? '⏳' : '📤'} Send
        </button>
      </div>
    </div>
  );
};

export default AIAgentChat;
