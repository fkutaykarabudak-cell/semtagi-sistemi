'use client';

import { Bell, User, Search, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="header">
      <div className="header-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Sipariş veya ürün ara..." />
      </div>

      <div className="header-actions">
        <button className="action-btn notification-btn">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.name || 'Restoran Sahibi'}</span>
            <span className="user-role">Mağaza Yöneticisi</span>
          </div>
          <div className="user-avatar">
            <User size={20} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          height: 70px;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .header-search {
          position: relative;
          width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        .header-search input {
          padding-left: 2.5rem;
          background-color: var(--bg-main);
          border: none;
          font-size: 0.875rem;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .action-btn {
          position: relative;
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }

        .action-btn:hover {
          color: var(--primary);
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background-color: var(--error);
          border-radius: 50%;
          border: 2px solid var(--bg-surface);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          transition: background-color var(--transition-fast);
        }

        .user-profile:hover {
          background-color: var(--bg-main);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background-color: var(--primary-light);
          color: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </header>
  );
}
