import api from './api';

export const stockIn = (data) => api.post('/inventory/stock-in', data);
export const stockOut = (data) => api.post('/inventory/stock-out', data);
export const getTransactions = (params) => api.get('/inventory/history', { params });
export const getDashboardStats = () => api.get('/inventory/stats');
