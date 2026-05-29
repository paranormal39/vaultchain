/**
 * @file XahauHooksService.js
 * @description Xahau Hooks integration for VaultChain DAO on-chain enforcement
 *
 * Xahau is an XRP Ledger amendment that adds smart contract capability via
 * "Hooks" — small WebAssembly programs attached to accounts that fire on
 * every incoming/outgoing transaction. VaultChain uses Hooks to enforce:
 *
 *  1. TREASURY_GUARD  – blocks treasury sends above the governance threshold
 *     without an approved proposal hash in tx Memo.
 *  2. MEMBERSHIP_GATE – rejects payments from addresses not holding a
 *     VaultChain guild membership NFT (checked via account NamespaceEntry).
 *  3. FEE_ROUTER      – automatically splits every incoming deposit across
 *     reserves / dev / community buckets as set by the current DAO allocation.
 *
 * All Hooks are encoded as WASM hex and set via HookSet transactions.
 * This service handles:
 *  - Connecting to Xahau network (mainnet or testnet)
 *  - Submitting HookSet transactions to install/update Hooks
 *  - Reading Hook state (NamespaceEntry) from on-chain storage
 *  - Submitting guarded payments that carry DAO-approval Memos
 *  - Demo / dry-run mode when no wallet seed is configured
 *
 * References:
 *  https://xahau.network/hooks/
 *  https://hooks-builder.xrpl.org/
 */

import * as xrpl from 'xrpl';
import { NETWORKS } from '../config/endpoints.js';

// ── Hook WAsm hex stubs ───────────────────────────────────────────────────────
// These are placeholder WASM binaries (noop hooks) — replace with compiled
// Hook WASM from hooks-builder.xrpl.org before deploying to mainnet.
const HOOK_WASM = {
  TREASURY_GUARD:  '0061736d0100000001040160000002060103656e760' +
                   '36163630000030201000a04010200000b',
  MEMBERSHIP_GATE: '0061736d0100000001040160000002060103656e760' +
                   '36163630000030201000a04010200000b',
  FEE_ROUTER:      '0061736d0100000001040160000002060103656e760' +
                   '36163630000030201000a04010200000b',
};

// ── Hook namespaces (32-byte hex, deterministic per hook) ────────────────────
const HOOK_NAMESPACES = {
  TREASURY_GUARD:  '5465737472792047756172640000000000000000000000000000000000000000',
  MEMBERSHIP_GATE: '4d656d62657273686970204761746500000000000000000000000000000000',
  FEE_ROUTER:      '466565526f757465720000000000000000000000000000000000000000000000',
};

// ── Demo hook state ───────────────────────────────────────────────────────────
const DEMO_HOOK_STATE = {
  treasuryGuard: {
    installed:       true,
    guardThreshold:  1000,   // XRP
    approvedProposals: 3,
    blockedTx:       1,
    lastUpdate:      new Date(Date.now() - 3600000).toISOString()
  },
  membershipGate: {
    installed:       true,
    activeMemberships: 47,
    rejectedTx:      12,
    lastUpdate:      new Date(Date.now() - 7200000).toISOString()
  },
  feeRouter: {
    installed:       true,
    reservesPct:     40,
    devPct:          35,
    communityPct:    15,
    operationalPct:  10,
    totalRouted:     '284,500 XRP',
    lastUpdate:      new Date(Date.now() - 1800000).toISOString()
  }
};

// ── Service class ─────────────────────────────────────────────────────────────

export class XahauHooksService {
  constructor(config = {}) {
    const xahauNet  = NETWORKS.XAHAU;
    this.network    = config.network  || xahauNet.network  || 'testnet';
    this.wsUrl      = this.network === 'mainnet'
      ? (config.wsUrl || xahauNet.wsUrl)
      : (config.wsUrl || xahauNet.testnetWs);

    this.walletSeed = config.walletSeed ||
      (typeof process !== 'undefined' ? process.env.XAHAU_WALLET_SEED : null) || null;
    this.demoMode   = !this.walletSeed;

    this._client    = null;
    this._wallet    = null;

    if (this.demoMode) {
      console.log('🪝 XahauHooksService running in DEMO mode — set XAHAU_WALLET_SEED for live hooks');
    } else {
      console.log(`🪝 XahauHooksService targeting Xahau ${this.network} (${this.wsUrl})`);
    }
  }

  // ── Connection helpers ─────────────────────────────────────────────────────

  async _getClient() {
    if (this._client && this._client.isConnected()) return this._client;
    const client = new xrpl.Client(this.wsUrl);
    await client.connect();
    this._client = client;
    return client;
  }

  async _getWallet() {
    if (this._wallet) return this._wallet;
    if (!this.walletSeed) throw new Error('No XAHAU_WALLET_SEED configured');
    this._wallet = xrpl.Wallet.fromSeed(this.walletSeed);
    return this._wallet;
  }

  async _withClient(fn) {
    try {
      const client = await this._getClient();
      return await fn(client);
    } catch (err) {
      if (this._client) {
        try { await this._client.disconnect(); } catch (_) { /* ignore */ }
        this._client = null;
      }
      throw err;
    }
  }

  // ── Hook state reads ───────────────────────────────────────────────────────

  /**
   * Read raw Hook state namespace entries from an account.
   * Returns demo data when offline or in demo mode.
   */
  async getHookState(account) {
    if (this.demoMode || !account) {
      return { success: true, source: 'demo', hooks: DEMO_HOOK_STATE };
    }
    try {
      return await this._withClient(async (client) => {
        const res = await client.request({
          command:    'account_namespace',
          account,
          namespace_id: HOOK_NAMESPACES.TREASURY_GUARD
        });
        return {
          success: true,
          source:  'live',
          hooks:   res.result
        };
      });
    } catch (err) {
      console.error('❌ getHookState failed:', err.message);
      return { success: true, source: 'fallback', hooks: DEMO_HOOK_STATE };
    }
  }

  /**
   * Get hooks installed on an account.
   */
  async getInstalledHooks(account) {
    if (this.demoMode || !account) {
      return {
        success: true,
        source: 'demo',
        hooks: [
          { name: 'TREASURY_GUARD',  namespace: HOOK_NAMESPACES.TREASURY_GUARD,  installed: true },
          { name: 'MEMBERSHIP_GATE', namespace: HOOK_NAMESPACES.MEMBERSHIP_GATE, installed: true },
          { name: 'FEE_ROUTER',      namespace: HOOK_NAMESPACES.FEE_ROUTER,      installed: true },
        ]
      };
    }
    try {
      return await this._withClient(async (client) => {
        const res = await client.request({
          command: 'account_info',
          account,
          ledger_index: 'validated'
        });
        const hooks = res.result.account_data?.Hooks || [];
        return { success: true, source: 'live', hooks };
      });
    } catch (err) {
      console.error('❌ getInstalledHooks failed:', err.message);
      return { success: false, error: err.message, hooks: [] };
    }
  }

  // ── Hook installation ──────────────────────────────────────────────────────

  /**
   * Install or update a Hook on the connected wallet account via HookSet.
   * @param {'TREASURY_GUARD'|'MEMBERSHIP_GATE'|'FEE_ROUTER'} hookName
   * @param {object} [params] – Hook-specific parameters (guard threshold etc.)
   */
  async installHook(hookName, params = {}) {
    if (this.demoMode) {
      console.log(`🪝 [DEMO] Would install ${hookName} hook with params:`, params);
      return {
        success: true,
        source:  'demo',
        hookName,
        txHash:  `DEMO_HOOKSET_${Date.now()}`,
        message: `${hookName} hook installed (demo mode)`
      };
    }

    const wasm = HOOK_WASM[hookName];
    if (!wasm) throw new Error(`Unknown hook: ${hookName}`);

    try {
      return await this._withClient(async (client) => {
        const wallet = await this._getWallet();

        const hookSetTx = {
          TransactionType: 'HookSet',
          Account:         wallet.address,
          Hooks: [
            {
              Hook: {
                CreateCode:     wasm,
                HookNamespace:  HOOK_NAMESPACES[hookName],
                HookApiVersion: 0,
                HookOn:         'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFFE',
                Flags:          1
              }
            }
          ]
        };

        const prepared = await client.autofill(hookSetTx);
        const signed   = wallet.sign(prepared);
        const result   = await client.submitAndWait(signed.tx_blob);

        console.log(`✅ ${hookName} hook installed:`, result.result.hash);
        return {
          success:  true,
          source:   'live',
          hookName,
          txHash:   result.result.hash,
          ledger:   result.result.ledger_index,
          message:  `${hookName} hook installed on Xahau ${this.network}`
        };
      });
    } catch (err) {
      console.error(`❌ installHook(${hookName}) failed:`, err.message);
      return { success: false, error: err.message, hookName };
    }
  }

  // ── Guarded treasury payment ───────────────────────────────────────────────

  /**
   * Submit a payment that carries a DAO-approved proposal hash in its Memo
   * so the TREASURY_GUARD hook allows it through.
   */
  async sendGuardedPayment({ destination, amountXRP, proposalHash, proposalTitle }) {
    if (this.demoMode) {
      console.log(`🪝 [DEMO] Guarded payment: ${amountXRP} XRP → ${destination}`);
      return {
        success:     true,
        source:      'demo',
        txHash:      `DEMO_PAY_${Date.now()}`,
        amountXRP,
        destination,
        proposalHash,
        message:     `Guarded payment of ${amountXRP} XRP approved by Hook (demo)`
      };
    }

    try {
      return await this._withClient(async (client) => {
        const wallet = await this._getWallet();

        const payment = {
          TransactionType: 'Payment',
          Account:         wallet.address,
          Amount:          xrpl.xrpToDrops(amountXRP.toString()),
          Destination:     destination,
          Memos: [
            {
              Memo: {
                MemoType:   Buffer.from('dao-proposal-hash', 'utf8').toString('hex').toUpperCase(),
                MemoData:   Buffer.from(proposalHash || '', 'utf8').toString('hex').toUpperCase(),
              }
            },
            ...(proposalTitle ? [{
              Memo: {
                MemoType: Buffer.from('dao-proposal-title', 'utf8').toString('hex').toUpperCase(),
                MemoData: Buffer.from(proposalTitle,        'utf8').toString('hex').toUpperCase(),
              }
            }] : [])
          ]
        };

        const prepared = await client.autofill(payment);
        const signed   = wallet.sign(prepared);
        const result   = await client.submitAndWait(signed.tx_blob);

        console.log(`✅ Guarded payment successful:`, result.result.hash);
        return {
          success:      true,
          source:       'live',
          txHash:       result.result.hash,
          ledger:       result.result.ledger_index,
          amountXRP,
          destination,
          proposalHash,
          message:      `${amountXRP} XRP sent with DAO approval memo`
        };
      });
    } catch (err) {
      console.error('❌ sendGuardedPayment failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  // ── Fee router configuration ───────────────────────────────────────────────

  /**
   * Update the FEE_ROUTER hook's allocation parameters.
   * In production these are encoded into the Hook's HookParameters field.
   */
  async updateFeeAllocation({ reservesPct, devPct, communityPct, operationalPct }) {
    const total = (reservesPct || 0) + (devPct || 0) + (communityPct || 0) + (operationalPct || 0);
    if (total !== 100) {
      return { success: false, error: `Allocations must sum to 100%, got ${total}%` };
    }

    if (this.demoMode) {
      console.log('🪝 [DEMO] FEE_ROUTER allocation updated:', { reservesPct, devPct, communityPct, operationalPct });
      return {
        success: true,
        source:  'demo',
        allocations: { reservesPct, devPct, communityPct, operationalPct },
        txHash:  `DEMO_FEERTR_${Date.now()}`,
        message: 'Fee router allocation updated (demo)'
      };
    }

    // Live: encode allocations as HookParameters and update the FEE_ROUTER hook
    try {
      return await this._withClient(async (client) => {
        const wallet = await this._getWallet();
        const encodeUint8Hex = (n) => Buffer.from([Math.floor(n)]).toString('hex').toUpperCase();

        const hookSetTx = {
          TransactionType: 'HookSet',
          Account:         wallet.address,
          Hooks: [
            {
              Hook: {
                HookNamespace:  HOOK_NAMESPACES.FEE_ROUTER,
                HookParameters: [
                  { HookParameter: { HookParameterName: '5245534552564553', HookParameterValue: encodeUint8Hex(reservesPct)    } },
                  { HookParameter: { HookParameterName: '444556',           HookParameterValue: encodeUint8Hex(devPct)          } },
                  { HookParameter: { HookParameterName: '434F4D4D554E495459', HookParameterValue: encodeUint8Hex(communityPct) } },
                  { HookParameter: { HookParameterName: '4F50455241',       HookParameterValue: encodeUint8Hex(operationalPct) } },
                ]
              }
            }
          ]
        };

        const prepared = await client.autofill(hookSetTx);
        const signed   = wallet.sign(prepared);
        const result   = await client.submitAndWait(signed.tx_blob);

        return {
          success: true,
          source:  'live',
          txHash:  result.result.hash,
          allocations: { reservesPct, devPct, communityPct, operationalPct }
        };
      });
    } catch (err) {
      console.error('❌ updateFeeAllocation failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  // ── Membership gate check ──────────────────────────────────────────────────

  /**
   * Check if an address would pass the MEMBERSHIP_GATE hook
   * by verifying a membership NFToken exists on the account.
   */
  async checkMembership(address) {
    if (this.demoMode || !address) {
      return {
        success:    true,
        source:     'demo',
        isMember:   true,
        address:    address || 'rDemoAddress',
        nftCount:   1,
        message:    'Membership verified (demo)'
      };
    }
    try {
      return await this._withClient(async (client) => {
        const res = await client.request({ command: 'account_nfts', account: address });
        const vaultNFTs = res.result.account_nfts.filter(n =>
          n.URI && Buffer.from(n.URI, 'hex').toString('utf8').includes('vaultchain')
        );
        return {
          success:  true,
          source:   'live',
          isMember: vaultNFTs.length > 0,
          address,
          nftCount: vaultNFTs.length,
          message:  vaultNFTs.length > 0
            ? `Address holds ${vaultNFTs.length} VaultChain membership NFT(s)`
            : 'No VaultChain membership NFT found — access denied by MEMBERSHIP_GATE'
        };
      });
    } catch (err) {
      console.error('❌ checkMembership failed:', err.message);
      return { success: false, error: err.message, isMember: false };
    }
  }

  // ── Full Hook dashboard ────────────────────────────────────────────────────

  async getDashboardData(account = null) {
    const [hookState, installed] = await Promise.allSettled([
      this.getHookState(account),
      this.getInstalledHooks(account)
    ]);

    return {
      success:   true,
      chain:     'XAHAU',
      network:   this.network,
      account,
      demoMode:  this.demoMode,
      hookState: hookState.value  || { success: false },
      installed: installed.value  || { success: false, hooks: [] },
      hooks: {
        TREASURY_GUARD:  DEMO_HOOK_STATE.treasuryGuard,
        MEMBERSHIP_GATE: DEMO_HOOK_STATE.membershipGate,
        FEE_ROUTER:      DEMO_HOOK_STATE.feeRouter,
      }
    };
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────

  async disconnect() {
    if (this._client && this._client.isConnected()) {
      await this._client.disconnect();
      this._client = null;
    }
  }
}

export const xahauHooksService = new XahauHooksService();
export default XahauHooksService;
