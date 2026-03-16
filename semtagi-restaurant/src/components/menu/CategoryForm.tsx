'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService, Category } from '@/services/menu.service';
import { Loader2 } from 'lucide-react';

interface CategoryFormProps {
  initialData?: Category | null;
  onSuccess: () => void;
}

export default function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any) => initialData 
      ? menuService.updateCategory(initialData.id, data) 
      : menuService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, sortOrder, isActive });
  };

  return (
    <form onSubmit={handleSubmit} className="menu-form">
      <div className="form-group">
        <label>Kategori Adı</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Örn: Kebaplar, Tatlılar" 
          required 
        />
      </div>

      <div className="form-group">
        <label>Sıralama</label>
        <input 
          type="number" 
          value={sortOrder} 
          onChange={(e) => setSortOrder(parseInt(e.target.value))} 
          required 
        />
      </div>

      <div className="form-group checkbox-group">
        <input 
          type="checkbox" 
          id="cat-active" 
          checked={isActive} 
          onChange={(e) => setIsActive(e.target.checked)} 
        />
        <label htmlFor="cat-active">Aktif mi?</label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : (initialData ? 'Güncelle' : 'Kaydet')}
        </button>
      </div>

      <style jsx>{`
        .menu-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.875rem; font-weight: 500; color: var(--text-main); }
        .checkbox-group { flex-direction: row; align-items: center; gap: 0.75rem; }
        .checkbox-group input { width: auto; }
        .form-actions { margin-top: 1rem; }
        .btn-primary { width: 100%; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
}
