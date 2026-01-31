import React from 'react';
import { Activity, AlertCircle, Shield, Network, TrendingUp } from 'lucide-react';

export default function StatsGrid({ stats }) {
    if (!stats) return null;

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Total Transactions</span>
                    <Activity className="stat-icon" />
                </div>
                <div className="stat-value">{stats.totalTransactions?.toLocaleString()}</div>
                <div className="stat-trend">
                    <TrendingUp size={16} />
                    Last 24 hours
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Anomalies Detected</span>
                    <AlertCircle className="stat-icon" />
                </div>
                <div className="stat-value">{stats.anomaliesDetected}</div>
                <div className="stat-trend">
                    <TrendingUp size={16} />
                    +8% from average
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Risk Score</span>
                    <Shield className="stat-icon" />
                </div>
                <div className="stat-value">{stats.riskScore}/10</div>
                <div className="stat-trend negative">
                    High Risk Level
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-header">
                    <span className="stat-label">Network Health</span>
                    <Network className="stat-icon" />
                </div>
                <div className="stat-value">{stats.networkHealth}%</div>
                <div className="stat-trend">
                    <TrendingUp size={16} />
                    +2.3% this week
                </div>
            </div>
        </div>
    );
}
