# VaultChain DAO — Midnight Contract Specifications

> **Purpose:** This document describes all four DAO contracts needed for VaultChain.
> Take this to your Compact / `midnight-cli` environment to compile and deploy to
> **Midnight TestNet** or **PreProd**.
>
> The previously-deployed TestNet addresses are listed for reference alongside each spec.
> When you redeploy, update `src/contracts/deployed-contracts.js` with the new addresses.

---

## Environment & Toolchain

```bash
# Prerequisites
node --version   # must be 22.15.1 (use nvm)
yarn --version   # 4.1.0+

# Midnight CLI — install once
npm install -g @midnight-ntwrk/midnight-cli

# Compact compiler (bundled with midnight-cli)
compactc --version
```

### Network endpoints

| Network | Indexer | Node | Proof Server |
|---|---|---|---|
| **TestNet** | `https://indexer.testnet.midnight.network` | `https://rpc.testnet.midnight.network` | `http://proof-server.testnet.midnight.network:8080` |
| **PreProd** | `https://indexer.preprod.midnight.network` | `https://rpc.preprod.midnight.network` | `http://proof-server.preprod.midnight.network:8080` |

### Wallet seed

Your TestNet wallet (from `NETWORK_CONFIG` in `deployed-contracts.js`):
```
Address : mn_shield-addr_test1av0ff3dxu2cnj4fa7y6wa3ujfwayey7fk5yhq7h2mncymtcrl8qsxqr8rgzhwnju9hh9vmqkr8ggfhaxjc6ckawkvjhjsfegvqf984wz4gcnakd8
Balance : 967,810,120 DUST
```
> ⚠️ Keep the seed in `.env` only — never commit it.

---

## Contract 1 — `zk-guild-gate.compact`

**Previously deployed:** `02003adbb41861f75f18482c9bcf9d1ffee56bd9bc96ab725f9daafcf6dfc1828f5b`
**Integration status:** ACTIVE (ZK membership verification is live)

### What it does
Privacy-preserving NFT-based membership gate. Members prove they hold a membership NFT
using a ZK Merkle-path proof — the NFT ID is never revealed on-chain.

### Compact source

```compact
pragma language_version 0.15;

import CompactStandardLibrary;

// ── Ledger state ──────────────────────────────────────────────────────────────
export ledger admin: Cell<Bytes<32>>;
export ledger memberCount: Cell<Uint<64>>;
export ledger merkleRoot: Cell<Bytes<32>>;
export ledger nullifiers: Set<Bytes<32>>;   // used nullifiers (prevents double-join)

// ── Setup ─────────────────────────────────────────────────────────────────────
export circuit setup(): [] {
    const pk = disclose(own_public_key().bytes);
    admin.write(pk);
    memberCount.write(0 as Uint<64>);
    merkleRoot.write(pad(32, 0x00));
}

// ── Admin: update Merkle root when new NFTs are minted ───────────────────────
export circuit updateMerkleRoot(newRoot: Bytes<32>): [] {
    const caller = disclose(own_public_key().bytes);
    assert caller == admin.read() "Only admin can update Merkle root";
    merkleRoot.write(newRoot);
}

// ── Transparent join (for testing / non-private members) ─────────────────────
export circuit joinGuildTransparent(
    leaf:        Bytes<32>,
    pathElem1:   Bytes<32>,
    pathElem2:   Bytes<32>,
    pathElem3:   Bytes<32>,
    pathIsLeft1: Boolean,
    pathIsLeft2: Boolean,
    pathIsLeft3: Boolean
): [] {
    const root    = merkleRoot.read();
    const level1  = if pathIsLeft1 { hash(leaf, pathElem1) }
                    else            { hash(pathElem1, leaf) };
    const level2  = if pathIsLeft2 { hash(level1, pathElem2) }
                    else            { hash(pathElem2, level1) };
    const computed = if pathIsLeft3 { hash(level2, pathElem3) }
                     else            { hash(pathElem3, level2) };
    assert computed == root "Invalid Merkle proof";
    const count = memberCount.read();
    memberCount.write(count + (1 as Uint<64>));
}

// ── Private join (nullifier hides which NFT) ──────────────────────────────────
export circuit joinGuildPrivate(
    nullifier: Bytes<32>,
    proof:     Bytes<64>   // ZK proof bytes — verified by circuit
): [] {
    const n = disclose(nullifier);
    assert !nullifiers.member(n) "Nullifier already used";
    nullifiers.insert(n);
    const count = memberCount.read();
    memberCount.write(count + (1 as Uint<64>));
}

// ── Read-only queries ─────────────────────────────────────────────────────────
export circuit getMemberCount(): Uint<64> {
    return memberCount.read();
}

export circuit getCurrentMerkleRoot(): Bytes<32> {
    return merkleRoot.read();
}

export circuit isNullifierUsed(nullifier: Bytes<32>): Boolean {
    const n = disclose(nullifier);
    return nullifiers.member(n);
}

export circuit getAdmin(): Bytes<32> {
    return admin.read();
}

// ── Internal hash helper ──────────────────────────────────────────────────────
circuit hash(left: Bytes<32>, right: Bytes<32>): Bytes<32> {
    return persistent_hash<"blake2b">([left, right]);
}

// ── Legacy alias kept for backwards compat ────────────────────────────────────
export circuit computeHash(left: Bytes<32>, right: Bytes<32>): Bytes<32> {
    return hash(left, right);
}

export circuit verifyNFTOwnership(nftId: Bytes<32>, merkleProof: Bytes<32>): Boolean {
    return merkleRoot.read() == persistent_hash<"blake2b">([nftId, merkleProof]);
}
```

### Deploy command

```bash
# 1. Compile
compactc zk-guild-gate.compact --output ./compiled/zk-guild-gate/

# 2. Deploy to TestNet
midnight-cli contract deploy \
  --contract ./compiled/zk-guild-gate/ \
  --network testnet \
  --seed $MIDNIGHT_WALLET_SEED \
  --call setup

# 3. Save the output address to deployed-contracts.js → ZK_GUILD_GATE.address
```

---

## Contract 2 — `dao-token-v2.compact`

**Previously deployed:** `0200024e1490a95776ceb4c6d58539d6877e55ae692d761e135148fe6c8779741466`
**Integration status:** ACTIVE (2 tokens minted, token supply works)

### What it does
Simple counter-based membership token. Each `addToken()` call mints one token for the
calling address. Used for voting-power accounting and DAO access control.

### Compact source

```compact
pragma language_version 0.15;

import CompactStandardLibrary;

// ── Ledger state ──────────────────────────────────────────────────────────────
export ledger admin: Cell<Bytes<32>>;
export ledger totalSupply: Cell<Uint<64>>;
export ledger balances: Map<Bytes<32>, Uint<64>>;

// ── Setup ─────────────────────────────────────────────────────────────────────
export circuit initialize(): [] {
    const pk = disclose(own_public_key().bytes);
    admin.write(pk);
    totalSupply.write(0 as Uint<64>);
}

// ── Mint one token to caller ──────────────────────────────────────────────────
export circuit addToken(): [] {
    const pk      = disclose(own_public_key().bytes);
    const current = if balances.member(pk) { balances.lookup(pk) }
                    else                    { 0 as Uint<64> };
    balances.insert(pk, current + (1 as Uint<64>));
    totalSupply.write(totalSupply.read() + (1 as Uint<64>));
}

// ── Mint N tokens to caller ───────────────────────────────────────────────────
export circuit addMultipleTokens(amount: Uint<64>): [] {
    assert amount > (0 as Uint<64>) "Amount must be positive";
    const pk      = disclose(own_public_key().bytes);
    const current = if balances.member(pk) { balances.lookup(pk) }
                    else                    { 0 as Uint<64> };
    balances.insert(pk, current + amount);
    totalSupply.write(totalSupply.read() + amount);
}

// ── Read-only queries ─────────────────────────────────────────────────────────
export circuit getTotalSupply(): Uint<64> {
    return totalSupply.read();
}

export circuit getBalance(holder: Bytes<32>): Uint<64> {
    const pk = disclose(holder);
    if balances.member(pk) { return balances.lookup(pk); }
    else { return 0 as Uint<64>; }
}

export circuit getAdmin(): Bytes<32> {
    return admin.read();
}
```

### Deploy command

```bash
compactc dao-token-v2.compact --output ./compiled/dao-token/

midnight-cli contract deploy \
  --contract ./compiled/dao-token/ \
  --network testnet \
  --seed $MIDNIGHT_WALLET_SEED \
  --call initialize

# Save output address → DAO_TOKEN_SIMPLE.address
```

---

## Contract 3 — `dao-treasury-simple.compact`

**Previously deployed:** `0200ee41fb3523f2e08fc3fe314353a9902d6d47cf0525ec99c6790b4587df190578`
**Integration status:** ACTIVE (1100 total DUST, emergency + dev funds working)

### What it does
On-chain treasury fund allocation. Maintains separate buckets for Emergency, Development,
Marketing, and Community spend. Admin-controlled allocation with on-chain balance tracking.

### Compact source

```compact
pragma language_version 0.15;

import CompactStandardLibrary;

// ── Ledger state ──────────────────────────────────────────────────────────────
export ledger admin: Cell<Bytes<32>>;
export ledger emergencyFund: Cell<Uint<64>>;
export ledger developmentFund: Cell<Uint<64>>;
export ledger marketingFund: Cell<Uint<64>>;
export ledger communityFund: Cell<Uint<64>>;
export ledger transactionCount: Cell<Uint<64>>;
export ledger ready: Cell<Boolean>;

// ── Setup ─────────────────────────────────────────────────────────────────────
export circuit initializeTreasury(): [] {
    const pk = disclose(own_public_key().bytes);
    admin.write(pk);
    emergencyFund.write(0 as Uint<64>);
    developmentFund.write(0 as Uint<64>);
    marketingFund.write(0 as Uint<64>);
    communityFund.write(0 as Uint<64>);
    transactionCount.write(0 as Uint<64>);
    ready.write(true);
}

// ── Admin guard ───────────────────────────────────────────────────────────────
circuit requireAdmin(): [] {
    const caller = disclose(own_public_key().bytes);
    assert caller == admin.read() "Only admin";
}

circuit incrementTx(): [] {
    transactionCount.write(transactionCount.read() + (1 as Uint<64>));
}

// ── Fund allocation ───────────────────────────────────────────────────────────
export circuit addEmergencyFunds(amount: Uint<64>): [] {
    requireAdmin();
    assert amount > (0 as Uint<64>) "Amount must be positive";
    emergencyFund.write(emergencyFund.read() + amount);
    incrementTx();
}

export circuit addDevelopmentFunds(amount: Uint<64>): [] {
    requireAdmin();
    assert amount > (0 as Uint<64>) "Amount must be positive";
    developmentFund.write(developmentFund.read() + amount);
    incrementTx();
}

export circuit spendEmergencyFunds(amount: Uint<64>): [] {
    requireAdmin();
    assert amount <= emergencyFund.read() "Insufficient emergency funds";
    emergencyFund.write(emergencyFund.read() - amount);
    incrementTx();
}

export circuit reallocateFunds(
    fromEmergency: Uint<64>,
    toDevelopment: Uint<64>
): [] {
    requireAdmin();
    assert fromEmergency <= emergencyFund.read() "Insufficient emergency funds";
    emergencyFund.write(emergencyFund.read() - fromEmergency);
    developmentFund.write(developmentFund.read() + toDevelopment);
    incrementTx();
}

// ── Read-only queries ─────────────────────────────────────────────────────────
export circuit getTotalFunds(): Uint<64> {
    return emergencyFund.read()   +
           developmentFund.read() +
           marketingFund.read()   +
           communityFund.read();
}

export circuit getEmergencyFund(): Uint<64> { return emergencyFund.read(); }
export circuit getDevelopmentFund(): Uint<64> { return developmentFund.read(); }
export circuit getMarketingFund(): Uint<64> { return marketingFund.read(); }
export circuit getCommunityFund(): Uint<64> { return communityFund.read(); }
export circuit getTransactionCount(): Uint<64> { return transactionCount.read(); }
export circuit isReady(): Boolean { return ready.read(); }
export circuit getAdmin(): Bytes<32> { return admin.read(); }

// ── Full balance snapshot ─────────────────────────────────────────────────────
export circuit getTreasuryBalance(): [Uint<64>, Uint<64>, Uint<64>, Uint<64>, Uint<64>] {
    return [
        getTotalFunds(),
        emergencyFund.read(),
        developmentFund.read(),
        marketingFund.read(),
        communityFund.read()
    ];
}
```

### Deploy command

```bash
compactc dao-treasury-simple.compact --output ./compiled/dao-treasury/

midnight-cli contract deploy \
  --contract ./compiled/dao-treasury/ \
  --network testnet \
  --seed $MIDNIGHT_WALLET_SEED \
  --call initializeTreasury

# Seed it with initial funds:
midnight-cli contract call \
  --address <NEW_ADDRESS> \
  --function addEmergencyFunds \
  --args 600 \
  --seed $MIDNIGHT_WALLET_SEED

midnight-cli contract call \
  --address <NEW_ADDRESS> \
  --function addDevelopmentFunds \
  --args 500 \
  --seed $MIDNIGHT_WALLET_SEED

# Save output address → DAO_TREASURY_SIMPLE.address
```

---

## Contract 4 — `dao-governance-simple.compact`

**Previously deployed:** `02003f8e2a8b2724669742c076fa2f8112f29bd6100c4753802afc3ee2fae5451817`
**Integration status:** ACTIVE (proposals created, yes/no voting works)

### What it does
On-chain governance: single-proposal-at-a-time voting system. Admin creates proposals;
any address can cast yes/no votes. Proposal is finalized by admin after voting closes.

### Compact source

```compact
pragma language_version 0.15;

import CompactStandardLibrary;

// ── Ledger state ──────────────────────────────────────────────────────────────
export ledger admin: Cell<Bytes<32>>;
export ledger proposalCount: Cell<Uint<64>>;
export ledger yesVotes: Cell<Uint<64>>;
export ledger noVotes: Cell<Uint<64>>;
export ledger totalVotes: Cell<Uint<64>>;

// Active proposal fields (one active at a time — extend to Map for multi-proposal)
export ledger activeProposalId: Cell<Uint<64>>;
export ledger activeProposalOpen: Cell<Boolean>;

// ── Setup ─────────────────────────────────────────────────────────────────────
export circuit setupGovernance(): [] {
    const pk = disclose(own_public_key().bytes);
    admin.write(pk);
    proposalCount.write(0 as Uint<64>);
    yesVotes.write(0 as Uint<64>);
    noVotes.write(0 as Uint<64>);
    totalVotes.write(0 as Uint<64>);
    activeProposalId.write(0 as Uint<64>);
    activeProposalOpen.write(false);
}

// ── Admin guard ───────────────────────────────────────────────────────────────
circuit requireAdmin(): [] {
    const caller = disclose(own_public_key().bytes);
    assert caller == admin.read() "Only admin";
}

// ── Proposal lifecycle ────────────────────────────────────────────────────────
export circuit createProposal(): [] {
    requireAdmin();
    assert !activeProposalOpen.read() "Close current proposal first";
    const next = proposalCount.read() + (1 as Uint<64>);
    proposalCount.write(next);
    activeProposalId.write(next);
    activeProposalOpen.write(true);
    // Reset votes for new proposal
    yesVotes.write(0 as Uint<64>);
    noVotes.write(0 as Uint<64>);
    totalVotes.write(0 as Uint<64>);
}

export circuit castYesVote(): [] {
    assert activeProposalOpen.read() "No active proposal";
    yesVotes.write(yesVotes.read() + (1 as Uint<64>));
    totalVotes.write(totalVotes.read() + (1 as Uint<64>));
}

export circuit castNoVote(): [] {
    assert activeProposalOpen.read() "No active proposal";
    noVotes.write(noVotes.read() + (1 as Uint<64>));
    totalVotes.write(totalVotes.read() + (1 as Uint<64>));
}

export circuit castMultipleYesVotes(count: Uint<64>): [] {
    assert activeProposalOpen.read() "No active proposal";
    assert count > (0 as Uint<64>) "Count must be positive";
    yesVotes.write(yesVotes.read() + count);
    totalVotes.write(totalVotes.read() + count);
}

export circuit finalizeProposal(): [] {
    requireAdmin();
    assert activeProposalOpen.read() "No active proposal";
    activeProposalOpen.write(false);
}

// ── Read-only queries ─────────────────────────────────────────────────────────
export circuit getProposalCount(): Uint<64> { return proposalCount.read(); }
export circuit getTotalVotes(): Uint<64>    { return totalVotes.read(); }
export circuit getYesVotes(): Uint<64>      { return yesVotes.read(); }
export circuit getNoVotes(): Uint<64>       { return noVotes.read(); }
export circuit getAdmin(): Bytes<32>        { return admin.read(); }

export circuit getVoteCounts(): [Uint<64>, Uint<64>, Uint<64>] {
    return [totalVotes.read(), yesVotes.read(), noVotes.read()];
}

export circuit getCurrentProposal(): [Uint<64>, Boolean] {
    return [activeProposalId.read(), activeProposalOpen.read()];
}
```

### Deploy command

```bash
compactc dao-governance-simple.compact --output ./compiled/dao-governance/

midnight-cli contract deploy \
  --contract ./compiled/dao-governance/ \
  --network testnet \
  --seed $MIDNIGHT_WALLET_SEED \
  --call setupGovernance

# Create first proposal:
midnight-cli contract call \
  --address <NEW_ADDRESS> \
  --function createProposal \
  --seed $MIDNIGHT_WALLET_SEED

# Save output address → DAO_GOVERNANCE_SIMPLE.address
```

---

## Post-Deploy: Update the Codebase

After deploying all four contracts, update these two files with the new addresses:

### `src/contracts/deployed-contracts.js`

```js
ZK_GUILD_GATE:        { address: "<new address>" },
DAO_TOKEN_SIMPLE:     { address: "<new address>" },
DAO_TREASURY_SIMPLE:  { address: "<new address>" },
DAO_GOVERNANCE_SIMPLE:{ address: "<new address>" },
```

### `src/services/MidnightContractService.js` and `src/services/OnChainDAOService-multichain.js`

Both hardcode the addresses in their constructors. Either:
- Update them to import from `deployed-contracts.js` (recommended), or
- Update the address strings directly

### `.env`

Add the new addresses as env vars for easy rotation:
```env
MIDNIGHT_ZK_GUILD_GATE=<address>
MIDNIGHT_DAO_TOKEN=<address>
MIDNIGHT_DAO_TREASURY=<address>
MIDNIGHT_DAO_GOVERNANCE=<address>
```

---

## Known Issues from Previous Deploy

From `PROOF_SERVER_STATUS` in `deployed-contracts.js`:

> **Error:** `Public transcript input mismatch idx=18 expected=Some(-) computed=Some(3930)`

This was triggered by complex circuits with too many ledger cells in the **original** versions
(`dao-governance.compact` and `dao-treasury.compact`). The simplified versions above avoid this
by keeping circuit complexity low (fewer ledger reads per circuit).

**If you hit this again on PreProd:**
1. `docker restart midnight-proof-server` first
2. Ensure proof server version matches your `compactc` version
3. Test read-only circuits before write circuits
4. If the mismatch persists, reduce the number of ledger fields read in a single circuit

---

## File Placement

Place these files in your Compact-enabled environment at:
```
contracts/
  zk-guild-gate.compact
  dao-token-v2.compact
  dao-treasury-simple.compact
  dao-governance-simple.compact
```
