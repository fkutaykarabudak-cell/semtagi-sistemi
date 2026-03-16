'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Settings, 
  Store, 
  Clock, 
  MapPin, 
  Phone, 
  Globe, 
  Save,
  Power,
  Loader2
} from 'lucide-react';
import { restaurantService } from '@/services/restaurant.service';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['restaurant-profile'],
    queryFn: restaurantService.getProfile,
  });

  const [formData, setFormData] = useState<any>({
    name: '',
    phone: '',
    address: '',
    minOrderAmount: 0,
    deliveryFee: 0,
    workingHours: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        minOrderAmount: profile.minOrderAmount || 0,
        deliveryFee: profile.deliveryFee || 0,
        workingHours: profile.workingHours || '',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: restaurantService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-profile'] });
      alert('Ayarlar başarıyla güncellendi.');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: restaurantService.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-profile'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Restoran Ayarları</h1>
        <button 
          className={`btn ${profile?.isOpen ? 'btn-danger' : 'btn-success'}`}
          onClick={() => toggleMutation.mutate()}
          disabled={toggleMutation.isPending}
        >
          <Power size={20} />
          {profile?.isOpen ? 'Restoranı Kapat' : 'Restoranı Aç'}
        </button>
      </div>

      <div className="settings-grid">
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-section card">
            <div className="section-header">
              <Store size={20} />
              <h2>Genel Bilgiler</h2>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Restoran Adı</label>
                <div className="input-with-icon">
                  <Store size={18} />
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Telefon</label>
                <div className="input-with-icon">
                  <Phone size={18} />
                  <input 
                    type="text" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Adres</label>
                <div className="input-with-icon">
                  <MapPin size={18} />
                  <textarea 
                    value={formData.address} 
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                    rows={3}
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section card">
            <div className="section-header">
              <Clock size={20} />
              <h2>Teslimat & Çalışma Saatleri</h2>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Min. Sipariş Tutarı (₺)</label>
                <input 
                  type="number" 
                  value={formData.minOrderAmount} 
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Teslimat Ücreti (₺)</label>
                <input 
                  type="number" 
                  value={formData.deliveryFee} 
                  onChange={(e) => setFormData({ ...formData, deliveryFee: Number(e.target.value) })} 
                  required 
                />
              </div>

              <div className="form-group full-width">
                <label>Çalışma Saatleri (Örn: 09:00 - 22:00)</label>
                <div className="input-with-icon">
                  <Clock size={18} />
                  <input 
                    type="text" 
                    value={formData.workingHours} 
                    onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })} 
                    placeholder="Her gün 09:00 - 22:00"
                    required 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Ayarları Kaydet</>}
            </button>
          </div>
        </form>

        <div className="settings-sidebar">
          <div className="status-card card">
            <h3>Mevcut Durum</h3>
            <div className={`status-badge ${profile?.isOpen ? 'online' : 'offline'}`}>
              {profile?.isOpen ? 'Restoranınız Sipariş Alıyor' : 'Restoranınız Kapalı'}
            </div>
            <p className="status-note">
              {profile?.isOpen 
                ? 'Sipariş almak istemediğinizde restoranı kapatmayı unutmayın.' 
                : 'Müşterilerinizin sipariş verebilmesi için restoranı açmalısınız.'}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-page { display: flex; flex-direction: column; gap: 2rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; }
        .page-header h1 { font-size: 1.875rem; font-weight: 700; color: var(--secondary); }

        .settings-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start; }
        .settings-form { display: flex; flex-direction: column; gap: 2rem; }
        
        .settings-section { padding: 1.5rem; }
        .section-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; color: var(--secondary); }
        .section-header h2 { font-size: 1.125rem; font-weight: 600; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .full-width { grid-column: span 2; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.875rem; font-weight: 600; color: var(--text-muted); }

        .input-with-icon { position: relative; }
        .input-with-icon svg { position: absolute; left: 0.75rem; top: 0.875rem; color: var(--text-light); }
        .input-with-icon input, .input-with-icon textarea { padding-left: 2.5rem; }

        .form-actions { display: flex; justify-content: flex-end; }
        .form-actions button { min-width: 200px; height: 3rem; font-size: 1rem; }

        .status-card { text-align: center; display: flex; flex-direction: column; gap: 1.25rem; align-items: center; padding: 2rem; }
        .status-badge { padding: 0.75rem 1.5rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.9375rem; }
        .status-badge.online { background: var(--primary-light); color: var(--primary); border: 1px solid var(--primary); }
        .status-badge.offline { background: #fee2e2; color: var(--error); border: 1px solid #fca5a5; }
        .status-note { font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; }

        .btn-success { background: var(--primary); color: white; }
        .btn-danger { background: var(--error); color: white; }
        .btn-danger:hover { filter: brightness(0.9); }
        
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .settings-grid { grid-template-columns: 1fr; }
          .settings-sidebar { order: -1; }
        }
      `}</style>
    </div>
  );
}
