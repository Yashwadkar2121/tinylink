import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to false if you're not using cookies/auth
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication error:", error.response.data);
    } else if (error.response?.status === 404) {
      console.error("Endpoint not found:", error.config.url);
    } else if (
      error.code === "NETWORK_ERROR" ||
      error.message.includes("Network Error")
    ) {
      console.error("Network error - check if server is running");
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
      await axios.get(`${API_BASE_URL}/${shortCode}`);
    } catch (err) {
      console.warn("Redirect tracking failed:", err.message);
    }
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get("/api/healthz");
    return response.data;
  },
};

export default api;
