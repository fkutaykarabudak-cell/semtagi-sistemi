'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { 
  Store, 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink,
  Ban,
  CheckCircle,
  MapPin
} from 'lucide-react';

export default function RestaurantListPage() {
  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['all-restaurants'],
    queryFn: adminService.getAllRestaurants,
  });

  if (isLoading) return <div className="loading">Restoranlar yükleniyor...</div>;

  return (
    <div className="res-list-page">
      <div className="page-header">
        <div className="header-info">
          <h1>Restoranlar</h1>
          <p>Sistemdeki tüm kayıtlı restoranları yönetin ve izleyin.</p>
        </div>
        <button className="btn btn-primary"><Store size={18} /> Yeni Restoran Ekle</button>
      </div>

      <div className="table-controls card">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="İsim, bölge veya kategori ile ara..." />
        </div>
        <div className="filter-group">
          <button className="btn btn-outline"><Filter size={18} /> Filtrele</button>
        </div>
      </div>

      <div className="table-wrapper card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Restoran</th>
              <th>Bölge / Adres</th>
              <th>Kayıt Tarihi</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {restaurants?.map((res: any) => (
              <tr key={res.id}>
                <td>
                  <div className="res-cell">
                    <div className="res-avatar">🏪</div>
                    <div className="res-name-info">
                      <strong>{res.name}</strong>
                      <span>{res.categoryNames?.join(', ') || 'Genel'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="address-cell">
                    <MapPin size={14} />
                    <span>{res.address}</span>
                  </div>
                </td>
                <td>{new Date(res.createdAt).toLocaleDateString('tr-TR')}</td>
                <td>
                  <span className={`status-pill ${res.isApproved ? 'active' : 'inactive'}`}>
                    {res.isApproved ? <CheckCircle size={14} /> : <Ban size={14} />}
                    {res.isApproved ? 'Aktif' : 'Onay Bekliyor'}
                  </span>
                </td>
                <td>
                  <button className="icon-action"><MoreVertical size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .res-list-page { display: flex; flex-direction: column; gap: 2rem; }
        
        .page-header { display: flex; justify-content: space-between; align-items: center; }
        .header-info h1 { font-size: 1.5rem; color: var(--admin-primary); margin-bottom: 0.25rem; }
        .header-info p { color: var(--text-muted); font-size: 0.875rem; }

        .table-controls { display: flex; justify-content: space-between; padding: 1rem 1.5rem; background: white; }
        .search-box { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; background: #f8fafc; border: 1px solid var(--admin-border); border-radius: 10px; width: 320px; color: var(--text-light); }
        .search-box input { border: none; background: none; outline: none; font-size: 0.875rem; flex: 1; color: var(--text-main); }

        .table-wrapper { overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 1.25rem 1.5rem; background: #f8fafc; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.5px; border-bottom: 1px solid var(--admin-border); }
        .admin-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; vertical-align: middle; }
        
        .res-cell { display: flex; align-items: center; gap: 1rem; }
        .res-avatar { width: 40px; height: 40px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
        .res-name-info { display: flex; flex-direction: column; }
        .res-name-info strong { color: var(--admin-primary); font-weight: 700; }
        .res-name-info span { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

        .address-cell { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.8125rem; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .status-pill { display: flex; align-items: center; gap: 6px; width: fit-content; padding: 4px 12px; border-radius: 99px; font-weight: 700; font-size: 0.75rem; }
        .status-pill.active { background: #d1fae5; color: #065f46; }
        .status-pill.inactive { background: #fee2e2; color: #991b1b; }

        .icon-action { color: var(--text-light); transition: color 0.2s; }
        .icon-action:hover { color: var(--admin-primary); }
      `}</style>
    </div>
  );
}
