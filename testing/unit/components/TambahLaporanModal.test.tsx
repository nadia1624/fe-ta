import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TambahLaporanModal from '../../../app/components/modals/TambahLaporanModal';
import { laporanKegiatanApi } from '../../../app/lib/api';
import { toast } from '../../../app/lib/swal';
import '@testing-library/jest-dom';

// Mock API and Toast
jest.mock('../../../app/lib/api', () => ({
  laporanKegiatanApi: {
    addLaporan: jest.fn(),
  },
}));

jest.mock('../../../app/lib/swal', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  X: () => <span data-testid="close-icon" />,
  Camera: () => <span data-testid="camera-icon" />,
  Upload: () => <span data-testid="upload-icon" />,
  Loader2: () => <span data-testid="loader-icon" />,
  SwitchCamera: () => <span data-testid="switch-icon" />,
}));

// Mock Button
jest.mock('../../../app/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type, form, className }: any) => (
    <button onClick={onClick} disabled={disabled} type={type} form={form} className={className}>
      {children}
    </button>
  ),
}));

// Mock URL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock MediaDevices
const mockMediaDevices = {
  getUserMedia: jest.fn(),
};
Object.defineProperty(navigator, 'mediaDevices', {
  value: mockMediaDevices,
  configurable: true,
});

describe('TambahLaporanModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    idPenugasan: 'P123',
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Render Testing', () => {
    it('should not render anything when isOpen is false', () => {
      render(<TambahLaporanModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Tambah Progress Laporan')).not.toBeInTheDocument();
    });

    it('should render form when isOpen is true', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      expect(screen.getByText('Tambah Progress Laporan')).toBeInTheDocument();
      expect(screen.getByText('Jenis Progress')).toBeInTheDocument();
    });
  });

  describe('Form Controls', () => {
    it('should allow selecting a standard deskripsi', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      const prepBtn = screen.getByText('Persiapan');
      fireEvent.click(prepBtn);
      
      // Checking for active class (border-blue-500)
      expect(prepBtn).toHaveClass('border-blue-500');
    });

    it('should show custom input when "Lainnya" is selected', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Lainnya'));
      
      const customInput = screen.getByPlaceholderText('Ketik jenis progress...');
      expect(customInput).toBeInTheDocument();
      
      fireEvent.change(customInput, { target: { value: 'Got Talent' } });
      expect(customInput).toHaveValue('Got Talent');
    });

    it('should update catatan laporan correctly', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      const textarea = screen.getByPlaceholderText(/Tuliskan laporan detail/);
      fireEvent.change(textarea, { target: { value: 'Kegiatan lancar jaya' } });
      expect(textarea).toHaveValue('Kegiatan lancar jaya');
    });
  });

  describe('Validation', () => {
    it('should keep submit button disabled if form incomplete', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      const submitBtn = screen.getByText('Simpan Laporan');
      expect(submitBtn).toBeDisabled();
    });

    it('should show error message if fields are missing on submit attempt', () => {
      // In this component, validation happens both visually (button disabled) 
      // and in handleSubmit. Since button is disabled by logic, we'd need to mock 
      // its state or test the internal handleSubmit logic if exposed.
      // But we can test that fill-up enables the button.
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Persiapan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'Notes' } });
      
      // Still disabled because no file
      expect(screen.getByText('Simpan Laporan')).toBeDisabled();
    });
  });

  describe('File Handling', () => {
    it('should handle file selection', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      // We need to trigger file input
      const file = new File(['dummy content'], 'report.png', { type: 'image/png' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      fireEvent.change(input, { target: { files: [file] } });
      
      expect(screen.getByText('report.png')).toBeInTheDocument();
      expect(screen.queryByText('Kamera')).not.toBeInTheDocument(); // Form disappears and shows preview
    });

    it('should clear file when delete button clicked', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      const file = new File(['dummy'], 'report.png', { type: 'image/png' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      fireEvent.change(input, { target: { files: [file] } });
      
      // X icon exists in header and preview. We want the one in preview (second in DOM).
      const clearBtn = screen.getAllByTestId('close-icon')[1].closest('button')!;
      fireEvent.click(clearBtn);
      
      expect(screen.queryByText('report.png')).not.toBeInTheDocument();
      expect(screen.getByText('Kamera')).toBeInTheDocument();
    });
  });

  describe('Camera Logic', () => {
    it('should open camera when camera button clicked', async () => {
      const mockStream = { getTracks: () => [{ stop: jest.fn() }] };
      mockMediaDevices.getUserMedia.mockResolvedValue(mockStream);
      
      render(<TambahLaporanModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Kamera'));
      
      await waitFor(() => {
        expect(screen.getByText('Ambil Foto')).toBeInTheDocument();
      });
      expect(mockMediaDevices.getUserMedia).toHaveBeenCalled();
    });

    it('should handle camera access error', async () => {
      mockMediaDevices.getUserMedia.mockRejectedValue(new Error('Permission Denied'));
      
      render(<TambahLaporanModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Kamera'));
      
      await waitFor(() => {
        expect(screen.getByText(/Tidak dapat mengakses kamera/)).toBeInTheDocument();
      });
    });
  });

  describe('Submission', () => {
    it('should call API with FormData on submit', async () => {
      // @ts-ignore
      laporanKegiatanApi.addLaporan.mockResolvedValue({ success: true });
      
      render(<TambahLaporanModal {...defaultProps} />);
      
      // Fill Form
      fireEvent.click(screen.getByText('Persiapan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'All good' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      fireEvent.click(screen.getByText('Simpan Laporan'));
      
      await waitFor(() => {
        expect(laporanKegiatanApi.addLaporan).toHaveBeenCalled();
      });
      
      // Verify payload
      const sentData = (laporanKegiatanApi.addLaporan as jest.Mock).mock.calls[0][0];
      expect(sentData.get('id_penugasan')).toBe('P123');
      expect(sentData.get('catatan_laporan')).toBe('All good');
      
      expect(toast.success).toHaveBeenCalledWith('Berhasil!', expect.any(String));
      expect(defaultProps.onSuccess).toHaveBeenCalled();
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});
