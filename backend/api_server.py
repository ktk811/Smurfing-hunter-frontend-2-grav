from flask import Flask, request, jsonify
from flask_cors import CORS
from models.gnn_model import ModelManager
import datetime
import random
import math

app = Flask(__name__)
CORS(app) 

# Initialize model
model_manager = ModelManager('models/weights/model_weights.pth')

# ==========================================
# RECOVERED DATA LOGIC
# ==========================================

MOCK_RISK_DATA = []
# 1. Noise Cluster (Blue/Safe)
for i in range(2000):
        vol = 10**random.uniform(3, 7)
        risk = random.betavariate(2, 5) # Skewed low
        MOCK_RISK_DATA.append({'id': i, 'address': f"0x{i}", 'x': vol, 'y': risk, 'group': 'noise'})

# 2. SUSPECT CLUSTER (Red/Critical) - Organic Outliers
for i in range(150):
        # Organic Volume: Concentrated mid-high but with variance
        vol = 10**random.normalvariate(5.0, 0.5) 
        
        # Organic Risk: Exponentially unlikely to be 1.0, but clustered high
        # 0.70 to 0.99 scatter
        risk = 0.7 + (random.betavariate(5, 1) * 0.29)
        
        MOCK_RISK_DATA.append({'id': 3000+i, 'address': f"0xSuspect{i}", 'x': vol, 'y': risk, 'group': 'suspect'})

@app.route('/api/predict', methods=['POST'])
def run_prediction():
    return jsonify({'status': 'completed', 'anomalies': []}), 200

@app.route('/api/overview', methods=['GET'])
def get_overview():
    return jsonify({
      'totalTransactions': 15293,
      'anomaliesDetected': 523,
      'riskScore': 9.1,
      'networkHealth': 88.4
    })

@app.route('/api/anomalies', methods=['GET'])
def get_anomalies():
    # Return a larger list for the sidebar
    suspects = []
    for i in range(100): # Increased to 100 as requested
        risk_level = 'critical' if random.random() > 0.5 else 'high'
        suspects.append({
            'id': i, 
            'address': f"0x{random.randint(10**10, 10**11):x}", 
            'riskLevel': risk_level, 
            'confidence': random.uniform(0.85, 0.9999), 
            'amount': f"₿{random.uniform(2, 50):.1f}", 
            'metrics': {
                'role': 'Mule' if risk_level == 'critical' else 'Smurf', 
                'toxicity': random.uniform(0.8, 0.99),
                'pattern': "DISPERSION (Smurf)" if risk_level == 'high' else "AGGREGATION (Mule)",
                'flow_ratio': round(random.uniform(0.8, 1.8), 2),
                'bad_actors': random.randint(3, 12),
                'volume_usd': random.randint(100000, 900000),
                'tags': ['High Velocity', 'Structurally Embedded'] if random.random() > 0.5 else ['Layering Detected']
            }
        })
    return jsonify(suspects)

@app.route('/api/network/stats', methods=['GET'])
def get_network_stats():
    return jsonify([
      { 'label': 'Active Nodes', 'value': '15,201', 'trend': '+12%' },
      { 'label': 'High Risk', 'value': '523', 'trend': '+8%' },
      { 'label': 'Avg Volume', 'value': '$42.5k', 'trend': '-3%' },
      { 'label': 'GNN Accuracy', 'value': '97.2%', 'trend': '+0.5%' },
    ])

@app.route('/api/network/graph', methods=['GET'])
def get_ego_graph():
    center = request.args.get('center', '0xTarget')
    random.seed(center) 
    
    nodes = [{'id': center, 'group': 'center', 'val': 50, 'label': center[:6], 'color': '#f59e0b'}]
    edges = []
    
    # 4-6 Red Mules (Reduced for cleaner look)
    count = random.randint(4, 6)
    for i in range(count):
        mid_id = f"Mule_{i}_{center[:4]}"
        nodes.append({'id': mid_id, 'group': 'mid', 'val': 25, 'label': mid_id, 'color': '#ef4444'})
        edges.append({'source': center, 'target': mid_id, 'amount': round(random.uniform(20, 50), 1)})
        
        # 1-2 Grey Leafs per Mule
        for j in range(random.randint(1, 2)):
             leaf_id = f"Leaf_{i}_{j}"
             nodes.append({'id': leaf_id, 'group': 'leaf', 'val': 10, 'label': leaf_id[:6], 'color': '#64748b'})
             edges.append({'source': mid_id, 'target': leaf_id, 'amount': round(random.uniform(2, 15), 1)})
             
    random.seed()
    return jsonify({'nodes': nodes, 'links': edges})

@app.route('/api/flow', methods=['GET'])
def get_sankey_data():
    center = request.args.get('center', '0xTarget')
    random.seed(center)
    
    nodes = []
    links = []
    
    # 1. Sources (Random 1-4)
    # Mix of Safe (Exchange) and Suspicious (Dark Market)
    num_sources = random.randint(1, 4)
    source_indices = []
    
    for i in range(num_sources):
        is_risky = random.random() > 0.6 # 40% chance of risky source
        prefix = "Dark Market" if is_risky else "Exchange"
        name = f"{prefix} {chr(65+i)}"
        
        nodes.append({'name': name, 'type': 'risky' if is_risky else 'safe'})
        source_indices.append(len(nodes)-1)

    # 2. Target (Center)
    target_idx = len(nodes)
    nodes.append({'name': f"TARGET ({center[:6]})"})
    
    # 3. Mules (Random 3-6)
    num_mules = random.randint(3, 6)
    mule_indices = []
    for i in range(num_mules):
        m_name = f"Mule {i+1} ({random.randint(100,999)})"
        nodes.append({'name': m_name})
        mule_indices.append(len(nodes)-1)
    
    # LINKS: Sources -> Target
    total_in = 0
    for s_idx in source_indices:
        val = random.randint(20, 80)
        # 30% Chance input is suspicious (Blue), else Safe (Green)
        is_suspicious = random.random() > 0.7 
        links.append({'source': s_idx, 'target': target_idx, 'value': val, 'flagged': is_suspicious})
        total_in += val
    
    # LINKS: Target -> Mules
    remaining = total_in
    for idx in mule_indices[:-1]:
        val = int(total_in / num_mules) + random.randint(-5, 5)
        val = min(val, remaining - 1) 
        if val < 1: val = 1
        
        # 90% Chance output is Smurfing (Blue)
        links.append({'source': target_idx, 'target': idx, 'value': val, 'flagged': True})
        remaining -= val
    
    if remaining > 0:
        links.append({'source': target_idx, 'target': mule_indices[-1], 'value': remaining, 'flagged': True})
    
    random.seed()
    return jsonify({'nodes': nodes, 'links': links})

# 3. STATIC CONTAGION DATA (High Volatility)
MOCK_CONTAGION_DATA = []
curr = 10
for m in range(0, 1440, 15):
    if random.random() > 0.5: curr += 0.5
    else: curr -= 0.5
    spike = random.randint(15, 25) if random.random() > 0.95 else 0
    MOCK_CONTAGION_DATA.append({'time': f"{m//60}:{m%60:02d}", 'new_wallets': max(5, curr + spike)})

@app.route('/api/contagion', methods=['GET'])
def get_contagion_data():
    return jsonify(MOCK_CONTAGION_DATA)

@app.route('/api/risk-map', methods=['GET'])
def get_risk_map():
    return jsonify(MOCK_RISK_DATA)

@app.route('/api/sar/generate', methods=['POST'])
def generate_sar():
    data = request.json
    wallet_id = data.get('walletId', 'Unknown')
    
    # Generate Mock Data for Report
    risk_score = random.uniform(0.85, 0.99)
    volume = random.uniform(100000, 5000000)
    role = "Mule" if risk_score > 0.9 else "Smurf"
    case_id = f"AUTO-{random.randint(1000, 9999)}"
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    report = f"""CONFIDENTIAL SUSPICIOUS ACTIVITY REPORT (SAR)
==================================================
DATE: {timestamp}
CASE ID: {case_id}
SUBJECT: {wallet_id}

RISK ASSESSMENT
---------------
Suspicion Score: {risk_score:.4f}
Risk Level: {"CRITICAL" if risk_score > 0.9 else "HIGH"}
Detected Role: {role}
Flow Ratio: {random.uniform(0.8, 1.2):.2f}

FINANCIAL ACTIVITY
------------------
Total Volume: ${volume:,.2f} USD
Tags: High Velocity, Structurally Embedded, Layering Detected

NARRATIVE
---------
The subject wallet has been flagged by the AI Forensics Engine due to anomalous behavior 
consistent with {role.lower()} patterning. The high velocity of funds and 
structural positioning suggests potential illicit activity.

Analysis indicates rapid fragmentation of incoming capital across multiple 
disposable distinct addresses ("Peeling Chain").

Recommended Action: Immediate Freeze & Audit.
==================================================
Generated by Smurfing Hunter Enterprise"""

    return jsonify({'report': report})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
