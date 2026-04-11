import { Outlet, useNavigate, useLocation } from 'react-router';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { useEffect, useState } from 'react';
import { authApi, getToken, clearAuthData } from '../lib/api';
import { setupPushNotifications, unsubscribeFromPush, isPushSupported } from '../lib/push-notifications';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    nama: '',
    role: '',
    jabatan: '',
    email: '',
    foto_profil: ''
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');

    // Gunakan cached data dari localStorage untuk tampilan awal (UX cepat)
    setCurrentUser({
      nama: localStorage.getItem('userName') || '',
      role: userRole || '',
      jabatan: '',
      email: localStorage.getItem('userEmail') || '',
      foto_profil: ''
    });

    // Fetch data terbaru dari backend
    authApi.getMe().then((response) => {
      if (response.success && response.data) {
        const user = response.data;
        setCurrentUser({
          nama: user.nama,
          role: user.role?.nama_role || userRole || '',
          jabatan: '',
          email: user.email,
          foto_profil: user.foto_profil || ''
        });
      }
    }).catch(() => {
      // Loader handles auth, we just fail silently here or assume token is still valid
      // if it was invalid, loader would have redirected already.
    });

    // Initialize Push Notifications once on mount
    if (isPushSupported() && getToken()) {
      setupPushNotifications();
    }
  }, [location.pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    // Clean up push notification subscription before clearing auth data
    await unsubscribeFromPush();
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