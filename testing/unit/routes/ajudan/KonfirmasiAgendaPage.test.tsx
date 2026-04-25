// testing/unit/routes/ajudan/KonfirmasiAgendaPage.test.tsx

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KonfirmasiAgendaPage from '../../../../app/routes/ajudan/KonfirmasiAgendaPage';
import { agendaApi, pimpinanApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';
import { isAgendaPast } from '../../../../app/lib/dateUtils';

jest.mock('../../../../app/lib/api', () => ({
  authApi: { getMe: jest.fn() },
  agendaApi: { getLeaderAgendas: jest.fn(), updateLeaderAttendance: jest.fn() },
  pimpinanApi: { getAll: jest.fn(), getActiveAssignments: jest.fn() },
}));

jest.mock('../../../../app/lib/swal', () => ({
  toast: { success: jest.fn(), error: jest.fn(), warning: jest.fn() },
}));

jest.mock('../../../../app/lib/dateUtils', () => ({
  isAgendaPast: jest.fn(() => false),
}));

jest.mock('lucide-react', () => {
  return new Proxy({}, {
    get: (_target, name) => (props: any) => <span data-testid={`icon-${String(name).toLowerCase()}`} {...props} />,
  });
});

jest.mock('../../../../app/components/ui/CustomSelect', () => {
  return function MockCustomSelect({ value, onChange, options, placeholder }: any) {
    return (
      <select data-testid="custom-select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  };
});

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const mockAssignments = [
  { id_jabatan: 'J1', id_periode: 'P1', pimpinan: { nama_pimpinan: 'Pimpinan A' }, jabatan: { nama_jabatan: 'Walikota' } },
];

const mockAllPimpinan = [
  { id_jabatan: 'J1', id_periode: 'P1', status_aktif: 'aktif', pimpinan: { nama_pimpinan: 'Pimpinan A' }, jabatan: { nama_jabatan: 'Walikota' } },
  { id_jabatan: 'J2', id_periode: 'P2', status_aktif: 'aktif', pimpinan: { nama_pimpinan: 'Pimpinan B' }, jabatan: { nama_jabatan: 'Wakil Walikota' } },
];

const mockAgendas = [
  {
    id_agenda: 'AG1',
    nomor_surat: '001/TEST/2026',
    nama_kegiatan: 'Rapat Koordinasi',
    lokasi_kegiatan: 'Ruang Rapat',
    tanggal_kegiatan: '2099-01-01',
    waktu_mulai: '09:00:00',
    waktu_selesai: '10:00:00',
    statusAgendas: [{ status_agenda: 'approved_sespri' }],
    pemohon: { nama: 'Bagian Umum', instansi: 'Setda' },
    agendaPimpinans: [
      {
        id_jabatan: 'J1',
        id_periode: 'P1',
        status_kehadiran: 'pending',
        periodeJabatan: {
          pimpinan: { nama_pimpinan: 'Pimpinan A' },
          jabatan: { nama_jabatan: 'Walikota' },
        },
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const setupMocks = () => {
  (pimpinanApi.getActiveAssignments as jest.Mock).mockResolvedValue({ success: true, data: mockAssignments });
  (pimpinanApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockAllPimpinan });
  (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({ success: true, data: mockAgendas });
  (agendaApi.updateLeaderAttendance as jest.Mock).mockResolvedValue({ success: true });
};

const waitLoad = async () => {
  await waitFor(
    () => expect(screen.queryByTestId('icon-refreshcw')).not.toBeInTheDocument(),
    { timeout: 10_000 }
  );
};

const openKonfirmasiModal = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByTitle('Konfirmasi Kehadiran'));
  await screen.findByText('Konfirmasi Kehadiran');
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('KonfirmasiAgendaPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isAgendaPast as jest.Mock).mockReturnValue(false);
    setupMocks();
  });

  // ── Render & detail modal ────────────────────────────────────────────────

  it('renders page and handles detail modal open/close', async () => {
    const user = userEvent.setup();
    render(<KonfirmasiAgendaPage />);
    await waitLoad();

    expect(screen.getByText('Rapat Koordinasi')).toBeInTheDocument();

    await user.click(screen.getByTestId('icon-eye').parentElement!);
    expect(await screen.findByText('Detail Agenda')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /tutup/i }));
    await waitFor(() => expect(screen.queryByText('Detail Agenda')).not.toBeInTheDocument());
  });

  // ── Submit: Hadir ────────────────────────────────────────────────────────

  it('submits status hadir successfully', async () => {
    const user = userEvent.setup();
    render(<KonfirmasiAgendaPage />);
    await waitLoad();

    await openKonfirmasiModal(user);

    // "Hadir" is the default selection — submit directly
    await user.click(screen.getByRole('button', { name: /simpan konfirmasi/i }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Berhasil', 'Konfirmasi kehadiran berhasil disimpan')
    );
    expect(agendaApi.updateLeaderAttendance).toHaveBeenCalledWith(
      'AG1', 'J1', 'P1',
      expect.objectContaining({ status_kehadiran: 'hadir' })
    );
  });

  // ── Submit: Delegasi → Pimpinan ──────────────────────────────────────────

  it('submits delegasi via pimpinan selection successfully', async () => {
    const user = userEvent.setup();
    render(<KonfirmasiAgendaPage />);
    await waitLoad();

    await openKonfirmasiModal(user);

    await user.click(screen.getByRole('button', { name: /delegasi/i }));
    // "Pimpinan" toggle is active by default — select a delegate
    await user.selectOptions(screen.getByTestId('custom-select'), 'J2|P2');
    await user.click(screen.getByRole('button', { name: /simpan konfirmasi/i }));

    await waitFor(() =>
      expect(agendaApi.updateLeaderAttendance).toHaveBeenCalledWith(
        'AG1', 'J1', 'P1',
        expect.objectContaining({ status_kehadiran: 'diwakilkan', id_jabatan_perwakilan: 'J2' })
      )
    );
  });

  // ── Submit: Delegasi → Manual (validation + success) ────────────────────

  it('validates and submits delegasi via manual input', async () => {
    const user = userEvent.setup();
    render(<KonfirmasiAgendaPage />);
    await waitLoad();

    await openKonfirmasiModal(user);

    await user.click(screen.getByRole('button', { name: /delegasi/i }));
    await user.click(screen.getByRole('button', { name: /manual/i }));

    // Submit without name → validation warning
    await user.click(screen.getByRole('button', { name: /simpan konfirmasi/i }));
    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith('Validasi Gagal', 'Harap isi nama perwakilan')
    );

    // Fill name then submit
    await user.type(screen.getByPlaceholderText(/bud/i), 'Budi');
    await user.click(screen.getByRole('button', { name: /simpan konfirmasi/i }));
    await waitFor(() =>
      expect(agendaApi.updateLeaderAttendance).toHaveBeenCalledWith(
        'AG1', 'J1', 'P1',
        expect.objectContaining({ status_kehadiran: 'diwakilkan', nama_perwakilan: 'Budi' })
      )
    );
  });

  // ── Submit: Tolak (validation + success) ────────────────────────────────

  it('validates and submits tolak with alasan', async () => {
    const user = userEvent.setup();
    render(<KonfirmasiAgendaPage />);
    await waitLoad();

    await openKonfirmasiModal(user);

    await user.click(screen.getByRole('button', { name: /tolak/i }));

    // Submit without alasan → validation warning
    await user.click(screen.getByRole('button', { name: /simpan konfirmasi/i }));
    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith('Validasi Gagal', 'Harap isi alasan penolakan')
    );

    // Fill alasan then submit
    await user.type(screen.getByPlaceholderText(/alasan/i), 'Berhalangan');
    await user.click(screen.getByRole('button', { name: /simpan konfirmasi/i }));
    await waitFor(() =>
      expect(agendaApi.updateLeaderAttendance).toHaveBeenCalledWith(
        'AG1', 'J1', 'P1',
        expect.objectContaining({ status_kehadiran: 'tidak_hadir', keterangan: 'Berhalangan. ' })
      )
    );
  });

  // ── API error cases ──────────────────────────────────────────────────────

  it('handles generic API failure', async () => {
    const user = userEvent.setup();
    (agendaApi.updateLeaderAttendance as jest.Mock).mockResolvedValue({ success: false, message: 'FAIL' });

    render(<KonfirmasiAgendaPage />);
    await waitLoad();

    await openKonfirmasiModal(user);
    await user.click(screen.getByRole('button', { name: /simpan konfirmasi/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal', 'FAIL'));
  });

  it('handles jadwal bentrok error', async () => {
    const user = userEvent.setup();
    (agendaApi.updateLeaderAttendance as jest.Mock).mockResolvedValue({ success: false, message: 'BENTROK' });

    render(<KonfirmasiAgendaPage />);
    await waitLoad();

    await openKonfirmasiModal(user);
    await user.click(screen.getByRole('button', { name: /simpan konfirmasi/i }));

    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith('Jadwal Bentrok!', undefined, expect.any(String))
    );
  });

  it('handles thrown exception from API', async () => {
    const user = userEvent.setup();
    (agendaApi.updateLeaderAttendance as jest.Mock).mockRejectedValue(new Error('CRASH'));

    render(<KonfirmasiAgendaPage />);
    await waitLoad();

    await openKonfirmasiModal(user);
    await user.click(screen.getByRole('button', { name: /simpan konfirmasi/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Error', 'Terjadi kesalahan sistem'));
  });

  // ── Fetch failure ────────────────────────────────────────────────────────

  it('shows error toast when initial fetch fails', async () => {
    (pimpinanApi.getActiveAssignments as jest.Mock).mockRejectedValue(new Error('FAIL'));
    render(<KonfirmasiAgendaPage />);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal memuat data dari server'));
  });

  // ── Past agenda ──────────────────────────────────────────────────────────

  it('disables konfirmasi button for past agendas', async () => {
    (isAgendaPast as jest.Mock).mockReturnValue(true);
    render(<KonfirmasiAgendaPage />);
    await waitLoad();
    expect(screen.getByTitle('Agenda sudah selesai')).toBeDisabled();
  });
});