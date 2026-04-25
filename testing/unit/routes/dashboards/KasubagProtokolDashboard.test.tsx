import { render, screen, waitFor } from '@testing-library/react';
import KasubagProtokolDashboard from '../../../../app/routes/dashboards/KasubagProtokolDashboard';
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
  Users: () => <span data-testid="icon-users" />,
  ClipboardList: () => <span data-testid="icon-clipboard" />,
  CheckCircle: () => <span data-testid="icon-checkcircle" />,
  Clock: () => <span data-testid="icon-clock" />,
  Calendar: () => <span data-testid="icon-calendar" />,
  TrendingUp: () => <span data-testid="icon-trending" />,
  AlertCircle: () => <span data-testid="icon-alert" />,
  ArrowRight: () => <span data-testid="icon-arrow" />,
}));

jest.mock('../../../../app/components/dashboard/AgendaHariIniList', () => ({
  AgendaHariIniList: ({ agendas, role }: { agendas: unknown[]; role: string }) => (
    <div data-testid="agenda-hari-ini-list">
      agenda-count:{agendas.length}|role:{role}
    </div>
  ),
}));

describe('KasubagProtokolDashboard Page', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders loading state initially', () => {
    (dashboardApi.getKasubagProtokolStats as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<KasubagProtokolDashboard />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders fetched dashboard data', async () => {
    (dashboardApi.getKasubagProtokolStats as jest.Mock).mockResolvedValue({
      data: {
        stats: { totalStaff: 7, activeAssignments: 4, completedAssignments: 10, onProgressAssignments: 3 },
        todayAgendas: [{ id: 1 }, { id: 2 }],
        workload: [{ nama: 'Staf Protokol A', tugas: 2 }],
        perluPenugasan: [{ id: 1, kegiatan: 'Pendampingan Acara', perihal: 'Mendampingi pimpinan', tanggal: '2026-04-25' }],
      },
    });

    render(<KasubagProtokolDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Kasubag Protokol/i)).toBeInTheDocument();
    });

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Staf Protokol A')).toBeInTheDocument();
    expect(screen.getByText('Pendampingan Acara')).toBeInTheDocument();
    expect(screen.getByTestId('agenda-hari-ini-list')).toHaveTextContent('agenda-count:2|role:kasubag_protokol');
  });

  it('renders empty defaults when api returns no data payload', async () => {
    (dashboardApi.getKasubagProtokolStats as jest.Mock).mockResolvedValue({ data: null });

    render(<KasubagProtokolDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Kasubag Protokol/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText('0').length).toBeGreaterThan(1);
    expect(screen.getByText(/Belum ada data penugasan/i)).toBeInTheDocument();
    expect(screen.getByText(/Semua agenda sudah ditugaskan/i)).toBeInTheDocument();
  });

  it('handles thrown fetch errors gracefully', async () => {
    (dashboardApi.getKasubagProtokolStats as jest.Mock).mockRejectedValue(new Error('boom'));

    render(<KasubagProtokolDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Kasubag Protokol/i)).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(screen.getByText(/Semua agenda sudah ditugaskan/i)).toBeInTheDocument();
  });
});
