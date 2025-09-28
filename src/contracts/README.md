# DAO Contracts

This folder contains all the smart contracts for the complete on-chain DAO system.

## 📁 Contract Files

- `zk-guild-gate.compact` - Privacy-preserving membership verification ✅ **DEPLOYED**
- `dao-governance.compact` - Proposal creation and voting system ✅ **DEPLOYED**  
- `dao-treasury.compact` - Treasury management and fund allocation ⏳ **READY TO DEPLOY**
- `dao-token-v2.compact` - Membership tokens and voting power ⏳ **READY TO DEPLOY**
- `dao-simple.compact` - Simplified fallback contract ⏳ **READY TO DEPLOY**

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│ Frontend (React DAO Interface)          │
├─────────────────────────────────────────┤
│ On-Chain Contracts (Midnight Network)   │
│ ├─ 🛡️ ZK Guild Gate (Membership) ✅     │
│ ├─ 🏛️ DAO Governance (Voting) ✅        │
│ ├─ 💰 DAO Treasury (Funds) ⏳           │
│ ├─ 🪙 DAO Token (Power) ⏳              │
│ └─ 🔧 DAO Simple (Fallback) ⏳          │
├─────────────────────────────────────────┤
│ Remaining Services                      │
│ └─ 🤖 AI Agent (Proposal Generation)    │
└─────────────────────────────────────────┘
```

## 📊 Deployment Status

### ✅ Deployed Contracts

1. **ZK Guild Gate** 
   - Address: `02003adbb41861f75f18482c9bcf9d1ffee56bd9bc96ab725f9daafcf6dfc1828f5b`
   - Purpose: Privacy-preserving membership verification
   - Status: Active in frontend

2. **DAO Governance**
   - Address: `0200a5d5aa7fb4041521c18b621847e3e04c8a554f096afeb775884eb0e2d10c8566`
   - Purpose: On-chain proposals and voting
   - Replaces: `zk-voting-service.js` (port 3002)

### ⏳ Ready to Deploy

3. **DAO Treasury** (Next)
   - Purpose: Fund management and allocation
   - Circuits: 10 compiled successfully
   - Replaces: `treasury-simulation.js` (port 3003)

4. **DAO Token**
   - Purpose: Membership tokens and voting power
   - Circuits: 5 compiled successfully

5. **DAO Simple** (Fallback)
   - Purpose: Reliable demo contract
   - Circuits: 7 compiled successfully

## 🚀 Deployment Instructions

### Deploy Treasury Contract (Next)

1. **Prepare contract:**
   ```bash
   cd ../boilerplate/contract
   rm -f src/*.compact
   cp ../../zk-guild-gate/src/contracts/dao-treasury.compact src/
   ```

2. **Build contract:**
   ```bash
   npm run dev
   ```

3. **Deploy contract:**
   ```bash
   cd ../
   npm run deploy
   ```

4. **Update registry:**
   - Add new contract address to `deployed-contracts.js`
   - Update status from "READY_TO_DEPLOY" to "DEPLOYED"

## 🔗 Integration Files

- `deployed-contracts.js` - Central registry of all contracts
- `contract-integration.js` - Helper for frontend integration
- `deploy-next-contract.js` - Deployment helper script

## 🎯 Benefits of Complete On-Chain DAO

✅ **True Decentralization** - No off-chain dependencies  
✅ **ZK Privacy** - All operations use zero-knowledge proofs  
✅ **Real Treasury** - Actual fund management on-chain  
✅ **Transparent Governance** - All votes recorded on-chain  
✅ **Eliminates Simulators** - Replace off-chain services  
✅ **Hackathon Ready** - Complete demo system  

## 🔄 Services Replacement Plan

| Current Service | Port | Replaced By | Status |
|----------------|------|-------------|---------|
| `zk-voting-service.js` | 3002 | DAO Governance | ✅ Can Replace |
| `treasury-simulation.js` | 3003 | DAO Treasury | ⏳ Ready to Replace |
| `eliza-treasury-agent.js` | 3001 | Keep | 🤖 Still Needed |

## 🧪 Testing

Each contract has been tested with the Compact compiler:
- All circuits compile successfully
- Functions are proof-server compatible
- Error handling for ZK proof issues
- Fallback mechanisms implemented

## 📱 Frontend Integration

The contracts are ready for integration with your existing React DAO interface. Use the helper functions in `contract-integration.js` to connect your UI to the deployed contracts.
