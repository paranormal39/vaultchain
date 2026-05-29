# VaultChain DAO — Security Guide

## Secrets Management

### Rule 1 — Never commit secrets
All credentials must be in `.env` (git-ignored). Use `.env.example` as the template.

```
# Correct — loaded at runtime
BLOCKFROST_API_KEY=mainnet_your_real_key
XAHAU_WALLET_SEED=s████████████████████████
MIDNIGHT_WALLET_ADDRESS=mn_shield-addr_test...
```

### Rule 2 — Rotate on suspected exposure
| Secret | How to rotate |
|---|---|
| `BLOCKFROST_API_KEY` | Revoke at blockfrost.io → Projects → Regenerate |
| `XRPL_WALLET_SEED` | Generate new wallet via `node setup-xrpl-wallet.js`, migrate XRP |
| `XAHAU_WALLET_SEED` | Same process as XRPL; also uninstall Hooks from old account |
| `MIDNIGHT_WALLET_ADDRESS` | Generate new wallet via Midnight CLI, redeploy contracts |
| `OPENAI_API_KEY` | Revoke at platform.openai.com → API Keys |
| `EVERNODE_TENANT_SECRET` | Transfer XAH to new account, update env |

### Rule 3 — Principle of least privilege
- The MCP server only needs `MIDNIGHT_WALLET_ADDRESS` and `MIDNIGHT_WALLET_BALANCE` — **never** the private key.
- The eliza-agent only needs `OPENAI_API_KEY` + chain API keys for reads; the Xahau signing key (`XAHAU_WALLET_SEED`) is only needed if Hooks are being deployed/updated.
- The Vite frontend has **zero** secret access — all chain calls go through the backend MCP server or the Vite dev proxy.

---

## Production Hardening Checklist

### MCP Server (`midnight-mcp-server/simple-wallet-server.js`)
- [x] `helmet` — sets X-Frame-Options, Content-Security-Policy, HSTS, etc.
- [x] CORS whitelist — only `CORS_ORIGINS` env var origins are accepted
- [x] Rate limiting — 60 req/min default; 10 req/min on `/wallet/send`
- [x] Body size cap — `express.json({ limit: '10kb' })`
- [x] Input sanitization — `sanitizeStr()` + `isValidAmount()` on all POST bodies
- [x] No secrets in source — wallet seed removed; address/balance from env vars
- [x] Error handler — hides stack traces in `NODE_ENV=production`

### Frontend (`src/`)
- [x] `src/utils/security.js` — `sanitizeInput`, `validateAddress`, `rateGuard`, `maskSecret`
- [x] Vite dev proxy — eliminates direct CORS calls to backend services in dev
- [x] Chunk splitting — `react`, `rxjs`, `xrpl` in separate chunks (reduces attack surface per-chunk)
- [ ] TODO: add `<meta http-equiv="Content-Security-Policy">` to `index.html` for strict CSP in production

### Evernode Deployment
- [x] `.dockerignore` — excludes `.env`, `node_modules`, `dist`, `.git`
- [x] Dockerfiles use `npm ci --omit=dev` / `yarn install --production` (no devDeps in images)
- [x] Multi-stage frontend Dockerfile — build secrets never reach the runtime image

---

## Reporting Vulnerabilities

Please **do not** open public GitHub issues for security vulnerabilities.
Contact the team privately; include:
1. Description of the issue
2. Steps to reproduce
3. Potential impact
4. Suggested fix (optional)

We aim to acknowledge reports within 48 hours and patch within 7 days.

---

## Dependency Audit

Run regularly:
```bash
npm audit
npm audit fix
```

Known warnings (pre-existing, non-critical):
- `@types/helmet@4.0.0` — stub types package, helmet ships its own types
- `@esbuild-kit/esm-loader` / `core-utils` — merged into tsx, no security impact
