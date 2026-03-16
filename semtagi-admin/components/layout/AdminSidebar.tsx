'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Store, 
  Clock, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useAdminAuthStore } from '@/store/adminAuthStore';

const menuItems = [
  { name: 'Genel Bakış', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Restoran Onayları', path: '/restaurants/pending', icon: ShieldCheck },
  { name: 'Restoranlar', path: '/restaurants', icon: Store },
  { name: 'Kullanıcılar', path: '/users', icon: Users },
  { name: 'Siparişler', path: '/orders', icon: ShoppingBag },
  { name: 'Sistem Ayarları', path: '/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAdminAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">SA</div>
        <div className="brand-text">
          <h1>SemtAğı</h1>
          <span>Yönetim Paneli</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
              {isActive && <ChevronRight size={16} className="active-indicator" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Çıkış Yap</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--admin-primary);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
        }

        .sidebar-brand {
          padding: 2rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .brand-logo {
          width: 40px;
          height: 40px;
          background: var(--admin-accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.25rem;
        }

        .brand-text h1 {
          font-size: 1.125rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .brand-text span {
          font-size: 0.75rem;
          color: var(--text-light);
          opacity: 0.7;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          color: var(--text-light);
          transition: all 0.2s;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.03);
          color: white;
        }

        .nav-item.active {
          background: var(--admin-accent);
          color: white;
          font-weight: 600;
        }

        .active-indicator {
          margin-left: auto;
        }

        .sidebar-footer {
          padding: 1.5rem 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          color: #ef4444;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </aside>
  );
}
