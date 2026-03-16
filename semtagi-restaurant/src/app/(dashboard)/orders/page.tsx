'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck,
  CookingPot,
  Bell,
  ArrowRight
} from 'lucide-react';
import { orderService, Order, OrderStatus } from '@/services/order.service';
import { useSocket } from '@/hooks/useSocket';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled'>('pending');
  const queryClient = useQueryClient();
  const socket = useSocket();

  // Queries
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
  });

  // WebSocket Integration
  useEffect(() => {
    if (!socket) return;

    socket.on('new_order', (newOrder: Order) => {
      // Sipariş listesini güncelle
      queryClient.setQueryData(['orders'], (oldOrders: Order[] | undefined) => {
        return oldOrders ? [newOrder, ...oldOrders] : [newOrder];
      });
      
      // Bildirim sesi çal
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(e => console.log('Audio error:', e));
    });

    socket.on('order_status_changed', () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    });

    return () => {
      socket.off('new_order');
      socket.off('order_status_changed');
    };
  }, [socket, queryClient]);

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => 
      orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const filteredOrders = orders?.filter((order: Order) => {
    if (activeTab === 'pending') return order.status === OrderStatus.PENDING;
    if (activeTab === 'preparing') return order.status === OrderStatus.ACCEPTED || order.status === OrderStatus.PREPARING;
    if (activeTab === 'on_the_way') return order.status === OrderStatus.ON_THE_WAY;
    if (activeTab === 'delivered') return order.status === OrderStatus.DELIVERED;
    if (activeTab === 'cancelled') return order.status === OrderStatus.CANCELLED;
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case OrderStatus.PENDING: return <span className="badge badge-primary">Yeni Sipariş</span>;
      case OrderStatus.ACCEPTED: return <span className="badge badge-info">Onaylandı</span>;
      case OrderStatus.PREPARING: return <span className="badge badge-warning">Hazırlanıyor</span>;
      case OrderStatus.ON_THE_WAY: return <span className="badge badge-info mt-2">Yolda</span>;
      case OrderStatus.DELIVERED: return <span className="badge badge-success">Teslim Edildi</span>;
      case OrderStatus.CANCELLED: return <span className="badge badge-error">İptal Edildi</span>;
    }
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Sipariş Yönetimi</h1>
        <div className="live-indicator">
          <div className="dot"></div>
          Canlı İzleniyor
        </div>
      </div>

      <div className="order-tabs">
        <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
          Bekleyenler ({orders?.filter((o:any) => o.status === 'PENDING').length || 0})
        </button>
        <button className={`tab-btn ${activeTab === 'preparing' ? 'active' : ''}`} onClick={() => setActiveTab('preparing')}>
          Mutfaktakiler
        </button>
        <button className={`tab-btn ${activeTab === 'on_the_way' ? 'active' : ''}`} onClick={() => setActiveTab('on_the_way')}>
          Yoldakiler
        </button>
        <button className={`tab-btn ${activeTab === 'delivered' ? 'active' : ''}`} onClick={() => setActiveTab('delivered')}>
          Tamamlananlar
        </button>
      </div>

      <div className="orders-container">
        {isLoading ? (
          <div className="loading">Yükleniyor...</div>
        ) : filteredOrders?.length === 0 ? (
          <div className="empty-state card">
            <ShoppingBag size={48} />
            <p>Bu kategoride henüz sipariş bulunmuyor.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders?.map((order: Order) => (
              <div key={order.id} className="order-card card">
                <div className="order-card-header">
                  <div className="order-meta">
                    <span className="order-no">#{order.orderNumber}</span>
                    <span className="order-time">{new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="customer-info">
                  <h3>{order.user.name}</h3>
                  <p className="customer-phone"><Phone size={14} /> {order.user.phone}</p>
                  {order.address && (
                    <p className="customer-address"><MapPin size={14} /> {order.address.fullAddress}</p>
                  )}
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="item-row">
                      <span className="item-qty">{item.quantity}x</span>
                      <span className="item-name">{item.productName}</span>
                      <span className="item-price">₺{item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Toplam:</span>
                    <strong>₺{order.totalAmount.toFixed(2)}</strong>
                  </div>
                  
                  <div className="order-actions">
                    {order.status === OrderStatus.PENDING && (
                      <>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => updateStatusMutation.mutate({ id: order.id, status: OrderStatus.ACCEPTED })}
                        >
                          Onayla
                        </button>
                        <button 
                          className="btn btn-outline"
                          onClick={() => updateStatusMutation.mutate({ id: order.id, status: OrderStatus.CANCELLED })}
                        >
                          Reddet
                        </button>
                      </>
                    )}
                    {order.status === OrderStatus.ACCEPTED && (
                      <button 
                        className="btn btn-warning"
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: OrderStatus.PREPARING })}
                      >
                        Hazırlamaya Başla
                      </button>
                    )}
                    {order.status === OrderStatus.PREPARING && (
                      <button 
                        className="btn btn-info"
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: OrderStatus.ON_THE_WAY })}
                      >
                        Yola Çıkar
                      </button>
                    )}
                    {order.status === OrderStatus.ON_THE_WAY && (
                      <button 
                        className="btn btn-success"
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: OrderStatus.DELIVERED })}
                      >
                        Teslim Edildi
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .orders-page { display: flex; flex-direction: column; gap: 2rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; }
        .page-header h1 { font-size: 1.875rem; font-weight: 700; color: var(--secondary); }
        
        .live-indicator { display: flex; align-items: center; gap: 0.5rem; background: var(--primary-light); color: var(--primary); padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 600; }
        .live-indicator .dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.4); } 100% { opacity: 1; transform: scale(1); } }

        .order-tabs { display: flex; gap: 0.5rem; background: white; padding: 0.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); }
        .tab-btn { flex: 1; padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 600; color: var(--text-muted); transition: all 0.2s; }
        .tab-btn:hover { background: var(--bg-main); color: var(--text-main); }
        .tab-btn.active { background: var(--primary); color: white; }

        .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
        .order-card { display: flex; flex-direction: column; gap: 1.5rem; padding: 1.5rem; border-top: 4px solid var(--primary); transition: transform 0.2s; position: relative; }
        .order-card:hover { transform: translateY(-4px); }
        
        .order-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .order-meta { display: flex; flex-direction: column; }
        .order-no { font-weight: 700; font-size: 1.125rem; color: var(--secondary); }
        .order-time { font-size: 0.875rem; color: var(--text-muted); }

        .customer-info h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .customer-info p { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.25rem; }

        .order-items { background: var(--bg-main); padding: 1rem; border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 0.5rem; }
        .item-row { display: flex; gap: 0.5rem; font-size: 0.875rem; }
        .item-qty { font-weight: 700; color: var(--primary); }
        .item-name { flex: 1; }
        .item-price { color: var(--text-muted); }

        .order-footer { display: flex; flex-direction: column; gap: 1.25rem; border-top: 1px dashed var(--border-color); padding-top: 1.25rem; }
        .order-total { display: flex; justify-content: space-between; align-items: center; }
        .order-total span { color: var(--text-muted); }
        .order-total strong { font-size: 1.25rem; color: var(--secondary); }

        .order-actions { display: flex; gap: 0.5rem; }
        .order-actions button { flex: 1; }

        .badge { padding: 0.25rem 0.625rem; border-radius: 100px; font-size: 0.75rem; font-weight: 700; }
        .badge-primary { background: #dbeafe; color: #1e40af; }
        .badge-success { background: #dcfce7; color: #166534; }
        .badge-warning { background: #fef9c3; color: #854d0e; }
        .badge-info { background: #e0f2fe; color: #0369a1; }
        .badge-error { background: #fef2f2; color: #991b1b; }

        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; color: var(--text-light); text-align: center; gap: 1rem; }
        
        .btn-warning { background: var(--warning); color: white; }
        .btn-warning:hover { filter: brightness(0.9); }
        .btn-info { background: #0ea5e9; color: white; }
        .btn-info:hover { filter: brightness(0.9); }
      `}</style>
    </div>
  );
}
