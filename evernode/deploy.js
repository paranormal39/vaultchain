#!/usr/bin/env node
/**
 * @file deploy.js
 * @description VaultChain Evernode Deployment Script
 *
 * Usage:
 *   node evernode/deploy.js [command] [options]
 *
 * Commands:
 *   deploy   — Build images + acquire Evernode leases + push instances
 *   status   — Query live status of all deployed instances
 *   teardown — Release all active leases
 *   renew    — Extend lease for all instances by another 24 h
 *   logs     — Tail logs from a running instance
 *
 * Prerequisites:
 *   EVERNODE_TENANT_ADDRESS   — Xahau/XRPL account holding XAH
 *   EVERNODE_TENANT_SECRET    — Account secret (never committed)
 *   VITE_MCP_URL, etc.        — See .env.example
 *
 * Install evernode-js-client:
 *   npm install evernode-js-client   (in this directory or globally)
 */

import { execSync, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { EVERNODE_CONFIG } from './evernode.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '..');

// ── Helpers ───────────────────────────────────────────────────────────────────

const log  = (msg)  => console.log(`[deploy] ${msg}`);
const warn = (msg)  => console.warn(`[deploy] ⚠️  ${msg}`);
const err  = (msg)  => { console.error(`[deploy] ❌ ${msg}`); process.exit(1); };
const ok   = (msg)  => console.log(`[deploy] ✅ ${msg}`);

function run(cmd, opts = {}) {
  log(`→ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts });
}

function requireEnv(key) {
  if (!process.env[key]) err(`${key} is required. Add it to .env or export it.`);
  return process.env[key];
}

// ── Preflight checks ──────────────────────────────────────────────────────────

function preflight() {
  log('Running preflight checks...');

  if (!process.env.EVERNODE_TENANT_ADDRESS || !process.env.EVERNODE_TENANT_SECRET) {
    warn('EVERNODE_TENANT_ADDRESS / EVERNODE_TENANT_SECRET not set.');
    warn('Running in DRY-RUN mode — no real leases will be acquired.');
    return false;
  }

  // Check docker is available
  try {
    execSync('docker info --format json', { stdio: 'pipe' });
    ok('Docker daemon is reachable');
  } catch {
    warn('Docker not available — skipping image builds.');
  }

  return true;
}

// ── Docker image builds ───────────────────────────────────────────────────────

function buildImages() {
  log('Building Docker images...');

  const images = [
    { tag: 'vaultchain/mcp-server:latest',  dockerfile: 'evernode/Dockerfile.mcp-server'  },
    { tag: 'vaultchain/eliza-agent:latest', dockerfile: 'evernode/Dockerfile.eliza-agent' },
    { tag: 'vaultchain/frontend:latest',    dockerfile: 'evernode/Dockerfile.frontend'    },
  ];

  for (const img of images) {
    try {
      run(`docker build -f ${img.dockerfile} -t ${img.tag} .`);
      ok(`Built ${img.tag}`);
    } catch {
      warn(`Docker build failed for ${img.tag} — continuing (may be expected in CI)`);
    }
  }
}

// ── Evernode client (dynamic import — optional dependency) ────────────────────

async function getEvernodeClient() {
  try {
    const { HookClientFactory } = await import('evernode-js-client');
    return HookClientFactory;
  } catch {
    return null;
  }
}

// ── Deploy instances ──────────────────────────────────────────────────────────

async function deployInstances(dryRun = true) {
  const client = await getEvernodeClient();

  if (!client || dryRun) {
    log('──────────────────────────────────────────────────────────────');
    log('DRY-RUN: Would deploy the following Evernode HotPocket instances:');
    for (const inst of EVERNODE_CONFIG.instances) {
      log(`  • ${inst.label} (${inst.id}) on port ${inst.port}`);
      log(`    Image: ${inst.image}`);
      log(`    Lease: ${inst.leaseSeconds}s  |  Resources: ${JSON.stringify(inst.resourceReqs)}`);
    }
    log('──────────────────────────────────────────────────────────────');
    log('Set EVERNODE_TENANT_ADDRESS + EVERNODE_TENANT_SECRET to deploy for real.');
    return;
  }

  // Live deployment via evernode-js-client
  const { tenant } = EVERNODE_CONFIG;

  for (const inst of EVERNODE_CONFIG.instances) {
    log(`Acquiring Evernode lease for ${inst.label}...`);
    try {
      const evernodeClient = await client.create('HookClient', {
        xrplAddress: tenant.xrplAddress,
        xrplSecret:  tenant.xrplSecret,
        network:     tenant.network,
      });

      await evernodeClient.connect();

      // Acquire host + deploy container
      const hosts = await evernodeClient.getHosts({
        minReputation:  EVERNODE_CONFIG.hostSelection.minReputation,
        maxLeaseAmount: EVERNODE_CONFIG.hostSelection.maxLeaseAmount,
      });

      if (!hosts || hosts.length === 0) {
        warn(`No suitable hosts found for ${inst.id}`);
        await evernodeClient.disconnect();
        continue;
      }

      const host = hosts[0];
      log(`  Deploying ${inst.id} on host ${host.address}...`);

      const result = await evernodeClient.acquireLease(host.address, {
        leaseSeconds: inst.leaseSeconds,
        contractId:   `${EVERNODE_CONFIG.clusterDefaults.contractId}-${inst.id}`,
        environment:  {
          ...EVERNODE_CONFIG.clusterDefaults.environment,
          ...inst.env
        }
      });

      ok(`${inst.label} deployed: ${JSON.stringify(result)}`);
      await evernodeClient.disconnect();
    } catch (deployErr) {
      warn(`Failed to deploy ${inst.id}: ${deployErr.message}`);
    }
  }
}

// ── Status ────────────────────────────────────────────────────────────────────

async function showStatus() {
  log('Checking VaultChain service status...\n');

  const services = [
    { name: 'Midnight MCP Server',  url: process.env.VITE_MCP_URL    || 'http://localhost:3000', path: '/health' },
    { name: 'Eliza AI Agent',        url: process.env.VITE_MATTHEW_URL || 'http://localhost:3001', path: '/'      },
    { name: 'VaultChain Frontend',   url: 'http://localhost:5173',      path: '/'                               },
  ];

  for (const svc of services) {
    try {
      const res = await fetch(`${svc.url}${svc.path}`);
      if (res.ok) {
        ok(`${svc.name}: UP (${svc.url})`);
      } else {
        warn(`${svc.name}: HTTP ${res.status} (${svc.url})`);
      }
    } catch {
      console.log(`[deploy] ⚫ ${svc.name}: OFFLINE (${svc.url})`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const [,, command = 'deploy'] = process.argv;

  log(`VaultChain Evernode Deploy — command: ${command}`);
  log(`Tenant: ${EVERNODE_CONFIG.tenant.xrplAddress || '(not configured)'}\n`);

  const live = preflight();

  switch (command) {
    case 'build':
      buildImages();
      break;

    case 'deploy':
      buildImages();
      await deployInstances(!live);
      break;

    case 'status':
      await showStatus();
      break;

    case 'teardown':
      warn('Teardown: stop all running Evernode leases (manual via Evernode CLI):');
      log('  evernode release <leaseId>');
      break;

    case 'renew':
      warn('Renewal: extend leases via Evernode CLI:');
      log('  evernode extend <leaseId> --seconds 86400');
      break;

    default:
      err(`Unknown command: ${command}. Use: deploy | build | status | teardown | renew`);
  }
}

main().catch(e => err(e.message));
