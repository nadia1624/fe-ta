import { Outlet, useNavigate, useLocation } from 'react-router';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import { useEffect, useState } from 'react';

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
    // Get user from localStorage (in real app, use proper auth)
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    if (!userRole || !userEmail) {
      // If not logged in, redirect to login
      navigate('/login');
      return;
    }

    // Mock user data based on role
    const userMap: Record<string, any> = {
      'Admin': { nama: 'Budi Santoso', jabatan: 'Administrator Sistem' },
      'Sespri': { nama: 'Siti Rahma', jabatan: 'Sekretaris Pribadi' },
      'Kasubag Protokol': { nama: 'Ahmad Hidayat', jabatan: 'Kepala Subbagian Protokol' },
      'Kasubag Media': { nama: 'Dewi Lestari', jabatan: 'Kepala Subbagian Media' },
      'Ajudan': { nama: 'Eko Prasetyo', jabatan: 'Ajudan Pimpinan' },
      'Staf Protokol': { nama: 'Bambang Wijaya', jabatan: 'Staf Pelaksana Protokol' },
      'Staf Media': { nama: 'Siti Nurhaliza', jabatan: 'Staf Dokumentasi' },
      'Pemohon': { nama: 'Rina Kusuma', jabatan: 'Kepala Dinas Pendidikan' },
    };

    const userData = userMap[userRole];
    if (userData) {
      setCurrentUser({
        nama: userData.nama,
        role: userRole,
        jabatan: userData.jabatan,
        email: userEmail
      });
    }

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
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
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