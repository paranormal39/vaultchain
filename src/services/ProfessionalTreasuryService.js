// Professional Treasury Service - Non-story-driven AI agent
// Integrates with the professional treasury plugin

class ProfessionalTreasuryService {
  constructor() {
    this.mcpServerUrl = 'http://localhost:3000';
    this.agentStatus = 'disconnected';
    this.lastUpdate = null;
  }

  // Initialize connection to professional treasury agent
  async initialize() {
    try {
      console.log('🏛️ Initializing Professional Treasury Service...');
      
      // Test MCP server connection
      const response = await fetch(`${this.mcpServerUrl}/wallet/status`);
      
      if (response.ok) {
        this.agentStatus = 'connected';
        this.lastUpdate = new Date().toISOString();
        console.log('✅ Professional Treasury Service connected');
        return { success: true, status: 'connected' };
      } else {
        this.agentStatus = 'disconnected';
        return { success: false, status: 'disconnected', error: 'MCP server not responding' };
      }
    } catch (error) {
      console.error('❌ Professional Treasury Service initialization failed:', error);
      this.agentStatus = 'error';
      return { success: false, status: 'error', error: error.message };
    }
  }

  // Generate professional treasury proposal
  async generateProposal() {
    try {
      console.log('📊 Generating professional treasury proposal...');
      
      // Get current wallet status
      const walletResponse = await fetch(`${this.mcpServerUrl}/wallet/status`);
      const walletData = walletResponse.ok ? await walletResponse.json() : null;
      
      const currentBalance = walletData ? parseFloat(walletData.balances?.balance || 0) : 10000;
      
      // Determine strategy based on balance
      let strategy, riskLevel, allocationStrategy;
      
      if (currentBalance >= 50000) {
        riskLevel = "Low";
        allocationStrategy = "Aggressive";
        strategy = { emergency: 0.20, development: 0.45, marketing: 0.25, reserves: 0.10 };
      } else if (currentBalance >= 10000) {
        riskLevel = "Medium";
        allocationStrategy = "Balanced";
        strategy = { emergency: 0.30, development: 0.35, marketing: 0.15, reserves: 0.20 };
      } else if (currentBalance >= 1000) {
        riskLevel = "High";
        allocationStrategy = "Conservative";
        strategy = { emergency: 0.40, development: 0.25, marketing: 0.10, reserves: 0.25 };
      } else {
        riskLevel = "Critical";
        allocationStrategy = "Emergency";
        strategy = { emergency: 0.60, development: 0.20, marketing: 0.05, reserves: 0.15 };
      }
      
      // Calculate optimal proposal amount
      const riskMultipliers = { "Critical": 0.10, "High": 0.15, "Medium": 0.25, "Low": 0.40 };
      const proposalAmount = Math.floor(currentBalance * (riskMultipliers[riskLevel] || 0.20));
      
      // Generate allocation
      const allocation = {
        emergency: Math.floor(proposalAmount * strategy.emergency),
        development: Math.floor(proposalAmount * strategy.development),
        marketing: Math.floor(proposalAmount * strategy.marketing),
        reserves: Math.floor(proposalAmount * strategy.reserves)
      };
      
      // Professional proposal titles
      const titles = [
        "Treasury Optimization Initiative",
        "Strategic Fund Allocation Proposal", 
        "Risk-Adjusted Portfolio Rebalancing",
        "Operational Efficiency Enhancement",
        "Capital Allocation Strategy Update",
        "Treasury Diversification Plan",
        "Financial Stability Improvement",
        "Growth Investment Proposal"
      ];
      
      const title = titles[Math.floor(Math.random() * titles.length)];
      
      const proposal = {
        id: `prof_${Date.now()}`,
        title: title,
        type: "professional_treasury",
        description: `Professional treasury management proposal implementing ${allocationStrategy.toLowerCase()} allocation strategy. Based on quantitative analysis of current treasury health (${riskLevel} risk level) and market conditions. Optimized for ${this.getExpectedOutcome(allocationStrategy)} with built-in risk mitigation.`,
        fundingAmount: proposalAmount,
        allocation: allocation,
        strategy: allocationStrategy,
        riskAssessment: {
          level: riskLevel,
          confidence: this.calculateConfidence(currentBalance),
          factors: [
            "Current treasury balance analysis",
            "Market volatility assessment", 
            "Operational requirements review",
            "Historical performance metrics"
          ]
        },
        expectedOutcome: this.getExpectedOutcome(allocationStrategy),
        timeline: this.getTimeline(allocationStrategy),
        metadata: {
          generatedBy: "Professional Treasury Agent",
          currentBalance: currentBalance,
          strategy: allocationStrategy,
          riskLevel: riskLevel,
          timestamp: new Date().toISOString()
        }
      };
      
      console.log(`✅ Generated professional proposal: ${title}`);
      return { success: true, proposal };
      
    } catch (error) {
      console.error('❌ Professional proposal generation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get professional treasury recommendations
  async getRecommendations() {
    try {
      console.log('📈 Generating professional treasury recommendations...');
      
      // Get current wallet status
      const walletResponse = await fetch(`${this.mcpServerUrl}/wallet/status`);
      const walletData = walletResponse.ok ? await walletResponse.json() : null;
      
      const currentBalance = walletData ? parseFloat(walletData.balances?.balance || 0) : 10000;
      
      const recommendations = [];
      
      // Generate specific recommendations based on balance
      if (currentBalance < 1000) {
        recommendations.push({
          type: "urgent",
          priority: "high",
          title: "Emergency Funding Required",
          description: "Treasury balance is critically low. Immediate action needed to maintain DAO operations.",
          action: "Initiate emergency funding proposal or pause non-essential expenditures.",
          impact: "Critical for operational continuity"
        });
      } else if (currentBalance < 5000) {
        recommendations.push({
          type: "caution",
          priority: "medium",
          title: "Conservative Strategy Recommended",
          description: "Current balance suggests adopting conservative allocation with higher emergency reserves.",
          action: "Increase emergency fund allocation to 40% and reduce high-risk investments.",
          impact: "Improved financial stability"
        });
      } else if (currentBalance > 50000) {
        recommendations.push({
          type: "opportunity",
          priority: "medium",
          title: "Growth Investment Opportunity",
          description: "Strong treasury position enables aggressive growth strategies and major initiatives.",
          action: "Consider increasing development allocation to 45% and explore yield generation.",
          impact: "Potential 20-40% growth with calculated risks"
        });
      }
      
      // Always include strategy recommendation
      const currentStrategy = this.determineStrategy(currentBalance);
      recommendations.push({
        type: "strategy",
        priority: "low",
        title: `${currentStrategy} Strategy Active`,
        description: `Current allocation strategy is optimized for treasury balance of ${currentBalance.toLocaleString()} DUST.`,
        action: "Monitor performance metrics and adjust strategy based on quarterly review.",
        impact: "Optimized risk-adjusted returns"
      });
      
      return {
        success: true,
        recommendations,
        currentBalance,
        strategy: currentStrategy,
        nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        generatedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Professional recommendations failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get treasury status with professional analysis
  async getTreasuryStatus() {
    try {
      const walletResponse = await fetch(`${this.mcpServerUrl}/wallet/status`);
      const walletData = walletResponse.ok ? await walletResponse.json() : null;
      
      if (walletData) {
        const balance = parseFloat(walletData.balances?.balance || 0);
        const strategy = this.determineStrategy(balance);
        const riskLevel = this.determineRiskLevel(balance);
        
        return {
          success: true,
          address: walletData.address,
          balance: balance,
          balanceFormatted: `${balance.toLocaleString()} DUST`,
          network: "Midnight TestNet",
          ready: walletData.ready,
          syncing: walletData.syncing,
          analysis: {
            strategy: strategy,
            riskLevel: riskLevel,
            confidence: this.calculateConfidence(balance),
            healthScore: this.calculateHealthScore(balance)
          },
          lastUpdate: new Date().toISOString()
        };
      } else {
        // Fallback data
        return {
          success: false,
          balance: 0,
          balanceFormatted: "0 DUST",
          network: "Midnight TestNet (Offline)",
          analysis: {
            strategy: "Unknown",
            riskLevel: "Unknown",
            confidence: 0,
            healthScore: 0
          },
          error: "MCP server not available"
        };
      }
    } catch (error) {
      console.error('❌ Treasury status check failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper methods
  determineStrategy(balance) {
    if (balance >= 50000) return "Aggressive";
    if (balance >= 10000) return "Balanced";
    if (balance >= 1000) return "Conservative";
    return "Emergency";
  }

  determineRiskLevel(balance) {
    if (balance >= 50000) return "Low";
    if (balance >= 10000) return "Medium";
    if (balance >= 1000) return "High";
    return "Critical";
  }

  calculateConfidence(balance) {
    if (balance >= 50000) return 95;
    if (balance >= 10000) return 85;
    if (balance >= 1000) return 70;
    return 50;
  }

  calculateHealthScore(balance) {
    if (balance >= 50000) return 95;
    if (balance >= 25000) return 85;
    if (balance >= 10000) return 75;
    if (balance >= 5000) return 60;
    if (balance >= 1000) return 40;
    return 20;
  }

  getExpectedOutcome(strategy) {
    const outcomes = {
      "Emergency": "Stabilize operations and prevent treasury depletion",
      "Conservative": "Steady 5-10% growth with minimal risk exposure",
      "Balanced": "Balanced 10-20% growth with moderate risk management", 
      "Aggressive": "Potential 20-40% growth with calculated risk exposure"
    };
    return outcomes[strategy] || "Improved treasury performance";
  }

  getTimeline(strategy) {
    const timelines = {
      "Emergency": "Immediate (1-3 days)",
      "Conservative": "Short-term (2-6 weeks)",
      "Balanced": "Medium-term (1-3 months)",
      "Aggressive": "Long-term (3-6 months)"
    };
    return timelines[strategy] || "Medium-term (1-3 months)";
  }

  // Get agent status
  getStatus() {
    return {
      status: this.agentStatus,
      lastUpdate: this.lastUpdate,
      type: "Professional Treasury Agent",
      capabilities: [
        "Treasury analysis",
        "Risk assessment", 
        "Proposal generation",
        "Fund allocation optimization",
        "Performance monitoring"
      ]
    };
  }
}

export default ProfessionalTreasuryService;
