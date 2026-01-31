import React, { useEffect, useState } from 'react';
import { getSankeyData } from '../../services/api';

// For real Sankey, we'd use 'recharts' Sankey or 'plotly.js'
// This is a simplified visual representation
export default function FlowTracer({ centerNode }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (centerNode) {
            getSankeyData(centerNode.address).then(setData);
        }
    }, [centerNode]);

    if (!centerNode) return <div className="empty-state">Select a subject for Flow Analysis</div>;

    return (
        <div className="content-section">
            <h2 className="section-title">Money Flow Tracer (Peeling Analysis)</h2>
            <div style={{
                width: '100%',
                height: '400px',
                background: '#121212',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                position: 'relative'
            }}>
                {/* Simple Visual Mock of Flows (Source -> Target -> Dest) */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '10px', color: '#4ade80' }}>Incoming Sources</div>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ width: '100px', height: '40px', background: 'rgba(74, 222, 128, 0.2)', margin: '10px', borderLeft: '4px solid #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Src {i}</div>
                    ))}
                </div>

                <div style={{ width: '2px', height: '300px', background: '#333' }}></div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '20px', color: '#fbbf24', fontSize: '1.2em', fontWeight: 'bold' }}>TARGET WALLET</div>
                    <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.1)', border: '2px solid #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {centerNode.address.substring(0, 6)}
                    </div>
                </div>

                <div style={{ width: '2px', height: '300px', background: '#333' }}></div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '10px', color: '#f87171' }}>Outgoing Destinations</div>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ width: '100px', height: '30px', background: 'rgba(248, 113, 113, 0.2)', margin: '10px', borderRight: '4px solid #f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Dest {i}</div>
                    ))}
                </div>
            </div>
            <p style={{ marginTop: '1rem', color: '#888', fontSize: '0.9rem', textAlign: 'center' }}>
                Visualizing Top 15 Streams (Incoming vs Outgoing)
            </p>
        </div>
    );
}
