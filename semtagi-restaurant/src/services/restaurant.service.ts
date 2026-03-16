import api from '@/utils/api';

export const restaurantService = {
  getProfile: async () => {
    const response = await api.get('/restaurant-panel/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/restaurant-panel/profile', data);
    return response.data;
  },
  toggleStatus: async () => {
    const response = await api.post('/restaurant-panel/toggle-status');
    return response.data;
  },
};
