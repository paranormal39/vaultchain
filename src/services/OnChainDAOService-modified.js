// Clean OnChainDAOService with working wallet integration
class OnChainDAOService {
  constructor() {
    this.contracts = {
      zkGuildGate: '02003adbb41861f75f18482c9bcf9d1ffee56bd9bc96ab725f9daafcf6dfc1828f5b',
      daoToken: '0200024e1490a95776ceb4c6d58539d6877e55ae692d761e135148fe6c8779741466',
      daoTreasury: '0200ee41fb3523f2e08fc3fe314353a9902d6d47cf0525ec99c6790b4587df190578',
      daoGovernance: '02003f8e2a8b2724669742c076fa2f8112f29bd6100c4753802afc3ee2fae5451817'
    };
  }

  // === WALLET FUNCTIONS ===
  async getWalletBalance() {
    try {
      console.log('🔄 Fetching wallet balance from working server...');
      
      // Use the working wallet server on port 3001
      const response = await fetch('http://localhost:3001/wallet/balance', { 
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
        error: 'Could not connect to wallet server. Make sure the wallet server is running on port 3001.',
        address: 'Not connected',
        network: 'Disconnected'
      };
    }
  }

  // === DAO FUNCTIONS ===
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
      
      const response = await fetch('http://localhost:3001/wallet/send', {
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

export default OnChainDAOService;
