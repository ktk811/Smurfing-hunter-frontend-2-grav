import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getRiskMap } from '../../services/api';

export default function GlobalRisk() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRiskMap().then(res => {
            setData(res);
            setLoading(false);
        });
    }, []);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div style={{ background: '#000', border: '1px solid #333', padding: '8px', borderRadius: '4px', fontSize: '0.75rem', color: '#ccc' }}>
                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{d.address.substring(0, 8)}...</div>
                    <div>Risk: <span style={{ color: d.y > 0.8 ? '#f87171' : '#4ade80' }}>{d.y.toFixed(4)}</span></div>
                    <div>Vol: ${Math.round(d.x).toLocaleString()}</div>
                </div>
            );
        }
        return null;
    };

    if (loading) return <div style={{ color: '#666', padding: '2rem' }}>Loading 2,500+ points...</div>;

    return (
        <div className="viz-container" style={{ background: '#050505', border: '1px solid #222', borderRadius: '12px', padding: '1rem' }}>
            <div className="viz-header" style={{ marginBottom: '1rem' }}>
                <h2 style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0 }}>🌍 Global Risk Map (Log Scale)</h2>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Analysis of 15,201 Active Wallets</span>
            </div>

            <div style={{ height: 450 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />

                        {/* LOG SCALE for Massive Volume Range */}
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Volume"
                            scale="log"
                            domain={['auto', 'auto']}
                            stroke="#64748b"
                            tick={{ fontSize: 10 }}
                            tickFormatter={(val) => new Intl.NumberFormat('en-US', { notation: "compact", style: "currency", currency: "USD" }).format(val)}
                        />

                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Risk Score"
                            stroke="#64748b"
                            tick={{ fontSize: 10 }}
                            domain={[0, 1]}
                        />

                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#444' }} />

                        <Scatter name="RiskEntities" data={data} fill="#8884d8">
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.group === 'suspect' ? '#ef4444' : '#0ea5e9'}
                                    fillOpacity={entry.group === 'suspect' ? 0.8 : 0.4}
                                    // Tiny dots for high density look
                                    r={entry.group === 'suspect' ? 4 : 2}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
