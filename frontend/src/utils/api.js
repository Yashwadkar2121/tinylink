import axios from "axios";

// Use environment variable or default to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("API Base URL:", API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      console.error("Authentication required");
    } else if (error.response?.status === 404) {
      console.error("Endpoint not found:", error.config?.url);
    } else if (
      error.code === "NETWORK_ERROR" ||
      error.message.includes("Network Error")
    ) {
      console.error(
        "Network error - check if server is running and CORS is configured"
      );
    } else if (error.response?.status === 0) {
      console.error("CORS error - request blocked by browser");
    }

    return Promise.reject(error);
  }
);

export const linksAPI = {
  // Create a new short link
  createLink: async (linkData) => {
    const response = await api.post("/api/links", linkData);
    return response.data;
  },

  // Get all links
  getAllLinks: async () => {
    const response = await api.get("/api/links");
    return response.data;
  },

  // Get stats for a specific code
  getLinkStats: async (code) => {
    const response = await api.get(`/api/links/${code}`);
    return response.data;
  },

  // Delete a link
  deleteLink: async (code) => {
    await api.delete(`/api/links/${code}`);
  },

  // Hit redirect endpoint to trigger click count
  trackClick: async (shortCode) => {
    try {
      // Use axios instance without /api prefix for redirects
      const response = await axios.get(
        `${API_BASE_URL.replace("/api", "")}/${shortCode}`
      );
      return response.data;
    } catch (err) {
      console.warn("Redirect tracking failed:", err.message);
      throw err;
    }
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get("/api/healthz");
    return response.data;
  },

  // Test API connection
  testConnection: async () => {
    const response = await api.get("/api");
    return response.data;
  },
};

export default api;
