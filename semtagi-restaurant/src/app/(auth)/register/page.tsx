 'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // User fields
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    // Restaurant fields
    restaurantName: '',
    restaurantAddress: '',
    restaurantPhone: '',
    restaurantEmail: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Backend'e gönderilecek veriyi hazırla
      const payload = {
        user: {
          name: formData.ownerName,
          email: formData.ownerEmail,
          password: formData.ownerPassword,
        },
        restaurant: {
          name: formData.restaurantName,
          address: formData.restaurantAddress,
          phone: formData.restaurantPhone,
          email: formData.restaurantEmail,
        },
      };

      await api.post('/restaurants/register', payload);

      setSuccess(true);
      // Başarılı kayıt sonrası kullanıcıyı login sayfasına yönlendir
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt oluşturulamadı. Lütfen bilgileri kontrol edin ve tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Restoran Başvurusu</h1>
          <p className="text-gray-500 mt-2">İşletmenizi SemtAğı'na kaydedin</p>
        </div>

        {success ? (
          <div className="text-center p-6 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <h2 className="text-2xl font-semibold">Başvurunuz Alındı!</h2>
            <p className="mt-2">Başvurunuz incelendikten sonra size e-posta ile bilgi verilecektir.</p>
            <p className="mt-4">3 saniye içinde giriş sayfasına yönlendirileceksiniz...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bölüm 1: Restoran Sahibi Bilgileri */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">1. Restoran Sahibi Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <input type="text" name="ownerName" onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">E-posta (Giriş için)</label>
                  <input type="email" name="ownerEmail" onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Şifre (Giriş için)</label>
                  <input type="password" name="ownerPassword" onChange={handleChange} required minLength={6} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
            </div>

            {/* Bölüm 2: Restoran Bilgileri */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">2. Restoran Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Restoran Adı</label>
                  <input type="text" name="restaurantName" onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700">Restoran E-postası (İletişim)</label>
                  <input type="email" name="restaurantEmail" onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700">Restoran Telefonu</label>
                  <input type="tel" name="restaurantPhone" onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                 <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Restoran Adresi</fabel>
                  <input type="text" name="restaurantAddress" onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="flex justify-end pt-4">
                <Link href="/login" className="px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none">
                    İptal
                </Link>
              <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                {loading ? 'Başvuru Gönderiliyor...' : 'Başvuruyu Tamamla'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
