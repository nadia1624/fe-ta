import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import UserManagementPage from '../../../../app/routes/admin/UserManagementPage';
import { userApi, pimpinanApi, periodeApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';

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

// Mock Toast
jest.mock('../../../../app/lib/swal', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    confirm: jest.fn(),
  },
}));

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  Plus: () => <span data-testid="icon-plus" />,
  Edit: () => <span data-testid="icon-edit" />,
  Trash2: () => <span data-testid="icon-trash" />,
  Search: () => <span data-testid="icon-search" />,
  X: () => <span data-testid="icon-x" />,
  AlertTriangle: () => <span data-testid="icon-alert" />,
  ChevronLeft: () => <span data-testid="icon-left" />,
  ChevronRight: () => <span data-testid="icon-right" />,
}));

describe('UserManagementPage', () => {
  const mockUsers = [
    {
      id_user: 1,
      nama: 'Admin User',
      email: 'admin@test.com',
      nip: '12345',
      role: { id_role: 1, nama_role: 'Admin' },
      instansi: 'Dinas A',
      status_aktif: 'aktif',
    },
    {
      id_user: 2,
      nama: 'Staff User',
      email: 'staff@test.com',
      nip: '67890',
      role: { id_role: 2, nama_role: 'Staf Protokol' },
      instansi: 'Dinas B',
      status_aktif: 'nonaktif',
    },
  ];

  const mockRoles = [
    { id_role: 1, nama_role: 'Admin' },
    { id_role: 2, nama_role: 'Staf Protokol' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (userApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockUsers });
    (userApi.getRoles as jest.Mock).mockResolvedValue({ success: true, data: mockRoles });
    (pimpinanApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: [] });
    (periodeApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: [] });
  });

  it('renders user list correctly', async () => {
    render(<UserManagementPage />);

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Staff User')).toBeInTheDocument();
    });
  });

  it('filters users by search term', async () => {
    render(<UserManagementPage />);

    await waitFor(() => expect(screen.getByText('Admin User')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/cari nama, email/i);
    fireEvent.change(searchInput, { target: { value: 'Staff' } });

    expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
    expect(screen.getByText('Staff User')).toBeInTheDocument();
  });

  it('opens modal on "Tambah User" click', async () => {
    render(<UserManagementPage />);

    const addButton = screen.getByRole('button', { name: /tambah user/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Tambah User Baru')).toBeInTheDocument();
    });
  });
});
