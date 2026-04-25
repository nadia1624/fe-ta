import { render, screen, waitFor, fireEvent, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PimpinanManagementPage from '../../../../app/routes/admin/PimpinanManagementPage';
import { pimpinanApi, periodeApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';

jest.setTimeout(180000);

jest.mock('../../../../app/lib/api', () => ({
  pimpinanApi: { getAll: jest.fn(), getJabatan: jest.fn(), getList: jest.fn(), createOrUpdate: jest.fn(), resendSyncInvitation: jest.fn() },
  periodeApi: { getAll: jest.fn() },
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

describe('PimpinanManagementPage', () => {
  const mockPimpinanList = Array.from({ length: 11 }, (_, i) => ({
    pimpinan: { id_pimpinan: i + 1, nama_pimpinan: `Pimpinan ${i + 1}`, nip: `${i + 1}`, email: `p${i + 1}@t.com`, no_hp: `081${i + 1}`, is_calendar_synced: i % 2 === 0 },
    jabatan: { id_jabatan: 1, nama_jabatan: 'J' },
    periode: { id_periode: 1, nama_periode: 'P' },
    status_aktif: 'aktif'
  }));
  const mockJabatan = [{ id_jabatan: 1, nama_jabatan: 'J' }];
  const mockPeriode = [{ id_periode: 1, nama_periode: 'P' }];
  const mockExistingPimpinan = [{ id_pimpinan: 99, nama_pimpinan: 'Existing P', nip: '99', email: '99@t.com', no_hp: '99' }];

  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
    (pimpinanApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockPimpinanList });
    (pimpinanApi.getJabatan as jest.Mock).mockResolvedValue({ success: true, data: mockJabatan });
    (periodeApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockPeriode });
    (pimpinanApi.getList as jest.Mock).mockResolvedValue({ success: true, data: mockExistingPimpinan });
  });

  const waitLoad = async () => {
    await waitFor(() => expect(screen.getByText('Pimpinan 1')).toBeInTheDocument(), { timeout: 30000 });
  };

  it('handles creation with existing selection and pagination', async () => {
    const user = userEvent.setup();
    render(<PimpinanManagementPage />);
    await waitLoad();

    // Pagination
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Pimpinan 11')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Prev' }));

    // Add existing
    await user.click(screen.getByRole('button', { name: /tambah pimpinan/i }));
    const modal = await screen.findByTestId('modal-container');
    await user.click(within(modal).getByText(/pilih pimpinan lama/i));
    const searchInput = within(modal).getByPlaceholderText(/cari nama atau nip/i);
    await user.type(searchInput, '99');
    const item = await screen.findByText(/Existing P/);
    await user.click(item);
    
    fireEvent.change(within(modal).getByLabelText(/^jabatan/i), { target: { value: '1' } });
    fireEvent.change(within(modal).getByLabelText(/^periode/i), { target: { value: '1' } });
    
    (pimpinanApi.createOrUpdate as jest.Mock).mockResolvedValue({ success: true });
    await user.click(within(modal).getByRole('button', { name: 'Tambah' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it('handles resend sync invitation and update error branches', async () => {
    const user = userEvent.setup();
    render(<PimpinanManagementPage />);
    await waitLoad();

    // Resend sync invitation (mail icon)
    (pimpinanApi.resendSyncInvitation as jest.Mock).mockResolvedValue({ success: true });
    await user.click(screen.getAllByTestId('icon-mail')[0].parentElement!);
    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    // Fail sync resend
    (pimpinanApi.resendSyncInvitation as jest.Mock).mockResolvedValue({ success: false, message: 'FAIL' });
    await user.click(screen.getAllByTestId('icon-mail')[0].parentElement!);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal', 'FAIL'));
    
    // Catch branch
    (pimpinanApi.resendSyncInvitation as jest.Mock).mockRejectedValue(new Error('CRASH'));
    await user.click(screen.getAllByTestId('icon-mail')[0].parentElement!);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());

    // Update fail
    await user.click(screen.getAllByTestId('icon-edit2')[0].parentElement!);
    const editModal = await screen.findByTestId('modal-container');
    (pimpinanApi.createOrUpdate as jest.Mock).mockResolvedValue({ success: false, message: 'ERR' });
    await user.click(within(editModal).getByRole('button', { name: 'Update' }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal', 'ERR'));
  });

  it('empty state', async () => {
    (pimpinanApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: [] });
    render(<PimpinanManagementPage />);
    await waitFor(() => expect(screen.getByText(/tidak ada data pimpinan/i)).toBeInTheDocument());
  });

  it('fetch success=false', async () => {
    (pimpinanApi.getAll as jest.Mock).mockResolvedValue({ success: false, message: 'F' });
    render(<PimpinanManagementPage />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('handles initial fetch error', async () => {
    (pimpinanApi.getAll as jest.Mock).mockRejectedValue(new Error('FAIL'));
    render(<PimpinanManagementPage />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
