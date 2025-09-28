// XRPL utilities for wallet connection and validation

export const validateXRPLAddress = (address) => {
  // Basic XRPL address validation
  if (!address || typeof address !== 'string') return false
  
  // XRPL addresses start with 'r' and are typically 25-34 characters
  const xrplRegex = /^r[1-9A-HJ-NP-Za-km-z]{24,33}$/
  return xrplRegex.test(address)
}

export const formatAddress = (address, startChars = 8, endChars = 6) => {
  if (!address || address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

// Mock XRPL connection for demo
export class XRPLWallet {
  constructor() {
    this.connected = false
    this.address = null
  }

  async connect(address) {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (validateXRPLAddress(address)) {
      this.connected = true
      this.address = address
      return { success: true, address }
    }
    
    throw new Error('Invalid XRPL address')
  }

  disconnect() {
    this.connected = false
    this.address = null
  }

  getAddress() {
    return this.address
  }

  isConnected() {
    return this.connected
  }
}

export const xrplWallet = new XRPLWallet()
