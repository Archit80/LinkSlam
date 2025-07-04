import axios from 'axios';
const API_BASE_URL = process.env.NEXT_API_BASE_URL || 'http://localhost:8000/users';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
    },
    withCredentials: true, // Enable sending cookies with requests 
});


export const getUserProfile = async (userId: string) => {
  try {
    const res = await api.get(`/profile/${userId}`);
    return res.data;
  } catch (err: any) {
    console.error("Error fetching user profile:", err)
    throw err
  }
}

export const searchUsers = async (query: string) => {
  try {
    const res = await api.get('/search', {
      params: { q: query }
    });
    return res.data;
  } catch (err: any) {
    console.error("Error searching users:", err)
    throw err
  }
}
