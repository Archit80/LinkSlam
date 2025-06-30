import axios from 'axios';
const API_BASE_URL = process.env.NEXT_API_BASE_URL || 'http://localhost:8000/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    },
    withCredentials: true, // Allow cookies to be sent with requests
});


export const publicLinksService = {

    getPublicFeedLinks: async () => {
        try {
            const response = await api.get(`/public-feed`);
            return response.data;
        } catch (error) {
            console.error('Error fetching public links:', error);
            return error;
        }
    },

};