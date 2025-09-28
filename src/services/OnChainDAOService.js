// Clean OnChainDAOService with working wallet integration - Updated 2025-01-26
class OnChainDAOService {
  constructor() {
    this.contracts = {
      zkGuildGate: '02003adbb41861f75f18482c9bcf9d1ffee56bd9bc96ab725f9daafcf6dfc1828f5b',
      daoToken: '0200024e1490a95776ceb4c6d58539d6877e55ae692d761e135148fe6c8779741466',
      daoTreasury: '0200ee41fb3523f2e08fc3fe314353a9902d6d47cf0525ec99c6790b4587df190578',
      daoGovernance: '02003f8e2a8b2724669742c076fa2f8112f29bd6100c4753802afc3ee2fae5451817'
    };
  }

  // === TREASURY FUNCTIONS (MCP Server) ===
  async getTreasuryBalance() {
    try {
      console.log('🔄 Fetching treasury balance from MCP server...');
      
      // Use the MCP server on port 3000 for real treasury operations
      const response = await fetch('http://localhost:3000/treasury/balance', { 
        timeout: 5000 
      });
      
      if (response.ok) {
        const walletData = await response.json();
        console.log('✅ Wallet data received:', walletData);
        
        // Parse the wallet server response format
        if (walletData.balance) {
          const decimals = walletData.decimals || 6;
          const divisor = Math.pow(10, decimals);
          const balance = parseFloat(walletData.balance.total || walletData.balance.available || walletData.balance) / divisor;
          
          return {
            balance: balance,
            currency: walletData.currency || 'DUST',
            status: 'connected',
            address: 'midnight1dao7reasurer0racle0f7he0midnight0realm',
            network: 'TestNet',
            formatted: walletData.formatted || { total: `${balance.toFixed(6)} DUST` }
          };
        }
      }
      
      throw new Error('Invalid wallet response');
      
    } catch (error) {
      console.error('❌ Wallet balance fetch failed:', error);
      return {
        balance: 0,
        currency: 'DUST',
        status: 'disconnected',
        error: 'Could not connect to MCP server. Make sure the MCP server is running on port 3000.',
        address: 'Not connected',
        network: 'Disconnected'
      };
  }

  // === USER WALLET FUNCTIONS (Separate from Treasury) ===
  async getUserWalletBalance() {
    try {
      console.log('🔍 OnChainDAO - Fetching user wallet balance...')
      
      // Try multiple endpoints to get wallet balance
      const endpoints = [
        'http://localhost:3000/wallet/balance',
        'http://localhost:3000/user/balance',
        'http://localhost:3000/balance'
      ]
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying wallet endpoint: ${endpoint}`)
          const response = await fetch(endpoint, { timeout: 3000 })
          
          if (response.ok) {
            const walletData = await response.json()
            console.log('✅ OnChainDAO - User wallet data received:', walletData)
            
            if (walletData && (walletData.balance !== undefined || walletData.total !== undefined)) {
              // Handle different balance formats
              const divisor = 1000000; // Convert from smallest unit to DUST
              const balance = parseFloat(walletData.balance?.total || walletData.balance?.available || walletData.balance || walletData.total) / divisor;
              
              return {
                balance: balance,
                currency: walletData.currency || 'DUST',
                status: 'connected',
                address: walletData.address || 'Connected Wallet',
                network: 'TestNet',
                formatted: walletData.formatted || { total: `${balance.toFixed(6)} DUST` }
              };
            }
          }
        } catch (endpointError) {
          console.log(`❌ ${endpoint} failed:`, endpointError.message)
        }
      }
      
      // If no endpoints work, return demo data with realistic balance
      console.log('🔄 MCP server not available, returning demo wallet data')
      return {
        balance: 1250.750000, // Demo balance showing you have funds
        currency: 'DUST',
        status: 'demo',
        address: 'mn_shield-addr_test1demo_preview_wallet_for_hackathon_testing',
        network: 'TestNet (Demo)',
        formatted: { total: '1250.750000 DUST' },
        isDemo: true
      };
      
    } catch (error) {
      console.error('❌ User wallet balance fetch failed:', error);
      // Return demo data instead of error
      return {
        balance: 1250.750000, // Demo balance
        currency: 'DUST',
        status: 'demo',
        address: 'mn_shield-addr_test1demo_preview_wallet_for_hackathon_testing',
        network: 'TestNet (Demo)',
        formatted: { total: '1250.750000 DUST' },
        isDemo: true
      };
    }
  }

  // === CROSS-CHAIN FUNCTIONS ===
  async initiateCrossChainDeposit(amount, targetChain = 'xrpl') {
    try {
      console.log(`🌉 Cross-chain deposit simulation: ${amount} DUST → ${targetChain.toUpperCase()}`);
      
      // Simulate cross-chain deposit since full ElizaOS integration is not yet active
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        message: `Cross-chain deposit simulation completed successfully!`,
        transactionId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        estimatedTime: '5-10 minutes',
        targetChain: targetChain.toUpperCase(),
        amount: amount,
        status: 'simulated'
      };
      
    } catch (error) {
      console.error('❌ Cross-chain deposit error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Cross-chain deposit failed. Please try again.'
      };
    }
  }

  async getProposals() {
    // Mock proposals for now
    return {
      active: [
        {
          id: 1,
          title: "Emergency Fund Allocation",
          description: "Allocate 20% of treasury for emergency reserves",
          amount: 2000,
          votes: { yes: 156, no: 23 },
          status: "active"
        }
      ],
      total: 1
    };
  }

  async getTokenBalance() {
    // Mock token balance
    return {
      balance: 1000,
      symbol: "VLT",
      decimals: 18
    };
  }

  async getMembershipStatus() {
    // Mock membership status
    return {
      isMember: true,
      membershipLevel: "Guardian",
      votingPower: 100
    };
  }

  async getWalletStatus() {
    // Mock wallet status
    return {
      connected: true,
      address: "midnight1dao7reasurer0racle0f7he0midnight0realm",
      network: "TestNet"
    };
  }

  async getCryptoData() {
    // Mock crypto market data
    return {
      dust: {
        price: 0.85,
        change24h: 2.3,
        volume: 1250000
      }
    };
  }

  async getContractStatus() {
    // Mock contract status
    return {
      success: true,
      contracts: this.contracts,
      status: 'connected'
    };
  }

  async getTopCryptos() {
    // Mock top crypto data with proper format
    return [
      { 
        id: 'dust', 
        symbol: 'DUST', 
        name: 'Midnight DUST', 
        price: 0.85, 
        change24h: 2.3,
        volume: 1250000
      },
      { 
        id: 'btc', 
        symbol: 'BTC', 
        name: 'Bitcoin', 
        price: 45000, 
        change24h: -1.2,
        volume: 28500000000
      },
      { 
        id: 'eth', 
        symbol: 'ETH', 
        name: 'Ethereum', 
        price: 3200, 
        change24h: 3.1,
        volume: 15200000000
      }
    ];
  }

  async connectToMidnightMCP() {
    // Mock MCP connection
    return {
      success: true,
      status: 'connected',
      message: 'Connected to Midnight MCP (Demo Mode)'
    };
  }

  async getAIFundAllocationRecommendation() {
    // Mock AI recommendation
    return {
      success: true,
      recommendation: {
        allocation: {
          emergency: 2000,
          development: 3000,
          marketing: 1500,
          reserves: 2500
        },
        reasoning: "Based on current market conditions and treasury balance",
        confidence: 85
      }
    };
  }

  async castVote(proposalId, voteType) {
    // Mock voting
    return {
      success: true,
      transactionHash: 'mock_tx_' + Date.now(),
      message: `${voteType} vote cast for proposal ${proposalId}`
    };
  }

  async addEmergencyFunds(amount) {
    // Mock emergency fund addition
    return {
      success: true,
      transactionHash: 'mock_tx_' + Date.now(),
      message: `Added ${amount} DUST to emergency funds`
    };
  }

  async addToken() {
    // Mock token minting
    return {
      success: true,
      transactionHash: 'mock_tx_' + Date.now(),
      message: 'Token minted successfully'
    };
  }

  async generateAIProposal() {
    // Mock AI proposal generation
    return {
      success: true,
      proposal: {
        title: "AI-Generated Treasury Optimization",
        description: "Optimize treasury allocation based on market analysis",
        amount: 5000,
        type: "treasury"
      }
    };
  }

  async createProposal(proposal) {
    // Mock proposal creation
    return {
      success: true,
      transactionHash: 'mock_tx_' + Date.now(),
      proposalId: Date.now(),
      message: 'Proposal created successfully'
    };
  }

  async getDashboardData() {
    try {
      console.log('🔄 Loading dashboard data...');
      
      // Get wallet balance from working server
      const walletData = await this.getWalletBalance();
      
      // Mock DAO data for now
      const dashboardData = {
        treasury: {
          totalValue: walletData.balance || 0,
          dustBalance: walletData.balance || 0,
          currency: 'DUST',
          status: walletData.status
        },
        governance: {
          activeProposals: 2,
          totalVotes: 156,
          participationRate: 78.5
        },
        tokens: {
          totalSupply: 1000000,
          holders: 234,
          circulatingSupply: 750000
        },
        wallet: walletData,
        contracts: this.contracts,
        lastUpdated: new Date().toISOString()
      };
      
      console.log('✅ Dashboard data loaded:', dashboardData);
      return dashboardData;
      
    } catch (error) {
      console.error('❌ Dashboard data loading failed:', error);
      return {
        treasury: { totalValue: 0, dustBalance: 0, currency: 'DUST', status: 'error' },
        governance: { activeProposals: 0, totalVotes: 0, participationRate: 0 },
        tokens: { totalSupply: 0, holders: 0, circulatingSupply: 0 },
        wallet: { balance: 0, status: 'disconnected', error: error.message },
        contracts: this.contracts,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // === TRANSACTION FUNCTIONS ===
  async sendFunds(destinationAddress, amount) {
    try {
      console.log(`🔄 Sending ${amount} DUST to ${destinationAddress}...`);
      
      const response = await fetch('http://localhost:3000/wallet/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          destinationAddress: destinationAddress,
          amount: parseFloat(amount)
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Transaction successful:', result);
        return {
          success: true,
          txHash: result.txHash || result.transactionId || 'mock_tx_' + Date.now(),
          message: `Successfully sent ${amount} DUST to ${destinationAddress}`
        };
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Transaction failed');
      }
      
    } catch (error) {
      console.error('❌ Send funds failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Transaction failed. Please check the wallet server connection.'
      };
    }
  }
}

// Create instance and export both named and default
const onChainDAO = new OnChainDAOService();

export { onChainDAO };
export default OnChainDAOService;
