import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.100.100:8000/api',
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

export default api;
