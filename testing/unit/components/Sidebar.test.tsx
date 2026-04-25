import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Sidebar from '../../../app/components/layout/Sidebar';
import '@testing-library/jest-dom';

// Mock getActorSlug
jest.mock('../../../app/lib/api', () => ({
  getActorSlug: jest.fn((role) => role.toLowerCase().replace(/ /g, '-')),
}));

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  LayoutDashboard: () => <span data-testid="dashboard-icon" />,
  Calendar: () => <span data-testid="calendar-icon" />,
  CalendarCheck: () => <span data-testid="calendar-check-icon" />,
  FileText: () => <span data-testid="file-text-icon" />,
  ClipboardList: () => <span data-testid="clipboard-icon" />,
  Newspaper: () => <span data-testid="newspaper-icon" />,
  FileBarChart: () => <span data-testid="file-chart-icon" />,
  Users: () => <span data-testid="users-icon" />,
  CheckSquare: () => <span data-testid="check-square-icon" />,
  UserCheck: () => <span data-testid="user-check-icon" />,
  MessageSquare: () => <span data-testid="message-icon" />,
  Building2: () => <span data-testid="building-icon" />,
  PlusCircle: () => <span data-testid="plus-icon" />,
  User: () => <span data-testid="user-icon" />,
  X: () => <span data-testid="close-icon" />,
}));

describe('Sidebar Component', () => {
  const defaultProps = {
    currentRole: 'Admin',
    isOpen: true,
    onClose: jest.fn(),
  };

  const renderSidebar = (props = {}, route = '/') => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Sidebar {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  describe('Render Testing', () => {
    it('should render brand and role label', () => {
      renderSidebar({ currentRole: 'Sespri' });
      expect(screen.getByText('SIMAP')).toBeInTheDocument();
      expect(screen.getByText('Sespri')).toBeInTheDocument();
    });
  });

  describe('Role-based Menus', () => {
    it('should display Admin menu items when role is Admin', () => {
      renderSidebar({ currentRole: 'Admin' });
      expect(screen.getByText('User Management')).toBeInTheDocument();
      expect(screen.getByText('Penugasan Ajudan')).toBeInTheDocument();
    });

    it('should display Sespri menu items when role is Sespri', () => {
      renderSidebar({ currentRole: 'Sespri' });
      expect(screen.getByText('Verifikasi Permohonan')).toBeInTheDocument();
      expect(screen.getByText('Mengelola Agenda Pimpinan')).toBeInTheDocument();
    });

    it('should display Pemohon menu items when role is Pemohon', () => {
      renderSidebar({ currentRole: 'Pemohon' });
      expect(screen.getByText('Ajukan Permohonan')).toBeInTheDocument();
      expect(screen.getByText('Riwayat Permohonan')).toBeInTheDocument();
    });

    it('should not render role-specific menu items for unknown role', () => {
      renderSidebar({ currentRole: 'Unknown Role' });
      expect(screen.queryByText('User Management')).not.toBeInTheDocument();
      expect(screen.getByText('Profil Saya')).toBeInTheDocument();
    });
  });

  describe('Responsive States (isOpen)', () => {
    it('should have translate-x-0 class when isOpen is true', () => {
      renderSidebar({ isOpen: true });
      const sidebar = screen.getByRole('complementary');
      expect(sidebar).toHaveClass('translate-x-0');
    });

    it('should have -translate-x-full class when isOpen is false', () => {
      renderSidebar({ isOpen: false });
      const sidebar = screen.getByRole('complementary');
      expect(sidebar).toHaveClass('-translate-x-full');
    });

    it('should show backdrop only when isOpen is true', () => {
      const { rerender } = renderSidebar({ isOpen: true });
      // Backdrop is the first div with bg-black/50
      expect(document.querySelector('.bg-black\\/50')).toBeInTheDocument();

      rerender(
        <MemoryRouter initialEntries={['/']}>
          <Sidebar {...defaultProps} isOpen={false} />
        </MemoryRouter>
      );
      expect(document.querySelector('.bg-black\\/50')).not.toBeInTheDocument();
    });
  });

  describe('Active Navigation', () => {
    it('should highlight the active menu item based on current path', () => {
      renderSidebar({ currentRole: 'Admin' }, '/admin/users');
      const activeLink = screen.getByText('User Management').closest('a');
      expect(activeLink).toHaveClass('bg-blue-50', 'text-blue-700');
      
      const inactiveLink = screen.getByText('Dashboard').closest('a');
      expect(inactiveLink).toHaveClass('text-gray-700');
      expect(inactiveLink).not.toHaveClass('bg-blue-50');
    });

    it('should highlight profile link when current route is profile page', () => {
      renderSidebar({ currentRole: 'Admin' }, '/admin/profile');
      const profileLink = screen.getByText('Profil Saya').closest('a');
      expect(profileLink).toHaveClass('bg-blue-50', 'text-blue-700');
    });
  });

  describe('Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      const onCloseMock = jest.fn();
      renderSidebar({ isOpen: true, onClose: onCloseMock });
      
      const closeBtn = screen.getByTestId('close-icon').closest('button')!;
      fireEvent.click(closeBtn);
      
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      const onCloseMock = jest.fn();
      renderSidebar({ isOpen: true, onClose: onCloseMock });
      
      const backdrop = document.querySelector('.bg-black\\/50')!;
      fireEvent.click(backdrop);
      
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when a menu link is clicked', () => {
      const onCloseMock = jest.fn();
      renderSidebar({ currentRole: 'Admin', onClose: onCloseMock });
      
      const dashboardLink = screen.getByText('Dashboard');
      fireEvent.click(dashboardLink);
      
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when profile link is clicked', () => {
      const onCloseMock = jest.fn();
      renderSidebar({ currentRole: 'Admin', onClose: onCloseMock });

      fireEvent.click(screen.getByText('Profil Saya'));

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should hide the role label when currentRole is empty', () => {
    renderSidebar({ currentRole: '' });
    expect(screen.queryByText(/^Admin$|^Sespri$|^Pemohon$/)).not.toBeInTheDocument();
  });
});
