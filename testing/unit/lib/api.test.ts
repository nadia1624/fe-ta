import { 
  getToken, 
  setToken, 
  removeToken, 
  setUserData, 
  clearAuthData, 
  getActorSlug,
  authApi
} from '../../../app/lib/api';

describe('API Utilities (api.ts)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Support fetch mocking
    global.fetch = jest.fn();
  });

  describe('Token Helpers', () => {
    it('should set and get token from localStorage', () => {
      setToken('test-token');
      expect(getToken()).toBe('test-token');
    });

    it('should return null if token is not set', () => {
      expect(getToken()).toBeNull();
    });

    it('should remove token from localStorage', () => {
      setToken('test-token');
      removeToken();
      expect(getToken()).toBeNull();
    });
  });

  describe('User Data Helpers', () => {
    const mockUser = {
      id_user: 'user-123',
      nama: 'John Doe',
      email: 'john@example.com',
      role: { id_role: 'role-1', nama_role: 'Admin' }
    };

    it('should save user data to localStorage correctly', () => {
      setUserData(mockUser);
      expect(localStorage.getItem('userName')).toBe('John Doe');
      expect(localStorage.getItem('userEmail')).toBe('john@example.com');
      expect(localStorage.getItem('userRole')).toBe('Admin');
      expect(localStorage.getItem('userId')).toBe('user-123');
    });

    it('should clear all auth data (token and user info)', () => {
      setToken('token');
      setUserData(mockUser);
      
      clearAuthData();
      
      expect(getToken()).toBeNull();
      expect(localStorage.getItem('userName')).toBeNull();
      expect(localStorage.getItem('userRole')).toBeNull();
    });
  });

  describe('getActorSlug Function', () => {
    const cases = [
      { role: 'Admin', expected: 'admin' },
      { role: 'Sespri', expected: 'sespri' },
      { role: 'Kasubag Protokol', expected: 'kasubag-protokol' },
      { role: 'Kasubag Media', expected: 'kasubag-media' },
      { role: 'Ajudan', expected: 'ajudan' },
      { role: 'Staf Protokol', expected: 'staff-protokol' },
      { role: 'Staff Protokol', expected: 'staff-protokol' },
      { role: 'Staf Media', expected: 'staff-media' },
      { role: 'Staff Media', expected: 'staff-media' },
      { role: 'Pemohon', expected: 'pemohon' },
      { role: 'Unknown', expected: 'user' },
      { role: null, expected: 'user' },
      { role: '', expected: 'user' },
    ];

    test.each(cases)('should return "$expected" for role "$role"', ({ role, expected }) => {
      expect(getActorSlug(role)).toBe(expected);
    });

    it('should handle case insensitivity', () => {
      expect(getActorSlug('ADMIN')).toBe('admin');
      expect(getActorSlug('sespri')).toBe('sespri');
    });
  });

  describe('API Call Wrappers (authApi)', () => {
    it('login() should call fetch with correct URL, method, and body', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true, data: { token: 'new-token' } }),
      });

      const response = await authApi.login('test@example.com', 'password123');

      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });
      expect(response.success).toBe(true);
    });

    it('getMe() should include Authorization header if token exists', async () => {
      setToken('valid-token');
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true, data: { nama: 'Jane' } }),
      });

      await authApi.getMe();

      expect(global.fetch).toHaveBeenCalledWith('/api/auth/me', {
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json',
        },
      });
    });

    it('uploadFoto() should use FormData and NOT set Content-Type header', async () => {
      setToken('token');
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' });
      await authApi.uploadFoto(file);

      const call = (global.fetch as jest.Mock).mock.calls[0];
      const url = call[0];
      const options = call[1];

      expect(url).toBe('/api/auth/me/foto');
      expect(options.method).toBe('POST');
      expect(options.body).toBeInstanceOf(FormData);
      expect(options.headers['Content-Type']).toBeUndefined(); // Important for FormData
    });

    it('changePassword() should call correct endpoint with payload', async () => {
      setToken('token');
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      await authApi.changePassword({ current_password: 'old', new_password: 'new' });

      expect(global.fetch).toHaveBeenCalledWith('/api/auth/change-password', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ current_password: 'old', new_password: 'new' })
      }));
    });
  });
});
