import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PeriodeManagementPage from '../../../../app/routes/admin/PeriodeManagementPage';
import { periodeApi } from '../../../../app/lib/api';

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
  },
}));

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  Plus: () => <span data-testid="icon-plus" />,
  Edit2: () => <span data-testid="icon-edit" />,
  ChevronLeft: () => <span data-testid="icon-left" />,
  ChevronRight: () => <span data-testid="icon-right" />,
  Trash2: () => <span data-testid="icon-trash" />,
}));

describe('PeriodeManagementPage', () => {
  const mockPeriodes = [
    {
      id_periode: 1,
      nama_periode: 'Periode 2024',
      tanggal_mulai: '2024-01-01',
      tanggal_selesai: '2024-12-31',
      keterangan: 'Tahun 2024',
      status_periode: 'aktif',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (periodeApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockPeriodes });
  });

  it('renders periode list correctly', async () => {
    render(<PeriodeManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Periode 2024')).toBeInTheDocument();
    });
  });

  it('submits new periode successfully', async () => {
    const user = userEvent.setup();
    (periodeApi.create as jest.Mock).mockResolvedValue({ success: true });
    
    render(<PeriodeManagementPage />);

    await waitFor(() => expect(screen.getByText('Periode 2024')).toBeInTheDocument());

    const addButton = screen.getByRole('button', { name: /tambah periode/i });
    await user.click(addButton);

    await waitFor(() => expect(screen.getByRole('heading', { name: /tambah periode/i })).toBeInTheDocument());

    const nameInput = screen.getByLabelText(/nama periode/i);
    await user.type(nameInput, 'Periode Baru');

    const startInput = screen.getByLabelText(/tanggal mulai/i);
    const endInput = screen.getByLabelText(/tanggal selesai/i);

    fireEvent.change(startInput, { target: { value: '2026-01-01' } });
    fireEvent.change(endInput, { target: { value: '2026-12-31' } });

    const submitBtn = screen.getByRole('button', { name: 'Tambah' });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(periodeApi.create).toHaveBeenCalled();
    });
  });

  it('shows error if tanggal_mulai > tanggal_selesai', async () => {
    const user = userEvent.setup();
    const { toast } = require('../../../../app/lib/swal');
    
    render(<PeriodeManagementPage />);
    
    const addButton = screen.getByRole('button', { name: /tambah periode/i });
    await user.click(addButton);
    
    await user.type(screen.getByLabelText(/nama periode/i), 'Invalid Dates');
    
    // Set start date later than end date
    fireEvent.change(screen.getByLabelText(/tanggal mulai/i), { target: { value: '2025-01-10' } });
    fireEvent.change(screen.getByLabelText(/tanggal selesai/i), { target: { value: '2025-01-01' } });
    
    await user.click(screen.getByRole('button', { name: 'Tambah' }));
    
    expect(toast.error).toHaveBeenCalledWith('Gagal', 'Tanggal mulai tidak boleh lebih lama dari tanggal selesai');
    expect(periodeApi.create).not.toHaveBeenCalled();
  });
});
