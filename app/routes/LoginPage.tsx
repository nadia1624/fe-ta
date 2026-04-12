import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
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
          'Admin': '/admin/dashboard',
          'Sespri': '/sespri/dashboard',
          'Kasubag Protokol': '/kasubag-protokol/dashboard',
          'Kasubag Media': '/kasubag-media/dashboard',
          'Ajudan': '/ajudan/dashboard',
          'Staff Protokol': '/staff-protokol/dashboard',
          'Staff Media': '/staff-media/dashboard',
          'Pemohon': '/pemohon/dashboard',
        };

        navigate(roleMap[role] || '/admin/dashboard');
      } else {
        setError(response.message || 'Email atau password salah');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Panel - Simplified Branding */}
      <div className="hidden lg:flex lg:w-[42%] bg-blue-600 relative overflow-hidden flex-col items-center justify-center p-12 text-center">
        {/* Subtle decorative circles for depth without gradients */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
          {/* Logo - Official SVG (Full Size & Original Colors) */}
          <div className="mb-8 transition-transform hover:scale-110 duration-500 cursor-pointer">
            <img src="/logo-padang.svg" alt="Logo Kota Padang" className="w-32 h-32 object-contain filter drop-shadow-2xl" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white tracking-widest leading-none">SIMAP</h1>
            <div className="h-0.5 w-10 bg-white/40 mx-auto rounded-full" />
            <p className="text-base font-semibold text-white/90 uppercase tracking-[0.25em] leading-relaxed max-w-[380px] mx-auto">
              Sistem Informasi Manajemen Agenda Pimpinan
            </p>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Bagian Protokol dan Komunikasi Pimpinan. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Clean Login Form */}
      <div className="flex-1 flex flex-col relative bg-gray-50/20">
        
        {/* Dynamic Back to Home Navigation - UX Optimized */}
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-20">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium text-sm group transition-all"
          >
            <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:border-blue-100 group-hover:shadow-md transition-all">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20">
          <div className="w-full max-w-[400px]">
            {/* Mobile minimal header */}
            <div className="lg:hidden flex items-center gap-5 mb-14 pb-8 border-b border-gray-100">
              <div className="transition-transform active:scale-95">
                <img src="/logo-padang.svg" alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none uppercase">SIMAP</h1>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">Sistem Informasi Manajemen Agenda Pimpinan</p>
              </div>
            </div>

            {/* Form header */}
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Selamat Datang</h2>
              <p className="text-sm text-gray-500 font-medium tracking-tight">Silakan masuk untuk melanjutkan akses Sistem</p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-700 text-xs font-bold font-sans">!</span>
                </div>
                <p className="text-[12px] text-red-800 leading-none">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">E-mail Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all outline-none text-gray-900 font-medium text-sm"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Credential Access</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full h-12 pl-11 pr-11 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all outline-none text-gray-900 font-medium text-sm"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                  >
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pr-1">
                <Link 
                  to="/forgot-password" 
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-all active:scale-[0.98] disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Mengakses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-sm tracking-tight">
                    Masuk Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Bottom link */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4 text-center">
              <p className="text-sm text-gray-500 font-medium tracking-wide">
                Belum punya akun?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Daftar Pemohon
                </Link>
              </p>
            </div>

            {/* Mobile copyright */}
            <div className="lg:hidden mt-8 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                © {new Date().getFullYear()} Bagian Protokol dan Komunikasi Pimpinan. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
