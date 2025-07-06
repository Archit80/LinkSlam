import api from "./axiosInstance";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const authService = {
  signup: async (userData: object) => {
    try {
      const response = await api.post("/api/auth/signup", userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    }
  },

  login: async (userData: object) => {
    try {
      const response = await api.post("/api/auth/login", userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  googleLogin: async () => {
    // This one is correct, it needs to redirect to the backend directly
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  logout: async () => {
    try {
      localStorage.removeItem("token");
      const response = await api.post("/api/auth/logout");
      return response;
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      // Use the new proxy route
      const response = await api.get("/api/auth/me");
      return response;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },

  updateProfile: async (profileData: { name?: string; username?: string; bio?: string }) => {
    try {
      // Use the new proxy route
      const response = await api.put("/api/auth/update-profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  uploadAvatar: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      // Use the new proxy route
      const response = await api.post("/api/auth/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },
};
