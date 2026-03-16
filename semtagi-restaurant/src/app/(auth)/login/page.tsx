'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Link bileşenini içe aktarıyoruz
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('admin@restoran.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.accessToken, data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4" style={{backgroundImage: "url('/restaurant-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center"}}>
       <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 z-10">
        <div className="text-center mb-8">
          <span className="text-3xl font-semibold text-gray-800">SemtAğı Panel</span>
          <p className="text-gray-500 mt-2">Restoran yönetim paneline giriş yapın</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-center mb-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 transition-colors duration-300"
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Hesabınız yok mu?{' '}
              {/* "Başvuru Yap" yazısını tıklanabilir bir Link haline getiriyoruz */}
              <Link href="/register" className="font-bold text-green-600 hover:text-green-800 transition-colors duration-300">
                Başvuru Yap
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
