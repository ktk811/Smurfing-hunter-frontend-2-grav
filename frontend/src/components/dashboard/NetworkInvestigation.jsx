import React, { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getEgoGraph } from '../../services/api';
import { ZoomIn, ZoomOut, Maximize, RefreshCcw } from 'lucide-react';
import * as d3 from 'd3';

export default function NetworkInvestigation({ centerNode }) {
    const [data, setData] = useState({ nodes: [], links: [] });
    const graphRef = useRef();
    const wrapperRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (centerNode) {
            getEgoGraph(centerNode.address).then(graphData => {
                setData(graphData);
            });
        }
    }, [centerNode]);

    // Handle Resize w/o Loop
    useEffect(() => {
        if (!wrapperRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) setDimensions(entry.contentRect);
        });
        resizeObserver.observe(wrapperRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (graphRef.current) {
            // ORGANIC TREE PHYSICS
            // 1. Collide: Prevent overlap
            graphRef.current.d3Force('collide', d3.forceCollide().radius(node => (node.val || 5) * 2));

            // 2. Charge: Strong Repulsion (Spread out for labels)
            graphRef.current.d3Force('charge', d3.forceManyBody().strength(-300));

            // 3. Link: Longer distance for numbers to fit
            graphRef.current.d3Force('link', d3.forceLink().distance(80));

            // 4. Center: Keep it in the middle
            graphRef.current.d3Force('center', d3.forceCenter(0, 0).strength(0.5));
        }
    }, [data]);

    return (
        <div className="viz-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px', background: '#050505', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>

            <div className="viz-controls" style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, display: 'flex', gap: '8px' }}>
                <button style={btnStyle} onClick={() => { graphRef.current.d3ReheatSimulation(); }}><RefreshCcw size={16} /></button>
                <button style={btnStyle} onClick={() => graphRef.current.zoom(2, 500)}><ZoomIn size={16} /></button>
                <button style={btnStyle} onClick={() => graphRef.current.zoom(0.5, 500)}><ZoomOut size={16} /></button>
                <button style={btnStyle} onClick={() => graphRef.current.zoomToFit(500, 50)}><Maximize size={16} /></button>
            </div>

            <div ref={wrapperRef} style={{ flex: 1, position: 'relative', width: '100%', overflow: 'hidden' }}>
                {dimensions.width > 0 && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <ForceGraph2D
                            ref={graphRef}
                            graphData={data}
                            width={dimensions.width}
                            height={dimensions.height}

                            // No DAG -> Organic Shape
                            dagMode={null}

                            // Visuals: Semantic Colors
                            nodeRelSize={6}
                            nodeLabel="label"
                            nodeColor={node => node.color}

                            // CUSTOM RENDERING (Always Visible Labels)
                            nodeCanvasObject={(node, ctx, globalScale) => {
                                const label = node.label;
                                const fontSize = 12 / globalScale;
                                ctx.font = `${fontSize}px Sans-Serif`;
                                const textWidth = ctx.measureText(label).width;
                                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                                // Draw Node Circle (Larger: 0.5 multiplier)
                                const r = node.val ? node.val * 0.5 : 4;
                                ctx.beginPath();
                                ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
                                ctx.fillStyle = node.color || 'grey';
                                ctx.fill();

                                // Draw Label Below
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                                ctx.font = `${40 / globalScale}px Inter, sans-serif`;
                                ctx.font = `600 ${4 / globalScale}px Inter`; // Dynamic scale
                                ctx.fillText(label, node.x, node.y + r + 2); // Text just below radius
                            }}

                            // LINKS
                            linkWidth={1.5}
                            linkColor={() => '#475569'}
                            linkDirectionalArrowLength={3.5}
                            linkDirectionalArrowRelPos={1}

                            // LINK LABELS (Numbers)
                            linkCanvasObject={(link, ctx, globalScale) => {
                                const start = link.source;
                                const end = link.target;

                                // Draw Line
                                ctx.beginPath();
                                ctx.moveTo(start.x, start.y);
                                ctx.lineTo(end.x, end.y);
                                ctx.strokeStyle = '#475569';
                                ctx.lineWidth = 1.5 / globalScale;
                                ctx.stroke();

                                // Draw Label
                                if (link.amount) {
                                    const textPos = Object.assign({}, ...['x', 'y'].map(c => ({
                                        [c]: start[c] + (end[c] - start[c]) * 0.5 // Center
                                    })));

                                    const fontSize = 10 / globalScale;
                                    ctx.font = `bold ${fontSize}px Sans-Serif`;
                                    ctx.fillStyle = 'white';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(link.amount, textPos.x, textPos.y);
                                }
                            }}
                            linkCanvasObjectMode={() => 'replace'}

                            backgroundColor="#050505"

                            cooldownTicks={100}
                            onEngineStop={() => graphRef.current.zoomToFit(400, 80)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

const btnStyle = {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#ccc',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)'
};
