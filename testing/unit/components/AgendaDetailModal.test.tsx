import { render, screen, fireEvent } from '@testing-library/react';
import AgendaDetailModal from '../../../app/components/modals/AgendaDetailModal';
import '@testing-library/jest-dom';

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  X: () => <span data-testid="close-icon" />,
  FileText: () => <span data-testid="file-text-icon" />,
  Calendar: () => <span data-testid="calendar-icon" />,
  Clock: () => <span data-testid="clock-icon" />,
  MapPin: () => <span data-testid="map-pin-icon" />,
}));

// Mock UI Components
jest.mock('../../../app/components/ui/button', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('../../../app/components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <div data-testid="badge" data-variant={variant}>
      {children}
    </div>
  ),
}));

describe('AgendaDetailModal Component', () => {
  const mockAgenda = {
    nomor_surat: '001/ABC/2026',
    tanggal_surat: '2026-04-01',
    perihal: 'Rapat Kerja Nasional',
    nama_kegiatan: 'Rakernas 2026',
    lokasi_kegiatan: 'Balai Kota Padang',
    tanggal_kegiatan: '2026-04-25',
    waktu_mulai: '08:00',
    waktu_selesai: '12:00',
    status_agenda: 'Pending',
    catatan_verifikasi: 'Harap siapkan proyektor',
    surat_permohonan: 'surat_bin_rakernas.pdf',
  };

  const defaultProps = {
    agenda: mockAgenda,
    onClose: jest.fn(),
  };

  const renderModal = (props = {}) => {
    return render(<AgendaDetailModal {...defaultProps} {...props} />);
  };

  describe('Render Testing', () => {
    it('should render the modal content correctly', () => {
      renderModal();
      expect(screen.getByText('Detail Agenda')).toBeInTheDocument();
      expect(screen.getByText('Rakernas 2026')).toBeInTheDocument();
      expect(screen.getByText('001/ABC/2026')).toBeInTheDocument();
    });
  });

  describe('Data Integrity', () => {
    it('should display all agenda info appropriately', () => {
      renderModal();
      expect(screen.getByText('Balai Kota Padang')).toBeInTheDocument();
      expect(screen.getByText('08:00 - 12:00 WIB')).toBeInTheDocument();
      expect(screen.getByText('surat_bin_rakernas.pdf')).toBeInTheDocument();
    });

    it('should format dates using Indonesian locale', () => {
      renderModal();
      // '01 April 2026' for tanggal_surat
      expect(screen.getByText(/01 April 2026/)).toBeInTheDocument();
      // 'Sabtu, 25 April 2026' for tanggal_kegiatan (2026-04-25 is Saturday)
      expect(screen.getByText(/Sabtu, 25 April 2026/)).toBeInTheDocument();
    });
  });

  describe('Status Badge', () => {
    it('should show correct badge variant for Pending', () => {
      renderModal({ agenda: { ...mockAgenda, status_agenda: 'Pending' } });
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveTextContent('Pending');
      expect(badge).toHaveAttribute('data-variant', 'warning');
    });

    it('should show correct badge variant for Approved', () => {
      renderModal({ agenda: { ...mockAgenda, status_agenda: 'Approved' } });
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', 'success');
    });

    it('should show correct badge variant for Rejected', () => {
      renderModal({ agenda: { ...mockAgenda, status_agenda: 'Rejected' } });
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveAttribute('data-variant', 'destructive');
    });
  });

  describe('Conditional UI', () => {
    it('should show verification notes when present', () => {
      renderModal({ agenda: mockAgenda });
      expect(screen.getByText('Catatan Verifikasi')).toBeInTheDocument();
      expect(screen.getByText('Harap siapkan proyektor')).toBeInTheDocument();
    });

    it('should not show verification notes when absent', () => {
      renderModal({ agenda: { ...mockAgenda, catatan_verifikasi: null } });
      expect(screen.queryByText('Catatan Verifikasi')).not.toBeInTheDocument();
    });

    it('should show action buttons only when status is Pending', () => {
      renderModal({ agenda: { ...mockAgenda, status_agenda: 'Pending' } });
      expect(screen.getByText('Setujui')).toBeInTheDocument();
      expect(screen.getByText('Tolak')).toBeInTheDocument();
    });

    it('should not show action buttons when status is Approved', () => {
      renderModal({ agenda: { ...mockAgenda, status_agenda: 'Approved' } });
      expect(screen.queryByText('Setujui')).not.toBeInTheDocument();
      expect(screen.queryByText('Tolak')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClose when X button is clicked', () => {
      const onCloseMock = jest.fn();
      renderModal({ onClose: onCloseMock });
      
      const closeBtn = screen.getByTestId('close-icon').closest('button')!;
      fireEvent.click(closeBtn);
      
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Tutup button is clicked', () => {
      const onCloseMock = jest.fn();
      renderModal({ onClose: onCloseMock });
      
      const closeBtn = screen.getByText('Tutup');
      fireEvent.click(closeBtn);
      
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });
});
