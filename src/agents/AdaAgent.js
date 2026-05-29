/**
 * @file AdaAgent.js
 * @description ADA - Cardano Ecosystem AI Agent
 *
 * ADA is a specialized AI agent for the Cardano ecosystem, named after
 * Ada Lovelace and the ADA native token. She analyzes Cardano-native assets,
 * DeFi opportunities, and staking/delegation pools, and coordinates with the
 * rest of the VaultChain multi-agent system (Matthew / Midnight, Xara / XRPL).
 *
 * Key Capabilities:
 * - Cardano native-token & DeFi market analysis
 * - Wallet creation and balance queries (addr1...)
 * - Staking / delegation opportunity detection (epoch-based yields)
 * - Risk assessment and portfolio optimization
 * - Cross-chain opportunity coordination with Matthew & Xara
 *
 * Scaffold note: All network calls are simulated here so the frontend works
 * without API keys. Real Cardano reads are handled by the backend
 * @elizaos/plugin-cardano (Blockfrost-backed) in the eliza-agent layer.
 */

import { BehaviorSubject } from 'rxjs';
import { ADA as ADA_ENDPOINTS, NETWORKS } from '../config/endpoints.js';
import { cardanoService } from '../services/CardanoService.js';

const LOVELACE_PER_ADA = 1_000_000;

// ── Simulation helpers ────────────────────────────────────────────────────────
const simulateBalance = () =>
  Math.floor(Math.random() * 50_000) * LOVELACE_PER_ADA;

const simulateAddress = () =>
  'addr1' +
  Array.from({ length: 58 }, () =>
    '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]
  ).join('');

export class AdaAgent {
  constructor(config = {}) {
    this.name = 'ADA';
    this.specialty = 'Cardano Ecosystem Specialist';
    this.personality = {
      traits: ['methodical', 'research-driven', 'peer-reviewed', 'risk-aware'],
      communication:
        'precise and evidence-based with a focus on sustainable, long-term growth',
      expertise: [
        'cardano-defi',
        'native-tokens',
        'staking-delegation',
        'governance',
        'cross-chain-bridges',
      ],
    };

    this.config = {
      network:          config.network          || NETWORKS.CARDANO.network,
      blockfrostUrl:    config.blockfrostUrl    || NETWORKS.CARDANO.blockfrostUrl,
      blockfrostApiKey: config.blockfrostApiKey || undefined,

      maxPositionSize:   config.maxPositionSize   || 10_000,  // ADA
      riskTolerance:     config.riskTolerance     || 0.05,
      slippageTolerance: config.slippageTolerance || 0.01,

      minLiquidity:  config.minLiquidity  || 50_000,
      minVolume24h:  config.minVolume24h  || 100_000,
      maxMarketCap:  config.maxMarketCap  || 10_000_000,

      ...config,
    };

    this._agentState$ = new BehaviorSubject({
      isActive:       false,
      isAnalyzing:    false,
      walletBalance:  0,
      walletAddress:  null,
      activePositions: [],
      opportunities:  [],
      marketInsights: [],
      performance: {
        totalTrades:      0,
        successfulTrades: 0,
        totalReturn:      0,
        bestTrade:        null,
        avgHoldTime:      0,
      },
    });

    this.wallet = null;
    this.marketCache = new Map();
    this.lastUpdate = null;

    this.initialize();
  }

  // ── Observables ─────────────────────────────────────────────────────────────
  get agentState$()  { return this._agentState$.asObservable(); }
  get currentState() { return this._agentState$.value; }

  // ── Initialisation ───────────────────────────────────────────────────────────
  async initialize() {
    try {
      console.log('🔷 Initializing ADA — Cardano Ecosystem AI Agent...');
      await this.initializeWallet();
      await this.startMarketMonitoring();
      this._updateState({ isActive: true });
      console.log('✅ ADA Agent initialised and monitoring the Cardano ecosystem');
    } catch (error) {
      console.error('❌ ADA initialisation failed:', error);
    }
  }

  async initializeWallet() {
    try {
      const info = await cardanoService.getAddressInfo(this.config.walletAddress || null);
      const address    = info.address    || simulateAddress();
      const adaBalance = info.adaBalance ?? (simulateBalance() / LOVELACE_PER_ADA);

      this.wallet = { address };
      this._updateState({ walletBalance: adaBalance, walletAddress: address });

      console.log(`💰 ADA wallet ready: ${address} (source: ${info.source || 'demo'})`);
      console.log(`💰 Balance: ${adaBalance.toFixed(6)} ADA`);

      return { address, balance: adaBalance };
    } catch (error) {
      console.error('❌ ADA wallet init failed:', error);
      const address = simulateAddress();
      this.wallet = { address };
      this._updateState({ walletBalance: 0, walletAddress: address });
      return { address, balance: 0 };
    }
  }

  async createWallet() {
    try {
      console.log('🔑 Creating new Cardano wallet...');
      const address = simulateAddress();
      this.wallet = { address };
      this._updateState({ walletBalance: 0, walletAddress: address });
      console.log('✅ New Cardano wallet created:', address);
      return { address, balance: 0 };
    } catch (error) {
      console.error('❌ Wallet creation failed:', error);
      throw error;
    }
  }

  // ── Market monitoring ────────────────────────────────────────────────────────
  async startMarketMonitoring() {
    console.log('🔍 Starting Cardano market monitoring...');

    this.quickScanTimer = setInterval(() => this.performQuickScan(), 30_000);
    this.deepScanTimer  = setInterval(() => this.performDeepAnalysis(), 300_000);

    await this.performQuickScan();
  }

  async performQuickScan() {
    try {
      this._updateState({ isAnalyzing: true });
      console.log('⚡ ADA performing quick Cardano scan...');

      const trendingTokens     = await this.scanTrendingTokens();
      const defiOpportunities  = await this.detectDeFiOpportunities(trendingTokens);
      const stakingOpps        = await this.detectStakingOpportunities();
      const volumeSpikes       = await this.analyzeVolumeSpikes(trendingTokens);

      const opportunities = [...defiOpportunities, ...stakingOpps, ...volumeSpikes];
      const insights      = await this.generateMarketInsights(opportunities);

      this._updateState({
        isAnalyzing:    false,
        opportunities,
        marketInsights: insights,
        lastUpdate:     new Date(),
      });

      console.log(`✅ ADA scan complete: ${opportunities.length} opportunities found`);
      return { ecosystem: 'CARDANO', opportunities };
    } catch (error) {
      console.error('❌ ADA quick scan failed:', error);
      this._updateState({ isAnalyzing: false });
      return { ecosystem: 'CARDANO', opportunities: [] };
    }
  }

  async scanTrendingTokens() {
    const raw = await this.fetchCardanoTrendingTokens();
    return raw.filter(
      (t) =>
        t.chain === 'cardano' &&
        t.volume24h > this.config.minVolume24h &&
        t.liquidity > this.config.minLiquidity &&
        t.marketCap < this.config.maxMarketCap
    );
  }

  async detectDeFiOpportunities(tokens) {
    const opportunities = [];
    for (const token of tokens) {
      const analysis = await this.analyzeToken(token);
      if (analysis.score > 0.7) {
        opportunities.push({
          ecosystem: 'CARDANO',
          type: 'DEFI_OPPORTUNITY',
          agent: 'ADA',
          token,
          analysis,
          confidence: analysis.score,
          expectedReturn: analysis.expectedReturn,
          riskLevel: analysis.riskLevel,
          timeframe: analysis.timeframe,
          reasoning: analysis.reasoning,
          source: 'ADA_AGENT',
        });
      }
    }
    return opportunities;
  }

  async detectStakingOpportunities() {
    return [
      {
        ecosystem: 'CARDANO',
        type: 'STAKING_OPPORTUNITY',
        agent: 'ADA',
        token: { symbol: 'ADA', name: 'Cardano', price: 0.45 },
        confidence: 0.84,
        expectedReturn: '3–5% APY',
        riskLevel: 'LOW',
        timeframe: '5-day epochs',
        reasoning:
          'Stable delegation yield from a decentralised, low-fee stake pool with high uptime',
        source: 'ADA_AGENT',
      },
    ];
  }

  async analyzeVolumeSpikes(tokens) {
    return tokens
      .filter((t) => t.volume24h > (t.avgVolume || t.volume24h) * 3)
      .map((token) => ({
        ecosystem: 'CARDANO',
        type: 'VOLUME_SPIKE',
        agent: 'ADA',
        token,
        spikeRatio: token.volume24h / (token.avgVolume || token.volume24h),
        confidence: 0.75,
        reasoning: `${(token.volume24h / (token.avgVolume || token.volume24h)).toFixed(1)}× volume spike on ${token.symbol}`,
      }));
  }

  // ── Token analysis ───────────────────────────────────────────────────────────
  async analyzeToken(token) {
    try {
      const factors = {
        priceAction:         this.analyzePriceAction(token),
        volumeProfile:       this.analyzeVolumeProfile(token),
        liquidityHealth:     this.analyzeLiquidity(token),
        holderDistribution:  this.analyzeHolders(token),
        technicalIndicators: this.analyzeTechnicals(token),
      };
      const score = this.calculateCompositeScore(factors);
      return {
        score,
        expectedReturn: this.calculateExpectedReturn(score, factors),
        riskLevel:      this.calculateRiskLevel(factors),
        timeframe:      this.estimateTimeframe(factors),
        reasoning:      this.generateReasoning(factors),
        factors,
      };
    } catch (error) {
      console.error('❌ Cardano token analysis failed:', error);
      return { score: 0, riskLevel: 'HIGH' };
    }
  }

  // Alias used by EnhancedAIMarketAnalyzer for token analysis
  async analyzeMemeToken(token) { return this.analyzeToken(token); }

  // ── Multi-agent interface ────────────────────────────────────────────────────
  async analyzeOpportunity(opportunity) {
    const token    = opportunity.token || opportunity.asset || {};
    const analysis = await this.analyzeToken(token);
    return {
      cardanoCompatibility: analysis.score,
      stakingPotential:     analysis.score > 0.6,
      recommendation:
        analysis.score > 0.7 ? 'Cardano ecosystem opportunity detected' : 'Monitor',
      ...analysis,
    };
  }

  async scoreOpportunity(opportunity) {
    const token    = opportunity.token || opportunity.asset || {};
    const analysis = await this.analyzeToken(token);
    return analysis.score ?? Math.random() * 0.4 + 0.3;
  }

  // ── Scoring helpers ──────────────────────────────────────────────────────────
  analyzePriceAction(token) {
    let score = 0;
    if ((token.priceChange1h  || 0) > 0.05) score += 0.3;
    if ((token.priceChange24h || 0) > 0.20) score += 0.4;
    if ((token.priceChange7d  || 0) > 0.50) score += 0.3;
    return Math.min(score, 1.0);
  }

  analyzeVolumeProfile(token) {
    const ratio = (token.avgVolume || token.volume24h) > 0
      ? token.volume24h / (token.avgVolume || token.volume24h) : 1;
    if (ratio > 5)   return 1.0;
    if (ratio > 3)   return 0.8;
    if (ratio > 2)   return 0.6;
    if (ratio > 1.5) return 0.4;
    return 0.2;
  }

  analyzeLiquidity(token) {
    const liq = token.liquidity || 0;
    const min = this.config.minLiquidity;
    if (liq > min * 10) return 1.0;
    if (liq > min * 5)  return 0.8;
    if (liq > min * 2)  return 0.6;
    if (liq > min)      return 0.4;
    return 0.2;
  }

  analyzeHolders(token) {
    const h = token.holderCount       || Math.floor(Math.random() * 10_000);
    const t = token.topHolderPercent  || Math.random() * 0.5;
    let score = 0;
    if (h > 5000) score += 0.4; else if (h > 1000) score += 0.3; else if (h > 500) score += 0.2;
    if (t < 0.1)  score += 0.6; else if (t < 0.2)  score += 0.4; else if (t < 0.3) score += 0.2;
    return Math.min(score, 1.0);
  }

  analyzeTechnicals(token) {
    const rsi    = token.rsi        || Math.random() * 100;
    const signal = token.macdSignal || (Math.random() > 0.5 ? 'bullish' : 'bearish');
    let score = 0;
    if (rsi > 30 && rsi < 70) score += 0.5;
    if (signal === 'bullish')  score += 0.5;
    return score;
  }

  calculateCompositeScore(factors) {
    const weights = {
      priceAction:         0.25,
      volumeProfile:       0.20,
      liquidityHealth:     0.25,
      holderDistribution:  0.20,
      technicalIndicators: 0.10,
    };
    return Math.min(
      Object.entries(factors).reduce(
        (sum, [k, v]) => sum + v * (weights[k] || 0), 0
      ),
      1.0
    );
  }

  calculateExpectedReturn(score, factors) {
    const base = score * 2.0;
    const mult = (factors.volumeProfile || 0) * 1.5;
    return `${Math.round(base * 100)}–${Math.round(base * mult * 100)}%`;
  }

  calculateRiskLevel(factors) {
    const risk =
      (1 - (factors.liquidityHealth    || 0)) * 0.4 +
      (1 - (factors.holderDistribution || 0)) * 0.3 +
      (factors.volumeProfile           || 0)  * 0.3;
    if (risk > 0.7) return 'HIGH';
    if (risk > 0.4) return 'MEDIUM';
    return 'LOW';
  }

  estimateTimeframe(factors) {
    if ((factors.volumeProfile  || 0) > 0.8) return '1–6 hours';
    if ((factors.priceAction    || 0) > 0.7) return '6–24 hours';
    return '1–5 days';
  }

  generateReasoning(factors) {
    const reasons = [];
    if ((factors.priceAction        || 0) > 0.7) reasons.push('Strong price momentum');
    if ((factors.volumeProfile      || 0) > 0.8) reasons.push('Significant volume spike');
    if ((factors.liquidityHealth    || 0) > 0.8) reasons.push('Deep on-chain liquidity');
    if ((factors.holderDistribution || 0) > 0.7) reasons.push('Well-distributed holder base');
    return reasons.join(', ') || 'Multiple positive Cardano ecosystem signals';
  }

  // ── Data source: delegates to CardanoService (Blockfrost / demo) ─────────────
  async fetchCardanoTrendingTokens() {
    try {
      const result = await cardanoService.getTrendingTokens();
      return (result.tokens || []).map(t => ({
        address:          t.policy_id || t.unit,
        symbol:           t.ticker    || t.unit,
        name:             t.name,
        chain:            'cardano',
        price:            t.price_usd,
        priceChange1h:    0,
        priceChange24h:   (t.change_24h || 0) / 100,
        priceChange7d:    0,
        volume24h:        t.volume_24h || 0,
        liquidity:        t.volume_24h ? t.volume_24h * 0.5 : 100_000,
        marketCap:        (t.price_usd || 0) * 1_000_000_000,
        holderCount:      50_000,
        topHolderPercent: 0.15,
      }));
    } catch (err) {
      console.error('❌ fetchCardanoTrendingTokens failed:', err.message);
      return [];
    }
  }

  async generateMarketInsights(opportunities) {
    const insights = [];
    if (opportunities.length > 0) {
      insights.push({
        type:      'OPPORTUNITY_ALERT',
        message:   `🔷 ADA detected ${opportunities.length} Cardano ecosystem opportunities`,
        priority:  'HIGH',
        timestamp: new Date(),
      });
    }
    const staking = opportunities.filter((o) => o.type === 'STAKING_OPPORTUNITY');
    if (staking.length > 0) {
      insights.push({
        type:      'STAKING_YIELD',
        message:   `🏊 ${staking.length} staking/delegation opportunity available`,
        priority:  'MEDIUM',
        timestamp: new Date(),
      });
    }
    return insights;
  }

  async performDeepAnalysis() {
    console.log('🔬 ADA performing deep Cardano ecosystem analysis...');
  }

  // ── Wallet info — delegates to CardanoService for fresh data ─────────────────
  async getWalletInfo() {
    try {
      const info = await cardanoService.getAddressInfo(
        this.currentState.walletAddress || null
      );
      if (info.success) {
        this._updateState({ walletBalance: info.adaBalance, walletAddress: info.address });
        return {
          address:    info.address,
          adaBalance: info.adaBalance,
          tokens:     info.nativeTokens || [],
          network:    this.config.network,
          explorer:   NETWORKS.CARDANO.explorer,
          source:     info.source
        };
      }
    } catch (_) { /* fall through */ }
    return {
      address:    this.currentState.walletAddress || simulateAddress(),
      adaBalance: this.currentState.walletBalance,
      tokens:     [],
      network:    this.config.network,
      explorer:   NETWORKS.CARDANO.explorer,
      source:     'cache'
    };
  }

  // ── Status ───────────────────────────────────────────────────────────────────
  getStatus() {
    return {
      name:          this.name,
      specialty:     this.specialty,
      isActive:      this.currentState.isActive,
      walletAddress: this.currentState.walletAddress,
      performance:   this.currentState.performance,
      lastUpdate:    this.lastUpdate,
      network:       NETWORKS.CARDANO,
    };
  }

  stop() {
    if (this.quickScanTimer) clearInterval(this.quickScanTimer);
    if (this.deepScanTimer)  clearInterval(this.deepScanTimer);
    this._updateState({ isActive: false });
    console.log('⏹️ ADA Agent stopped');
  }

  _updateState(patch) {
    this._agentState$.next({ ...this._agentState$.value, ...patch });
  }
}

export default AdaAgent;
