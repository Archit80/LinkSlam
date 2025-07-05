import axios from "axios";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  withCredentials: true, // Allow cookies to be sent with requests
});

export const publicLinksService = {
  getPublicFeedLinks: async (page = 1, limit = 12) => {
    try {
      const response = await api.get(`/public/feed?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching public links:", error);
      return error;
    }
  },

  createPublicLink: async (linkData: object) => {
    try {
      const response = await api.post(`/public/create`, linkData);
      return response.data;
    } catch (error) {
      console.error("Error creating public link:", error);
      return error;
    }
  },

  toggleLikeLink: async (linkId: string) => {
    try {
      const response = await api.post(`/public/like/${linkId}`);
      return response.data;
    } catch (error) {
      console.error("Error toggling like on link:", error);
      return error;
    }
  },

  toggleSaveLink: async (linkId: string) => {
    try {
      const response = await api.post(`/public/save/${linkId}`);
      return response.data;
    } catch (error) {
      console.error("Error toggling save on link:", error);
      return error;
    }
  },

  searchLinks: async (q: string, tag: string) => {
    try {
      const response = await api.get("/public/search", {
        params: {
          q,
          tag,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching links:", error);
      throw error;
    }
  },
};
