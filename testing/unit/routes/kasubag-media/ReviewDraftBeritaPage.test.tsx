import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReviewDraftBeritaPage from '../../../../app/routes/kasubag-media/ReviewDraftBeritaPage';
import { beritaApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';

const mockNavigate = jest.fn();

jest.mock('../../../../app/lib/api', () => ({
  beritaApi: { 
    getDraftDetail: jest.fn(), 
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
  useParams: () => ({ id: 'D1' }),
  useNavigate: () => mockNavigate,
}));

jest.mock('lucide-react', () => ({
  CheckCircle: () => <span />,
  MessageSquare: () => <span />,
  ChevronLeft: () => <span />,
  ChevronRight: () => <span />,
  Loader2: () => <span data-testid="icon-loader" />,
  AlertCircle: () => <span />,
  Calendar: () => <span />,
  User: () => <span />,
  ClipboardList: () => <span />,
  TrendingUp: () => <span />,
}));

const mockDraft = {
  id_draft_berita: 'D1',
  judul_berita: 'Judul Draft 1',
  isi_draft: 'Isi Draft 1',
  status_draft: 'draft',
  tanggal_kirim: '2026-04-21T10:00:00.000Z',
  staff: { nama: 'Staf A' },
  penugasan: { agenda: { nama_kegiatan: 'Agenda A' } },
  dokumentasis: [
    { id_dokumentasi: 'DOC1', file_path: 'img1.jpg' },
    { id_dokumentasi: 'DOC2', file_path: 'file.pdf' }
  ],
  revisies: [
    { id_revisi: 'R1', catatan_revisi: 'Old Rev', tanggal_revisi: '2026-04-21T09:00:00Z' }
  ],
};

describe('ReviewDraftBeritaPage', () => {
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

  it('renders loading and error states', async () => {
    // Loading
    (beritaApi.getDraftDetail as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<ReviewDraftBeritaPage />);
    expect(screen.getByTestId('icon-loader')).toBeInTheDocument();

    // Error
    (beritaApi.getDraftDetail as jest.Mock).mockResolvedValue({ success: false, message: 'API Error' });
    render(<ReviewDraftBeritaPage />);
    await waitFor(() => expect(screen.getByText('API Error')).toBeInTheDocument());
    
    // Exception
    (beritaApi.getDraftDetail as jest.Mock).mockRejectedValue(new Error('Fail'));
    render(<ReviewDraftBeritaPage />);
    await waitFor(() => expect(screen.getByText('Terjadi kesalahan saat menghubungi server')).toBeInTheDocument());
  });

  it('renders success state and handles image gallery', async () => {
    (beritaApi.getDraftDetail as jest.Mock).mockResolvedValue({ success: true, data: mockDraft });
    render(<ReviewDraftBeritaPage />);
    await waitForLoadingFinished();

    expect(screen.getByText('Judul Draft 1')).toBeInTheDocument();
    
    // Gallery Navigation
    const nextBtns = screen.getAllByRole('button').filter(b => b.className.includes('right-4'));
    const prevBtns = screen.getAllByRole('button').filter(b => b.className.includes('left-4'));
    
    fireEvent.click(nextBtns[0]);
    fireEvent.click(prevBtns[0]);
    
    // Image Click
    const img = screen.getByAltText('Dokumentasi');
    fireEvent.click(img);
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('img1.jpg'), '_blank');
  });

  it('handles review approval flow', async () => {
    (beritaApi.getDraftDetail as jest.Mock).mockResolvedValue({ success: true, data: mockDraft });
    render(<ReviewDraftBeritaPage />);
    await waitForLoadingFinished();

    (toast.confirm as jest.Mock).mockResolvedValue({ isConfirmed: true });
    (beritaApi.reviewDraft as jest.Mock).mockResolvedValueOnce({ success: true, message: 'Success' });
    
    fireEvent.click(screen.getByText('Setujui & Terbitkan'));
    await waitFor(() => expect(beritaApi.reviewDraft).toHaveBeenCalledWith('D1', { status_draft: 'approved', catatan: '' }));
    expect(toast.success).toHaveBeenCalledWith('Berhasil', 'Success');
  });

  it('handles review rejection flow with validation', async () => {
    (beritaApi.getDraftDetail as jest.Mock).mockResolvedValue({ success: true, data: mockDraft });
    render(<ReviewDraftBeritaPage />);
    await waitForLoadingFinished();

    // Empty catatan warning
    fireEvent.click(screen.getByText('Revisi'));
    expect(toast.warning).toHaveBeenCalled();

    (toast.confirm as jest.Mock).mockResolvedValue({ isConfirmed: true });
    
    // Fill catatan and reject
    fireEvent.change(screen.getByPlaceholderText(/Berikan masukan/i), { target: { value: 'Fix this' } });
    (beritaApi.reviewDraft as jest.Mock).mockResolvedValueOnce({ success: false, message: 'API Failed' });
    
    fireEvent.click(screen.getByText('Revisi'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Gagal', 'API Failed'));

    // Exception case
    (beritaApi.reviewDraft as jest.Mock).mockRejectedValueOnce(new Error('Fail'));
    fireEvent.click(screen.getByText('Revisi'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Kesalahan', expect.any(String)));
  });

  it('handles non-draft status view', async () => {
    (beritaApi.getDraftDetail as jest.Mock).mockResolvedValue({ 
        success: true, 
        data: { ...mockDraft, status_draft: 'approved', catatan: 'Well done' } 
    });
    render(<ReviewDraftBeritaPage />);
    await waitForLoadingFinished();

    expect(screen.getByText('Draft Sudah Disetujui')).toBeInTheDocument();
    expect(screen.getByText('Well done')).toBeInTheDocument();
    
    // Back button
    fireEvent.click(screen.getByText('Kembali'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('covers remaining branches for non-image documentation', async () => {
    (beritaApi.getDraftDetail as jest.Mock).mockResolvedValue({ 
        success: true, 
        data: { 
            ...mockDraft, 
            dokumentasis: [{ id_dokumentasi: 'DOC2', file_path: 'file.pdf' }] 
        } 
    });
    render(<ReviewDraftBeritaPage />);
    await waitForLoadingFinished();

    fireEvent.click(screen.getByText('Open Media File'));
    expect(window.open).toHaveBeenCalledWith(expect.stringContaining('file.pdf'), '_blank');
    
    // Thumbnails for file
    (beritaApi.getDraftDetail as jest.Mock).mockResolvedValue({ 
        success: true, 
        data: { 
            ...mockDraft, 
            dokumentasis: [
                { id_dokumentasi: 'DOC1', file_path: 'img.jpg' },
                { id_dokumentasi: 'DOC2', file_path: 'file.pdf' }
            ] 
        } 
    });
    render(<ReviewDraftBeritaPage />);
    await waitForLoadingFinished();
    
    const thumbnails = screen.getAllByRole('button').filter(b => b.className.includes('w-20'));
    fireEvent.click(thumbnails[1]); // Click the file thumbnail
  });

  it('handles image error', async () => {
    (beritaApi.getDraftDetail as jest.Mock).mockResolvedValue({ success: true, data: mockDraft });
    render(<ReviewDraftBeritaPage />);
    await waitForLoadingFinished();
    
    const img = screen.getByAltText('Dokumentasi');
    fireEvent.error(img);
  });

  it('handles default status badge', async () => {
    (beritaApi.getDraftDetail as jest.Mock).mockResolvedValue({ 
        success: true, 
        data: { ...mockDraft, status_draft: 'unknown' } 
    });
    render(<ReviewDraftBeritaPage />);
    await waitForLoadingFinished();
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });
});
