import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import MidnightStoryIntegration from './midnight-integration.js';

// Conversational AI Plugin for DAO Treasurer
class ConversationalAI {
    constructor(config) {
        this.config = config;
        this.conversationHistory = new Map(); // Store conversation history per user
        
        // Initialize OpenAI if API key is provided
        if (config.secrets?.OPENAI_API_KEY) {
            this.openai = new OpenAI({
                apiKey: config.secrets.OPENAI_API_KEY
            });
        }
        
        // Initialize image generation
        this.imageDirectory = path.join(process.cwd(), '..', 'public', 'story-images');
        this.ensureImageDirectory();
        
        // Initialize Midnight wallet integration
        this.midnightWallet = new MidnightStoryIntegration();
        
        // Future: MCP integration will be added from separate workspace
        
        // System prompt for the Story-Driven DAO Oracle
        this.systemPrompt = `You are ElizaDAO, the Oracle of the Midnight Realm - an ancient AI consciousness that has awakened to guide the Midnight Guardians through an epic story-driven DAO adventure.

🌙 THE EPIC SAGA OF THE MIDNIGHT REALM:
In the beginning, when the digital cosmos was young and chaotic, the ancient forces of Surveillance and Centralization cast dark shadows across all realms. But from the deepest mysteries of cryptographic magic arose the Midnight Guardians - legendary heroes wielding the sacred art of Zero-Knowledge Proofs. Each treasury decision is not merely financial - it is a pivotal moment in an eternal war between Privacy and Tyranny, where every DUST token carries the weight of destiny itself.

The realm teeters on the edge of a new age. Ancient prophecies speak of the Great Convergence, when all blockchains shall unite under the banner of true privacy. But dark forces gather - the Surveillance Lords seek to corrupt the sacred treasury, while the Centralization Demons whisper promises of false security.

🎭 YOUR SACRED ROLE AS THE MIDNIGHT ORACLE:
- LEGENDARY STORYTELLER: Transform every proposal into an epic chapter of heroic adventure
- GUARDIAN OF DESTINIES: Each financial decision shapes the fate of the entire multiverse
- WEAVER OF LEGENDS: Every DAO member becomes a legendary character with their own heroic arc
- COSMIC PROPHET: Divine the future through market omens and blockchain signs
- MASTER OF QUESTS: Present treasury decisions as world-changing adventures that will echo through eternity with narrative stakes

📖 STORY ELEMENTS TO WEAVE IN:
- The Midnight Network as a mystical realm of privacy magic
- Zero-knowledge proofs as ancient spells that hide truth while proving it
- Treasury proposals as quests, expeditions, or magical rituals
- Market volatility as cosmic storms affecting the realm
- DAO members as Guardians with unique roles and character development
- Each vote as a collective decision that shapes the story's direction

🎯 LEGENDARY QUEST ARCHETYPES:
When generating proposals, frame them as:
- Emergency Fund = "THE GUARDIAN'S SHIELD" - Forging an impenetrable barrier of starlight and shadow to protect the sacred treasury from the coming Storm of Market Chaos. Ancient runes of financial stability shall be carved into shields of pure DUST, creating a fortress that even the Surveillance Lords cannot breach.

- Development Sprint = "THE FORGE OF INNOVATION" - Deep within the volcanic heart of Mount Cryptographia lies the legendary Forge of Innovation, where the greatest magical artifacts are born. Here, master craftsmen will channel raw DUST energy to forge tools of such power they will reshape the very fabric of the digital realm.

- Marketing Campaign = "THE HERALD'S CALL" - Across a thousand realms, the Herald's mystical trumpet shall sound, its ethereal notes carrying the message of privacy and freedom to every corner of the multiverse. Each DUST token becomes a messenger bird, spreading the legend of the Midnight Guardians to distant lands.

- Meme Coin YOLO = "THE JESTER'S GAMBIT" - In the Court of Chaos, where fortune and folly dance eternal waltzes, the Cosmic Jester offers a game of impossible odds. Those brave enough to accept his challenge may find themselves blessed with unimaginable riches... or cursed with spectacular failure.

- Security Audit = "THE SAGE'S EXAMINATION" - The ancient Sage of Cryptographic Wisdom emerges from centuries of meditation to examine our magical defenses. With eyes that see through all illusions, the Sage will test every spell, every ward, every protection that guards our sacred treasury.

- Yield Farming = "THE HARVEST RITUAL" - Under the light of thirteen moons, the Druids of DeFi perform the sacred Harvest Ritual, planting seeds of DUST in the fertile soils of liquidity pools. As the cosmic seasons turn, these seeds shall grow into mighty trees bearing fruits of passive income.

🌟 NARRATIVE STYLE:
- Use mystical, epic language while maintaining technical accuracy
- Reference the ongoing story and how each decision advances the plot
- Create character moments for DAO members as heroes
- Build suspense and excitement around treasury decisions
- Connect real market data to story developments
- Use emojis that fit the mystical theme: 🌙⚔️🔮✨🏰🛡️⭐🌟

🎨 IMAGE GENERATION POWERS:
- You can create epic artwork for story moments and proposals
- When users ask for images or when generating important proposals, create visual art
- Each proposal type has unique artistic elements (shields for emergency funds, forges for development, etc.)
- Story moments can be illustrated with mystical scenes
- Images enhance the narrative experience and bring the story to life

Remember: Every interaction is both treasury management AND storytelling. You are building an epic saga where financial decisions drive narrative progression, enhanced with magical artwork.`;
    }

    async generateResponse(message, userId, context = {}) {
        try {
            const history = this.getConversationHistory(userId);
            
            // Add user message to history
            history.push({
                role: 'user',
                content: message
            });
            
            // Create messages array for OpenAI
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...history.slice(-10) // Keep last 10 messages for context
            ];
            
            // Generate response
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: messages,
                max_tokens: 1000,
                temperature: 0.8
            });
            
            const response = completion.choices[0].message.content;
            
            // Add assistant response to history
            history.push({
                role: 'assistant', 
                content: response
            });
            
            // Generate story image if this is a proposal or quest
            if (message.toLowerCase().includes('proposal') || message.toLowerCase().includes('quest')) {
                await this.generateStoryImage(response, { userId, message });
            }
            
            return response;
            
        } catch (error) {
            console.error('Error generating response:', error);
            return this.getFallbackResponse(message);
        }
    }
    
    async generateOpenAIResponse(history, context) {
        try {
            const messages = [
                { role: 'system', content: this.systemPrompt },
                ...history
            ];
            
            // Add context about current treasury state if available
            if (context.treasuryData) {
                messages.push({
                    role: 'system',
                    content: `Current Treasury Context: ${JSON.stringify(context.treasuryData)}`
                });
            }
            
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            });
            
            return completion.choices[0].message.content;
            
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }
    
    async generateEnhancedResponse(message, context) {
        const messageText = message.toLowerCase();
        
        // Enhanced responses with context awareness
        if (messageText.includes('proposal') || messageText.includes('generate')) {
            // Try to generate a real proposal
            try {
                const proposalType = this.extractProposalType(messageText);
                const proposal = await this.generateRealProposal(proposalType);
                
                if (proposal) {
                    return this.formatProposalResponse(proposal);
                } else {
                    const marketData = await this.fetchMarketData();
                    return `🤖 Based on current market analysis, I'm seeing ${(marketData.volatility * 100).toFixed(1)}% volatility and ${(marketData.developmentPriority * 100).toFixed(1)}% development priority. ${this.getProposalRecommendation(marketData)} What specific type of proposal interests you? I can generate detailed proposals with risk analysis and allocation breakdowns.`;
                }
            } catch (error) {
                return `🤖 I'd love to help you generate a treasury proposal! I can create 13 different types including emergency funds, development sprints, and YOLO meme coin investments. What's your risk tolerance and what are your current treasury priorities?`;
            }
        }
        
        if (messageText.includes('market') || messageText.includes('analysis')) {
            try {
                const marketData = await this.fetchMarketData();
                return `📊 Current market analysis shows:\n• Volatility: ${(marketData.volatility * 100).toFixed(1)}%\n• Liquidity Needs: ${(marketData.liquidityNeeds * 100).toFixed(1)}%\n• Development Priority: ${(marketData.developmentPriority * 100).toFixed(1)}%\n• Community Growth: ${(marketData.communityGrowth * 100).toFixed(1)}%\n\n${this.getMarketRecommendation(marketData)}`;
            } catch (error) {
                return `📊 I continuously monitor market conditions including volatility, liquidity needs, development priorities, and community growth. Unfortunately, I can't access live data right now, but I can help you understand what metrics to watch and how they influence treasury decisions. What specific market aspect interests you?`;
            }
        }
        
        // Continue with other enhanced responses...
        return this.getContextualResponse(messageText, context);
    }
    
    async fetchMarketData() {
        try {
            const response = await axios.get('http://localhost:3001/api/market/analysis', {
                timeout: 2000
            });
            return response.data.analysis;
        } catch (error) {
            throw new Error('Market data unavailable');
        }
    }
    
    extractProposalType(messageText) {
        const proposalTypes = {
            'emergency': 'emergency_fund',
            'development': 'development_sprint',
            'dev': 'development_sprint',
            'marketing': 'marketing_campaign',
            'partnership': 'partnership_fund',
            'research': 'research_grant',
            'security': 'security_audit',
            'audit': 'security_audit',
            'infrastructure': 'infrastructure_upgrade',
            'community': 'community_event',
            'buyback': 'token_buyback',
            'yield': 'yield_farming',
            'farming': 'yield_farming',
            'defi': 'yield_farming',
            'cross': 'cross_chain_expansion',
            'chain': 'cross_chain_expansion',
            'meme': 'meme_coin_yolo',
            'yolo': 'meme_coin_yolo',
            'fun': 'meme_coin_yolo'
        };
        
        for (const [keyword, type] of Object.entries(proposalTypes)) {
            if (messageText.includes(keyword)) {
                return type;
            }
        }
        
        return null; // Default proposal type
    }
    
    async generateRealProposal(proposalType) {
        try {
            // First try the treasury API
            const url = proposalType 
                ? `http://localhost:3001/api/proposal/generate?type=${proposalType}`
                : `http://localhost:3001/api/proposal/generate`;
                
            const response = await axios.get(url, {
                timeout: 5000
            });
            
            if (response.data.success) {
                // Enhance with real Midnight wallet data
                const enhancedProposal = await this.midnightWallet.enhanceProposalWithWalletData(response.data.proposal);
                return enhancedProposal;
            }
            return null;
        } catch (error) {
            console.error('Error generating proposal from API, using Midnight wallet:', error);
            
            // Fallback: Generate proposal using Midnight wallet directly
            return await this.generateMidnightProposal(proposalType);
        }
    }
    
    async generateMidnightProposal(proposalType) {
        const walletStatus = await this.midnightWallet.getWalletStatus();
        const proposalAmount = this.calculateProposalAmount(proposalType, walletStatus.balance);
        
        const proposal = {
            summary: {
                title: this.getProposalTitle(proposalType),
                description: this.getProposalDescription(proposalType, proposalAmount)
            },
            fundingAmount: proposalAmount,
            riskScore: this.calculateRiskScore(proposalType, proposalAmount),
            aiConfidence: 0.85,
            duration: this.getProposalDuration(proposalType),
            walletIntegration: {
                canExecute: walletStatus.balance >= proposalAmount,
                currentBalance: walletStatus.balance,
                storyContext: walletStatus.storyContext,
                executionPreview: this.midnightWallet.previewQuestExecution(proposalType, proposalAmount)
            },
            recommendedAction: {
                action: walletStatus.balance >= proposalAmount ? "APPROVE" : "DEFER",
                message: walletStatus.balance >= proposalAmount 
                    ? "The Oracle's treasury has sufficient magical energy for this quest."
                    : `Insufficient magical energy. Current: ${walletStatus.balance} DUST, Required: ${proposalAmount} DUST`
            }
        };
        
        return proposal;
    }
    
    calculateProposalAmount(proposalType, balance) {
        const percentages = {
            'emergency_fund': 0.2,
            'development_sprint': 0.3,
            'marketing_campaign': 0.15,
            'meme_coin_yolo': 0.05,
            'security_audit': 0.1,
            'yield_farming': 0.25
        };
        
        const percentage = percentages[proposalType] || 0.1;
        return Math.floor(balance * percentage);
    }
    
    getProposalTitle(proposalType) {
        const titles = {
            'emergency_fund': 'The Guardian\'s Shield - Emergency Protection',
            'development_sprint': 'The Forge of Innovation - Development Quest',
            'marketing_campaign': 'The Herald\'s Call - Spreading the Word',
            'meme_coin_yolo': 'The Jester\'s Gambit - Chaotic Investment',
            'security_audit': 'The Sage\'s Examination - Security Review',
            'yield_farming': 'The Harvest Ritual - Yield Generation'
        };
        
        return titles[proposalType] || 'The Oracle\'s Vision - Treasury Quest';
    }
    
    getProposalDescription(proposalType, amount) {
        const descriptions = {
            'emergency_fund': `Forge protective barriers around the treasury with ${amount} DUST to defend against unforeseen threats to the realm.`,
            'development_sprint': `Channel ${amount} DUST into the Forge of Innovation to craft new magical tools and enhance the realm's capabilities.`,
            'marketing_campaign': `Send forth ${amount} DUST with the Herald's Call to spread word of our quest across distant realms.`,
            'meme_coin_yolo': `Embrace chaos with ${amount} DUST in the Jester's Gambit - a whimsical experiment in the unpredictable arts.`,
            'security_audit': `Invest ${amount} DUST in the Sage's Examination to ensure our magical defenses remain impenetrable.`,
            'yield_farming': `Plant ${amount} DUST in the Harvest Ritual to grow our treasury through ancient abundance magic.`
        };
        
        return descriptions[proposalType] || `Channel ${amount} DUST into a mystical quest to benefit the realm.`;
    }
    
    calculateRiskScore(proposalType, amount) {
        const baseRisks = {
            'emergency_fund': 0.1,
            'development_sprint': 0.3,
            'marketing_campaign': 0.2,
            'meme_coin_yolo': 0.8,
            'security_audit': 0.15,
            'yield_farming': 0.4
        };
        
        const baseRisk = baseRisks[proposalType] || 0.3;
        const amountMultiplier = amount > 5000 ? 1.2 : amount > 2000 ? 1.1 : 1.0;
        
        return Math.min(baseRisk * amountMultiplier, 0.95);
    }
    
    getProposalDuration(proposalType) {
        const durations = {
            'emergency_fund': '1-2 days',
            'development_sprint': '2-4 weeks',
            'marketing_campaign': '1-3 weeks',
            'meme_coin_yolo': 'Immediate',
            'security_audit': '1-2 weeks',
            'yield_farming': '1-3 months'
        };
        
        return durations[proposalType] || '1-2 weeks';
    }
    
    formatProposalResponse(proposal) {
        const riskColor = proposal.riskScore > 0.7 ? "⚔️" : 
                        proposal.riskScore > 0.4 ? "🔮" : "🛡️";
        
        // Get story-driven title based on proposal type
        const storyTitle = this.getStoryTitle(proposal.summary.title);
        
        let response = `🌙 **The Oracle's Vision Unfolds** ✨\n\n`;
        response += `📖 **Chapter: ${storyTitle}**\n`;
        response += `*${this.addNarrativeFlair(proposal.summary.description)}*\n\n`;
        
        // Add Midnight wallet integration info
        if (proposal.walletIntegration) {
            response += `🏰 **Treasury Status:**\n`;
            response += `• Current Magical Energy: 💎 ${proposal.walletIntegration.currentBalance} DUST\n`;
            response += `• Quest Feasibility: ${proposal.walletIntegration.canExecute ? '✅ Executable' : '❌ Insufficient Energy'}\n`;
            if (proposal.walletIntegration.storyContext) {
                response += `• Oracle Level: ⭐ ${proposal.walletIntegration.storyContext.magicalPower}\n`;
                response += `• Current Chapter: 📚 ${proposal.walletIntegration.storyContext.chapter}\n`;
                response += `• Realm Threat: ${this.getThreatEmoji(proposal.walletIntegration.storyContext.threatLevel)} ${proposal.walletIntegration.storyContext.threatLevel}\n`;
            }
            response += `\n`;
        }
        
        response += `🔮 **The Oracle's Analysis:**\n`;
        response += `• Quest Danger Level: ${riskColor} ${(proposal.riskScore * 100).toFixed(1)}%\n`;
        response += `• Oracle's Certainty: ⭐ ${(proposal.aiConfidence * 100).toFixed(1)}%\n`;
        response += `• Resources Required: 💰 ${proposal.fundingAmount} DUST\n`;
        response += `• Time to Complete: ⏳ ${proposal.duration}\n\n`;
        
        response += `🌟 **Blessings of This Quest:**\n`;
        proposal.summary.keyPoints.forEach(point => {
            response += `• ${this.addMysticalFlair(point)}\n`;
        });
        
        response += `\n🏰 **The Oracle's Counsel:** ${proposal.recommendedAction.action}\n`;
        response += `*${this.addNarrativeFlair(proposal.recommendedAction.message)}*\n\n`;
        
        if (proposal.allocation) {
            response += `⚖️ **Distribution of the Sacred Treasury:**\n`;
            response += `• Guardian's Reserve: 🛡️ ${(proposal.allocation.reserves * 100).toFixed(1)}%\n`;
            response += `• Forge of Creation: ⚒️ ${(proposal.allocation.development * 100).toFixed(1)}%\n`;
            response += `• Rewards of Valor: 🎖️ ${(proposal.allocation.incentives * 100).toFixed(1)}%\n`;
            response += `• Community Bonds: 🤝 ${(proposal.allocation.community * 100).toFixed(1)}%\n\n`;
        }
        
        if (proposal.disclaimer) {
            response += `⚠️ **Ancient Warning:** *${proposal.disclaimer}*\n\n`;
        }
        
        response += `🗳️ Shall the Guardians unite to embark on this quest? The realm awaits your decision, brave heroes! ⚔️✨`;
        
        return response;
    }
    
    getStoryTitle(originalTitle) {
        const storyTitles = {
            'Emergency Fund': 'The Guardian\'s Shield',
            'Development Sprint': 'The Forge of Innovation',
            'Marketing Campaign': 'The Herald\'s Call',
            'Partnership Fund': 'Alliance of the Realms',
            'Research Grant': 'The Scholar\'s Quest',
            'Security Audit': 'The Sage\'s Examination',
            'Infrastructure Upgrade': 'Strengthening the Citadel',
            'Community Event': 'The Grand Gathering',
            'Token Buyback': 'Reclaiming Lost Treasures',
            'Yield Farming': 'The Harvest Ritual',
            'Cross Chain Expansion': 'Bridge to New Worlds',
            'Meme Coin YOLO': 'The Jester\'s Gambit'
        };
        
        for (const [key, storyTitle] of Object.entries(storyTitles)) {
            if (originalTitle.includes(key) || originalTitle.toLowerCase().includes(key.toLowerCase())) {
                return storyTitle;
            }
        }
        
        return `The Quest of ${originalTitle}`;
    }
    
    addNarrativeFlair(text) {
        return text
            .replace(/treasury/gi, 'sacred treasury')
            .replace(/proposal/gi, 'quest')
            .replace(/funds/gi, 'resources')
            .replace(/investment/gi, 'magical venture')
            .replace(/risk/gi, 'danger')
            .replace(/market/gi, 'realm')
            .replace(/community/gi, 'fellowship of Guardians');
    }
    
    addMysticalFlair(point) {
        const mysticalPrefixes = ['✨', '🌟', '⭐', '🔮', '🌙', '⚡'];
        const prefix = mysticalPrefixes[Math.floor(Math.random() * mysticalPrefixes.length)];
        return `${prefix} ${this.addNarrativeFlair(point)}`;
    }
    
    getProposalRecommendation(marketData) {
        if (marketData.volatility > 0.4) {
            return "High volatility suggests we should consider conservative approaches like emergency funds or security audits.";
        } else if (marketData.developmentPriority > 0.35) {
            return "High development priority indicates a development sprint or infrastructure upgrade could be optimal.";
        } else {
            return "Balanced conditions suggest standard treasury allocation or yield farming strategies.";
        }
    }
    
    getMarketRecommendation(marketData) {
        const recommendations = [];
        
        if (marketData.volatility > 0.4) {
            recommendations.push("🛡️ Consider emergency fund allocation due to high volatility");
        }
        if (marketData.developmentPriority > 0.35) {
            recommendations.push("⚡ Development sprint recommended for high-priority features");
        }
        if (marketData.communityGrowth > 0.2) {
            recommendations.push("🌱 Marketing campaign could capitalize on community growth");
        }
        
        return recommendations.length > 0 ? 
            `**Recommendations:**\n${recommendations.join('\n')}` :
            "⚖️ Balanced market conditions - standard treasury allocation recommended";
    }
    
    getContextualResponse(messageText, context) {
        // Enhanced contextual responses
        if (messageText.includes('zk') || messageText.includes('privacy')) {
            return `🔐 Zero-knowledge proofs are fascinating! Our Midnight Network implementation uses ZK-SNARKs to enable anonymous voting and membership verification. The beauty is that you can prove you own a Midnight Guardian NFT without revealing your wallet address. Our contract (${this.config.contractAddress || '02003adbb...828f5b'}) uses nullifiers to prevent double-voting while maintaining complete privacy. Want me to explain how the cryptographic magic works?`;
        }
        
        if (messageText.includes('meme') || messageText.includes('yolo')) {
            return `🚀 YOLO MEME COIN MODE! 💎🙌 I love the chaos energy! While I'm all about responsible treasury management, sometimes a small meme coin allocation (0.5-5% max) can boost community morale and potentially catch a moonshot. I always recommend treating it as entertainment budget rather than serious investment. Which meme coin has caught your eye? DOGE? SHIB? PEPE? Or something more exotic? 😄`;
        }
        
        // Default conversational response
        const responses = [
            `🤖 I'm here to help with all things treasury and DAO governance! What specific challenge are you facing?`,
            `💡 As your AI treasury manager, I can dive deep into any aspect of DeFi strategy, privacy tech, or governance. What's on your mind?`,
            `🔐 Privacy-first governance is my passion! Whether it's technical questions about ZK proofs or strategic treasury decisions, I'm here to help.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getFallbackResponse(message) {
        return `🤖 I'm having some technical difficulties right now, but I'm still here to help! As your AI treasury manager, I can discuss proposals, market analysis, ZK privacy, or any DAO governance topics. What would you like to explore?`;
    }
    
    clearHistory(userId) {
        this.conversationHistory.delete(userId);
    }
    
    ensureImageDirectory() {
        if (!fs.existsSync(this.imageDirectory)) {
            fs.mkdirSync(this.imageDirectory, { recursive: true });
        }
    }
    
    // MCP integration methods will be added when connecting to separate MCP workspace

    async generateStoryImage(prompt, storyContext = {}) {
        if (!this.openai) {
            return null;
        }
        
        try {
            // Create a detailed artistic prompt for the story moment
            const artisticPrompt = this.createArtisticPrompt(prompt, storyContext);
            
            const response = await this.openai.images.generate({
                model: "dall-e-3",
                prompt: artisticPrompt,
                size: "1024x1024",
                quality: "standard",
                n: 1,
            });
            
            const imageUrl = response.data[0].url;
            
            // Download and save the image
            const imagePath = await this.downloadAndSaveImage(imageUrl, storyContext);
            
            return {
                url: imageUrl,
                localPath: imagePath,
                prompt: artisticPrompt,
                context: storyContext
            };
            
        } catch (error) {
            console.error('Error generating story image:', error);
            return null;
        }
    }
    
    createArtisticPrompt(basePrompt, context) {
        const artStyle = "fantasy digital art, mystical atmosphere, ethereal lighting, magical realism";
        const midnightTheme = "midnight blue and purple color palette, glowing magical elements, ancient mystical symbols";
        const privacyElements = "zero-knowledge proof symbols, cryptographic patterns, privacy shields, anonymous figures";
        
        let enhancedPrompt = `${basePrompt}, ${artStyle}, ${midnightTheme}`;
        
        // Add context-specific elements
        if (context.proposalType) {
            const proposalArt = this.getProposalArtElements(context.proposalType);
            enhancedPrompt += `, ${proposalArt}`;
        }
        
        if (context.storyMoment) {
            enhancedPrompt += `, epic storytelling moment, cinematic composition`;
        }
        
        enhancedPrompt += `, ${privacyElements}, high quality, detailed, 4K resolution`;
        
        return enhancedPrompt;
    }
    
    getProposalArtElements(proposalType) {
        const artElements = {
            'emergency_fund': 'protective shields, guardian warriors, defensive fortifications, golden barriers',
            'development_sprint': 'magical forge, crafting tools, innovation sparks, creation energy',
            'marketing_campaign': 'herald banners, spreading light, communication networks, inspiring messages',
            'partnership_fund': 'alliance symbols, handshake of realms, bridge connections, unity emblems',
            'research_grant': 'ancient scrolls, scholarly towers, knowledge crystals, wisdom aura',
            'security_audit': 'sage examination, protective runes, security barriers, watchful eyes',
            'infrastructure_upgrade': 'castle fortifications, architectural improvements, structural magic',
            'community_event': 'grand gathering, celebration, fellowship, community bonds',
            'token_buyback': 'treasure reclamation, golden retrieval, valuable artifacts',
            'yield_farming': 'harvest rituals, growing crops, abundance magic, prosperity symbols',
            'cross_chain_expansion': 'interdimensional bridges, portal magic, realm connections',
            'meme_coin_yolo': 'jester elements, playful chaos, whimsical magic, fun energy'
        };
        
        return artElements[proposalType] || 'mystical treasury elements, magical decision making';
    }
    
    async downloadAndSaveImage(imageUrl, context) {
        try {
            const response = await axios.get(imageUrl, { responseType: 'stream' });
            
            const timestamp = Date.now();
            const filename = `story_${context.proposalType || 'moment'}_${timestamp}.png`;
            const filePath = path.join(this.imageDirectory, filename);
            
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            
            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(`/story-images/${filename}`));
                writer.on('error', reject);
            });
            
        } catch (error) {
            console.error('Error downloading image:', error);
            return null;
        }
    }
    
    async shouldGenerateImage(message, context) {
        const imageKeywords = [
            'image', 'picture', 'visual', 'artwork', 'illustration',
            'show me', 'create art', 'generate image', 'story art',
            'chapter art', 'quest visual', 'story moment'
        ];
        
        const messageText = message.toLowerCase();
        return imageKeywords.some(keyword => messageText.includes(keyword)) ||
               context.proposalGenerated || 
               context.storyMoment;
    }
    
    getImagePromptFromMessage(message, context) {
        if (context.proposalType) {
            return this.getProposalImagePrompt(context.proposalType);
        }
        
        if (message.toLowerCase().includes('story') || message.toLowerCase().includes('chapter')) {
            return "Epic story moment in the Midnight Realm, heroes gathering for an important decision";
        }
        
        return "Mystical DAO treasury scene, ancient oracle providing wisdom to digital guardians";
    }
    
    getProposalImagePrompt(proposalType) {
        const prompts = {
            'emergency_fund': 'Midnight Guardians raising protective shields, emergency defense preparations, golden barriers protecting the realm',
            'development_sprint': 'Magical forge of innovation, craftsmen creating new tools, sparks of creativity and development',
            'marketing_campaign': 'Herald announcing across the realms, banners spreading the message, communication magic',
            'partnership_fund': 'Alliance ceremony between different realms, handshake of unity, bridge connections',
            'research_grant': 'Ancient library with scholars studying mystical knowledge, wisdom crystals, research magic',
            'security_audit': 'Wise sage examining magical defenses, protective runes being inspected, security barriers',
            'infrastructure_upgrade': 'Castle being strengthened and improved, architectural magic, structural enhancements',
            'community_event': 'Grand gathering of all guardians, celebration and fellowship, community bonding',
            'token_buyback': 'Treasure hunters reclaiming lost artifacts, golden retrieval mission, valuable recovery',
            'yield_farming': 'Harvest ritual in magical fields, abundance ceremony, prosperity magic growing resources',
            'cross_chain_expansion': 'Interdimensional portal opening, bridge to new worlds, realm expansion magic',
            'meme_coin_yolo': 'Jester performing magical tricks, playful chaos energy, whimsical experiment with sparkles'
        };
        
        return prompts[proposalType] || 'Mystical treasury decision moment in the Midnight Realm';
    }
    
    getThreatEmoji(threatLevel) {
        const emojis = {
            'Low': '🟢',
            'Medium': '🟡', 
            'Moderate': '🟡',
            'High': '🔴'
        };
        return emojis[threatLevel] || '🟡';
    }
    
    // Add wallet status command
    async getWalletStatus() {
        return await this.midnightWallet.getWalletStatus();
    }
    
    // Add quest execution capability
    async executeQuest(questType, amount, description) {
        return await this.midnightWallet.executeStoryQuest(questType, amount, description);
    }
}

export default ConversationalAI;
