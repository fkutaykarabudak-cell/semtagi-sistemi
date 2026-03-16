'use client';

import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  UtensilsCrossed
} from 'lucide-react';

const stats = [
  { 
    label: 'Bugünkü Siparişler', 
    value: '24', 
    change: '+12%', 
    isUp: true, 
    icon: ShoppingBag, 
    color: '#10B981' 
  },
  { 
    label: 'Bugünkü Kazanç', 
    value: '₺1.450,00', 
    change: '+8%', 
    isUp: true, 
    icon: TrendingUp, 
    color: '#3B82F6' 
  },
  { 
    label: 'Yeni Müşteriler', 
    value: '12', 
    change: '-2%', 
    isUp: false, 
    icon: Users, 
    color: '#8B5CF6' 
  },
  { 
    label: 'Hazırlananlar', 
    value: '5', 
    change: 'Normal', 
    isUp: true, 
    icon: Clock, 
    color: '#F59E0B' 
  },
];

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Hoş Geldiniz!</h1>
          <p>İşte bugünkü restoran performansınızın özeti.</p>
        </div>
        <div className="date-picker btn btn-outline">
          <Clock size={16} />
          Bugün: 13 Mart 2026
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card card">
              <div className="stat-icon-box" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <div className="stat-value-row">
                  <span className="stat-value">{stat.value}</span>
                  <span className={`stat-change ${stat.isUp ? 'up' : 'down'}`}>
                    {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="recent-orders card">
          <div className="card-header">
            <h2>Son Siparişler</h2>
            <button className="btn btn-outline btn-sm">Tümünü Gör</button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Müşteri</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                  <th>Saat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#ORD-5241</td>
                  <td>Murat Yılmaz</td>
                  <td>₺240.00</td>
                  <td><span className="badge badge-success">Teslim Edildi</span></td>
                  <td>14:20</td>
                </tr>
                <tr>
                  <td>#ORD-5242</td>
                  <td>Ayşe Kaya</td>
                  <td>₺185.50</td>
                  <td><span className="badge badge-warning">Hazırlanıyor</span></td>
                  <td>15:05</td>
                </tr>
                <tr>
                  <td>#ORD-5243</td>
                  <td>Can Aksoy</td>
                  <td>₺320.00</td>
                  <td><span className="badge badge-primary">Bekliyor</span></td>
                  <td>15:45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="restaurant-status card">
          <h2>Restoran Durumu</h2>
          <div className="status-toggle-box">
            <div className="status-indicator online"></div>
            <span>Restoranınız şu an **AÇIK**</span>
          </div>
          <button className="btn btn-outline btn-block mt-4">Kapat</button>
          
          <div className="quick-actions">
            <h3>Hızlı İşlemler</h3>
            <div className="actions-grid">
              <button className="action-item">
                <UtensilsCrossed size={18} />
                <span>Ürün Ekle</span>
              </button>
              <button className="action-item">
                <Clock size={18} />
                <span>Mesai Düzenle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-header h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--secondary);
        }

        .page-header p {
          color: var(--text-muted);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
        }

        .stat-icon-box {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .stat-value-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-top: 0.25rem;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .stat-change {
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .stat-change.up { color: var(--success); }
        .stat-change.down { color: var(--error); }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .data-table th {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-light);
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.875rem;
        }

        .badge {
          padding: 0.25rem 0.625rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-success { background: #dcfce7; color: #166534; }
        .badge-warning { background: #fef9c3; color: #854d0e; }
        .badge-primary { background: #dbeafe; color: #1e40af; }

        .status-toggle-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding: 1rem;
          background: var(--bg-main);
          border-radius: var(--radius-md);
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .status-indicator.online { background-color: var(--success); box-shadow: 0 0 0 4px var(--primary-light); }

        .quick-actions {
          margin-top: 2rem;
        }

        .quick-actions h3 {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.5rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }

        .action-item:hover {
          border-color: var(--primary);
          color: var(--primary);
          background-color: var(--primary-light);
        }

        .btn-block { width: 100%; }
        .mt-4 { margin-top: 1rem; }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
