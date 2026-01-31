import React, { useState } from 'react';
import { Shield, FileText, Activity, Clock, Users, User } from 'lucide-react';
import { generateSAR } from '../../services/api';

export default function SidebarProfile({ suspects, selectedSuspect, onSelectSuspect }) {
    const [sarReport, setSarReport] = useState(null);

    const handleGenerateSAR = async () => {
        if (!selectedSuspect) return;
        try {
            const data = await generateSAR({
                suspect_id: selectedSuspect.address,
                risk_score: 0.92, // Mock for now, would come from suspect object
                role: 'Mule',
                volume: 250000,
                tags: ['Diamond Pattern', 'High Velocity']
            });
            setSarReport(data.report);
        } catch (err) {
            console.error("SAR Generation failed", err);
        }
    };

    const currentSuspect = suspects.find(s => s.address === selectedSuspect?.address) || selectedSuspect;

    return (
        <div className="sidebar-profile">
            <style>{`
        .sidebar-profile {
          width: 320px;
          border-right: 1px solid rgba(255,255,255,0.05);
          background: rgba(10,10,10,0.5);
          display: flex;
          flex-direction: column;
          height: calc(100vh - 72px); /* Subtract header */
          overflow-y: auto;
        }
        .profile-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .profile-section {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .metric-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .metric-label {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        .metric-val {
          color: #e2e8f0;
          font-family: monospace;
          font-weight: 600;
        }
        .badge-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .badge-diamond { background: #00e676; color: black; }
        .badge-risk { background: #ff1744; color: white; }
        
        .sar-area {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          color: #22c55e;
          font-family: monospace;
          padding: 1rem;
          font-size: 0.75rem;
          white-space: pre-wrap;
          margin-top: 1rem;
          border-radius: 6px;
        }
        
        .action-btn {
          width: 100%;
          padding: 0.75rem;
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.3);
          color: #38bdf8;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .action-btn:hover {
          background: rgba(14, 165, 233, 0.2);
        }
        
        .suspect-select {
            width: 100%;
            padding: 0.5rem;
            background: #1e1e2e;
            color: white;
            border: 1px solid #333;
            border-radius: 4px;
            margin-bottom: 1rem;
        }
      `}</style>

            <div className="profile-header">
                <h3 className="section-title" style={{ marginBottom: '1rem', fontSize: '1rem' }}>🕵️ Case Files</h3>
                <select
                    className="suspect-select"
                    onChange={(e) => onSelectSuspect(suspects.find(s => s.address === e.target.value))}
                    value={selectedSuspect?.address || ""}
                >
                    <option value="">Select Subject...</option>
                    {suspects.map(s => (
                        <option key={s.address} value={s.address}>
                            {s.address.substring(0, 8)}... (Risk: {s.riskLevel})
                        </option>
                    ))}
                </select>

                {currentSuspect && (
                    <div className="profile-details">
                        <div className="metric-row">
                            <span className="metric-label">Volume (USD)</span>
                            <span className="metric-val">$250,000</span>
                        </div>
                        <div className="badge-list">
                            <span className="badge badge-diamond">💎 Diamond Pattern</span>
                            <span className="badge badge-risk">⚠️ High Velocity</span>
                        </div>
                    </div>
                )}
            </div>

            {currentSuspect && (
                <>
                    <div className="profile-section">
                        <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Forensic Metrics</h4>

                        {/* TOXICITY SCORE */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div className="metric-row">
                                <span className="metric-label">Neighborhood Toxicity</span>
                                <span className="metric-val" style={{ color: '#ff1744' }}>0.8421</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#ff1744', background: 'rgba(255, 23, 68, 0.1)', display: 'inline-block', padding: '2px 6px', borderRadius: '4px' }}>
                                Contagious
                            </div>
                        </div>

                        {/* ASSET RETENTION */}
                        <div>
                            <div className="metric-row">
                                <span className="metric-label">Asset Retention</span>
                                <span className="metric-val">8 min</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#ff1744', fontWeight: 'bold' }}>
                                ⚡ FLASH MULE (&lt;10m)
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <button className="action-btn" onClick={handleGenerateSAR}>
                            <FileText size={16} />
                            Generate SAR Report
                        </button>

                        {sarReport && (
                            <div className="sar-area">
                                {sarReport}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
