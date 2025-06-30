import axios from "axios";

// Make sure we're using the correct API URL
const API_URL = "http://localhost:5001/api";

// Create axios instance with explicit configuration
const api = axios.create({
   baseURL: API_URL,
   headers: {
      "Content-Type": "application/json",
   },
   withCredentials: true,
   timeout: 10000, // Add a timeout to prevent hanging requests
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("token");
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      // Log outgoing requests for debugging
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data || {});

      return config;
   },
   (error) => {
      console.error("API Request Error:", error);
      return Promise.reject(error);
   },
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
   (response) => {
      // Log successful responses for debugging
      console.log(`API Response: ${response.status}`, response.data);
      return response;
   },
   (error) => {
      // Log detailed error information
      console.error("API Error:", {
         url: error.config?.url,
         method: error.config?.method,
         status: error.response?.status,
         data: error.response?.data,
         message: error.message,
      });

      if (error.response && error.response.status === 401) {
         // Token expired or invalid, logout user
         // localStorage.removeItem("token");
         // localStorage.removeItem("user");
         // window.location.href = "/login";
      }

      return Promise.reject(error);
   },
);

// Make sure axios is used consistently throughout the app
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000; // Add a timeout to prevent hanging requests

// Log global axios configuration for debugging
console.log("Axios global configuration:", {
   baseURL: axios.defaults.baseURL,
   withCredentials: axios.defaults.withCredentials,
   headers: axios.defaults.headers.common,
});

export default api;
