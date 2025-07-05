import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  withCredentials: true, // Enable sending cookies with requests
});

export const authService = {
  signup: async (userData: object) => {
    try {
      const response = await api.post("/auth/signup", userData);
      return response;
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    }
  },

  login: async (userData: object) => {
    try {
      const response = await api.post("/auth/login", userData);
      return response;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  googleLogin: async () => {
    try {
      const response = await api.get("/auth/google");
      return response;
    } catch (error) {
      console.error("Error during Google login:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response;
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },

  updateProfile: async (profileData: { name?: string; username?: string; bio?: string }) => {
    try {
      const response = await api.put("/auth/update-profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  uploadAvatar: async (file: File) => {
    // console.log("Uploading avatar:", file);
    
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      // console.log("formData appended", formData);

      const response = await api.post("/auth/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(response);
      
      return response.data;  
      
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },
};
