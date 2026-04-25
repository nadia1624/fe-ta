import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DetailLaporanPage from '../../../../app/routes/kasubag-media/DetailLaporanPage';
import { penugasanApi } from '../../../../app/lib/api';

jest.mock('../../../../app/lib/api', () => ({
  penugasanApi: {
    getPenugasanDetail: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '123' }),
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <span />,
  ClipboardList: () => <span />,
  Calendar: () => <span />,
  MapPin: () => <span />,
  Clock: () => <span />,
  User: () => <span />,
  Loader2: () => <span data-testid="loader" />,
  AlertCircle: () => <span />,
  Users: () => <span />,
  FileText: () => <span />,
  TrendingUp: () => <span />,
  Image: () => <span />,
}));

const mockPenugasan = {
  id_penugasan: '123',
  jenis_penugasan: 'Media',
  deskripsi_penugasan: 'Tugas 1',
  tanggal_penugasan: '2023-01-01',
  status: 'progress',
  status_pelaksanaan: 'Berlangsung',
  nama_staf: ['Staff 1'],
  pimpinans: [{ nama_pimpinan: 'P1', nama_jabatan: 'J1' }],
  agenda: {
    id_agenda: 'a1',
    nama_kegiatan: 'Kegiatan 1',
    tanggal_kegiatan: '2023-01-01',
    waktu_mulai: '09:00:00',
    waktu_selesai: '10:00:00',
    lokasi_kegiatan: 'Loc 1',
    contact_person: '123',
    keterangan: 'Notes',
    kaskpdPendampings: [{ kaskpd: { nama_instansi: 'Instansi 1' } }],
  },
  laporanKegiatans: [
    {
      id_laporan: 'l1',
      deskripsi_laporan: 'Update 1',
      catatan_laporan: 'Catatan 1',
      dokumentasi_laporan: 'img.jpg',
      createdAt: '2023-01-01T10:00:00Z',
      staff: { id_user: 's1', nama: 'Staff 1' }
    }
  ]
};

describe('DetailLaporanPage', () => {
  const originalOpen = window.open;

  beforeEach(() => {
    jest.clearAllMocks();
    window.open = jest.fn();
  });

  afterAll(() => {
    window.open = originalOpen;
  });

  const waitForLoadingFinished = async () => {
    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
  };

  it('renders loading state', () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<DetailLaporanPage />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders error state when not found', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ success: false, message: 'Not found' });
    render(<DetailLaporanPage />);
    await waitFor(() => expect(screen.getByText('Penugasan tidak ditemukan')).toBeInTheDocument());
    
    fireEvent.click(screen.getAllByText('Kembali')[0]);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders success state with progress status', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ success: true, data: mockPenugasan });
    render(<DetailLaporanPage />);
    
    await waitForLoadingFinished();
    expect(screen.getByText('Detail Penugasan')).toBeInTheDocument();
    
    // Test image click
    const img = screen.getByAltText('Dokumentasi');
    fireEvent.click(img);
    expect(window.open).toHaveBeenCalled();

    // Test footer kembali
    fireEvent.click(screen.getAllByText('Kembali')[1]); 
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('handles different statuses', async () => {
    // Selesai status
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ 
      success: true, 
      data: { ...mockPenugasan, status: 'selesai' } 
    });
    const { unmount } = render(<DetailLaporanPage />);
    await waitFor(() => expect(screen.getAllByText('Selesai')[0]).toBeInTheDocument());
    unmount();

    // Belum Dimulai status
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ 
      success: true, 
      data: { ...mockPenugasan, status: 'pending', laporanKegiatans: [] } 
    });
    render(<DetailLaporanPage />);
    await waitFor(() => expect(screen.getAllByText('Belum Dimulai')[0]).toBeInTheDocument());
  });

  it('handles missing data fields', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockResolvedValue({ 
      success: true, 
      data: { 
        ...mockPenugasan, 
        agenda: null, 
        nama_staf: [],
        deskripsi_penugasan: '',
        laporanKegiatans: []
      } 
    });
    render(<DetailLaporanPage />);
    await waitForLoadingFinished();
    expect(screen.getByText('Informasi Penugasan')).toBeInTheDocument();
    expect(screen.getByText('Tidak ada staf')).toBeInTheDocument();
  });

  it('handles api error catch block', async () => {
    (penugasanApi.getPenugasanDetail as jest.Mock).mockRejectedValue(new Error('Network fail'));
    render(<DetailLaporanPage />);
    await waitFor(() => expect(screen.getByText('Terjadi kesalahan saat menghubungi server')).toBeInTheDocument());
  });
});
