import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../../../../app/routes/ProfilePage';
import { authApi } from '../../../../app/lib/api';
import { toast } from '../../../../app/lib/swal';

// Standardized API Mock
jest.mock('../../../../app/lib/api', () => ({
  authApi: { getMe: jest.fn(), updateProfile: jest.fn(), changePassword: jest.fn(), uploadFoto: jest.fn(), deleteFoto: jest.fn() },
  userApi: { getAll: jest.fn(), getRoles: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  pimpinanApi: { getAll: jest.fn(), getJabatan: jest.fn(), getList: jest.fn(), createOrUpdate: jest.fn(), resendSyncInvitation: jest.fn() },
  periodeApi: { getAll: jest.fn(), create: jest.fn(), update: jest.fn() },
  ajudanAssignmentApi: { getAll: jest.fn(), create: jest.fn(), delete: jest.fn(), setActive: jest.fn() },
  kaskpdApi: { getAll: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  dashboardApi: { getAdminStats: jest.fn() },
}));

// Mock Toast
jest.mock('../../../../app/lib/swal', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    confirm: jest.fn(),
  },
}));

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  User: () => <span data-testid="icon-user" />,
  Mail: () => <span data-testid="icon-mail" />,
  Phone: () => <span data-testid="icon-phone" />,
  Lock: () => <span data-testid="icon-lock" />,
  Pencil: () => <span data-testid="icon-pencil" />,
  Trash2: () => <span data-testid="icon-trash" />,
}));

// Mock PhotoCropModal
jest.mock('../../../../app/components/ui/PhotoCropModal', () => () => <div data-testid="photo-crop-modal" />);

describe('ProfilePage', () => {
  const mockUser = {
    id_user: '1',
    nama: 'Admin User',
    email: 'admin@test.com',
    no_hp: '1234567890',
    nip: '111222333',
    jabatan: 'Administrator',
    role: { id_role: '1', nama_role: 'Admin' },
    foto_profil: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (authApi.getMe as jest.Mock).mockResolvedValue({ success: true, data: mockUser });
  });

  it('renders user profile information correctly', async () => {
    render(<ProfilePage />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /admin user/i })).toBeInTheDocument();
    });

    // Check for jabatan and role (might appear twice, so we just check if they exist at all)
    expect(screen.getAllByText('Administrator').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
    expect(screen.getByText('admin@test.com')).toBeInTheDocument();
  });

  it('submits profile updates successfully', async () => {
    (authApi.updateProfile as jest.Mock).mockResolvedValue({ success: true });

    render(<ProfilePage />);

    await waitFor(() => expect(screen.getByRole('heading', { name: /admin user/i })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /edit profil/i }));

    await waitFor(() => expect(screen.getByDisplayValue('Admin User')).toBeInTheDocument());

    const nameInput = screen.getByDisplayValue('Admin User');
    fireEvent.change(nameInput, { target: { value: 'Admin Updated' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan perubahan/i }));

    await waitFor(() => {
      expect(authApi.updateProfile).toHaveBeenCalledWith(expect.objectContaining({
        nama: 'Admin Updated',
      }));
    });
  });
});
