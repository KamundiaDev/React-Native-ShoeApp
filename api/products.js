import api from "./client";


export const fetchProducts = () => api.get('/products').then(res => res.data);