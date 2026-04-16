import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, MapPin, Briefcase, Building, Info, ChevronLeft } from 'lucide-react';
import { authApi } from '../lib/api';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    jabatan: '',
    instansi: '',
    no_hp: '',
    alamat: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok!');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password minimal 8 karakter!');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        instansi: formData.instansi || undefined,
        jabatan: formData.jabatan || undefined,
        no_hp: formData.no_hp || undefined,
        alamat: formData.alamat || undefined,
      });

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Registrasi Berhasil!',
          text: 'Akun Anda telah berhasil dibuat. Silakan login untuk mulai mengajukan permohonan agenda.',
          confirmButtonText: 'Login Sekarang',
          confirmButtonColor: '#2563eb',
          allowOutsideClick: false,
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl font-bold px-8 py-3'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      } else {
        setError(response.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all outline-none text-gray-900 font-medium text-sm";

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Panel - Simplified Branding (Consistent with Login) */}
      <div className="hidden lg:flex lg:w-[42%] bg-blue-600 relative overflow-hidden flex-col items-center justify-center p-12 text-center sticky top-0 h-screen">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700">
          {/* Logo - Official SVG (Consistent scale) */}
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

        {/* Dynamic Copyright indicator */}
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Bagian Protokol dan Komunikasi Pimpinan. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex flex-col relative bg-gray-50/20 overflow-y-auto">
        
        {/* Navigation - Home (Consistent with Login) */}
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

        <div className="flex-1 flex items-start justify-center p-6 sm:p-12 lg:p-20 pt-24 sm:pt-32">
          <div className="w-full max-w-[520px]">
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
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Buat Akun Baru</h2>
              <p className="text-sm text-gray-500 font-medium tracking-tight">Isi formulir di bawah untuk mendaftar sebagai pemohon</p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-700 text-xs font-bold font-sans">!</span>
                </div>
                <p className="text-[12px] text-red-800 leading-none">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Nama & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Nama Lengkap <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      value={formData.nama}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Nama lengkap"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="nama@email.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={inputClass.replace('pr-4', 'pr-11')}
                      placeholder="Min. 8 karakter"
                      required
                      minLength={8}
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

                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Konfirmasi <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={inputClass.replace('pr-4', 'pr-11')}
                      placeholder="Ulangi password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Jabatan & Instansi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Jabatan <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      id="jabatan"
                      name="jabatan"
                      type="text"
                      value={formData.jabatan}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Jabatan Anda"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">
                    Instansi/Organisasi
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      id="instansi"
                      name="instansi"
                      type="text"
                      value={formData.instansi}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Nama instansi"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: No HP */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="no_hp"
                    name="no_hp"
                    type="tel"
                    value={formData.no_hp}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="08xxxxxxxxxx"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Row 5: Alamat */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all outline-none text-gray-900 font-medium text-sm resize-none"
                    placeholder="Alamat lengkap"
                    rows={2}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Info note */}
              <div className="flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  Akun akan digunakan untuk pengajuan agenda. Pastikan data sudah benar.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-all active:scale-[0.98] disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-sm tracking-tight">
                    Daftar Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Footer link */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4 text-center">
              <p className="text-sm text-gray-500 font-medium tracking-wide">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Masuk di sini
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
