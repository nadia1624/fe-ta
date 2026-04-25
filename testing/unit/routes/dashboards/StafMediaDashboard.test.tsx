import { render, screen, waitFor } from '@testing-library/react';
import StafMediaDashboard from '../../../../app/routes/dashboards/StafMediaDashboard';
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
  Calendar: () => <span data-testid="icon-calendar" />,
  FileText: () => <span data-testid="icon-filetext" />,
  CheckCircle: () => <span data-testid="icon-checkcircle" />,
  Clock: () => <span data-testid="icon-clock" />,
  AlertCircle: () => <span data-testid="icon-alertcircle" />,
  ArrowRight: () => <span data-testid="icon-arrowright" />,
  Image: () => <span data-testid="icon-image" />,
  Loader2: ({ className }: { className?: string }) => <span data-testid="icon-loader" className={className} />,
  MapPin: () => <span data-testid="icon-mappin" />,
  PencilLine: () => <span data-testid="icon-pencilline" />,
  CheckCircle2: () => <span data-testid="icon-checkcircle2" />,
}));

jest.mock('../../../../app/components/dashboard/AgendaHariIniList', () => ({
  AgendaHariIniList: ({ agendas, role }: { agendas: unknown[]; role: string }) => (
    <div data-testid="agenda-hari-ini-list">
      agenda-count:{agendas.length}|role:{role}
    </div>
  ),
}));

describe('StafMediaDashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (dashboardApi.getStafMediaStats as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<StafMediaDashboard />);
    expect(screen.getByTestId('icon-loader')).toBeInTheDocument();
  });

  it('renders fetched stats and fallback section texts', async () => {
    (dashboardApi.getStafMediaStats as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        stats: { totalTasks: 12, pendingReview: 2, approved: 8, revisionNeeded: 1 },
        todayAgendas: [{ id: 1 }, { id: 2 }, { id: 3 }],
        myAssignments: [],
        recentDrafts: [],
      },
    });

    render(<StafMediaDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Staf Media/i)).toBeInTheDocument();
    });

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/Tidak ada penugasan hari ini/i)).toBeInTheDocument();
    expect(screen.getByText(/Belum ada draft berita/i)).toBeInTheDocument();
    expect(screen.getByTestId('agenda-hari-ini-list')).toHaveTextContent('agenda-count:3|role:staf_media');
  });

  it('renders assignments, drafts, and status feedback variants', async () => {
    (dashboardApi.getStafMediaStats as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        stats: { totalTasks: 4, pendingReview: 1, approved: 2, revisionNeeded: 1 },
        todayAgendas: [{ id: 1 }],
        myAssignments: [
          {
            id: 't1',
            judul_kegiatan: 'Dokumentasi Rapat',
            pimpinan: 'Walikota',
            waktu: '09:00 - 10:00',
            tempat: 'Ruang Rapat',
          },
        ],
        recentDrafts: [
          {
            id: 'd1',
            judul_draft: 'Draft 1',
            judul_kegiatan: 'Kegiatan 1',
            status: 'draft',
            tanggal_upload: '2026-04-22T10:00:00.000Z',
          },
          {
            id: 'd2',
            judul_draft: 'Draft 2',
            judul_kegiatan: 'Kegiatan 2',
            status: 'published',
            tanggal_upload: '2026-04-22T10:00:00.000Z',
            feedback: 'Sudah baik',
          },
          {
            id: 'd3',
            judul_draft: 'Draft 3',
            judul_kegiatan: 'Kegiatan 3',
            status: 'revision',
            tanggal_upload: '2026-04-22T10:00:00.000Z',
            feedback: 'Perlu revisi lead',
          },
          {
            id: 'd4',
            judul_draft: 'Draft 4',
            judul_kegiatan: 'Kegiatan 4',
            status: 'archived',
            tanggal_upload: '2026-04-22T10:00:00.000Z',
          },
        ],
      },
    });

    render(<StafMediaDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Staf Media/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Dokumentasi Rapat/i)).toBeInTheDocument();
    expect(screen.getByText(/Walikota/i)).toBeInTheDocument();
    expect(screen.getByText(/Ruang Rapat/i)).toBeInTheDocument();
    expect(screen.getByText(/Draft 1/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Pending Review/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Disetujui/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Perlu Revisi/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/archived/i)).toBeInTheDocument();
    expect(screen.getByText(/Sudah baik/i)).toBeInTheDocument();
    expect(screen.getByText(/Perlu revisi lead/i)).toBeInTheDocument();
  });

  it('handles unsuccessful response by showing zeroed stats and empty states', async () => {
    (dashboardApi.getStafMediaStats as jest.Mock).mockResolvedValue({
      success: false,
      data: null,
    });

    render(<StafMediaDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Staf Media/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    expect(screen.getByText(/Tidak ada penugasan hari ini/i)).toBeInTheDocument();
    expect(screen.getByText(/Belum ada draft berita/i)).toBeInTheDocument();
  });

  it('handles fetch failure gracefully', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    (dashboardApi.getStafMediaStats as jest.Mock).mockRejectedValue(new Error('network'));

    render(<StafMediaDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Staf Media/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Tidak ada penugasan hari ini/i)).toBeInTheDocument();
    errorSpy.mockRestore();
  });
});
