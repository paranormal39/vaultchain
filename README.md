# 🌐 VaultChain DAO — Privacy-First AI Treasury Management

> **Multi-chain DAO** built on Midnight Network with autonomous AI treasury agents, Xahau on-chain enforcement hooks, Cardano DeFi integration, and Evernode deployment support.

---

## 🎯 What It Does

VaultChain is a privacy-first DAO that manages a treasury across four blockchain networks simultaneously. AI agents monitor each chain autonomously, while Midnight Network ZK proofs keep governance private.

| Chain | Role | Status |
|---|---|---|
| **Midnight Network** | Primary treasury (DUST) · ZK governance contracts | ✅ Live TestNet |
| **XRPL** | Cross-chain payments · live ledger data via `xrpl` npm | ✅ Live Mainnet |
| **Xahau** | On-chain enforcement hooks (TREASURY_GUARD · MEMBERSHIP_GATE · FEE_ROUTER) | ✅ TestNet / demo |
| **Cardano** | DeFi yield · staking delegation via Blockfrost | ✅ TestNet / demo |

---

## 🤖 AI Agents

Three autonomous agents run via **ElizaOS** and coordinate through the Midnight MCP server:

| Agent | Speciality | Port |
|---|---|---|
| **Matthew** | Midnight treasury management · ZK proof operations | 3001 |
| **Xara** | XRPL / Xahau payments · cross-chain routing | 3001 (same cluster) |
| **Ada** | Cardano DeFi · staking opportunities · Blockfrost data | 3001 (same cluster) |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  VaultChain Frontend  (React + Vite · Port 5173)                 │
│  6-tab dashboard: Overview · Treasury · Governance · Wallet ·    │
│  Tokens · AI Agent                                               │
└────────────────────┬─────────────────────────────────────────────┘
                     │  HTTP / Vite dev proxy
          ┌──────────▼──────────┐        ┌──────────────────────────┐
          │  Midnight MCP Server │        │  ElizaOS AI Agent Cluster│
          │  (Express · Port 3000)│◄──────►│  Matthew · Xara · Ada   │
          │  helmet · rate-limit │  MCP   │  (Port 3001)             │
          │  CORS whitelist      │        └──────────────────────────┘
          └──────────┬──────────┘
                     │
     ┌───────────────┼───────────────────┐
     ▼               ▼                   ▼
Midnight        XRPL / Xahau         Cardano
Network         Ledger               (Blockfrost)
(TestNet ZK)    (Live data)          (TestNet)
```

### On-Chain DAO Contracts (Midnight TestNet)

All four contracts are **live** and verified working:

| Contract | Address | Functions |
|---|---|---|
| ZK Guild Gate | `02003adb...828f5b` | ZK Merkle membership, nullifier set, private join |
| DAO Token | `0200024e...1466` | Mint, multi-mint, balance tracking |
| DAO Treasury | `0200ee41...0578` | Emergency / dev fund allocation, spend controls |
| DAO Governance | `02003f8e...1817` | Create proposal, yes/no voting, finalize |

> Full Compact source specs for redeployment to PreProd: [`docs/midnight-contracts-spec.md`](docs/midnight-contracts-spec.md)

### Xahau Hooks

Three WebAssembly Hooks enforce DAO rules on-chain at the Xahau layer:

- **TREASURY_GUARD** — blocks treasury sends above threshold without an approved proposal hash in the Memo field
- **MEMBERSHIP_GATE** — rejects payments from addresses without a VaultChain guild membership
- **FEE_ROUTER** — auto-splits incoming deposits across Emergency / Dev / Community / Operational reserves

---

## 🚀 Quick Start

### Prerequisites

```bash
node --version   # 22.15.1 recommended (use nvm)
npm --version    # 10+
```

### Install

```bash
git clone https://github.com/paranormal39/vaultchain.git
cd vaultchain

npm install                        # frontend deps
cd eliza-agent && npm install      # AI agent deps
cd ../midnight-mcp-server && yarn install   # MCP server deps (yarn)
cd ..
```

### Configure `.env`

Copy the example and fill in what you have — everything degrades gracefully to demo mode without real keys:

```bash
cp .env.example .env
```

Key variables (see `.env.example` for the full list):

```env
# Midnight Network
MIDNIGHT_WALLET_ADDRESS=mn_shield-addr_test...
MIDNIGHT_WALLET_SEED=              # keep in .env only, never commit

# Blockfrost (Cardano)
BLOCKFROST_API_KEY=                # get free key at blockfrost.io

# XRPL
XRPL_WALLET_SEED=                  # generate with: node setup-xrpl-wallet.js

# Xahau Hooks
XAHAU_WALLET_SEED=                 # Xahau account that holds the Hooks

# AI Agent
OPENAI_API_KEY=                    # required for live Matthew/Xara/Ada responses
```

### Run

**Frontend only (demo mode — no API keys needed):**
```bash
npm start
# → http://localhost:5173
```

**Full stack (frontend + MCP server + AI agents):**
```bash
npm run start:complete
```

**Individual services:**
```bash
# Terminal 1 — Midnight MCP server
cd midnight-mcp-server && yarn dev

# Terminal 2 — AI agent cluster
cd eliza-agent && npm start

# Terminal 3 — Frontend
npm run dev
```

### Service URLs

| Service | URL |
|---|---|
| VaultChain Dashboard | http://localhost:5173 |
| Midnight MCP Server | http://localhost:3000 |
| AI Agent Cluster | http://localhost:3001 |

All URLs are configurable via env vars (`VITE_MCP_PORT`, `VITE_MATTHEW_PORT`, `VITE_FRONTEND_PORT`).

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite** (chunk-split: react / rxjs / xrpl / app)
- **RxJS BehaviorSubject** for real-time agent state
- **TailwindCSS** + custom glassmorphism themes
- Vite dev proxy routes `/api/mcp` → `:3000`, `/api/matthew` → `:3001`

### MCP Server (`midnight-mcp-server/`)
- **TypeScript** + **Express 5** + **Midnight SDK**
- **helmet** — CSP, HSTS, X-Frame-Options
- **CORS whitelist** via `CORS_ORIGINS` env var
- **Rate limiting** — 60 req/min default · 10 req/min on `POST /wallet/send`
- **Input sanitization** + body size cap (10 kB)
- No secrets in source — all credentials from env vars

### AI Agents (`eliza-agent/`)
- **ElizaOS** framework with `@elizaos/plugin-cardano` + `@elizaos/plugin-node`
- **MCP plugin** (`@fleek-platform/eliza-plugin-mcp`) for Midnight tool access
- Graceful fallback when `OPENAI_API_KEY` not set

### Services (`src/services/`)
| File | Purpose |
|---|---|
| `MidnightContractService.js` | Contract calls via MCP REST endpoints |
| `CardanoService.js` | Blockfrost API + demo fallback |
| `XRPLService.js` | Live `xrpl` npm package — mainnet data |
| `XahauHooksService.js` | Xahau Hook state · install · guarded payments |
| `OnChainDAOService-multichain.js` | 4-chain `getDashboardData()` aggregator |

### Config
- **`src/config/endpoints.js`** — single source of truth for all service URLs and network config
- **`src/utils/security.js`** — `sanitizeInput`, `validateAddress`, `rateGuard`, `maskSecret`, `isRealApiKey`

---

## ☁️ Evernode Deployment

VaultChain is configured for **Evernode HotPocket** deployment (XRP Ledger decentralised cloud).

```bash
# Dry-run (no EVERNODE_TENANT_ADDRESS set) — shows what would deploy
npm run deploy

# Check live service health
npm run health

# Machine-readable health (for CI / Docker HEALTHCHECK)
npm run health:json
```

Three HotPocket instances:

| Instance | Image | Port |
|---|---|---|
| `mcp-server` | `vaultchain/mcp-server:latest` | 3000 |
| `eliza-agent` | `vaultchain/eliza-agent:latest` | 3001 |
| `frontend` | `vaultchain/frontend:latest` | 5173 |

Dockerfiles: [`evernode/`](evernode/) · Config: [`evernode/evernode.config.js`](evernode/evernode.config.js)

---

## 📜 Deployed Smart Contracts

```
ZK Guild Gate      02003adbb41861f75f18482c9bcf9d1ffee56bd9bc96ab725f9daafcf6dfc1828f5b
DAO Token          0200024e1490a95776ceb4c6d58539d6877e55ae692d761e135148fe6c8779741466
DAO Treasury       0200ee41fb3523f2e08fc3fe314353a9902d6d47cf0525ec99c6790b4587df190578
DAO Governance     02003f8e2a8b2724669742c076fa2f8112f29bd6100c4753802afc3ee2fae5451817
```

Contract registry: [`src/contracts/deployed-contracts.js`](src/contracts/deployed-contracts.js)
Compact source specs for redeployment: [`docs/midnight-contracts-spec.md`](docs/midnight-contracts-spec.md)

---

## 🔐 Security

- No private keys or seeds in source — all loaded from `.env` (gitignored)
- `SECURITY.md` documents key rotation procedures for every credential
- MCP server: helmet · CORS whitelist · rate limiting · input sanitization · production error handler
- Frontend: `sanitizeInput()` on all user data before DOM render · `rateGuard()` on UI actions
- Dockerfiles use `--omit=dev` / `--production` — dev secrets never reach runtime images

See [`SECURITY.md`](SECURITY.md) for the full hardening checklist and key rotation guide.

---

## 📂 Repository Structure

```
vaultchain/
├── src/
│   ├── agents/          # AdaAgent.js · MatthewAgent.js
│   ├── config/          # endpoints.js (centralized URLs + network config)
│   ├── contracts/       # deployed-contracts.js (live addresses + registry)
│   ├── services/        # MidnightContractService · CardanoService · XRPLService
│   │                    # XahauHooksService · OnChainDAOService-multichain
│   └── utils/           # security.js
├── midnight-mcp-server/ # TypeScript MCP + Express wallet server
├── eliza-agent/         # ElizaOS AI agent cluster
├── evernode/            # HotPocket deployment config + Dockerfiles
├── docs/
│   └── midnight-contracts-spec.md   # Compact source + deploy commands
├── scripts/             # deploy-zk-nft.js · test-nft-system.js
├── .env.example         # full env var template
├── SECURITY.md          # key rotation + hardening checklist
└── start-complete.js    # orchestrates all 3 services
```

---

## 🤝 Contributing

PRs welcome. Please read `SECURITY.md` before submitting anything that touches credentials, contract addresses, or network config.

## 📄 License

Apache 2.0 — see LICENSE for details.

---

*Built for the Midnight Network Privacy First Challenge and DoraHacks AI Treasury Management Challenge.*
