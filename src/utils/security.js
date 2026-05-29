/**
 * @file security.js
 * @description Client-side security utilities for VaultChain DAO frontend
 *
 * - sanitizeInput   : strip dangerous characters before displaying user data
 * - validateAddress : basic format checks for chain addresses
 * - maskSecret      : truncate secrets for display (never log full keys)
 * - isValidXRPAddress / isValidCardanoAddress / isValidMidnightAddress
 * - rateGuard       : simple in-memory call throttle for UI actions
 */

// ── String sanitization ───────────────────────────────────────────────────────

/**
 * Strip HTML/script-injection characters from any user-provided string.
 * Use before rendering untrusted data into the DOM.
 */
export function sanitizeInput(value, maxLength = 500) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/[<>"'`\\]/g, '')
    .substring(0, maxLength)
    .trim();
}

/**
 * Truncate a secret/key for safe display (e.g. logs, UI hints).
 * Never display full seeds or private keys.
 */
export function maskSecret(secret, visibleChars = 6) {
  if (!secret || typeof secret !== 'string') return '***';
  if (secret.length <= visibleChars * 2) return '*'.repeat(secret.length);
  return `${secret.substring(0, visibleChars)}…${secret.slice(-visibleChars)}`;
}

// ── Address format validators ─────────────────────────────────────────────────

/**
 * XRPL / Xahau addresses start with 'r' and are 25-34 base58 characters.
 */
export function isValidXRPAddress(addr) {
  return typeof addr === 'string' && /^r[1-9A-HJ-NP-Za-km-z]{24,33}$/.test(addr);
}

/**
 * Cardano addresses start with 'addr1' (Shelley mainnet) or 'addr_test1' (testnet).
 */
export function isValidCardanoAddress(addr) {
  return typeof addr === 'string' && /^addr(1|_test1)[a-z0-9]{50,}$/.test(addr);
}

/**
 * Midnight shielded addresses start with 'mn_shield-addr'.
 */
export function isValidMidnightAddress(addr) {
  return typeof addr === 'string' && addr.startsWith('mn_shield-addr') && addr.length > 30;
}

/**
 * Generic address validator — detects chain by prefix.
 */
export function validateAddress(addr) {
  if (isValidXRPAddress(addr))       return { valid: true, chain: 'XRPL' };
  if (isValidCardanoAddress(addr))   return { valid: true, chain: 'CARDANO' };
  if (isValidMidnightAddress(addr))  return { valid: true, chain: 'MIDNIGHT' };
  return { valid: false, chain: null };
}

// ── Amount validators ─────────────────────────────────────────────────────────

/**
 * Validate a transaction amount — positive, finite, reasonable upper bound.
 */
export function isValidAmount(value, { min = 0, max = 1e12 } = {}) {
  const n = Number(value);
  return !isNaN(n) && isFinite(n) && n > min && n <= max;
}

// ── UI rate guard ─────────────────────────────────────────────────────────────

const _rateGuardStore = new Map();

/**
 * Prevent a UI action from firing more than `maxCalls` times per `windowMs`.
 * Returns true if the call is allowed, false if rate-limited.
 *
 * Usage:
 *   if (!rateGuard('submitProposal', { maxCalls: 3, windowMs: 10000 })) {
 *     alert('Please wait before submitting again.');
 *     return;
 *   }
 */
export function rateGuard(key, { maxCalls = 5, windowMs = 30_000 } = {}) {
  const now = Date.now();
  const rec = _rateGuardStore.get(key) || { count: 0, start: now };
  if (now - rec.start > windowMs) { rec.count = 0; rec.start = now; }
  rec.count++;
  _rateGuardStore.set(key, rec);
  return rec.count <= maxCalls;
}

// ── Env variable safety ───────────────────────────────────────────────────────

/**
 * Return true if the app is configured with real API keys (not placeholder strings).
 * Useful for switching between demo mode and live mode in the UI.
 */
export function isRealApiKey(value) {
  if (!value || typeof value !== 'string') return false;
  const placeholders = ['your_', 'xxx', 'placeholder', 'changeme', 'secret_here', 'api_key_here'];
  const lower = value.toLowerCase();
  return !placeholders.some(p => lower.includes(p)) && value.length >= 10;
}
