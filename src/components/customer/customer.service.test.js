import axios from 'axios';
import CustomerService from './customer.service';

// Mock the entire axios library
jest.mock('axios');

describe('CustomerService', () => {
    let customerService;
    const apiClient = axios;

    beforeEach(() => {
        customerService = new CustomerService(apiClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test Case 1: Fetching all products (GET)
    it('should call getProducts with the correct URL', async () => {
        const expectedUrl = '/api/products';
        apiClient.get.mockResolvedValue({ data: [] });

        await customerService.getProducts();

        expect(apiClient.get).toHaveBeenCalledWith(expectedUrl);
    });

    // Test Case 2: Searching for products (GET with query params)
    it('should call searchProducts with the correct URL and query', async () => {
        const query = 'laptop';
        const expectedUrl = `/api/products/search?query=${query}`;
        apiClient.get.mockResolvedValue({ data: [] });

        await customerService.searchProducts(query);

        expect(apiClient.get).toHaveBeenCalledWith(expectedUrl);
    });

    // Test Case 3: Adding to cart (POST)
    it('should call addToCart with the correct URL and data', async () => {
        const cartData = { productId: 1, quantity: 2 };
        const expectedUrl = '/api/cart/add';
        apiClient.post.mockResolvedValue({ data: 'success' });

        await customerService.addToCart(cartData);

        expect(apiClient.post).toHaveBeenCalledWith(expectedUrl, cartData);
    });

    // Test Case 4: Deleting a cart item (DELETE)
    it('should call deleteCartItem with the correct URL', async () => {
        const cartItemId = 55;
        const expectedUrl = `/api/cart/delete/${cartItemId}`;
        apiClient.delete.mockResolvedValue({ data: 'success' });

        await customerService.deleteCartItem(cartItemId);

        expect(apiClient.delete).toHaveBeenCalledWith(expectedUrl);
    });

    // Test Case 5: Placing an order (POST)
    it('should call placeOrder with the correct URL and data', async () => {
        const orderData = { addressId: 10, paymentMethod: 'Credit Card' };
        const expectedUrl = '/api/checkout/place-order';
        apiClient.post.mockResolvedValue({ data: 'success' });

        await customerService.placeOrder(orderData);

        expect(apiClient.post).toHaveBeenCalledWith(expectedUrl, orderData);
    });
});
