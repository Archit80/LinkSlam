import api from "./axiosInstance";

export const userLinksService = {
  getAllLinks: async () => {
    try {
      const response = await api.get(`/link/get-all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching links:", error);
      return error;
    }
  },

  getPublicLinks: async () => {
    try {
      const response = await api.get(`/link/get-public`);
      return response.data;
    } catch (error) {
      console.error("Error fetching public links:", error);
      return error;
    }
  },

  getPrivateLinks: async () => {
    try {
      const response = await api.get(`/link/get-private`);
      return response.data;
    } catch (error) {
      console.error("Error fetching private links:", error);
      return error;
    }
  },

  createLink: async (linkData:object) => {
    try {
      const response = await api.post(`/link/create`, linkData);
      return response.data;
    } catch (error) {
      console.error("Error creating link:", error);
      return error;
    }
  },

  updateLink: async (linkId: string, linkData: object) => {
    try {
      const response = await api.put(`/link/update/${linkId}`, linkData);
      return response.data;
    } catch (error) {
      console.error("Error updatingbut  link:", error);
      return error;
    }
  },

  deleteLink: async (linkId: string) => {
    try {
      const response = await api.delete(`/link/delete/${linkId}`);
      return response;
    } catch (error) {
      console.error("Error deleting link:", error);
      return error;
    }
  },

  searchLinks: async (q?: string, tag?: string) => {
    try {
      const response = await api.get("/link/search", {
        params: {
          q,
          tag,
        },
      });
      return response;
    } catch (error) {
      console.error("Error searching links:", error);
      return error;
    }
  },

  getUserTopTags: async () => {
    try {
      const response = await api.get("/link/top-tags");
      // console.log("Top tags response:", response.data);
      return response.data.tags; // Assuming the response is an array of tag objects with a 'name' property
    } catch (error) {
      console.error("Error fetching top tags:", error);
      return [];
    }
  },
};
