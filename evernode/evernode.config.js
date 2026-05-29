/**
 * @file evernode.config.js
 * @description Evernode deployment configuration for VaultChain DAO
 *
 * Evernode is an XRP Ledger-based decentralised cloud platform. Smart
 * contracts ("HotPocket instances") are rented from hosts via XAH micropayments.
 *
 * VaultChain deploys three separate HotPocket instances:
 *  1. mcp-server   — Midnight MCP wallet/contract server  (port 3000)
 *  2. eliza-agent  — Matthew/Xara/Ada AI agent cluster    (port 3001)
 *  3. frontend     — Vite-built static SPA served by express (port 5173)
 *
 * Each instance specification below maps directly to the fields accepted by
 * the Evernode CLI `evernode deploy` / `evernode acquire` commands.
 *
 * References:
 *  https://docs.evernode.org/en/latest/sdk/evernode-js-client/
 *  https://docs.evernode.org/en/latest/hotpocket/
 */

export const EVERNODE_CONFIG = {
  // ── Tenant / billing ────────────────────────────────────────────────────────
  tenant: {
    xrplAddress: process.env.EVERNODE_TENANT_ADDRESS || '',
    xrplSecret:  process.env.EVERNODE_TENANT_SECRET  || '',
    network:     process.env.XAHAU_NETWORK            || 'testnet',
  },

  // ── HotPocket cluster defaults ───────────────────────────────────────────────
  clusterDefaults: {
    contractId:    'vaultchain-dao',
    version:       '1.0.0',
    unl:           [],           // Populated at deploy time from discovered hosts
    roundTime:     2000,         // ms per consensus round
    stageTimeout:  60000,        // ms before a stage is considered failed
    maxInputLedgerOffset: 10,
    environment: {
      NODE_ENV:           'production',
      VITE_MCP_URL:       process.env.VITE_MCP_URL       || 'http://localhost:3000',
      VITE_MATTHEW_URL:   process.env.VITE_MATTHEW_URL   || 'http://localhost:3001',
      VITE_XAHAU_SERVER:  process.env.VITE_XAHAU_SERVER  || 'wss://xahau.network/',
      VITE_XAHAU_NETWORK: process.env.VITE_XAHAU_NETWORK || 'mainnet',
    }
  },

  // ── Instance definitions ─────────────────────────────────────────────────────
  instances: [
    {
      id:          'mcp-server',
      label:       'Midnight MCP Server',
      description: 'Real Midnight Network wallet + contract server',
      port:        3000,
      image:       'vaultchain/mcp-server:latest',
      resourceReqs: { cpu: 1, memory: '512Mi', storage: '2Gi' },
      leaseSeconds: 86400,       // 24 h initial lease
      healthPath:   '/health',
      env: {
        MIDNIGHT_NETWORK: process.env.VITE_MIDNIGHT_NETWORK || 'testnet',
        MIDNIGHT_RPC_URL: process.env.VITE_MIDNIGHT_RPC_URL || 'https://rpc.midnight.network',
      }
    },
    {
      id:          'eliza-agent',
      label:       'AI Agent Cluster (Matthew / Xara / Ada)',
      description: 'ElizaOS autonomous treasury AI agents',
      port:        3001,
      image:       'vaultchain/eliza-agent:latest',
      resourceReqs: { cpu: 2, memory: '1Gi', storage: '4Gi' },
      leaseSeconds: 86400,
      healthPath:   null,
      env: {
        OPENAI_API_KEY:       process.env.OPENAI_API_KEY       || '',
        BLOCKFROST_API_KEY:   process.env.BLOCKFROST_API_KEY   || '',
        XAHAU_WALLET_SEED:    process.env.XAHAU_WALLET_SEED    || '',
        XRPL_WALLET_SEED:     process.env.XRPL_WALLET_SEED     || '',
        VITE_MCP_URL:         process.env.VITE_MCP_URL         || 'http://localhost:3000',
      }
    },
    {
      id:          'frontend',
      label:       'VaultChain Frontend',
      description: 'Privacy-first DAO treasury dashboard (static SPA)',
      port:        5173,
      image:       'vaultchain/frontend:latest',
      resourceReqs: { cpu: 0.5, memory: '256Mi', storage: '1Gi' },
      leaseSeconds: 86400,
      healthPath:   '/',
      env: {}
    }
  ],

  // ── Host selection criteria ──────────────────────────────────────────────────
  hostSelection: {
    minReputation:    300,        // Evernode host reputation score
    maxLeaseAmount:   100,        // max XAH per day per instance
    preferRegions:    [],         // e.g. ['US', 'EU'] — empty = any
    excludeHosts:     [],
  }
};

export default EVERNODE_CONFIG;
