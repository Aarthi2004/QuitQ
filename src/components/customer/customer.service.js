// src/services/CustomerService.js

class CustomerService {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    async getProducts() {
        return this.apiClient.get('/api/products');
    }

    async getProductById(id) {
        return this.apiClient.get(`/api/products/${id}`);
    }
    
    async getProductsBySubcategory(subcategoryId) {
        return this.apiClient.get(`/api/products/bysubcategory/${subcategoryId}`);
    }

    async filterProducts(filterData) {
        return this.apiClient.post('/api/products/filter', filterData);
    }

    async searchProducts(query) {
        return this.apiClient.get(`/api/products/search?query=${query}`);
    }

    async getCart() {
        return this.apiClient.get('/api/cart');
    }

    async addToCart(data) {
        return this.apiClient.post('/api/cart/add', data);
    }

    async increaseQuantity(cartItemId) {
        return this.apiClient.post(`/api/cart/increase-quantity/${cartItemId}`);
    }

    async decreaseQuantity(cartItemId) {
        return this.apiClient.post(`/api/cart/decrease-quantity/${cartItemId}`);
    }

    async getCartTotalCost() {
        return this.apiClient.get('/api/cart/totalcost');
    }

    async deleteCartItem(cartItemId) {
        return this.apiClient.delete(`/api/cart/delete/${cartItemId}`);
    }

    async getWishlist() {
        return this.apiClient.get('/api/wishlist');
    }

    async addToWishlist(data) {
        return this.apiClient.post('/api/wishlist', data);
    }

    async deleteWishlistItem(productId) {
        return this.apiClient.delete(`/api/wishlist/${productId}`);
    }

    async getOrders(userId) {
        return this.apiClient.get(`/api/order/all/${userId}`);
    }

    async placeOrder(data) {
        return this.apiClient.post('/api/checkout/place-order', data);
    }

    async getShipmentOTP(shipmentId) {
        return this.apiClient.get(`/api/shipment/${shipmentId}`);
    }

    async getShipmentOTPByOrderId(orderId) {
        return this.apiClient.get(`/api/shipment/by-order/${orderId}`);
    }

    async getUserAddresses(userId) {
        return this.apiClient.get(`/api/user-addresses/user/${userId}`);
    }

    async addUserAddress(data) {
        return this.apiClient.post('/api/user-addresses', data);
    }

    async updateUserAddress(userAddressId, data) {
        return this.apiClient.put(`/api/user-addresses/${userAddressId}`, data);
    }
    
    async getCategories() {
        return this.apiClient.get('/api/categories');
    }
    
    async getBrands() {
        return this.apiClient.get('/api/brands');
    }
}

export default CustomerService;