import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MonitorPenugasanMediaPage from '../../../../app/routes/kasubag-media/MonitorPenugasanMediaPage';
import { penugasanApi } from '../../../../app/lib/api';

const mockNavigate = jest.fn();

jest.mock('../../../../app/lib/api', () => ({
  penugasanApi: { getMyPenugasan: jest.fn() },
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Link: ({ children, to, ...props }: any) => <a href={to || '#'} {...props}>{children}</a>,
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../../app/components/ui/CustomSelect', () => {
  return function MockCustomSelect({ value, onChange, options, placeholder }: any) {
    return (
      <select aria-label={placeholder || 'status-filter'} value={value} onChange={(e) => onChange(e.target.value)}>
        {options?.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    );
  };
});

jest.mock('lucide-react', () => ({
  Search: () => <span />,
  Loader2: () => <span data-testid="icon-loader" />,
  AlertCircle: () => <span />,
  Calendar: () => <span />,
  User: () => <span />,
  Clock: () => <span />,
  MapPin: () => <span />,
  ChevronLeft: () => <span />,
  ChevronRight: () => <span />,
  Filter: () => <span />,
  ClipboardList: () => <span />,
  Users: () => <span />,
  MoreVertical: () => <span />,
  CheckCircle: () => <span />,
  Clock3: () => <span />,
  Eye: () => <span />,
  FileEdit: () => <span />,
  TrendingUp: () => <span />,
  Newspaper: () => <span />,
  FileText: () => <span />,
  RotateCcw: () => <span />,
  Check: () => <span />,
  ChevronDown: () => <span />,
}));

const mockPenugasan = [
  {
    id_penugasan: 'P1',
    nama_staf: ['Staf A'],
    status: 'progress',
    status_pelaksanaan: 'Berlangsung',
    agenda: {
      nama_kegiatan: 'Agenda A',
      tanggal_kegiatan: '2026-04-21T00:00:00.000Z',
      waktu_mulai: '10:00',
      waktu_selesai: '12:00',
      lokasi_kegiatan: 'Lokasi A'
    },
    pimpinans: [{ nama_pimpinan: 'Pimpinan A' }],
    laporanKegiatans: [],
    // status_draft 'draft' → displayStatus = 'Berlangsung'
    draftBeritas: [{ status_draft: 'draft' }]
  },
  {
    id_penugasan: 'P2',
    nama_staf: ['Staf B'],
    status: 'selesai',
    status_pelaksanaan: 'Selesai',
    agenda: {
      nama_kegiatan: 'Agenda B',
      tanggal_kegiatan: '2026-04-20T00:00:00.000Z',
      waktu_mulai: '08:00',
      waktu_selesai: '09:00',
      lokasi_kegiatan: 'Lokasi B'
    },
    pimpinans: [],
    laporanKegiatans: [{ id_laporan: 'L1' }],
    // status_draft 'approved' → displayStatus = 'Selesai'
    draftBeritas: [{ status_draft: 'approved' }]
  }
];

describe('MonitorPenugasanMediaPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const waitForLoadingFinished = async () => {
    await waitFor(() => expect(screen.queryByTestId('icon-loader')).not.toBeInTheDocument());
  };

  it('renders loading state', () => {
    (penugasanApi.getMyPenugasan as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<MonitorPenugasanMediaPage />);
    expect(screen.getByTestId('icon-loader')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    (penugasanApi.getMyPenugasan as jest.Mock).mockResolvedValue({ success: false, message: 'API Error' });
    render(<MonitorPenugasanMediaPage />);
    await waitFor(() => expect(screen.getByText('API Error')).toBeInTheDocument());
  });

  it('renders exception state and reload', async () => {
    (penugasanApi.getMyPenugasan as jest.Mock).mockRejectedValue(new Error('Fail'));
    render(<MonitorPenugasanMediaPage />);
    await waitFor(() => expect(screen.getByText('Terjadi kesalahan saat menghubungi server')).toBeInTheDocument());

    const reloadBtn = screen.getByText('Coba Lagi');
    expect(reloadBtn).toBeInTheDocument();
  });

  it('filters and searches penugasan', async () => {
    (penugasanApi.getMyPenugasan as jest.Mock).mockResolvedValue({ success: true, data: mockPenugasan });
    render(<MonitorPenugasanMediaPage />);
    await waitForLoadingFinished();

    // Keduanya tampil di awal
    await waitFor(() => {
      expect(screen.getByText('Agenda A')).toBeInTheDocument();
      expect(screen.getByText('Agenda B')).toBeInTheDocument();
    });

    // --- Search: ketik "Agenda A" → hanya Agenda A tampil ---
    fireEvent.change(screen.getByPlaceholderText(/Cari penugasan/i), { target: { value: 'Agenda A' } });
    await waitFor(() => {
      expect(screen.getByText('Agenda A')).toBeInTheDocument();
      expect(screen.queryByText('Agenda B')).not.toBeInTheDocument();
    });

    // --- Clear search dulu sebelum filter status ---
    fireEvent.change(screen.getByPlaceholderText(/Cari penugasan/i), { target: { value: '' } });
    await waitFor(() => {
      expect(screen.getByText('Agenda A')).toBeInTheDocument();
      expect(screen.getByText('Agenda B')).toBeInTheDocument();
    });

    // --- Filter Status: pilih "Selesai" → hanya Agenda B tampil ---
    fireEvent.change(screen.getByLabelText('Pilih Status'), { target: { value: 'Selesai' } });
    await waitFor(() => {
      expect(screen.queryByText('Agenda A')).not.toBeInTheDocument();
      expect(screen.getByText('Agenda B')).toBeInTheDocument();
    });

    // --- Reset filter → keduanya tampil lagi ---
    fireEvent.change(screen.getByLabelText('Pilih Status'), { target: { value: 'all' } });
    await waitFor(() => {
      expect(screen.getByText('Agenda A')).toBeInTheDocument();
      expect(screen.getByText('Agenda B')).toBeInTheDocument();
    });
  });

  it('handles empty state', async () => {
    (penugasanApi.getMyPenugasan as jest.Mock).mockResolvedValue({ success: true, data: [] });
    render(<MonitorPenugasanMediaPage />);
    await waitFor(() => expect(screen.getByText(/Tidak ada penugasan media ditemukan/i)).toBeInTheDocument());
  });

  it('covers missing agenda and pimpinan branches', async () => {
    (penugasanApi.getMyPenugasan as jest.Mock).mockResolvedValue({ success: true, data: [
        { ...mockPenugasan[0], agenda: null, pimpinans: [] }
    ] });
    render(<MonitorPenugasanMediaPage />);
    await waitFor(() => expect(screen.queryByTestId('icon-loader')).not.toBeInTheDocument());
    expect(screen.getAllByText('-')[0]).toBeInTheDocument();
  });
});