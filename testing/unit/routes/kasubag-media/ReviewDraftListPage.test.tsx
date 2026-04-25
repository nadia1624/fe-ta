import { fireEvent, render, screen, waitFor, within, act } from '@testing-library/react';
import ReviewDraftListPage from '../../../../app/routes/kasubag-media/ReviewDraftListPage';
import { beritaApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';

const mockNavigate = jest.fn();

jest.mock('../../../../app/lib/api', () => ({
  beritaApi: { 
    getDraftsReview: jest.fn(), 
    reviewDraft: jest.fn() 
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
  Link: ({ children, to, ...props }: any) => <a href={to || '#'} {...props}>{children}</a>,
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../../app/components/ui/month-picker', () => {
    return function MockMonthPicker({ value, onChange }: any) {
        return <input aria-label="month-picker" type="month" value={value} onChange={(e) => onChange(e.target.value)} />;
    };
});

jest.mock('lucide-react', () => ({
  Search: () => <span />,
  Eye: () => <span />,
  Calendar: () => <span />,
  User: () => <span />,
  Clock: () => <span />,
  MessageSquare: () => <span />,
  AlertCircle: () => <span />,
  Loader2: () => <span data-testid="icon-loader" />,
  FileText: () => <span />,
  CheckCircle2: () => <span />,
  X: () => <span data-testid="icon-x" />,
  ChevronLeft: () => <span data-testid="icon-left" />,
  ChevronRight: () => <span data-testid="icon-right" />,
  ImageIcon: () => <span />,
  History: () => <span />,
  Newspaper: () => <span />,
}));

const mockDrafts = [
  {
    id_draft_berita: 'D1',
    judul_berita: 'Review Me 1',
    isi_draft: 'Isi content draft 1',
    status_draft: 'draft',
    tanggal_kirim: '2026-04-21T10:00:00.000Z',
    staff: { nama: 'Staf A' },
    penugasan: { agenda: { nama_kegiatan: 'Agenda A' } },
    dokumentasis: [
      { id_dokumentasi: 'DOC1', file_path: 'img1.jpg' },
      { id_dokumentasi: 'DOC2', file_path: 'img2.jpg' },
      { id_dokumentasi: 'DOC3', file_path: 'img3.jpg' },
      { id_dokumentasi: 'DOC4', file_path: 'img4.jpg' },
      { id_dokumentasi: 'DOC5', file_path: 'img5.jpg' }
    ],
    revisies: [
        { id_revisi: 'R1', catatan_revisi: 'Fix typo', tanggal_revisi: '2026-04-21T09:00:00Z' }
    ],
  }
];

describe('ReviewDraftListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const waitForLoadingFinished = async () => {
    await waitFor(() => expect(screen.queryByTestId('icon-loader')).not.toBeInTheDocument());
  };

  it('renders loading state', () => {
    (beritaApi.getDraftsReview as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<ReviewDraftListPage />);
    expect(screen.getByTestId('icon-loader')).toBeInTheDocument();
  });

  it('renders error state', async () => {
    (beritaApi.getDraftsReview as jest.Mock).mockResolvedValue({ success: false, message: 'API Error' });
    render(<ReviewDraftListPage />);
    await waitFor(() => expect(screen.getByText('API Error')).toBeInTheDocument());
  });

  it('renders exception state', async () => {
    (beritaApi.getDraftsReview as jest.Mock).mockRejectedValue(new Error('Fail'));
    render(<ReviewDraftListPage />);
    await waitFor(() => expect(screen.getByText('Terjadi kesalahan')).toBeInTheDocument());
    
    fireEvent.click(screen.getByText('Coba Lagi'));
    await waitFor(() => expect(beritaApi.getDraftsReview).toHaveBeenCalledTimes(2));
    await waitForLoadingFinished();
  });

  it('filters and searches drafts', async () => {
    (beritaApi.getDraftsReview as jest.Mock).mockResolvedValue({ success: true, data: mockDrafts });
    render(<ReviewDraftListPage />);
    await waitForLoadingFinished();

    expect(screen.getByText('Review Me 1')).toBeInTheDocument();

    // Search
    fireEvent.change(screen.getByPlaceholderText(/Cari judul/i), { target: { value: 'ZXZX' } });
    expect(screen.queryByText('Review Me 1')).not.toBeInTheDocument();
    expect(screen.getByText('Semua Draft Sudah Direview')).toBeInTheDocument();

    // Reset
    fireEvent.click(screen.getByText('Bersihkan Pencarian'));
    expect(screen.getByText('Review Me 1')).toBeInTheDocument();

    // Month Filter
    fireEvent.change(screen.getByLabelText('month-picker'), { target: { value: '2020-01' } });
    expect(screen.queryByText('Review Me 1')).not.toBeInTheDocument();
  });

  it('handles modal detail and quick approve', async () => {
    (beritaApi.getDraftsReview as jest.Mock).mockResolvedValue({ success: true, data: mockDrafts });
    render(<ReviewDraftListPage />);
    await waitForLoadingFinished();

    // Open Modal via button click
    fireEvent.click(screen.getByText('Lihat Detail'));
    await waitFor(() => expect(screen.getByText('Detail Draft Berita')).toBeInTheDocument());
    const modal = screen.getByText('Detail Draft Berita').closest('.fixed')!;
    
    const nextBtn = within(modal as HTMLElement).getByTestId('icon-right').closest('button')!;
    const prevBtn = within(modal as HTMLElement).getByTestId('icon-left').closest('button')!;
    fireEvent.click(nextBtn);
    fireEvent.click(prevBtn);
    
    // Thumbnail click in modal
    const thumbnails = within(modal as HTMLElement).getAllByRole('button').filter(b => b.className.includes('w-24'));
    fireEvent.click(thumbnails[1]);

    // Footer actions in modal
    fireEvent.click(within(modal as HTMLElement).getByText('Setujui Draft'));
    expect(toast.confirm).toHaveBeenCalled();

    // Close Modal
    fireEvent.click(within(modal as HTMLElement).getByTestId('icon-x').closest('button')!);
    await waitFor(() => expect(screen.queryByText('Detail Draft Berita')).not.toBeInTheDocument());

    // Quick Approve - Cancel
    fireEvent.click(screen.getByText('Setujui Draft'));
    expect(toast.confirm).toHaveBeenCalled();

    // Quick Approve - Success
    (toast.confirm as jest.Mock).mockResolvedValue({ isConfirmed: true });
    (beritaApi.reviewDraft as jest.Mock).mockResolvedValueOnce({ success: true });
    
    const approveBtns = screen.getAllByText('Setujui Draft');
    fireEvent.click(approveBtns[0]);
    await waitFor(() => expect(toast.success).toHaveBeenCalled());
  });

  it('handles image error in modal', async () => {
    (beritaApi.getDraftsReview as jest.Mock).mockResolvedValue({ success: true, data: mockDrafts });
    render(<ReviewDraftListPage />);
    await waitForLoadingFinished();
    
    fireEvent.click(screen.getByText('Lihat Detail'));
    const modalImg = await screen.findByAltText('Dokumentasi');
    fireEvent.error(modalImg);
  });

  it('handles approve errors', async () => {
    (beritaApi.getDraftsReview as jest.Mock).mockResolvedValue({ success: true, data: mockDrafts });
    render(<ReviewDraftListPage />);
    await waitForLoadingFinished();

    (toast.confirm as jest.Mock).mockResolvedValue({ isConfirmed: true });
    
    // API Fail
    (beritaApi.reviewDraft as jest.Mock).mockResolvedValueOnce({ success: false, message: 'Bad' });
    fireEvent.click(screen.getByText('Setujui Draft'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal', 'Bad'));

    // Exception
    (beritaApi.reviewDraft as jest.Mock).mockRejectedValueOnce(new Error('Fail'));
    fireEvent.click(screen.getByText('Setujui Draft'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal', expect.any(String)));
  });

  it('covers no documentation branch', async () => {
    (beritaApi.getDraftsReview as jest.Mock).mockResolvedValue({ 
        success: true, 
        data: [{ ...mockDrafts[0], dokumentasis: [], revisies: [] }] 
    });
    render(<ReviewDraftListPage />);
    await waitForLoadingFinished();
    
    fireEvent.click(screen.getByText('Lihat Detail'));
    expect(screen.getByText('Tidak ada dokumentasi')).toBeInTheDocument();
  });

  it('covers thumbnail click in list', async () => {
    (beritaApi.getDraftsReview as jest.Mock).mockResolvedValue({ success: true, data: mockDrafts });
    render(<ReviewDraftListPage />);
    await waitForLoadingFinished();
    
    const imgs = screen.getAllByAltText('');
    fireEvent.click(imgs[0].parentElement!);
    expect(screen.getByText('Detail Draft Berita')).toBeInTheDocument();
  });
});
