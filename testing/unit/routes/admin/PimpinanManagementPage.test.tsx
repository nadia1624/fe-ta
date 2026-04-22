import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PimpinanManagementPage from '../../../../app/routes/admin/PimpinanManagementPage';
import { pimpinanApi, periodeApi } from '../../../../app/lib/api';

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
  Search: () => <span data-testid="icon-search" />,
  UserPlus: () => <span data-testid="icon-userplus" />,
  Users: () => <span data-testid="icon-users" />,
  Mail: () => <span data-testid="icon-mail" />,
  Calendar: () => <span data-testid="icon-calendar" />,
  RefreshCw: ({ className }: { className: string }) => <span data-testid="icon-refresh" className={className} />,
  ChevronLeft: () => <span data-testid="icon-left" />,
  ChevronRight: () => <span data-testid="icon-right" />,
}));

describe('PimpinanManagementPage', () => {
  const mockPimpinan = [
    {
      pimpinan: { id_pimpinan: 1, nama_pimpinan: 'Walikota A', nip: '111', email: 'a@test.com', no_hp: '123', is_calendar_synced: true },
      jabatan: { id_jabatan: 1, nama_jabatan: 'Walikota' },
      periode: { id_periode: 1, nama_periode: '2020-2025' },
      status_aktif: 'aktif',
    },
  ];

  const mockPeriodes = [{ id_periode: 1, nama_periode: '2020-2025', status_periode: 'aktif' }];
  const mockJabatans = [{ id_jabatan: 1, nama_jabatan: 'Walikota' }];

  beforeEach(() => {
    jest.clearAllMocks();
    (pimpinanApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockPimpinan });
    (periodeApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockPeriodes });
    (pimpinanApi.getJabatan as jest.Mock).mockResolvedValue({ success: true, data: mockJabatans });
    (pimpinanApi.getList as jest.Mock).mockResolvedValue({ success: true, data: [] });
  });

  it('renders pimpinan list correctly', async () => {
    render(<PimpinanManagementPage />);
    await waitFor(() => {
      expect(screen.getByText('Walikota A')).toBeInTheDocument();
    });
  });

  it('submits form for new pimpinan', async () => {
    const user = userEvent.setup();
    (pimpinanApi.createOrUpdate as jest.Mock).mockResolvedValue({ success: true });
    
    render(<PimpinanManagementPage />);

    await waitFor(() => expect(screen.getByText('Walikota A')).toBeInTheDocument());

    const addButton = screen.getByRole('button', { name: /tambah pimpinan/i });
    await user.click(addButton);
    
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Tambah Pimpinan' })).toBeInTheDocument());
    
    await user.type(screen.getByLabelText(/nama pimpinan/i), 'Walikota Baru');
    
    fireEvent.change(screen.getByLabelText(/jabatan/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/periode/i), { target: { value: '1' } });

    await user.type(screen.getByLabelText(/nip/i), '222');
    await user.type(screen.getByLabelText(/email/i), 'new@test.com');
    await user.type(screen.getByLabelText(/no hp/i), '456');

    const submitBtn = screen.getByRole('button', { name: 'Tambah' });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(pimpinanApi.createOrUpdate).toHaveBeenCalled();
    });
  });

  it('filters periods to show only active ones when adding pimpinan', async () => {
    const mixedPeriodes = [
      { id_periode: 'PER1', nama_periode: 'Aktif 1', status_periode: 'aktif' },
      { id_periode: 'PER2', nama_periode: 'Nonaktif 1', status_periode: 'nonaktif' },
    ];
    (periodeApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mixedPeriodes });
    
    render(<PimpinanManagementPage />);
    
    const user = userEvent.setup();
    const addButton = screen.getByRole('button', { name: /tambah pimpinan/i });
    await user.click(addButton);
    
    const periodeSelect = screen.getByLabelText(/periode/i);
    const options = Array.from(periodeSelect.querySelectorAll('option')).map(o => o.textContent);
    
    expect(options).toContain('Aktif 1');
    expect(options).not.toContain('Nonaktif 1');
  });

  it('includes id_pimpinan in payload when editing', async () => {
    const user = userEvent.setup();
    render(<PimpinanManagementPage />);
    
    await waitFor(() => expect(screen.getByText('Walikota A')).toBeInTheDocument());
    
    // Find the edit button by the mock icon testid
    const editButtons = screen.getAllByTestId('icon-edit');
    await user.click(editButtons[0].closest('button')!);
    
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Edit Pimpinan' })).toBeInTheDocument());
    
    const submitBtn = screen.getByRole('button', { name: 'Update' });
    await user.click(submitBtn);
    
    expect(pimpinanApi.createOrUpdate).toHaveBeenCalledWith(expect.objectContaining({
      id_pimpinan: 1
    }));
  });
});
