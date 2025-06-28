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

// const setAuthHeader = (token) => {
//     if (token) {
//         api.defaults.headers.Authorization = `Bearer ${token}`;
//     } else {
//         delete api.defaults.headers.Authorization;
//     }
// };

export const userLinksService = {
   getAllLinks : async () => {
        try {
            const response = await api.get(`link/get-all`);
            return response.data;
        } catch (error) {
            console.error('Error fetching links:', error);
            return error;
        }
   },

   createLink : async (linkData) => {
    try {
        const response = await api.post(`link/create`, linkData);
        return response.data;
    } catch (error) {
        console.error('Error creating link:', error);
        return error;
    }
   } ,

    updateLink : async (linkId, linkData) => {
          try {
                const response = await api.put(`link/update/${linkId}`, linkData);
                return response.data;
          } catch (error) {
                console.error('Error updatingbut  link:', error);
                return error;
          }
    },

    deleteLink : async (linkId) => {
        try {
            const response = await api.delete(`link/delete/${linkId}`);
            return response;
        } catch (error) {
            console.error('Error deleting link:', error);
            return error;
        }
    },
}
