# 🌐 VaultChain DAO - Privacy-First AI Treasury Management

> **🏆 Complete Hackathon Solution**: Frontend Dashboard + Midnight MCP Server + AI Agent Integration

A revolutionary privacy-first decentralized autonomous organization (DAO) built on Midnight Network with AI-powered treasury management, featuring real on-chain operations and autonomous AI agents.

## 🎯 **Key Features**

### **🔒 Privacy-First Governance**
- Zero-knowledge proofs for private voting via Midnight Network
- Privacy-preserving membership verification
- Anonymous proposal creation and voting

### **🤖 AI Treasury Management**
- **Matthew AI**: Treasury Manager specialist for Midnight Network operations
- **Xara AI**: XRPL specialist for cross-chain wallet management
- Intelligent fund allocation and risk assessment
- Automated cross-chain wallet creation

### **🌉 Multi-Chain Support**
- **Midnight Network**: Primary treasury holding (DUST tokens)
- **XRPL Network**: Cross-chain wallet management
- Automatic XRPL wallet creation when users deposit TDUST
- Real-time multi-chain portfolio tracking

### **📊 Modern Dashboard**
- 6-tab interface: Overview, Treasury, Governance, Wallet, Tokens, AI Agent
- Real-time balance updates across multiple chains
- Copy-to-clipboard wallet addresses
- Direct links to block explorers and faucets

## 🏗️ **Complete System Architecture**

### **🎯 Hackathon Components**
This repository contains **3 integrated systems** demonstrating the full privacy-first DAO solution:

```
🖥️  FRONTEND DASHBOARD (vaultchain/)
    ├── React + Vite modern UI
    ├── 6-tab interface (Overview, Treasury, Governance, Wallet, Tokens, AI)
    ├── Real-time wallet connection status
    ├── On-chain proposal creation & voting
    └── Privacy-preserving operations

🌙  MIDNIGHT MCP SERVER (midnight-mcp-server/)
    ├── Model Context Protocol implementation
    ├── Real Midnight Network integration
    ├── Wallet operations & transaction handling
    ├── ZK proof generation
    └── Contract deployment & interaction

🤖  AI AGENT SYSTEM (eliza-agent/)
    ├── ElizaOS framework integration
    ├── Autonomous treasury management
    ├── Multi-chain coordination
    ├── Privacy-aware decision making
    └── Real-time blockchain monitoring
```

### **🔗 Integration Flow**
```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    MCP Protocol    ┌─────────────────┐
│   Frontend      │◄──────────────►│  Midnight MCP   │◄─────────────────►│   AI Agents     │
│  Dashboard      │                │    Server       │                    │   (ElizaOS)     │
│  (Port 5173)    │                │  (Port 3000)    │                    │  (Port 3001)    │
└─────────────────┘                └─────────────────┘                    └─────────────────┘
         │                                   │                                       │
         ▼                                   ▼                                       ▼
┌─────────────────┐                ┌─────────────────┐                    ┌─────────────────┐
│   User Wallet   │                │ Midnight Network│                    │ Autonomous Ops  │
│   Connection    │                │   (TestNet)     │                    │ & Monitoring    │
│   & Signing     │                │ Real Contracts  │                    │ & Decisions     │
└─────────────────┘                └─────────────────┘                    └─────────────────┘
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 22.15.0+
- Git

### **Installation & Setup**

```bash
# Clone the repository
git clone https://github.com/your-username/vaultchain-dao
cd vaultchain

# Install frontend dependencies
npm install

# Install MCP server dependencies
cd midnight-mcp-server
npm install
cd ..

# Install AI agent dependencies
cd eliza-agent
npm install
cd ..

# Set up environment variables (optional but recommended)
export OPENAI_API_KEY="your-openai-api-key-here"
```

### **🚀 Quick Start Options**

**Option 1: Frontend Only (Recommended for Demo)**
```bash
# Start the VaultChain DAO Dashboard
npm start
```

**Option 2: Complete System (All Components)**
```bash
# Start everything: Frontend + MCP Server + AI Agents
npm run start:complete
```

**That's it!** The dashboard will open at http://localhost:5173 with:
- ✅ Real Midnight Network integration
- ✅ Live smart contract interactions  
- ✅ Working proposal system with deployed contracts
- ✅ Privacy-preserving governance features

### **🔧 Manual Setup (Advanced)**
For individual component control:
```bash
# Terminal 1: Frontend Dashboard
npm start

# Terminal 2: Midnight MCP Server (optional)
cd midnight-mcp-server && npm run dev

# Terminal 3: AI Agent System (optional)  
cd eliza-agent && npm start
```

### **Environment Variables**
Create a `.env` file in the root directory:
```bash
# Optional: Enable AI conversations (recommended)
OPENAI_API_KEY=your-openai-api-key-here

# System will work without API key using fallback responses
```

### **🌐 Access Points**
- **🖥️ VaultChain Dashboard**: http://localhost:5173 (Main UI)
- **🌙 Midnight MCP Server**: http://localhost:3000 (Blockchain Interface)
- **🤖 AI Agent System**: http://localhost:3001 (Autonomous Operations)
- **📊 System Status**: All components health check via dashboard

## 🎮 **How to Use**

### **1. Treasury Management**
- View real-time balances across Midnight (DUST) and XRPL networks
- See treasury XRPL wallet alongside DUST holdings
- Copy wallet addresses with one click

### **2. Cross-Chain Bridge**
- Go to **Wallet** tab → **Cross-Chain Bridge** section
- Enter DUST amount to deposit
- System automatically creates XRPL wallet for you
- Get popup with wallet address, explorer links, and faucet

### **3. AI Agent Interaction**
- Go to **AI Agent** tab
- Chat with Matthew about treasury status
- Get intelligent recommendations and insights

### **4. Multi-Chain Portfolio**
- **Treasury** tab shows both chains side-by-side
- View all managed XRPL wallets with user identification
- Direct links to XRPL explorer and testnet faucet

## 🏆 **Hackathon Innovations**

### **🎯 What Makes This Special**
1. **Complete Integration**: Frontend ↔ MCP Server ↔ AI Agents working together
2. **Real Blockchain Operations**: Not just mockups - actual Midnight Network transactions
3. **Privacy-First Design**: ZK proofs for governance while maintaining transparency
4. **Autonomous AI Treasury**: AI agents that can make real financial decisions
5. **Production-Ready Architecture**: Scalable, secure, and maintainable codebase

### **🔧 Technical Achievements**
- **Model Context Protocol (MCP)**: First DAO to integrate MCP for AI-blockchain communication
- **ElizaOS Integration**: Advanced AI agent framework for autonomous operations
- **Zero-Knowledge Governance**: Private voting with public treasury transparency
- **Real-Time Updates**: Live wallet status, proposal updates, and transaction monitoring
- **Cross-Component Communication**: Seamless data flow between all system parts

## 🛠️ **Tech Stack**

### **🖥️ Frontend Dashboard**
- **React 18** + **Vite** for modern development
- **CSS3** with glassmorphism effects and responsive design
- **Real-time WebSocket** connections for live updates
- **Wallet Integration** with connection status monitoring

### **🌙 Midnight MCP Server**
- **TypeScript** + **Node.js** for type-safe blockchain operations
- **Model Context Protocol** for AI-blockchain communication
- **Midnight SDK** for real network integration
- **Express.js** REST API for frontend communication
- **ZK Proof Generation** for privacy operations

### **🤖 AI Agent System**
- **ElizaOS Framework** for autonomous agent behavior
- **OpenAI GPT Integration** for intelligent decision making
- **Multi-Agent Coordination** for complex treasury operations
- **Real-time Blockchain Monitoring** and response
- **Secure Inter-Agent Communication** protocols

### **⛓️ Blockchain Integration**
- **Midnight Network TestNet**: Privacy-preserving smart contracts
- **Real Wallet Operations**: Actual transaction signing and submission
- **Contract Deployment**: Live DAO contracts with real addresses
- **ZK Circuit Integration**: Privacy-preserving governance mechanisms

### **📜 Deployed Smart Contracts**
All contracts are **LIVE** on Midnight Network TestNet:

```javascript
// ZK Guild Gate - Privacy-preserving membership
Address: 02003adbb41861f75f18482c9bcf9d1ffee56bd9bc96ab725f9daafcf6dfc1828f5b

// DAO Token - Governance token management  
Address: 0200024e1490a95776ceb4c6d58539d6877e55ae692d761e135148fe6c8779741466

// DAO Treasury - Multi-signature treasury
Address: 0200ee41fb3523f2e08fc3fe314353a9902d6d47cf0525ec99c6790b4587df190578

// DAO Governance - Proposal and voting system
Address: 02003f8e2a8b2724669742c076fa2f8112f29bd6100c4753802afc3ee2fae5451817
```

**📁 Contract Files Included:**
- `src/contracts/dao-governance.compact` - Governance logic
- `src/contracts/dao-token-v2.compact` - Token management
- `src/contracts/dao-treasury.compact` - Treasury operations
- `src/contracts/deployed-contracts.js` - Contract registry with all addresses

## 🔧 **API Endpoints**

### **Matthew AI (Port 3001)**
```bash
# Chat with Matthew
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"treasury status"}'

# Multi-chain dashboard data
curl http://localhost:3001/dashboard/multichain

# Simulate TDUST deposit (creates XRPL wallet)
curl -X POST http://localhost:3001/deposit/tdust \
  -H "Content-Type: application/json" \
  -d '{"userId":"demo_user","txHash":"0xabcd1234","amount":500}'
```

### **Xara AI (Port 3002)**
```bash
# Create XRPL wallet
curl -X POST http://localhost:3002/xrpl/create_wallet \
  -H "Content-Type: application/json" \
  -d '{"label":"My-Wallet"}'

# List all XRPL wallets
curl http://localhost:3002/xrpl/wallets

# XRPL dashboard data
curl http://localhost:3002/dashboard/xrpl
```

## 🌟 **Key Innovations**

1. **First Multi-Chain DAO**: Seamlessly manages assets across Midnight and XRPL
2. **AI-Driven Treasury**: Two specialized AI agents for different chains
3. **Privacy + Transparency**: ZK proofs for privacy, public treasury for transparency
4. **Automatic Cross-Chain**: TDUST deposits automatically create XRPL wallets
5. **User-Centric UX**: Copy buttons, explorer links, and intuitive interface

## 🔐 **Security Features**

- Zero-knowledge proofs for private governance
- Encrypted AI agent communication
- Secure wallet management with AES-256-GCM
- Testnet-only operations for safe development
- No private key exposure in frontend

## 📈 **Current Status**

### **✅ Working Features**
- Multi-chain treasury dashboard
- TDUST → XRPL wallet creation
- AI agent coordination
- Real blockchain integration
- Modern responsive UI

### **🎯 Roadmap**
- Mainnet deployment
- Additional chain support (Ethereum, Polygon)
- Advanced AI trading strategies
- Mobile app development
- Governance token launch

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines and join our community.

## 📄 **License**

Apache 2.0 License - see LICENSE file for details.

---

**Built with ❤️ for the future of decentralized finance**
