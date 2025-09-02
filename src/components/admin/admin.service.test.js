// Always mock dependencies at the top before imports!
jest.mock('../../services/axiosConfig');

import apiClient from '../../services/axiosConfig';
import { AdminDashboardService } from './admin.service'; // Named import of the class

describe('AdminDashboardService', () => {
    let adminService;

    beforeEach(() => {
        adminService = new AdminDashboardService();
        jest.clearAllMocks();
    });

    it('should call getUsers with the correct URL', async () => {
        const expectedUrl = 'api/users';
        apiClient.get.mockResolvedValue({ data: [] });
        await adminService.getUsers();
        expect(apiClient.get).toHaveBeenCalledWith(expectedUrl);
    });

    it('should call deleteUser with the correct URL', async () => {
        const userId = 123;
        const expectedUrl = `api/users/${userId}`;
        apiClient.delete.mockResolvedValue({ data: 'success' });
        await adminService.deleteUser(userId);
        expect(apiClient.delete).toHaveBeenCalledWith(expectedUrl);
    });

    it('should call postStore with the correct URL and data', async () => {
        const storeData = { name: 'New Super Store' };
        const expectedUrl = 'api/stores';
        const expectedConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
        apiClient.post.mockResolvedValue({ data: 'success' });
        await adminService.postStore(storeData);
        expect(apiClient.post).toHaveBeenCalledWith(expectedUrl, storeData, expectedConfig);
    });

    it('should call postCategory with the correct URL and data', async () => {
        const categoryName = 'Appliances';
        const expectedUrl = 'api/categories';
        apiClient.post.mockResolvedValue({ data: 'success' });
        await adminService.postCategory(categoryName);
        expect(apiClient.post).toHaveBeenCalledWith(expectedUrl, { categoryName });
    });
});
