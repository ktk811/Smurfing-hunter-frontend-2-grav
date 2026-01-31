import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function LoadingScreen({ onComplete }) {
    const [loadingStep, setLoadingStep] = useState(0);

    const loadingSteps = [
        'Loading Dataset.........',
        'Running it through GNN.......',
        'Predicting Anomalies.........',
        'Loading Visuals.........'
    ];

    useEffect(() => {
        const stepDuration = 1750; // 7000ms / 4 steps
        const intervals = [];

        for (let i = 0; i < loadingSteps.length; i++) {
            intervals.push(
                setTimeout(() => {
                    setLoadingStep(i);
                }, i * stepDuration)
            );
        }

        const finalTimeout = setTimeout(() => {
            onComplete();
        }, loadingSteps.length * stepDuration);

        return () => {
            intervals.forEach(clearTimeout);
            clearTimeout(finalTimeout);
        };
    }, [onComplete]);

    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="logo-animation">
                    <Shield className="shield-icon" />
                    <div className="pulse-ring"></div>
                </div>
                <h1 className="loading-title">Smurfing Hunter</h1>
                <div className="loading-text">
                    {loadingSteps[loadingStep]}
                </div>
                <div className="loading-bar">
                    <div className="loading-progress" style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}></div>
                </div>
            </div>
        </div>
    );
}
