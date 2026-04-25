import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import TopBar from '../../../app/components/layout/TopBar';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  User: () => <span data-testid="user-icon" />,
  LogOut: () => <span data-testid="logout-icon" />,
  Menu: () => <span data-testid="menu-icon" />,
}));

describe('TopBar Component', () => {
  const defaultUser = {
    nama: 'John Doe',
    role: 'Admin',
    jabatan: 'Administrator',
    email: 'john@example.com',
  };

  const defaultProps = {
    user: defaultUser,
    onLogout: jest.fn(),
    onToggleSidebar: jest.fn(),
  };

  const renderTopBar = (props = {}, route = '/') => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <TopBar {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  describe('Page Title', () => {
    it('should display "Agenda Pimpinan" when path contains /agenda-pimpinan', () => {
      renderTopBar({}, '/sespri/agenda-pimpinan');
      expect(screen.getByText('Agenda Pimpinan')).toBeInTheDocument();
    });

    it('should display "User Management" when path contains /users', () => {
      renderTopBar({}, '/admin/users');
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    it('should display "Admin" when path is a generic admin dashboard', () => {
      renderTopBar({}, '/admin/dashboard');
      // 'Admin' appears as title and role. Check title specifically.
      expect(screen.getByRole('heading', { name: 'Admin' })).toBeInTheDocument();
    });

    it('should fallback to "Dashboard" for unknown paths', () => {
      renderTopBar({}, '/unknown');
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it.each([
      ['/surat-permohonan', 'Surat Permohonan'],
      ['/admin/periode', 'Periode Management'],
      ['/admin/pimpinan', 'Pimpinan Management'],
      ['/sespri/verifikasi-permohonan', 'Verifikasi Permohonan'],
      ['/sespri/konfirmasi-pengganti', 'Konfirmasi Pengganti'],
      ['/sespri/laporan-kegiatan-jadwal', 'Laporan Kegiatan per Jadwal'],
      ['/sespri/laporan-kegiatan-detail/1', 'Detail Laporan Kegiatan'],
      ['/ajudan/konfirmasi-agenda', 'Konfirmasi Agenda'],
      ['/kasubag-media/assign-staff', 'Assign Staf'],
      ['/kasubag-media/review-draft', 'Review Draft Berita'],
      ['/staff-media/tugas-saya', 'Tugas Saya'],
      ['/submit-report', 'Submit Laporan'],
      ['/pemohon/riwayat-permohonan', 'Riwayat Permohonan'],
      ['/pemohon/submit-request', 'Ajukan Permohonan'],
      ['/staff-media/upload-draft-berita', 'Upload Draft Berita'],
      ['/admin/profile', 'Profil Saya'],
      ['/sespri/dashboard', 'Sespri'],
      ['/kasubag-protokol/dashboard', 'Kasubag Protokol'],
      ['/kasubag-media/dashboard', 'Kasubag Media'],
      ['/ajudan/dashboard', 'Ajudan'],
      ['/staf-protokol/dashboard', 'Staf Protokol'],
      ['/staf-media/dashboard', 'Staf Media'],
      ['/pemohon/dashboard', 'Pemohon'],
    ])('should map %s to page title %s', (route, title) => {
      renderTopBar({}, route);
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    });
  });

  describe('User Info', () => {
    it('should display user name and role', () => {
      renderTopBar();
      // Name and role appear multiple times (main bar and dropdown).
      // We check that they exist at least once.
      expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
      expect(screen.getByText(/Selamat datang, John Doe/i)).toBeInTheDocument();
    });

    it('should display profile image if photo_profil is provided', () => {
      renderTopBar({ user: { ...defaultUser, foto_profil: 'test.jpg' } });
      const img = screen.getByAltText('Foto Profil');
      expect(img).toHaveAttribute('src', 'test.jpg');
    });

    it('should display default user icon when photo is not provided', () => {
      renderTopBar();
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });
  });

  describe('Profile Dropdown', () => {
    it('should toggle dropdown when profile button is clicked', () => {
      renderTopBar();
      const profileBtn = screen.getByText('John Doe').closest('button')!;
      
      // Initially not visible
      expect(screen.queryByText('Profil Saya')).not.toBeInTheDocument();
      
      // Open
      fireEvent.click(profileBtn);
      expect(screen.getByText('Profil Saya')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      
      // Close
      fireEvent.click(profileBtn);
      expect(screen.queryByText('Profil Saya')).not.toBeInTheDocument();
    });

    it('should close dropdown when clicking outside', () => {
      renderTopBar();
      const profileBtn = screen.getByText('John Doe').closest('button')!;
      
      // Open
      fireEvent.click(profileBtn);
      expect(screen.getByText('Profil Saya')).toBeInTheDocument();
      
      // Click outside
      act(() => {
        fireEvent.mouseDown(document.body);
      });
      
      expect(screen.queryByText('Profil Saya')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onToggleSidebar when menu burger is clicked', () => {
      const onToggleMock = jest.fn();
      renderTopBar({ onToggleSidebar: onToggleMock });
      
      const menuBtn = screen.getByTestId('menu-icon').closest('button')!;
      fireEvent.click(menuBtn);
      
      expect(onToggleMock).toHaveBeenCalledTimes(1);
    });

    it('should call onLogout when logout button is clicked', () => {
      const onLogoutMock = jest.fn();
      renderTopBar({ onLogout: onLogoutMock });
      
      // Open dropdown first
      const profileBtn = screen.getByText('John Doe').closest('button')!;
      fireEvent.click(profileBtn);
      
      const logoutBtn = screen.getByText('Logout');
      fireEvent.click(logoutBtn);
      
      expect(onLogoutMock).toHaveBeenCalledTimes(1);
    });

    it('should navigate to correct profile path based on role', () => {
      renderTopBar({ user: { ...defaultUser, role: 'Sespri' } });
      
      // Open dropdown
      const profileBtn = screen.queryAllByText('John Doe')[0].closest('button')!;
      fireEvent.click(profileBtn);
      
      const profileLink = screen.getByText('Profil Saya').closest('button')!;
      fireEvent.click(profileLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/sespri/profile');
    });

    it('should fallback to admin profile path for unknown role', () => {
      renderTopBar({ user: { ...defaultUser, role: 'Unknown' } });

      const profileBtn = screen.queryAllByText('John Doe')[0].closest('button')!;
      fireEvent.click(profileBtn);
      fireEvent.click(screen.getByText('Profil Saya').closest('button')!);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/profile');
    });
  });
});
