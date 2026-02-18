import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Building2, ArrowLeft } from 'lucide-react';
import { authApi, setToken, setUserData } from '../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[LoginPage] Submitting:', { email, password });
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(email, password);

      if (response.success && response.data) {
        // Simpan token dan data user ke localStorage
        setToken(response.data.token);
        setUserData(response.data.user);

        // Redirect berdasarkan role
        const role = response.data.user.role.nama_role;
        const roleMap: Record<string, string> = {
          'Admin': '/dashboard/admin',
          'Sespri': '/dashboard/sespri',
          'Kasubag Protokol': '/dashboard/kasubag-protokol',
          'Kasubag Media': '/dashboard/kasubag-media',
          'Ajudan': '/dashboard/ajudan',
          'Staf Protokol': '/dashboard/staf-protokol',
          'Staf Media': '/dashboard/staf-media',
          'Pemohon': '/dashboard/pemohon',
        };

        navigate(roleMap[role] || '/dashboard/admin');
      } else {
        setError(response.message || 'Login gagal');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">SIMAP</h1>
                <p className="text-xs text-gray-600">Sistem Informasi Manajemen Agenda Pimpinan</p>
              </div>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Login</h2>
              <p className="text-sm text-gray-600">
                Masuk ke Sistem Informasi Manajemen Agenda Pimpinan
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Masukkan email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Masukkan password"
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Belum punya akun?{' '}
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
                  Daftar sebagai Pemohon
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              &copy; 2025 Bagian Protokol dan Komunikasi Pimpinan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
