import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../../../../app/routes/dashboards/AdminDashboard';
import { dashboardApi } from '../../../../app/lib/api';

// Standardized API Mock
jest.mock('../../../../app/lib/api', () => ({
  authApi: { getMe: jest.fn(), updateProfile: jest.fn(), changePassword: jest.fn(), uploadFoto: jest.fn(), deleteFoto: jest.fn() },
  userApi: { getAll: jest.fn(), getRoles: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  pimpinanApi: { getAll: jest.fn(), getJabatan: jest.fn(), getList: jest.fn(), createOrUpdate: jest.fn(), resendSyncInvitation: jest.fn() },
  periodeApi: { getAll: jest.fn(), create: jest.fn(), update: jest.fn() },
  ajudanAssignmentApi: { getAll: jest.fn(), create: jest.fn(), delete: jest.fn(), setActive: jest.fn() },
  kaskpdApi: { getAll: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  dashboardApi: { getAdminStats: jest.fn() },
}));

// Mock Lucide icons as <span> to satisfy HTML nesting rules
jest.mock('lucide-react', () => ({
  Users: () => <span data-testid="icon-users" />,
  UserCheck: () => <span data-testid="icon-usercheck" />,
  Building2: () => <span data-testid="icon-building" />,
  Calendar: () => <span data-testid="icon-calendar" />,
  Loader2: ({ className }: { className: string }) => <span data-testid="icon-loader" className={className} />,
}));

describe('AdminDashboard Page', () => {
  const mockStats = {
    success: true,
    data: {
      stats: {
        totalUsers: 150,
        totalPimpinan: 10,
        totalKaskpd: 25,
        totalPeriode: 5,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (dashboardApi.getAdminStats as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves
    render(<AdminDashboard />);
    expect(screen.getByText(/memuat data dashboard/i)).toBeInTheDocument();
  });

  it('renders stats correctly after successful data fetch', async () => {
    (dashboardApi.getAdminStats as jest.Mock).mockResolvedValue(mockStats);
    
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders API error state and retries successfully', async () => {
    (dashboardApi.getAdminStats as jest.Mock)
      .mockResolvedValueOnce({ success: false, message: 'Data gagal dimuat' })
      .mockResolvedValueOnce(mockStats);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Terjadi Kesalahan/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Data gagal dimuat/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Coba Lagi/i));

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument();
    });
  });

  it('renders generic error message when request throws', async () => {
    (dashboardApi.getAdminStats as jest.Mock).mockRejectedValue(new Error('network'));

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Terjadi Kesalahan/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Gagal memuat data dashboard/i)).toBeInTheDocument();
  });
});
