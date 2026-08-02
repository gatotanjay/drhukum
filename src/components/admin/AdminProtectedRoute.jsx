import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { adminApi } from '@/lib/adminApi';
import { Loader2 } from 'lucide-react';

/**
 * Bungkus halaman admin dengan komponen ini supaya otomatis redirect
 * ke /admin/login kalau session belum/sudah tidak valid.
 */
const AdminProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('checking'); // checking | authed | guest

  useEffect(() => {
    let cancelled = false;
    adminApi
      .checkSession()
      .then((res) => {
        if (cancelled) return;
        setStatus(res.authenticated ? 'authed' : 'guest');
      })
      .catch(() => {
        if (!cancelled) setStatus('guest');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (status === 'guest') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
