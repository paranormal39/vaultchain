#!/usr/bin/env node
/**
 * @file health-check.js
 * @description Unified multi-service health probe for VaultChain DAO
 *
 * Used by:
 *  - Docker HEALTHCHECK (exit 0 = healthy, exit 1 = unhealthy)
 *  - Evernode watchdog
 *  - CI/CD pipeline readiness gates
 *  - `npm run deploy:status` (via deploy.js)
 *
 * Usage:
 *   node evernode/health-check.js               # check all services, print summary
 *   node evernode/health-check.js --exit-code   # also exit 1 if any service is down
 *   node evernode/health-check.js --json        # output machine-readable JSON
 */

const SERVICES = [
  {
    name:    'Midnight MCP Server',
    url:     process.env.VITE_MCP_URL     || 'http://localhost:3000',
    path:    '/health',
    timeout: 5000,
    required: true,
  },
  {
    name:    'Eliza AI Agent (Matthew)',
    url:     process.env.VITE_MATTHEW_URL || 'http://localhost:3001',
    path:    '/',
    timeout: 5000,
    required: false,   // agent may not be running in minimal deploys
  },
  {
    name:    'VaultChain Frontend',
    url:     `http://localhost:${process.env.VITE_FRONTEND_PORT || 5173}`,
    path:    '/',
    timeout: 5000,
    required: false,
  },
];

const args        = process.argv.slice(2);
const useExitCode = args.includes('--exit-code');
const jsonMode    = args.includes('--json');

async function checkService(svc) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), svc.timeout);

  try {
    const res = await fetch(`${svc.url}${svc.path}`, { signal: controller.signal });
    clearTimeout(timer);
    return {
      name:     svc.name,
      url:      svc.url,
      status:   res.ok ? 'UP' : 'DEGRADED',
      httpCode: res.status,
      required: svc.required,
      latencyMs: null,   // would need Date.now() diff around fetch — omitted for brevity
    };
  } catch (err) {
    clearTimeout(timer);
    return {
      name:     svc.name,
      url:      svc.url,
      status:   'DOWN',
      error:    err.name === 'AbortError' ? 'TIMEOUT' : err.message,
      required: svc.required,
    };
  }
}

async function main() {
  const results = await Promise.all(SERVICES.map(checkService));
  const allRequired = results.filter(r => r.required);
  const anyRequiredDown = allRequired.some(r => r.status === 'DOWN');

  if (jsonMode) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      healthy:   !anyRequiredDown,
      services:  results,
    }, null, 2));
  } else {
    console.log('\n🏥 VaultChain Health Check\n');
    for (const r of results) {
      const icon = r.status === 'UP' ? '✅' : r.status === 'DEGRADED' ? '⚠️ ' : '❌';
      const req  = r.required ? ' (required)' : ' (optional)';
      console.log(`  ${icon}  ${r.name}${req}`);
      console.log(`       ${r.url}  →  ${r.status}${r.error ? ` (${r.error})` : ''}`);
    }
    console.log('');
    if (anyRequiredDown) {
      console.log('❌ One or more REQUIRED services are DOWN.');
    } else {
      console.log('✅ All required services are UP.');
    }
    console.log('');
  }

  if (useExitCode && anyRequiredDown) process.exit(1);
}

main().catch(e => {
  console.error('Health check failed:', e.message);
  process.exit(1);
});
