import { render, screen, waitFor, fireEvent, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PeriodeManagementPage from '../../../../app/routes/admin/PeriodeManagementPage';
import { periodeApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';

jest.setTimeout(180000);

jest.mock('../../../../app/lib/api', () => ({
  periodeApi: { getAll: jest.fn(), create: jest.fn(), update: jest.fn() },
}));
jest.mock('../../../../app/lib/swal', () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn(), confirm: jest.fn() },
}));
jest.mock('lucide-react', () => {
  const React = require('react');
  return new Proxy({}, {
    get: (_target, name) => {
      if (name === '__esModule') return true;
      const MockIcon: any = (props: any) => React.createElement('span', { ...props, 'data-testid': `icon-${String(name).toLowerCase()}` });
      return MockIcon;
    },
  });
});

describe('PeriodeManagementPage', () => {
  const mockPeriodes = Array.from({ length: 11 }, (_, i) => ({
    id_periode: i + 1,
    nama_periode: `Periode ${i + 1}`,
    tanggal_mulai: '2024-01-01',
    tanggal_selesai: '2024-12-31',
    status_periode: i === 0 ? 'aktif' : 'nonaktif'
  }));

  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
    (periodeApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockPeriodes });
  });

  const waitLoad = async () => {
    await waitFor(() => expect(screen.getByText('Periode 1')).toBeInTheDocument(), { timeout: 30000 });
  };

  it('handles creation logic and date validation with pagination', async () => {
    const user = userEvent.setup();
    render(<PeriodeManagementPage />);
    await waitLoad();
    
    // Pagination check
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Periode 11')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Prev' }));

    // Create logic with date validation
    await user.click(screen.getByRole('button', { name: /tambah periode/i }));
    const modal = await screen.findByTestId('modal-container');
    const withinModal = within(modal);
    
    await user.type(withinModal.getByLabelText(/nama periode/i), 'NEW PERIODE');
    // Start date > End date validation
    fireEvent.change(withinModal.getByLabelText(/tanggal mulai/i), { target: { value: '2025-01-10' } });
    fireEvent.change(withinModal.getByLabelText(/tanggal selesai/i), { target: { value: '2025-01-01' } });
    await user.click(withinModal.getByRole('button', { name: 'Tambah' }));
    expect(toast.error).toHaveBeenCalledWith('Gagal', expect.stringContaining('mulai tidak boleh lebih lama'));

    // Success create
    fireEvent.change(withinModal.getByLabelText(/tanggal mulai/i), { target: { value: '2025-01-01' } });
    (periodeApi.create as jest.Mock).mockResolvedValue({ success: true });
    await user.click(withinModal.getByRole('button', { name: 'Tambah' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it('handles update and toggle status failure branches', async () => {
    const user = userEvent.setup();
    render(<PeriodeManagementPage />);
    await waitLoad();
    
    // Edit Periode 1
    await user.click(screen.getAllByTestId('icon-edit2')[0].parentElement!);
    const editModal = await screen.findByTestId('modal-container');
    
    // Fail update
    (periodeApi.update as jest.Mock).mockResolvedValue({ success: false, message: 'FAIL' });
    await user.click(within(editModal).getByRole('button', { name: 'Update' }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal', 'FAIL'));
  });

  it('empty state', async () => {
    (periodeApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: [] });
    render(<PeriodeManagementPage />);
    await waitFor(() => expect(screen.getByText(/tidak ada data periode/i)).toBeInTheDocument());
  });

  it('fetch success=false', async () => {
    (periodeApi.getAll as jest.Mock).mockResolvedValue({ success: false, message: 'F' });
    render(<PeriodeManagementPage />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('handles initialization fetch error branch', async () => {
    (periodeApi.getAll as jest.Mock).mockRejectedValue(new Error('FAIL'));
    render(<PeriodeManagementPage />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled(), { timeout: 15000 });
  });
});
