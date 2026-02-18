import { Outlet, useNavigate, useLocation } from 'react-router';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { useEffect, useState } from 'react';
import { authApi, getToken, clearAuthData } from '../lib/api';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    nama: '',
    role: '',
    jabatan: '',
    email: ''
  });

  useEffect(() => {
    const token = getToken();
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
      // If not logged in, redirect to login
      clearAuthData();
      navigate('/login');
      return;
    }

    // Gunakan cached data dari localStorage untuk tampilan awal (UX cepat)
    setCurrentUser({
      nama: localStorage.getItem('userName') || '',
      role: userRole,
      jabatan: '',
      email: localStorage.getItem('userEmail') || ''
    });

    // Fetch data terbaru dari backend
    authApi.getMe().then((response) => {
      if (response.success && response.data) {
        const user = response.data;
        setCurrentUser({
          nama: user.nama,
          role: user.role?.nama_role || userRole,
          jabatan: '',
          email: user.email
        });
      }
    }).catch(() => {
      // Jika token invalid/expired, redirect ke login
      clearAuthData();
      navigate('/login');
    });

    // Redirect to appropriate dashboard if on /dashboard root
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      const roleMap: Record<string, string> = {
        'Admin': '/dashboard/admin',
        'Sespri': '/dashboard/sespri',
        'Kasubag Protokol': '/dashboard/kasubag-protokol',
        'Kasubag Media': '/dashboard/kasubag-media',
        'Ajudan': '/dashboard/ajudan',
        'Staf Protokol': '/dashboard/staf-protokol',
        'Staf Media': '/dashboard/staf-media',
        'Pemohon': '/dashboard/pemohon',
      };
      navigate(roleMap[userRole] || '/dashboard/admin', { replace: true });
    }
  }, [navigate, location.pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        currentRole={currentUser.role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64 transition-[margin] duration-300">
        <TopBar
          user={currentUser}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}