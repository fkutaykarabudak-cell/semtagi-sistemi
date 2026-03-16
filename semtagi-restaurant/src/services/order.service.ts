import api from '@/utils/api';

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  deliveryType: string;
  note?: string;
  createdAt: string;
  user: {
    name: string;
    phone: string;
  };
  address?: {
    fullAddress: string;
    title: string;
  };
  items: OrderItem[];
}

export const orderService = {
  getOrders: async () => {
    const response = await api.get('/restaurant-panel/orders');
    return response.data;
  },
  updateStatus: async (orderId: string, status: OrderStatus) => {
    const response = await api.put(`/restaurant-panel/orders/${orderId}/status`, { status });
    return response.data;
  },
};
