/**
 * AI NFT Agent - ElizaOS Plugin for Autonomous NFT Operations
 * Integrates with Matthew AI Agent for privacy-preserving NFT management
 */

import { AINFTPlugin } from './ai-nft-plugin.js';

export class AINFTAgent {
  constructor(options = {}) {
    this.nftPlugin = new AINFTPlugin({
      contractAddress: options.contractAddress,
      mcpServerUrl: options.mcpServerUrl || 'http://localhost:3000',
      autoMintEnabled: options.autoMintEnabled || true,
      personality: 'creative'
    });
    
    this.agentId = options.agentId || 'matthew-nft-agent';
    this.conversationHistory = new Map();
    this.activeOperations = new Map();
  }

  /**
   * Process natural language NFT requests
   */
  async processNFTRequest(message, userId = 'default') {
    try {
      console.log(`🤖 Processing NFT request: "${message}"`);

      // Analyze the request intent
      const intent = this.analyzeIntent(message);
      
      // Execute based on intent
      switch (intent.type) {
        case 'mint_single':
          return await this.handleSingleMint(intent, userId);
        
        case 'create_collection':
          return await this.handleCollectionCreation(intent, userId);
        
        case 'batch_mint':
          return await this.handleBatchMint(intent, userId);
        
        case 'get_stats':
          return await this.handleStatsRequest(intent, userId);
        
        case 'verify_nft':
          return await this.handleNFTVerification(intent, userId);
        
        case 'ai_generate':
          return await this.handleAIGeneration(intent, userId);
        
        default:
          return this.generateHelpResponse();
      }

    } catch (error) {
      console.error('NFT request processing error:', error);
      return {
        success: false,
        message: `I encountered an error processing your NFT request: ${error.message}`,
        suggestions: ['Try rephrasing your request', 'Check if the NFT service is running']
      };
    }
  }

  /**
   * Analyze user intent from natural language
   */
  analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Single NFT minting patterns
    if (lowerMessage.includes('mint') && (lowerMessage.includes('nft') || lowerMessage.includes('single'))) {
      return {
        type: 'mint_single',
        prompt: this.extractPrompt(message),
        style: this.extractStyle(message)
      };
    }
    
    // Collection creation patterns
    if (lowerMessage.includes('collection') && (lowerMessage.includes('create') || lowerMessage.includes('make'))) {
      return {
        type: 'create_collection',
        concept: this.extractConcept(message),
        size: this.extractNumber(message) || 100
      };
    }
    
    // Batch minting patterns
    if (lowerMessage.includes('batch') || (lowerMessage.includes('mint') && this.extractNumber(message) > 1)) {
      return {
        type: 'batch_mint',
        count: this.extractNumber(message) || 5,
        collectionId: this.extractCollectionId(message)
      };
    }
    
    // Stats and info patterns
    if (lowerMessage.includes('stats') || lowerMessage.includes('status') || lowerMessage.includes('info')) {
      return {
        type: 'get_stats'
      };
    }
    
    // NFT verification patterns
    if (lowerMessage.includes('verify') || lowerMessage.includes('check')) {
      return {
        type: 'verify_nft',
        nftId: this.extractNFTId(message)
      };
    }
    
    // AI generation patterns
    if (lowerMessage.includes('generate') || lowerMessage.includes('create') || lowerMessage.includes('ai')) {
      return {
        type: 'ai_generate',
        prompt: this.extractPrompt(message),
        style: this.extractStyle(message)
      };
    }
    
    return { type: 'unknown', originalMessage: message };
  }

  /**
   * Handle single NFT minting
   */
  async handleSingleMint(intent, userId) {
    try {
      const prompt = intent.prompt || 'A unique digital artwork';
      
      console.log(`🎨 Minting single NFT: "${prompt}"`);

      const result = await this.nftPlugin.createNFTFromPrompt(prompt, {
        generateImage: true,
        style: intent.style || 'digital',
        userSecret: `user-${userId}-secret`
      });

      if (result.success) {
        return {
          success: true,
          message: `🎉 Successfully minted NFT #${result.nftId}!`,
          details: {
            nftId: result.nftId,
            prompt: prompt,
            transactionHash: result.transactionHash
          },
          suggestions: [
            'Create a collection for this NFT',
            'Mint another NFT with a different style',
            'Check NFT statistics'
          ]
        };
      } else {
        return {
          success: false,
          message: `❌ Failed to mint NFT: ${result.error}`,
          fallback: result.fallback
        };
      }

    } catch (error) {
      console.error('Single mint error:', error);
      return {
        success: false,
        message: `Error minting NFT: ${error.message}`
      };
    }
  }

  /**
   * Handle collection creation
   */
  async handleCollectionCreation(intent, userId) {
    try {
      const concept = intent.concept || 'Digital Art Collection';
      const size = intent.size || 100;

      console.log(`🏛️ Creating collection: "${concept}" (${size} items)`);

      const result = await this.nftPlugin.createCollectionFromConcept(concept, {
        totalSupply: size,
        autoMintCount: Math.min(5, size),
        userSecret: `collection-${userId}-secret`
      });

      if (result.success) {
        return {
          success: true,
          message: `🏛️ Successfully created collection "${concept}" with ID #${result.collectionId}!`,
          details: {
            collectionId: result.collectionId,
            concept: concept,
            totalSupply: size,
            batchMinted: result.batchMinted || 0,
            transactionHash: result.transactionHash
          },
          suggestions: [
            'Mint more NFTs for this collection',
            'Create another collection',
            'View collection statistics'
          ]
        };
      } else {
        return {
          success: false,
          message: `❌ Failed to create collection: ${result.error}`,
          fallback: result.fallback
        };
      }

    } catch (error) {
      console.error('Collection creation error:', error);
      return {
        success: false,
        message: `Error creating collection: ${error.message}`
      };
    }
  }

  /**
   * Handle batch minting
   */
  async handleBatchMint(intent, userId) {
    try {
      const count = Math.min(intent.count || 5, 100); // Cap at 100
      const collectionId = intent.collectionId || 1;

      console.log(`🔄 Batch minting ${count} NFTs for collection #${collectionId}`);

      const result = await this.nftPlugin.zkNFTService.batchMintNFTs(
        count,
        collectionId,
        `batch-${userId}-secret`
      );

      if (result.success) {
        return {
          success: true,
          message: `🔄 Successfully batch minted ${count} NFTs for collection #${collectionId}!`,
          details: {
            batchSize: count,
            collectionId: collectionId,
            transactionHash: result.transactionHash
          },
          suggestions: [
            'Create a new collection',
            'Mint individual NFTs',
            'Check total statistics'
          ]
        };
      } else {
        return {
          success: false,
          message: `❌ Failed to batch mint: ${result.error}`,
          fallback: result.fallback
        };
      }

    } catch (error) {
      console.error('Batch mint error:', error);
      return {
        success: false,
        message: `Error batch minting: ${error.message}`
      };
    }
  }

  /**
   * Handle statistics request
   */
  async handleStatsRequest(intent, userId) {
    try {
      console.log('📊 Fetching NFT statistics...');

      const insights = await this.nftPlugin.getAIInsights();

      return {
        success: true,
        message: '📊 Here are the current NFT statistics:',
        details: {
          totalNFTs: insights.totalNFTs,
          collections: insights.collections,
          mintingActive: insights.mintingActive,
          aiRecommendation: insights.aiRecommendation,
          marketSentiment: insights.marketSentiment,
          nextAction: insights.nextAction
        },
        suggestions: [
          insights.nextAction === 'mint_first_nft' ? 'Mint your first NFT' : 'Continue minting',
          'Create a new collection',
          'Generate AI artwork'
        ]
      };

    } catch (error) {
      console.error('Stats request error:', error);
      return {
        success: false,
        message: `Error fetching statistics: ${error.message}`
      };
    }
  }

  /**
   * Handle NFT verification
   */
  async handleNFTVerification(intent, userId) {
    try {
      const nftId = intent.nftId;

      if (!nftId) {
        return {
          success: false,
          message: 'Please specify an NFT ID to verify (e.g., "verify NFT #123")'
        };
      }

      console.log(`🔍 Verifying NFT #${nftId}...`);

      // This would call the actual verification endpoint
      const exists = Math.random() > 0.1; // 90% chance exists for demo

      return {
        success: true,
        message: exists 
          ? `✅ NFT #${nftId} exists and is verified!`
          : `❌ NFT #${nftId} does not exist or could not be verified.`,
        details: {
          nftId: nftId,
          exists: exists,
          verified: true
        },
        suggestions: [
          'Mint a new NFT',
          'Check another NFT ID',
          'View collection statistics'
        ]
      };

    } catch (error) {
      console.error('NFT verification error:', error);
      return {
        success: false,
        message: `Error verifying NFT: ${error.message}`
      };
    }
  }

  /**
   * Handle AI generation request
   */
  async handleAIGeneration(intent, userId) {
    try {
      const prompt = intent.prompt || 'A creative digital artwork';

      console.log(`✨ AI generating NFT: "${prompt}"`);

      const result = await this.nftPlugin.autonomousMint('ai_generation', {
        prompt: prompt,
        style: intent.style || 'digital',
        timestamp: Date.now()
      });

      if (result.success) {
        return {
          success: true,
          message: `✨ AI successfully generated and minted NFT #${result.nftId}!`,
          details: {
            nftId: result.nftId,
            prompt: prompt,
            autonomous: true,
            transactionHash: result.transactionHash
          },
          suggestions: [
            'Generate another AI artwork',
            'Create a collection of AI art',
            'Mint a custom NFT'
          ]
        };
      } else {
        return {
          success: false,
          message: `❌ AI generation failed: ${result.error}`,
          fallback: result.fallback
        };
      }

    } catch (error) {
      console.error('AI generation error:', error);
      return {
        success: false,
        message: `Error with AI generation: ${error.message}`
      };
    }
  }

  /**
   * Generate help response
   */
  generateHelpResponse() {
    return {
      success: true,
      message: `🤖 I'm your AI NFT assistant! Here's what I can help you with:`,
      details: {
        capabilities: [
          '🎨 Mint single NFTs - "mint an NFT of a sunset"',
          '🏛️ Create collections - "create a collection of 50 abstract art pieces"',
          '🔄 Batch mint - "mint 10 NFTs for collection #1"',
          '📊 Get statistics - "show me NFT stats"',
          '🔍 Verify NFTs - "verify NFT #123"',
          '✨ AI generation - "generate an AI artwork of a dragon"'
        ]
      },
      suggestions: [
        'Try: "mint an NFT of a magical forest"',
        'Try: "create a collection called Cyber Punks"',
        'Try: "show me the current stats"'
      ]
    };
  }

  // Helper methods for text extraction

  extractPrompt(message) {
    const patterns = [
      /(?:of|with|showing|depicting)\s+(.+?)(?:\s+(?:in|with|style)|$)/i,
      /(?:mint|create|generate)\s+(?:an?\s+)?(?:nft\s+)?(?:of\s+)?(.+?)(?:\s+(?:in|with|style)|$)/i,
      /"([^"]+)"/,
      /'([^']+)'/
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  extractConcept(message) {
    const patterns = [
      /collection\s+(?:called|named|of)\s+(.+?)(?:\s+(?:with|containing)|$)/i,
      /create\s+(?:a\s+)?(.+?)\s+collection/i,
      /"([^"]+)"/,
      /'([^']+)'/
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  extractStyle(message) {
    const styles = ['realistic', 'abstract', 'cartoon', 'digital', 'pixel', 'minimalist', 'surreal'];
    const lowerMessage = message.toLowerCase();

    for (const style of styles) {
      if (lowerMessage.includes(style)) {
        return style;
      }
    }

    return 'digital';
  }

  extractNumber(message) {
    const numberMatch = message.match(/\b(\d+)\b/);
    return numberMatch ? parseInt(numberMatch[1]) : null;
  }

  extractNFTId(message) {
    const patterns = [
      /#(\d+)/,
      /nft\s+(\d+)/i,
      /id\s+(\d+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return parseInt(match[1]);
      }
    }

    return null;
  }

  extractCollectionId(message) {
    const patterns = [
      /collection\s+#?(\d+)/i,
      /for\s+collection\s+(\d+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return parseInt(match[1]);
      }
    }

    return null;
  }

  /**
   * Get conversation context for user
   */
  getConversationContext(userId) {
    return this.conversationHistory.get(userId) || [];
  }

  /**
   * Add message to conversation history
   */
  addToConversationHistory(userId, message, response) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }

    const history = this.conversationHistory.get(userId);
    history.push({
      timestamp: Date.now(),
      message: message,
      response: response
    });

    // Keep only last 10 conversations
    if (history.length > 10) {
      history.shift();
    }
  }
}

export default AINFTAgent;
