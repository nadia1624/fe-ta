import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { useLocation, useNavigate } from 'react-router';

interface TopBarProps {
  user: {
    nama: string;
    role: string;
    jabatan: string;
    email: string;
  };
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export default function TopBar({ user, onLogout, onToggleSidebar }: TopBarProps) {
  const [notificationCount] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin')) return 'Admin Dashboard';
    if (path.includes('/sespri')) return 'Sespri Dashboard';
    if (path.includes('/kasubag-protokol')) return 'Kasubag Protokol Dashboard';
    if (path.includes('/kasubag-media')) return 'Kasubag Media Dashboard';
    if (path.includes('/ajudan')) return 'Ajudan Dashboard';
    if (path.includes('/staf-protokol')) return 'Staf Protokol Dashboard';
    if (path.includes('/staf-media')) return 'Staf Media Dashboard';
    if (path.includes('/pemohon')) return 'Pemohon Dashboard';
    if (path.includes('/agenda-pimpinan')) return 'Agenda Pimpinan';
    if (path.includes('/agenda')) return 'Agenda Management';
    if (path.includes('/surat-permohonan')) return 'Surat Permohonan';
    if (path.includes('/penugasan')) return 'Penugasan Staf';
    if (path.includes('/draft-berita')) return 'Draft Berita';
    if (path.includes('/laporan')) return 'Laporan & Dokumentasi';
    if (path.includes('/users')) return 'User Management';
    if (path.includes('/periode')) return 'Periode Management';
    if (path.includes('/pimpinan')) return 'Pimpinan Management';
    if (path.includes('/verifikasi-permohonan')) return 'Verifikasi Permohonan';
    if (path.includes('/konfirmasi-pengganti')) return 'Konfirmasi Pengganti';
    if (path.includes('/laporan-kegiatan-jadwal')) return 'Laporan Kegiatan per Jadwal';
    if (path.includes('/laporan-kegiatan-detail')) return 'Detail Laporan Kegiatan';
    if (path.includes('/konfirmasi-agenda')) return 'Konfirmasi Agenda';
    if (path.includes('/assign-staff')) return 'Assign Staf';
    if (path.includes('/review-draft')) return 'Review Draft Berita';
    if (path.includes('/my-assignments')) return 'Tugas Saya';
    if (path.includes('/submit-report')) return 'Submit Laporan';
    if (path.includes('/riwayat-permohonan-pemohon')) return 'Riwayat Permohonan';
    if (path.includes('/submit-request')) return 'Ajukan Permohonan';
    if (path.includes('/upload-draft-berita')) return 'Upload Draft Berita';
    if (path.includes('/profile')) return 'Profil Saya';
    return 'Dashboard';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {getPageTitle()}
            </h2>
            <p className="text-sm text-gray-600 mt-0.5 hidden sm:block">
              Selamat datang, {user.nama}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 sm:gap-3 sm:pl-4 sm:border-l sm:border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              {/* User info — hidden on small screens */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.nama}</p>
                <p className="text-xs text-gray-600">{user.role}</p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user.nama}</p>
                  <p className="text-xs text-gray-600 mt-1">{user.jabatan}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/dashboard/profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profil Saya
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}