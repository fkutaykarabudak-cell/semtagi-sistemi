'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Store,
  User
} from 'lucide-react';

const statusMap: Record<string, { label: string; class: string; icon: any }> = {
  PENDING: { label: 'Bekliyor', class: 'pending', icon: Clock },
  ACCEPTED: { label: 'Onaylandı', class: 'approved', icon: CheckCircle2 },
  ON_THE_WAY: { label: 'Yolda', class: 'info', icon: Truck },
  DELIVERED: { label: 'Teslim Edildi', class: 'approved', icon: CheckCircle2 },
  CANCELLED: { label: 'İptal', class: 'rejected', icon: XCircle },
};

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: adminService.getAllOrders,
  });

  if (isLoading) return <div className="loading">Sipariş verileri yükleniyor...</div>;

  return (
    <div className="orders-page">
      <div className="page-header">
        <div className="header-info">
          <h1>Tüm Siparişler</h1>
          <p>Sistem genelindeki tüm sipariş akışını buradan izleyebilirsiniz.</p>
        </div>
      </div>

      <div className="table-wrapper card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sipariş ID</th>
              <th>Restoran</th>
              <th>Müşteri</th>
              <th>Tutar</th>
              <th>Durum</th>
              <th>Tarih</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {(orders || [1, 2, 3, 4, 5]).map((order: any, idx: number) => {
              const data = order.id ? order : {
                id: `ORD-${1000 + idx}`,
                restaurant: { name: 'Örnek Restoran' },
                user: { email: 'user@example.com' },
                totalAmount: 145.50 + idx * 10,
                status: idx === 0 ? 'PENDING' : idx === 1 ? 'ON_THE_WAY' : 'DELIVERED',
                createdAt: new Date()
              };

              const status = statusMap[data.status] || statusMap.PENDING;
              const StatusIcon = status.icon;

              return (
                <tr key={data.id}>
                  <td><strong>#{data.id.slice(-6).toUpperCase()}</strong></td>
                  <td>
                    <div className="cell-with-icon">
                      <Store size={14} />
                      {data.restaurant.name}
                    </div>
                  </td>
                  <td>
                    <div className="cell-with-icon">
                      <User size={14} />
                      {data.user.email.split('@')[0]}
                    </div>
                  </td>
                  <td><strong>₺{data.totalAmount.toFixed(2)}</strong></td>
                  <td>
                    <span className={`status-pill status-${status.class}`}>
                      <StatusIcon size={14} />
                      {status.label}
                    </span>
                  </td>
                  <td>{new Date(data.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    <button className="icon-action"><MoreVertical size={20} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .orders-page { display: flex; flex-direction: column; gap: 2rem; }
        .page-header h1 { font-size: 1.5rem; color: var(--admin-primary); }
        .page-header p { color: var(--text-muted); font-size: 0.875rem; }

        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 1.25rem 1.5rem; background: #f8fafc; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--admin-border); }
        .admin-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; }

        .cell-with-icon { display: flex; align-items: center; gap: 8px; color: var(--text-main); font-weight: 500; }
        
        .status-pill { display: flex; align-items: center; gap: 6px; width: fit-content; padding: 4px 12px; border-radius: 99px; font-weight: 700; font-size: 0.75rem; }
        .status-pill.status-pending { background: #fef3c7; color: #92400e; }
        .status-pill.status-approved { background: #d1fae5; color: #065f46; }
        .status-pill.status-rejected { background: #fee2e2; color: #991b1b; }
        .status-pill.status-info { background: #dbeafe; color: #1e40af; }

        .icon-action { color: var(--text-light); }
      `}</style>
    </div>
  );
}
