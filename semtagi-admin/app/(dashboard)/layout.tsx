'use client';

import AdminSidebar from '@/components/layout/AdminSidebar';
import { Bell, Search, User } from 'lucide-react';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="admin-container">
      <AdminSidebar />
      
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-search">
            <Search size={18} />
            <input type="text" placeholder="Restoran, kullanıcı veya sipariş ara..." />
          </div>

          <div className="header-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="header-user">
              <div className="user-info">
                <span className="user-name">{user?.email?.split('@')[0]}</span>
                <span className="user-role">Süper Admin</span>
              </div>
              <div className="user-avatar"><User size={20} /></div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>

      <style jsx>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
        }

        .admin-main {
          flex: 1;
          margin-left: var(--sidebar-width);
          display: flex;
          flex-direction: column;
        }

        .admin-header {
          height: var(--header-height);
          background: white;
          border-bottom: 1px solid var(--admin-border);
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-search {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f1f5f9;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          width: 380px;
          color: var(--text-muted);
        }

        .header-search input {
          border: none;
          background: none;
          outline: none;
          font-size: 0.875rem;
          flex: 1;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .icon-btn {
          color: var(--text-muted);
          transition: color 0.2s;
        }

        .icon-btn:hover {
          color: var(--admin-primary);
        }

        .header-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info {
          text-align: right;
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--admin-primary);
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: #e2e8f0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--admin-primary);
        }

        .admin-content {
          padding: 2rem;
          flex: 1;
        }
      `}</style>
    </div>
  );
}
