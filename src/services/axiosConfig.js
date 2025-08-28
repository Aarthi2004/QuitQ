import axios from "axios";

const requestInterceptor = (config) => {
  // Retrieve token from localStorage, matching the logout function
  const token = localStorage.getItem("authToken"); 
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

// Use a custom instance for better practice
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(requestInterceptor);

// Export the custom instance
export default apiClient;