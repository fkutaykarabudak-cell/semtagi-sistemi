'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { 
  Users, 
  Store, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ShieldAlert
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
  <div className="stat-card card">
    <div className="stat-header">
      <div className={`stat-icon-wrapper ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-trend" style={{ color: trend === 'up' ? 'var(--success)' : 'var(--error)' }}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{trendValue}</span>
      </div>
    </div>
    <div className="stat-body">
      <span className="stat-title">{title}</span>
      <h3 className="stat-value">{value}</h3>
    </div>
    <style jsx>{`
      .stat-card { padding: 1.5rem; }
      .stat-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
      .stat-icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
      .stat-icon-wrapper.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
      .stat-icon-wrapper.emerald { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      .stat-icon-wrapper.amber { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
      .stat-icon-wrapper.indigo { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
      .stat-trend { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; font-weight: 700; background: rgba(0,0,0,0.02); padding: 4px 8px; border-radius: 99px; }
      .stat-title { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }
      .stat-value { font-size: 1.75rem; font-weight: 800; color: var(--admin-primary); margin-top: 0.25rem; }
    `}</style>
  </div>
);

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getStats,
  });

  return (
    <div className="dashboard-page">
      <div className="welcome-banner">
        <div className="banner-text">
          <h2>Merhaba, Admin 👋</h2>
          <p>İşte platformun bugünkü özeti.</p>
        </div>
        <div className="banner-date">
          <Clock size={18} />
          <span>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Toplam Restoran" 
          value={stats?.totalRestaurants || '124'} 
          icon={Store} 
          trend="up" 
          trendValue="%12" 
          color="blue" 
        />
        <StatCard 
          title="Aktif Siparişler" 
          value={stats?.activeOrders || '42'} 
          icon={ShoppingBag} 
          trend="up" 
          trendValue="%5" 
          color="emerald" 
        />
        <StatCard 
          title="Onay Bekleyenler" 
          value={stats?.pendingRestaurants || '8'} 
          icon={ShieldAlert} 
          trend="down" 
          trendValue="%2" 
          color="amber" 
        />
        <StatCard 
          title="Toplam Kullanıcı" 
          value={stats?.totalUsers || '2.840'} 
          icon={Users} 
          trend="up" 
          trendValue="%18" 
          color="indigo" 
        />
      </div>

      <div className="dashboard-sections">
        <section className="recent-activity card">
          <div className="section-header">
            <h3>Son Restoran Başvuruları</h3>
            <button className="text-btn">Tümünü Gör</button>
          </div>
          <div className="activity-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="activity-item">
                <div className="activity-avatar">🏪</div>
                <div className="activity-details">
                  <strong>Restoran Adı {i}</strong>
                  <span>Yeni başvuru yaptı • 2 saat önce</span>
                </div>
                <span className="status-badge status-pending">Beklemede</span>
              </div>
            ))}
          </div>
        </section>

        <section className="growth-chart card">
          <div className="section-header">
            <h3>Haftalık Büyüme</h3>
            <div className="chart-legend">
              <span className="legend-item"><TrendingUp size={16} color="var(--admin-accent)" /> %24 Artış</span>
            </div>
          </div>
          <div className="chart-placeholder">
             {/* Chart will be implemented with a library or custom svg */}
             <div className="placeholder-msg">Büyüme grafiği yükleniyor...</div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .dashboard-page { display: flex; flex-direction: column; gap: 2rem; }
        
        .welcome-banner { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .banner-text h2 { font-size: 1.5rem; font-weight: 800; color: var(--admin-primary); }
        .banner-text p { color: var(--text-muted); font-size: 0.875rem; }
        .banner-date { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.875rem; background: white; padding: 0.5rem 1rem; border-radius: 99px; border: 1px solid var(--admin-border); }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }

        .dashboard-sections { display: grid; grid-template-columns: 1fr 1.5fr; gap: 1.5rem; }
        
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .section-header h3 { font-size: 1.125rem; font-weight: 700; color: var(--admin-primary); }
        .text-btn { color: var(--admin-accent); font-weight: 700; font-size: 0.875rem; }

        .activity-list { display: flex; flex-direction: column; gap: 1rem; }
        .activity-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-radius: 12px; transition: background 0.2s; }
        .activity-item:hover { background: #f8fafc; }
        .activity-avatar { width: 40px; height: 40px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
        .activity-details { flex: 1; display: flex; flex-direction: column; }
        .activity-details strong { font-size: 0.9375rem; color: var(--admin-primary); }
        .activity-details span { font-size: 0.75rem; color: var(--text-muted); }

        .chart-placeholder { height: 260px; display: flex; align-items: center; justify-content: center; background: #fdfdfd; border: 1px dashed var(--admin-border); border-radius: 12px; color: var(--text-light); font-size: 0.875rem; }
      `}</style>
    </div>
  );
}
