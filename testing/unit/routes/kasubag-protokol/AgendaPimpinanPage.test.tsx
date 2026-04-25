import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AgendaPimpinanPage from '../../../../app/routes/kasubag-protokol/AgendaPimpinanPage';
import { agendaApi } from '../../../../app/lib/api';

// ─── API Mock ─────────────────────────────────────────────────────────────────

jest.mock('../../../../app/lib/api', () => ({
  agendaApi: { getLeaderAgendas: jest.fn() },
}));

// ─── Lucide Icons Mock ────────────────────────────────────────────────────────

jest.mock('lucide-react', () => {
  return new Proxy({}, {
    get: (_target, name) => (props: any) =>
      <span data-testid={`icon-${String(name).toLowerCase()}`} {...props} />,
  });
});

// ─── CustomSelect Mock ────────────────────────────────────────────────────────

jest.mock('../../../../app/components/ui/CustomSelect', () => {
  return function MockCustomSelect({ value, onChange, options, placeholder }: any) {
    return (
      <select
        data-testid="custom-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      >
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  };
});

jest.mock('../../../../app/lib/swal', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    confirm: jest.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

/** Agenda hadir — tanggal jauh ke depan (belum terlaksana) */
const mockAgendaHadir = {
  id_agenda: 'AG1',
  nomor_surat: '001/TEST/2026',
  nama_kegiatan: 'Rapat Koordinasi',
  perihal: 'Koordinasi Tahunan',
  lokasi_kegiatan: 'Ruang Rapat A',
  tanggal_kegiatan: '2099-06-15',
  waktu_mulai: '09:00:00',
  waktu_selesai: '11:00:00',
  pemohon: { nama: 'Bagian Umum', instansi: 'Setda' },
  contact_person: '08123456789',
  keterangan: 'Harap tepat waktu',
  agendaPimpinans: [
    {
      id_jabatan: 'J1',
      id_periode: 'P1',
      status_kehadiran: 'hadir',
      nama_perwakilan: null,
      periodeJabatan: {
        pimpinan: { nama_pimpinan: 'Pimpinan A' },
        jabatan: { nama_jabatan: 'Walikota' },
      },
    },
  ],
};

/** Agenda diwakilkan — tanggal jauh ke depan */
const mockAgendaDiwakilkan = {
  id_agenda: 'AG2',
  nomor_surat: '002/TEST/2026',
  nama_kegiatan: 'Seminar Nasional',
  perihal: 'Seminar Teknologi',
  lokasi_kegiatan: 'Aula Utama',
  tanggal_kegiatan: '2099-06-20',
  waktu_mulai: '08:00:00',
  waktu_selesai: '12:00:00',
  pemohon: { nama: 'Dinas IT', instansi: 'Diskominfo' },
  contact_person: null,
  keterangan: null,
  agendaPimpinans: [
    {
      id_jabatan: 'J2',
      id_periode: 'P2',
      status_kehadiran: 'diwakilkan',
      nama_perwakilan: 'Budi Staf',
      periodeJabatan: {
        pimpinan: { nama_pimpinan: 'Pimpinan B' },
        jabatan: { nama_jabatan: 'Wakil Walikota' },
      },
    },
  ],
};

/** Agenda hadir + tidak hadir (past) — tanggal lampau (terlaksana) */
const mockAgendaPast = {
  id_agenda: 'AG3',
  nomor_surat: '003/TEST/2025',
  nama_kegiatan: 'Workshop Manajemen',
  perihal: 'Pelatihan ASN',
  lokasi_kegiatan: 'Hotel Grand',
  tanggal_kegiatan: '2000-01-01',
  waktu_mulai: '07:00:00',
  waktu_selesai: '16:00:00',
  pemohon: { nama: 'BKD', instansi: 'BKD Kota' },
  contact_person: null,
  keterangan: null,
  agendaPimpinans: [
    {
      id_jabatan: 'J1',
      id_periode: 'P1',
      status_kehadiran: 'hadir',
      nama_perwakilan: null,
      periodeJabatan: {
        pimpinan: { nama_pimpinan: 'Pimpinan A' },
        jabatan: { nama_jabatan: 'Walikota' },
      },
    },
    {
      id_jabatan: 'J2',
      id_periode: 'P2',
      status_kehadiran: 'tidak_hadir',
      nama_perwakilan: null,
      periodeJabatan: {
        pimpinan: { nama_pimpinan: 'Pimpinan B' },
        jabatan: { nama_jabatan: 'Wakil Walikota' },
      },
    }
  ],
};

/** Agenda pending — TIDAK boleh muncul di daftar */
const mockAgendaPending = {
  id_agenda: 'AG4',
  nama_kegiatan: 'Agenda Pending Tersembunyi',
  tanggal_kegiatan: '2099-07-01',
  waktu_mulai: '10:00:00',
  waktu_selesai: '11:00:00',
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
};

const allMockAgendas = [mockAgendaHadir, mockAgendaDiwakilkan, mockAgendaPast, mockAgendaPending];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const waitLoad = async () => {
  // Wait for the "Memuat data..." text to disappear
  await waitFor(
    () => expect(screen.queryByText('Memuat data...')).not.toBeInTheDocument(),
    { timeout: 10_000 }
  );
};

// ─── Test Suites ──────────────────────────────────────────────────────────────

describe('AgendaPimpinanPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({
      success: true,
      data: allMockAgendas,
    });
  });

  // ── 1. Loading state ───────────────────────────────────────────────────────

  it('shows loading spinner then hides it after data loads', async () => {
    render(<AgendaPimpinanPage />);
    // Spinner should be visible immediately
    expect(screen.getByText('Memuat data...')).toBeInTheDocument();
    await waitLoad();
    expect(screen.queryByText('Memuat data...')).not.toBeInTheDocument();
  });

  // ── 2. Filter — only confirmed agendas shown ───────────────────────────────

  it('filters out agendas with no hadir/diwakilkan status', async () => {
    render(<AgendaPimpinanPage />);
    await waitLoad();

    // Switch to list view to inspect rows
    await userEvent.click(screen.getByRole('button', { name: /list/i }));

    // Confirmed agendas should appear
    expect(screen.getByText('Rapat Koordinasi')).toBeInTheDocument();
    expect(screen.getByText('Seminar Nasional')).toBeInTheDocument();
    expect(screen.getByText('Workshop Manajemen')).toBeInTheDocument();

    // Pending agenda must NOT appear
    expect(screen.queryByText('Agenda Pending Tersembunyi')).not.toBeInTheDocument();
  });

  // ── 3. Stats KPI cards ─────────────────────────────────────────────────────

  it('renders KPI stats: total, terlaksana, belum terlaksana', async () => {
    render(<AgendaPimpinanPage />);
    await waitLoad();

    // Find paragraphs containing numbers (KPI cards)
    const stats = screen.getAllByRole('paragraph').filter(p => /^\d+$/.test(p.textContent || ''));
    
    // In our case: total=3, terlaksana=1, belum=2
    expect(stats.some(s => s.textContent === '3')).toBe(true);
    expect(stats.some(s => s.textContent === '1')).toBe(true);
    expect(stats.some(s => s.textContent === '2')).toBe(true);
  });

  // ── 4. View mode toggle ────────────────────────────────────────────────────

  it('switches between calendar and list views', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    // Default is calendar
    expect(screen.getByText(/Mgg/)).toBeInTheDocument();

    // Switch to list
    const listBtn = screen.getByRole('button', { name: /list/i });
    await user.click(listBtn);
    expect(await screen.findByText(/daftar agenda/i)).toBeInTheDocument();

    // Switch back to calendar
    const calBtn = screen.getByRole('button', { name: /kalender/i });
    await user.click(calBtn);
    expect(await screen.findByText(/Mgg/)).toBeInTheDocument();
  });

  // ── 5. Calendar month navigation ──────────────────────────────────────────

  it('navigates calendar months with prev/next and "Hari Ini" buttons', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    const currentMonthLabel = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    expect(screen.getByText(new RegExp(currentMonthLabel, 'i'))).toBeInTheDocument();

    // Next month
    await user.click(screen.getByRole('button', { name: /→/ }));
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextLabel = nextMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    expect(screen.getByText(new RegExp(nextLabel, 'i'))).toBeInTheDocument();

    // Back to today
    await user.click(screen.getByRole('button', { name: /hari ini/i }));
    expect(screen.getByText(new RegExp(currentMonthLabel, 'i'))).toBeInTheDocument();

    // Prev month
    await user.click(screen.getByRole('button', { name: /←/ }));
    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevLabel = prevMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    expect(screen.getByText(new RegExp(prevLabel, 'i'))).toBeInTheDocument();
  });

  // ── 6. Search filter ───────────────────────────────────────────────────────

  it('filters list by search term', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    // Switch to list view
    await user.click(screen.getByRole('button', { name: /list/i }));

    const searchInput = screen.getByPlaceholderText(/cari agenda/i);
    await user.type(searchInput, 'Rapat');

    expect(screen.getByText('Rapat Koordinasi')).toBeInTheDocument();
    expect(screen.queryByText('Seminar Nasional')).not.toBeInTheDocument();
    expect(screen.queryByText('Workshop Manajemen')).not.toBeInTheDocument();
  });

  it('shows empty state when search has no results', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    await user.click(screen.getByRole('button', { name: /list/i }));

    const searchInput = screen.getByPlaceholderText(/cari agenda/i);
    await user.type(searchInput, 'xyznotfound9999');

    expect(screen.getByText(/tidak ada agenda terkonfirmasi yang ditemukan/i)).toBeInTheDocument();
  });

  // ── 7. Status filter ───────────────────────────────────────────────────────

  it('filters list by status terlaksana', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    await user.click(screen.getByRole('button', { name: /list/i }));

    // The second CustomSelect is the status filter
    const selects = screen.getAllByTestId('custom-select');
    const statusSelect = selects[1];
    await user.selectOptions(statusSelect, 'terlaksana');

    // Only past agenda should show
    expect(screen.getByText('Workshop Manajemen')).toBeInTheDocument();
    expect(screen.queryByText('Rapat Koordinasi')).not.toBeInTheDocument();
    expect(screen.queryByText('Seminar Nasional')).not.toBeInTheDocument();
  });

  it('filters list by status belum terlaksana', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    await user.click(screen.getByRole('button', { name: /list/i }));

    const selects = screen.getAllByTestId('custom-select');
    const statusSelect = selects[1];
    await user.selectOptions(statusSelect, 'belum');

    expect(screen.getByText('Rapat Koordinasi')).toBeInTheDocument();
    expect(screen.getByText('Seminar Nasional')).toBeInTheDocument();
    expect(screen.queryByText('Workshop Manajemen')).not.toBeInTheDocument();
  });

  // ── 8. Pimpinan filter ─────────────────────────────────────────────────────

  it('filters list by pimpinan', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    await user.click(screen.getByRole('button', { name: /list/i }));

    const selects = screen.getAllByTestId('custom-select');
    const pimpinanSelect = selects[0];
    await user.selectOptions(pimpinanSelect, 'J2:P2');

    expect(screen.getByText('Seminar Nasional')).toBeInTheDocument();
    expect(screen.queryByText('Rapat Koordinasi')).not.toBeInTheDocument();
  });

  // ── 9. Detail modal — list view ────────────────────────────────────────────

  it('opens and closes detail modal from list view', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    await user.click(screen.getByRole('button', { name: /list/i }));

    // Click eye icon button
    const eyeButtons = screen.getAllByRole('button').filter(b => b.querySelector('[data-testid="icon-eye"]'));
    await user.click(eyeButtons[0]);

    // Modal should appear
    expect(await screen.findByText('Detail Agenda')).toBeInTheDocument();

    // Close
    await user.click(screen.getByRole('button', { name: /tutup/i }));
    await waitFor(() => expect(screen.queryByText('Detail Agenda')).not.toBeInTheDocument());
  });

  it('displays correct agenda info inside detail modal', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    await user.click(screen.getByRole('button', { name: /list/i }));

    // Open detail for 'Rapat Koordinasi'
    const rows = screen.getAllByRole('row');
    const targetRow = rows.find(r => within(r).queryByText('Rapat Koordinasi'));
    await user.click(within(targetRow!).getByRole('button'));

    expect(await screen.findByText('Detail Agenda')).toBeInTheDocument();
    // Use getAllByText because it's in the row and the modal
    expect(screen.getAllByText('Rapat Koordinasi').length).toBeGreaterThan(1);
    expect(screen.getByText('Koordinasi Tahunan')).toBeInTheDocument();
    expect(screen.getByText(/08123456789/)).toBeInTheDocument();
    expect(screen.getByText(/harap tepat waktu/i)).toBeInTheDocument();
    expect(screen.getAllByText('Pimpinan A').length).toBeGreaterThan(1);
  });

  it('shows perwakilan info in detail modal for diwakilkan agenda', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    await user.click(screen.getByRole('button', { name: /list/i }));

    const rows = screen.getAllByRole('row');
    const targetRow = rows.find(r => within(r).queryByText('Seminar Nasional'));
    await user.click(within(targetRow!).getByRole('button'));

    expect(await screen.findByText(/diwakili oleh: budi staf/i)).toBeInTheDocument();
  });

  // ── 10. Detail modal — calendar view ──────────────────────────────────────

  it('opens detail modal by clicking agenda in calendar view', async () => {
    const user = userEvent.setup();
    
    // Ensure we have an agenda in the current month for calendar view
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const calAgenda = {
      ...mockAgendaHadir,
      id_agenda: 'CAL1',
      nama_kegiatan: 'Agenda Hari Ini',
      tanggal_kegiatan: dateStr,
    };

    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({
      success: true,
      data: [calAgenda],
    });

    render(<AgendaPimpinanPage />);
    await waitLoad();

    const agendaChip = await screen.findByText(/agenda hari ini/i);
    await user.click(agendaChip);

    expect(await screen.findByText('Detail Agenda')).toBeInTheDocument();
    // It's in the calendar and in the modal
    expect(screen.getAllByText('Agenda Hari Ini').length).toBeGreaterThan(1);
  });

  // ── 11. Refresh button ─────────────────────────────────────────────────────

  it('calls fetchData again when refresh button is clicked', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    expect(agendaApi.getLeaderAgendas).toHaveBeenCalledTimes(1);

    const refreshBtn = screen.getByTitle('Refresh');
    await user.click(refreshBtn);

    await waitFor(() => expect(agendaApi.getLeaderAgendas).toHaveBeenCalledTimes(2));
  });

  // ── 12. API failure handled ───────────────────────────────────────────────

  it('handles API failure gracefully', async () => {
    (agendaApi.getLeaderAgendas as jest.Mock).mockRejectedValue(new Error('FAIL'));
    render(<AgendaPimpinanPage />);
    await waitLoad();

    expect(screen.getByText('Total Agenda')).toBeInTheDocument();
    // Use getAllByText because '0' appears in multiple KPI cards
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  // ── 13. SELESAI badge in list view ────────────────────────────────────────

  it('shows SELESAI badge for past agendas in list view', async () => {
    const user = userEvent.setup();
    render(<AgendaPimpinanPage />);
    await waitLoad();

    await user.click(screen.getByRole('button', { name: /list/i }));

    // Workshop Manajemen has date 2000-01-01
    expect(screen.getByText('SELESAI')).toBeInTheDocument();
  });

  // ── 14. Calendar legend ────────────────────────────────────────────────────

  it('shows legend in calendar view', async () => {
    render(<AgendaPimpinanPage />);
    await waitLoad();

    expect(screen.getByText('Hadir')).toBeInTheDocument();
    expect(screen.getByText('Diwakilkan')).toBeInTheDocument();
    expect(screen.getByText('Tidak Hadir')).toBeInTheDocument();
  });

  // ── 15. Calendar overflow indicator ───────────────────────────────────────

  it('shows overflow indicator when more than 3 agendas on same day', async () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const manyAgendas = Array.from({ length: 5 }, (_, i) => ({
      ...mockAgendaHadir,
      id_agenda: `MANY${i}`,
      nama_kegiatan: `Agenda ${i}`,
      tanggal_kegiatan: dateStr,
    }));

    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({
      success: true,
      data: manyAgendas,
    });

    render(<AgendaPimpinanPage />);
    await waitLoad();

    expect(await screen.findByText(/\+2/)).toBeInTheDocument();
  });
});