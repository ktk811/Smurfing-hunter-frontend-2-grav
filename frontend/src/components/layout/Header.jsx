import React from 'react';
import { Shield } from 'lucide-react';

export default function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-section">
                    <Shield className="logo-icon" />
                    <h1 className="logo-text">Smurfing Hunter</h1>
                </div>
                <div className="status-badge">
                    <div className="status-dot"></div>
                    <span>System Active</span>
                </div>
            </div>
        </header>
    );
}
