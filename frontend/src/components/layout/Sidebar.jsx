import React, { useState } from 'react';
import { Shield, FileText, Activity, Clock, Sliders } from 'lucide-react';
import { generateSAR } from '../../services/api';

export default function Sidebar({ suspects, selectedSuspect, onSelectSuspect }) {
    const [sarReport, setSarReport] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);

    // Settings State (Mock)
    const [sensitivity, setSensitivity] = useState(0.85);

    // Resize State
    const [width, setWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const newWidth = e.clientX;
            if (newWidth > 250 && newWidth < 600) {
                setWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const handleGenerateSAR = async () => {
        if (!selectedSuspect) return;
        setReportLoading(true);
        try {
            // Mock enrichment of data for the report
            const data = await generateSAR({
                suspect_id: selectedSuspect.address,
                risk_score: selectedSuspect.confidence || 0.92,
                role: selectedSuspect.metrics?.role || 'Mule',
                volume: selectedSuspect.metrics?.volume_usd || 150000,
                tags: selectedSuspect.metrics?.tags || ['Smurfing'],
            });
            setSarReport(data.report);
        } catch (err) {
            console.error("SAR Generation failed", err);
        } finally {
            setReportLoading(false);
        }
    };

    const currentSuspect = selectedSuspect || (suspects.length > 0 ? suspects[0] : null);

    return (
        <aside className="sidebar" style={{ width: `${width}px` }}>
            <div
                className="resizer"
                onMouseDown={() => setIsResizing(true)}
            />

            <div
                className="resizer"
                onMouseDown={() => setIsResizing(true)}
            />

            <div className="sidebar-scroll-area">
                {/* 1. SUSPECT SELECTOR */}
                <div className="sidebar-section">
                    <h3 className="sidebar-title">🎯 Target Selection</h3>
                    <select
                        className="suspect-select"
                        onChange={(e) => onSelectSuspect(suspects.find(s => s.address === e.target.value))}
                        value={currentSuspect?.address || ""}
                    >
                        <option value="">Choose suspect...</option>
                        {suspects.map(s => (
                            <option key={s.address} value={s.address}>
                                {s.address.substring(0, 8)}... (Risk: {s.riskLevel})
                            </option>
                        ))}
                    </select>
                </div>

                {currentSuspect && (
                    <>
                        {/* 2. FORENSIC PROFILE CARD */}
                        <div className="sidebar-section profile-card">
                            <h4 className="report-header">AI FORENSIC REPORT</h4>
                            <div className="report-meta">
                                CASE ID: <span className="highlight">REF-{Math.floor(Math.random() * 90000) + 10000}</span> SUBJECT: <span className="highlight">{currentSuspect.address.substring(0, 12)}...</span>
                            </div>

                            <div className="report-content">
                                <div className="risk-row">
                                    RISK ASSESSMENT: <span className="risk-label">CRITICAL SUSPICION SCORE:</span> <span className="risk-score">{currentSuspect.confidence.toFixed(4)}</span>
                                </div>

                                <div className="analytics-section">
                                    <h5>BEHAVIOR ANALYTICS:</h5>
                                    <ul className="analytics-list">
                                        <li>Pattern: <span className="highlight-green">{currentSuspect.metrics?.pattern || 'DISPERSION (Smurf)'}</span></li>
                                        <li>Flow Ratio: <span className="highlight-green">{currentSuspect.metrics?.flow_ratio || '1.47'}</span></li>
                                        <li>Bad Actors: <span className="highlight-green">{currentSuspect.metrics?.bad_actors || '4'} confirmed illicit connections.</span></li>
                                    </ul>
                                </div>

                                <div className="gnn-section">
                                    <p><strong>GNN CONCLUSION:</strong> Subject exhibits structural properties consistent with {currentSuspect.metrics?.role?.toLowerCase() || 'smurf'} operations. Immediate audit recommended.</p>
                                </div>

                                <div className="volume-section">
                                    Volume: <span className="highlight-green">${(currentSuspect.metrics?.volume_usd || 481418).toLocaleString()} USD</span>
                                </div>

                                <div className="tags-section">
                                    {(currentSuspect.metrics?.tags || ['High Velocity', 'Structurally Embedded']).map((tag, i) => (
                                        <span key={i} className="tag-badge">⚠️ {tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 4. CONTROLS */}
                        <div className="sidebar-section">
                            <h3 className="sidebar-title"><Sliders size={14} style={{ display: 'inline' }} /> Sensitivity</h3>
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={sensitivity}
                                onChange={(e) => setSensitivity(e.target.value)}
                                className="slider"
                            />
                            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>Threshold: {sensitivity}</div>
                        </div>

                        {/* 5. SAR GENERATOR */}
                        <div className="sidebar-section">
                            <button
                                className={`action-btn ${reportLoading ? 'loading' : ''}`}
                                onClick={handleGenerateSAR}
                                disabled={reportLoading}
                            >
                                <FileText size={16} />
                                {reportLoading ? 'Generating...' : 'Generate SAR Report'}
                            </button>
                        </div>

                        {/* MODAL OVERLAY */}
                        {sarReport && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h3>📄 Suspicious Activity Report</h3>
                                        <button className="close-btn" onClick={() => setSarReport(null)}>×</button>
                                    </div>
                                    <div className="modal-body">
                                        <pre>{sarReport}</pre>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="secondary-btn" onClick={() => setSarReport(null)}>Close Case File</button>
                                        <button className="primary-btn" onClick={() => window.print()}>Print / Save PDF</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
        .sidebar {
            /* Width handled by inline style */
            background: #0f0f0f;
            border-right: 1px solid #222;
            overflow-y: hidden; /* Changed to hidden to manage scrolling inner container if needed, or keeping auto but resizer separate? Actually resizer needs to be reachable. */
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .resizer {
            position: absolute;
            top: 0;
            right: 0;
            width: 4px; /* Grabbing area */
            height: 100%;
            cursor: col-resize;
            background: rgba(255, 255, 255, 0.05);
            transition: background 0.2s;
            z-index: 10;
        }
        .resizer:hover, .resizer:active {
            background: #0ea5e9;
        }
        .sidebar-scroll-area {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
        }
        .sidebar-scroll-area::-webkit-scrollbar { width: 6px; }
        .sidebar-scroll-area::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        
        .sidebar::-webkit-scrollbar { width: 0px; } /* Hide outer scrollbar */
        
        .sidebar-section {
            padding: 1.25rem;
            border-bottom: 1px solid #222;
        }
        .sidebar-title {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        .suspect-select {
            width: 100%;
            background: #18181b;
            border: 1px solid #333;
            color: #e2e8f0;
            padding: 0.5rem;
            border-radius: 6px;
            font-size: 0.875rem;
        }
        .profile-header-row {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        .profile-avatar {
            width: 40px; 
            height: 40px;
            background: rgba(14, 165, 233, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .suspect-id { font-family: monospace; font-weight: bold; color: #fff; font-size: 0.9rem; }
        .suspect-status { font-size: 0.65rem; color: #10b981; font-weight: bold; letter-spacing: 0.05em; margin-top: 2px; }
        
        .metric-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
        }
        .metric-box {
            background: #18181b;
            padding: 0.75rem;
            border-radius: 6px;
            text-align: center;
        }
        .metric-box label { font-size: 0.65rem; color: #64748b; display: block; margin-bottom: 4px; }
        .metric-box .value { font-weight: bold; font-size: 1.1rem; color: #e2e8f0; }
        .metric-box .value.high { color: #ef4444; }
        
        .metric-row-advanced {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }
        .metric-icon { 
            width: 32px; height: 32px; 
            background: #18181b; 
            border-radius: 6px; 
            display: flex; align-items: center; justify-content: center;
            color: #64748b;
        }
        .metric-info { flex: 1; }
        .metric-info label { font-size: 0.75rem; color: #94a3b8; display: block; }
        .metric-val { font-size: 0.9rem; font-weight: 600; color: #e2e8f0; }
        .metric-val.critical { color: #ef4444; }
        .metric-val.warning { color: #f59e0b; }
        .metric-tag { font-size: 0.65rem; color: #f59e0b; font-weight: bold; margin-top: 2px; }
        
        .action-btn {
            width: 100%;
            background: rgba(14, 165, 233, 0.1);
            color: #38bdf8;
            border: 1px solid rgba(14, 165, 233, 0.2);
            padding: 0.75rem;
            border-radius: 6px;
            font-weight: 600;
            display: flex; align-items: center; justify-content: center; gap: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
        }
        .action-btn:hover:not(:disabled) { background: rgba(14, 165, 233, 0.2); }
        .action-btn:disabled { opacity: 0.6; cursor: wait; }
        
        /* MODAL STYLES */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .modal-content {
            background: #09090b;
            border: 1px solid #333;
            width: 700px;
            max-width: 90vw;
            max-height: 85vh;
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
        }
        .modal-header {
            padding: 1.25rem;
            border-bottom: 1px solid #222;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-header h3 { margin: 0; color: #f8fafc; font-size: 1.1rem; }
        .close-btn { background: none; border: none; color: #64748b; font-size: 1.5rem; cursor: pointer; }
        .close-btn:hover { color: #fff; }
        
        .modal-body {
            padding: 1.5rem;
            overflow-y: auto;
            flex: 1;
            background: #000;
        }
        .modal-body pre {
            color: #22c55e;
            font-family: 'Space Mono', monospace;
            font-size: 0.9rem;
            white-space: pre-wrap;
            line-height: 1.5;
            margin: 0;
        }
        
        .modal-footer {
            padding: 1rem;
            border-top: 1px solid #222;
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            background: #0f0f0f;
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
        }
        .primary-btn {
            background: #0ea5e9;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
        }
        .primary-btn:hover { background: #0284c7; }
        .secondary-btn {
            background: transparent;
            color: #94a3b8;
            border: 1px solid #333;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
        }
        .secondary-btn:hover { color: #fff; border-color: #475569; }
        
        /* REPORT CUSTOM STYLES */
        .report-header {
            font-family: 'Inter', sans-serif;
            font-size: 0.75rem;
            color: #38bdf8;
            letter-spacing: 0.08em;
            margin: 0 0 0.75rem 0;
            border-bottom: 1px solid rgba(56, 189, 248, 0.2);
            padding-bottom: 0.75rem;
            font-weight: 700;
        }
        .report-meta {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            color: #94a3b8;
            margin-bottom: 1.25rem;
            line-height: 1.6;
        }
        .highlight { color: #f8fafc; font-weight: 600; }
        
        .risk-row {
            margin-bottom: 1.25rem;
            font-family: 'Inter', sans-serif;
        }
        .risk-label { 
            color: #e2e8f0; 
            font-weight: 600; 
            font-size: 0.7rem; 
            display: block; 
            margin-bottom: 4px; 
            opacity: 0.8;
        }
        .risk-score { 
            color: #ef4444; 
            font-family: 'JetBrains Mono', monospace; 
            font-size: 1.25rem; 
            font-weight: 700; 
            letter-spacing: -0.02em;
        }
        
        .analytics-section h5 {
            color: #64748b;
            font-size: 0.7rem;
            margin: 0 0 0.75rem 0;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
        }
        .analytics-list {
            list-style: none;
            padding: 0;
            margin: 0 0 1.5rem 0;
            font-size: 0.85rem;
            color: #cbd5e1;
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
        }
        .analytics-list li {
            margin-bottom: 0.6rem;
            padding-left: 0.75rem;
            border-left: 2px solid #333;
        }
        .highlight-green { 
            color: #4ade80; 
            font-family: 'JetBrains Mono', monospace; 
            font-weight: 500;
        }
        
        .gnn-section {
            background: rgba(15, 23, 42, 0.6);
            padding: 1rem;
            border-radius: 8px;
            font-size: 0.8rem;
            color: #cbd5e1;
            margin-bottom: 1.5rem;
            border-left: 3px solid #38bdf8;
            line-height: 1.5;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .volume-section {
            font-family: 'Inter', sans-serif;
            font-size: 0.95rem;
            font-weight: 600;
            color: #fff;
            margin-bottom: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .tags-section {
            display: flex;
            flex-wrap: wrap;
            gap: 0.6rem;
        }
        .tag-badge {
            background: rgba(239, 68, 68, 0.15);
            color: #fca5a5;
            border: 1px solid rgba(239, 68, 68, 0.3);
            padding: 0.35rem 0.6rem;
            border-radius: 6px;
            font-size: 0.7rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 5px;
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.02em;
        }

        .slider { width: 100%; margin-top: 0.5rem; accent-color: #0ea5e9; }
      `}</style>
        </aside>
    );
}
