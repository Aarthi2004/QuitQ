// We mock the specific configuration file that USES axios.
// Note the path may need to be adjusted based on your folder structure.
jest.mock('../../services/axiosConfig', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Now when SellerService is imported, it receives our fake apiClient.
import apiClient from '../../services/axiosConfig';
import SellerService from './seller.service';

describe('SellerService', () => {
  let sellerService;

  beforeEach(() => {
    // Clear mock history before each test for a clean slate
    jest.clearAllMocks();
    // **FIX:** Pass the mocked apiClient into the service's constructor
    sellerService = new SellerService(apiClient);
  });

  it('should call getProductsByStore with the correct URL', async () => {
    const storeId = 123;
    apiClient.get.mockResolvedValue({ data: [{ id: 1, name: 'Test Product' }] });
    await sellerService.getProductsByStore(storeId);
    expect(apiClient.get).toHaveBeenCalledWith(`/api/products/bystore/${storeId}`);
  });

  it('should call createProduct with the correct URL and data', async () => {
    const formData = { name: 'New Product', price: 100 };
    const expectedConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
    apiClient.post.mockResolvedValue({ data: { id: 2, ...formData } });
    await sellerService.createProduct(formData);
    expect(apiClient.post).toHaveBeenCalledWith('/api/products', formData, expectedConfig);
  });

  it('should call updateProduct with the correct URL and data', async () => {
    const productId = 456;
    const formData = { name: 'Updated Product', price: 150 };
    const expectedConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
    apiClient.put.mockResolvedValue({ data: { id: productId, ...formData } });
    await sellerService.updateProduct(productId, formData);
    expect(apiClient.put).toHaveBeenCalledWith(`/api/products/${productId}`, formData, expectedConfig);
  });

  it('should call getUserStores with the correct URL', async () => {
    const userId = 789;
    apiClient.get.mockResolvedValue({ data: [{ id: 1, name: 'My Store' }] });
    await sellerService.getUserStores(userId);
    expect(apiClient.get).toHaveBeenCalledWith(`/api/stores/userstores/${userId}`);
  });
});

