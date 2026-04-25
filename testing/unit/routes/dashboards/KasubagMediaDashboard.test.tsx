import { render, screen, waitFor } from '@testing-library/react';
import KasubagMediaDashboard from '../../../../app/routes/dashboards/KasubagMediaDashboard';
import { dashboardApi } from '../../../../app/lib/api';

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

jest.mock('lucide-react', () => ({
  Users: () => <span data-testid="icon-users" />,
  Newspaper: () => <span data-testid="icon-newspaper" />,
  CheckCircle: () => <span data-testid="icon-checkcircle" />,
  Clock: () => <span data-testid="icon-clock" />,
  Calendar: () => <span data-testid="icon-calendar" />,
  ArrowRight: () => <span data-testid="icon-arrowright" />,
}));

jest.mock('../../../../app/components/dashboard/AgendaHariIniList', () => ({
  AgendaHariIniList: ({ agendas, role }: { agendas: unknown[]; role: string }) => (
    <div data-testid="agenda-hari-ini-list">
      agenda-count:{agendas.length}|role:{role}
    </div>
  ),
}));

describe('KasubagMediaDashboard Page', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders loading state initially', () => {
    (dashboardApi.getKasubagMediaStats as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<KasubagMediaDashboard />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders fetched data in stats and sections', async () => {
    (dashboardApi.getKasubagMediaStats as jest.Mock).mockResolvedValue({
      data: {
        stats: {
          totalStaff: 6,
          reviewDraftsCount: 4,
          approvedDraftsCount: 15,
          activeAssignments: 3,
        },
        todayAgendas: [{ id: 1 }],
        workload: [{ nama: 'Staf A', tugas: 2 }],
        draftPerluReview: [
          {
            id_draft_berita: 99,
            judul_berita: 'Draft Berita Test',
            staff: { nama: 'Staf A' },
            tanggal_kirim: '2026-04-21T10:00:00.000Z',
          },
        ],
        perluPenugasan: [{ id: 1, kegiatan: 'Liputan Kegiatan', tanggal: '2026-04-25' }],
      },
    });

    render(<KasubagMediaDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Kasubag Media Dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Staf A')).toBeInTheDocument();
    expect(screen.getByText('Draft Berita Test')).toBeInTheDocument();
    expect(screen.getByText('Liputan Kegiatan')).toBeInTheDocument();
    expect(screen.getByTestId('agenda-hari-ini-list')).toHaveTextContent('agenda-count:1|role:kasubag_media');
  });

  it('renders default empty state when api returns no data payload', async () => {
    (dashboardApi.getKasubagMediaStats as jest.Mock).mockResolvedValue({ data: null });

    render(<KasubagMediaDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Kasubag Media Dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText('0').length).toBeGreaterThan(1);
    expect(screen.getByText(/Belum ada data penugasan/i)).toBeInTheDocument();
    expect(screen.getByText(/Tidak ada draft perlu review/i)).toBeInTheDocument();
    expect(screen.getByText(/Semua agenda sudah ditugaskan/i)).toBeInTheDocument();
  });

  it('handles thrown fetch errors and still leaves the page usable', async () => {
    (dashboardApi.getKasubagMediaStats as jest.Mock).mockRejectedValue(new Error('boom'));

    render(<KasubagMediaDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Kasubag Media Dashboard/i)).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(screen.getByText(/Tidak ada draft perlu review/i)).toBeInTheDocument();
  });
});
