import React, { useEffect, useState, useRef } from 'react';
import { getEgoGraph } from '../../services/api';

// Note: For a real production app we'd use 'react-force-graph-2d'
// For this prototype without extra npm installs yet, use a simple SVG or mock
// This component aims to replicate the "Smurf Hunter" Tab
export default function ForensicGraph({ centerNode }) {
    const [data, setData] = useState({ nodes: [], edges: [] });

    useEffect(() => {
        if (centerNode) {
            getEgoGraph(centerNode.address).then(setData);
        }
    }, [centerNode]);

    if (!centerNode) return <div className="empty-state">Select a subject to view forensic graph</div>;

    return (
        <div className="content-section" style={{ height: '600px', position: 'relative' }}>
            <h2 className="section-title">Forensic Investigation: {centerNode.address}</h2>

            <div style={{
                width: '100%',
                height: '500px',
                background: '#111',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Placeholder for Force Directed Graph */}
                <svg width="100%" height="100%" viewBox="0 0 800 600">
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#444" />
                        </marker>
                    </defs>

                    {/* Render Links */}
                    {data.edges.map((edge, i) => {
                        const sx = 400 + (Math.random() - 0.5) * 600;
                        const sy = 300 + (Math.random() - 0.5) * 400;
                        const tx = 400 + (Math.random() - 0.5) * 600;
                        return (
                            <line key={i} x1={400} y1={300} x2={tx} y2={sy} stroke="#333" strokeWidth="1" markerEnd="url(#arrow)" />
                        )
                    })}

                    {/* Render Nodes (Center + Neighbors) */}
                    <circle cx="400" cy="300" r="20" fill="#FFD700" stroke="#fff" strokeWidth="2" />
                    <text x="400" y="340" textAnchor="middle" fill="#FFD700" fontSize="12">TARGET</text>

                    {data.nodes.filter(n => n.group !== 'target').map((node, i) => {
                        const x = 400 + Math.cos(i) * 200;
                        const y = 300 + Math.sin(i) * 200;
                        const color = node.group === 'high_risk' ? '#ff1744' : '#888';
                        return (
                            <g key={i}>
                                <circle cx={x} cy={y} r="10" fill={color} />
                                <text x={x} y={y + 20} textAnchor="middle" fill="#ccc" fontSize="10">{node.label}</text>
                            </g>
                        )
                    })}
                </svg>

                <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>
                    <div>🟡 Target (Gold)</div>
                    <div>🔴 High Risk (Red)</div>
                    <div>⚪ Normal (Grey)</div>
                </div>
            </div>
        </div>
    );
}
