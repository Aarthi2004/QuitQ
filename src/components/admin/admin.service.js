import apiClient from '../../services/axiosConfig';

// Named export for class
export class AdminDashboardService {
    apiClient = apiClient;

    async getUsers() {
        return this.apiClient.get('api/users');
    }
    async deleteUser(userId) {
        return this.apiClient.delete(`api/users/${userId}`);
    }
    async getProducts() {
        return this.apiClient.get('api/products');
    }
    async deleteProduct(productId) {
        return this.apiClient.delete(`api/products/${productId}`);
    }

    async getStores() {
        return this.apiClient.get('api/stores');
    }
    async postStore(storeData) {
        return this.apiClient.post('api/stores', storeData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
    async deleteStore(storeId) {
        return this.apiClient.delete(`api/stores/${storeId}`);
    }

    async getCategories() {
        return this.apiClient.get('api/categories');
    }
    async postCategory(categoryName) {
        return this.apiClient.post('api/categories', { categoryName });
    }
    async deleteCategory(categoryId) {
        return this.apiClient.delete(`api/categories/${categoryId}`);
    }

    async getSubcategories() {
        return this.apiClient.get('api/subcategories');
    }
    async postSubcategory(subCategoryData) {
        return this.apiClient.post('api/subcategories', subCategoryData);
    }
    async deleteSubcategory(subcategoryId) {
        return this.apiClient.delete(`api/subcategories/${subcategoryId}`);
    }

    async postBrand(brandData) {
        return this.apiClient.post('api/brands', brandData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
    async getBrands() {
        return this.apiClient.get('api/brands');
    }
    async deleteBrand(brandId) {
        return this.apiClient.delete(`api/brands/${brandId}`);
    }

    async getStates() {
        return this.apiClient.get('api/states');
    }
    async deleteState(stateId) {
        return this.apiClient.delete(`api/states/${stateId}`);
    }
    async getCities() {
        return this.apiClient.get('api/cities');
    }
    async deleteCity(cityId) {
        return this.apiClient.delete(`api/cities/${cityId}`);
    }

    async getGenders() {
        return this.apiClient.get('api/genders');
    }
    async deleteGender(genderId) {
        return this.apiClient.delete(`api/genders/${genderId}`);
    }

    async getAllOrders() {
        return this.apiClient.get('/api/order/all');
    }
    async getOrdersByStore(storeId) {
        return this.apiClient.get(`/api/order/store/${storeId}`);
    }
    async getShippers() {
        return this.apiClient.get('/api/shipment/all');
    }
    async getShipperById(shipId) {
        return this.apiClient.get(`/api/shipment/${shipId}`);
    }
    async updateOrderStatus(orderId, orderStatus) {
        return this.apiClient.put('/api/shipment/updateorder', { orderId, orderStatus });
    }
    async updateDeliveryStatus(shipId, orderId, orderStatus) {
        return this.apiClient.put('/api/shipment/update-delivery-status', { shipId, orderId, orderStatus });
    }
    async generateShipperOTP(shipId) {
        return this.apiClient.post(`/api/shipment/generateotp/${shipId}`);
    }
    async validateShipperOTP(shipperId, OTP, orderId) {
        return this.apiClient.post('/api/shipment/validateotp', { shipperId, OTP, orderId });
    }
}

// Default export for app use (do not use in test for class, use named export above)
export default new AdminDashboardService();
