import { render, screen, waitFor } from '@testing-library/react';
import StafProtokolDashboard from '../../../../app/routes/dashboards/StafProtokolDashboard';
import { dashboardApi } from '../../../../app/lib/api';

// Standardized API Mock
jest.mock('../../../../app/lib/api', () => ({
  authApi: { getMe: jest.fn(), updateProfile: jest.fn(), changePassword: jest.fn(), uploadFoto: jest.fn(), deleteFoto: jest.fn() },
  userApi: { getAll: jest.fn(), getRoles: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  pimpinanApi: { getAll: jest.fn(), getJabatan: jest.fn(), getList: jest.fn(), createOrUpdate: jest.fn(), resendSyncInvitation: jest.fn(), getActiveAssignments: jest.fn() },
  periodeApi: { getAll: jest.fn(), create: jest.fn(), update: jest.fn() },
  ajudanAssignmentApi: { getAll: jest.fn(), create: jest.fn(), delete: jest.fn(), setActive: jest.fn() },
  kaskpdApi: { getAll: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  dashboardApi: { getAdminStats: jest.fn(), getSespriStats: jest.fn(), getStafMediaStats: jest.fn(), getKasubagMediaStats: jest.fn(), getKasubagProtokolStats: jest.fn(), getStafProtokolStats: jest.fn() },
  agendaApi: { getMyAgendas: jest.fn(), getLeaderAgendas: jest.fn(), updateLeaderAttendance: jest.fn() },
}));

jest.mock('react-router', () => ({
  Link: ({ children, to, ...props }: any) => <a href={typeof to === 'string' ? to : '#'} {...props}>{children}</a>,
}));

jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="icon-calendar" />,
  ClipboardList: () => <span data-testid="icon-clipboard" />,
  CheckCircle: () => <span data-testid="icon-checkcircle" />,
  Clock: () => <span data-testid="icon-clock" />,
  AlertCircle: () => <span data-testid="icon-alert" />,
  ArrowRight: () => <span data-testid="icon-arrow" />,
  MapPin: () => <span data-testid="icon-mappin" />,
  Loader2: ({ className }: { className?: string }) => <span data-testid="icon-loader" className={className} />,
}));

jest.mock('../../../../app/components/dashboard/AgendaHariIniList', () => ({
  AgendaHariIniList: ({ agendas, role }: { agendas: unknown[]; role: string }) => (
    <div data-testid="agenda-hari-ini-list">
      agenda-count:{agendas.length}|role:{role}
    </div>
  ),
}));

describe('StafProtokolDashboard Page', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders loading state initially', () => {
    (dashboardApi.getStafProtokolStats as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<StafProtokolDashboard />);
    expect(screen.getByTestId('icon-loader')).toBeInTheDocument();
  });

  it('renders dashboard with fetched data', async () => {
    (dashboardApi.getStafProtokolStats as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        stats: { totalTasks: 11, onProgress: 3, completed: 6, pending: 2 },
        todayAgendas: [{ id: 1 }],
        myTasks: [{
          id: 'T1',
          judul: 'Pendampingan Rapat',
          status: 'Berlangsung',
          penugasan_dari: 'Kasubag Protokol',
          tanggal: '2026-04-21',
          waktu: '09:00 - 10:00',
          lokasi: 'Ruang Utama',
          instruksi: 'Koordinasi kehadiran tamu',
        }],
      },
    });

    render(<StafProtokolDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Staf Protokol/i)).toBeInTheDocument();
    });

    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Pendampingan Rapat')).toBeInTheDocument();
    expect(screen.getByTestId('agenda-hari-ini-list')).toHaveTextContent('agenda-count:1|role:staf_protokol');
  });

  it('renders pending task label and empty state fallback', async () => {
    (dashboardApi.getStafProtokolStats as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        stats: { totalTasks: 1, onProgress: 0, completed: 0, pending: 1 },
        todayAgendas: [],
        myTasks: [{
          id: 'T2',
          judul: 'Siapkan Tempat',
          status: 'pending',
          penugasan_dari: 'Kasubag Protokol',
          tanggal: '2026-04-22',
          waktu: '08:00 - 09:00',
          lokasi: 'Pendopo',
          instruksi: 'Pastikan kursi siap',
        }],
      },
    });

    render(<StafProtokolDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Siapkan Tempat')).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Belum Dimulai/i).length).toBeGreaterThan(1);
  });

  it('handles unsuccessful or failed fetch with zero-state UI', async () => {
    (dashboardApi.getStafProtokolStats as jest.Mock)
      .mockResolvedValueOnce({ success: false, data: null })
      .mockRejectedValueOnce(new Error('network'));

    const firstRender = render(<StafProtokolDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Staf Protokol/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Tidak ada tugas aktif saat ini/i)).toBeInTheDocument();

    firstRender.unmount();
    render(<StafProtokolDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Staf Protokol/i)).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
