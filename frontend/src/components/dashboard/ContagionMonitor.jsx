import React, { useEffect, useState } from 'react';
import { getContagionData } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ContagionMonitor() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getContagionData().then(setData);
    }, []);

    return (
        <div className="viz-container" style={{ background: '#050505', border: '1px solid #222', borderRadius: '12px', padding: '1rem' }}>
            <div className="viz-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0 }}>⚡ Contagion Velocity</h2>
                    <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>New Wallet Infections / Minute</span>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    HIGH VOLATILITY DETECTED
                </div>
            </div>

            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#64748b"
                            tick={{ fontSize: 10 }}
                            interval={12} // Show fewer labels
                        />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#ccc' }}
                            itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                            labelStyle={{ color: '#64748b' }}
                        />

                        <Line
                            type="linear" // Sharp angles for "Spiky" look
                            dataKey="new_wallets"
                            stroke="#ef4444"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: '#fff' }}
                            animationDuration={1500}
                        />

                        {/* Gradient fill could be added with AreaChart, but user asked for "line" */}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
