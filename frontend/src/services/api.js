import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const MAX_SCREENSHOT_HEIGHT_PX = 800;

// Response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// --- Overview & Lists ---
export const getOverview = () => api.get('/overview').then(res => res.data);
export const getAnomalies = () => api.get('/anomalies').then(res => res.data);
export const getNetworkStats = () => api.get('/network/stats').then(res => res.data);
export const getRiskMap = () => api.get('/risk-map').then(res => res.data);

// --- Feature Porting: New Endpoints ---
export const getEgoGraph = (centerId) =>
    api.get(`/network/graph`, { params: { center: centerId } }).then(res => res.data);

export const getSankeyData = (centerId) =>
    api.get(`/flow`, { params: { center: centerId } }).then(res => res.data);

export const getContagionData = () =>
    api.get(`/contagion`).then(res => res.data);

export const generateSAR = (suspectData) =>
    api.post(`/sar/generate`, suspectData).then(res => res.data);

export const predict = (transactions) =>
    api.post('/predict', { transactions }).then(res => res.data);

export default api;
