import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  FileText,
  ClipboardList,
  Newspaper,
  FileBarChart,
  Users,
  CheckSquare,
  UserCheck,
  MessageSquare,
  Upload,
  Eye,
  PlusCircle,
  Send,
  User,
  X
} from 'lucide-react';

interface SidebarProps {
  currentRole: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentRole, isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  // Menu items for each role
  const menuConfig: Record<string, any[]> = {
    'Admin': [
      { path: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/users', label: 'User Management', icon: Users },
      { path: '/dashboard/periode', label: 'Periode Management', icon: Calendar },
      { path: '/dashboard/pimpinan', label: 'Pimpinan Management', icon: UserCheck },
    ],
    'Sespri': [
      { path: '/dashboard/sespri', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/verifikasi-permohonan', label: 'Verifikasi Permohonan', icon: CheckSquare },
      { path: '/dashboard/agenda-pimpinan', label: 'Mengelola Agenda Pimpinan', icon: CalendarCheck },
      { path: '/dashboard/konfirmasi-pengganti', label: 'Konfirmasi Pengganti', icon: UserCheck },
      { path: '/dashboard/laporan-kegiatan-jadwal', label: 'Laporan Kegiatan', icon: ClipboardList },
    ],
    'Kasubag Protokol': [
      { path: '/dashboard/kasubag-protokol', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/assign-staff', label: 'Tugaskan Staf', icon: UserCheck },
      { path: '/dashboard/monitor-penugasan-protokol', label: 'Monitor Penugasan', icon: ClipboardList },
      { path: '/dashboard/agenda-pimpinan-kasubag', label: 'Agenda Pimpinan', icon: Calendar },
    ],
    'Kasubag Media': [
      { path: '/dashboard/kasubag-media', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/assign-staff-media', label: 'Tugaskan Staf Media', icon: UserCheck },
      { path: '/dashboard/draft-berita', label: 'Draft Berita', icon: Newspaper },
      { path: '/dashboard/review-draft', label: 'Review Draft Berita', icon: MessageSquare },
      { path: '/dashboard/agenda-pimpinan-kasubag-media', label: 'Agenda Pimpinan', icon: Calendar },
      { path: '/dashboard/laporan-kegiatan-media', label: 'Laporan Kegiatan', icon: FileBarChart },
    ],
    'Ajudan': [
      { path: '/dashboard/ajudan', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/konfirmasi-agenda', label: 'Konfirmasi Agenda', icon: CheckSquare },
      { path: '/dashboard/agenda-pimpinan-ajudan', label: 'Agenda Pimpinan', icon: CalendarCheck },
    ],
    'Staf Protokol': [
      { path: '/dashboard/staf-protokol', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/agenda-pimpinan-staf-protokol', label: 'Agenda Pimpinan', icon: Calendar },
      { path: '/dashboard/tugas-saya', label: 'Tugas Saya', icon: ClipboardList },
      { path: '/dashboard/laporan-kegiatan-staf-protokol', label: 'Laporan Kegiatan', icon: FileBarChart },
    ],
    'Staf Media': [
      { path: '/dashboard/staf-media', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/agenda-pimpinan-staf-media', label: 'Agenda Pimpinan', icon: Calendar },
      { path: '/dashboard/tugas-saya-media', label: 'Tugas Saya', icon: ClipboardList },
      { path: '/dashboard/draft-berita-media', label: 'Draft Berita', icon: Newspaper },
      { path: '/dashboard/laporan-kegiatan-staf-media', label: 'Laporan Kegiatan', icon: FileBarChart },
    ],
    'Pemohon': [
      { path: '/dashboard/pemohon', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/submit-request', label: 'Ajukan Permohonan', icon: PlusCircle },
      { path: '/dashboard/riwayat-permohonan-pemohon', label: 'Riwayat Permohonan', icon: FileText },
    ],
  };

  const menuItems = menuConfig[currentRole] || [];

  return (
    <>
      {/* Backdrop overlay — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">SIMAP</h1>
              <p className="text-xs text-gray-600 mt-1">Sistem Informasi Manajemen</p>
              <p className="text-xs text-gray-600">Agenda Pimpinan</p>
            </div>
            {/* Close button — mobile only */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {currentRole && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-medium text-blue-700">{currentRole}</p>
            </div>
          )}
        </div>

        <nav className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile Menu at Bottom */}
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <Link
            to="/dashboard/profile"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${location.pathname === '/dashboard/profile'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="text-sm">Profil Saya</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Bagian Protokol dan Komunikasi Pimpinan
          </p>
        </div>
      </aside>
    </>
  );
}