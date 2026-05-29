#!/usr/bin/env node

/**
 * @file setup-xrpl-wallet.js
 * @description Quick XRPL Testnet Wallet Setup and Funding Script
 * 
 * This script will:
 * 1. Generate a new XRPL testnet wallet
 * 2. Fund it with testnet XRP from the faucet
 * 3. Display wallet details for use in your application
 */

import * as xrpl from 'xrpl';

async function setupXRPLWallet() {
  console.log('🌊 Setting up XRPL Testnet Wallet...\n');

  try {
    // Connect to testnet
    console.log('📡 Connecting to XRPL Testnet...');
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();
    console.log('✅ Connected to XRPL Testnet\n');

    // Generate new wallet
    console.log('🔐 Generating new wallet...');
    const wallet = xrpl.Wallet.generate();
    
    console.log('✅ Wallet generated successfully!');
    console.log('📍 Address:', wallet.address);
    console.log('🔑 Secret:', wallet.seed);
    console.log('⚠️  IMPORTANT: Save your secret key securely!\n');

    // Fund wallet from testnet faucet
    console.log('💰 Funding wallet from testnet faucet...');
    try {
      const fundResult = await client.fundWallet(wallet);
      console.log('✅ Wallet funded successfully!');
      console.log('💎 Balance:', fundResult.balance, 'XRP\n');
    } catch (fundError) {
      console.log('⚠️  Faucet funding failed, trying manual method...');
      console.log('🌐 Visit: https://xrpl.org/xrp-testnet-faucet.html');
      console.log('📝 Enter your address:', wallet.address);
      console.log('💡 You should receive 1000 XRP for testing\n');
    }

    // Get account info
    console.log('📊 Checking account status...');
    try {
      const accountInfo = await client.request({
        command: 'account_info',
        account: wallet.address
      });
      
      const balance = xrpl.dropsToXrp(accountInfo.result.account_data.Balance);
      console.log('✅ Account is active!');
      console.log('💰 Current balance:', balance, 'XRP');
      console.log('🔢 Sequence:', accountInfo.result.account_data.Sequence);
    } catch (accountError) {
      console.log('⏳ Account not yet activated. Fund it first!');
    }

    // Environment variables for your app
    console.log('\n🔧 Environment Variables for your .env file:');
    console.log('=====================================');
    console.log(`XRPL_WALLET_ADDRESS=${wallet.address}`);
    console.log(`XRPL_WALLET_SECRET=${wallet.seed}`);
    console.log(`XRPL_NETWORK=testnet`);
    console.log(`XRPL_SERVER=wss://s.altnet.rippletest.net:51233`);
    console.log('=====================================\n');

    // Integration code example
    console.log('💻 Integration Code Example:');
    console.log('============================');
    console.log(`
const xrpl = require('xrpl');

// Initialize XRPL client and wallet
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
const wallet = xrpl.Wallet.fromSeed('${wallet.seed}');

async function getXRPBalance() {
  await client.connect();
  const response = await client.request({
    command: 'account_info',
    account: '${wallet.address}'
  });
  const balance = xrpl.dropsToXrp(response.result.account_data.Balance);
  console.log('XRP Balance:', balance);
  await client.disconnect();
  return balance;
}

async function sendXRP(destination, amount) {
  await client.connect();
  const payment = {
    TransactionType: 'Payment',
    Account: wallet.address,
    Amount: xrpl.xrpToDrops(amount.toString()),
    Destination: destination
  };
  
  const prepared = await client.autofill(payment);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  await client.disconnect();
  return result;
}
    `);

    await client.disconnect();
    console.log('🎉 XRPL Wallet setup complete!');
    console.log('💡 Next steps:');
    console.log('   1. Add the environment variables to your .env file');
    console.log('   2. Install xrpl package: npm install xrpl');
    console.log('   3. Use the integration code in your application');
    console.log('   4. Test transactions on testnet before mainnet');

  } catch (error) {
    console.error('❌ Error setting up XRPL wallet:', error);
    console.log('\n🔧 Manual Setup Instructions:');
    console.log('1. Visit: https://xrpl.org/xrp-testnet-faucet.html');
    console.log('2. Generate a new testnet account');
    console.log('3. Fund it with testnet XRP');
    console.log('4. Use the credentials in your application');
  }
}

// Run the setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupXRPLWallet().catch(console.error);
}

export { setupXRPLWallet };
