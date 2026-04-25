import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from '../../../app/routes/ProfilePage';
import { authApi } from '../../../app/lib/api';
import { toast } from '../../../app/lib/swal';

jest.mock('../../../app/lib/api', () => ({
  authApi: {
    getMe: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    uploadFoto: jest.fn(),
    deleteFoto: jest.fn(),
  },
}));

jest.mock('../../../app/lib/swal', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    confirm: jest.fn(),
  },
}));

jest.mock('../../../app/components/ui/PhotoCropModal', () => ({
  __esModule: true,
  default: ({ imageSrc, onCancel, onConfirm }: any) => (
    <div data-testid="photo-crop-modal">
      <span>{imageSrc}</span>
      <button onClick={onCancel}>Cancel Crop</button>
      <button onClick={() => onConfirm(new File(['cropped'], 'cropped.png', { type: 'image/png' }))}>
        Confirm Crop
      </button>
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  User: () => <span data-testid="icon-user" />,
  Mail: () => <span data-testid="icon-mail" />,
  Phone: () => <span data-testid="icon-phone" />,
  Lock: () => <span data-testid="icon-lock" />,
  Pencil: () => <span data-testid="icon-pencil" />,
  Trash2: () => <span data-testid="icon-trash" />,
}));

describe('ProfilePage', () => {
  const originalFileReader = global.FileReader;
  const mockedReadAsDataURL = jest.fn();

  const mockProfile = {
    id_user: 'u1',
    nama: 'John Doe',
    email: 'john@example.com',
    no_hp: '08123',
    nip: '1987',
    jabatan: 'Administrator',
    foto_profil: 'photo.jpg',
    role: { id_role: 'r1', nama_role: 'Admin' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (authApi.getMe as jest.Mock).mockResolvedValue({ success: true, data: mockProfile });

    class MockFileReader {
      result = 'data:image/png;base64,mock-image';
      onload: null | (() => void) = null;

      readAsDataURL = mockedReadAsDataURL.mockImplementation(() => {
        if (this.onload) this.onload();
      });
    }

    // @ts-ignore
    global.FileReader = MockFileReader;
  });

  afterAll(() => {
    global.FileReader = originalFileReader;
  });

  it('renders fetched profile data', async () => {
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText('Administrator').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
    expect(screen.getByText('1987')).toBeInTheDocument();
    expect(screen.getByText('08123')).toBeInTheDocument();
  });

  it('renders loading then fallback values when profile fetch fails', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    (authApi.getMe as jest.Mock).mockRejectedValue(new Error('network'));

    render(<ProfilePage />);

    expect(screen.getByText(/Memuat data profil/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Kelola informasi profil/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
    errorSpy.mockRestore();
  });

  it('allows editing profile and saving successfully', async () => {
    const user = userEvent.setup();
    (authApi.updateProfile as jest.Mock).mockResolvedValue({ success: true });
    localStorage.setItem('userName', 'Old Name');

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('Edit Profil')).toBeInTheDocument());
    await user.click(screen.getByText('Edit Profil'));

    fireEvent.change(screen.getByDisplayValue('John Doe'), { target: { value: 'Jane Doe', name: 'nama' } });
    fireEvent.change(screen.getByDisplayValue('john@example.com'), { target: { value: 'jane@example.com', name: 'email' } });
    fireEvent.change(screen.getByDisplayValue('08123'), { target: { value: '08999', name: 'no_hp' } });

    await user.click(screen.getByText('Simpan Perubahan'));

    await waitFor(() => {
      expect(authApi.updateProfile).toHaveBeenCalledWith({
        nama: 'Jane Doe',
        email: 'jane@example.com',
        no_hp: '08999',
      });
    });

    expect(localStorage.getItem('userName')).toBe('Jane Doe');
    expect(toast.success).toHaveBeenCalled();
  });

  it('restores original values when canceling profile edit', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('Edit Profil')).toBeInTheDocument());
    await user.click(screen.getByText('Edit Profil'));

    fireEvent.change(screen.getByDisplayValue('John Doe'), { target: { value: 'Changed', name: 'nama' } });
    await user.click(screen.getByText('Batal'));

    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
  });

  it('shows error toast when saving profile fails', async () => {
    const user = userEvent.setup();
    (authApi.updateProfile as jest.Mock).mockResolvedValue({ success: false, message: 'Update gagal' });

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('Edit Profil')).toBeInTheDocument());
    await user.click(screen.getByText('Edit Profil'));
    await user.click(screen.getByText('Simpan Perubahan'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal!', 'Update gagal');
    });
  });

  it('shows validation warning when password confirmation does not match', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('Ubah Password')).toBeInTheDocument());
    await user.click(screen.getByText('Ubah Password'));

    fireEvent.change(screen.getByPlaceholderText('Masukkan password saat ini'), {
      target: { name: 'current_password', value: 'oldpass123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Minimal 8 karakter'), {
      target: { name: 'new_password', value: 'newpass123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ulangi password baru'), {
      target: { name: 'confirm_password', value: 'different' },
    });

    await user.click(screen.getByText('Ubah Password'));

    expect(toast.warning).toHaveBeenCalledWith(
      'Tidak Cocok!',
      'Password baru dan konfirmasi password tidak cocok.',
    );
  });

  it('shows validation warning when password is too short', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('Ubah Password')).toBeInTheDocument());
    await user.click(screen.getByText('Ubah Password'));

    fireEvent.change(screen.getByPlaceholderText('Masukkan password saat ini'), {
      target: { name: 'current_password', value: 'oldpass123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Minimal 8 karakter'), {
      target: { name: 'new_password', value: 'short' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ulangi password baru'), {
      target: { name: 'confirm_password', value: 'short' },
    });

    await user.click(screen.getByText('Ubah Password'));

    expect(toast.warning).toHaveBeenCalledWith(
      'Terlalu Pendek!',
      'Password baru minimal 8 karakter.',
    );
  });

  it('changes password successfully and hides the form', async () => {
    const user = userEvent.setup();
    (authApi.changePassword as jest.Mock).mockResolvedValue({ success: true });

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('Ubah Password')).toBeInTheDocument());
    await user.click(screen.getByText('Ubah Password'));

    fireEvent.change(screen.getByPlaceholderText('Masukkan password saat ini'), {
      target: { name: 'current_password', value: 'oldpass123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Minimal 8 karakter'), {
      target: { name: 'new_password', value: 'newpass123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ulangi password baru'), {
      target: { name: 'confirm_password', value: 'newpass123' },
    });

    await user.click(screen.getByText('Ubah Password'));

    await waitFor(() => {
      expect(authApi.changePassword).toHaveBeenCalledWith({
        current_password: 'oldpass123',
        new_password: 'newpass123',
      });
    });

    expect(toast.success).toHaveBeenCalled();
    expect(screen.queryByPlaceholderText('Masukkan password saat ini')).not.toBeInTheDocument();
  });

  it('shows error toast when password change request fails', async () => {
    const user = userEvent.setup();
    (authApi.changePassword as jest.Mock).mockRejectedValue(new Error('boom'));

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('Ubah Password')).toBeInTheDocument());
    await user.click(screen.getByText('Ubah Password'));

    fireEvent.change(screen.getByPlaceholderText('Masukkan password saat ini'), {
      target: { name: 'current_password', value: 'oldpass123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Minimal 8 karakter'), {
      target: { name: 'new_password', value: 'newpass123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ulangi password baru'), {
      target: { name: 'confirm_password', value: 'newpass123' },
    });

    await user.click(screen.getByText('Ubah Password'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error', 'Terjadi kesalahan. Coba lagi.');
    });
  });

  it('opens crop modal from file input and uploads cropped photo successfully', async () => {
    const user = userEvent.setup();
    (authApi.uploadFoto as jest.Mock).mockResolvedValue({
      success: true,
      data: { foto_profil: 'new-photo.jpg' },
    });

    const { container } = render(<ProfilePage />);

    await waitFor(() => expect(screen.getByTitle('Ubah foto profil')).toBeInTheDocument());

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(mockedReadAsDataURL).toHaveBeenCalled();
    expect(screen.getByTestId('photo-crop-modal')).toBeInTheDocument();

    await user.click(screen.getByText('Confirm Crop'));

    await waitFor(() => {
      expect(authApi.uploadFoto).toHaveBeenCalled();
    });

    expect(toast.success).toHaveBeenCalledWith('Berhasil!', 'Foto profil berhasil diperbarui.');
  });

  it('cancels crop modal and clears selection', async () => {
    const user = userEvent.setup();
    const { container } = render(<ProfilePage />);

    await waitFor(() => expect(screen.getByTitle('Ubah foto profil')).toBeInTheDocument());

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['avatar'], 'avatar.png', { type: 'image/png' })] },
    });

    expect(screen.getByTestId('photo-crop-modal')).toBeInTheDocument();
    await user.click(screen.getByText('Cancel Crop'));
    expect(screen.queryByTestId('photo-crop-modal')).not.toBeInTheDocument();
  });

  it('shows toast when upload photo fails', async () => {
    const user = userEvent.setup();
    (authApi.uploadFoto as jest.Mock).mockResolvedValue({ success: false, message: 'Upload gagal' });

    const { container } = render(<ProfilePage />);
    await waitFor(() => expect(screen.getByTitle('Ubah foto profil')).toBeInTheDocument());

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['avatar'], 'avatar.png', { type: 'image/png' })] },
    });

    await user.click(screen.getByText('Confirm Crop'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal!', 'Upload gagal');
    });
  });

  it('deletes photo after confirmation', async () => {
    const user = userEvent.setup();
    (toast.confirm as jest.Mock).mockResolvedValue(true);
    (authApi.deleteFoto as jest.Mock).mockResolvedValue({ success: true });

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('Hapus foto profil')).toBeInTheDocument());
    await user.click(screen.getByText('Hapus foto profil'));

    await waitFor(() => {
      expect(authApi.deleteFoto).toHaveBeenCalled();
    });

    expect(toast.success).toHaveBeenCalledWith('Berhasil!', 'Foto profil berhasil dihapus.');
  });

  it('does not delete photo when confirmation is canceled', async () => {
    const user = userEvent.setup();
    (toast.confirm as jest.Mock).mockResolvedValue(false);

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByText('Hapus foto profil')).toBeInTheDocument());
    await user.click(screen.getByText('Hapus foto profil'));

    expect(authApi.deleteFoto).not.toHaveBeenCalled();
  });
});
