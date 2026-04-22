import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KasSKPDManagementPage from '../../../../app/routes/admin/KasSKPDManagementPage';
import { kaskpdApi } from '../../../../app/lib/api';

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
  Edit2: () => <span data-testid="icon-edit" />,
  Trash2: () => <span data-testid="icon-trash" />,
  X: () => <span data-testid="icon-x" />,
  AlertTriangle: () => <span data-testid="icon-alert" />,
  Building2: () => <span data-testid="icon-building" />,
  ChevronLeft: () => <span data-testid="icon-left" />,
  ChevronRight: () => <span data-testid="icon-right" />,
}));

describe('KasSKPDManagementPage', () => {
  const mockData = [
    { id_ka_skpd: 1, nama_instansi: 'Dinas Pendidikan' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (kaskpdApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockData });
  });

  it('renders SKPD list correctly', async () => {
    render(<KasSKPDManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Dinas Pendidikan')).toBeInTheDocument();
    });
  });

  it('submits new SKPD successfully', async () => {
    const user = userEvent.setup();
    (kaskpdApi.create as jest.Mock).mockResolvedValue({ success: true });
    
    render(<KasSKPDManagementPage />);

    await waitFor(() => expect(screen.getByText('Dinas Pendidikan')).toBeInTheDocument());

    const addButton = screen.getByRole('button', { name: /tambah kaskpd/i });
    await user.click(addButton);
    
    await waitFor(() => expect(screen.getByRole('heading', { name: /tambah kaskpd/i })).toBeInTheDocument());
    
    const input = screen.getByLabelText(/nama instansi/i);
    await user.type(input, 'Dinas Baru');
    
    const submitBtn = screen.getByRole('button', { name: /tambah data/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(kaskpdApi.create).toHaveBeenCalledWith({ nama_instansi: 'Dinas Baru' });
    });
  });
});
