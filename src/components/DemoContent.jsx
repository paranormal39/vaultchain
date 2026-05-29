/**
 * @file DemoContent.jsx
 * @description Demo content components for tabs that need Material Design styling
 */

import React from 'react';
import './VibrantModernTheme.css';

export const DemoAgentsContent = () => (
  <div style={{display: 'grid', gap: 'var(--space-2xl)'}}>
    <div>
      <h2 className="text-display" style={{marginBottom: 'var(--space-sm)'}}>Multi-Agent System</h2>
      <p className="text-body">Coordinated AI agents managing cross-chain treasury operations</p>
    </div>

    <div className="grid-vibrant-3">
      <div className="card-vibrant-elevated agent-vibrant-card agent-matthew network-midnight">
        <div className="card-header">
          <h3 className="text-title">Matthew Agent</h3>
          <p className="text-body">Midnight Network Specialist</p>
        </div>
        <div className="metric-vibrant">
          <div className="metric-vibrant-value text-vibrant-purple">1,247</div>
          <div className="metric-vibrant-label">DUST Managed</div>
          <div className="text-label" style={{marginTop: 'var(--space-xs)', fontFamily: 'monospace'}}>mn_shield-addr_test1fagjhs...</div>
        </div>
        <div style={{marginTop: 'var(--space-md)'}}>
          <div className="status-vibrant-success">Active</div>
        </div>
      </div>

      <div className="card-vibrant-elevated agent-vibrant-card agent-ada network-cardano">
        <div className="card-header">
          <h3 className="text-title">Ada Agent</h3>
          <p className="text-body">Cardano Ecosystem Specialist</p>
        </div>
        <div className="metric-vibrant">
          <div className="metric-vibrant-value text-vibrant-blue">0.0</div>
          <div className="metric-vibrant-label">ADA Managed</div>
          <div className="text-label" style={{marginTop: 'var(--space-xs)', fontFamily: 'monospace'}}>addr1q9z8...cardano-testnet</div>
        </div>
        <div style={{marginTop: 'var(--space-md)'}}>
          <div className="status-vibrant-warning">Awaiting Blockfrost Key</div>
        </div>
      </div>

      <div className="card-vibrant-elevated agent-vibrant-card agent-xara network-xrpl">
        <div className="card-header">
          <h3 className="text-title">Xara Agent</h3>
          <p className="text-body">XRPL Ecosystem Specialist</p>
        </div>
        <div className="metric-vibrant">
          <div className="metric-vibrant-value text-vibrant-green">100</div>
          <div className="metric-vibrant-label">XRP Managed</div>
          <div className="text-label" style={{marginTop: 'var(--space-xs)', fontFamily: 'monospace'}}>rHBDKh8VXZpYK8rGhoQsL4qpo4kSLcCB46</div>
        </div>
        <div style={{marginTop: 'var(--space-md)'}}>
          <div className="status-vibrant-success">Active & Funded</div>
        </div>
      </div>
    </div>

    <div className="card-vibrant-elevated">
      <div className="card-header">
        <h3 className="text-title">Cross-Chain Opportunities</h3>
        <p className="text-body">AI-detected arbitrage and yield opportunities</p>
      </div>
      <div className="list-vibrant">
        <div className="list-vibrant-item">
          <div className="flex-vibrant-between">
            <div>
              <div className="text-body" style={{fontWeight: '500'}}>ADA-XRP Arbitrage</div>
              <div className="text-label">Detected by Ada & Xara</div>
            </div>
            <div className="text-vibrant-green" style={{fontWeight: '600'}}>+2.3% APY</div>
          </div>
        </div>
        <div className="list-vibrant-item">
          <div className="flex-vibrant-between">
            <div>
              <div className="text-body" style={{fontWeight: '500'}}>DUST Staking Opportunity</div>
              <div className="text-label">Detected by Matthew</div>
            </div>
            <div className="text-vibrant-green" style={{fontWeight: '600'}}>+5.7% APY</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const DemoMarketContent = () => (
  <div style={{display: 'grid', gap: 'var(--space-2xl)'}}>
    <div>
      <h2 className="text-display" style={{marginBottom: 'var(--space-sm)'}}>Market Scanner</h2>
      <p className="text-body">AI-powered real-time market analysis and opportunity detection</p>
    </div>

    <div className="grid-vibrant-4">
      <div className="metric-vibrant">
        <div className="metric-vibrant-value text-vibrant-blue">127</div>
        <div className="metric-vibrant-label">Opportunities Scanned</div>
      </div>
      <div className="metric-vibrant">
        <div className="metric-vibrant-value text-vibrant-green">23</div>
        <div className="metric-vibrant-label">High Confidence</div>
      </div>
      <div className="metric-vibrant">
        <div className="metric-vibrant-value text-vibrant-purple">4</div>
        <div className="metric-vibrant-label">Active Networks</div>
      </div>
      <div className="metric-vibrant">
        <div className="metric-vibrant-value text-vibrant-green">94%</div>
        <div className="metric-vibrant-label">AI Accuracy</div>
      </div>
    </div>

    <div className="grid-vibrant-2">
      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">Top Opportunities</h3>
          <p className="text-body">Highest potential returns</p>
        </div>
        <div className="list-vibrant">
          <div className="list-vibrant-item">
            <div className="flex-vibrant-between">
              <div>
                <div className="text-body" style={{fontWeight: '500'}}>HOSKY/ADA Pair</div>
                <div className="text-label">Cardano Network</div>
              </div>
              <div className="metric-change positive text-vibrant-green">+15.2%</div>
            </div>
          </div>
          <div className="list-vibrant-item">
            <div className="flex-vibrant-between">
              <div>
                <div className="text-body" style={{fontWeight: '500'}}>XRP/USD Corridor</div>
                <div className="text-label">XRPL Network</div>
              </div>
              <div className="metric-change positive text-vibrant-green">+8.7%</div>
            </div>
          </div>
          <div className="list-vibrant-item">
            <div className="flex-vibrant-between">
              <div>
                <div className="text-body" style={{fontWeight: '500'}}>DUST Yield Farm</div>
                <div className="text-label">Midnight Network</div>
              </div>
              <div className="metric-change positive text-vibrant-green">+12.1%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">Market Alerts</h3>
          <p className="text-body">Real-time notifications</p>
        </div>
        <div className="list-vibrant">
          <div className="list-vibrant-item">
            <div>
              <div className="text-body" style={{fontWeight: '500'}}>Volume Spike Detected</div>
              <div className="text-label">ADA volume increased 340% in 1h</div>
            </div>
          </div>
          <div className="list-vibrant-item">
            <div>
              <div className="text-body" style={{fontWeight: '500'}}>Arbitrage Window Open</div>
              <div className="text-label">XRP price difference across exchanges</div>
            </div>
          </div>
          <div className="list-vibrant-item">
            <div>
              <div className="text-body" style={{fontWeight: '500'}}>New Yield Opportunity</div>
              <div className="text-label">DUST staking pool launched</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="flex gap-vibrant-md">
      <button className="btn-vibrant-primary">Start Market Scan</button>
      <button className="btn-vibrant-secondary">Configure Alerts</button>
      <button className="btn-vibrant-secondary">Export Data</button>
    </div>
  </div>
);

export const DemoProposalsContent = () => (
  <div style={{display: 'grid', gap: 'var(--space-2xl)'}}>
    <div className="flex-vibrant-between">
      <div>
        <h2 className="text-display" style={{marginBottom: 'var(--space-sm)'}}>Proposals</h2>
        <p className="text-body">AI-generated treasury proposals and governance</p>
      </div>
      <button className="btn-vibrant-primary">Generate AI Proposal</button>
    </div>

    <div style={{display: 'grid', gap: 'var(--space-lg)'}}>
      <div className="card-vibrant-elevated">
        <div className="card-header">
          <div className="flex-vibrant-between">
            <div>
              <h3 className="text-title">Cross-Chain Yield Strategy</h3>
              <p className="text-body">Optimize returns across Midnight, Cardano, and XRPL</p>
            </div>
            <div className="status-vibrant-success">AI Generated</div>
          </div>
        </div>
        
        <div className="grid-vibrant-4" style={{marginBottom: 'var(--space-lg)'}}>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-blue">40%</div>
            <div className="metric-vibrant-label">Reserves</div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-green">35%</div>
            <div className="metric-vibrant-label">Yield Farming</div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-purple">15%</div>
            <div className="metric-vibrant-label">Development</div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-gold">10%</div>
            <div className="metric-vibrant-label">Community</div>
          </div>
        </div>

        <div className="flex gap-md">
          <button className="btn-primary">Vote Yes</button>
          <button className="btn-secondary">Vote No</button>
          <button className="btn-text">View Details</button>
        </div>
      </div>

      <div className="card-vibrant-elevated">
        <div className="card-header">
          <div className="flex-vibrant-between">
            <div>
              <h3 className="text-title">Emergency Fund Allocation</h3>
              <p className="text-body">Increase reserves for market volatility protection</p>
            </div>
            <div className="status-vibrant-warning">Pending</div>
          </div>
        </div>
        
        <div className="grid-vibrant-4" style={{marginBottom: 'var(--space-lg)'}}>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-blue">60%</div>
            <div className="metric-vibrant-label">Reserves</div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-green">20%</div>
            <div className="metric-vibrant-label">Development</div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-purple">15%</div>
            <div className="metric-vibrant-label">Incentives</div>
          </div>
          <div className="metric-vibrant">
            <div className="metric-vibrant-value text-vibrant-gold">5%</div>
            <div className="metric-vibrant-label">Community</div>
          </div>
        </div>

        <div className="flex gap-vibrant-md">
          <button className="btn-vibrant-success">Vote Yes</button>
          <button className="btn-vibrant-secondary">Vote No</button>
          <button className="btn-vibrant-secondary">View Details</button>
        </div>
      </div>
    </div>
  </div>
);

export const DemoTreasuryContent = () => (
  <div style={{display: 'grid', gap: 'var(--space-2xl)'}}>
    <div>
      <h2 className="text-display" style={{marginBottom: 'var(--space-sm)'}}>Treasury Management</h2>
      <p className="text-body">AI-powered cross-chain treasury operations and analytics</p>
    </div>

    <div className="grid-vibrant-3">
      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">Total Value Locked</h3>
          <p className="text-body">Across all networks</p>
        </div>
        <div className="metric-vibrant">
          <div className="metric-vibrant-value text-vibrant-blue">$47,832</div>
          <div className="metric-vibrant-label">USD Value</div>
          <div className="metric-change positive text-vibrant-green">+12.3% this month</div>
        </div>
      </div>

      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">Active Strategies</h3>
          <p className="text-body">Automated yield generation</p>
        </div>
        <div className="metric-vibrant">
          <div className="metric-vibrant-value text-vibrant-green">7</div>
          <div className="metric-vibrant-label">Strategies Running</div>
          <div className="metric-change positive text-vibrant-green">+8.7% avg APY</div>
        </div>
      </div>

      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">Risk Score</h3>
          <p className="text-body">Portfolio risk assessment</p>
        </div>
        <div className="metric-vibrant">
          <div className="metric-vibrant-value text-vibrant-green">Low</div>
          <div className="metric-vibrant-label">Current Risk Level</div>
          <div className="metric-change positive text-vibrant-green">Optimized</div>
        </div>
      </div>
    </div>

    <div className="grid-vibrant-2">
      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">Asset Allocation</h3>
          <p className="text-body">Current portfolio distribution</p>
        </div>
        <div style={{display: 'grid', gap: 'var(--space-sm)'}}>
          <div className="flex-vibrant-between">
            <span className="text-body">DUST (Midnight)</span>
            <span className="text-vibrant-purple" style={{fontWeight: '600'}}>42%</span>
          </div>
          <div className="progress-vibrant">
            <div className="progress-vibrant-bar" style={{width: '42%'}}></div>
          </div>
          <div className="flex-vibrant-between">
            <span className="text-body">ADA (Cardano)</span>
            <span className="text-vibrant-blue" style={{fontWeight: '600'}}>28%</span>
          </div>
          <div className="progress-vibrant">
            <div className="progress-vibrant-bar" style={{width: '28%'}}></div>
          </div>
          <div className="flex-vibrant-between">
            <span className="text-body">XRP (XRPL)</span>
            <span className="text-vibrant-green" style={{fontWeight: '600'}}>30%</span>
          </div>
          <div className="progress-vibrant">
            <div className="progress-vibrant-bar" style={{width: '30%'}}></div>
          </div>
        </div>
      </div>

      <div className="card-vibrant-elevated">
        <div className="card-header">
          <h3 className="text-title">Recent Transactions</h3>
          <p className="text-body">Latest treasury operations</p>
        </div>
        <div className="list-vibrant">
          <div className="list-vibrant-item">
            <div className="flex-vibrant-between">
              <div>
                <div className="text-body" style={{fontWeight: '500'}}>Yield Harvest</div>
                <div className="text-label">SOL staking rewards</div>
              </div>
              <div className="text-vibrant-green" style={{fontWeight: '600'}}>+2.1 SOL</div>
            </div>
          </div>
          <div className="list-vibrant-item">
            <div className="flex-vibrant-between">
              <div>
                <div className="text-body" style={{fontWeight: '500'}}>Cross-Chain Swap</div>
                <div className="text-label">XRP → DUST</div>
              </div>
              <div className="text-vibrant-purple" style={{fontWeight: '600'}}>500 XRP</div>
            </div>
          </div>
          <div className="list-vibrant-item">
            <div className="flex-vibrant-between">
              <div>
                <div className="text-body" style={{fontWeight: '500'}}>Liquidity Provision</div>
                <div className="text-label">DUST/SOL pool</div>
              </div>
              <div className="text-vibrant-green" style={{fontWeight: '600'}}>+0.3 DUST</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="flex gap-vibrant-md">
      <button className="btn-vibrant-primary">Execute Strategy</button>
      <button className="btn-vibrant-secondary">Rebalance Portfolio</button>
      <button className="btn-vibrant-secondary">View Analytics</button>
    </div>
  </div>
);
