import axios from 'axios';

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002';
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const tok = localStorage.getItem('od_token');
  if (tok) config.headers.Authorization = `Bearer ${tok}`;
  return config;
});

export const formatUSD = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n || 0));

export const formatCrypto = (n, code = '') => {
  const v = Number(n || 0);
  const str = v.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
  return code ? `${str} ${code.toUpperCase()}` : str;
};
