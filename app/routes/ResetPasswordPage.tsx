import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Lock, Eye, EyeOff, Check, XCircle, ArrowRight } from 'lucide-react';
import { authApi } from '../lib/api';
import { toast } from '../lib/swal';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      return setError('Password minimal 8 karakter');
    }

    if (password !== confirmPassword) {
      return setError('Konfirmasi password tidak cocok');
    }

    if (!token) return setError('Token tidak ditemukan');

    setLoading(true);

    try {
      const response = await authApi.resetPassword(token, password);

      if (response.success) {
        toast.success(
          'Berhasil!',
          'Kata sandi Anda telah diperbarui. Silakan masuk kembali.'
        ).then(() => {
          navigate('/login');
        });
      } else {
        setError(response.message || 'Gagal mengatur ulang kata sandi');
      }
    } catch (err) {
      setError('Koneksi server terputus. Silakan coba lagi.');
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

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-gray-50/20">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Atur Ulang Kata Sandi</h2>
            <p className="text-sm text-gray-500 font-medium">Buat kata sandi baru untuk mengamankan akun Anda.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in shake duration-300">
              <XCircle className="w-5 h-5 text-red-500" />
              <p className="text-[12px] text-red-800 font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full h-12 pl-11 pr-11 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none text-sm transition-all"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none text-sm transition-all"
                  required
                  disabled={loading}
                />
              </div>
              
              {/* Ultra-Clean Validation List */}
              <div className="mt-3 flex flex-col gap-2.5 px-1.5">
                <div className={cn(
                  "flex items-center gap-2.5 transition-all duration-300",
                  password.length >= 8 ? "text-green-600" : "text-gray-400"
                )}>
                  <div className={cn(
                    "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all",
                    password.length >= 8 ? "bg-green-50" : "bg-transparent"
                  )}>
                    {password.length >= 8 ? (
                      <Check className="w-3 h-3 animate-in zoom-in duration-300" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <span className="text-[12px] font-semibold">Minimal 8 Karakter</span>
                </div>

                <div className={cn(
                  "flex items-center gap-2.5 transition-all duration-300",
                  (password === confirmPassword && password !== "") ? "text-green-600" : "text-gray-400"
                )}>
                  <div className={cn(
                    "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all",
                    (password === confirmPassword && password !== "") ? "bg-green-50" : "bg-transparent"
                  )}>
                    {(password === confirmPassword && password !== "") ? (
                      <Check className="w-3 h-3 animate-in zoom-in duration-300" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <span className="text-[12px] font-semibold">Sesuai Konfirmasi</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-all transition-all text-white"
              disabled={loading || password !== confirmPassword || password.length < 8}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Memperbarui...
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm tracking-tight text-white">
                  Simpan Password Baru
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-10 text-center">
            <Link to="/login" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Batal & Kembali</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
