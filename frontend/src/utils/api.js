import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const linksAPI = {
  // Create a new short link
  createLink: async (linkData) => {
    const response = await api.post("/links", linkData);
    return response.data;
  },

  // Get all links
  getAllLinks: async () => {
    const response = await api.get("/links");
    return response.data;
  },

  // Get stats for a specific code
  getLinkStats: async (code) => {
    const response = await api.get(`/links/${code}`);
    return response.data;
  },

  // Delete a link
  deleteLink: async (code) => {
    await api.delete(`/links/${code}`);
  },

  // 🆕 Hit redirect endpoint to trigger click count
  trackClick: async (shortCode) => {
    try {
      await axios.get(
        `${
          import.meta.env.VITE_SERVER_REDIRECT_URL || "http://localhost:5000"
        }/${shortCode}`
      );
    } catch (err) {
      console.warn("Redirect tracking failed:", err.message);
    }
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get("/healthz");
    return response.data;
  },
};

export default api;
