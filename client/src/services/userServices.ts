import api from './axiosInstance';

export const getUserProfile = async (userId: string) => {
  try {
    const res = await api.get(`/users/profile/${userId}`);
    return res.data;
  } catch (err: unknown) {
    console.error("Error fetching user profile:", err)
    throw err
  }
}

export const searchUsers = async (query: string) => {
  try {
    const res = await api.get('/users/search', {
      params: { q: query }
    });
    return res.data;
  } catch (err: unknown) {
    console.error("Error searching users:", err)
    throw err
  }
}
