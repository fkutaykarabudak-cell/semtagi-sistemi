'use client';

import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'RESTAURANT' && user?.role !== 'ADMIN') {
      router.push('/login'); // Or unauthorized page
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <style jsx>{`
          .loading-screen {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--primary-light);
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-body">
          {children}
        </main>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: 260px; /* Matching sidebar width */
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease;
        }

        .content-body {
          flex: 1;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
