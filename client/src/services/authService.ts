import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  // The baseURL can be removed or set to '/' since we are calling our own API routes
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  withCredentials: true, // This remains crucial
});

export const authService = {
  signup: async (userData: object) => {
    try {
      // Change this URL
      const response = await api.post("/api/auth/signup", userData);
      return response.data;
    } catch (error) {
      console.error("Error during sign up:", error);
      throw error;
    }
  },

  login: async (userData: object) => {
    try {
      // Change this URL
      const response = await api.post("/api/auth/login", userData);
      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  googleLogin: async () => {
    // This will be handled differently, for now, we can point it to the backend
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  logout: async () => {
    try {
      // Change this URL
      const response = await api.post("/api/auth/logout");
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
