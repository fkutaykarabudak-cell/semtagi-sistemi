'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  UserPlus,
  Shield,
  MoreVertical
} from 'lucide-react';

export default function UsersListPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getAllUsers,
  });

  if (isLoading) return <div className="loading">Kullanıcılar yükleniyor...</div>;

  return (
    <div className="users-page">
      <div className="page-header">
        <div className="header-info">
          <h1>Kullanıcı Yönetimi</h1>
          <p>Sistemdeki tüm müşterileri ve rollerini yönetin.</p>
        </div>
        <button className="btn btn-primary"><UserPlus size={18} /> Yeni Kullanıcı</button>
      </div>

      <div className="table-controls card">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="İsim veya e-posta ile ara..." />
        </div>
      </div>

      <div className="table-wrapper card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kullanıcı</th>
              <th>E-posta</th>
              <th>Rol</th>
              <th>Kayıt Tarihi</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {(users || [1, 2, 3, 4, 5]).map((user: any, idx: number) => {
              // Fallback for demo if users array is empty
              const data = user.email ? user : { 
                id: idx, 
                name: `Demo Kullanıcı ${idx + 1}`, 
                email: `user${idx+1}@example.com`, 
                role: idx === 0 ? 'ADMIN' : 'USER',
                createdAt: new Date() 
              };

              return (
                <tr key={data.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">
                        {data.role === 'ADMIN' ? <Shield size={16} /> : <Users size={16} />}
                      </div>
                      <strong>{data.name || data.email.split('@')[0]}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="mail-cell">
                      <Mail size={14} />
                      <span>{data.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${data.role}`}>
                      {data.role === 'ADMIN' ? 'Yönetici' : 'Müşteri'}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={14} />
                      {new Date(data.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
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
        .users-page { display: flex; flex-direction: column; gap: 2rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; }
        .header-info h1 { font-size: 1.5rem; color: var(--admin-primary); }
        .header-info p { color: var(--text-muted); font-size: 0.875rem; }

        .table-controls { padding: 1rem 1.5rem; }
        .search-box { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; background: #f8fafc; border: 1px solid var(--admin-border); border-radius: 10px; width: 320px; color: var(--text-light); }
        .search-box input { border: none; background: none; outline: none; font-size: 0.875rem; flex: 1; }

        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 1.25rem 1.5rem; background: #f8fafc; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--admin-border); }
        .admin-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; }

        .user-cell { display: flex; align-items: center; gap: 0.75rem; }
        .user-avatar-small { width: 32px; height: 32px; background: #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--admin-primary); }
        
        .mail-cell, .date-cell { display: flex; align-items: center; gap: 6px; color: var(--text-muted); }

        .role-badge { padding: 4px 10px; border-radius: 99px; font-weight: 700; font-size: 0.75rem; }
        .role-badge.ADMIN { background: #fee2e2; color: #991b1b; }
        .role-badge.USER { background: #f1f5f9; color: var(--text-muted); }

        .icon-action { color: var(--text-light); }
      `}</style>
    </div>
  );
}
