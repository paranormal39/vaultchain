#!/usr/bin/env node

/**
 * Deploy Next Contract Helper
 * Helps deploy the remaining contracts one by one
 */

import { DEPLOYED_CONTRACTS, DEPLOYMENT_STATUS } from './deployed-contracts.js';

const DEPLOYMENT_ORDER = [
  'DAO_TREASURY',   // Deploy treasury first
  'DAO_TOKEN',      // Then token contract  
  'DAO_SIMPLE'      // Simple contract as fallback
];

function getNextContractToDeploy() {
  for (const contractName of DEPLOYMENT_ORDER) {
    const contract = DEPLOYED_CONTRACTS[contractName];
    if (contract.status === 'READY_TO_DEPLOY') {
      return { name: contractName, contract };
    }
  }
  return null;
}

function displayDeploymentStatus() {
  console.log('📊 CURRENT DEPLOYMENT STATUS');
  console.log('============================');
  
  console.log('\n✅ DEPLOYED CONTRACTS:');
  DEPLOYMENT_STATUS.deployed.forEach(name => {
    const contract = DEPLOYED_CONTRACTS[name];
    console.log(`  🏛️  ${contract.name}`);
    console.log(`      Address: ${contract.address}`);
    console.log(`      Functions: ${Object.keys(contract.functions).length}`);
  });
  
  console.log('\n⏳ READY TO DEPLOY:');
  DEPLOYMENT_STATUS.readyToDeploy.forEach(name => {
    const contract = DEPLOYED_CONTRACTS[name];
    console.log(`  📦 ${contract.name}`);
    console.log(`      File: ${contract.file}`);
    console.log(`      Circuits: ${contract.circuits}`);
    console.log(`      Replaces: ${contract.replaces}`);
  });
}

function getDeploymentInstructions(contractName, contract) {
  return `
🚀 DEPLOY ${contract.name.toUpperCase()}
${'='.repeat(50)}

📋 STEPS:
1. Clean contract directory:
   rm -f ../boilerplate/contract/src/*.compact

2. Copy contract file:
   cp ${contract.file} ../boilerplate/contract/src/

3. Build contract:
   cd ../boilerplate/contract && npm run dev

4. Deploy contract:
   cd ../boilerplate && npm run deploy

📊 CONTRACT DETAILS:
- File: ${contract.file}
- Circuits: ${contract.circuits}
- Functions: ${Object.keys(contract.functions).length}
- Replaces: ${contract.replaces}

🎯 AFTER DEPLOYMENT:
- Update deployed-contracts.js with new address
- Test contract functions
- Integrate with frontend
- Remove replaced service

💡 FUNCTIONS AVAILABLE:
${Object.keys(contract.functions).map(fn => `   - ${fn}(${contract.functions[fn].join(', ')})`).join('\n')}
`;
}

function main() {
  console.log('🏗️  DAO Contract Deployment Helper');
  console.log('==================================');
  
  displayDeploymentStatus();
  
  const next = getNextContractToDeploy();
  
  if (!next) {
    console.log('\n🎉 ALL CONTRACTS DEPLOYED!');
    console.log('Ready for full on-chain DAO operation.');
    return;
  }
  
  console.log('\n🎯 NEXT CONTRACT TO DEPLOY:');
  console.log(`📦 ${next.contract.name}`);
  
  console.log(getDeploymentInstructions(next.name, next.contract));
  
  console.log('\n🔄 ARCHITECTURE PROGRESS:');
  console.log('┌─────────────────────────────────────────┐');
  console.log('│ ✅ ZK Guild Gate (Membership)           │');
  console.log('│ ✅ DAO Governance (Voting)              │');
  console.log('│ ⏳ DAO Treasury (Next to deploy)        │');
  console.log('│ ⏳ DAO Token (After treasury)           │');
  console.log('│ ⏳ DAO Simple (Fallback)                │');
  console.log('└─────────────────────────────────────────┘');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { getNextContractToDeploy, getDeploymentInstructions };
