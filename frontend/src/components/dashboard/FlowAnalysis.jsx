import React, { useEffect, useState, useRef } from 'react';
import { getSankeyData } from '../../services/api';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';

export default function FlowAnalysis({ centerNode }) {
    const [data, setData] = useState(null);
    const svgRef = useRef(null);
    const wrapperRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (centerNode) getSankeyData(centerNode.address).then(setData);
    }, [centerNode]);

    useEffect(() => {
        if (!wrapperRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) setDimensions(entry.contentRect);
        });
        resizeObserver.observe(wrapperRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!data || !svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Custom Margins to center the "Target" bar
        const margin = { top: 20, right: 100, bottom: 20, left: 100 };
        const chartWidth = dimensions.width - margin.left - margin.right;
        const chartHeight = dimensions.height - margin.top - margin.bottom;

        const sankeyGenerator = sankey()
            .nodeAlign(sankeyLeft)
            .nodeWidth(10) // Matches screenshot bar width
            .nodePadding(30)
            .extent([[1, 1], [chartWidth - 1, chartHeight - 5]])
            .iterations(32);

        const graph = {
            nodes: data.nodes.map(d => Object.assign({}, d)),
            links: data.links.map(d => Object.assign({}, d))
        };

        try {
            const { nodes, links } = sankeyGenerator(graph);
            const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

            // LINKS - Sender Color Flow
            g.append("g")
                .attr("fill", "none")
                .attr("stroke-opacity", 0.7)
                .selectAll("path")
                .data(links)
                .join("path")
                .attr("d", sankeyLinkHorizontal())
                .attr("stroke", d => {
                    const name = d.source.name.toUpperCase();
                    if (name.includes("EXCHANGE")) return "#22c55e"; // Green Safe Risk
                    if (name.includes("DARK MARKET")) return "#dc2626"; // Red High Risk Source

                    // Outgoing Logic
                    if (d.value < 10) return "#ef4444"; // Peeling (Red)
                    return "#3b82f6"; // Standard (Blue)
                })
                .attr("stroke-width", d => Math.max(1, d.width))
                .style("mix-blend-mode", "normal");

            // NODES
            g.append("g")
                .selectAll("rect")
                .data(nodes)
                .join("rect")
                .attr("x", d => d.x0)
                .attr("y", d => d.y0)
                .attr("height", d => Math.max(1, d.y1 - d.y0))
                .attr("width", d => d.x1 - d.x0)
                .attr("fill", d => getColor(d.name))
                .attr("opacity", 1);

            // LABELS
            g.append("g")
                .attr("font-family", "Inter, sans-serif")
                .attr("font-size", 10)
                .attr("font-weight", "bold")
                .attr("fill", "#fff")
                .selectAll("text")
                .data(nodes)
                .join("text")
                .attr("x", d => d.x0 < chartWidth / 2 ? d.x0 - 6 : d.x1 + 6)
                .attr("y", d => (d.y1 + d.y0) / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", d => d.x0 < chartWidth / 2 ? "end" : "start")
                .text(d => d.name);

        } catch (e) { console.error(e); }

    }, [data, dimensions]);

    // STRICT COLOR MAPPING
    const getColor = (name) => {
        const n = name.toUpperCase();
        if (n.includes("EXCHANGE")) return "#22c55e"; // Green (Safe Source)
        if (n.includes("DARK MARKET")) return "#dc2626"; // Dark Red (Risky Source)
        if (n.includes("TARGET")) return "#facc15"; // Yellow
        return "#ef4444"; // Red (Mules)
    };

    if (!centerNode) return <div className="empty-state">Select a subject</div>;

    return (
        <div className="viz-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px', background: '#050505', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #222', background: '#0a0a0a' }}>
                <h2 style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem' }}>🌊 Money Flow Tracer</h2>
            </div>
            <div ref={wrapperRef} style={{ flex: 1, position: 'relative', width: '100%', overflow: 'hidden' }}>
                <svg ref={svgRef} width={dimensions.width} height={dimensions.height} style={{ position: 'absolute', top: 0, left: 0 }}></svg>
            </div>
        </div>
    );
}
