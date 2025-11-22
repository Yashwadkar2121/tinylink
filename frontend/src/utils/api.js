import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const linksAPI = {
  // Create a new short link
  createLink: async (linkData) => {
    const response = await api.post("/api/links", linkData); // Added /api
    return response.data;
  },

  // Get all links
  getAllLinks: async () => {
    const response = await api.get("/api/links"); // Added /api
    return response.data;
  },

  // Get stats for a specific code
  getLinkStats: async (code) => {
    const response = await api.get(`/api/links/${code}`); // Added /api
    return response.data;
  },

  // Delete a link
  deleteLink: async (code) => {
    await api.delete(`/api/links/${code}`); // Added /api
  },

  // Hit redirect endpoint to trigger click count
  trackClick: async (shortCode) => {
    try {
      // Use the main API base URL for redirects
      await axios.get(`${API_BASE_URL}/${shortCode}`);
    } catch (err) {
      console.warn("Redirect tracking failed:", err.message);
    }
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get("/api/healthz"); // Added /api
    return response.data;
  },
};

export default api;
