'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  MapPin, 
  Phone, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function PendingRestaurantsPage() {
  const queryClient = useQueryClient();

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['pending-restaurants'],
    queryFn: adminService.getPendingRestaurants,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveRestaurant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => adminService.rejectRestaurant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-restaurants'] });
    },
  });

  if (isLoading) return <div className="loading">Başvurular yükleniyor...</div>;

  return (
    <div className="pending-page">
      <div className="page-header">
        <div className="header-info">
          <h1>Restoran Onayları</h1>
          <p>Sisteme yeni başvuru yapan restoranları buradan inceleyip onaylayabilirsiniz.</p>
        </div>
        <div className="pending-count">
          <strong>{restaurants?.length || 0}</strong>
          <span>Bekleyen Başvuru</span>
        </div>
      </div>

      <div className="pending-list">
        {!restaurants || restaurants.length === 0 ? (
          <div className="empty-state card">
            <CheckCircle2 size={48} color="var(--success)" />
            <h3>Harika! Bekleyen Başvuru Yok</h3>
            <p>Tüm restoran başvuruları sonuçlandırılmış durumda.</p>
          </div>
        ) : (
          restaurants.map((res: any) => (
            <div key={res.id} className="res-approval-card card">
              <div className="res-main">
                <div className="res-logo">🏪</div>
                <div className="res-info">
                  <h3>{res.name}</h3>
                  <div className="res-meta">
                    <span className="meta-item"><MapPin size={14} /> {res.address}</span>
                    <span className="meta-item"><Phone size={14} /> {res.phone}</span>
                    <span className="meta-item"><Calendar size={14} /> {new Date(res.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              <div className="res-actions">
                <button className="btn btn-outline"><Eye size={18} /> Detaylar</button>
                <div className="action-divider"></div>
                <button 
                  className="btn btn-approve"
                  onClick={() => approveMutation.mutate(res.id)}
                  disabled={approveMutation.isPending}
                >
                  <CheckCircle2 size={18} /> Onayla
                </button>
                <button 
                  className="btn btn-reject"
                  onClick={() => rejectMutation.mutate(res.id)}
                  disabled={rejectMutation.isPending}
                >
                  <XCircle size={18} /> Reddet
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .pending-page { display: flex; flex-direction: column; gap: 2rem; }
        
        .page-header { display: flex; justify-content: space-between; align-items: center; }
        .header-info h1 { font-size: 1.5rem; color: var(--admin-primary); margin-bottom: 0.25rem; }
        .header-info p { color: var(--text-muted); font-size: 0.875rem; }

        .pending-count { background: var(--admin-primary); color: white; padding: 1rem 1.5rem; border-radius: 14px; text-align: center; display: flex; flex-direction: column; }
        .pending-count strong { font-size: 1.5rem; }
        .pending-count span { font-size: 0.75rem; opacity: 0.8; }

        .pending-list { display: flex; flex-direction: column; gap: 1rem; }
        
        .res-approval-card { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; }
        
        .res-main { display: flex; align-items: center; gap: 1.25rem; }
        .res-logo { width: 56px; height: 56px; background: #f1f5f9; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; }
        .res-info h3 { font-size: 1.125rem; margin-bottom: 0.5rem; color: var(--admin-primary); }
        .res-meta { display: flex; gap: 1.25rem; }
        .meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.8125rem; color: var(--text-muted); }

        .res-actions { display: flex; align-items: center; gap: 0.75rem; }
        .action-divider { width: 1px; height: 32px; background: var(--admin-border); margin: 0 0.5rem; }

        .btn-approve { background: #d1fae5; color: #065f46; }
        .btn-approve:hover { background: #b9f6d6; }
        .btn-reject { background: #fee2e2; color: #991b1b; }
        .btn-reject:hover { background: #fecaca; }

        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; text-align: center; gap: 1rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
