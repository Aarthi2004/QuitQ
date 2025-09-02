import apiClient from '../../services/axiosConfig'; // Ensure this path is correct

class SellerService {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    // --- Product Management ---
    async getProductsByStore(storeId) {
        return this.apiClient.get(`/api/products/bystore/${storeId}`);
    }
    
    async createProduct(formData) {
        return this.apiClient.post('/api/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async updateProduct(productId, formData) {
        return this.apiClient.put(`/api/products/${productId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
    
    // --- Order & Shipment Management ---
    async getOrdersByStore(storeId) {
        return this.apiClient.get(`/api/order/store/${storeId}`);
    }

    async updateOrder(data) {
        return this.apiClient.put('/api/shipment/updateorder', data);
    }
    
    async generateOtp(shipId) {
        return this.apiClient.post(`/api/shipment/generateotp/${shipId}`);
    }

    async validateOtp(data) {
        return this.apiClient.post('/api/shipment/validateotp', data);
    }

    // --- Store Management ---
    async getUserStores(userId) {
        return this.apiClient.get(`/api/stores/userstores/${userId}`);
    }

    // --- Helper Methods (for form dropdowns) ---
    async getCategories() {
        return this.apiClient.get('/api/categories');
    }
    async getBrands() {
        return this.apiClient.get('/api/brands');
    }
  
    // Inside your SellerService class

// This is the missing function based on your provided Swagger UI.
    async getSubcategoriesByCategoryId(categoryId) {
        return this.apiClient.get(`/api/categories/${categoryId}/subcategories`);
    }
}

export default SellerService;