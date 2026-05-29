/**
 * @file endpoints.js
 * @description Centralized service endpoint and environment configuration.
 *
 * All service URLs are derived from environment variables so they can be
 * overridden when deploying to Evernode (or any remote host) without touching
 * application code. Falls back to localhost defaults for local development.
 */

const env = (key, fallback) =>
  (typeof import.meta !== 'undefined' && import.meta.env?.[key]) ||
  (typeof process !== 'undefined' && process.env?.[key]) ||
  fallback;

// ── Service ports ────────────────────────────────────────────────────────────
export const PORTS = {
  FRONTEND:    parseInt(env('VITE_FRONTEND_PORT',    '5173'), 10),
  MCP_SERVER:  parseInt(env('VITE_MCP_PORT',         '3000'), 10),
  MATTHEW_AI:  parseInt(env('VITE_MATTHEW_PORT',     '3001'), 10),
  XARA_AI:     parseInt(env('VITE_XARA_PORT',        '3002'), 10),
  ADA_AI:      parseInt(env('VITE_ADA_PORT',         '3003'), 10),
};

// ── Base URLs ────────────────────────────────────────────────────────────────
const MCP_BASE     = env('VITE_MCP_URL',     `http://localhost:${PORTS.MCP_SERVER}`);
const MATTHEW_BASE = env('VITE_MATTHEW_URL', `http://localhost:${PORTS.MATTHEW_AI}`);
const XARA_BASE    = env('VITE_XARA_URL',    `http://localhost:${PORTS.XARA_AI}`);
const ADA_BASE     = env('VITE_ADA_URL',     `http://localhost:${PORTS.ADA_AI}`);

// ── MCP Server endpoints (Midnight / wallet) ─────────────────────────────────
export const MCP = {
  BASE:             MCP_BASE,
  HEALTH:           `${MCP_BASE}/health`,
  WALLET_BALANCE:   `${MCP_BASE}/wallet/balance`,
  WALLET_ADDRESS:   `${MCP_BASE}/wallet/address`,
  WALLET_SEND:      `${MCP_BASE}/wallet/send`,
  TREASURY_BALANCE: `${MCP_BASE}/treasury/balance`,
  USER_BALANCE:     `${MCP_BASE}/user/balance`,
};

// ── Matthew AI endpoints (Midnight treasury agent) ───────────────────────────
export const MATTHEW = {
  BASE:              MATTHEW_BASE,
  CHAT:              `${MATTHEW_BASE}/chat`,
  DASHBOARD:         `${MATTHEW_BASE}/dashboard/multichain`,
  DEPOSIT_TDUST:     `${MATTHEW_BASE}/deposit/tdust`,
};

// ── Xara AI endpoints (XRPL/Xahau agent) ─────────────────────────────────────
export const XARA = {
  BASE:              XARA_BASE,
  CREATE_WALLET:     `${XARA_BASE}/xrpl/create_wallet`,
  WALLETS:           `${XARA_BASE}/xrpl/wallets`,
  DASHBOARD:         `${XARA_BASE}/dashboard/xrpl`,
};

// ── Ada AI endpoints (Cardano agent) ─────────────────────────────────────────
export const ADA = {
  BASE:              ADA_BASE,
  CHAT:              `${ADA_BASE}/chat`,
  CREATE_WALLET:     `${ADA_BASE}/cardano/create_wallet`,
  WALLETS:           `${ADA_BASE}/cardano/wallets`,
  STAKE_INFO:        `${ADA_BASE}/cardano/stake`,
  DASHBOARD:         `${ADA_BASE}/dashboard/cardano`,
};

// ── Network configuration ────────────────────────────────────────────────────
export const NETWORKS = {
  MIDNIGHT: {
    name:    'Midnight Network',
    rpcUrl:  env('VITE_MIDNIGHT_RPC_URL', 'https://rpc.midnight.network'),
    network: env('VITE_MIDNIGHT_NETWORK', 'testnet'),
    symbol:  'DUST',
    explorer: 'https://midnight-explorer.example.com',
  },
  XRPL: {
    name:    'XRPL',
    wsUrl:   env('VITE_XRPL_SERVER', 'wss://xrplcluster.com/'),
    network: env('VITE_XRPL_NETWORK', 'mainnet'),
    symbol:  'XRP',
    explorer: 'https://livenet.xrpl.org',
    testnetWs: 'wss://s.altnet.rippletest.net:51233',
    faucet:  'https://faucet.altnet.rippletest.net',
  },
  XAHAU: {
    name:       'Xahau',
    wsUrl:      env('VITE_XAHAU_SERVER',  'wss://xahau.network/'),
    testnetWs:  env('VITE_XAHAU_TESTNET', 'wss://xahau-test.net/'),
    network:    env('VITE_XAHAU_NETWORK', 'mainnet'),
    symbol:     'XAH',
    explorer:   'https://xahauexplorer.com',
    hooksAmend: 'https://xahau.network/hooks',
  },
  CARDANO: {
    name:       'Cardano',
    blockfrostUrl: env('VITE_BLOCKFROST_URL', 'https://cardano-mainnet.blockfrost.io/api/v0'),
    network:    env('VITE_CARDANO_NETWORK', 'testnet'),
    symbol:     'ADA',
    explorer:   'https://cardanoscan.io',
    faucet:     'https://docs.cardano.org/cardano-testnet/tools/faucet',
  },
};

// ── Agent flags ───────────────────────────────────────────────────────────────
export const AGENTS = {
  MATTHEW_ENABLED: env('VITE_ENABLE_MATTHEW', 'true') !== 'false',
  XARA_ENABLED:    env('VITE_ENABLE_XARA',    'true') !== 'false',
  ADA_ENABLED:     env('VITE_ENABLE_ADA',     'true') !== 'false',
};

export default { MCP, MATTHEW, XARA, ADA, PORTS, NETWORKS, AGENTS };

export const XAHAU_WS       = NETWORKS.XAHAU.wsUrl;
export const XAHAU_TESTNET  = NETWORKS.XAHAU.testnetWs;
