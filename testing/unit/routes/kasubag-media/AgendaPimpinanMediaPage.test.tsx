import { fireEvent, render, screen, waitFor, act, within } from '@testing-library/react';
import AgendaPimpinanMediaPage from '../../../../app/routes/kasubag-media/AgendaPimpinanMediaPage';
import { agendaApi } from '../../../../app/lib/api';

jest.mock('../../../../app/lib/api', () => ({
  agendaApi: { getLeaderAgendas: jest.fn() },
}));

jest.mock('../../../../app/components/ui/CustomSelect', () => {
  return function MockCustomSelect({ value, onChange, options, placeholder }: any) {
    return (
      <select aria-label={placeholder || 'custom-select'} value={value} onChange={(e) => onChange(e.target.value)}>
        {options?.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    );
  };
});

jest.mock('lucide-react', () => ({
  Eye: () => <span data-testid="icon-eye" />,
  Calendar: () => <span />,
  X: () => <span data-testid="icon-x" />,
  Search: () => <span />,
  Filter: () => <span />,
  List: () => <span />,
  CalendarDays: () => <span />,
  RefreshCw: () => <span data-testid="icon-refresh" />,
  Clock: () => <span />,
  CheckCircle: () => <span />,
  FileText: () => <span />,
}));

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

describe('AgendaPimpinanMediaPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const waitForLoadingFinished = async () => {
    await waitFor(() => expect(screen.queryByText(/Memuat/i)).not.toBeInTheDocument(), { timeout: 3000 });
  };

  it('renders and handles basic interactions', async () => {
    const mockData = [
      {
        id_agenda: '1',
        nama_kegiatan: 'Today Agenda',
        tanggal_kegiatan: todayStr,
        waktu_mulai: '09:00:00',
        agendaPimpinans: [{
          id_jabatan: '1', id_periode: '1', status_kehadiran: 'hadir',
          periodeJabatan: { pimpinan: { nama_pimpinan: 'P1' }, jabatan: { nama_jabatan: 'J1' } }
        }]
      }
    ];
    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({ success: true, data: mockData });

    render(<AgendaPimpinanMediaPage />);
    await waitForLoadingFinished();
    
    // Switch to List
    fireEvent.click(screen.getByText(/List/i));
    expect(screen.getByText('Today Agenda')).toBeInTheDocument();

    // Switch back to Calendar
    fireEvent.click(screen.getByText(/Kalender/i));
    expect(screen.getByText('Today Agenda')).toBeInTheDocument();

    // Calendar navigation
    fireEvent.click(screen.getByText('→'));
    fireEvent.click(screen.getByText('←'));
    fireEvent.click(screen.getByText('Hari Ini'));
  });

  it('handles filters correctly', async () => {
    const pastDate = new Date(); pastDate.setFullYear(today.getFullYear() - 1);
    const futureDate = new Date(); futureDate.setFullYear(today.getFullYear() + 1);

    const mockData = [
      {
        id_agenda: 'past', nama_kegiatan: 'Past Agenda',
        tanggal_kegiatan: pastDate.toISOString().split('T')[0],
        waktu_mulai: '09:00:00',
        agendaPimpinans: [{ id_jabatan: '1', id_periode: '1', status_kehadiran: 'hadir', periodeJabatan: { pimpinan: { nama_pimpinan: 'P1' } } }]
      },
      {
        id_agenda: 'future', nama_kegiatan: 'Future Agenda',
        tanggal_kegiatan: futureDate.toISOString().split('T')[0],
        waktu_mulai: '09:00:00',
        agendaPimpinans: [{ id_jabatan: '2', id_periode: '2', status_kehadiran: 'diwakilkan', periodeJabatan: { pimpinan: { nama_pimpinan: 'P2' } } }]
      }
    ];
    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({ success: true, data: mockData });

    render(<AgendaPimpinanMediaPage />);
    await waitForLoadingFinished();
    fireEvent.click(screen.getByText(/List/i));

    // Search
    fireEvent.change(screen.getByPlaceholderText(/Cari/i), { target: { value: 'Past' } });
    expect(screen.getByText('Past Agenda')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Cari/i), { target: { value: '' } });

    // Pimpinan
    fireEvent.change(screen.getByLabelText('Pilih Pimpinan'), { target: { value: '2:2' } });
    expect(screen.getByText('Future Agenda')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Pilih Pimpinan'), { target: { value: 'all' } });

    // Status
    fireEvent.change(screen.getByLabelText('Pilih Status'), { target: { value: 'terlaksana' } });
    expect(screen.getByText('Past Agenda')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Pilih Status'), { target: { value: 'belum' } });
    expect(screen.getByText('Future Agenda')).toBeInTheDocument();
  });

  it('shows modal with all details and statuses', async () => {
    const mockData = [
      {
        id_agenda: '1', nama_kegiatan: 'Detailed Agenda', perihal: 'Sub', lokasi_kegiatan: 'Loc',
        tanggal_kegiatan: todayStr, waktu_mulai: '09:00:00', waktu_selesai: '10:00:00',
        pemohon: { nama: 'User', instansi: 'Org' },
        contact_person: '123', keterangan: 'Notes',
        agendaPimpinans: [
          { status_kehadiran: 'hadir', periodeJabatan: { pimpinan: { nama_pimpinan: 'P1' }, jabatan: { nama_jabatan: 'J1' } } },
          { status_kehadiran: 'diwakilkan', nama_perwakilan: 'Rep', periodeJabatan: { pimpinan: { nama_pimpinan: 'P2' } } },
          { status_kehadiran: 'tidak_hadir', periodeJabatan: { pimpinan: { nama_pimpinan: 'P3' } } },
          { status_kehadiran: 'unknown', periodeJabatan: { pimpinan: { nama_pimpinan: 'P4' } } }
        ]
      }
    ];
    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({ success: true, data: mockData });

    render(<AgendaPimpinanMediaPage />);
    await waitForLoadingFinished();
    fireEvent.click(screen.getByText(/List/i));

    // Open Modal
    fireEvent.click(screen.getAllByTestId('icon-eye')[0].closest('button')!);
    const modal = screen.getByText('Detail Agenda').closest('.fixed')!;
    expect(within(modal as HTMLElement).getAllByText(/Tidak Hadir/i)[0]).toBeInTheDocument();
    expect(within(modal as HTMLElement).getByText('Belum Diatur')).toBeInTheDocument();

    // Close via X
    fireEvent.click(screen.getByTestId('icon-x').closest('button')!);
    await waitFor(() => expect(screen.queryByText('Detail Agenda')).not.toBeInTheDocument());

    // Open and Close via Tutup
    fireEvent.click(screen.getAllByTestId('icon-eye')[0].closest('button')!);
    fireEvent.click(screen.getByText('Tutup'));
    await waitFor(() => expect(screen.queryByText('Detail Agenda')).not.toBeInTheDocument());
  });

  it('handles fetch error and refresh', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (agendaApi.getLeaderAgendas as jest.Mock).mockRejectedValue(new Error('Fail'));

    render(<AgendaPimpinanMediaPage />);
    await waitFor(() => expect(consoleSpy).toHaveBeenCalled());
    await waitForLoadingFinished();

    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({ success: true, data: [] });
    fireEvent.click(screen.getByTestId('icon-refresh').closest('button')!);
    await waitForLoadingFinished();
    fireEvent.click(screen.getByRole('button', { name: /List/i }));
    expect(await screen.findByText(/Tidak ada agenda/i)).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('covers remaining branches', async () => {
    const mockData = [
      {
        id_agenda: '1', nama_kegiatan: 'No Time', tanggal_kegiatan: todayStr, waktu_mulai: null,
        agendaPimpinans: [
            { status_kehadiran: 'diwakilkan', nama_perwakilan: 'Rep', periodeJabatan: { pimpinan: { nama_pimpinan: 'P' } } },
            { status_kehadiran: 'tidak_hadir', periodeJabatan: { pimpinan: { nama_pimpinan: 'P2' } } }
        ]
      }
    ];
    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({ success: true, data: mockData });

    render(<AgendaPimpinanMediaPage />);
    await waitForLoadingFinished();
    
    // Check calendar view for delegated (line 336, 339)
    expect(screen.getByText('Rep')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/List/i));
    expect(screen.getByText('No Time')).toBeInTheDocument();
    // Line 119 will be covered by filteredData/stats calculations for 'No Time' agenda
  });
});
