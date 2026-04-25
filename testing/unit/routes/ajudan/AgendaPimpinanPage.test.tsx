import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AgendaPimpinanPage from '../../../../app/routes/ajudan/AgendaPimpinanPage';
import { agendaApi, pimpinanApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';

// Standardized API Mock
jest.mock('../../../../app/lib/api', () => ({
  authApi: { getMe: jest.fn() },
  agendaApi: { 
    getLeaderAgendas: jest.fn(), 
    updateLeaderAttendance: jest.fn() 
  },
  pimpinanApi: { 
    getActiveAssignments: jest.fn(), 
    getAll: jest.fn() 
  },
}));

// Mock Toast
jest.mock('../../../../app/lib/swal', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock Proxy for Lucide Icons
jest.mock('lucide-react', () => {
  return new Proxy({}, {
    get: (target, name) => {
      return (props: any) => <span data-testid={`icon-${String(name).toLowerCase()}`} {...props} />;
    }
  });
});

// Mock CustomSelect
jest.mock('../../../../app/components/ui/CustomSelect', () => {
  return function MockCustomSelect({ value, onChange, options, placeholder, className, icon }: any) {
    return (
      <div data-testid="custom-select" className={className}>
        {icon}
        <select 
          data-testid="select-input"
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  };
});

describe('AgendaPimpinanPage', () => {
  const user = userEvent.setup();

  const mockAssignments = [
    {
      id_jabatan: 'J1',
      id_periode: 'P1',
      pimpinan: { nama_pimpinan: 'Bapak Pimpinan' },
      jabatan: { nama_jabatan: 'Kepala Dinas' }
    }
  ];

  const mockAllPimpinan = [
    {
      id_jabatan: 'J2',
      id_periode: 'P1',
      status_aktif: 'aktif',
      pimpinan: { nama_pimpinan: 'Ibu Pimpinan' },
      jabatan: { nama_jabatan: 'Wakil Kepala' }
    }
  ];

  const mockAgendas = [
    {
      id_agenda: 'AG1',
      nama_kegiatan: 'Agenda Masa Depan',
      tanggal_kegiatan: '2099-01-01',
      waktu_mulai: '08:00:00',
      waktu_selesai: '09:00:00',
      lokasi_kegiatan: 'Kantor',
      statusAgendas: [{ status_agenda: 'approved_sespri' }],
      agendaPimpinans: [{
        id_jabatan: 'J1',
        id_periode: 'P1',
        status_kehadiran: 'pending',
        periodeJabatan: { pimpinan: { nama_pimpinan: 'Bapak Pimpinan' } }
      }],
      slotAgendaPimpinans: []
    }
  ];

  const waitLoad = async () => {
    await waitFor(() => expect(screen.queryByTestId('icon-refreshcw')).not.toBeInTheDocument(), { timeout: 10000 });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (pimpinanApi.getActiveAssignments as jest.Mock).mockResolvedValue({ success: true, data: mockAssignments });
    (pimpinanApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: mockAllPimpinan });
    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({ success: true, data: mockAgendas });
  });

  it('handles view mode switching and calendar navigation', async () => {
    render(<AgendaPimpinanPage />);
    await waitLoad();

    // Calendar view is default
    const now = new Date();
    const currentHeader = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    expect(await screen.findByText(new RegExp(currentHeader, 'i'))).toBeInTheDocument();

    // Navigation
    await user.click(screen.getByText('←'));
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevHeader = prevMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    expect(await screen.findByText(new RegExp(prevHeader, 'i'))).toBeInTheDocument();
    
    await user.click(screen.getByText('→'));
    expect(await screen.findByText(new RegExp(currentHeader, 'i'))).toBeInTheDocument();

    await user.click(screen.getByText('Hari Ini'));
    expect(await screen.findByText(new RegExp(currentHeader, 'i'))).toBeInTheDocument();

    // Switch to List View
    await user.click(screen.getByRole('button', { name: /list/i }));
    expect(await screen.findByText('Daftar Agenda')).toBeInTheDocument();
  });

  it('handles search and filtering in list view', async () => {
    render(<AgendaPimpinanPage />);
    await waitLoad();
    await user.click(screen.getByRole('button', { name: /list/i }));

    const searchInput = screen.getByPlaceholderText(/cari agenda atau lokasi/i);
    await user.type(searchInput, 'Agenda Masa Depan');
    expect(screen.getByText('Agenda Masa Depan')).toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, 'NonExistent');
    expect(screen.getByText(/tidak ada agenda terkonfirmasi/i)).toBeInTheDocument();
  });

  it('handles attendance update (success, failure, validation, and bentrok)', async () => {
    render(<AgendaPimpinanPage />);
    await waitLoad();
    await user.click(screen.getByRole('button', { name: /list/i }));

    // Open detail
    await user.click(screen.getByTestId('icon-eye').parentElement!);
    expect(await screen.findByText('Detail Agenda')).toBeInTheDocument();

    // Open attendance form
    await user.click(screen.getByText(/edit kehadiran/i));
    const form = await screen.findByText(/atur kehadiran:/i);
    const formContainer = form.parentElement?.parentElement!;

    // Validation Failure: Diwakilkan without selection
    await user.click(screen.getByTestId('btn-status-diwakilkan'));
    await user.click(screen.getByText('Simpan Status'));
    expect(toast.warning).toHaveBeenCalledWith('Validasi Gagal', 'Harap pilih pimpinan perwakilan');

    // Validation Failure: Manual without name
    await user.click(screen.getByRole('button', { name: /lainnya \(manual\)/i }));
    await user.click(screen.getByText('Simpan Status'));
    expect(toast.warning).toHaveBeenCalledWith('Validasi Gagal', 'Harap isi nama perwakilan');

    // API Success: Hadir
    (agendaApi.updateLeaderAttendance as jest.Mock).mockResolvedValue({ success: true });
    await user.click(screen.getByTestId('btn-status-hadir'));
    await user.click(screen.getByText('Simpan Status'));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Berhasil', 'Status kehadiran diperbarui'));

    // API Failure: Generic
    await user.click(screen.getByText(/edit kehadiran/i));
    (agendaApi.updateLeaderAttendance as jest.Mock).mockResolvedValue({ success: false, message: 'ERR_MSG' });
    await user.click(screen.getByText('Simpan Status'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal', 'ERR_MSG'));

    // API Failure: Bentrok
    (agendaApi.updateLeaderAttendance as jest.Mock).mockResolvedValue({ success: false, message: 'BENTROK_MSG' });
    await user.click(screen.getByText('Simpan Status'));
    await waitFor(() => expect(toast.warning).toHaveBeenCalledWith('Jadwal Bentrok!', 'BENTROK_MSG'));

    // API Exception
    (agendaApi.updateLeaderAttendance as jest.Mock).mockRejectedValue(new Error('CRASH'));
    await user.click(screen.getByText('Simpan Status'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Error', 'Terjadi kesalahan sistem'));

    // Cancel form
    await user.click(screen.getByRole('button', { name: /batal/i }));
    expect(screen.queryByText(/atur kehadiran:/i)).not.toBeInTheDocument();
  });

  it('handles "diwakilkan" pimpinan representative type', async () => {
    render(<AgendaPimpinanPage />);
    await waitLoad();
    await user.click(screen.getByRole('button', { name: /list/i }));
    await user.click(screen.getByTestId('icon-eye').parentElement!);
    await user.click(screen.getByText(/edit kehadiran/i));
    const form = await screen.findByText(/atur kehadiran:/i);

    await user.click(screen.getByTestId('btn-status-diwakilkan'));
    await user.click(screen.getByRole('button', { name: /pimpinan lain/i }));

    const select = screen.getByTestId('select-input');
    await user.selectOptions(select, 'J2|P1');

    (agendaApi.updateLeaderAttendance as jest.Mock).mockResolvedValue({ success: true });
    await user.click(screen.getByText('Simpan Status'));
    await waitFor(() => {
      expect(agendaApi.updateLeaderAttendance).toHaveBeenCalledWith(
        'AG1', 'J1', 'P1', 
        expect.objectContaining({ id_jabatan_perwakilan: 'J2', id_periode_perwakilan: 'P1' })
      );
    });
  });

  it('handles initial fetch failure', async () => {
    (pimpinanApi.getActiveAssignments as jest.Mock).mockRejectedValue(new Error('INIT_FAIL'));
    render(<AgendaPimpinanPage />);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal memuat data', 'INIT_FAIL'));
  });

  it('renders representative participation badge correctly', async () => {
    const representativeAgenda = [
      {
        ...mockAgendas[0],
        agendaPimpinans: [],
        slotAgendaPimpinans: [{
          id_jabatan_hadir: 'J1',
          id_periode_hadir: 'P1',
          id_jabatan_diusulkan: 'Jxxx',
          id_periode_diusulkan: 'Pxxx',
          periodeJabatanDiusulkan: { pimpinan: { nama_pimpinan: 'Pimpinan Utama' } }
        }]
      }
    ];
    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({ success: true, data: representativeAgenda });
    
    render(<AgendaPimpinanPage />);
    await waitLoad();
    await user.click(screen.getByRole('button', { name: /list/i }));

    expect(await screen.findByText(/wakil pimpinan utama/i)).toBeInTheDocument();
  });
});
