import React, { useEffect, useState } from 'react';
import { getContagionData } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ContagionChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        getContagionData().then(setData);
    }, []);

    return (
        <div className="content-section">
            <h2 className="section-title">Contagion Growth (New Wallets / Hour)</h2>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="time" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                            itemStyle={{ color: '#ccc' }}
                        />
                        <Line type="monotone" dataKey="new_wallets" stroke="#0ea5e9" activeDot={{ r: 8 }} name="New Infections" />
                        <Line type="monotone" dataKey="total_infected" stroke="#ef4444" name="Total Network" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
