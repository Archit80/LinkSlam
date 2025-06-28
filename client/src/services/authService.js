import axios from 'axios';
// import { login } from '../../../server/src/controllers/authController';
const API_BASE_URL = process.env.NEXT_API_BASE_URL || 'http://localhost:8000/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    },
    withCredentials: true, // Enable sending cookies with requests 
});


export const authService = {
    signup: async (userData) => {
        try {
            const response = await api.post('auth/signup', userData);
            return response;
        } catch (error) {
            console.error('Error during sign up:', error);
            throw error;
        }
    },

    login : async (userData) => {
        try {
            const response = await api.post('auth/login', userData);
            return response;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },

    googleLogin: async () => {
        try {
            const response = await api.get('auth/google');
            return response;
        } catch (error) {
            console.error('Error during Google login:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await api.post('auth/logout');
            return response;
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    },

}