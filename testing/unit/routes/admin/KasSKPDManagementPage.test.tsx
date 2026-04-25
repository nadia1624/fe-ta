import { render, screen, waitFor, fireEvent, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KasSKPDManagementPage from '../../../../app/routes/admin/KasSKPDManagementPage';
import { kaskpdApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';

jest.setTimeout(180000);

jest.mock('../../../../app/lib/api', () => ({
  kaskpdApi: { getAll: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
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

describe('KasSKPDManagementPage', () => {
  const mockData = Array.from({ length: 11 }, (_, i) => ({
    id_ka_skpd: i + 1,
    nama_instansi: `SKPD ${i + 1}`
  }));

  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
    (kaskpdApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockData });
  });

  const waitLoad = async () => {
    await waitFor(() => expect(screen.getByText('SKPD 1')).toBeInTheDocument(), { timeout: 30000 });
  };

  it('handles creation and pagination success branch', async () => {
    const user = userEvent.setup();
    render(<KasSKPDManagementPage />);
    await waitLoad();

    // Pagination
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('SKPD 11')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Prev' }));

    // Create
    await user.click(screen.getByRole('button', { name: /tambah kaskpd/i }));
    const modal = await screen.findByTestId('modal-container');
    fireEvent.change(within(modal).getByLabelText(/nama instansi/i), { target: { value: 'NEW SKPD' } });
    (kaskpdApi.create as jest.Mock).mockResolvedValue({ success: true });
    await user.click(within(modal).getByRole('button', { name: /tambah data/i }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it('handles update and delete failure branches', async () => {
    const user = userEvent.setup();
    render(<KasSKPDManagementPage />);
    await waitLoad();

    // Update first item (SKPD 1)
    await user.click(screen.getAllByTestId('icon-edit2')[0].parentElement!);
    const editModal = await screen.findByTestId('modal-container');
    
    // API fail
    (kaskpdApi.update as jest.Mock).mockResolvedValue({ success: false, message: 'FAIL' });
    await user.click(within(editModal).getByRole('button', { name: /update|simpan/i }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal', 'FAIL'));
    
    // API exception
    (kaskpdApi.update as jest.Mock).mockRejectedValue(new Error('FATAL'));
    await user.click(within(editModal).getByRole('button', { name: /update|simpan/i }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Terjadi Kesalahan', 'FATAL'));

    // Close
    await user.click(within(editModal).getByRole('button', { name: /batal/i }));

    // Delete
    (toast.confirm as jest.Mock).mockResolvedValue({ isConfirmed: true });
    (kaskpdApi.delete as jest.Mock).mockResolvedValue({ success: false, message: 'ERR' });
    await user.click(screen.getAllByTestId('icon-trash2')[0].parentElement!);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal Menghapus', 'ERR'));
    
    // Deletion Exception
    (kaskpdApi.delete as jest.Mock).mockRejectedValue(new Error('FAIL'));
    await user.click(screen.getAllByTestId('icon-trash2')[1].parentElement!);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Terjadi Kesalahan', 'FAIL'));
  });

  it('handles modal close/cancel logic', async () => {
    const user = userEvent.setup();
    render(<KasSKPDManagementPage />);
    await waitLoad();
    
    await user.click(screen.getByRole('button', { name: /tambah kaskpd/i }));
    const modal = await screen.findByTestId('modal-container');
    
    // Close using Batal
    await user.click(within(modal).getByRole('button', { name: /batal/i }));
    expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
  });

  it('empty state', async () => {
    (kaskpdApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: [] });
    render(<KasSKPDManagementPage />);
    await waitFor(() => expect(screen.getByText(/tidak ada data KaSKPD ditemukan/i)).toBeInTheDocument());
  });

  it('fetch success=false', async () => {
    (kaskpdApi.getAll as jest.Mock).mockResolvedValue({ success: false, message: 'FAIL' });
    render(<KasSKPDManagementPage />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('init fetch error', async () => {
    (kaskpdApi.getAll as jest.Mock).mockRejectedValue(new Error('FAIL'));
    render(<KasSKPDManagementPage />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
