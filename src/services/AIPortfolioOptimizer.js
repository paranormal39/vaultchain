/**
 * @file AIPortfolioOptimizer.js
 * @description AI Portfolio Optimization Service adapted from Midnight Kitties genetic algorithms
 * 
 * This transforms the genetic breeding patterns from Midnight Kitties into sophisticated
 * AI-powered portfolio optimization for treasury management.
 * 
 * Key Adaptations:
 * - Kitty DNA → Portfolio Allocation DNA
 * - Breeding genetics → Portfolio optimization algorithms
 * - Genetic traits → Risk/return characteristics
 * - Breeding generations → Optimization iterations
 * - Marketplace patterns → Asset allocation strategies
 */

import { BehaviorSubject } from 'rxjs';

// =====================
// PORTFOLIO DNA STRUCTURE (Adapted from Kitty genetics)
// =====================

/**
 * Portfolio Allocation DNA - Adapted from Kitty DNA structure
 * Represents the genetic makeup of a portfolio allocation strategy
 */
export class AllocationDNA {
  constructor(params = {}) {
    // Core allocation percentages (must sum to 100)
    this.reserves = params.reserves || 40;      // Conservative holdings
    this.development = params.development || 30; // Growth investments
    this.incentives = params.incentives || 20;   // Community rewards
    this.community = params.community || 10;     // Public goods

    // Genetic traits (adapted from Kitty traits)
    this.riskTolerance = params.riskTolerance || 0.5;  // 0-1 scale
    this.timeHorizon = params.timeHorizon || 0.7;      // 0-1 scale (short to long)
    this.diversification = params.diversification || 0.6; // Portfolio spread
    this.volatilityTarget = params.volatilityTarget || 0.4; // Acceptable volatility

    // Performance genetics
    this.historicalReturn = params.historicalReturn || 0.0;
    this.sharpeRatio = params.sharpeRatio || 0.0;
    this.maxDrawdown = params.maxDrawdown || 0.0;
    
    // Generation tracking (like Kitty generations)
    this.generation = params.generation || 0;
    this.parentDNA1 = params.parentDNA1 || null;
    this.parentDNA2 = params.parentDNA2 || null;
    
    // Unique identifier (like Kitty ID)
    this.dnaHash = this._generateDNAHash();
    this.fitness = this._calculateFitness();
  }

  /**
   * Generate unique DNA hash (adapted from Kitty DNA hashing)
   */
  _generateDNAHash() {
    const components = [
      this.reserves,
      this.development,
      this.incentives,
      this.community,
      this.riskTolerance,
      this.timeHorizon
    ];
    
    return components.reduce((hash, component) => {
      return ((hash << 5) - hash + component * 1000) & 0xffffffff;
    }, 0);
  }

  /**
   * Calculate fitness score (adapted from Kitty breeding fitness)
   */
  _calculateFitness() {
    // Multi-factor fitness calculation
    const allocationBalance = this._calculateAllocationBalance();
    const riskAdjustedReturn = this._calculateRiskAdjustedReturn();
    const diversificationScore = this._calculateDiversificationScore();
    
    return (allocationBalance * 0.3 + riskAdjustedReturn * 0.4 + diversificationScore * 0.3);
  }

  _calculateAllocationBalance() {
    const total = this.reserves + this.development + this.incentives + this.community;
    const deviation = Math.abs(total - 100);
    return Math.max(0, 1 - deviation / 100);
  }

  _calculateRiskAdjustedReturn() {
    if (this.volatilityTarget === 0) return 0;
    return Math.max(0, this.historicalReturn / this.volatilityTarget);
  }

  _calculateDiversificationScore() {
    const allocations = [this.reserves, this.development, this.incentives, this.community];
    const variance = this._calculateVariance(allocations);
    return Math.max(0, 1 - variance / 1000); // Normalize variance
  }

  _calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  /**
   * Validate allocation (ensure it sums to 100%)
   */
  normalize() {
    const total = this.reserves + this.development + this.incentives + this.community;
    if (total !== 100) {
      const factor = 100 / total;
      this.reserves *= factor;
      this.development *= factor;
      this.incentives *= factor;
      this.community *= factor;
    }
    
    // Recalculate fitness after normalization
    this.fitness = this._calculateFitness();
    return this;
  }

  /**
   * Clone DNA for breeding
   */
  clone() {
    return new AllocationDNA({
      reserves: this.reserves,
      development: this.development,
      incentives: this.incentives,
      community: this.community,
      riskTolerance: this.riskTolerance,
      timeHorizon: this.timeHorizon,
      diversification: this.diversification,
      volatilityTarget: this.volatilityTarget,
      generation: this.generation
    });
  }
}

// =====================
// AI PORTFOLIO OPTIMIZER (Adapted from Kitties breeding system)
// =====================

export class AIPortfolioOptimizer {
  constructor(config = {}) {
    this.config = {
      populationSize: config.populationSize || 20,
      maxGenerations: config.maxGenerations || 10,
      mutationRate: config.mutationRate || 0.1,
      crossoverRate: config.crossoverRate || 0.8,
      elitismRate: config.elitismRate || 0.2,
      convergenceThreshold: config.convergenceThreshold || 0.001,
      ...config
    };

    // Population tracking (like Kitty registry)
    this.population = [];
    this.generation = 0;
    this.bestAllocation = null;
    this.optimizationHistory = [];
    
    // Real-time state management
    this._state$ = new BehaviorSubject({
      isOptimizing: false,
      generation: 0,
      bestFitness: 0,
      population: [],
      convergenceStatus: 'not_started'
    });
  }

  /**
   * Observable state for real-time optimization tracking
   */
  get state$() {
    return this._state$.asObservable();
  }

  get currentState() {
    return this._state$.value;
  }

  /**
   * Main optimization method - Adapted from Kitties breeding cycles
   */
  async optimizePortfolio(params = {}) {
    try {
      console.log('🧬 Starting AI portfolio optimization...');
      
      const {
        currentAllocation,
        marketConditions = {},
        riskProfile = 'MODERATE',
        timeHorizon = '1_YEAR',
        constraints = {}
      } = params;

      this._updateState({ isOptimizing: true, convergenceStatus: 'initializing' });

      // Initialize population (like creating initial Kitty population)
      await this._initializePopulation(currentAllocation, constraints);
      
      // Evolution loop (adapted from breeding generations)
      for (let gen = 0; gen < this.config.maxGenerations; gen++) {
        this.generation = gen;
        
        console.log(`🔄 Generation ${gen + 1}/${this.config.maxGenerations}`);
        
        // Evaluate fitness (like Kitty trait evaluation)
        await this._evaluatePopulation(marketConditions, riskProfile);
        
        // Check convergence
        if (await this._checkConvergence()) {
          console.log('✅ Optimization converged early at generation', gen + 1);
          break;
        }
        
        // Create next generation (breeding process)
        await this._evolvePopulation();
        
        // Update state
        this._updateOptimizationState(gen);
        
        // Allow UI updates
        await this._delay(100);
      }

      // Finalize optimization
      const result = await this._finalizeOptimization(params);
      
      console.log('✅ Portfolio optimization completed');
      return result;

    } catch (error) {
      console.error('❌ Portfolio optimization failed:', error);
      this._updateState({ isOptimizing: false, convergenceStatus: 'error' });
      return { success: false, error: error.message };
    }
  }

  /**
   * Breed two allocation strategies - Core genetic algorithm
   * Adapted from Midnight Kitties breedKitty function
   */
  async breedAllocations(parent1DNA, parent2DNA, marketSeed = null) {
    try {
      console.log('🧬 Breeding allocation strategies...');
      
      // Generate market-influenced seed (like Kitty breeding seed)
      const seed = marketSeed || this._generateMarketSeed();
      
      // Crossover genetics (adapted from Kitty DNA combination)
      const offspring = await this._performCrossover(parent1DNA, parent2DNA, seed);
      
      // Apply mutations (market adaptation)
      const mutatedOffspring = await this._applyMutations(offspring, seed);
      
      // Validate and normalize
      const finalOffspring = mutatedOffspring.normalize();
      
      // Set generation info
      finalOffspring.generation = Math.max(parent1DNA.generation, parent2DNA.generation) + 1;
      finalOffspring.parentDNA1 = parent1DNA.dnaHash;
      finalOffspring.parentDNA2 = parent2DNA.dnaHash;
      
      return {
        success: true,
        offspring: finalOffspring,
        breedingInfo: {
          parent1Fitness: parent1DNA.fitness,
          parent2Fitness: parent2DNA.fitness,
          offspringFitness: finalOffspring.fitness,
          generation: finalOffspring.generation
        }
      };

    } catch (error) {
      console.error('❌ Allocation breeding failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize population with diverse allocation strategies
   */
  async _initializePopulation(baseAllocation, constraints) {
    this.population = [];
    
    // Add base allocation if provided
    if (baseAllocation) {
      this.population.push(new AllocationDNA(baseAllocation));
    }
    
    // Generate diverse population
    for (let i = this.population.length; i < this.config.populationSize; i++) {
      const randomAllocation = this._generateRandomAllocation(constraints);
      this.population.push(new AllocationDNA(randomAllocation));
    }
    
    console.log(`📊 Initialized population of ${this.population.length} allocations`);
  }

  /**
   * Evaluate population fitness based on market conditions
   */
  async _evaluatePopulation(marketConditions, riskProfile) {
    for (const allocation of this.population) {
      // Simulate market performance
      const performance = await this._simulatePerformance(allocation, marketConditions);
      
      // Update allocation with performance data
      allocation.historicalReturn = performance.return;
      allocation.sharpeRatio = performance.sharpe;
      allocation.maxDrawdown = performance.drawdown;
      
      // Recalculate fitness
      allocation.fitness = allocation._calculateFitness();
    }
    
    // Sort by fitness (best first)
    this.population.sort((a, b) => b.fitness - a.fitness);
    this.bestAllocation = this.population[0];
  }

  /**
   * Evolve population through selection, crossover, and mutation
   */
  async _evolvePopulation() {
    const newPopulation = [];
    const eliteCount = Math.floor(this.population.length * this.config.elitismRate);
    
    // Keep elite allocations (elitism)
    for (let i = 0; i < eliteCount; i++) {
      newPopulation.push(this.population[i].clone());
    }
    
    // Generate offspring through breeding
    while (newPopulation.length < this.config.populationSize) {
      // Tournament selection
      const parent1 = this._tournamentSelection();
      const parent2 = this._tournamentSelection();
      
      // Breed if crossover rate allows
      if (Math.random() < this.config.crossoverRate) {
        const breedingResult = await this.breedAllocations(parent1, parent2);
        if (breedingResult.success) {
          newPopulation.push(breedingResult.offspring);
        } else {
          newPopulation.push(parent1.clone());
        }
      } else {
        newPopulation.push(parent1.clone());
      }
    }
    
    this.population = newPopulation;
  }

  /**
   * Perform genetic crossover - Adapted from Kitty DNA combination
   */
  async _performCrossover(parent1, parent2, seed) {
    // Blend crossover for allocation percentages
    const alpha = 0.5 + (seed % 100) / 200; // 0.5 to 1.0 based on seed
    
    const offspring = new AllocationDNA({
      reserves: this._blendGenes(parent1.reserves, parent2.reserves, alpha),
      development: this._blendGenes(parent1.development, parent2.development, alpha),
      incentives: this._blendGenes(parent1.incentives, parent2.incentives, alpha),
      community: this._blendGenes(parent1.community, parent2.community, alpha),
      
      // Trait crossover
      riskTolerance: this._blendGenes(parent1.riskTolerance, parent2.riskTolerance, alpha),
      timeHorizon: this._blendGenes(parent1.timeHorizon, parent2.timeHorizon, alpha),
      diversification: this._blendGenes(parent1.diversification, parent2.diversification, alpha),
      volatilityTarget: this._blendGenes(parent1.volatilityTarget, parent2.volatilityTarget, alpha)
    });
    
    return offspring;
  }

  /**
   * Apply mutations for market adaptation
   */
  async _applyMutations(allocation, seed) {
    const mutated = allocation.clone();
    
    // Mutate allocation percentages
    if (Math.random() < this.config.mutationRate) {
      mutated.reserves += this._gaussianRandom() * 5;
      mutated.development += this._gaussianRandom() * 5;
      mutated.incentives += this._gaussianRandom() * 5;
      mutated.community += this._gaussianRandom() * 5;
    }
    
    // Mutate traits
    if (Math.random() < this.config.mutationRate) {
      mutated.riskTolerance = Math.max(0, Math.min(1, mutated.riskTolerance + this._gaussianRandom() * 0.1));
      mutated.timeHorizon = Math.max(0, Math.min(1, mutated.timeHorizon + this._gaussianRandom() * 0.1));
    }
    
    return mutated;
  }

  /**
   * Tournament selection for parent selection
   */
  _tournamentSelection(tournamentSize = 3) {
    const tournament = [];
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * this.population.length);
      tournament.push(this.population[randomIndex]);
    }
    
    // Return best from tournament
    tournament.sort((a, b) => b.fitness - a.fitness);
    return tournament[0];
  }

  /**
   * Simulate allocation performance
   */
  async _simulatePerformance(allocation, marketConditions) {
    // Simplified performance simulation
    const baseReturn = 0.08; // 8% base return
    const riskAdjustment = allocation.riskTolerance * 0.05;
    const diversificationBonus = allocation.diversification * 0.02;
    
    const simulatedReturn = baseReturn + riskAdjustment + diversificationBonus + (Math.random() - 0.5) * 0.1;
    const volatility = allocation.volatilityTarget + (Math.random() - 0.5) * 0.1;
    
    return {
      return: simulatedReturn,
      sharpe: volatility > 0 ? simulatedReturn / volatility : 0,
      drawdown: Math.random() * 0.2 // Random drawdown up to 20%
    };
  }

  /**
   * Check for optimization convergence
   */
  async _checkConvergence() {
    if (this.optimizationHistory.length < 3) return false;
    
    const recent = this.optimizationHistory.slice(-3);
    const fitnessVariance = this._calculateVariance(recent.map(h => h.bestFitness));
    
    return fitnessVariance < this.config.convergenceThreshold;
  }

  /**
   * Finalize optimization and return results
   */
  async _finalizeOptimization(params) {
    const bestAllocation = this.bestAllocation;
    const optimizationSummary = {
      generations: this.generation + 1,
      finalFitness: bestAllocation.fitness,
      convergenceAchieved: this.currentState.convergenceStatus === 'converged',
      populationDiversity: this._calculatePopulationDiversity()
    };

    this._updateState({ 
      isOptimizing: false, 
      convergenceStatus: 'completed',
      finalResults: optimizationSummary
    });

    return {
      success: true,
      optimizedAllocation: {
        reserves: Math.round(bestAllocation.reserves * 100) / 100,
        development: Math.round(bestAllocation.development * 100) / 100,
        incentives: Math.round(bestAllocation.incentives * 100) / 100,
        community: Math.round(bestAllocation.community * 100) / 100
      },
      allocationDNA: bestAllocation,
      optimizationSummary,
      aiInsights: {
        fitnessScore: bestAllocation.fitness,
        riskProfile: this._categorizeRiskProfile(bestAllocation),
        diversificationLevel: bestAllocation.diversification,
        recommendedTimeHorizon: this._categorizeTimeHorizon(bestAllocation.timeHorizon),
        confidenceLevel: this._calculateConfidenceLevel(bestAllocation)
      }
    };
  }

  // =====================
  // UTILITY METHODS
  // =====================

  _generateRandomAllocation(constraints = {}) {
    // Generate random allocation within constraints
    let reserves = 20 + Math.random() * 40;
    let development = 15 + Math.random() * 35;
    let incentives = 10 + Math.random() * 30;
    let community = 5 + Math.random() * 25;
    
    // Normalize to 100%
    const total = reserves + development + incentives + community;
    const factor = 100 / total;
    
    return {
      reserves: reserves * factor,
      development: development * factor,
      incentives: incentives * factor,
      community: community * factor,
      riskTolerance: Math.random(),
      timeHorizon: Math.random(),
      diversification: 0.3 + Math.random() * 0.4,
      volatilityTarget: 0.2 + Math.random() * 0.4
    };
  }

  _blendGenes(gene1, gene2, alpha) {
    return gene1 * alpha + gene2 * (1 - alpha);
  }

  _gaussianRandom() {
    // Box-Muller transform for Gaussian random numbers
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  _generateMarketSeed() {
    return Math.floor(Math.random() * 1000000);
  }

  _calculatePopulationDiversity() {
    const fitnessValues = this.population.map(p => p.fitness);
    return this._calculateVariance(fitnessValues);
  }

  _calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  _categorizeRiskProfile(allocation) {
    if (allocation.riskTolerance < 0.3) return 'Conservative';
    if (allocation.riskTolerance < 0.7) return 'Moderate';
    return 'Aggressive';
  }

  _categorizeTimeHorizon(timeHorizon) {
    if (timeHorizon < 0.3) return 'Short-term (< 1 year)';
    if (timeHorizon < 0.7) return 'Medium-term (1-3 years)';
    return 'Long-term (3+ years)';
  }

  _calculateConfidenceLevel(allocation) {
    return Math.min(0.95, allocation.fitness * 0.8 + 0.2);
  }

  _updateState(newState) {
    const currentState = this._state$.value;
    this._state$.next({ ...currentState, ...newState });
  }

  _updateOptimizationState(generation) {
    const historyEntry = {
      generation,
      bestFitness: this.bestAllocation.fitness,
      averageFitness: this.population.reduce((sum, p) => sum + p.fitness, 0) / this.population.length,
      populationDiversity: this._calculatePopulationDiversity()
    };
    
    this.optimizationHistory.push(historyEntry);
    
    this._updateState({
      generation: generation + 1,
      bestFitness: this.bestAllocation.fitness,
      population: this.population.slice(0, 5), // Top 5 for display
      convergenceStatus: 'optimizing'
    });
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default AIPortfolioOptimizer;
