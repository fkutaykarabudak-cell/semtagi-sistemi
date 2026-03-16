import api from '@/utils/api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getPendingRestaurants: async () => {
    const response = await api.get('/admin/restaurants/pending');
    return response.data;
  },
  getAllRestaurants: async () => {
    const response = await api.get('/admin/restaurants');
    return response.data;
  },
  approveRestaurant: async (id: string) => {
    const response = await api.put(`/admin/restaurants/${id}/approve`);
    return response.data;
  },
  rejectRestaurant: async (id: string) => {
    const response = await api.put(`/admin/restaurants/${id}/reject`);
    return response.data;
  },
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },
};
