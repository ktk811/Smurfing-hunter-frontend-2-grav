import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';

export default function AnomalyList({ anomalies, compact = false }) {
    if (!anomalies) return null;

    const displayList = compact ? anomalies.slice(0, 5) : anomalies;

    return (
        <div className="content-section">
            <h2 className="section-title">
                <AlertCircle className="section-icon" />
                {compact ? "Recent Anomalies" : "All Detected Anomalies"}
            </h2>
            <div className="anomaly-list">
                {displayList.map(anomaly => (
                    <div key={anomaly.id} className="anomaly-item">
                        <div className="anomaly-main">
                            <div className="anomaly-header">
                                <span className="anomaly-address">{anomaly.address}</span>
                                <span className={`risk-badge ${anomaly.riskLevel}`}>
                                    {anomaly.riskLevel}
                                </span>
                            </div>
                            <div className="anomaly-meta">
                                <span className="anomaly-type">{anomaly.type}</span>
                                <span>Amount: {anomaly.amount}</span>
                                <span>{anomaly.timestamp}</span>
                            </div>
                        </div>
                        <ChevronRight className="anomaly-arrow" />
                    </div>
                ))}
            </div>
        </div>
    );
}
