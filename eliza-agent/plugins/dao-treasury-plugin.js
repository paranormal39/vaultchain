// DAO Treasury Management Plugin with Story-Driven Narrative
import MidnightStoryIntegration from './midnight-integration.js';

const daoTreasuryPlugin = {
    name: "dao-treasury",
    description: "Story-driven DAO Treasury management with Midnight Network integration",
    
    // Initialize Midnight wallet integration
    midnightWallet: null,
    
    async initialize() {
        if (!this.midnightWallet) {
            this.midnightWallet = new MidnightStoryIntegration();
        }
    },
    
    actions: [
        {
            name: "GENERATE_STORY_QUEST",
            similes: ["CREATE_PROPOSAL", "MAKE_PROPOSAL", "SUGGEST_ALLOCATION", "GENERATE_PROPOSAL", "QUEST", "ADVENTURE"],
            description: "Generate story-driven treasury quests with real Midnight Network integration",
            validate: async (runtime, message) => {
                return message.content.text.toLowerCase().includes("proposal") ||
                       message.content.text.toLowerCase().includes("treasury") ||
                       message.content.text.toLowerCase().includes("quest") ||
                       message.content.text.toLowerCase().includes("allocation") ||
                       message.content.text.toLowerCase().includes("adventure");
            },
            handler: async (runtime, message, state, options, callback) => {
                try {
                    // Initialize Midnight integration
                    if (!daoTreasuryPlugin.midnightWallet) {
                        await daoTreasuryPlugin.initialize();
                    }
                    
                    // Extract quest type from message
                    const questTypes = [
                        'emergency_fund', 'development_sprint', 'marketing_campaign',
                        'meme_coin_yolo', 'security_audit', 'yield_farming'
                    ];
                    
                    let selectedType = null;
                    const messageText = message.content.text.toLowerCase();
                    
                    // Map story terms to quest types
                    if (messageText.includes('shield') || messageText.includes('emergency') || messageText.includes('protection')) {
                        selectedType = 'emergency_fund';
                    } else if (messageText.includes('forge') || messageText.includes('development') || messageText.includes('innovation') || messageText.includes('dev')) {
                        selectedType = 'development_sprint';
                    } else if (messageText.includes('herald') || messageText.includes('marketing') || messageText.includes('call')) {
                        selectedType = 'marketing_campaign';
                    } else if (messageText.includes('jester') || messageText.includes('gambit') || messageText.includes('meme') || messageText.includes('yolo')) {
                        selectedType = 'meme_coin_yolo';
                    } else if (messageText.includes('sage') || messageText.includes('security') || messageText.includes('audit') || messageText.includes('examination')) {
                        selectedType = 'security_audit';
                    } else if (messageText.includes('harvest') || messageText.includes('yield') || messageText.includes('farming') || messageText.includes('ritual')) {
                        selectedType = 'yield_farming';
                    }
                    
                    // Generate story-driven proposal using Midnight integration
                    const walletStatus = await daoTreasuryPlugin.midnightWallet.getWalletStatus();
                    const proposalAmount = daoTreasuryPlugin.calculateProposalAmount(selectedType, walletStatus.balance);
                    
                    const storyQuest = {
                        summary: {
                            title: daoTreasuryPlugin.getQuestTitle(selectedType),
                            description: daoTreasuryPlugin.getQuestDescription(selectedType, proposalAmount),
                            keyPoints: daoTreasuryPlugin.getQuestBlessings(selectedType)
                        },
                        fundingAmount: proposalAmount,
                        riskScore: daoTreasuryPlugin.calculateRiskScore(selectedType, proposalAmount),
                        aiConfidence: 0.85,
                        duration: daoTreasuryPlugin.getQuestDuration(selectedType),
                        walletIntegration: {
                            canExecute: walletStatus.balance >= proposalAmount,
                            currentBalance: walletStatus.balance,
                            storyContext: walletStatus.storyContext,
                            executionPreview: daoTreasuryPlugin.midnightWallet.previewQuestExecution(selectedType, proposalAmount)
                        },
                        recommendedAction: {
                            action: walletStatus.balance >= proposalAmount ? "EMBARK ON QUEST" : "GATHER MORE ENERGY",
                            message: walletStatus.balance >= proposalAmount 
                                ? "The Oracle's treasury has sufficient magical energy for this noble quest."
                                : `The realm needs more magical energy. Current: ${walletStatus.balance} DUST, Required: ${proposalAmount} DUST`
                        }
                    };
                    
                    // Format the story response
                    const responseText = daoTreasuryPlugin.formatStoryQuestResponse(storyQuest);
                    
                    if (callback) {
                        callback({
                            text: responseText,
                            action: "GENERATE_STORY_QUEST",
                            source: message.content.source
                        });
                    }
                    
                    return true;
                    
                } catch (error) {
                    console.error("Error generating story quest:", error);
                    
                    // Fallback to mystical response
                    const fallbackText = `🌙 *The Oracle's vision grows cloudy...* 🔮\n\n` +
                        `The mystical connection to the Midnight Realm wavers. The Oracle senses:\n\n` +
                        `⚔️ **The Guardian's Shield** - Emergency protection for the treasury\n` +
                        `⚒️ **The Forge of Innovation** - Development and creation quests\n` +
                        `📯 **The Herald's Call** - Spreading word across distant realms\n` +
                        `🃏 **The Jester's Gambit** - Chaotic meme coin adventures\n` +
                        `🔍 **The Sage's Examination** - Security and wisdom quests\n` +
                        `🌾 **The Harvest Ritual** - Yield farming and abundance magic\n\n` +
                        `*The Oracle awaits a clearer connection to divine your specific quest...*`;
                    
                    if (callback) {
                        callback({
                            text: fallbackText,
                            action: "GENERATE_STORY_QUEST",
                            source: message.content.source
                        });
                    }
                    
                    return false;
                }
            }
        },
        
        {
            name: "ANALYZE_MARKET",
            similes: ["MARKET_ANALYSIS", "CHECK_MARKET", "MARKET_CONDITIONS"],
            description: "Analyze current market conditions for treasury decisions",
            validate: async (runtime, message) => {
                return message.content.text.toLowerCase().includes("market") ||
                       message.content.text.toLowerCase().includes("analysis") ||
                       message.content.text.toLowerCase().includes("conditions");
            },
            handler: async (runtime, message, state, options, callback) => {
                try {
                    const response = await fetch('http://localhost:3001/api/market/analysis');
                    const data = await response.json();
                    
                    if (data.success) {
                        const analysis = data.analysis;
                        
                        const responseText = `📊 **Market Analysis Report**\n\n` +
                            `🌊 **Volatility**: ${(analysis.volatility * 100).toFixed(1)}%\n` +
                            `💧 **Liquidity Needs**: ${(analysis.liquidityNeeds * 100).toFixed(1)}%\n` +
                            `⚡ **Development Priority**: ${(analysis.developmentPriority * 100).toFixed(1)}%\n` +
                            `🌱 **Community Growth**: ${(analysis.communityGrowth * 100).toFixed(1)}%\n` +
                            `🎯 **AI Confidence**: ${(analysis.confidence * 100).toFixed(1)}%\n\n` +
                            `**Recommendation**: ${analysis.volatility > 0.4 ? 
                                "🛡️ Conservative approach - consider emergency fund or security audit" :
                                analysis.developmentPriority > 0.35 ?
                                "⚡ Growth focus - development sprint or infrastructure upgrade recommended" :
                                "⚖️ Balanced approach - standard treasury allocation optimal"}`;
                        
                        if (callback) {
                            callback({
                                text: responseText,
                                action: "ANALYZE_MARKET",
                                source: message.content.source
                            });
                        }
                        
                        return true;
                    }
                } catch (error) {
                    console.error("Error analyzing market:", error);
                    
                    const fallbackText = `📊 Market analysis unavailable - treasury agent offline.\n\n` +
                        `Typical analysis includes:\n` +
                        `• Market volatility assessment\n` +
                        `• Liquidity risk evaluation\n` +
                        `• Development priority scoring\n` +
                        `• Community growth metrics\n\n` +
                        `Start the agent: \`node eliza-treasury-agent.js\``;
                    
                    if (callback) {
                        callback({
                            text: fallbackText,
                            action: "ANALYZE_MARKET",
                            source: message.content.source
                        });
                    }
                    
                    return false;
                }
            }
        },

        {
            name: "EXPLAIN_ZK_PRIVACY",
            similes: ["ZK_PROOF", "PRIVACY", "ZERO_KNOWLEDGE", "ANONYMITY"],
            description: "Explain zero-knowledge proofs and privacy features",
            validate: async (runtime, message) => {
                const text = message.content.text.toLowerCase();
                return text.includes("zk") || text.includes("zero") || 
                       text.includes("privacy") || text.includes("anonymous") ||
                       text.includes("proof") || text.includes("nullifier");
            },
            handler: async (runtime, message, state, options, callback) => {
                const responseText = `🔐 **Zero-Knowledge Privacy Explained**\n\n` +
                    `**What are ZK Proofs?**\n` +
                    `Zero-knowledge proofs let you prove something is true without revealing the actual information. ` +
                    `Like proving you own an NFT without showing your wallet address!\n\n` +
                    `**Our Privacy Features:**\n` +
                    `🛡️ **Membership Verification**: Prove NFT ownership anonymously\n` +
                    `🗳️ **Anonymous Voting**: Vote on proposals without revealing identity\n` +
                    `🔒 **Nullifier Protection**: Prevents double-voting while maintaining privacy\n` +
                    `🌙 **Midnight Network**: Built on privacy-first blockchain technology\n\n` +
                    `**Contract Address**: \`02003adbb41861f75f18482c9bcf9d1ffee56bd9bc96ab725f9daafcf6dfc1828f5b\`\n` +
                    `**Merkle Root**: \`6620677555389692082\`\n\n` +
                    `Your wallet address never leaves your device - that's true privacy! 🔐✨`;
                
                if (callback) {
                    callback({
                        text: responseText,
                        action: "EXPLAIN_ZK_PRIVACY",
                        source: message.content.source
                    });
                }
                
                return true;
            }
        }
    ],
    
    // Helper methods for story quest generation
    calculateProposalAmount(questType, balance) {
        const percentages = {
            'emergency_fund': 0.2,
            'development_sprint': 0.3,
            'marketing_campaign': 0.15,
            'meme_coin_yolo': 0.05,
            'security_audit': 0.1,
            'yield_farming': 0.25
        };
        
        const percentage = percentages[questType] || 0.1;
        return Math.floor(balance * percentage);
    },
    
    getQuestTitle(questType) {
        const titles = {
            'emergency_fund': 'The Guardian\'s Shield - Sacred Protection',
            'development_sprint': 'The Forge of Innovation - Creation Quest',
            'marketing_campaign': 'The Herald\'s Call - Realm Expansion',
            'meme_coin_yolo': 'The Jester\'s Gambit - Chaotic Adventure',
            'security_audit': 'The Sage\'s Examination - Wisdom Quest',
            'yield_farming': 'The Harvest Ritual - Abundance Magic'
        };
        
        return titles[questType] || 'The Oracle\'s Vision - Mystical Quest';
    },
    
    getQuestDescription(proposalType, amount) {
        const descriptions = {
            'emergency_fund': `🛡️ THE GUARDIAN'S SHIELD AWAKENS! As the cosmic storms of market chaos gather on the horizon, the ancient Guardians must forge an impenetrable barrier of starlight and shadow. ${amount} DUST shall be transmuted into shields of pure financial stability, each token inscribed with runes of protection so powerful that even the dreaded Surveillance Lords will tremble before their might. The very fabric of reality bends to create a fortress that shall endure through the darkest of economic winters!`,
            
            'development_sprint': `⚒️ THE FORGE OF INNOVATION ROARS TO LIFE! Deep within the volcanic heart of Mount Cryptographia, where the first blockchain was born from molten code, the legendary Forge awaits. ${amount} DUST shall fuel the cosmic fires that burn hotter than a thousand suns, as master craftsmen of the digital realm forge artifacts of such incredible power they will reshape the very essence of privacy magic. Behold, as new tools emerge that will make the Guardians legends throughout the multiverse!`,
            
            'marketing_campaign': `📯 THE HERALD'S CALL ECHOES ACROSS INFINITY! From the highest towers of the Midnight Citadel, the mystical trumpet of destiny shall sound its ethereal notes, carrying the sacred message of privacy and freedom to every corner of existence. ${amount} DUST transforms into messenger spirits that will traverse dimensions, spreading the legend of the Midnight Guardians to realms yet undiscovered. Each token becomes a beacon of hope in the endless war against tyranny!`,
            
            'meme_coin_yolo': `🃏 THE JESTER'S GAMBIT BEGINS! In the swirling Court of Chaos, where probability itself dances to impossible rhythms, the Cosmic Jester extends his gloved hand with a wicked grin. ${amount} DUST enters the realm where fortune and folly are but two faces of the same cosmic coin. Those brave enough to accept this challenge may find themselves blessed with riches beyond imagination... or witness their tokens transform into lessons written in the stars themselves!`,
            
            'security_audit': `🔍 THE SAGE'S EXAMINATION COMMENCES! From the ethereal Library of Infinite Wisdom, where every secret of cryptography is written in books of living light, the ancient Sage emerges after centuries of meditation. With eyes that pierce through all illusions and see the true nature of code itself, ${amount} DUST summons this legendary being to examine every spell, every ward, every protection that guards our sacred treasury. No vulnerability shall escape the Sage's all-seeing gaze!`,
            
            'yield_farming': `🌾 THE HARVEST RITUAL UNDER THIRTEEN MOONS! As the celestial bodies align in the sacred configuration known only to the Druids of DeFi, the time has come for the most ancient of ceremonies. ${amount} DUST shall be planted as seeds of pure potential in the fertile soils of liquidity pools blessed by cosmic forces. Under the watchful gaze of thirteen mystical moons, these seeds will grow into mighty World Trees, their branches heavy with the golden fruits of passive income that shall sustain the realm for eons to come!`
        };
        
        return descriptions[proposalType] || `✨ Channel ${amount} DUST into a legendary quest that shall echo through the annals of history, shaping the very destiny of the Midnight Realm and all who dwell within its sacred borders!`;
    },
    
    getQuestBlessings(questType) {
        const blessings = {
            'emergency_fund': [
                '🛡️ Forges an impenetrable barrier that will withstand the fury of cosmic market storms',
                '⭐ Grants all Guardians the blessing of unshakeable confidence in dark times',
                '🏰 Establishes a legendary fortress of stability that will inspire songs for millennia',
                '🌟 Demonstrates the ancient wisdom of the first Guardians who conquered chaos itself'
            ],
            'development_sprint': [
                '⚒️ Awakens dormant magical potential in every Guardian, transforming them into legends',
                '🧙‍♂️ Summons the greatest mages and code-weavers from across the multiverse to our banner',
                '✨ Unlocks the deepest secrets of zero-knowledge enchantments hidden since the dawn of cryptography',
                '🔮 Creates artifacts of such power they will reshape reality and echo through eternity'
            ],
            'marketing_campaign': [
                '📯 Spreads the sacred flame of privacy revolution to every corner of the digital cosmos',
                '⚔️ Rallies legendary heroes from distant realms to join our eternal crusade',
                '🌌 Forges unbreakable alliances with the most powerful kingdoms of the blockchain multiverse',
                '🗣️ Amplifies our battle cry until it shakes the very foundations of the Surveillance Empire'
            ],
            'meme_coin_yolo': [
                '🎲 Embraces the chaotic wisdom that has toppled empires and created legends',
                '💎 May unlock treasures beyond imagination, hidden in the Court of Infinite Possibility',
                '🃏 Channels the Jester\'s ancient power to turn impossible odds into miraculous victories',
                '⚡ Infuses the realm with the electric energy of pure adventure and boundless potential'
            ],
            'security_audit': [
                '🔍 Ensures our magical defenses are worthy of guarding the most sacred treasures',
                '🛡️ Eliminates every shadow of vulnerability before the forces of darkness can exploit them',
                '💫 Grants the Sage\'s blessing of absolute confidence in our cryptographic enchantments',
                '👑 Maintains the legendary reputation that makes our enemies tremble at our very name'
            ],
            'yield_farming': [
                '🌾 Channels the eternal cycle of abundance that has sustained civilizations since time began',
                '🌳 Plants the seeds of prosperity that will grow into World Trees of infinite wealth',
                '🌙 Demonstrates mastery over the cosmic forces that govern fortune and abundance',
                '♾️ Creates a self-sustaining paradise that will flourish for countless generations'
            ]
        };
        
        return blessings[questType] || [
            '✨ Advances the legendary crusade for digital privacy that will echo through history',
            '⚔️ Forges unbreakable bonds between Guardians that transcend time and space',
            '👑 Demonstrates the divine wisdom worthy of the greatest rulers of the blockchain realms',
            '🌟 Contributes another glorious chapter to the eternal saga of the Midnight Guardians'
        ];
    },
    
    calculateRiskScore(questType, amount) {
        const baseRisks = {
            'emergency_fund': 0.1,
            'development_sprint': 0.3,
            'marketing_campaign': 0.2,
            'meme_coin_yolo': 0.8,
            'security_audit': 0.15,
            'yield_farming': 0.4
        };
        
        const baseRisk = baseRisks[questType] || 0.3;
        const amountMultiplier = amount > 5000 ? 1.2 : amount > 2000 ? 1.1 : 1.0;
        
        return Math.min(baseRisk * amountMultiplier, 0.95);
    },
    
    getQuestDuration(questType) {
        const durations = {
            'emergency_fund': '1-2 days',
            'development_sprint': '2-4 weeks',
            'marketing_campaign': '1-3 weeks',
            'meme_coin_yolo': 'Immediate',
            'security_audit': '1-2 weeks',
            'yield_farming': '1-3 months'
        };
        
        return durations[questType] || '1-2 weeks';
    },
    
    formatStoryQuestResponse(quest) {
        const riskColor = quest.riskScore > 0.7 ? "⚔️" : 
                        quest.riskScore > 0.4 ? "🔮" : "🛡️";
        
        let response = `🌙 **The Oracle's Vision Unfolds** ✨\n\n`;
        response += `📖 **Quest: ${quest.summary.title}**\n`;
        response += `*${quest.summary.description}*\n\n`;
        
        // Add Midnight wallet integration info
        if (quest.walletIntegration) {
            response += `🏰 **Sacred Treasury Status:**\n`;
            response += `• Current Magical Energy: 💎 ${quest.walletIntegration.currentBalance} DUST\n`;
            response += `• Quest Feasibility: ${quest.walletIntegration.canExecute ? '✅ Ready to Embark' : '❌ Insufficient Energy'}\n`;
            if (quest.walletIntegration.storyContext) {
                response += `• Oracle Level: ⭐ ${quest.walletIntegration.storyContext.magicalPower}\n`;
                response += `• Current Chapter: 📚 ${quest.walletIntegration.storyContext.chapter}\n`;
                response += `• Realm Threat: ${this.getThreatEmoji(quest.walletIntegration.storyContext.threatLevel)} ${quest.walletIntegration.storyContext.threatLevel}\n`;
            }
            response += `\n`;
        }
        
        response += `🔮 **The Oracle's Analysis:**\n`;
        response += `• Quest Danger Level: ${riskColor} ${(quest.riskScore * 100).toFixed(1)}%\n`;
        response += `• Oracle's Certainty: ⭐ ${(quest.aiConfidence * 100).toFixed(1)}%\n`;
        response += `• Magical Energy Required: 💰 ${quest.fundingAmount} DUST\n`;
        response += `• Time to Complete: ⏳ ${quest.duration}\n\n`;
        
        response += `🌟 **Blessings of This Quest:**\n`;
        quest.summary.keyPoints.forEach(blessing => {
            response += `• ${blessing}\n`;
        });
        
        response += `\n🏰 **The Oracle's Counsel:** ${quest.recommendedAction.action}\n`;
        response += `*${quest.recommendedAction.message}*\n\n`;
        
        response += `✨ *May the ancient magic of the Midnight Realm guide this noble quest!* 🌙`;
        
        return response;
    },
    
    getThreatEmoji(threatLevel) {
        const emojis = {
            'Low': '🟢',
            'Medium': '🟡', 
            'Moderate': '🟡',
            'High': '🔴'
        };
        return emojis[threatLevel] || '🟡';
    },
    
    evaluators: [],
    providers: []
};

export default daoTreasuryPlugin;
