'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService, Product, Category } from '@/services/menu.service';
import { Loader2, Upload } from 'lucide-react';

interface ProductFormProps {
  categories: Category[];
  initialData?: Product | null;
  onSuccess: () => void;
}

export default function ProductForm({ categories, initialData, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    discountPrice: initialData?.discountPrice || '',
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ''),
    isActive: initialData?.isActive ?? true,
    imageUrl: initialData?.imageUrl || '',
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any) => initialData 
      ? menuService.updateProduct(initialData.id, data) 
      : menuService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
    };
    mutation.mutate(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="menu-form">
      <div className="form-group">
        <label>Ürün Adı</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          placeholder="Örn: Adana Kebap" 
          required 
        />
      </div>

      <div className="form-group">
        <label>Kategori</label>
        <select 
          value={formData.categoryId} 
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} 
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Açıklama</label>
        <textarea 
          value={formData.description} 
          onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
          rows={3}
          placeholder="Ürün içeriği, gramaj vb."
        />
      </div>

      <div className="form-row">
        <div className="form-group flex-1">
          <label>Fiyat (₺)</label>
          <input 
            type="number" 
            value={formData.price} 
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} 
            required 
          />
        </div>
        <div className="form-group flex-1">
          <label>İndirimli Fiyat (₺)</label>
          <input 
            type="number" 
            value={formData.discountPrice} 
            onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} 
            placeholder="Opsiyonel"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Ürün Görseli (URL - Prototip)</label>
        <input 
          type="text" 
          value={formData.imageUrl} 
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
          placeholder="Görsel linki"
        />
      </div>

      <div className="form-group checkbox-group">
        <input 
          type="checkbox" 
          id="prod-active" 
          checked={formData.isActive} 
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} 
        />
        <label htmlFor="prod-active">Satışa Açık mı?</label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : (initialData ? 'Güncelle' : 'Kaydet')}
        </button>
      </div>

      <style jsx>{`
        .menu-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-row { display: flex; gap: 1rem; }
        .flex-1 { flex: 1; }
        .form-group label { font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.025em; }
        .checkbox-group { flex-direction: row; align-items: center; gap: 0.75rem; }
        .checkbox-group input { width: auto; }
        .form-actions { margin-top: 1rem; }
        .btn-primary { width: 100%; height: 2.75rem; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
}
