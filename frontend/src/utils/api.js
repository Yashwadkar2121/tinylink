import axios from "axios";

// Dynamic API URL detection
const getApiBaseUrl = () => {
  // For production (Vercel)
  if (window.location.hostname === "tinylink-9nqm.vercel.app") {
    return "https://tinylink-backend.onrender.com";
  }
  // For local development
  return "http://localhost:5000";
};

const API_BASE_URL = import.meta.env.VITE_API_URL || getApiBaseUrl();

console.log("API Base URL:", API_BASE_URL);
console.log("Current Hostname:", window.location.hostname);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
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

  // Get the correct redirect URL based on environment
  getRedirectUrl: (shortCode) => {
    const baseUrl = getApiBaseUrl();
    return `${baseUrl}/${shortCode}`;
  },

  // Handle redirect with click tracking
  handleRedirect: (shortCode) => {
    const redirectUrl = linksAPI.getRedirectUrl(shortCode);
    console.log("Redirecting to:", redirectUrl);
    window.open(redirectUrl, "_blank", "noopener,noreferrer");
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
