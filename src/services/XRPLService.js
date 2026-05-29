/**
 * @file XRPLService.js
 * @description Real XRPL / Xahau integration using the xrpl npm package
 *
 * Uses the already-installed `xrpl` package (v4) for live network calls.
 * Falls back to demo data when the network is unreachable.
 *
 * Supported operations:
 *  - getServerInfo      – ledger / network health
 *  - getAccountInfo     – balance + sequence for an address
 *  - getAccountOffers   – open DEX orders
 *  - getTrustLines      – issued token balances
 *  - getRecentTxs       – last N transactions
 *  - getMarketData      – XRP price + volume (demo until price oracle wired)
 *  - getDashboardData   – full snapshot for UI
 */

import * as xrpl from 'xrpl';
import { NETWORKS } from '../config/endpoints.js';

// ── Config ────────────────────────────────────────────────────────────────────

const XRPL_MAINNET  = 'wss://xrplcluster.com/';
const XRPL_TESTNET  = 'wss://s.altnet.rippletest.net:51233/';
const XAHAU_MAINNET = 'wss://xahau.network/';
const XAHAU_TESTNET = 'wss://xahau-test.net/';

// ── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_ACCOUNT = {
  address:  'rHBDKh8VXZpYK8rGhoQsL4qpo4kSLcCB46',
  balance:  '100000000',    // 100 XRP in drops
  sequence: 12345678
};

const DEMO_MARKET = {
  xrp: {
    price_usd:    0.52,
    change_24h:   2.3,
    volume_24h:   450_000_000,
    market_cap:   28_500_000_000
  },
  xahau: {
    price_usd:    0.018,
    change_24h:   1.1,
    volume_24h:   4_200_000,
    market_cap:   220_000_000
  }
};

const DEMO_PAYMENT_CHANNELS = [
  { corridor: 'USD-EUR', volume_24h: 125_000_000, savings_pct: 68 },
  { corridor: 'USD-JPY', volume_24h:  89_000_000, savings_pct: 71 },
  { corridor: 'EUR-GBP', volume_24h:  67_000_000, savings_pct: 65 },
];

// ── Service class ─────────────────────────────────────────────────────────────

export class XRPLService {
  constructor(config = {}) {
    this.network  = config.network  || NETWORKS.XRPL.network  || 'mainnet';
    this.useXahau = config.useXahau || false;

    if (this.useXahau) {
      this.wsUrl = this.network === 'mainnet' ? XAHAU_MAINNET : XAHAU_TESTNET;
    } else {
      this.wsUrl = this.network === 'mainnet' ? XRPL_MAINNET : XRPL_TESTNET;
    }

    this._client = null;
    console.log(`🌊 XRPLService targeting ${this.useXahau ? 'Xahau' : 'XRPL'} ${this.network} (${this.wsUrl})`);
  }

  // ── Connection helpers ─────────────────────────────────────────────────────

  async _getClient() {
    if (this._client && this._client.isConnected()) return this._client;
    const client = new xrpl.Client(this.wsUrl);
    await client.connect();
    this._client = client;
    return client;
  }

  async _withClient(fn) {
    try {
      const client = await this._getClient();
      return await fn(client);
    } catch (err) {
      console.error('❌ XRPL client error:', err.message);
      // Disconnect so next call gets a fresh connection
      if (this._client) {
        try { await this._client.disconnect(); } catch (_) { /* ignore */ }
        this._client = null;
      }
      throw err;
    }
  }

  // ── Network / server status ────────────────────────────────────────────────

  async getServerInfo() {
    try {
      return await this._withClient(async (client) => {
        const res  = await client.request({ command: 'server_info' });
        const info = res.result.info;
        return {
          success: true,
          source: 'live',
          data: {
            network:        this.useXahau ? 'Xahau' : 'XRPL',
            server_state:   info.server_state,
            ledger_index:   info.validated_ledger?.seq,
            base_fee_xrp:   info.validated_ledger?.base_fee_xrp,
            reserve_base:   info.validated_ledger?.reserve_base_xrp,
            load_factor:    info.load_factor
          }
        };
      });
    } catch (err) {
      return {
        success: true,
        source: 'demo',
        data: {
          network:      this.useXahau ? 'Xahau' : 'XRPL',
          server_state: 'full',
          ledger_index: 87_234_567,
          base_fee_xrp: 0.000012,
          reserve_base: 10,
          load_factor:  1
        }
      };
    }
  }

  // ── Account info ───────────────────────────────────────────────────────────

  async getAccountInfo(address) {
    if (!address) {
      return {
        success: true,
        source: 'demo',
        address:     DEMO_ACCOUNT.address,
        xrpBalance:  xrpl.dropsToXrp(DEMO_ACCOUNT.balance),
        drops:       DEMO_ACCOUNT.balance,
        sequence:    DEMO_ACCOUNT.sequence
      };
    }
    try {
      return await this._withClient(async (client) => {
        const res     = await client.request({ command: 'account_info', account: address, ledger_index: 'validated' });
        const acct    = res.result.account_data;
        return {
          success: true,
          source: 'live',
          address,
          xrpBalance: xrpl.dropsToXrp(acct.Balance),
          drops:      acct.Balance,
          sequence:   acct.Sequence
        };
      });
    } catch (err) {
      console.error('❌ XRPL getAccountInfo failed:', err.message);
      return { success: false, error: err.message, xrpBalance: 0 };
    }
  }

  // ── Trust lines (issued tokens) ────────────────────────────────────────────

  async getTrustLines(address) {
    const addr = address || DEMO_ACCOUNT.address;
    try {
      return await this._withClient(async (client) => {
        const res = await client.request({ command: 'account_lines', account: addr });
        return { success: true, source: 'live', lines: res.result.lines };
      });
    } catch (err) {
      return {
        success: true,
        source: 'demo',
        lines: [
          { currency: 'SOLO', balance: '250.5',  limit: '1000000000', account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh' },
          { currency: 'CSC',  balance: '1500.0', limit: '1000000000', account: 'rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr' }
        ]
      };
    }
  }

  // ── Recent transactions ────────────────────────────────────────────────────

  async getRecentTransactions(address, limit = 5) {
    const addr = address || DEMO_ACCOUNT.address;
    try {
      return await this._withClient(async (client) => {
        const res = await client.request({ command: 'account_tx', account: addr, limit });
        return {
          success: true,
          source: 'live',
          transactions: res.result.transactions.map(t => ({
            hash:   t.tx.hash,
            type:   t.tx.TransactionType,
            amount: t.tx.Amount,
            date:   t.tx.date
          }))
        };
      });
    } catch (err) {
      return {
        success: true,
        source: 'demo',
        transactions: Array.from({ length: limit }, (_, i) => ({
          hash:   `DEMO${Date.now()}${i}`,
          type:   i % 2 === 0 ? 'Payment' : 'OfferCreate',
          amount: `${(Math.random() * 100 + 1).toFixed(2)} XRP`,
          date:   new Date(Date.now() - i * 3600000).toISOString()
        }))
      };
    }
  }

  // ── Market data (demo until price oracle) ─────────────────────────────────

  async getMarketData() {
    const live = { ...DEMO_MARKET };
    live.xrp.price_usd   += (Math.random() - 0.5) * 0.02;
    live.xahau.price_usd += (Math.random() - 0.5) * 0.001;
    return {
      success: true,
      source: 'demo',
      data: {
        ...live,
        paymentChannels: DEMO_PAYMENT_CHANNELS,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  // ── Cross-border opportunities ─────────────────────────────────────────────

  async getCrossBorderOpportunities() {
    return {
      success: true,
      source: 'demo',
      opportunities: [
        { route: 'US → EU',   spread: '1.82%', volume: 4_200_000, confidence: 0.87 },
        { route: 'ASIA → US', spread: '2.14%', volume: 2_800_000, confidence: 0.81 },
      ]
    };
  }

  // ── Full dashboard snapshot ────────────────────────────────────────────────

  async getDashboardData(address = null) {
    const [server, account, market, xBorder] = await Promise.allSettled([
      this.getServerInfo(),
      this.getAccountInfo(address),
      this.getMarketData(),
      this.getCrossBorderOpportunities()
    ]);

    return {
      success: true,
      chain: 'XRPL',
      network: this.network,
      server:        server.value        || { success: false },
      wallet:        account.value       || { success: false, xrpBalance: 0 },
      market:        market.value        || { success: false },
      crossBorder:   xBorder.value       || { success: false }
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

export const xrplService = new XRPLService();
export default XRPLService;
