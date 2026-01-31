import React from 'react';
import { Network } from 'lucide-react';

export default function NetworkGraph({ stats }) {
    if (!stats) return null;

    return (
        <div className="content-section">
            <h2 className="section-title">
                <Network className="section-icon" />
                Network Statistics
            </h2>
            <div className="network-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="network-stat">
                        <div className="network-stat-label">{stat.label}</div>
                        <div className="network-stat-value">{stat.value}</div>
                        <div className="network-stat-trend">{stat.trend}</div>
                    </div>
                ))}
            </div>

            {/* 
        Future: Add Graph Visualization here using standard Graph libraries
        Data available from /api/network/graph
      */}
        </div>
    );
}
