import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { Building2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mock users for different roles
  const mockUsers = [
    { email: 'admin@protokol.go.id', password: 'admin123', role: 'Admin' },
    { email: 'sespri@protokol.go.id', password: 'sespri123', role: 'Sespri' },
    { email: 'kasubag.protokol@protokol.go.id', password: 'kasubag123', role: 'Kasubag Protokol' },
    { email: 'kasubag.media@protokol.go.id', password: 'kasubag123', role: 'Kasubag Media' },
    { email: 'ajudan@protokol.go.id', password: 'ajudan123', role: 'Ajudan' },
    { email: 'staf.protokol@protokol.go.id', password: 'staf123', role: 'Staf Protokol' },
    { email: 'staf.media@protokol.go.id', password: 'staf123', role: 'Staf Media' },
    { email: 'pemohon@email.com', password: 'pemohon123', role: 'Pemohon' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find user by email and password
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store user data in localStorage (in real app, use proper auth)
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);
      
      // Redirect based on role
      switch (user.role) {
        case 'Admin':
          navigate('/dashboard/admin');
          break;
        case 'Sespri':
          navigate('/dashboard/sespri');
          break;
        case 'Kasubag Protokol':
          navigate('/dashboard/kasubag-protokol');
          break;
        case 'Kasubag Media':
          navigate('/dashboard/kasubag-media');
          break;
        case 'Ajudan':
          navigate('/dashboard/ajudan');
          break;
        case 'Staf Protokol':
          navigate('/dashboard/staf-protokol');
          break;
        case 'Staf Media':
          navigate('/dashboard/staf-media');
          break;
        case 'Pemohon':
          navigate('/dashboard/pemohon');
          break;
        default:
          navigate('/dashboard/admin');
      }
    } else {
      alert('Email atau password salah!');
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

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email / Username
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Masukkan email atau username"
                  required
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
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Masuk
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">
                Belum punya akun?{' '}
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
                  Daftar sebagai Pemohon
                </Link>
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-medium text-blue-900 mb-2">Demo Login:</p>
                <div className="space-y-1 text-xs text-blue-800">
                  <p>• Admin: admin@protokol.go.id / admin123</p>
                  <p>• Sespri: sespri@protokol.go.id / sespri123</p>
                  <p>• Kasubag: kasubag.protokol@protokol.go.id / kasubag123</p>
                  <p>• Staf: staf.protokol@protokol.go.id / staf123</p>
                  <p>• Pemohon: pemohon@email.com / pemohon123</p>
                </div>
              </div>
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
