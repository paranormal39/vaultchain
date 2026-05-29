/**
 * @file CardanoService.js
 * @description Cardano / Blockfrost integration service
 *
 * Attempts real Blockfrost API calls when BLOCKFROST_API_KEY is set.
 * Falls back to realistic demo data so the UI always works offline.
 *
 * Endpoints used:
 *   GET /blocks/latest                - network tip / status
 *   GET /addresses/{address}          - address info + balance
 *   GET /addresses/{address}/utxos    - UTXOs (for balance calc)
 *   GET /assets/policy/{policyId}     - native tokens under a policy
 *   POST /tx/submit                   - submit signed tx (future)
 */

import { NETWORKS } from '../config/endpoints.js';

const BLOCKFROST_MAINNET = 'https://cardano-mainnet.blockfrost.io/api/v0';
const BLOCKFROST_PREPROD = 'https://cardano-preprod.blockfrost.io/api/v0';

// ── Demo data ─────────────────────────────────────────────────────────────────

const DEMO_ADDRESS_INFO = {
  address: 'addr1q9z8xkf5lp3m2n4r6t8v0w2y4z6a8b0c2d4e6f8g0h2i4j6k8l0m',
  amount: [{ unit: 'lovelace', quantity: '4250000000' }],
  stake_address: 'stake1u9xyz123abc',
  type: 'shelley',
  script: false
};

const DEMO_POOL = {
  pool_id: 'pool1pu5jlj4q9w955702d6kjf7lad5ac6ewxy5wkk4zm4z4d2fawkj',
  hex: 'pool1pu5jlj4q9w955702d6kjf7lad5ac6ewxy5wkk4zm4z4d2fawkj',
  vrf_key: 'vrf_key_demo',
  blocks_minted: 1247,
  live_stake: '32000000000000',
  live_size: 0.0032,
  live_saturation: 0.43,
  live_delegators: 1847,
  active_stake: '31500000000000',
  active_size: 0.0031,
  declared_pledge: '500000000000',
  live_pledge: '510000000000',
  margin_cost: 0.03,
  fixed_cost: '340000000',
  reward_account: 'stake1u_reward_demo',
  owners: [],
  registration: [],
  retirement: []
};

const DEMO_TRENDING_TOKENS = [
  { unit: 'hosky', ticker: 'HOSKY', name: 'Hosky Token',   price_usd: 0.0000009, change_24h:  55.0, volume_24h: 4200000,  policy_id: 'a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235' },
  { unit: 'min',   ticker: 'MIN',   name: 'Minswap',        price_usd: 0.052,     change_24h:  12.1, volume_24h: 1800000,  policy_id: '29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c6' },
  { unit: 'snek',  ticker: 'SNEK',  name: 'Snek',           price_usd: 0.0035,    change_24h:  30.0, volume_24h: 2400000,  policy_id: '279c909f348e533da5808898f87f9a14bb2c3dfbbacccd631d927a3f' },
  { unit: 'gens',  ticker: 'GENS',  name: 'Genius Yield',   price_usd: 0.034,     change_24h:   8.5, volume_24h:  950000,  policy_id: 'dda5fdb1002f7389b33e036b6afee82a8189becb6cba852e8b79b4fb' },
  { unit: 'copi',  ticker: 'COPI',  name: 'Cornucopias',    price_usd: 0.021,     change_24h:  -2.3, volume_24h:  620000,  policy_id: 'b6a7467ea1deb012808ef4e87b5ff371e85f7142d7b356a40d9b42a0' },
];

const DEMO_STAKE_POOLS = [
  { ticker: 'ORCAS', name: 'Orca Stake Pool',   apy: 4.1, pledge: '1M ADA',  saturation: 42 },
  { ticker: 'HAPPY', name: 'Happy Stake Pool',   apy: 3.9, pledge: '500K ADA', saturation: 61 },
  { ticker: 'BLOOM', name: 'Bloom Stake Pool',   apy: 4.3, pledge: '2M ADA',  saturation: 35 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const lovelaceToAda = (lovelace) => parseInt(lovelace, 10) / 1_000_000;

// ── Service class ─────────────────────────────────────────────────────────────

export class CardanoService {
  constructor(config = {}) {
    this.apiKey   = config.apiKey   || (typeof process !== 'undefined' ? process.env.BLOCKFROST_API_KEY   : null) || null;
    this.network  = config.network  || (typeof process !== 'undefined' ? process.env.CARDANO_NETWORK       : null) || NETWORKS.CARDANO.network || 'testnet';
    this.baseUrl  = this.network === 'mainnet' ? BLOCKFROST_MAINNET : BLOCKFROST_PREPROD;
    this.demoMode = !this.apiKey;

    if (this.demoMode) {
      console.log('🔷 CardanoService running in DEMO mode — set BLOCKFROST_API_KEY in .env for live data');
    } else {
      console.log(`🔷 CardanoService connected to Cardano ${this.network} via Blockfrost`);
    }
  }

  // ── Internal fetch wrapper ──────────────────────────────────────────────────

  async _fetch(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const headers = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers['project_id'] = this.apiKey;

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Blockfrost ${res.status}: ${text}`);
    }
    return res.json();
  }

  // ── Network status ─────────────────────────────────────────────────────────

  async getNetworkStatus() {
    if (this.demoMode) {
      return {
        success: true,
        source: 'demo',
        data: {
          network: this.network,
          slot: 120_456_789,
          epoch: 467,
          block_height: 10_245_678,
          synced: true
        }
      };
    }
    try {
      const block = await this._fetch('/blocks/latest');
      return {
        success: true,
        source: 'blockfrost',
        data: {
          network:      this.network,
          slot:         block.slot,
          epoch:        block.epoch,
          block_height: block.height,
          synced:       true
        }
      };
    } catch (err) {
      console.error('❌ Blockfrost getNetworkStatus failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  // ── Address / wallet info ──────────────────────────────────────────────────

  async getAddressInfo(address) {
    if (this.demoMode || !address) {
      const adaBalance = lovelaceToAda(DEMO_ADDRESS_INFO.amount[0].quantity);
      return {
        success: true,
        source: 'demo',
        address: DEMO_ADDRESS_INFO.address,
        adaBalance,
        lovelace: DEMO_ADDRESS_INFO.amount[0].quantity,
        nativeTokens: [],
        stakeAddress: DEMO_ADDRESS_INFO.stake_address
      };
    }
    try {
      const info  = await this._fetch(`/addresses/${address}`);
      const ada   = info.amount.find(a => a.unit === 'lovelace');
      const tokens = info.amount.filter(a => a.unit !== 'lovelace');
      return {
        success: true,
        source: 'blockfrost',
        address,
        adaBalance: ada ? lovelaceToAda(ada.quantity) : 0,
        lovelace: ada?.quantity || '0',
        nativeTokens: tokens,
        stakeAddress: info.stake_address
      };
    } catch (err) {
      console.error('❌ Blockfrost getAddressInfo failed:', err.message);
      return { success: false, error: err.message, adaBalance: 0 };
    }
  }

  // ── Trending native tokens ─────────────────────────────────────────────────

  async getTrendingTokens() {
    // Blockfrost doesn't have a trending endpoint — we always return curated demo data
    // augmented with live prices if a price oracle is wired later.
    return {
      success: true,
      source: 'demo',
      tokens: DEMO_TRENDING_TOKENS.map(t => ({
        ...t,
        price_usd: t.price_usd * (1 + (Math.random() - 0.5) * 0.05)
      }))
    };
  }

  // ── Stake pool recommendations ─────────────────────────────────────────────

  async getStakePoolRecommendations() {
    if (this.demoMode) {
      return { success: true, source: 'demo', pools: DEMO_STAKE_POOLS };
    }
    try {
      const pools = await this._fetch('/pools?page=1&count=3&order=desc');
      return { success: true, source: 'blockfrost', pools };
    } catch (err) {
      console.error('❌ Blockfrost getStakePools failed:', err.message);
      return { success: true, source: 'fallback', pools: DEMO_STAKE_POOLS };
    }
  }

  // ── Delegation / staking info ──────────────────────────────────────────────

  async getStakeInfo(stakeAddress) {
    if (this.demoMode || !stakeAddress) {
      return {
        success: true,
        source: 'demo',
        data: {
          active: true,
          active_epoch: 400,
          controlled_amount: '4250000000',
          rewards_sum: '18500000',
          withdrawals_sum: '0',
          reserves_sum: '0',
          treasury_sum: '0',
          withdrawable_amount: '18500000',
          pool_id: DEMO_POOL.pool_id,
          pool: DEMO_POOL
        }
      };
    }
    try {
      const info = await this._fetch(`/accounts/${stakeAddress}`);
      return { success: true, source: 'blockfrost', data: info };
    } catch (err) {
      console.error('❌ Blockfrost getStakeInfo failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  // ── DeFi opportunities snapshot ────────────────────────────────────────────

  async getDeFiOpportunities() {
    const tokens  = await this.getTrendingTokens();
    const pools   = await this.getStakePoolRecommendations();
    const bestApy = pools.pools.reduce((best, p) => p.apy > best ? p.apy : best, 0);

    return {
      success: true,
      source: tokens.source,
      opportunities: [
        {
          type: 'STAKING',
          protocol: pools.pools[0]?.name || 'Top Stake Pool',
          apy: bestApy,
          risk: 'LOW',
          chain: 'CARDANO',
          asset: 'ADA',
          description: `Delegate to ${pools.pools[0]?.ticker} for ~${bestApy}% annual rewards`
        },
        {
          type: 'DEX_LIQUIDITY',
          protocol: 'Minswap',
          apy: 9.7,
          risk: 'MEDIUM',
          chain: 'CARDANO',
          asset: 'MIN/ADA',
          description: 'Provide MIN/ADA liquidity on Minswap'
        },
        {
          type: 'YIELD_FARMING',
          protocol: 'Genius Yield',
          apy: 12.3,
          risk: 'MEDIUM',
          chain: 'CARDANO',
          asset: 'GENS',
          description: 'GENS yield optimization strategy'
        }
      ],
      trendingTokens: tokens.tokens
    };
  }

  // ── Full dashboard snapshot ────────────────────────────────────────────────

  async getDashboardData(address = null) {
    const [status, addressInfo, opportunities] = await Promise.allSettled([
      this.getNetworkStatus(),
      this.getAddressInfo(address),
      this.getDeFiOpportunities()
    ]);

    return {
      success: true,
      chain: 'CARDANO',
      network: this.network,
      status:       status.value       || { success: false },
      wallet:       addressInfo.value  || { success: false, adaBalance: 0 },
      opportunities: opportunities.value || { success: false, opportunities: [] }
    };
  }
}

export const cardanoService = new CardanoService();
export default CardanoService;
