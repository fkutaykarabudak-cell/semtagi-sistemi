'use client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-container">
      <div className="auth-overlay"></div>
      <div className="auth-content">
        {children}
      </div>
      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background-image: url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
        }
        .auth-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(6, 78, 59, 0.9) 0%, rgba(16, 185, 129, 0.8) 100%);
          z-index: 1;
        }
        .auth-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 400px;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}
