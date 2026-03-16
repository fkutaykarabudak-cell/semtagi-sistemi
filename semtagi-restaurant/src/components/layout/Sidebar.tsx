'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ShoppingBag, label: 'Siparişler', href: '/orders' },
  { icon: UtensilsCrossed, label: 'Menü Yönetimi', href: '/menu' },
  { icon: Settings, label: 'Ayarlar', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box">S</div>
        <span className="logo-text">SemtAğı Panel</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={20} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={16} className="active-indicator" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => logout()} className="nav-item logout-btn">
          <LogOut size={20} />
          <span>Çıkış Yap</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background-color: var(--bg-sidebar);
          color: var(--text-on-sidebar);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-box {
          width: 36px;
          height: 36px;
          background-color: var(--primary);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          color: white;
        }

        .logo-text {
          font-size: 1.125rem;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-radius: var(--radius-md);
          color: rgba(236, 253, 245, 0.7);
          transition: all var(--transition-fast);
          text-decoration: none;
          font-size: 0.9375rem;
        }

        .nav-item:hover {
          background-color: rgba(16, 185, 129, 0.1);
          color: white;
        }

        .nav-item.active {
          background-color: var(--primary);
          color: white;
          font-weight: 500;
        }

        .active-indicator {
          margin-left: auto;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          width: 100%;
          color: #fca5a5;
        }

        .logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </aside>
  );
}
