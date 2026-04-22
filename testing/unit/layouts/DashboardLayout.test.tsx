import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import DashboardLayout from '../../../app/layouts/DashboardLayout';
import { authApi, getToken, clearAuthData } from '../../../app/lib/api';
import { setupPushNotifications, unsubscribeFromPush, isPushSupported } from '../../../app/lib/push-notifications';
import '@testing-library/jest-dom';

// Mock API and Push
jest.mock('../../../app/lib/api', () => ({
  authApi: {
    getMe: jest.fn(),
  },
  getToken: jest.fn(),
  clearAuthData: jest.fn(),
}));

jest.mock('../../../app/lib/push-notifications', () => ({
  setupPushNotifications: jest.fn(),
  unsubscribeFromPush: jest.fn(),
  isPushSupported: jest.fn(),
}));

// Mock Components
jest.mock('../../../app/components/layout/Sidebar', () => ({
  __esModule: true,
  default: ({ currentRole, isOpen, onClose }: any) => (
    <div data-testid="sidebar" data-role={currentRole} data-open={isOpen}>
      <button onClick={onClose}>Close Sidebar</button>
    </div>
  ),
}));

jest.mock('../../../app/components/layout/TopBar', () => ({
  __esModule: true,
  default: ({ user, onLogout, onToggleSidebar }: any) => (
    <div data-testid="topbar">
      <span>User: {user.nama}</span>
      <button onClick={onLogout}>Logout</button>
      <button onClick={onToggleSidebar}>Toggle Sidebar</button>
    </div>
  ),
}));

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
  Outlet: () => <div data-testid="outlet" />,
}));

describe('DashboardLayout Component', () => {
    const mockUser = {
        success: true,
        data: {
            nama: 'Jane Doe',
            email: 'jane@example.com',
            role: { nama_role: 'Sespri' },
            foto_profil: 'jane.jpg'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        (isPushSupported as jest.Mock).mockReturnValue(true);
        (getToken as jest.Mock).mockReturnValue('token-123');
        // @ts-ignore
        authApi.getMe.mockResolvedValue(mockUser);
    });

    const renderLayout = () => {
        return render(
            <MemoryRouter>
                <DashboardLayout />
            </MemoryRouter>
        );
    };

    describe('User State & Loading', () => {
        it('should initialize state from localStorage cache', async () => {
            localStorage.setItem('userName', 'Cached User');
            localStorage.setItem('userRole', 'Admin');
            
            renderLayout();
            
            expect(screen.getByText(/User: Cached User/)).toBeInTheDocument();
            expect(screen.getByTestId('sidebar')).toHaveAttribute('data-role', 'Admin');

            // Wait for async update to settle to avoid act() warning
            await waitFor(() => expect(screen.getByText(/User: Jane Doe/)).toBeInTheDocument());
        });

        it('should update state with data from authApi.getMe on success', async () => {
            renderLayout();
            
            await waitFor(() => {
                expect(screen.getByText(/User: Jane Doe/)).toBeInTheDocument();
                expect(screen.getByTestId('sidebar')).toHaveAttribute('data-role', 'Sespri');
            });
        });
    });

    describe('Sidebar Interaction', () => {
        it('should toggle sidebar state', async () => {
            renderLayout();
            const sidebar = screen.getByTestId('sidebar');
            const toggleBtn = screen.getByText('Toggle Sidebar');

            expect(sidebar).toHaveAttribute('data-open', 'false');
            
            fireEvent.click(toggleBtn);
            expect(sidebar).toHaveAttribute('data-open', 'true');
            
            fireEvent.click(toggleBtn);
            expect(sidebar).toHaveAttribute('data-open', 'false');

            // Wait for async update to settle
            await waitFor(() => expect(screen.getByText(/User: Jane Doe/)).toBeInTheDocument());
        });

        it('should close sidebar via onClose callback', async () => {
            renderLayout();
            const sidebar = screen.getByTestId('sidebar');
            const toggleBtn = screen.getByText('Toggle Sidebar');
            const closeBtn = screen.getByText('Close Sidebar');

            fireEvent.click(toggleBtn);
            expect(sidebar).toHaveAttribute('data-open', 'true');
            
            fireEvent.click(closeBtn);
            expect(sidebar).toHaveAttribute('data-open', 'false');

            // Wait for async update to settle
            await waitFor(() => expect(screen.getByText(/User: Jane Doe/)).toBeInTheDocument());
        });
    });

    describe('Logout Workflow', () => {
        it('should handle logout correctly', async () => {
            renderLayout();
            const logoutBtn = screen.getByText('Logout');
            
            // Wait for initial load before logout to be clean
            await waitFor(() => expect(screen.getByText(/User: Jane Doe/)).toBeInTheDocument());

            fireEvent.click(logoutBtn);
            
            await waitFor(() => {
                expect(unsubscribeFromPush).toHaveBeenCalled();
                expect(clearAuthData).toHaveBeenCalled();
                expect(mockNavigate).toHaveBeenCalledWith('/login');
            });
        });
    });

    describe('Notification Logic', () => {
        it('should setup push notifications if supported and token exists', async () => {
            renderLayout();
            expect(setupPushNotifications).toHaveBeenCalled();
            // Wait for async update
            await waitFor(() => expect(screen.getByText(/User: Jane Doe/)).toBeInTheDocument());
        });

        it('should not setup push notifications if not supported', async () => {
            (isPushSupported as jest.Mock).mockReturnValue(false);
            renderLayout();
            expect(setupPushNotifications).not.toHaveBeenCalled();
            // Wait for async update
            await waitFor(() => expect(screen.getByText(/User: Jane Doe/)).toBeInTheDocument());
        });
    });
});
