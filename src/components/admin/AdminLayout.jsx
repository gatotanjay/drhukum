import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Scale, LayoutDashboard, FileText, Building2, Megaphone, GraduationCap, LogOut, Menu, X, User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/adminApi';

// Item navigasi yang sudah aktif/bisa diklik
const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/posts', label: 'Artikel & Blog', icon: FileText },
];

// Fitur yang direncanakan untuk franchise, belum dibangun — ditampilkan sebagai preview
const UPCOMING_ITEMS = [
  { label: 'Manajemen Kantor', icon: Building2 },
  { label: 'Update Client', icon: Megaphone },
  { label: 'Tutorial', icon: GraduationCap },
];

// Judul halaman ditentukan dari path aktif, ditampilkan di header atas
const getPageTitle = (pathname) => {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname === '/admin/posts') return 'Artikel & Blog';
  if (pathname === '/admin/posts/new') return 'Tambah Artikel Baru';
  if (/^\/admin\/posts\/[^/]+\/edit$/.test(pathname)) return 'Edit Artikel';
  return 'Admin Panel';
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024
  );

  useEffect(() => {
    adminApi.checkSession()
      .then((res) => {
        if (res.authenticated) setAdminName(res.admin.username);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } finally {
      navigate('/admin/login');
    }
  };

  return (
    <div className="admin-theme min-h-screen bg-gray-50 flex">
      {/* Overlay saat sidebar terbuka di layar kecil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar kiri */}
      <aside
        className={`w-64 shrink-0 bg-admin-navy border-r border-admin-navyLight flex flex-col fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-white/10">
          <img src="/logo.png" alt="DR.HUKUM" className="h-8 w-auto object-contain brightness-0 invert" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-admin-gold/15 text-admin-gold border-l-2 border-admin-gold -ml-0.5 pl-[11px]'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}

          <p className="px-3 pt-5 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Segera Hadir
          </p>
          {UPCOMING_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 cursor-not-allowed"
              title="Fitur ini sedang dikembangkan"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5 px-3">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Area konten utama */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-8 py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="text-gray-500 hover:text-admin-navy hover:bg-gray-100 rounded-lg p-2 -ml-2 shrink-0"
                aria-label="Buka/tutup menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 truncate">{getPageTitle(location.pathname)}</h1>
            </div>

            {adminName && (
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="w-8 h-8 rounded-full bg-admin-gold/15 text-admin-goldDark flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">{adminName}</span>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
