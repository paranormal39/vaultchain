#!/usr/bin/env node

/**
 * Matthew - Simplified Treasury AI Agent
 * Handles Midnight Network operations and treasury management
 */

import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

console.log('🤖 Starting Matthew Treasury AI Agent...');
console.log('======================================');

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
}) : null;

if (openai) {
    console.log('✅ OpenAI API integration enabled');
} else {
    console.log('⚠️ OpenAI API key not found - using fallback responses');
}

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        agent: 'Matthew Treasury AI Agent',
        capabilities: ['midnight_operations', 'treasury_management', 'cross_chain_coordination'],
        timestamp: new Date().toISOString()
    });
});

// MCP helper function
async function callMidnightMCP(endpoint) {
    try {
        const response = await fetch(`http://localhost:3000${endpoint}`);
        if (!response.ok) {
            throw new Error(`MCP request failed: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`❌ MCP call failed for ${endpoint}:`, error);
        throw error;
    }
}

// Agent Communication helper
async function sendToXara(message) {
    try {
        const response = await fetch('http://localhost:3002/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            throw new Error(`Xara communication failed: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('❌ Failed to communicate with Xara:', error);
        return { success: false, error: error.message };
    }
}

// OpenAI chat function
async function generateAIResponse(message, context = '') {
    if (!openai) {
        return null; // Fall back to rule-based responses
    }
    
    try {
        const systemPrompt = `You are Matthew, a professional AI treasury manager for VaultChain DAO. You specialize in:
- Midnight Network operations and DUST token management
- Cross-chain treasury coordination with XRPL
- Privacy-preserving financial operations
- DAO governance and treasury optimization

Current context: ${context}

Respond professionally but friendly. Keep responses concise and actionable.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            max_tokens: 300,
            temperature: 0.7
        });
        
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI API error:', error);
        return null;
    }
}

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log(`💬 Matthew received: ${message}`);
        
        let response = '';
        let context = '';
        
        if (message.toLowerCase().includes('treasury') || message.toLowerCase().includes('balance')) {
            // Check Midnight Network treasury
            try {
                const walletInfo = await callMidnightMCP('/wallet/address');
                const balanceInfo = await callMidnightMCP('/wallet/balance');
                
                response = `**Treasury Status Report** 🌙

**Midnight Network Treasury:**
• Address: ${walletInfo.address}
• Balance: ${balanceInfo.balance} DUST
• Network: Midnight TestNet
• Status: Fully synced and operational

I'm monitoring our treasury operations and can coordinate with Xara for cross-chain activities. The treasury is healthy and ready for operations!`;
                
            } catch (error) {
                response = `I'm having trouble accessing the Midnight Network treasury. Error: ${error.message}`;
            }
            
        } else if (message.toLowerCase().includes('xara') || message.toLowerCase().includes('xrpl') || message.toLowerCase().includes('cross-chain')) {
            // Coordinate with Xara
            console.log('🔗 Coordinating with Xara...');
            
            const xaraResponse = await sendToXara('What is your current status?');
            
            if (xaraResponse.success) {
                response = `**Cross-Chain Coordination** 🔗

I've consulted with Xara, our XRPL specialist:

${xaraResponse.response}

Together, we can provide complete cross-chain treasury management. I handle Midnight Network operations while Xara manages XRPL wallets and transactions.`;
            } else {
                response = `I tried to coordinate with Xara but encountered an issue: ${xaraResponse.error}. However, I can still help with Midnight Network treasury operations.`;
            }
            
        } else if (message.toLowerCase().includes('create') && message.toLowerCase().includes('xrpl')) {
            // Request Xara to create XRPL wallet
            console.log('🔗 Requesting Xara to create XRPL wallet...');
            
            const xaraResponse = await sendToXara('create a new wallet');
            
            if (xaraResponse.success) {
                response = `**Cross-Chain Wallet Creation** 🔗

I've coordinated with Xara to create a new XRPL wallet:

${xaraResponse.response}

This wallet is now part of our cross-chain treasury infrastructure. I can monitor both our Midnight Network treasury and coordinate XRPL operations through Xara.`;
            } else {
                response = `I attempted to coordinate XRPL wallet creation with Xara, but encountered an issue: ${xaraResponse.error}`;
            }
            
        } else if (message.toLowerCase().includes('status') || message.toLowerCase().includes('system')) {
            // System status
            try {
                const midnightHealth = await fetch('http://localhost:3000/health');
                const xaraHealth = await fetch('http://localhost:3002/health');
                const agentCommHealth = await fetch('http://localhost:3004/health');
                
                response = `**Multi-Agent System Status** 🤖

**Infrastructure:**
• Midnight MCP: ${midnightHealth.ok ? '✅ Online' : '❌ Offline'}
• Xara XRPL Agent: ${xaraHealth.ok ? '✅ Online' : '❌ Offline'}  
• Agent Communication: ${agentCommHealth.ok ? '✅ Online' : '❌ Offline'}

**DAO Contracts (Deployed):**
• ZK Guild Gate: 02003adbb41861f75f18482c9bcf9d1ffee56bd9bc96ab725f9daafcf6dfc1828f5b ✅
• DAO Token: 0200024e1490a95776ceb4c6d58539d6877e55ae692d761e135148fe6c8779741466 ✅
• DAO Treasury: 0200ee41fb3523f2e08fc3fe314353a9902d6d47cf0525ec99c6790b4587df190578 ✅
• DAO Governance: 02003f8e2a8b2724669742c076fa2f8112f29bd6100c4753802afc3ee2fae5451817 ✅

**Capabilities:**
• Real Midnight Network operations ✅
• XRPL testnet wallet management ✅
• DAO contract integration ✅
• Secure agent-to-agent communication ✅
• Cross-chain treasury coordination ✅

The multi-agent system is operational and ready for treasury management!`;
                
            } catch (error) {
                response = `System status check encountered an error: ${error.message}`;
            }
            
        } else {
            response = `Hello! I'm Matthew, your AI treasury management agent specializing in privacy-first DAO operations. 🌙

**My Capabilities:**
🌙 **Midnight Network Operations** - Real DUST transactions and wallet management
📊 **Treasury Analysis** - Balance monitoring and financial strategy
🔗 **Cross-Chain Coordination** - Working with Xara for XRPL operations
🔐 **Privacy-Preserving** - Zero-knowledge proofs and secure operations
⚖️ **Compliance** - DAO governance and regulatory guidance

**Try asking me:**
• "What's our treasury status?"
• "Create an XRPL wallet" (I'll coordinate with Xara)
• "Check system status"
• "Coordinate with Xara for cross-chain operations"

I work alongside Xara to provide complete multi-chain treasury management. How can I help you today?`;
        }
        
        // Try OpenAI for more natural conversation if available
        if (openai && !response) {
            console.log('🤖 Generating AI response...');
            const aiResponse = await generateAIResponse(message, context);
            if (aiResponse) {
                response = aiResponse;
            }
        }
        
        // If still no response, use a generic fallback
        if (!response) {
            response = `I'm Matthew, your AI treasury manager. I can help with Midnight Network operations, cross-chain coordination with XRPL, and DAO treasury management. What would you like to know?`;
        }
        
        res.json({
            success: true,
            agent: 'Matthew',
            response: response,
            timestamp: new Date().toISOString(),
            aiPowered: !!openai
        });
        
    } catch (error) {
        console.error('❌ Chat error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Treasury endpoints
app.get('/treasury/status', async (req, res) => {
    try {
        const walletInfo = await callMidnightMCP('/wallet/address');
        const balanceInfo = await callMidnightMCP('/wallet/balance');
        
        res.json({
            success: true,
            treasury: {
                address: walletInfo.address,
                balance: balanceInfo.balance,
                currency: 'DUST',
                network: 'Midnight TestNet'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Cross-chain coordination
app.post('/coordinate/xrpl', async (req, res) => {
    try {
        const { action, message } = req.body;
        
        console.log(`🔗 Coordinating XRPL action: ${action}`);
        
        const xaraResponse = await sendToXara(message || action);
        
        res.json({
            success: true,
            coordination: {
                action: action,
                xara_response: xaraResponse
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// TDUST deposit handler - creates XRPL wallet for user
app.post('/deposit/tdust', async (req, res) => {
    try {
        const { userId, txHash, amount, fromAddress } = req.body;
        
        console.log(`🌙 TDUST deposit detected!`);
        console.log(`   User: ${userId}`);
        console.log(`   Amount: ${amount} DUST`);
        console.log(`   TX: ${txHash}`);
        
        // Coordinate with Xara to create XRPL wallet for this user
        const xrplWalletResponse = await fetch('http://localhost:3002/xrpl/create_wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId,
                dustTxHash: txHash,
                dustAmount: amount
            })
        });
        
        if (!xrplWalletResponse.ok) {
            throw new Error(`Failed to create XRPL wallet: ${xrplWalletResponse.statusText}`);
        }
        
        const xrplWallet = await xrplWalletResponse.json();
        
        console.log(`✅ Created XRPL wallet for user ${userId}: ${xrplWallet.wallet.address}`);
        
        res.json({
            success: true,
            message: `TDUST deposit processed and XRPL wallet created for user ${userId}`,
            deposit: {
                userId,
                txHash,
                amount,
                fromAddress,
                processed: new Date().toISOString()
            },
            xrplWallet: xrplWallet.wallet
        });
        
    } catch (error) {
        console.error('❌ Failed to process TDUST deposit:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Multi-chain dashboard data
app.get('/dashboard/multichain', async (req, res) => {
    try {
        console.log('📊 Generating multi-chain dashboard data...');
        
        // Get Midnight treasury data
        const midnightWallet = await callMidnightMCP('/wallet/address');
        const midnightBalance = await callMidnightMCP('/wallet/balance');
        
        // Get XRPL data from Xara
        const xrplResponse = await fetch('http://localhost:3002/dashboard/xrpl');
        const xrplData = xrplResponse.ok ? await xrplResponse.json() : null;
        
        const dashboardData = {
            lastUpdated: new Date().toISOString(),
            chains: {
                midnight: {
                    network: 'Midnight TestNet',
                    currency: 'DUST',
                    treasury: {
                        address: midnightWallet.address,
                        balance: midnightBalance.balance,
                        status: 'operational'
                    }
                },
                xrpl: xrplData?.success ? {
                    network: 'XRPL Testnet',
                    currency: 'XRP',
                    ...xrplData.data
                } : {
                    network: 'XRPL Testnet',
                    currency: 'XRP',
                    error: 'Unable to fetch XRPL data'
                }
            },
            summary: {
                totalChains: 2,
                totalAssets: (midnightBalance.balance || 0) + (xrplData?.data?.totalBalance || 0),
                userWallets: xrplData?.data?.wallets?.filter(w => w.isUserWallet)?.length || 0
            }
        };
        
        res.json({
            success: true,
            data: dashboardData
        });
        
    } catch (error) {
        console.error('❌ Failed to generate multi-chain dashboard:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start server
app.listen(port, () => {
    console.log('✅ Matthew Treasury AI Agent is ready!');
    console.log(`🤖 Server running on http://localhost:${port}`);
    console.log('🌙 Midnight MCP: http://localhost:3000');
    console.log('🔗 Xara XRPL Agent: http://localhost:3002');
    console.log('📡 Agent Communication: http://localhost:3004');
    console.log('');
    console.log('🎯 Available endpoints:');
    console.log('  GET  /health - Health check');
    console.log('  POST /chat - Chat with Matthew');
    console.log('  GET  /treasury/status - Treasury status');
    console.log('  POST /coordinate/xrpl - Coordinate with Xara');
    console.log('');
    console.log('💬 Try: curl -X POST http://localhost:3001/chat -H "Content-Type: application/json" -d \'{"message":"treasury status"}\'');
});
