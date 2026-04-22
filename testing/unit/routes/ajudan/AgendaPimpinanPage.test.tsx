import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AgendaPimpinanPage from '../../../../app/routes/ajudan/AgendaPimpinanPage';
import { agendaApi, pimpinanApi } from '../../../../app/lib/api';

// Standardized API Mock
jest.mock('../../../../app/lib/api', () => ({
  authApi: { getMe: jest.fn() },
  agendaApi: { getLeaderAgendas: jest.fn(), updateLeaderAttendance: jest.fn() },
  pimpinanApi: { getActiveAssignments: jest.fn(), getAll: jest.fn() },
}));

// Mock Toast
jest.mock('../../../../app/lib/swal', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock Lucide Icons (only those used in relevant parts)
jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="icon-calendar" />,
  List: () => <span data-testid="icon-list" />,
  CalendarDays: () => <span data-testid="icon-calendardays" />,
  Eye: () => <span data-testid="icon-eye" />,
  X: () => <span data-testid="icon-x" />,
  Search: () => <span data-testid="icon-search" />,
  Filter: () => <span data-testid="icon-filter" />,
  UserCheck: () => <span data-testid="icon-usercheck" />,
  RefreshCw: () => <span data-testid="icon-refresh" />,
  Clock: () => <span data-testid="icon-clock" />,
  Edit2: () => <span data-testid="icon-edit" />,
  Phone: () => <span data-testid="icon-phone" />,
  AlertCircle: () => <span data-testid="icon-alert" />,
}));

describe('AgendaPimpinanPage', () => {
  const mockAssignments = [
    {
      id_jabatan: 'J1',
      id_periode: 'P1',
      pimpinan: { nama_pimpinan: 'Bapak Pimpinan' },
      jabatan: { nama_jabatan: 'Kepala Dinas' }
    }
  ];

  const mockAgendas = [
    {
      id_agenda: 'AG1',
      nama_kegiatan: 'Agenda Masa Lalu',
      tanggal_kegiatan: '2000-01-01',
      waktu_mulai: '08:00:00',
      waktu_selesai: '09:00:00',
      lokasi_kegiatan: 'Kantor',
      statusAgendas: [{ status_agenda: 'approved_sespri' }],
      agendaPimpinans: [{
        id_jabatan: 'J1',
        id_periode: 'P1',
        status_kehadiran: 'hadir',
        raw_ap: { id_jabatan: 'J1', id_periode: 'P1', status_kehadiran: 'hadir' }
      }],
      slotAgendaPimpinans: []
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (pimpinanApi.getActiveAssignments as jest.Mock).mockResolvedValue({ success: true, data: mockAssignments });
    (pimpinanApi.getAll as jest.Mock).mockResolvedValue({ success: true, data: [] });
    (agendaApi.getLeaderAgendas as jest.Mock).mockResolvedValue({ success: true, data: mockAgendas });
  });

  it('disables "Edit Kehadiran" button for past agendas in detail modal', async () => {
    render(<AgendaPimpinanPage />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('icon-refresh')).not.toBeInTheDocument();
    });

    // Switch to list view to find the agenda easily
    const listButton = screen.getByText('List');
    fireEvent.click(listButton);

    await waitFor(() => {
      expect(screen.getByText('Agenda Masa Lalu')).toBeInTheDocument();
    });

    // Click Detail (Eye icon button)
    const detailBtn = screen.getByTestId('icon-eye').closest('button');
    if (detailBtn) fireEvent.click(detailBtn);

    await waitFor(() => {
      expect(screen.getByText('Detail Agenda')).toBeInTheDocument();
    });

    // Check "Edit Kehadiran" button status
    const editBtn = screen.getByText(/edit kehadiran/i).closest('button');
    expect(editBtn).toBeDisabled();
    expect(editBtn).toHaveClass('text-gray-400');
    expect(editBtn).toHaveAttribute('title', 'Agenda sudah selesai, kehadiran tidak dapat diedit');
  });
});
