import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, Calendar, FileText, Users, Shield } from 'lucide-react';
import { authApi, setToken, setUserData } from '../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login(email, password);

      if (response.success && response.data) {
        setToken(response.data.token);
        setUserData(response.data.user);

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

  const features = [
    { icon: Calendar, text: 'Manajemen agenda terintegrasi' },
    { icon: FileText, text: 'Pengelolaan surat digital' },
    { icon: Users, text: 'Koordinasi tim yang efisien' },
    { icon: Shield, text: 'Aman & transparan' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] relative overflow-hidden flex-col justify-between p-10"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 right-10 w-48 h-48 bg-white/5 rounded-full" />

        {/* Top - Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SIMAP</h1>
              <p className="text-[11px] text-blue-200 leading-tight">Sistem Informasi Manajemen<br />Agenda Pimpinan</p>
            </div>
          </Link>
        </div>

        {/* Middle - Tagline */}
        <div className="relative z-10 -mt-4">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
            Kelola agenda<br />pimpinan dengan<br />
            <span className="text-blue-200">mudah & efisien</span>
          </h2>
          <p className="text-blue-100/80 text-sm leading-relaxed max-w-sm mb-8">
            Platform digital terpadu untuk manajemen agenda, surat permohonan, dan koordinasi protokol pimpinan daerah.
          </p>

          <div className="space-y-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-200" />
                  </div>
                  <span className="text-sm text-blue-100">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="relative z-10">
          <p className="text-xs text-blue-300/60">
            &copy; 2025 Bagian Protokol dan Komunikasi Pimpinan
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50/50">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">SIMAP</h1>
                <p className="text-[10px] text-gray-500 leading-tight">Sistem Informasi Manajemen Agenda Pimpinan</p>
              </div>
            </Link>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat datang kembali</h2>
            <p className="text-sm text-gray-500">
              Masuk ke akun Anda untuk mengelola agenda
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200/80 rounded-xl flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-400"
                  placeholder="nama@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-400"
                  placeholder="Masukkan password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold transition-all duration-200 shadow-sm shadow-blue-600/25 hover:shadow-md hover:shadow-blue-600/30"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Masuk
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Daftar sebagai Pemohon
              </Link>
            </p>
          </div>

          {/* Mobile copyright */}
          <div className="lg:hidden mt-10 text-center">
            <p className="text-xs text-gray-400">
              &copy; 2025 Bagian Protokol dan Komunikasi Pimpinan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
