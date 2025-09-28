import React, { useState, useEffect } from 'react';
import './MultiChainDashboard.css';

const MultiChainDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/dashboard/multichain');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                setDashboardData(result.data);
                setLastUpdated(new Date().toLocaleString());
                setError(null);
            } else {
                throw new Error(result.error || 'Failed to fetch dashboard data');
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const simulateDeposit = async () => {
        try {
            const userId = `user_${Date.now()}`;
            const txHash = `0x${Math.random().toString(16).substring(2, 18)}`;
            const amount = Math.floor(Math.random() * 1000) + 100;
            
            console.log('🌙 Simulating TDUST deposit...');
            
            const response = await fetch('http://localhost:3001/deposit/tdust', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    txHash: txHash,
                    amount: amount,
                    fromAddress: 'mn_shield-addr_test1user...'
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert(`✅ TDUST deposit processed!\n\nUser: ${userId}\nAmount: ${amount} DUST\nXRPL Wallet Created: ${result.xrplWallet.address}`);
                
                // Refresh dashboard to show new wallet
                setTimeout(fetchDashboardData, 2000);
            } else {
                alert(`❌ Deposit failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Deposit simulation error:', error);
            alert(`❌ Deposit simulation failed: ${error.message}`);
        }
    };

    if (loading && !dashboardData) {
        return (
            <div className="multichain-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading multi-chain treasury data...</p>
                </div>
            </div>
        );
    }

    if (error && !dashboardData) {
        return (
            <div className="multichain-dashboard">
                <div className="error-container">
                    <h3>❌ Dashboard Error</h3>
                    <p>{error}</p>
                    <button onClick={fetchDashboardData} className="retry-button">
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="multichain-dashboard">
            <div className="dashboard-header">
                <h2>🌐 Multi-Chain Treasury Dashboard</h2>
                <div className="dashboard-controls">
                    <button onClick={fetchDashboardData} className="refresh-button" disabled={loading}>
                        {loading ? '🔄' : '↻'} Refresh
                    </button>
                    <button onClick={simulateDeposit} className="simulate-button">
                        🌙 Simulate TDUST Deposit
                    </button>
                </div>
            </div>

            {lastUpdated && (
                <div className="last-updated">
                    Last updated: {lastUpdated}
                </div>
            )}

            <div className="summary-cards">
                <div className="summary-card">
                    <h3>📊 Portfolio Summary</h3>
                    <div className="summary-stats">
                        <div className="stat">
                            <span className="stat-label">Total Chains:</span>
                            <span className="stat-value">{dashboardData?.summary?.totalChains || 0}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">User Wallets:</span>
                            <span className="stat-value">{dashboardData?.summary?.userWallets || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="chains-container">
                {/* Midnight Network */}
                <div className="chain-section midnight-section">
                    <div className="chain-header">
                        <h3>🌙 Midnight Network</h3>
                        <span className="network-badge">TestNet</span>
                    </div>
                    
                    <div className="treasury-info">
                        <div className="balance-display">
                            <span className="balance-amount">
                                {dashboardData?.chains?.midnight?.treasury?.balance || 0}
                            </span>
                            <span className="balance-currency">DUST</span>
                        </div>
                        
                        <div className="wallet-details">
                            <p><strong>Treasury Address:</strong></p>
                            <code className="address-code">
                                {dashboardData?.chains?.midnight?.treasury?.address || 'Loading...'}
                            </code>
                            <div className="status-indicator">
                                Status: <span className="status-operational">
                                    {dashboardData?.chains?.midnight?.treasury?.status || 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* XRPL Network */}
                <div className="chain-section xrpl-section">
                    <div className="chain-header">
                        <h3>🔗 XRPL Network</h3>
                        <span className="network-badge">TestNet</span>
                    </div>
                    
                    <div className="xrpl-info">
                        <div className="balance-display">
                            <span className="balance-amount">
                                {dashboardData?.chains?.xrpl?.totalBalance?.toFixed(6) || '0.000000'}
                            </span>
                            <span className="balance-currency">XRP</span>
                        </div>
                        
                        <div className="wallet-summary">
                            <p><strong>Managed by Xara AI</strong></p>
                            <div className="wallet-stats">
                                <span>Total Wallets: {dashboardData?.chains?.xrpl?.totalWallets || 0}</span>
                                <span>User Wallets: {dashboardData?.chains?.xrpl?.wallets?.filter(w => w.isUserWallet)?.length || 0}</span>
                            </div>
                        </div>

                        {dashboardData?.chains?.xrpl?.wallets && dashboardData.chains.xrpl.wallets.length > 0 && (
                            <div className="wallets-list">
                                <h4>📋 XRPL Wallets</h4>
                                <div className="wallets-grid">
                                    {dashboardData.chains.xrpl.wallets.map((wallet, index) => (
                                        <div key={wallet.address} className={`wallet-card ${wallet.isUserWallet ? 'user-wallet' : 'system-wallet'}`}>
                                            <div className="wallet-header">
                                                <span className="wallet-type">
                                                    {wallet.isUserWallet ? '👤 User' : '🤖 System'}
                                                </span>
                                                {wallet.userId && (
                                                    <span className="user-id">ID: {wallet.userId}</span>
                                                )}
                                            </div>
                                            
                                            <div className="wallet-address">
                                                <code>{wallet.address.substring(0, 12)}...{wallet.address.substring(-8)}</code>
                                            </div>
                                            
                                            <div className="wallet-balance">
                                                <span className="balance">{wallet.balance} XRP</span>
                                                {wallet.error && (
                                                    <span className="balance-error">⚠️ {wallet.error}</span>
                                                )}
                                            </div>
                                            
                                            <div className="wallet-meta">
                                                <small>Created: {new Date(wallet.created).toLocaleDateString()}</small>
                                                {wallet.isUserWallet && (
                                                    <a 
                                                        href="https://xrpl.org/xrp-testnet-faucet.html" 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="faucet-link"
                                                    >
                                                        💧 Fund Wallet
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {dashboardData?.chains?.xrpl?.error && (
                            <div className="error-message">
                                ⚠️ {dashboardData.chains.xrpl.error}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard-footer">
                <div className="ai-agents-status">
                    <h4>🤖 AI Agents Status</h4>
                    <div className="agents-grid">
                        <div className="agent-status">
                            <span className="agent-name">Matthew</span>
                            <span className="agent-role">Treasury Manager</span>
                            <span className="status-dot operational"></span>
                        </div>
                        <div className="agent-status">
                            <span className="agent-name">Xara</span>
                            <span className="agent-role">XRPL Specialist</span>
                            <span className="status-dot operational"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiChainDashboard;
