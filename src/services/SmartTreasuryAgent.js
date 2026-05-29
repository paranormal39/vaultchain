/**
 * @file SmartTreasuryAgent.js
 * @description Intelligent Treasury Agent that learns and adapts
 * 
 * This combines the AI Market Analyzer with the AI Agent Trainer to create
 * a smart treasury management system that:
 * - Continuously scans markets for opportunities
 * - Learns from successful and failed predictions
 * - Adapts trading strategies based on performance
 * - Manages risk automatically
 * - Provides actionable investment recommendations
 */

import AIMarketAnalyzer from './AIMarketAnalyzer.js';
import AIAgentTrainer from './AIAgentTrainer.js';
import { BehaviorSubject } from 'rxjs';

export class SmartTreasuryAgent {
  constructor(config = {}) {
    this.config = {
      // Treasury management settings
      maxRiskPerTrade: config.maxRiskPerTrade || 0.05,  // 5% max risk
      targetReturn: config.targetReturn || 0.20,        // 20% target return
      stopLoss: config.stopLoss || 0.10,               // 10% stop loss
      
      // Learning settings
      learningEnabled: config.learningEnabled !== false,
      retrainInterval: config.retrainInterval || 24 * 60 * 60 * 1000, // 24 hours
      
      // Portfolio settings
      treasuryBalance: config.treasuryBalance || 1000,  // Starting balance
      maxPositions: config.maxPositions || 5,          // Max concurrent positions
      
      ...config
    };

    // Initialize components
    this.marketAnalyzer = new AIMarketAnalyzer({
      quickScanInterval: 30000,  // 30 seconds
      ecosystems: ['XRPL', 'CARDANO', 'MIDNIGHT', 'BASE']
    });

    this.aiTrainer = new AIAgentTrainer({
      learningRate: 0.01,
      maxTrainingEpochs: 500
    });

    // Agent state
    this._agentState$ = new BehaviorSubject({
      isActive: false,
      isLearning: false,
      portfolioValue: this.config.treasuryBalance,
      activePositions: [],
      totalReturn: 0,
      successRate: 0,
      recommendations: [],
      learningProgress: {
        memeDetection: 0,
        volumeAnalysis: 0,
        sentimentAnalysis: 0
      }
    });

    // Trading history for learning
    this.tradingHistory = [];
    this.predictions = new Map();
    
    // Performance tracking
    this.performance = {
      totalTrades: 0,
      successfulTrades: 0,
      totalReturn: 0,
      bestTrade: null,
      worstTrade: null
    };

    // Initialize the agent
    this.initialize();
  }

  /**
   * Observable agent state
   */
  get agentState$() {
    return this._agentState$.asObservable();
  }

  get currentState() {
    return this._agentState$.value;
  }

  // =====================
  // INITIALIZATION
  // =====================

  async initialize() {
    try {
      console.log('🤖 Initializing Smart Treasury Agent...');
      
      // Start market monitoring
      this.marketAnalyzer.startMarketMonitoring();
      
      // Subscribe to market opportunities
      this.marketAnalyzer.marketState$.subscribe(marketState => {
        this.processMarketOpportunities(marketState.opportunities);
      });

      // Train initial models if learning is enabled
      if (this.config.learningEnabled) {
        await this.performInitialTraining();
      }

      // Start the main agent loop
      this.startAgentLoop();
      
      this._updateState({ isActive: true });
      console.log('✅ Smart Treasury Agent initialized and active');

    } catch (error) {
      console.error('❌ Agent initialization failed:', error);
    }
  }

  /**
   * Perform initial AI model training
   */
  async performInitialTraining() {
    console.log('🧠 Starting initial AI training...');
    
    this._updateState({ isLearning: true });

    try {
      // Train meme detection model
      console.log('Training meme detection...');
      await this.aiTrainer.trainMemeDetectionModel();
      this._updateLearningProgress('memeDetection', 1.0);

      // Train volume analysis model
      console.log('Training volume analysis...');
      await this.aiTrainer.trainVolumeAnalysisModel();
      this._updateLearningProgress('volumeAnalysis', 1.0);

      // Train sentiment analysis model
      console.log('Training sentiment analysis...');
      await this.aiTrainer.trainSentimentModel();
      this._updateLearningProgress('sentimentAnalysis', 1.0);

      console.log('✅ Initial training completed');
      
    } catch (error) {
      console.error('❌ Training failed:', error);
    } finally {
      this._updateState({ isLearning: false });
    }
  }

  // =====================
  // MAIN AGENT LOOP
  // =====================

  startAgentLoop() {
    // Main decision loop - runs every minute
    this.agentTimer = setInterval(() => {
      this.executeAgentCycle();
    }, 60000); // 1 minute

    // Learning loop - retrains models periodically
    if (this.config.learningEnabled) {
      this.learningTimer = setInterval(() => {
        this.performPeriodicLearning();
      }, this.config.retrainInterval);
    }
  }

  /**
   * Main agent decision cycle
   */
  async executeAgentCycle() {
    try {
      // 1. Analyze current portfolio
      await this.analyzePortfolio();
      
      // 2. Check for exit conditions on existing positions
      await this.checkExitConditions();
      
      // 3. Look for new opportunities
      await this.evaluateNewOpportunities();
      
      // 4. Update performance metrics
      this.updatePerformanceMetrics();
      
      // 5. Generate recommendations
      const recommendations = await this.generateRecommendations();
      this._updateState({ recommendations });

    } catch (error) {
      console.error('❌ Agent cycle error:', error);
    }
  }

  // =====================
  // OPPORTUNITY PROCESSING
  // =====================

  /**
   * Process market opportunities from the analyzer
   */
  async processMarketOpportunities(opportunities) {
    if (!opportunities || opportunities.length === 0) return;

    console.log(`🔍 Processing ${opportunities.length} market opportunities...`);

    for (const opportunity of opportunities) {
      // Use AI to evaluate the opportunity
      const evaluation = await this.evaluateOpportunityWithAI(opportunity);
      
      // Make trading decision
      if (evaluation.shouldTrade) {
        await this.considerTrade(opportunity, evaluation);
      }
    }
  }

  /**
   * Use trained AI models to evaluate an opportunity
   */
  async evaluateOpportunityWithAI(opportunity) {
    try {
      let aiScore = 0;
      let confidence = 0;
      let reasoning = [];

      // Meme coin evaluation
      if (opportunity.type === 'MEME_COIN') {
        const memeEval = await this.aiTrainer.predictMemeOpportunity(opportunity.asset);
        aiScore += memeEval.probability * 0.4;
        confidence += memeEval.confidence * 0.4;
        reasoning.push(`Meme AI: ${(memeEval.probability * 100).toFixed(0)}% (${memeEval.reasoning})`);
      }

      // Volume spike evaluation
      if (opportunity.type === 'VOLUME_SPIKE') {
        const volumeEval = await this.aiTrainer.predictVolumeMovement(opportunity.asset);
        aiScore += volumeEval.sustainability * 0.3;
        confidence += 0.3;
        reasoning.push(`Volume AI: ${(volumeEval.sustainability * 100).toFixed(0)}% sustainability`);
      }

      // Risk assessment
      const riskScore = this.assessRisk(opportunity);
      const riskAdjustedScore = aiScore * (1 - riskScore);

      // Trading decision
      const shouldTrade = 
        riskAdjustedScore > 0.7 &&           // High AI confidence
        confidence > 0.6 &&                 // Good model confidence
        this.canAffordTrade(opportunity) &&  // Risk management
        this.hasCapacity();                  // Position limits

      return {
        shouldTrade,
        aiScore: riskAdjustedScore,
        confidence,
        reasoning: reasoning.join('; '),
        riskScore,
        expectedReturn: this.calculateExpectedReturn(opportunity, aiScore),
        recommendedPosition: this.calculatePositionSize(opportunity, riskScore)
      };

    } catch (error) {
      console.error('❌ AI evaluation failed:', error);
      return { shouldTrade: false, aiScore: 0, confidence: 0 };
    }
  }

  /**
   * Consider making a trade based on evaluation
   */
  async considerTrade(opportunity, evaluation) {
    console.log(`💰 Considering trade: ${opportunity.asset.symbol} (Score: ${(evaluation.aiScore * 100).toFixed(0)}%)`);

    // Create trade proposal
    const trade = {
      id: Date.now(),
      symbol: opportunity.asset.symbol,
      ecosystem: opportunity.ecosystem,
      type: 'BUY',
      amount: evaluation.recommendedPosition,
      expectedPrice: opportunity.asset.price,
      aiScore: evaluation.aiScore,
      confidence: evaluation.confidence,
      reasoning: evaluation.reasoning,
      stopLoss: opportunity.asset.price * (1 - this.config.stopLoss),
      targetPrice: opportunity.asset.price * (1 + this.config.targetReturn),
      timestamp: new Date(),
      status: 'PROPOSED'
    };

    // Store prediction for learning
    this.predictions.set(trade.id, {
      opportunity,
      evaluation,
      trade,
      timestamp: new Date()
    });

    // Execute trade (simulated)
    const executedTrade = await this.executeTrade(trade);
    
    if (executedTrade.success) {
      // Add to active positions
      const currentState = this.currentState;
      const newPositions = [...currentState.activePositions, executedTrade.trade];
      this._updateState({ activePositions: newPositions });
      
      console.log(`✅ Trade executed: ${trade.symbol} for ${trade.amount} DUST`);
    }
  }

  // =====================
  // PORTFOLIO MANAGEMENT
  // =====================

  /**
   * Analyze current portfolio performance
   */
  async analyzePortfolio() {
    const positions = this.currentState.activePositions;
    let totalValue = this.config.treasuryBalance;
    
    for (const position of positions) {
      // Simulate current price (in real implementation, fetch from market)
      const currentPrice = position.expectedPrice * (1 + (Math.random() - 0.5) * 0.2);
      const currentValue = position.amount * currentPrice / position.expectedPrice;
      totalValue += currentValue - position.amount;
      
      // Update position with current value
      position.currentPrice = currentPrice;
      position.currentValue = currentValue;
      position.unrealizedPnL = currentValue - position.amount;
    }
    
    const totalReturn = ((totalValue - this.config.treasuryBalance) / this.config.treasuryBalance) * 100;
    
    this._updateState({ 
      portfolioValue: totalValue,
      totalReturn: totalReturn
    });
  }

  /**
   * Check if any positions should be closed
   */
  async checkExitConditions() {
    const positions = this.currentState.activePositions;
    const updatedPositions = [];
    
    for (const position of positions) {
      let shouldExit = false;
      let exitReason = '';
      
      // Stop loss check
      if (position.currentPrice <= position.stopLoss) {
        shouldExit = true;
        exitReason = 'STOP_LOSS';
      }
      
      // Take profit check
      if (position.currentPrice >= position.targetPrice) {
        shouldExit = true;
        exitReason = 'TAKE_PROFIT';
      }
      
      // Time-based exit (hold for max 7 days)
      const holdTime = Date.now() - new Date(position.timestamp).getTime();
      if (holdTime > 7 * 24 * 60 * 60 * 1000) {
        shouldExit = true;
        exitReason = 'TIME_LIMIT';
      }
      
      if (shouldExit) {
        // Execute exit trade
        const exitTrade = await this.exitPosition(position, exitReason);
        
        // Learn from the outcome
        if (this.config.learningEnabled) {
          await this.learnFromTrade(position, exitTrade);
        }
        
        console.log(`📤 Exited position: ${position.symbol} (${exitReason}) - PnL: ${exitTrade.realizedPnL.toFixed(2)} DUST`);
      } else {
        updatedPositions.push(position);
      }
    }
    
    this._updateState({ activePositions: updatedPositions });
  }

  /**
   * Look for new trading opportunities
   */
  async evaluateNewOpportunities() {
    // This is handled by processMarketOpportunities
    // which is called when new opportunities are detected
  }

  // =====================
  // LEARNING SYSTEM
  // =====================

  /**
   * Learn from completed trades
   */
  async learnFromTrade(position, exitTrade) {
    try {
      // Get the original prediction
      const prediction = this.predictions.get(position.id);
      if (!prediction) return;

      // Calculate actual outcome
      const actualReturn = exitTrade.realizedPnL / position.amount;
      const wasSuccessful = actualReturn > 0;
      
      // Create learning data
      const outcome = {
        success: wasSuccessful,
        actualReturn,
        holdTime: exitTrade.holdTime,
        exitReason: exitTrade.exitReason
      };

      // Update AI models with the outcome
      await this.aiTrainer.learnFromOutcome(prediction, outcome);
      
      // Update performance tracking
      this.performance.totalTrades++;
      if (wasSuccessful) {
        this.performance.successfulTrades++;
      }
      this.performance.totalReturn += actualReturn;
      
      // Track best/worst trades
      if (!this.performance.bestTrade || actualReturn > this.performance.bestTrade.return) {
        this.performance.bestTrade = { ...position, return: actualReturn };
      }
      if (!this.performance.worstTrade || actualReturn < this.performance.worstTrade.return) {
        this.performance.worstTrade = { ...position, return: actualReturn };
      }
      
      // Update success rate
      const successRate = this.performance.successfulTrades / this.performance.totalTrades;
      this._updateState({ successRate });
      
      console.log(`📚 Learning from trade: ${position.symbol} - Success: ${wasSuccessful}, Return: ${(actualReturn * 100).toFixed(1)}%`);

    } catch (error) {
      console.error('❌ Learning from trade failed:', error);
    }
  }

  /**
   * Periodic retraining of AI models
   */
  async performPeriodicLearning() {
    if (this.tradingHistory.length < 10) return; // Need minimum data
    
    console.log('🔄 Performing periodic AI retraining...');
    
    this._updateState({ isLearning: true });
    
    try {
      // Retrain models with new data
      await this.aiTrainer.updateModelsWithNewData(this.tradingHistory);
      
      console.log('✅ Periodic retraining completed');
    } catch (error) {
      console.error('❌ Periodic retraining failed:', error);
    } finally {
      this._updateState({ isLearning: false });
    }
  }

  // =====================
  // RECOMMENDATION SYSTEM
  // =====================

  /**
   * Generate actionable recommendations
   */
  async generateRecommendations() {
    const recommendations = [];
    
    // Portfolio recommendations
    const portfolioValue = this.currentState.portfolioValue;
    const totalReturn = this.currentState.totalReturn;
    
    if (totalReturn > 10) {
      recommendations.push({
        type: 'PORTFOLIO',
        priority: 'INFO',
        message: `🎉 Portfolio performing well: +${totalReturn.toFixed(1)}% return`,
        action: 'Consider taking some profits'
      });
    } else if (totalReturn < -5) {
      recommendations.push({
        type: 'PORTFOLIO',
        priority: 'WARNING',
        message: `⚠️ Portfolio underperforming: ${totalReturn.toFixed(1)}% return`,
        action: 'Review risk management settings'
      });
    }
    
    // Position recommendations
    const positions = this.currentState.activePositions;
    for (const position of positions) {
      if (position.unrealizedPnL > position.amount * 0.15) {
        recommendations.push({
          type: 'POSITION',
          priority: 'SUCCESS',
          message: `💰 ${position.symbol} up ${((position.unrealizedPnL / position.amount) * 100).toFixed(1)}%`,
          action: 'Consider taking profits'
        });
      }
    }
    
    // Learning recommendations
    if (this.performance.totalTrades > 5) {
      const successRate = this.currentState.successRate;
      if (successRate < 0.4) {
        recommendations.push({
          type: 'LEARNING',
          priority: 'WARNING',
          message: `🤖 AI success rate: ${(successRate * 100).toFixed(0)}%`,
          action: 'AI models need more training data'
        });
      } else if (successRate > 0.7) {
        recommendations.push({
          type: 'LEARNING',
          priority: 'SUCCESS',
          message: `🧠 AI performing well: ${(successRate * 100).toFixed(0)}% success rate`,
          action: 'Consider increasing position sizes'
        });
      }
    }
    
    return recommendations;
  }

  // =====================
  // UTILITY METHODS
  // =====================

  assessRisk(opportunity) {
    let riskScore = 0;
    
    // Ecosystem risk
    if (opportunity.ecosystem === 'XRPL') riskScore += 0.1; // Lower risk
    else if (opportunity.ecosystem === 'ETHEREUM') riskScore += 0.2;
    else riskScore += 0.3; // Higher risk for newer chains
    
    // Asset type risk
    if (opportunity.type === 'MEME_COIN') riskScore += 0.4; // High risk
    else if (opportunity.type === 'VOLUME_SPIKE') riskScore += 0.2;
    else riskScore += 0.1;
    
    // Market cap risk
    if (opportunity.asset.marketCap < 100000) riskScore += 0.3;
    else if (opportunity.asset.marketCap < 1000000) riskScore += 0.1;
    
    return Math.min(riskScore, 1.0);
  }

  canAffordTrade(opportunity) {
    const maxRisk = this.config.treasuryBalance * this.config.maxRiskPerTrade;
    return maxRisk > 10; // Minimum trade size
  }

  hasCapacity() {
    return this.currentState.activePositions.length < this.config.maxPositions;
  }

  calculateExpectedReturn(opportunity, aiScore) {
    // Expected return based on AI confidence and opportunity type
    const baseReturn = opportunity.type === 'MEME_COIN' ? 0.5 : 0.2;
    return baseReturn * aiScore;
  }

  calculatePositionSize(opportunity, riskScore) {
    const maxRisk = this.config.treasuryBalance * this.config.maxRiskPerTrade;
    const riskAdjusted = maxRisk * (1 - riskScore);
    return Math.max(riskAdjusted, 10); // Minimum 10 DUST
  }

  async executeTrade(trade) {
    // Simulate trade execution
    return {
      success: true,
      trade: {
        ...trade,
        status: 'EXECUTED',
        executedAt: new Date()
      }
    };
  }

  async exitPosition(position, reason) {
    const holdTime = Date.now() - new Date(position.timestamp).getTime();
    const realizedPnL = position.unrealizedPnL;
    
    // Add to trading history
    this.tradingHistory.push({
      ...position,
      exitReason: reason,
      realizedPnL,
      holdTime,
      exitedAt: new Date()
    });
    
    return {
      success: true,
      realizedPnL,
      holdTime,
      exitReason: reason
    };
  }

  updatePerformanceMetrics() {
    // Performance metrics are updated in real-time
    // This method can be used for additional calculations
  }

  _updateState(newState) {
    const currentState = this._agentState$.value;
    this._agentState$.next({ ...currentState, ...newState });
  }

  _updateLearningProgress(model, progress) {
    const currentState = this.currentState;
    const updatedProgress = {
      ...currentState.learningProgress,
      [model]: progress
    };
    this._updateState({ learningProgress: updatedProgress });
  }

  // =====================
  // PUBLIC INTERFACE
  // =====================

  /**
   * Get current agent performance
   */
  getPerformance() {
    return {
      ...this.performance,
      currentState: this.currentState
    };
  }

  /**
   * Manually trigger learning update
   */
  async triggerLearning() {
    await this.performPeriodicLearning();
  }

  /**
   * Stop the agent
   */
  stop() {
    if (this.agentTimer) clearInterval(this.agentTimer);
    if (this.learningTimer) clearInterval(this.learningTimer);
    this.marketAnalyzer.stopMarketMonitoring();
    this._updateState({ isActive: false });
    console.log('⏹️ Smart Treasury Agent stopped');
  }
}

export default SmartTreasuryAgent;
