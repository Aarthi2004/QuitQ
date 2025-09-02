import axios from 'axios';
import { resetPasswordAPICall } from './resetPassword.service';
import { baseUrl } from '../../environment/environment.dev';

// Mock the axios library
jest.mock('axios');

describe('resetPasswordAPICall', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test Case 1: Successful password reset
    test('should call axios.put with the correct URL and payload', async () => {
        // Arrange
        const mockPayload = {
            email: 'user@example.com',
            newPassword: 'newSecurePassword123'
        };
        const expectedUrl = baseUrl + 'api/account/reset-password';
        const mockResponse = {
            data: {
                success: true,
                message: 'Password has been reset successfully.'
            }
        };

        axios.put.mockResolvedValueOnce(mockResponse);

        // Act
        const result = await resetPasswordAPICall(mockPayload);

        // Assert
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toHaveBeenCalledWith(expectedUrl, mockPayload);
        expect(result).toEqual(mockResponse);
    });

    // Test Case 2: Password reset fails (e.g., user not found)
    test('should throw an error when the API call fails', async () => {
        // Arrange
        const mockPayload = {
            email: 'nouser@example.com',
            newPassword: 'newSecurePassword123'
        };
        const mockError = new Error('User with this email not found');

        axios.put.mockRejectedValueOnce(mockError);

        // Act & Assert
        await expect(resetPasswordAPICall(mockPayload)).rejects.toThrow('User with this email not found');
    });
});