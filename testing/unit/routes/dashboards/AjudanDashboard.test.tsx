import { render, screen, waitFor } from '@testing-library/react';
import AjudanDashboard from '../../../../app/routes/dashboards/AjudanDashboard';
import { agendaApi, pimpinanApi } from '../../../../app/lib/api';
import { isAgendaPast } from '../../../../app/lib/dateUtils';

// Standardized API Mock
jest.mock('../../../../app/lib/api', () => ({
  authApi: { getMe: jest.fn(), updateProfile: jest.fn(), changePassword: jest.fn(), uploadFoto: jest.fn(), deleteFoto: jest.fn() },
  userApi: { getAll: jest.fn(), getRoles: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  pimpinanApi: { getAll: jest.fn(), getJabatan: jest.fn(), getList: jest.fn(), createOrUpdate: jest.fn(), resendSyncInvitation: jest.fn(), getActiveAssignments: jest.fn() },
  periodeApi: { getAll: jest.fn(), create: jest.fn(), update: jest.fn() },
  ajudanAssignmentApi: { getAll: jest.fn(), create: jest.fn(), delete: jest.fn(), setActive: jest.fn() },
  kaskpdApi: { getAll: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  dashboardApi: { getAdminStats: jest.fn(), getSespriStats: jest.fn(), getStafMediaStats: jest.fn(), getKasubagMediaStats: jest.fn() },
  agendaApi: { getLeaderAgendas: jest.fn(), updateLeaderAttendance: jest.fn() },
}));

jest.mock('react-router', () => ({
  Link: ({ children, to, ...props }: any) => <a href={typeof to === 'string' ? to : '#'} {...props}>{children}</a>,
}));

jest.mock('../../../../app/lib/dateUtils', () => ({
  isAgendaPast: jest.fn(() => false),
}));

jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="icon-calendar" />,
  CheckCircle: () => <span data-testid="icon-checkcircle" />,
  Clock: () => <span data-testid="icon-clock" />,
  XCircle: () => <span data-testid="icon-xcircle" />,
  RefreshCw: ({ className }: { className?: string }) => <span data-testid="icon-refresh" className={className} />,
  UserCheck: () => <span data-testid="icon-usercheck" />,
}));

describe('AjudanDashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-04-22T08:00:00Z'));
    (isAgendaPast as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders loading state initially', () => {
    (pimpinanApi.getActiveAssignments as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<AjudanDashboard />);
    expect(screen.getByTestId('icon-refresh')).toBeInTheDocument();
  });

  it('renders empty state sections after successful fetch with no agendas', async () => {
    (pimpinanApi.getActiveAssignments as jest.Mock).mockResolvedValue({ success: true, data: [] });
    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({ success: true, data: [] });

    render(<AjudanDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Ajudan Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText(/Tidak ada agenda yang perlu dikonfirmasi saat ini/i)).toBeInTheDocument();
    expect(screen.getByText(/Tidak ada agenda untuk hari ini/i)).toBeInTheDocument();
    expect(screen.getByText(/Tidak ada agenda mendatang dalam jadwal/i)).toBeInTheDocument();
    expect(pimpinanApi.getActiveAssignments).toHaveBeenCalledTimes(1);
    expect(agendaApi.getLeaderAgendas).toHaveBeenCalledTimes(1);
  });

  it('renders filtered stats and sections for invited, representative, absent, and upcoming agendas', async () => {
    (pimpinanApi.getActiveAssignments as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        {
          id_jabatan: 'J1',
          id_periode: 'P1',
          pimpinan: { nama_pimpinan: 'Pimpinan A' },
        },
      ],
    });

    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        {
          id_agenda: 'today-pending',
          nama_kegiatan: 'Agenda Pending Hari Ini',
          lokasi_kegiatan: 'Gedung A',
          tanggal_kegiatan: '2026-04-22',
          waktu_mulai: '09:00:00',
          waktu_selesai: '10:00:00',
          statusAgendas: [{ status_agenda: 'approved_sespri' }],
          agendaPimpinans: [{ id_jabatan: 'J1', id_periode: 'P1', status_kehadiran: 'pending' }],
          slotAgendaPimpinans: [],
        },
        {
          id_agenda: 'today-representative',
          nama_kegiatan: 'Agenda Diwakili Hari Ini',
          lokasi_kegiatan: 'Gedung B',
          tanggal_kegiatan: '2026-04-22',
          waktu_mulai: '13:00:00',
          waktu_selesai: '14:00:00',
          statusAgendas: [{ status_agenda: 'delegated' }],
          agendaPimpinans: [],
          slotAgendaPimpinans: [
            {
              id_jabatan_hadir: 'J1',
              id_periode_hadir: 'P1',
              id_jabatan_diusulkan: 'J2',
              periodeJabatanDiusulkan: { pimpinan: { nama_pimpinan: 'Pimpinan B' } },
            },
          ],
        },
        {
          id_agenda: 'upcoming-confirmed',
          nama_kegiatan: 'Agenda Besok',
          lokasi_kegiatan: 'Gedung C',
          tanggal_kegiatan: '2026-04-23',
          waktu_mulai: '10:00:00',
          waktu_selesai: '11:00:00',
          statusAgendas: [{ status_agenda: 'approved_ajudan' }],
          agendaPimpinans: [{ id_jabatan: 'J1', id_periode: 'P1', status_kehadiran: 'hadir' }],
          slotAgendaPimpinans: [],
        },
        {
          id_agenda: 'absent',
          nama_kegiatan: 'Agenda Ditolak',
          lokasi_kegiatan: 'Gedung D',
          tanggal_kegiatan: '2026-04-24',
          waktu_mulai: '10:00:00',
          waktu_selesai: '11:00:00',
          statusAgendas: [{ status_agenda: 'completed' }],
          agendaPimpinans: [{ id_jabatan: 'J1', id_periode: 'P1', status_kehadiran: 'tidak_hadir' }],
          slotAgendaPimpinans: [],
        },
        {
          id_agenda: 'ignored',
          nama_kegiatan: 'Agenda Belum Approve',
          lokasi_kegiatan: 'Gedung E',
          tanggal_kegiatan: '2026-04-25',
          waktu_mulai: '08:00:00',
          waktu_selesai: '09:00:00',
          statusAgendas: [{ status_agenda: 'draft' }],
          agendaPimpinans: [{ id_jabatan: 'J1', id_periode: 'P1', status_kehadiran: 'pending' }],
          slotAgendaPimpinans: [],
        },
      ],
    });

    render(<AjudanDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Ajudan Dashboard')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Perlu Konfirmasi').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Agenda Terkonfirmasi').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Agenda Bulan Ini').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tidak Hadir').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    expect(screen.getByText(/Agenda Pending Hari Ini/)).toBeInTheDocument();
    expect(screen.getByText(/Agenda Diwakili Hari Ini/)).toBeInTheDocument();
    expect(screen.getByText(/Agenda Besok/)).toBeInTheDocument();
    expect(screen.getAllByText(/Besok/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pimpinan A/).length).toBeGreaterThan(0);
    expect(screen.getByText(/\(Wakil Pimpinan B\)/)).toBeInTheDocument();
    expect(screen.queryByText(/Agenda Belum Approve/)).not.toBeInTheDocument();
  });

  it('shows past-agenda note instead of action button when agenda has ended', async () => {
    (isAgendaPast as jest.Mock).mockReturnValue(true);
    (pimpinanApi.getActiveAssignments as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        {
          id_jabatan: 'J1',
          id_periode: 'P1',
          pimpinan: { nama_pimpinan: 'Pimpinan A' },
        },
      ],
    });
    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        {
          id_agenda: 'past-pending',
          nama_kegiatan: 'Agenda Lampau',
          lokasi_kegiatan: 'Ruang Rapat',
          tanggal_kegiatan: '2026-04-22',
          waktu_mulai: '07:00:00',
          waktu_selesai: '08:00:00',
          statusAgendas: [{ status_agenda: 'approved_sespri' }],
          agendaPimpinans: [{ id_jabatan: 'J1', id_periode: 'P1', status_kehadiran: 'pending' }],
          slotAgendaPimpinans: [],
        },
      ],
    });

    render(<AjudanDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Agenda Selesai')).toBeInTheDocument();
    });

    expect(screen.queryByText('Tentukan Kehadiran')).not.toBeInTheDocument();
  });

  it('handles failed dashboard fetch gracefully', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    (pimpinanApi.getActiveAssignments as jest.Mock).mockRejectedValue(new Error('boom'));

    render(<AjudanDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Ajudan Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText(/Tidak ada agenda yang perlu dikonfirmasi saat ini/i)).toBeInTheDocument();
    errorSpy.mockRestore();
  });
});
