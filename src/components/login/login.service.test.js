import axios from 'axios';
import { loginAPICall } from './login.service';
import { baseUrl } from '../../environment/environment.dev';

// This line tells Jest to create a "stunt double" for the entire axios library.
jest.mock('axios');

describe('loginAPICall', () => {
    
    // Test Case 1: The API call is successful
    test('should call axios.post with the correct URL and data on success', async () => {
        // Arrange: Set up our test data and the fake successful response
        const loginModel = { username: 'testuser', password: 'password123' };
        const expectedUrl = baseUrl + 'api/token/login';
        const mockResponse = { 
            data: { 
                token: 'fake-jwt-token', 
                role: 'Customer' 
            } 
        };

        // Tell our "stunt double" axios to pretend the 'post' call was successful
        axios.post.mockResolvedValueOnce(mockResponse);

        // Act: Call the function we are testing
        const response = await loginAPICall(loginModel);

        // Assert: Check if everything happened as expected
        expect(axios.post).toHaveBeenCalledTimes(1); // Was it called exactly once?
        expect(axios.post).toHaveBeenCalledWith(expectedUrl, loginModel); // Was it called with the right URL and data?
        expect(response).toEqual(mockResponse); // Did our function return the fake response?
    });

    // Test Case 2: The API call fails
    test('should handle and throw an error when the API call fails', async () => {
        // Arrange: Set up test data and a fake error
        const loginModel = { username: 'testuser', password: 'password123' };
        const mockError = new Error('Network Error');

        // Tell our "stunt double" axios to pretend the 'post' call failed
        axios.post.mockRejectedValueOnce(mockError);

        // Act & Assert: We expect the function to throw an error, so we wrap it
        await expect(loginAPICall(loginModel)).rejects.toThrow('Network Error');
    });

    // This is good practice to clear mock history between tests
    afterEach(() => {
        jest.clearAllMocks();
    });
});