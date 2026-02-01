import React, { useState, useEffect } from 'react';
import { Activity, Shield, Network, Zap, Waves, TrendingUp, AlertTriangle } from 'lucide-react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import LoadingScreen from './components/ui/LoadingScreen';
import StatsGrid from './components/dashboard/StatsGrid';
import AnomalyList from './components/dashboard/AnomalyList';

// Core Tabs
import NetworkInvestigation from './components/dashboard/NetworkInvestigation';
import FlowAnalysis from './components/dashboard/FlowAnalysis';
import GlobalRisk from './components/dashboard/GlobalRisk';
import ContagionMonitor from './components/dashboard/ContagionMonitor';

import { getOverview, getAnomalies } from './services/api';

export default function App() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('smurfHunter');

    // Application Data
    const [anomalies, setAnomalies] = useState([]);
    const [selectedSuspect, setSelectedSuspect] = useState(null);
    const [overview, setOverview] = useState(null);

    const [error, setError] = useState(null);

    useEffect(() => {
        // Initial Data Load
        Promise.all([
            getOverview(),
            getAnomalies()
        ]).then(([overviewData, anomaliesData]) => {
            setOverview(overviewData);
            setAnomalies(anomaliesData);
            if (anomaliesData.length > 0) setSelectedSuspect(anomaliesData[0]);
        }).catch(err => {
            console.error("Critical Load Error", err);
            setError(`Failed to load data: ${err.message}. Is Backend running?`);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;

    if (error) return (
        <div style={{ color: 'red', padding: '2rem', textAlign: 'center', background: '#220000', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={48} style={{ marginBottom: '1rem' }} />
            <h2>System Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#ef4444', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>Retry Connection</button>
        </div>
    );

    return (
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <Header />

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* SIDEBAR: Controls & Profile */}
                <Sidebar
                    suspects={anomalies}
                    selectedSuspect={selectedSuspect}
                    onSelectSuspect={setSelectedSuspect}
                />

                {/* MAIN: Visualizations */}
                <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                    <main className="main-content">

                        {/* TABS Navigation */}
                        <div className="nav-tabs">
                            <button className={`tab-button ${activeTab === 'smurfHunter' ? 'active' : ''}`} onClick={() => setActiveTab('smurfHunter')}>
                                <Network size={16} style={{ marginRight: '8px', display: 'inline' }} />
                                Smurf Hunter
                            </button>
                            <button className={`tab-button ${activeTab === 'flowTracer' ? 'active' : ''}`} onClick={() => setActiveTab('flowTracer')}>
                                <Waves size={16} style={{ marginRight: '8px', display: 'inline' }} />
                                Flow Tracer
                            </button>
                            <button className={`tab-button ${activeTab === 'globalRisk' ? 'active' : ''}`} onClick={() => setActiveTab('globalRisk')}>
                                <Shield size={16} style={{ marginRight: '8px', display: 'inline' }} />
                                Global Risk
                            </button>
                            <button className={`tab-button ${activeTab === 'contagion' ? 'active' : ''}`} onClick={() => setActiveTab('contagion')}>
                                <Zap size={16} style={{ marginRight: '8px', display: 'inline' }} />
                                Contagion
                            </button>
                        </div>

                        {/* TAB CONTENT */}
                        <div className="tab-content" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            {activeTab === 'smurfHunter' && (
                                <NetworkInvestigation
                                    centerNode={selectedSuspect}
                                    onNodeClick={(node) => {
                                        if (node && node.id) {
                                            setSelectedSuspect({
                                                address: node.id,
                                                riskLevel: 'UNKNOWN',
                                                confidence: 0.5,
                                                metrics: {}
                                            });
                                        }
                                    }}
                                />
                            )}
                            {activeTab === 'flowTracer' && (
                                <FlowAnalysis centerNode={selectedSuspect} />
                            )}
                            {activeTab === 'globalRisk' && (
                                <GlobalRisk anomalies={anomalies} />
                            )}
                            {activeTab === 'contagion' && (
                                <ContagionMonitor />
                            )}
                        </div>

                        {/* SHARED: Anomaly List (Bottom) */}
                        <div style={{ marginTop: '2rem' }}>
                            <StatsGrid stats={overview} />
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
}
