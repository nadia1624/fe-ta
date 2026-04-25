import { render, screen, waitFor } from '@testing-library/react';
import PemohonDashboard from '../../../../app/routes/dashboards/PemohonDashboard';
import { agendaApi } from '../../../../app/lib/api';

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
  FileText: () => <span data-testid="icon-filetext" />,
  Clock: () => <span data-testid="icon-clock" />,
  CheckCircle: () => <span data-testid="icon-checkcircle" />,
  XCircle: () => <span data-testid="icon-xcircle" />,
  PlusCircle: () => <span data-testid="icon-pluscircle" />,
  Eye: () => <span data-testid="icon-eye" />,
  Loader2: ({ className }: { className?: string }) => <span data-testid="icon-loader" className={className} />,
  RotateCcw: () => <span data-testid="icon-rotate" />,
  Edit3: () => <span data-testid="icon-edit3" />,
  ClipboardList: () => <span data-testid="icon-clipboard" />,
}));

describe('PemohonDashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (agendaApi.getMyAgendas as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<PemohonDashboard />);
    expect(screen.getByText(/Memuat dashboard/i)).toBeInTheDocument();
    expect(screen.getByTestId('icon-loader')).toBeInTheDocument();
  });

  it('renders stats and request sections from fetched agendas', async () => {
    (agendaApi.getMyAgendas as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        {
          id_agenda: 'A1',
          nomor_surat: '001/PEM/2026',
          perihal: 'Permohonan Audiensi',
          nama_kegiatan: 'Audiensi',
          tanggal_kegiatan: '2099-01-01',
          waktu_mulai: '09:00:00',
          waktu_selesai: '10:00:00',
          lokasi_kegiatan: 'Kantor',
          statusAgendas: [{ status_agenda: 'pending', createdAt: '2026-04-21T10:00:00.000Z' }],
        },
        {
          id_agenda: 'A2',
          nomor_surat: '002/PEM/2026',
          perihal: 'Permohonan Kunjungan',
          nama_kegiatan: 'Kunjungan',
          tanggal_kegiatan: '2099-02-01',
          waktu_mulai: '13:00:00',
          waktu_selesai: '14:00:00',
          lokasi_kegiatan: 'Balai Kota',
          statusAgendas: [{ status_agenda: 'approved_sespri', createdAt: '2026-04-22T10:00:00.000Z' }],
        },
      ],
    });

    render(<PemohonDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Pemohon Dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Total Permohonan/i)).toBeInTheDocument();
    expect(screen.getByText('001/PEM/2026')).toBeInTheDocument();
    expect(screen.getByText('002/PEM/2026')).toBeInTheDocument();
    expect(screen.getByText(/Agenda yang Disetujui/i)).toBeInTheDocument();
  });

  it('renders all status variants, latest status ordering, and approved agenda section', async () => {
    (agendaApi.getMyAgendas as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        {
          id_agenda: 'A1',
          nomor_surat: '001/PEM/2026',
          perihal: 'Pending terbaru',
          statusAgendas: [
            { status_agenda: 'revision', createdAt: '2026-04-20T10:00:00.000Z', catatan: 'Revisi lama' },
            { status_agenda: 'pending', createdAt: '2026-04-21T10:00:00.000Z' },
          ],
        },
        {
          id_agenda: 'A3',
          nomor_surat: '003/PEM/2026',
          perihal: 'Disetujui sespri',
          nama_kegiatan: 'Audiensi',
          tanggal_kegiatan: '2099-01-01',
          waktu_mulai: '09:00:00',
          waktu_selesai: '10:00:00',
          lokasi_kegiatan: 'Kantor',
          statusAgendas: [
            { status_agenda: 'approved_sespri', createdAt: '2026-04-22T11:00:00.000Z' },
          ],
        },
        {
          id_agenda: 'A4',
          nomor_surat: '004/PEM/2026',
          perihal: 'Disetujui ajudan',
          nama_kegiatan: 'Kunjungan',
          tanggal_kegiatan: '2099-02-01',
          waktu_mulai: '13:00:00',
          waktu_selesai: '14:00:00',
          lokasi_kegiatan: 'Balai Kota',
          statusAgendas: [
            { status_agenda: 'approved_ajudan', createdAt: '2026-04-22T12:00:00.000Z' },
          ],
        },
        {
          id_agenda: 'A2',
          nomor_surat: '002/PEM/2026',
          perihal: 'Revisi dokumen',
          statusAgendas: [
            { status_agenda: 'revision', createdAt: '2026-04-22T10:00:00.000Z', catatan: 'Lengkapi lampiran' },
          ],
        },
        {
          id_agenda: 'A5',
          nomor_surat: '005/PEM/2026',
          perihal: 'Ditolak sespri',
          statusAgendas: [
            { status_agenda: 'rejected_sespri', createdAt: '2026-04-22T12:00:00.000Z', catatan: 'Tidak sesuai jadwal' },
          ],
        },
        {
          id_agenda: 'A6',
          nomor_surat: '006/PEM/2026',
          perihal: 'Delegated',
          statusAgendas: [
            { status_agenda: 'delegated', createdAt: '2026-04-22T12:00:00.000Z' },
          ],
        },
        {
          id_agenda: 'A7',
          nomor_surat: '007/PEM/2026',
          perihal: 'Canceled',
          statusAgendas: [
            { status_agenda: 'canceled', createdAt: '2026-04-22T12:00:00.000Z' },
          ],
        },
        {
          id_agenda: 'A8',
          nomor_surat: '008/PEM/2026',
          perihal: 'Completed',
          nama_kegiatan: 'Penutupan',
          tanggal_kegiatan: '2099-03-01',
          waktu_mulai: '15:00:00',
          waktu_selesai: '16:00:00',
          lokasi_kegiatan: 'Aula',
          statusAgendas: [
            { status_agenda: 'completed', createdAt: '2026-04-22T12:00:00.000Z' },
          ],
        },
      ],
    });

    render(<PemohonDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Pemohon Dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pending/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Approved by Sespri/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Approved by Ajudan/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Audiensi/)).toBeInTheDocument();
    expect(screen.getByText(/Kunjungan/)).toBeInTheDocument();
    expect(screen.getByText(/Penutupan/)).toBeInTheDocument();
  });

  it('renders revision and rejection messages when those statuses appear in recent requests', async () => {
    (agendaApi.getMyAgendas as jest.Mock).mockResolvedValue({
      success: true,
      data: [
        {
          id_agenda: 'R1',
          nomor_surat: '100/PEM/2026',
          perihal: 'Revisi dokumen',
          statusAgendas: [
            { status_agenda: 'revision', createdAt: '2026-04-22T10:00:00.000Z', catatan: 'Lengkapi lampiran' },
          ],
        },
        {
          id_agenda: 'R2',
          nomor_surat: '101/PEM/2026',
          perihal: 'Penolakan',
          statusAgendas: [
            { status_agenda: 'rejected_sespri', createdAt: '2026-04-22T10:00:00.000Z', catatan: 'Tidak sesuai jadwal' },
          ],
        },
        {
          id_agenda: 'R3',
          nomor_surat: '102/PEM/2026',
          perihal: 'Delegasi',
          statusAgendas: [
            { status_agenda: 'delegated', createdAt: '2026-04-22T10:00:00.000Z' },
          ],
        },
      ],
    });

    render(<PemohonDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Pemohon Dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Revision/)).toBeInTheDocument();
    expect(screen.getByText(/Rejected by Sespri/)).toBeInTheDocument();
    expect(screen.getByText(/Delegated/)).toBeInTheDocument();
    expect(screen.getByText(/Lengkapi lampiran/)).toBeInTheDocument();
    expect(screen.getByText(/Tidak sesuai jadwal/)).toBeInTheDocument();
  });

  it('renders empty states when no agendas are available', async () => {
    (agendaApi.getMyAgendas as jest.Mock).mockResolvedValue({ success: true, data: [] });

    render(<PemohonDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Pemohon Dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Belum ada permohonan/i)).toBeInTheDocument();
    expect(screen.getByText(/Belum ada agenda disetujui/i)).toBeInTheDocument();
    expect(screen.getByText(/Ajukan Permohonan Baru/i)).toBeInTheDocument();
  });

  it('handles fetch failure gracefully', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    (agendaApi.getMyAgendas as jest.Mock).mockRejectedValue(new Error('network'));

    render(<PemohonDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Pemohon Dashboard/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Belum ada permohonan/i)).toBeInTheDocument();
    errorSpy.mockRestore();
  });
});
