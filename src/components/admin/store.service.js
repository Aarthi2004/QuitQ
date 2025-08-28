// /src/components/admin/store.service.js

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5193/api', // Your backend URL
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
});

class StoreService {
    async getStores() {
        return api.get('/stores');
    }

    async postStore(storeData) {
        return api.post('/stores', storeData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async deleteStore(storeId) {
        return api.delete(`/stores/${storeId}`);
    }

    async getCities() {
        return api.get('/cities');
    }
}

export default new StoreService();