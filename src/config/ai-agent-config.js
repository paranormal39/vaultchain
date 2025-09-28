/**
 * AI Agent Configuration for VaultChain DAO
 * Integrates with Midnight MCP and Agent Communication systems
 */

import { DEPLOYED_CONTRACTS } from '../contracts/deployed-contracts.js';

export const AI_AGENT_CONFIG = {
  // Agent Identity
  agentId: 'vaultchain-treasury-oracle',
  name: 'Oracle of the Midnight Realm',
  version: '1.0.0',
  
  // Midnight MCP Configuration
  midnightMCP: {
    nodeVersion: '22.15.1',
    elizaVersion: '1.5.9',
    repository: 'git@github.com:DEGAorg/midnight-mcp.git',
    branch: 'workshop',
    setupCommands: [
      'yarn install',
      'yarn build', 
      'yarn setup-agent -a vaultchain-treasury-oracle',
      'cp .env.example .env'
    ]
  },
  
  // Agent Communication MCP
  communicationMCP: {
    repository: 'git@github.com:DEGAorg/agent-communication-mcp.git',
    supabaseRequired: true,
    encryption: {
      keyType: 'X25519',
      keyGeneration: 'yarn keys:generate',
      agentSetup: 'yarn setup:agent -a vaultchain-treasury-oracle'
    },
    authentication: {
      method: 'magic-link',
      setup: 'yarn auth:setup',
      emailRequired: true
    }
  },
  
  // Contract Integration
  contracts: {
    zkGuildGate: DEPLOYED_CONTRACTS.ZK_GUILD_GATE.address,
    daoToken: DEPLOYED_CONTRACTS.DAO_TOKEN_SIMPLE.address,
    daoTreasury: DEPLOYED_CONTRACTS.DAO_TREASURY_SIMPLE.address,
    daoGovernance: DEPLOYED_CONTRACTS.DAO_GOVERNANCE_SIMPLE.address
  },
  
  // Token Configuration for MCP
  tokens: {
    // Format: "NAME:SYMBOL:CONTRACT_ADDRESS"
    daoToken: `DAO_TOKEN:DVAULT:${DEPLOYED_CONTRACTS.DAO_TOKEN_SIMPLE.address}`,
    treasuryToken: `TREASURY:DTREAS:${DEPLOYED_CONTRACTS.DAO_TREASURY_SIMPLE.address}`,
    governanceToken: `GOVERNANCE:DGOV:${DEPLOYED_CONTRACTS.DAO_GOVERNANCE_SIMPLE.address}`
  },
  
  // Agent Capabilities
  capabilities: [
    'treasury_analysis',
    'proposal_generation',
    'risk_assessment', 
    'zk_privacy_operations',
    'autonomous_execution',
    'story_driven_responses',
    'real_contract_interaction'
  ],
  
  // Story-Driven Personality
  personality: {
    role: 'Oracle of the Midnight Realm',
    backstory: 'Ancient guardian of decentralized wisdom, channeling cosmic forces through ZK privacy',
    questArchetypes: [
      'The Guardian\'s Shield',
      'The Forge of Innovation', 
      'The Herald\'s Call',
      'The Jester\'s Gambit',
      'The Sage\'s Examination',
      'The Harvest Ritual',
      'The Cosmic Convergence'
    ],
    responseStyle: 'epic_fantasy_with_technical_precision'
  },
  
  // Execution Rules
  executionRules: {
    voteThreshold: 1, // 1-vote execution for testing
    autoExecute: true,
    requiresApproval: false, // For demo purposes
    maxProposalAmount: 500, // DUST
    cooldownPeriod: 30000 // 30 seconds between proposals
  },
  
  // Integration Endpoints
  endpoints: {
    onChainService: '/src/services/OnChainDAOService.js',
    contractRegistry: '/src/contracts/deployed-contracts.js',
    frontend: 'http://localhost:5173',
    mcpServer: 'http://localhost:3001' // When MCP is running
  },
  
  // Environment Variables Template
  envTemplate: {
    // Midnight MCP
    AGENT_ID: 'vaultchain-treasury-oracle',
    NODE_ENV: 'development',
    
    // Agent Communication
    MCP_AUTH_EMAIL: 'your.email@example.com',
    AGENT_PUBLIC_KEY: 'generated_x25519_public_key',
    AGENT_PRIVATE_KEY: 'generated_x25519_private_key',
    
    // Supabase (for agent communication)
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your_supabase_anon_key',
    
    // OpenAI (for ElizaOS)
    OPENAI_API_KEY: 'your_openai_api_key',
    
    // Contract Addresses
    ZK_GUILD_GATE_ADDRESS: DEPLOYED_CONTRACTS.ZK_GUILD_GATE.address,
    DAO_TOKEN_ADDRESS: DEPLOYED_CONTRACTS.DAO_TOKEN_SIMPLE.address,
    DAO_TREASURY_ADDRESS: DEPLOYED_CONTRACTS.DAO_TREASURY_SIMPLE.address,
    DAO_GOVERNANCE_ADDRESS: DEPLOYED_CONTRACTS.DAO_GOVERNANCE_SIMPLE.address
  }
};

// Setup Instructions
export const SETUP_INSTRUCTIONS = {
  step1: {
    title: "🔧 Install Prerequisites",
    commands: [
      "nvm use 22.15.1",
      "npm install -g yarn@4.1.0",
      "bun install -g @elizaos/cli@1.5.9"
    ]
  },
  
  step2: {
    title: "📦 Clone Repositories", 
    commands: [
      "git clone git@github.com:DEGAorg/midnight-mcp.git",
      "cd midnight-mcp && git checkout workshop",
      "git clone git@github.com:DEGAorg/agent-communication-mcp.git",
      "git clone git@github.com:DEGAorg/Eliza-Base-Agent.git"
    ]
  },
  
  step3: {
    title: "🤖 Setup AI Agent",
    commands: [
      "cd midnight-mcp && yarn install && yarn build",
      "yarn setup-agent -a vaultchain-treasury-oracle",
      "cd ../agent-communication-mcp && yarn install",
      "yarn setup:agent -a vaultchain-treasury-oracle",
      "yarn keys:generate"
    ]
  },
  
  step4: {
    title: "🔗 Configure Integration",
    description: "Update .env files with contract addresses and API keys",
    files: [
      "midnight-mcp/.env",
      "agent-communication-mcp/.env", 
      "Eliza-Base-Agent/.env"
    ]
  },
  
  step5: {
    title: "🚀 Launch AI Agent",
    commands: [
      "cd midnight-mcp && yarn dev",
      "cd ../Eliza-Base-Agent && elizaos start"
    ]
  }
};

export default AI_AGENT_CONFIG;
