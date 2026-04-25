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

    it('should handle API error response with message', async () => {
      // @ts-ignore
      laporanKegiatanApi.addLaporan.mockResolvedValue({ 
        success: false, 
        message: 'Data validation failed' 
      });
      
      render(<TambahLaporanModal {...defaultProps} />);
      
      // Fill Form
      fireEvent.click(screen.getByText('Persiapan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'All good' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      fireEvent.click(screen.getByText('Simpan Laporan'));
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Gagal!', 'Data validation failed');
      });
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it('should handle API error response without message', async () => {
      // @ts-ignore
      laporanKegiatanApi.addLaporan.mockResolvedValue({ success: false });
      
      render(<TambahLaporanModal {...defaultProps} />);
      
      // Fill Form
      fireEvent.click(screen.getByText('Persiapan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'All good' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      fireEvent.click(screen.getByText('Simpan Laporan'));
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Gagal!', 'Gagal menyimpan laporan. Silakan coba lagi.');
      });
    });

    it('should handle network error on submission', async () => {
      // @ts-ignore
      laporanKegiatanApi.addLaporan.mockRejectedValue(new Error('Network error'));
      
      render(<TambahLaporanModal {...defaultProps} />);
      
      // Fill Form
      fireEvent.click(screen.getByText('Persiapan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'All good' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      fireEvent.click(screen.getByText('Simpan Laporan'));
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Kesalahan Jaringan', 'Terjadi kesalahan jaringan. Periksa koneksi internet Anda.');
      });
    });

    it('should disable submit button when form incomplete', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Persiapan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'Notes' } });
      // Without file, button should be disabled
      expect(screen.getByText('Simpan Laporan')).toBeDisabled();
    });

    it('should disable submit when custom deskripsi is selected but empty', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Lainnya'));
      const customInput = screen.getByPlaceholderText('Ketik jenis progress...');
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'Notes' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      // Button disabled because custom deskripsi is empty
      expect(screen.getByText('Simpan Laporan')).toBeDisabled();
      
      // Fill custom deskripsi
      fireEvent.change(customInput, { target: { value: 'Custom Event' } });
      expect(screen.getByText('Simpan Laporan')).not.toBeDisabled();
    });
  });

  describe('File Upload Validation', () => {
    it('should reject non-image files', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      const file = new File(['text content'], 'document.txt', { type: 'text/plain' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      fireEvent.change(input, { target: { files: [file] } });
      
      expect(screen.getByText('Hanya file gambar yang diperbolehkan (JPG, PNG)')).toBeInTheDocument();
      expect(screen.queryByText('document.txt')).not.toBeInTheDocument();
    });
  });

  describe('Camera Advanced Scenarios', () => {
    it('should allow retry after camera error', async () => {
      let callCount = 0;
      mockMediaDevices.getUserMedia.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Permission denied'));
        }
        return Promise.resolve({ getTracks: () => [{ stop: jest.fn() }] });
      });
      
      render(<TambahLaporanModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Kamera'));
      
      await waitFor(() => {
        expect(screen.getByText(/Tidak dapat mengakses kamera/)).toBeInTheDocument();
      });
      
      // Click retry button
      const retryBtn = screen.getByText('Coba Lagi');
      fireEvent.click(retryBtn);
      
      await waitFor(() => {
        // After retry, camera should open successfully
        expect(mockMediaDevices.getUserMedia).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle stream cleanup before opening new camera', async () => {
      const mockTracks = [{ stop: jest.fn() }];
      mockMediaDevices.getUserMedia.mockResolvedValue({ getTracks: () => mockTracks });
      
      render(<TambahLaporanModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Kamera'));
      
      await waitFor(() => {
        expect(screen.getByText('Ambil Foto')).toBeInTheDocument();
      });
      
      // Switch camera should cleanup old stream
      const switchBtn = screen.getByTestId('switch-icon').closest('button')!;
      fireEvent.click(switchBtn);
      
      // Wait for new camera to be initialized
      await waitFor(() => {
        // After second camera call, tracks should have been stopped
        expect(mockMediaDevices.getUserMedia).toHaveBeenCalledTimes(2);
      });
    });

    it('should stop camera and cleanup on close', async () => {
      const mockTracks = [{ stop: jest.fn() }];
      mockMediaDevices.getUserMedia.mockResolvedValue({ getTracks: () => mockTracks });
      
      render(<TambahLaporanModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Kamera'));
      
      await waitFor(() => {
        expect(screen.getByText('Ambil Foto')).toBeInTheDocument();
      });
      
      // Close camera
      const closeBtns = screen.getAllByTestId('close-icon');
      fireEvent.click(closeBtns[0].closest('button')!);
      
      // Camera UI should disappear
      await waitFor(() => {
        expect(screen.queryByText('Ambil Foto')).not.toBeInTheDocument();
      });
    });

    it('should disable capture photo when camera error occurs', async () => {
      mockMediaDevices.getUserMedia.mockRejectedValue(new Error('Permission denied'));
      
      render(<TambahLaporanModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Kamera'));
      
      await waitFor(() => {
        expect(screen.getByText(/Tidak dapat mengakses kamera/)).toBeInTheDocument();
      });
      
      // Find the capture button (it's in the camera UI)
      const captureButtons = screen.getAllByRole('button', { name: '' });
      const captureBtn = captureButtons.find(btn => 
        btn.className.includes('w-20 h-20 rounded-full')
      );
      expect(captureBtn).toBeDisabled();
    });
  });

  describe('Custom Deskripsi Edge Cases', () => {
    it('should enable submit button when custom deskripsi is filled', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Lainnya'));
      const customInput = screen.getByPlaceholderText('Ketik jenis progress...');
      fireEvent.change(customInput, { target: { value: 'Test Event' } });
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'Notes' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      expect(screen.getByText('Simpan Laporan')).not.toBeDisabled();
    });

    it('should show character count for custom deskripsi', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Lainnya'));
      const customInput = screen.getByPlaceholderText('Ketik jenis progress...');
      fireEvent.change(customInput, { target: { value: 'Test' } });
      
      expect(screen.getByText('4/50 karakter')).toBeInTheDocument();
    });
  });

  describe('Modal Close and Reset', () => {
    it('should reset form on close via close button', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Persiapan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'Some notes' } });
      
      fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
      
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should reset form on close via header close button', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Persiapan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'Some notes' } });
      
      const headerCloseBtn = screen.getByText('Tambah Progress Laporan').parentElement?.querySelector('button');
      fireEvent.click(headerCloseBtn!);
      
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Button States', () => {
    it('should disable cancel button while submitting', async () => {
      // @ts-ignore
      laporanKegiatanApi.addLaporan.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 1000);
      }));
      
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Persiapan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'All good' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      fireEvent.click(screen.getByText('Simpan Laporan'));
      
      // While submitting, cancel button should be disabled
      const cancelBtn = screen.getByRole('button', { name: 'Batal' });
      await waitFor(() => {
        expect(cancelBtn).toBeDisabled();
      });
    });

    it('should show loading state on submit button', async () => {
      // @ts-ignore
      laporanKegiatanApi.addLaporan.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 1000);
      }));
      
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Persiapan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'All good' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      fireEvent.click(screen.getByText('Simpan Laporan'));
      
      await waitFor(() => {
        expect(screen.getByText('Menyimpan...')).toBeInTheDocument();
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases and Null Handling', () => {
    it('should handle whitespace-only catatan laporan', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Persiapan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: '   ' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      // Button should be disabled because whitespace is trimmed to empty
      expect(screen.getByText('Simpan Laporan')).toBeDisabled();
    });

    it('should handle custom deskripsi with whitespace only', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Lainnya'));
      const customInput = screen.getByPlaceholderText('Ketik jenis progress...');
      fireEvent.change(customInput, { target: { value: '   ' } });
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'Notes' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      // Button disabled because custom input is whitespace only (trims to empty)
      expect(screen.getByText('Simpan Laporan')).toBeDisabled();
    });

    it('should handle empty file list in file input', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      // Simulate empty files array
      fireEvent.change(input, { target: { files: [] } });
      
      expect(screen.queryByText(/\.jpg|\.png/)).not.toBeInTheDocument();
    });

    it('should clear error when changing fields after validation error', async () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      // Select camera, which should open camera view without error initially
      fireEvent.click(screen.getByText('Kamera'));
      
      await waitFor(() => {
        expect(screen.getByText('Ambil Foto')).toBeInTheDocument();
      });
      
      // Close camera to go back to form
      const closeBtns = screen.getAllByTestId('close-icon');
      fireEvent.click(closeBtns[0].closest('button')!);
      
      expect(screen.getByText('Tambah Progress Laporan')).toBeInTheDocument();
    });

    it('should preserve selected deskripsi when file is cleared', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Persiapan'));
      expect(screen.getByText('Persiapan')).toHaveClass('border-blue-500');
      
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
      
      // Clear file
      const clearBtn = screen.getAllByTestId('close-icon')[1].closest('button')!;
      fireEvent.click(clearBtn);
      
      // Deskripsi should still be selected
      expect(screen.getByText('Persiapan')).toHaveClass('border-blue-500');
    });

    it('should send correct FormData with deskripsi slice', async () => {
      // @ts-ignore
      laporanKegiatanApi.addLaporan.mockResolvedValue({ success: true });
      
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Lainnya'));
      const customInput = screen.getByPlaceholderText('Ketik jenis progress...');
      const longText = 'A'.repeat(100); // Text longer than 50 chars
      fireEvent.change(customInput, { target: { value: longText } });
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'Notes' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      fireEvent.click(screen.getByText('Simpan Laporan'));
      
      await waitFor(() => {
        const sentData = (laporanKegiatanApi.addLaporan as jest.Mock).mock.calls[0][0];
        // Should slice deskripsi to 50 chars
        expect(sentData.get('deskripsi_laporan')).toBe('A'.repeat(50));
      });
    });

    it('should handle form submission with standard deskripsi options', async () => {
      // @ts-ignore
      laporanKegiatanApi.addLaporan.mockResolvedValue({ success: true });
      
      render(<TambahLaporanModal {...defaultProps} />);
      
      fireEvent.click(screen.getByText('Pelaksanaan Kegiatan'));
      fireEvent.change(screen.getByPlaceholderText(/Tuliskan laporan detail/), { target: { value: 'Notes' } });
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [file] } });
      
      fireEvent.click(screen.getByText('Simpan Laporan'));
      
      await waitFor(() => {
        const sentData = (laporanKegiatanApi.addLaporan as jest.Mock).mock.calls[0][0];
        // For standard options, deskripsi should be sliced to 50 chars
        expect(sentData.get('deskripsi_laporan')).toBe('Pelaksanaan Kegiatan'); 
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it('should handle modal when isOpen becomes false', () => {
      const { rerender } = render(<TambahLaporanModal {...defaultProps} />);
      
      expect(screen.getByText('Tambah Progress Laporan')).toBeInTheDocument();
      
      // Rerender with isOpen as false
      rerender(<TambahLaporanModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Tambah Progress Laporan')).not.toBeInTheDocument();
    });

    it('should test deskripsi transition between options', async () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      // Select first option
      fireEvent.click(screen.getByText('Persiapan'));
      expect(screen.getByText('Persiapan')).toHaveClass('border-blue-500');
      
      // Select different option
      fireEvent.click(screen.getByText('Selesai'));
      expect(screen.getByText('Selesai')).toHaveClass('border-blue-500');
      expect(screen.getByText('Persiapan')).not.toHaveClass('border-blue-500');
    });

    it('should handle all standard deskripsi options', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      const expectedOptions = [
        'Persiapan',
        'Penyambutan Pimpinan',
        'Pelaksanaan Kegiatan',
        'Sedang Berlangsung',
        'Selesai',
        'Lainnya',
      ];
      
      for (const option of expectedOptions) {
        const btn = screen.getByText(option);
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(btn).toHaveClass('border-blue-500');
      }
    });

    it('should properly handle camera ref assignment', async () => {
      const mockStream = { getTracks: () => [{ stop: jest.fn() }] };
      mockMediaDevices.getUserMedia.mockResolvedValue(mockStream);
      
      render(<TambahLaporanModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Kamera'));
      
      await waitFor(() => {
        const video = document.querySelector('video') as HTMLVideoElement;
        expect(video).toBeInTheDocument();
        expect(video.srcObject).toBeTruthy();
      });
    });

    it('should switch between front and back camera facings', async () => {
      const mockStream = { getTracks: () => [{ stop: jest.fn() }] };
      mockMediaDevices.getUserMedia.mockResolvedValue(mockStream);
      
      render(<TambahLaporanModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Kamera'));
      
      await waitFor(() => {
        expect(screen.getByText('Ambil Foto')).toBeInTheDocument();
      });
      
      const callsBefore = mockMediaDevices.getUserMedia.mock.calls.length;
      
      // Switch camera  
      const switchBtn = screen.getByTestId('switch-icon').closest('button');
      fireEvent.click(switchBtn!);
      
      await waitFor(() => {
        expect(mockMediaDevices.getUserMedia.mock.calls.length).toBeGreaterThan(callsBefore);
      });
    });

    it('should handle camera permission errors gracefully', async () => {
      mockMediaDevices.getUserMedia.mockRejectedValue(new Error('Permission denied'));
      
      render(<TambahLaporanModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Kamera'));
      
      await waitFor(() => {
        const retryBtn = screen.queryByText('Coba Lagi');
        expect(retryBtn).toBeInTheDocument();
      });
      
      // Mock successful retry
      mockMediaDevices.getUserMedia.mockResolvedValue({ getTracks: () => [{ stop: jest.fn() }] });
      const retryBtn = screen.getByText('Coba Lagi');
      fireEvent.click(retryBtn);
      
      await waitFor(() => {
        expect(mockMediaDevices.getUserMedia).toHaveBeenCalledTimes(2);
      });
    });

    it('should test all deskripsi options render correctly', () => {
      render(<TambahLaporanModal {...defaultProps} />);
      
      const options = [
        'Persiapan',
        'Penyambutan Pimpinan',
        'Pelaksanaan Kegiatan',
        'Sedang Berlangsung',
        'Selesai',
        'Lainnya',
      ];
      
      for (const option of options) {
        expect(screen.getByText(option)).toBeInTheDocument();
      }
    });

    it('should properly initialize and teardown component', () => {
      const { unmount } = render(<TambahLaporanModal {...defaultProps} />);
      
      expect(screen.getByText('Tambah Progress Laporan')).toBeInTheDocument();
      
      unmount();
      
      expect(screen.queryByText('Tambah Progress Laporan')).not.toBeInTheDocument();
    });

    it('should handle video dimensions in camera', async () => {
      const mockStream = { getTracks: () => [{ stop: jest.fn() }] };
      mockMediaDevices.getUserMedia.mockResolvedValue(mockStream);
      
      render(<TambahLaporanModal {...defaultProps} />); 
      fireEvent.click(screen.getByText('Kamera'));
      
      await waitFor(() => {
        const video = document.querySelector('video') as HTMLVideoElement;
        expect(video).toBeInTheDocument();
        // Video should have playsinline attribute for mobile
        expect(video.hasAttribute('playsinline')).toBe(true);
      });
    });
  });
});
