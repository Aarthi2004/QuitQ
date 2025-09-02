import axios from 'axios';
import { registerAPICall } from './register.service';
import { baseUrl } from '../../environment/environment.dev';

// Mock the axios library
jest.mock('axios');

describe('registerAPICall', () => {

    afterEach(() => {
        // Clear all mock history and implementations after each test
        jest.clearAllMocks();
    });

    // Test Case 1: Successful registration
    test('should call axios.post with the correct URL and registration data', async () => {
        // Arrange
        const mockRegisterModel = {
            username: 'newuser',
            password: 'password123',
            email: 'new@example.com'
        };
        const expectedUrl = baseUrl + 'api/users/register';
        const mockResponse = {
            data: {
                success: true,
                message: 'User registered successfully'
            }
        };

        axios.post.mockResolvedValueOnce(mockResponse);

        // Act
        const result = await registerAPICall(mockRegisterModel);

        // Assert
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(expectedUrl, mockRegisterModel);
        expect(result).toEqual(mockResponse);
    });

    // Test Case 2: Registration fails (e.g., email already exists)
    test('should throw an error when the API call fails', async () => {
        // Arrange
        const mockRegisterModel = {
            username: 'newuser',
            password: 'password123',
            email: 'new@example.com'
        };
        const mockError = new Error('Email already in use');

        axios.post.mockRejectedValueOnce(mockError);

        // Act & Assert
        await expect(registerAPICall(mockRegisterModel)).rejects.toThrow('Email already in use');
    });
});