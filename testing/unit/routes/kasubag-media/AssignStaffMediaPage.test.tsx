import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AssignStaffMediaPage from '../../../../app/routes/kasubag-media/AssignStaffMediaPage';
import { penugasanApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';

jest.mock('../../../../app/lib/api', () => ({
  penugasanApi: {
    getAgendasForMediaAssignment: jest.fn(),
    getStaffMedia: jest.fn(),
    assignStaff: jest.fn(),
  },
}));

jest.mock('../../../../app/lib/swal', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('lucide-react', () => ({
  Plus: () => <span data-testid="icon-plus" />,
  X: () => <span data-testid="icon-x" />,
  UserPlus: () => <span />,
  Loader2: () => <span data-testid="icon-loader" />,
  AlertCircle: () => <span />,
  Search: () => <span />,
}));

const mockAgendas = [
  {
    id_agenda: '1',
    nama_kegiatan: 'Agenda 1',
    tanggal_kegiatan: '2099-01-01',
    waktu_mulai: '09:00:00',
    waktu_selesai: '10:00:00',
    lokasi_kegiatan: 'Aula',
    agendaPimpinans: [{ periodeJabatan: { pimpinan: { nama_pimpinan: 'Pimpinan 1' } } }],
  },
  {
    id_agenda: 'past',
    nama_kegiatan: 'Past Agenda',
    tanggal_kegiatan: '2020-01-01',
    waktu_mulai: '09:00:00',
    waktu_selesai: '10:00:00',
    lokasi_kegiatan: 'Kantor',
    agendaPimpinans: [],
  }
];

const mockStaff = [
  { id_user: 's1', nama: 'Staff 1', email: 'staff1@test.com' },
  { id_user: 's2', nama: 'Staff 2', email: 'staff2@test.com' },
];

describe('AssignStaffMediaPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (penugasanApi.getAgendasForMediaAssignment as jest.Mock).mockResolvedValue({ success: true, data: mockAgendas });
    (penugasanApi.getStaffMedia as jest.Mock).mockResolvedValue({ success: true, data: mockStaff });
  });

  const waitForLoadingFinished = async () => {
    await waitFor(() => expect(screen.queryByText(/Memuat/i)).not.toBeInTheDocument());
  };

  it('renders loading state', async () => {
    (penugasanApi.getAgendasForMediaAssignment as jest.Mock).mockReturnValue(new Promise(() => {})); 
    render(<AssignStaffMediaPage />);
    expect(screen.getByTestId('icon-loader')).toBeInTheDocument();
  });

  it('renders error states', async () => {
    // Case 1: Reject
    (penugasanApi.getAgendasForMediaAssignment as jest.Mock).mockRejectedValue(new Error('Fetch failed'));
    const { unmount } = render(<AssignStaffMediaPage />);
    await waitFor(() => expect(screen.getByText('Gagal memuat data')).toBeInTheDocument());
    unmount();

    // Case 2: success false (line 39)
    (penugasanApi.getAgendasForMediaAssignment as jest.Mock).mockResolvedValue({ success: false });
    render(<AssignStaffMediaPage />);
    await waitFor(() => expect(screen.getByText('Gagal memuat data')).toBeInTheDocument());
  });

  it('renders agenda list and handles search', async () => {
    render(<AssignStaffMediaPage />);
    await waitForLoadingFinished();

    const searchInput = screen.getByPlaceholderText(/Cari agenda/i);
    fireEvent.change(searchInput, { target: { value: 'Agenda 1' } });
    expect(screen.getByText('Agenda 1')).toBeInTheDocument();
    
    fireEvent.change(searchInput, { target: { value: 'Pimpinan 1' } });
    expect(screen.getByText('Agenda 1')).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Aula' } });
    expect(screen.getByText('Agenda 1')).toBeInTheDocument();
    
    fireEvent.change(searchInput, { target: { value: 'ZXZX' } });
    expect(screen.getByText(/Tidak ada agenda yang perlu penugasan/i)).toBeInTheDocument();
  });

  it('handles past agenda warning and error parsing', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (penugasanApi.getAgendasForMediaAssignment as jest.Mock).mockResolvedValue({ 
      success: true, 
      data: [
        ...mockAgendas,
        { id_agenda: 'bad', nama_kegiatan: 'Bad Date', tanggal_kegiatan: 'invalid', waktu_mulai: '09:00:00', waktu_selesai: '10:00:00' }
      ] 
    });

    render(<AssignStaffMediaPage />);
    await waitForLoadingFinished();

    // Past agenda click (line 53-54)
    const assignButtons = screen.getAllByText('Tugaskan Staf');
    fireEvent.click(assignButtons[1]); 
    expect(toast.info).toHaveBeenCalledWith('Agenda Terlewat', expect.any(String));

    // Line 69-70 will be covered by rendering the list which calls isPastAgenda for every item
    consoleSpy.mockRestore();
  });

  it('completes staff assignment flow', async () => {
    (penugasanApi.assignStaff as jest.Mock).mockResolvedValue({ success: true });

    render(<AssignStaffMediaPage />);
    await waitForLoadingFinished();

    fireEvent.click(screen.getAllByText('Tugaskan Staf')[0]);
    
    // Find modal
    const modal = await screen.findByText('Detail Agenda');
    const modalContainer = modal.closest('.fixed')!;
    
    const staff1 = within(modalContainer as HTMLElement).getByText('Staff 1');
    fireEvent.click(staff1);

    fireEvent.change(within(modalContainer as HTMLElement).getByPlaceholderText(/Contoh: Bertugas/i), { target: { value: 'Test' } });
    fireEvent.click(within(modalContainer as HTMLElement).getByText(/Tugaskan \(1\)/i));
    
    await waitFor(() => expect(penugasanApi.assignStaff).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalled();
  });

  it('handles assignment errors', async () => {
    render(<AssignStaffMediaPage />);
    await waitForLoadingFinished();

    fireEvent.click(screen.getAllByText('Tugaskan Staf')[0]);
    const modalContainer = (await screen.findByText('Detail Agenda')).closest('.fixed')!;
    
    fireEvent.click(within(modalContainer as HTMLElement).getByText('Staff 1'));
    fireEvent.change(within(modalContainer as HTMLElement).getByPlaceholderText(/Contoh: Bertugas/i), { target: { value: 'Test' } });

    (penugasanApi.assignStaff as jest.Mock).mockResolvedValue({ success: false, message: 'Bentrok' });
    fireEvent.click(within(modalContainer as HTMLElement).getByText(/Tugaskan \(1\)/i));
    await waitFor(() => expect(toast.warning).toHaveBeenCalled());

    (penugasanApi.assignStaff as jest.Mock).mockResolvedValue({ success: false, message: 'Failed' });
    fireEvent.click(within(modalContainer as HTMLElement).getByText(/Tugaskan \(1\)/i));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('handles close modal and cancel', async () => {
    render(<AssignStaffMediaPage />);
    await waitForLoadingFinished();

    // Open and close via X
    fireEvent.click(screen.getAllByText('Tugaskan Staf')[0]);
    let modalContainer = (await screen.findByText('Detail Agenda')).closest('.fixed')!;
    fireEvent.click(within(modalContainer as HTMLElement).getByTestId('icon-x').closest('button')!);
    await waitFor(() => expect(screen.queryByText('Detail Agenda')).not.toBeInTheDocument());

    // Open and close via Batal
    fireEvent.click(screen.getAllByText('Tugaskan Staf')[0]);
    modalContainer = (await screen.findByText('Detail Agenda')).closest('.fixed')!;
    fireEvent.click(within(modalContainer as HTMLElement).getByText('Batal'));
    await waitFor(() => expect(screen.queryByText('Detail Agenda')).not.toBeInTheDocument());
  });
});
