import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import DraftBeritaPage from '../../../../app/routes/kasubag-media/DraftBeritaPage';
import { beritaApi } from '../../../../app/lib/api';

jest.mock('../../../../app/lib/api', () => ({
  beritaApi: { getAllDrafts: jest.fn() },
}));

jest.mock('react-router', () => ({
  Link: ({ children, to, ...props }: any) => <a href={to || '#'} {...props}>{children}</a>,
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
  Eye: () => <span data-testid="icon-eye" />,
  Search: () => <span />,
  Loader2: () => <span data-testid="icon-loader" />,
  AlertCircle: () => <span />,
  MessageSquare: () => <span />,
  Filter: () => <span />,
  X: () => <span data-testid="icon-x" />,
  ChevronLeft: () => <span data-testid="icon-left" />,
  ChevronRight: () => <span data-testid="icon-right" />,
  Camera: () => <span />,
  FileText: () => <span />,
  History: () => <span />,
  CheckCircle2: () => <span />,
  Clock: () => <span />,
  RotateCcw: () => <span />,
  Calendar: () => <span />,
  MapPin: () => <span />,
}));

const mockDrafts = [
  {
    id_draft_berita: 'D1',
    id_penugasan: 'P1',
    judul_berita: 'Judul Draft 1',
    isi_draft: 'Isi Draft 1',
    status_draft: 'draft',
    tanggal_kirim: '2026-04-21T10:00:00.000Z',
    staff: { nama: 'Staf A' },
    penugasan: { agenda: { nama_kegiatan: 'Agenda A', lokasi_kegiatan: 'Lokasi A' } },
    dokumentasis: [
      { id_dokumentasi: 'DOC1', file_path: 'img1.jpg' },
      { id_dokumentasi: 'DOC2', file_path: 'img2.jpg' }
    ],
    revisies: [
        { id_revisi: 'R1', catatan_revisi: 'Rev 1', tanggal_revisi: '2026-04-21T11:00:00Z' }
    ],
    catatan: 'Legacy note'
  },
  {
    id_draft_berita: 'D2',
    id_penugasan: 'P2',
    judul_berita: 'Approved News',
    isi_draft: 'Isi Draft 2',
    status_draft: 'approved',
    tanggal_kirim: '2026-04-20T10:00:00.000Z',
    staff: { nama: 'Staf B' },
    penugasan: { agenda: { nama_kegiatan: 'Agenda B', lokasi_kegiatan: 'Lokasi B' } },
    dokumentasis: [],
    revisies: [],
  }
];

describe('DraftBeritaPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const waitForLoadingFinished = async () => {
    await waitFor(() => expect(screen.queryByTestId('icon-loader')).not.toBeInTheDocument());
  };

  it('renders loading state', () => {
    (beritaApi.getAllDrafts as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<DraftBeritaPage />);
    expect(screen.getByTestId('icon-loader')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    (beritaApi.getAllDrafts as jest.Mock).mockResolvedValue({ success: false, message: 'API Error' });
    render(<DraftBeritaPage />);
    await waitFor(() => expect(screen.getByText('API Error')).toBeInTheDocument());
  });

  it('renders exception state', async () => {
    (beritaApi.getAllDrafts as jest.Mock).mockRejectedValue(new Error('Fail'));
    render(<DraftBeritaPage />);
    await waitFor(() => expect(screen.getByText('Terjadi kesalahan saat menghubungi server')).toBeInTheDocument());
    
    // Coba Lagi
    // We just verify the button is there to avoid jsdom location reload crash
    const reloadBtn = screen.getByText('Coba Lagi');
    expect(reloadBtn).toBeInTheDocument();
  });

  it('handles image error in modal', async () => {
    (beritaApi.getAllDrafts as jest.Mock).mockResolvedValue({ success: true, data: mockDrafts });
    render(<DraftBeritaPage />);
    await waitForLoadingFinished();
    
    // Open modal via title Detail
    const detailBtn = screen.getAllByTitle('Detail')[0];
    fireEvent.click(detailBtn);
    await waitFor(() => expect(screen.getByText('Detail Draft Berita')).toBeInTheDocument());
    
    const img = screen.getByAltText('Dokumentasi');
    fireEvent.error(img);
  });

  it('filters and searches drafts', async () => {
    (beritaApi.getAllDrafts as jest.Mock).mockResolvedValue({ success: true, data: mockDrafts });
    render(<DraftBeritaPage />);
    await waitForLoadingFinished();

    expect(screen.getByText('Judul Draft 1')).toBeInTheDocument();
    expect(screen.getByText('Approved News')).toBeInTheDocument();

    // Search
    fireEvent.change(screen.getByPlaceholderText(/Cari judul/i), { target: { value: 'Approved' } });
    expect(screen.queryByText('Judul Draft 1')).not.toBeInTheDocument();
    expect(screen.getByText('Approved News')).toBeInTheDocument();

    // Status Filter
    fireEvent.change(screen.getByLabelText('Pilih Status'), { target: { value: 'draft' } });
    fireEvent.change(screen.getByPlaceholderText(/Cari judul/i), { target: { value: '' } });
    expect(screen.getByText('Judul Draft 1')).toBeInTheDocument();
    expect(screen.queryByText('Approved News')).not.toBeInTheDocument();

    // No results
    fireEvent.change(screen.getByPlaceholderText(/Cari judul/i), { target: { value: 'ZXZX' } });
    expect(screen.getByText(/Tidak ada draft berita yang ditemukan/i)).toBeInTheDocument();
  });

  it('handles modal detail and image gallery', async () => {
    (beritaApi.getAllDrafts as jest.Mock).mockResolvedValue({ success: true, data: mockDrafts });
    render(<DraftBeritaPage />);
    await waitForLoadingFinished();

    // Open Modal
    const detailBtn = screen.getAllByTitle('Detail')[0];
    fireEvent.click(detailBtn);
    
    expect(screen.getByText('Detail Draft Berita')).toBeInTheDocument();
    expect(screen.getByText('Isi Draft 1')).toBeInTheDocument();
    expect(screen.getByText(/Rev 1/i)).toBeInTheDocument();
    
    // Gallery Navigation
    const nextBtn = screen.getByTestId('icon-right').closest('button')!;
    const prevBtn = screen.getByTestId('icon-left').closest('button')!;
    
    fireEvent.click(nextBtn);
    fireEvent.click(prevBtn);
    
    // Thumbnails
    const thumbnails = screen.getAllByRole('button').filter(b => b.className.includes('w-24'));
    fireEvent.click(thumbnails[1]);

    // Close Modal
    fireEvent.click(screen.getByTestId('icon-x').closest('button')!);
    await waitFor(() => expect(screen.queryByText('Detail Draft Berita')).not.toBeInTheDocument());
  });

  it('covers remaining status and sort branches', async () => {
    (beritaApi.getAllDrafts as jest.Mock).mockResolvedValue({ success: true, data: [
        { 
            ...mockDrafts[0], 
            status_draft: 'review',
            revisies: [
                { id_revisi: 'R1', catatan_revisi: 'Old', tanggal_revisi: '2020-01-01' },
                { id_revisi: 'R2', catatan_revisi: 'New', tanggal_revisi: '2026-01-01' }
            ]
        },
        { ...mockDrafts[1], status_draft: 'UNKNOWN' }
    ] });
    render(<DraftBeritaPage />);
    await waitForLoadingFinished();
    
    expect(screen.getAllByText('Perlu Revisi')[0]).toBeInTheDocument();
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });
    
  it('covers no docs branch', async () => {
    // No docs branch
    (beritaApi.getAllDrafts as jest.Mock).mockResolvedValue({ success: true, data: [
        { ...mockDrafts[0], dokumentasis: [], revisies: [] }
    ] });
    render(<DraftBeritaPage />);
    await waitForLoadingFinished();
    fireEvent.click(screen.getAllByTitle('Detail')[0]);
    expect(screen.getByText('Tidak ada dokumentasi')).toBeInTheDocument();
  });
});
