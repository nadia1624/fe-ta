import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AjudanAssignmentPage from '../../../../app/routes/admin/AjudanAssignmentPage';
import { userApi, pimpinanApi, ajudanAssignmentApi, periodeApi } from '../../../../app/lib/api';
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
  Trash2: () => <span data-testid="icon-trash" />,
  Search: () => <span data-testid="icon-search" />,
  X: () => <span data-testid="icon-x" />,
  UserCheck: () => <span data-testid="icon-usercheck" />,
  ChevronLeft: () => <span data-testid="icon-left" />,
  ChevronRight: () => <span data-testid="icon-right" />,
  Filter: () => <span data-testid="icon-filter" />,
  RefreshCw: ({ className }: { className: string }) => <span data-testid="icon-refresh" className={className} />,
  AlertCircle: () => <span data-testid="icon-alert" />,
}));

describe('AjudanAssignmentPage', () => {
  const mockAssignments = [
    {
      id_user_ajudan: 10,
      id_jabatan: 1,
      id_periode: 1,
      status_aktif: 'aktif',
      ajudan: { nama: 'Ajudan 1', nip: '123' },
      periodeJabatan: {
        pimpinan: { nama_pimpinan: 'Walikota A' },
        jabatan: { nama_jabatan: 'Walikota' },
        periode: { nama_periode: '2020-2025' },
      },
    },
  ];

  const mockAjudans = [
    { id_user: 10, nama: 'Ajudan 1', role: { id_role: '2', nama_role: 'Ajudan' } },
  ];

  const mockPimpinans = [
    { id_jabatan: 1, id_periode: 1, status_aktif: 'aktif', pimpinan: { nama_pimpinan: 'Walikota A' }, jabatan: { nama_jabatan: 'Walikota' }, periode: { nama_periode: '2020-2025' } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (ajudanAssignmentApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockAssignments });
    (userApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockAjudans });
    (pimpinanApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockPimpinans });
    (periodeApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: [] });
  });

  it('renders assignments correctly', async () => {
    render(<AjudanAssignmentPage />);
    await waitFor(() => {
      expect(screen.getByText('Ajudan 1')).toBeInTheDocument();
    });
  });

  it('submits new assignment successfully', async () => {
    const user = userEvent.setup();
    (ajudanAssignmentApi.create as jest.Mock).mockResolvedValue({ success: true });
    
    render(<AjudanAssignmentPage />);

    await waitFor(() => expect(screen.getByText('Ajudan 1')).toBeInTheDocument());

    const addButton = screen.getByRole('button', { name: /tambah penugasan/i });
    await user.click(addButton);
    
    await waitFor(() => expect(screen.getByRole('heading', { name: /tambah penugasan ajudan/i })).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/pilih ajudan/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/pilih pimpinan & periode/i), { target: { value: '1|1' } });

    const submitBtn = screen.getByRole('button', { name: /simpan penugasan/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(ajudanAssignmentApi.create).toHaveBeenCalled();
    });
  });
});
