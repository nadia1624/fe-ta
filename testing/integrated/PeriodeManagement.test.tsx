import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PeriodeManagementPage from '../../app/routes/admin/PeriodeManagementPage';
import { periodeApi } from '../../app/lib/api';
import { toast } from '../../app/lib/swal';

// ─── API Mock ─────────────────────────────────────────────────────────────────
jest.mock('../../app/lib/api', () => ({
  periodeApi: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

// ─── Swal Mock ────────────────────────────────────────────────────────────────
jest.mock('../../app/lib/swal', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// ─── Lucide Icons Mock ────────────────────────────────────────────────────────
jest.mock('lucide-react', () => ({
  Plus: () => <span data-testid="plus-icon" />,
  Edit2: () => <span data-testid="edit-icon" />,
  ChevronLeft: () => <span data-testid="prev-icon" />,
  ChevronRight: () => <span data-testid="next-icon" />,
  Trash2: () => <span data-testid="trash-icon" />,
}));

describe('PeriodeManagementPage Integration Test', () => {
  const mockPeriodes = [
    {
      id_periode: 'PD001',
      nama_periode: 'Periode 2020-2025',
      tanggal_mulai: '2020-01-01',
      tanggal_selesai: '2025-12-31',
      keterangan: 'Periode Pertama',
      status_periode: 'aktif',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (periodeApi.getAll as jest.Mock).mockResolvedValue({
      success: true,
      data: mockPeriodes,
    });
  });

  it('renders page title and fetches data', async () => {
    render(<PeriodeManagementPage />);
    
    expect(screen.getByText('Periode Management')).toBeInTheDocument();
    
    // Wait for loading to finish and data to appear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Periode 2020-2025')).toBeInTheDocument();
    });
    
    expect(periodeApi.getAll).toHaveBeenCalled();
  });

  it('opens add modal when clicking "Tambah Periode"', async () => {
    render(<PeriodeManagementPage />);
    
    const addButton = screen.getByRole('button', { name: /tambah periode/i });
    fireEvent.click(addButton);
    
    expect(screen.getByRole('heading', { name: 'Tambah Periode' })).toBeInTheDocument();
    expect(screen.getByLabelText(/nama periode/i)).toBeInTheDocument();
  });

  it('shows error toast when start date is after end date', async () => {
    const user = userEvent.setup();
    render(<PeriodeManagementPage />);
    
    // Open modal
    await user.click(screen.getByRole('button', { name: /tambah periode/i }));
    
    // Fill data
    await user.type(screen.getByLabelText(/nama periode/i), 'New Periode');
    
    // We need to use fireEvent or userEvent for date inputs carefully
    const startInput = screen.getByLabelText(/tanggal mulai/i);
    const endInput = screen.getByLabelText(/tanggal selesai/i);
    
    fireEvent.change(startInput, { target: { value: '2025-12-31' } });
    fireEvent.change(endInput, { target: { value: '2025-01-01' } });
    
    await user.click(screen.getByRole('button', { name: 'Tambah' }));
    
    expect(toast.error).toHaveBeenCalledWith('Gagal', 'Tanggal mulai tidak boleh lebih lama dari tanggal selesai');
  });

  it('handles API failure gracefully', async () => {
    (periodeApi.getAll as jest.Mock).mockRejectedValue(new Error('Network Error'));
    
    render(<PeriodeManagementPage />);
    
    // Wait for error message to appear and loading to stop
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Network Error')).toBeInTheDocument();
    });
  });
});
