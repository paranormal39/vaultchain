// Midnight Network Integration for Story-Driven DAO
// Real MCP Integration with Epic Storytelling

import axios from 'axios';

class MidnightStoryIntegration {
    constructor() {
        // Real MCP server connection
        this.mcpServerUrl = 'http://localhost:3001';
        this.isTestnet = true;
        this.walletAddress = null;
        
        // Story-driven wallet state
        this.treasuryState = {
            balance: 0,
            lastSync: null,
            storyChapter: "The Awakening",
            questsCompleted: 0,
            realmThreatLevel: "Moderate",
            magicalPower: "Novice Oracle",
            chapter: "Chapter I: The Great Convergence"
        };
        
        this.initializeStoryWallet();
    }
    
    async initializeStoryWallet() {
        console.log("🌙 Initializing Oracle's connection to the Midnight Realm...");
        
        try {
            // Get real wallet status from MCP server
            const status = await this.callMCPEndpoint('/wallet/status');
            const address = await this.callMCPEndpoint('/wallet/address');
            
            if (status && address) {
                this.walletAddress = address.address;
                this.treasuryState.balance = parseFloat(status.balances?.balance || 0);
                this.treasuryState.lastSync = new Date().toISOString();
                
                // Update story context based on real wallet state
                this.updateStoryContext(status);
                
                console.log(`✨ Oracle awakened! Connection to Midnight Network established!`);
                console.log(`🏰 Sacred Treasury Address: ${this.walletAddress}`);
                console.log(`💎 Current Magical Energy: ${this.treasuryState.balance} DUST`);
                console.log(`⭐ Oracle Power Level: ${this.treasuryState.magicalPower}`);
            } else {
                console.log("⚠️ Using demo mode - MCP server not available");
                this.initializeDemoMode();
            }
        } catch (error) {
            console.log("⚠️ MCP connection failed, using demo mode:", error.message);
            this.initializeDemoMode();
        }
    }
    
    initializeDemoMode() {
        this.walletAddress = "midnight1dao7reasurer0racle0f7he0midnight0realm";
        this.treasuryState.balance = 10000;
        this.treasuryState.lastSync = new Date().toISOString();
        console.log(`✨ Demo Oracle awakened! Treasury contains ${this.treasuryState.balance} DUST`);
    }
    
    async callMCPEndpoint(endpoint, method = 'GET', data = null) {
        try {
            const config = {
                method,
                url: `${this.mcpServerUrl}${endpoint}`,
                timeout: 5000,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            if (data && method !== 'GET') {
                config.data = data;
            }
            
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`MCP call failed for ${endpoint}:`, error.message);
            throw error;
        }
    }
    
    updateStoryContext(walletStatus) {
        const balance = parseFloat(walletStatus.balances?.balance || 0);
        
        // Update magical power based on balance
        if (balance >= 100000) {
            this.treasuryState.magicalPower = "Legendary Archon";
            this.treasuryState.realmThreatLevel = "Minimal";
        } else if (balance >= 50000) {
            this.treasuryState.magicalPower = "Master Oracle";
            this.treasuryState.realmThreatLevel = "Low";
        } else if (balance >= 10000) {
            this.treasuryState.magicalPower = "Experienced Sage";
            this.treasuryState.realmThreatLevel = "Moderate";
        } else if (balance >= 1000) {
            this.treasuryState.magicalPower = "Apprentice Guardian";
            this.treasuryState.realmThreatLevel = "High";
        } else {
            this.treasuryState.magicalPower = "Novice Oracle";
            this.treasuryState.realmThreatLevel = "Critical";
        }
        
        // Update story chapter based on wallet readiness
        if (walletStatus.ready && walletStatus.syncing === false) {
            this.treasuryState.chapter = "Chapter II: The Realm Awakens";
            this.treasuryState.storyChapter = "The Great Synchronization Complete";
        } else {
            this.treasuryState.chapter = "Chapter I: The Great Convergence";
            this.treasuryState.storyChapter = "The Awakening";
        }
    }
    
    async getWalletStatus() {
        try {
            // Get fresh data from MCP server
            const status = await this.callMCPEndpoint('/wallet/status');
            const transactions = await this.callMCPEndpoint('/wallet/transactions');
            
            if (status) {
                // Update our state with real data
                this.treasuryState.balance = parseFloat(status.balances?.balance || 0);
                this.treasuryState.lastSync = new Date().toISOString();
                this.updateStoryContext(status);
                
                return {
                    success: true,
                    address: status.address || this.walletAddress,
                    network: this.isTestnet ? "Midnight TestNet" : "Midnight MainNet",
                    balance: this.treasuryState.balance,
                    currency: "DUST",
                    ready: status.ready,
                    syncing: status.syncing,
                    syncProgress: status.syncProgress,
                    transactionCount: transactions?.length || 0,
                    storyContext: {
                        character: "Oracle of the Midnight Realm",
                        chapter: this.treasuryState.storyChapter,
                        questsCompleted: this.treasuryState.questsCompleted,
                        threatLevel: this.treasuryState.realmThreatLevel,
                        magicalPower: this.treasuryState.magicalPower
                    },
                    lastSync: this.treasuryState.lastSync
                };
            }
        } catch (error) {
            console.error("Failed to get wallet status from MCP:", error.message);
            // Return fallback data
            return {
                success: false,
                address: this.walletAddress,
                network: this.isTestnet ? "Midnight TestNet" : "Midnight MainNet",
                balance: this.treasuryState.balance,
                currency: "DUST",
                ready: false,
                syncing: false,
                transactionCount: 0,
                storyContext: {
                    character: "Oracle of the Midnight Realm",
                    chapter: this.treasuryState.storyChapter,
                    questsCompleted: this.treasuryState.questsCompleted,
                    threatLevel: this.treasuryState.realmThreatLevel,
                    magicalPower: this.treasuryState.magicalPower
                },
                lastSync: this.treasuryState.lastSync,
                error: "MCP connection failed"
            };
        }
    }
    
    async executeStoryQuest(questType, amount, description) {
        console.log(`🎭 Executing ${questType} with ${amount} DUST...`);
        
        try {
            // Get fresh balance from MCP
            const status = await this.callMCPEndpoint('/wallet/status');
            const currentBalance = parseFloat(status?.balances?.balance || 0);
            
            if (amount > currentBalance) {
                return {
                    success: false,
                    error: "Insufficient magical energy in the treasury",
                    storyMessage: `The Oracle's power is not yet strong enough for this quest. Current energy: ${currentBalance} DUST, Required: ${amount} DUST`
                };
            }
            
            // For now, simulate quest execution (in future, could send real transactions)
            const questId = `quest_${Date.now()}`;
            this.treasuryState.balance = currentBalance; // Update with real balance
            this.treasuryState.questsCompleted += 1;
            
            // Update story state based on quest
            this.updateStoryProgression(questType, amount);
            
            return {
                success: true,
                questId: questId,
                questType: questType,
                amount: amount,
                description: description,
                storyMessage: this.generateQuestCompletionStory(questType, amount),
                newBalance: this.treasuryState.balance,
                storyContext: {
                    chapter: this.treasuryState.chapter,
                    questsCompleted: this.treasuryState.questsCompleted,
                    magicalPower: this.treasuryState.magicalPower,
                    threatLevel: this.treasuryState.realmThreatLevel
                }
            };
            
        } catch (error) {
            console.error("Quest execution failed:", error.message);
            return {
                success: false,
                error: "Quest execution failed",
                storyMessage: "The mystical energies are disrupted. The quest cannot be completed at this time.",
                details: error.message
            };
        }
    }
    
    updateStoryProgression(questType, amount) {
        // Update story progression based on quest type
        switch (questType) {
            case 'emergency_fund':
                this.treasuryState.storyChapter = "The Guardian's Shield Forged";
                break;
            case 'development_sprint':
                this.treasuryState.storyChapter = "The Forge of Innovation Burns Bright";
                break;
            case 'marketing_campaign':
                this.treasuryState.storyChapter = "The Herald's Call Echoes";
                break;
            case 'meme_coin_yolo':
                this.treasuryState.storyChapter = "The Jester's Gambit Unfolds";
                break;
            case 'security_audit':
                this.treasuryState.storyChapter = "The Sage's Examination Begins";
                break;
            case 'yield_farming':
                this.treasuryState.storyChapter = "The Harvest Ritual Commences";
                break;
            default:
                this.treasuryState.storyChapter = "A New Chapter Begins";
        }
    }
    
    generateQuestCompletionStory(questType, amount) {
        const stories = {
            'emergency_fund': `🛡️ The Guardian's Shield has been forged with ${amount} DUST! Ancient protective barriers now surround the sacred treasury, shimmering with starlight and shadow. The realm's defenses grow stronger against the coming storms.`,
            'development_sprint': `⚒️ The Forge of Innovation roars to life with ${amount} DUST! Master craftsmen work tirelessly in the volcanic heart of Mount Cryptographia, creating legendary tools that will reshape the very fabric of our digital realm.`,
            'marketing_campaign': `📯 The Herald's Call rings across ${amount} DUST worth of mystical energy! The trumpet's ethereal notes carry our message to distant lands, spreading the legend of the Midnight Guardians far and wide.`,
            'meme_coin_yolo': `🃏 The Jester's Gambit dances with ${amount} DUST in the Court of Chaos! Fortune and folly waltz together in this spectacular game of cosmic proportions. The outcome shall be legendary!`,
            'security_audit': `🔍 The Sage's Examination begins with ${amount} DUST of ancient wisdom! The all-seeing eyes of cryptographic knowledge scrutinize every magical ward and protection that guards our sacred treasury.`,
            'yield_farming': `🌾 The Harvest Ritual blesses ${amount} DUST under thirteen moons! Seeds of prosperity are planted in the fertile soils of liquidity pools, promising abundant returns as the cosmic seasons turn.`
        };
        
        return stories[questType] || `✨ A mystical quest has been completed with ${amount} DUST, advancing our epic saga through the Midnight Realm!`;
    }
    
    async enhanceProposalWithWalletData(proposal) {
        try {
            const walletStatus = await this.getWalletStatus();
            
            // Enhance proposal with real wallet context
            proposal.walletIntegration = {
                canExecute: walletStatus.balance >= proposal.fundingAmount,
                currentBalance: walletStatus.balance,
                storyContext: walletStatus.storyContext,
                executionPreview: this.previewQuestExecution(proposal.summary.title, proposal.fundingAmount)
            };
            
            // Update recommendation based on real balance
            proposal.recommendedAction = {
                action: walletStatus.balance >= proposal.fundingAmount ? "APPROVE" : "DEFER",
                message: walletStatus.balance >= proposal.fundingAmount 
                    ? "The Oracle's treasury has sufficient magical energy for this quest."
                    : `Insufficient magical energy. Current: ${walletStatus.balance} DUST, Required: ${proposal.fundingAmount} DUST`
            };
            
            return proposal;
        } catch (error) {
            console.error("Failed to enhance proposal with wallet data:", error.message);
            return proposal; // Return original proposal if enhancement fails
        }
    }
    
    previewQuestExecution(questTitle, amount) {
        return {
            questType: this.mapTitleToQuestType(questTitle),
            estimatedDuration: "Immediate",
            storyImpact: "Advances the epic saga of the Midnight Realm",
            realmBenefit: "Strengthens the Oracle's power and the treasury's magical defenses"
        };
    }
    
    mapTitleToQuestType(title) {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('emergency') || titleLower.includes('shield')) return 'emergency_fund';
        if (titleLower.includes('development') || titleLower.includes('forge')) return 'development_sprint';
        if (titleLower.includes('marketing') || titleLower.includes('herald')) return 'marketing_campaign';
        if (titleLower.includes('meme') || titleLower.includes('jester')) return 'meme_coin_yolo';
        if (titleLower.includes('security') || titleLower.includes('sage')) return 'security_audit';
        if (titleLower.includes('yield') || titleLower.includes('harvest')) return 'yield_farming';
        return 'general_quest';
    }
}

export default MidnightStoryIntegration;
