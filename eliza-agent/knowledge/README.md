# 📚 Matthew AI Knowledge Base

This directory contains the knowledge base for Matthew, your AI treasury management and legal compliance agent. Matthew uses these documents to provide accurate, policy-compliant responses about treasury management, DAO governance, and compliance requirements.

## Knowledge Sources

### treasury-policies.md
- Risk management framework and guidelines
- Treasury allocation policies and thresholds
- Approval processes for different proposal sizes
- Compliance requirements for treasury operations

### dao-proposals.md
- Standard proposal formats and requirements
- Voting processes and approval thresholds
- Timeline guidelines for different proposal types
- Success metrics and evaluation criteria

### compliance-docs.md
- Regulatory compliance framework
- Privacy and financial compliance requirements
- Governance compliance procedures
- Audit trail and documentation requirements

### business-formation.md
- DAO and LLC formation best practices
- Legal structure options and benefits
- Wyoming DAO LLC formation guide
- International jurisdiction considerations

### kyc-compliance.md
- Privacy-first KYC solutions
- Zero-knowledge identity verification
- Regulatory requirements by jurisdiction
- Risk-based compliance approaches

## 🚀 How to Expand Matthew's Knowledge

### ✅ **Simple Method:**
1. **Create a new `.md` file** in this directory with your content
2. **Add the filename** (without extension) to the `sources` array in `zk-treasury-agent-simple.json`
3. **Restart the system** to load the new knowledge

### 📝 **Example:**
```bash
# 1. Create new knowledge file
echo "# DeFi Protocols Guide" > defi-protocols.md

# 2. Edit zk-treasury-agent-simple.json and add to sources:
"sources": [
  "treasury-policies",
  "dao-proposals", 
  "compliance-docs",
  "business-formation",
  "kyc-compliance",
  "defi-protocols"  // <- Add your new file here
]

# 3. Restart the system
node start-vaultchain-complete.js
```

### 🎯 **Suggested Topics to Add:**
- **DeFi Protocols**: Yield farming, liquidity mining, protocol risks
- **Token Economics**: Tokenomics design, distribution models, vesting
- **Smart Contract Security**: Audit processes, vulnerability assessment
- **Cross-Chain Operations**: Bridge protocols, multi-chain strategies
- **Regulatory Updates**: Latest compliance changes, jurisdiction updates

## Knowledge Plugin Configuration

Matthew's knowledge is configured in `zk-treasury-agent-simple.json`:
```json
"knowledge": {
  "datasetPath": "./knowledge",
  "enabled": true,
  "sources": [
    "treasury-policies",
    "dao-proposals", 
    "compliance-docs",
    "business-formation",
    "kyc-compliance"
  ]
}
```

**Matthew automatically loads all knowledge sources when the system starts!** 🧠✨
