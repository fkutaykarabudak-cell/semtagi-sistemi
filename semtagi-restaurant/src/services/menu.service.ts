import api from '@/utils/api';

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl?: string;
  isActive: boolean;
}

export const menuService = {
  // Categories
  getCategories: async () => {
    const response = await api.get('/menu/categories');
    return response.data;
  },
  createCategory: async (data: { name: string; sortOrder: number }) => {
    const response = await api.post('/menu/categories', data);
    return response.data;
  },
  updateCategory: async (id: string, data: Partial<Category>) => {
    const response = await api.put(`/menu/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/menu/categories/${id}`);
    return response.data;
  },

  // Products
  getProducts: async () => {
    const response = await api.get('/menu/products');
    return response.data;
  },
  createProduct: async (data: any) => {
    const response = await api.post('/menu/products', data);
    return response.data;
  },
  updateProduct: async (id: string, data: any) => {
    const response = await api.put(`/menu/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/menu/products/${id}`);
    return response.data;
  },
};
