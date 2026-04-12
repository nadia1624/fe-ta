import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Mail, ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.forgotPassword(email);

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Gagal mengirim instruksi reset password');
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

      {/* Right Panel - Request Form */}
      <div className="flex-1 flex flex-col relative bg-gray-50/20">
        <div className="absolute top-10 left-10 z-20">
          <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium text-sm group transition-all">
            <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:border-blue-100 group-hover:shadow-md transition-all">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span>Kembali ke Login</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20">
          <div className="w-full max-w-[400px]">
            {success ? (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Cek Email Anda</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-10">
                  Instruksi pemulihan kata sandi telah dikirim ke <strong>{email}</strong>. Silakan periksa kotak masuk atau folder spam Anda.
                </p>
                <Link 
                  to="/login"
                  className="inline-flex items-center justify-center w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
                >
                  Selesai
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Lupa Kata Sandi?</h2>
                  <p className="text-sm text-gray-500 font-medium tracking-tight">
                    Jangan khawatir. Masukkan email Anda dan kami akan mengirimkan instruksi untuk mengatur ulang kata sandi Anda.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                    <p className="text-[12px] text-red-800 font-medium leading-none">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">E-mail Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email terdaftar"
                        className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all outline-none text-gray-900 font-medium text-sm"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-all disabled:opacity-70"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Mengirim...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-sm tracking-tight text-white">
                        Kirim Instruksi Reset
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
