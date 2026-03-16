'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Grid, 
  List,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { menuService, Category, Product } from '@/services/menu.service';
import Modal from '@/components/ui/Modal';

import CategoryForm from '@/components/menu/CategoryForm';
import ProductForm from '@/components/menu/ProductForm';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const queryClient = useQueryClient();

  // Queries
  const { data: categories, isLoading: isCatsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: menuService.getCategories,
  });

  const { data: products, isLoading: isProdsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: menuService.getProducts,
  });

  // Mutations
  const deleteCategoryMutation = useMutation({
    mutationFn: menuService.deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: menuService.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="menu-page">
      <div className="page-header">
        <div>
          <h1>Menü Yönetimi</h1>
          <p>Yemek kategorilerinizi ve ürünlerinizi buradan yönetin.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
          <Plus size={20} />
          Yeni {activeTab === 'categories' ? 'Kategori' : 'Ürün'} Ekle
        </button>
      </div>

      <div className="menu-tabs">
        <button 
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Grid size={18} />
          Kategoriler
        </button>
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <List size={18} />
          Ürünler
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder={`${activeTab === 'categories' ? 'Kategori' : 'Ürün'} ara...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="content-section">
        {activeTab === 'categories' ? (
          <div className="categories-grid">
            {isCatsLoading ? (
              <div className="loading-box"><Loader2 className="animate-spin" /></div>
            ) : (
              categories?.filter((c: any) => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((cat: Category) => (
                <div key={cat.id} className="menu-item-card card">
                  <div className="item-info">
                    <h3>{cat.name}</h3>
                    <span className="item-status">{cat.isActive ? 'Aktif' : 'Pasif'}</span>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => handleEdit(cat)} className="icon-btn"><Edit2 size={16} /></button>
                    <button onClick={() => { if(confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) deleteCategoryMutation.mutate(cat.id) }} className="icon-btn delete"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="products-list">
            {isProdsLoading ? (
               <div className="loading-box"><Loader2 className="animate-spin" /></div>
            ) : (
              <table className="data-table card">
                <thead>
                  <tr>
                    <th>Görsel</th>
                    <th>Ürün Adı</th>
                    <th>Kategori</th>
                    <th>Fiyat</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((prod: Product) => (
                    <tr key={prod.id}>
                      <td>
                        <div className="prod-img">
                          {prod.imageUrl ? <img src={prod.imageUrl} alt="" /> : <UtensilsIcon />}
                        </div>
                      </td>
                      <td>
                        <div className="prod-name-box">
                          <strong>{prod.name}</strong>
                          <p>{prod.description}</p>
                        </div>
                      </td>
                      <td>{categories?.find((c: any) => c.id === prod.categoryId)?.name || '-'}</td>
                      <td>
                        <div className="price-box">
                          {prod.discountPrice ? (
                            <>
                              <span className="old-price">₺{prod.price}</span>
                              <span className="new-price">₺{prod.discountPrice}</span>
                            </>
                          ) : (
                            <span>₺{prod.price}</span>
                          )}
                        </div>
                      </td>
                      <td><span className={`badge ${prod.isActive ? 'badge-success' : 'badge-error'}`}>{prod.isActive ? 'Aktif' : 'Pasif'}</span></td>
                      <td>
                        <div className="item-actions">
                          <button onClick={() => handleEdit(prod)} className="icon-btn"><Edit2 size={16} /></button>
                          <button onClick={() => { if(confirm('Bu ürünü silmek istediğinize emin misiniz?')) deleteProductMutation.mutate(prod.id) }} className="icon-btn delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        title={editingItem ? 'Düzenle' : 'Yeni Ekle'}
      >
        {activeTab === 'categories' ? (
          <CategoryForm initialData={editingItem} onSuccess={handleModalClose} />
        ) : (
          <ProductForm categories={categories || []} initialData={editingItem} onSuccess={handleModalClose} />
        )}
      </Modal>

      <style jsx>{`
        .menu-page { display: flex; flex-direction: column; gap: 2rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; }
        .page-header h1 { font-size: 1.875rem; font-weight: 700; color: var(--secondary); }
        .page-header p { color: var(--text-muted); }
        
        .menu-tabs { display: flex; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
        .tab-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; border-radius: var(--radius-md); font-weight: 500; color: var(--text-muted); transition: all 0.2s; }
        .tab-btn:hover { background: var(--primary-light); color: var(--primary); }
        .tab-btn.active { background: var(--primary); color: white; }

        .filter-bar { display: flex; gap: 1rem; }
        .search-box { position: relative; width: 300px; }
        .search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-light); }
        .search-box input { padding-left: 2.5rem; background: var(--bg-surface); }

        .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .menu-item-card { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; }
        .item-info h3 { font-size: 1.125rem; font-weight: 600; }
        .item-status { font-size: 0.875rem; color: var(--text-muted); }

        .item-actions { display: flex; gap: 0.5rem; }
        .icon-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); border: 1px solid var(--border-color); color: var(--text-muted); transition: all 0.2s; }
        .icon-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
        .icon-btn.delete:hover { border-color: var(--error); color: var(--error); background: #fef2f2; }

        .data-table { width: 100%; border-collapse: collapse; overflow: hidden; }
        .data-table th { text-align: left; padding: 1rem; font-size: 0.75rem; text-transform: uppercase; color: var(--text-light); border-bottom: 1px solid var(--border-color); }
        .data-table td { padding: 1rem; border-bottom: 1px solid var(--border-color); vertical-align: middle; }

        .prod-img { width: 48px; height: 48px; border-radius: var(--radius-md); background: var(--bg-main); overflow: hidden; display: flex; align-items: center; justify-content: center; color: var(--text-light); }
        .prod-img img { width: 100%; height: 100%; object-fit: cover; }
        .prod-name-box strong { display: block; font-size: 0.9375rem; color: var(--text-main); }
        .prod-name-box p { font-size: 0.75rem; color: var(--text-muted); }

        .price-box { display: flex; flex-direction: column; }
        .old-price { font-size: 0.75rem; text-decoration: line-through; color: var(--text-light); }
        .new-price { font-size: 0.9375rem; font-weight: 700; color: var(--primary); }

        .badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
        .badge-success { background: #dcfce7; color: #166534; }
        .badge-error { background: #fef2f2; color: #991b1b; }

        .loading-box { display: flex; justify-content: center; padding: 3rem; width: 100%; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function UtensilsIcon() {
  return <div style={{ opacity: 0.3 }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg></div>;
}
