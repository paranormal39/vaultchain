#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Complete VaultChain DAO system launcher with MCP integration
class VaultChainLauncher {
  getOpenAIKey() {
    try {
      const envPath = path.join(__dirname, 'eliza-agent/.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/OPENAI_API_KEY=(.+)/);
        return match ? match[1].replace(/"/g, '') : null;
      }
    } catch (error) {
      console.warn('Could not read OpenAI key from .env file');
    }
    return process.env.OPENAI_API_KEY || null;
  }

  constructor() {
    const MCP_PORT      = parseInt(process.env.VITE_MCP_PORT      || '3000',  10);
    const MATTHEW_PORT  = parseInt(process.env.VITE_MATTHEW_PORT  || '3001',  10);
    const FRONTEND_PORT = parseInt(process.env.VITE_FRONTEND_PORT || '5173',  10);

    this.services = [
      {
        name: 'Midnight MCP Server',
        command: 'npm',
        args: ['run', 'dev'],
        cwd: path.join(__dirname, 'midnight-mcp-server'),
        port: MCP_PORT,
        description: 'Real Midnight Network blockchain integration',
        healthEndpoint: '/health',
        env: {
          PORT: String(MCP_PORT)
        }
      },
      {
        name: 'AI Agent System (Matthew / Xara / Ada)',
        command: 'npm',
        args: ['start'],
        cwd: path.join(__dirname, 'eliza-agent'),
        port: MATTHEW_PORT,
        description: 'ElizaOS autonomous treasury management — Midnight · XRPL · Cardano',
        healthEndpoint: null,
        env: {
          OPENAI_API_KEY:     process.env.OPENAI_API_KEY     || this.getOpenAIKey(),
          BLOCKFROST_API_KEY: process.env.BLOCKFROST_API_KEY || '',
          XRPL_WALLET_SEED:   process.env.XRPL_WALLET_SEED   || '',
          XAHAU_WALLET_SEED:  process.env.XAHAU_WALLET_SEED  || '',
          VITE_MCP_URL:       process.env.VITE_MCP_URL       || `http://localhost:${MCP_PORT}`,
          VITE_MATTHEW_URL:   process.env.VITE_MATTHEW_URL   || `http://localhost:${MATTHEW_PORT}`,
        }
      },
      {
        name: 'VaultChain Frontend',
        command: 'npm',
        args: ['run', 'dev'],
        cwd: __dirname,
        port: FRONTEND_PORT,
        description: 'Privacy-first DAO treasury dashboard',
        healthEndpoint: null,
        env: {
          VITE_MCP_URL:     process.env.VITE_MCP_URL     || `http://localhost:${MCP_PORT}`,
          VITE_MATTHEW_URL: process.env.VITE_MATTHEW_URL || `http://localhost:${MATTHEW_PORT}`,
        }
      }
    ];
    this.processes = [];
  }

  // Start all services
  async startAll() {
    console.log('🚀 Starting Complete VaultChain DAO System...\n');
    
    // Check prerequisites
    await this.checkPrerequisites();
    
    // Start services in order
    for (const service of this.services) {
      await this.startService(service);
      // Wait between service starts
      await this.sleep(3000);
    }
    
    const mcpUrl      = process.env.VITE_MCP_URL     || `http://localhost:${process.env.VITE_MCP_PORT     || 3000}`;
    const matthewUrl  = process.env.VITE_MATTHEW_URL || `http://localhost:${process.env.VITE_MATTHEW_PORT || 3001}`;
    const frontendUrl = `http://localhost:${process.env.VITE_FRONTEND_PORT || 5173}`;

    console.log('\n✅ VaultChain DAO System Started Successfully!');
    console.log('\n� Complete System Architecture:');
    console.log(`   🌙 Midnight MCP Server:        ${mcpUrl}  (wallet + contracts)`);
    console.log(`   🤖 AI Agents (Matthew/Xara/Ada): ${matthewUrl} (ElizaOS)`);
    console.log(`   🎨 VaultChain Frontend:          ${frontendUrl} (DAO dashboard)`);

    console.log('\n�️ VaultChain Features:');
    console.log('   ✅ Privacy-first ZK membership (Midnight Network)');
    console.log('   ✅ Real Midnight Network wallet + contract integration');
    console.log('   ✅ Cardano / Blockfrost DeFi & staking (Ada Agent)');
    console.log('   ✅ XRPL live ledger data (Xara Agent)');
    console.log('   ✅ Xahau Hooks: TREASURY_GUARD · MEMBERSHIP_GATE · FEE_ROUTER');
    console.log('   ✅ AI-powered treasury management (Matthew Agent)');
    console.log('   ✅ Anonymous governance voting with ZK proofs');
    console.log('   ✅ Evernode HotPocket deployment ready');

    console.log('\n🎯 Ready for:');
    console.log('   • DoraHacks AI Treasury Management Challenge');
    console.log('   • Midnight Network Privacy First Challenge');
    console.log('   • Live demonstrations and hackathon submissions');
    
    console.log('\n🔧 To stop all services, press Ctrl+C');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.stopAll();
    });
    
    // Keep the main process alive
    process.stdin.resume();
  }

  // Check if all required files exist
  async checkPrerequisites() {
    console.log('🔍 Checking VaultChain prerequisites...');
    
    const requiredPaths = [
      { path: 'midnight-mcp-server', type: 'directory', description: 'Midnight MCP Server' },
      { path: 'eliza-agent', type: 'directory', description: 'ElizaOS AI Agent' },
      { path: 'src', type: 'directory', description: 'VaultChain Frontend Source' },
      { path: 'midnight-mcp-server/package.json', type: 'file', description: 'MCP package.json' },
      { path: 'eliza-agent/package.json', type: 'file', description: 'AI Agent package.json' },
      { path: 'package.json', type: 'file', description: 'Frontend package.json' }
    ];
    
    for (const item of requiredPaths) {
      const fullPath = path.join(__dirname, item.path);
      const exists = item.type === 'directory' ? 
        fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory() :
        fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
        
      if (!exists) {
        throw new Error(`Required ${item.type} missing: ${item.path} (${item.description})`);
      }
    }
    
    // Check if dependencies are installed
    await this.checkDependencies();
    
    console.log('✅ Prerequisites check passed\n');
  }

  // Check and install dependencies if needed
  async checkDependencies() {
    const services = [
      { name: 'MCP Server', path: 'midnight-mcp-server', manager: 'yarn' },
      { name: 'AI Agent', path: 'eliza-agent', manager: 'npm' },
      { name: 'Frontend', path: '.', manager: 'npm' }
    ];
    
    for (const service of services) {
      const nodeModulesPath = path.join(__dirname, service.path, 'node_modules');
      
      if (!fs.existsSync(nodeModulesPath)) {
        console.log(`📦 Installing ${service.name} dependencies...`);
        await this.runCommand(service.manager, ['install'], path.join(__dirname, service.path));
      }
    }
  }

  // Start a single service
  async startService(service) {
    console.log(`🔄 Starting ${service.name}...`);
    
    const child = spawn(service.command, service.args, {
      cwd: service.cwd,
      stdio: 'pipe',
      shell: process.platform === 'win32',
      env: { ...process.env, ...service.env }
    });
    
    this.processes.push({
      name: service.name,
      process: child,
      port: service.port,
      healthEndpoint: service.healthEndpoint
    });
    
    // Handle service output
    child.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        console.log(`[${service.name}] ${output}`);
      }
    });
    
    child.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('ExperimentalWarning')) {
        console.error(`[${service.name} ERROR] ${output}`);
      }
    });
    
    child.on('close', (code) => {
      console.log(`[${service.name}] Process exited with code ${code}`);
    });
    
    child.on('error', (error) => {
      console.error(`[${service.name}] Failed to start: ${error.message}`);
    });
    
    // Wait for service to start
    if (service.healthEndpoint) {
      await this.waitForPort(service.port, service.name, service.healthEndpoint);
    } else {
      // For services without health endpoints, just wait a bit
      await this.sleep(5000);
    }
    
    console.log(`✅ ${service.name} started on port ${service.port}`);
  }

  // Wait for a port to be available
  async waitForPort(port, serviceName, healthEndpoint, timeout = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const url = healthEndpoint ? 
          `http://localhost:${port}${healthEndpoint}` : 
          `http://localhost:${port}`;
          
        const response = await fetch(url).catch(() => null);
        if (response && response.ok) {
          return true;
        }
      } catch (error) {
        // Port not ready yet
      }
      
      await this.sleep(1000);
    }
    
    console.log(`⚠️  ${serviceName} may not be fully ready on port ${port}`);
    return false;
  }

  // Run a command and wait for completion
  runCommand(command, args, cwd = __dirname) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd,
        stdio: 'inherit',
        shell: process.platform === 'win32'
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });
      
      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  // Stop all services
  stopAll() {
    console.log('\n🛑 Stopping VaultChain DAO system...');
    
    for (const service of this.processes) {
      console.log(`   Stopping ${service.name}...`);
      service.process.kill('SIGTERM');
    }
    
    console.log('✅ All services stopped');
    console.log('🌙 VaultChain DAO system shutdown complete');
    process.exit(0);
  }

  // Utility function to sleep
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Show system status
  async showStatus() {
    console.log('📊 VaultChain DAO System Status:\n');
    
    for (const service of this.services) {
      try {
        const url = service.healthEndpoint ? 
          `http://localhost:${service.port}${service.healthEndpoint}` :
          `http://localhost:${service.port}`;
          
        const response = await fetch(url);
        if (response.ok) {
          const data = service.healthEndpoint ? await response.json() : { status: 'running' };
          console.log(`✅ ${service.name}: Running (${data.status || 'active'})`);
        } else {
          console.log(`❌ ${service.name}: Not responding`);
        }
      } catch (error) {
        console.log(`❌ ${service.name}: Offline`);
      }
    }
    
    const mcpBase  = process.env.VITE_MCP_URL     || 'http://localhost:3000';
    const agentBase = process.env.VITE_MATTHEW_URL || 'http://localhost:3001';
    const feBase    = `http://localhost:${process.env.VITE_FRONTEND_PORT || 5173}`;
    console.log('\n🔗 System URLs:');
    console.log(`   Midnight MCP Server: ${mcpBase}`);
    console.log(`   ElizaOS AI Agents:   ${agentBase}`);
    console.log(`   VaultChain Frontend: ${feBase}`);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const launcher = new VaultChainLauncher();

if (args.includes('--status')) {
  launcher.showStatus().then(() => process.exit(0));
} else if (args.includes('--help')) {
  console.log(`
🏛️ VaultChain DAO Complete System Launcher

Usage:
  node start-vaultchain-complete.js          Start complete system
  node start-vaultchain-complete.js --status Show service status
  node start-vaultchain-complete.js --help   Show this help

System Architecture:
  🔗 Midnight MCP Server (port 3000)         - Real wallet operations
  🤖 ElizaOS AI Agent (port 3001)            - Treasury proposal AI
  🎨 VaultChain Frontend (port 5173)         - Modern DAO dashboard

Features:
  ✅ Privacy-first ZK membership verification
  ✅ Real Midnight Network wallet integration  
  ✅ AI-powered treasury management
  ✅ Anonymous voting with zero-knowledge proofs
  ✅ Professional treasury dashboard
  ✅ Multi-chain compatibility

Hackathon Ready:
  🏆 DoraHacks AI Treasury Management Challenge
  🌙 Midnight Network Privacy First Challenge
`);
} else {
  launcher.startAll().catch(error => {
    console.error('❌ Failed to start VaultChain system:', error.message);
    process.exit(1);
  });
}

export { VaultChainLauncher };
