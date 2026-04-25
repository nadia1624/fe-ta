import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AjudanAssignmentPage from '../../../../app/routes/admin/AjudanAssignmentPage';
import { ajudanAssignmentApi, userApi, pimpinanApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';

jest.setTimeout(180000);

// ================= MOCK =================
jest.mock('../../../../app/lib/api', () => ({
  ajudanAssignmentApi: {
    getAll: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    setActive: jest.fn(),
  },
  userApi: { getAll: jest.fn() },
  pimpinanApi: { getAll: jest.fn() },
}));

jest.mock('../../../../app/lib/swal', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    confirm: jest.fn(),
  },
}));

jest.mock('lucide-react', () => {
  const React = require('react');
  return new Proxy({}, {
    get: (_target, name) => {
      if (name === '__esModule') return true;
      return (props: any) =>
        React.createElement('span', {
          ...props,
          'data-testid': `icon-${String(name).toLowerCase()}`
        });
    },
  });
});

// ================= DATA =================
const mockAssignments = Array.from({ length: 12 }, (_, i) => ({
  id_user_ajudan: i + 1,
  id_pimpinan: 1,
  id_jabatan: 1,
  id_periode: 1,
  status_aktif: i === 0 ? 'aktif' : 'nonaktif',
  periodeJabatan: {
    pimpinan: { nama_pimpinan: `Pimpinan ${i + 1}` },
    jabatan: { nama_jabatan: 'Jabatan' },
    periode: { nama_periode: 'Periode' }
  },
  ajudan: { nama: `Ajudan ${i + 1}`, nip: `NIP${i + 1}` }
}));

const mockUsers = [
  { id_user: 1, nama: 'Ajudan 1', role: { nama_role: 'Ajudan' } }
];

const mockPimpinan = [{
  id_pimpinan: 1,
  id_jabatan: 1,
  id_periode: 1,
  status_aktif: 'aktif',
  pimpinan: { nama_pimpinan: 'P1' },
  jabatan: { nama_jabatan: 'J' },
  periode: { nama_periode: 'T1' }
}];

// ================= SETUP =================
beforeEach(() => {
  jest.clearAllMocks();

  (ajudanAssignmentApi.getAll as jest.Mock).mockResolvedValue({
    success: true,
    data: mockAssignments
  });

  (userApi.getAll as jest.Mock).mockResolvedValue({
    success: true,
    data: mockUsers
  });

  (pimpinanApi.getAll as jest.Mock).mockResolvedValue({
    success: true,
    data: mockPimpinan
  });

  // default confirm = YES
  (toast.confirm as jest.Mock).mockResolvedValue({ isConfirmed: true });
});

const waitLoad = async () => {
  await waitFor(() =>
    expect(screen.getByText('Pimpinan 1')).toBeInTheDocument()
  );
};

// ================= TEST =================
describe('AjudanAssignmentPage', () => {

  it('toggle active (all branches)', async () => {
    const user = userEvent.setup();
    render(<AjudanAssignmentPage />);
    await waitLoad();

    // ❌ already active → no confirm
    const aktifBadge = screen.getAllByTestId('status-badge')[0];
    fireEvent.click(aktifBadge);
    expect(toast.confirm).not.toHaveBeenCalled();

    // ✅ success
    (ajudanAssignmentApi.setActive as jest.Mock).mockResolvedValue({ success: true });

    const nonaktifBadge = screen.getAllByTestId('status-badge')[1];
    fireEvent.click(nonaktifBadge);

    await waitFor(() =>
      expect(toast.confirm).toHaveBeenCalled()
    );

    await waitFor(() =>
      expect(ajudanAssignmentApi.setActive).toHaveBeenCalled()
    );

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalled()
    );

    // ❌ fail response
    (ajudanAssignmentApi.setActive as jest.Mock).mockResolvedValue({
      success: false,
      message: 'FAIL'
    });
 
    fireEvent.click(screen.getAllByTestId('status-badge')[2]);
 
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Gagal', 'FAIL')
    );

    // 💥 exception
    (ajudanAssignmentApi.setActive as jest.Mock).mockRejectedValue(new Error());
 
    fireEvent.click(screen.getAllByTestId('status-badge')[3]);
 
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Error', 'Terjadi kesalahan sistem')
    );
  });

  it('create assignment (validation + error)', async () => {
    const user = userEvent.setup();
    render(<AjudanAssignmentPage />);
    await waitLoad();

    await user.click(screen.getByRole('button', { name: /tambah/i }));

    const modal = await screen.findByTestId('modal-container');
    const modalScope = within(modal);

    // ❌ validation fail
    fireEvent.click(modalScope.getByRole('button', { name: /simpan/i }));

    await waitFor(() => expect(toast.warning).toHaveBeenCalled());

    // isi form
    await user.selectOptions(
      modalScope.getByTestId('select-ajudan'),
      '1'
    );

    await user.selectOptions(
      modalScope.getByTestId('select-pimpinan'),
      '1|1'
    );

    // ❌ API fail
    (ajudanAssignmentApi.create as jest.Mock).mockResolvedValue({
      success: false,
      message: 'ERR'
    });

    await user.click(modalScope.getByRole('button', { name: /simpan/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Gagal', 'ERR')
    );

    // 💥 exception
    (ajudanAssignmentApi.create as jest.Mock).mockRejectedValue(new Error('API CRASH'));

    await user.click(modalScope.getByRole('button', { name: /simpan/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Error', 'API CRASH')
    );

    // ✅ Success
    (ajudanAssignmentApi.create as jest.Mock).mockResolvedValue({ success: true });
    await user.click(modalScope.getByRole('button', { name: /simpan/i }));
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it('delete assignment (all branches)', async () => {
    const user = userEvent.setup();
    render(<AjudanAssignmentPage />);
    await waitLoad();

    // ✅ success
    (ajudanAssignmentApi.delete as jest.Mock).mockResolvedValue({ success: true });

    await user.click(screen.getAllByTestId('delete-button')[0]);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalled()
    );

    // ❌ fail
    (ajudanAssignmentApi.delete as jest.Mock).mockResolvedValue({
      success: false,
      message: 'NO'
    });

    await user.click(screen.getAllByTestId('delete-button')[1]);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Gagal', 'NO')
    );

    // 💥 exception
    (ajudanAssignmentApi.delete as jest.Mock).mockRejectedValue(new Error());

    await user.click(screen.getAllByTestId('delete-button')[2]);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalled()
    );

    // No confirm
    (toast.confirm as jest.Mock).mockResolvedValue({ isConfirmed: false });
    await user.click(screen.getAllByTestId('delete-button')[0]);
    expect(ajudanAssignmentApi.delete).toHaveBeenCalledTimes(3); // no new call
  });

  it('search + pagination', async () => {
    const user = userEvent.setup();
    render(<AjudanAssignmentPage />);
    await waitLoad();

    const search = screen.getByPlaceholderText(/cari ajudan/i);

    // 🔍 search
    await user.type(search, 'Ajudan 12');

    expect(screen.getByText('Ajudan 12')).toBeInTheDocument();

    expect(screen.queryByText(/^Ajudan 1$/)).not.toBeInTheDocument();

    // 🔄 reset
    await user.clear(search);

    // 👉 next
    await user.click(screen.getByTestId('pagination-next'));

    expect(screen.getByText('Ajudan 11')).toBeInTheDocument();

    // 👈 prev
    await user.click(screen.getByTestId('pagination-prev'));

    expect(screen.getByText('Ajudan 1')).toBeInTheDocument();

    // status filter
    const statusSelect = screen.getByRole('combobox');
    await user.selectOptions(statusSelect, 'aktif');
    expect(screen.queryByText('Ajudan 2')).not.toBeInTheDocument();
  });

  it('empty state', async () => {
    (ajudanAssignmentApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: [] });
    render(<AjudanAssignmentPage />);
    await waitFor(() => expect(screen.getByText(/tidak ada data penugasan ditemukan/i)).toBeInTheDocument());
  });

  it('init fetch success=false', async () => {
    (ajudanAssignmentApi.getAll as jest.Mock).mockResolvedValue({ success: false, message: 'FAIL_INIT' });
    render(<AjudanAssignmentPage />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('init fetch error', async () => {
    (ajudanAssignmentApi.getAll as jest.Mock).mockRejectedValue(new Error());

    render(<AjudanAssignmentPage />);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalled()
    );
  });

});