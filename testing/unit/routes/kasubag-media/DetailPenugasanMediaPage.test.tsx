import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import DetailPenugasanMediaPage from '../../../../app/routes/kasubag-media/DetailPenugasanMediaPage';
import { penugasanApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';

const mockNavigate = jest.fn();

jest.mock('../../../../app/lib/api', () => ({
  penugasanApi: { 
    getPenugasanDetail: jest.fn(), 
    updateStatusPenugasan: jest.fn() 
  },
}));

jest.mock('../../../../app/lib/swal', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    confirm: jest.fn().mockResolvedValue({ isConfirmed: false }),
  },
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({ id: 'P1' }),
  useNavigate: () => mockNavigate,
  Link: ({ children, to, ...props }: any) => <a href={to || '#'} {...props}>{children}</a>,
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <span />,
  CheckCircle: () => <span />,
  ClipboardList: () => <span />,
  Calendar: () => <span />,
  MapPin: () => <span />,
  Clock: () => <span />,
  User: () => <span />,
  Loader2: () => <span data-testid="icon-loader" />,
  AlertCircle: () => <span />,
  Users: () => <span />,
  FileText: () => <span />,
  TrendingUp: () => <span />,
  Newspaper: () => <span />,
  ExternalLink: () => <span />,
  RotateCcw: () => <span />,
}));

const mockData = {
  id_penugasan: 'P1',
  jenis_penugasan: 'Media',
  deskripsi_penugasan: 'Deskripsi media',
  tanggal_penugasan: '2099-01-01',
  status: 'progress',
  status_pelaksanaan: 'Progress',
  nama_staf: ['Staf A'],
  pimpinans: [{ nama_pimpinan: 'Pimpinan A', nama_jabatan: 'Walikota' }],
  agenda: {
    id_agenda: 'A1',
    nama_kegiatan: 'Agenda Media Detail',
    tanggal_kegiatan: '2099-01-01',
    waktu_mulai: '08:00:00',
    waktu_selesai: '09:00:00',
    lokasi_kegiatan: 'Lokasi',
    contact_person: '123',
    keterangan: 'Notes',
    kaskpdPendampings: [{ kaskpd: { nama_instansi: 'Instansi X' } }]
  },
  laporanKegiatans: [{ id_laporan: 'L1' }],
  draftBeritas: [
    {
      id_draft_berita: 'D1',
      judul_berita: 'Draft 1',
      isi_draft: '<p>Isi Draft</p>',
      status_draft: 'draft',
      tanggal_kirim: '2099-01-01',
      dokumentasis: [
        { id_dokumentasi: 'DOC1', file_path: 'image.jpg' },
        { id_dokumentasi: 'DOC2', file_path: 'file.pdf' }
      ],
      revisies: [
        { id_revisi: 'R1', catatan_revisi: 'Revisi 1', tanggal_revisi: '2099-01-01T10:00:00Z' }
      ]
    }
  ],
};

describe('DetailPenugasanMediaPage', () => {
  const originalOpen = window.open;

  beforeEach(() => {
    jest.clearAllMocks();
    window.open = jest.fn();
  });

  afterAll(() => {
    window.open = originalOpen;
  });

  const waitForLoadingFinished = async () => {
    await waitFor(() => expect(screen.queryByTestId('icon-loader')).not.toBeInTheDocument());
  };

  it('renders loading state', () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<DetailPenugasanMediaPage />);
    expect(screen.getByTestId('icon-loader')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockRejectedValue(new Error('Fail'));
    render(<DetailPenugasanMediaPage />);
    await waitFor(() => expect(screen.getByText('Terjadi kesalahan saat menghubungi server')).toBeInTheDocument());
    
    fireEvent.click(screen.getByText('Kembali'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders success state and handles status changes', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ success: true, data: mockData });
    render(<DetailPenugasanMediaPage />);
    
    await waitForLoadingFinished();
    expect(screen.getByText('Detail Penugasan Media')).toBeInTheDocument();
    expect(screen.getByText('Berlangsung')).toBeInTheDocument();
    
    // Test Tandai Selesai - Cancel
    const finishBtn = screen.getByText('Tandai Selesai');
    fireEvent.click(finishBtn);
    expect(toast.confirm).toHaveBeenCalled();
    expect(penugasanApi.updateStatusPenugasan).not.toHaveBeenCalled();

    // Test Tandai Selesai - Confirm Success
    (toast.confirm as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });
    (penugasanApi.updateStatusPenugasan as jest.Mock).mockResolvedValueOnce({ success: true });
    fireEvent.click(finishBtn);
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(screen.getByText('Selesai')).toBeInTheDocument();
  });

  it('handles Tandai Selesai errors', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ success: true, data: mockData });
    render(<DetailPenugasanMediaPage />);
    await waitForLoadingFinished();

    const finishBtn = screen.getByText('Tandai Selesai');
    (toast.confirm as jest.Mock).mockResolvedValue({ isConfirmed: true });
    
    // Case 1: success false
    (penugasanApi.updateStatusPenugasan as jest.Mock).mockResolvedValueOnce({ success: false, message: 'Failed' });
    fireEvent.click(finishBtn);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal', 'Failed'));

    // Case 2: Reject
    (penugasanApi.updateStatusPenugasan as jest.Mock).mockRejectedValueOnce(new Error('Fail'));
    fireEvent.click(finishBtn);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Error', expect.any(String)));
  });

  it('handles draft status mapping and riwayat revisions', async () => {
    const dataWithRevisions = {
        ...mockData,
        draftBeritas: [
            {
                ...mockData.draftBeritas[0],
                status_draft: 'review',
                revisies: [
                    { id_revisi: 'R1', catatan_revisi: 'Old', tanggal_revisi: '2020-01-01T00:00:00Z' },
                    { id_revisi: 'R2', catatan_revisi: 'New', tanggal_revisi: '2020-01-02T00:00:00Z' }
                ]
            }
        ]
    };
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ success: true, data: dataWithRevisions });
    render(<DetailPenugasanMediaPage />);
    await waitForLoadingFinished();

    expect(screen.getByText('Perlu Revisi')).toBeInTheDocument();
    expect(screen.getByText(/New/i)).toBeInTheDocument();
    expect(screen.getByText(/\(Terbaru\)/i)).toBeInTheDocument();
  });

  it('handles documentation interactions', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ success: true, data: mockData });
    render(<DetailPenugasanMediaPage />);
    await waitForLoadingFinished();

    // Image click
    const img = screen.getByAltText('Dokumentasi');
    fireEvent.click(img);
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('image.jpg'), '_blank');

    // File click
    const fileBtn = screen.getByText('Buka File');
    fireEvent.click(fileBtn);
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('file.pdf'), '_blank');
  });

  it('handles different status variants', async () => {
    // Selesai
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ 
        success: true, 
        data: { ...mockData, status: 'selesai' } 
    });
    const { unmount } = render(<DetailPenugasanMediaPage />);
    await waitForLoadingFinished();
    expect(screen.getAllByText('Selesai').length).toBeGreaterThan(0);
    unmount();

    // Belum Dimulai
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ 
        success: true, 
        data: { ...mockData, status: 'pending', laporanKegiatans: [] } 
    });
    render(<DetailPenugasanMediaPage />);
    await waitForLoadingFinished();
    expect(screen.getByText('Belum Dimulai')).toBeInTheDocument();
  });

  it('handles missing fields safely', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ 
        success: true, 
        data: { 
            ...mockData, 
            agenda: null, 
            pimpinans: [], 
            nama_staf: [],
            deskripsi_penugasan: '',
            draftBeritas: [{ ...mockData.draftBeritas[0], documentation: [], revisies: [] }]
        } 
    });
    render(<DetailPenugasanMediaPage />);
    await waitForLoadingFinished();
    expect(screen.getByText('Tidak ada staf')).toBeInTheDocument();
    expect(screen.getByText('Tidak ada pendamping')).toBeInTheDocument();
  });

  it('handles detail API error message', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ success: false, message: 'Custom Error' });
    render(<DetailPenugasanMediaPage />);
    await waitFor(() => expect(screen.getByText('Custom Error')).toBeInTheDocument());
  });

  it('handles update status failure', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ 
        success: true, 
        data: { ...mockData, status: 'pending', laporanKegiatans: [{ id_laporan: 'L1' }] } 
    });
    render(<DetailPenugasanMediaPage />);
    await waitForLoadingFinished();
    
    (toast.confirm as jest.Mock).mockResolvedValue({ isConfirmed: true });
    (penugasanApi.updateStatusPenugasan as jest.Mock).mockResolvedValue({ success: false, message: 'Update Fail' });
    
    const finishBtn = screen.getByText('Tandai Selesai');
    fireEvent.click(finishBtn);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal', 'Update Fail'));
  });

  it('handles unknown status badge fallback', async () => {
    const unknownData = JSON.parse(JSON.stringify(mockData));
    unknownData.status = 'UNKNOWN';
    unknownData.laporanKegiatans = []; // Ensure it falls to warning branch
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ success: true, data: unknownData });
    
    render(<DetailPenugasanMediaPage />);
    expect(await screen.findByText('Belum Dimulai')).toBeInTheDocument();
  });

  it('handles documentation image error', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ success: true, data: mockData });
    render(<DetailPenugasanMediaPage />);
    await waitForLoadingFinished();
    
    const img = screen.getByAltText('Dokumentasi');
    fireEvent.error(img);
  });

  it('covers remaining branches', async () => {
    const customData = JSON.parse(JSON.stringify(mockData));
    customData.draftBeritas[0].status_draft = 'approved';
    customData.draftBeritas.push({
        id_draft_berita: 'D2',
        judul_berita: 'Unknown Draft',
        status_draft: 'UNKNOWN',
        isi_draft: 'Test'
    });
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ success: true, data: customData });
    
    render(<DetailPenugasanMediaPage />);
    await waitForLoadingFinished();
    
    expect(screen.getByText('Disetujui')).toBeInTheDocument();
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
    
    // Navigate back (header)
    const backBtns = screen.getAllByText('Kembali');
    fireEvent.click(backBtns[0]);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    
    // Navigate back (footer)
    fireEvent.click(screen.getByText('Kembali ke Monitoring'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
