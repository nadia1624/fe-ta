import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, MapPin, Briefcase, Building, Info } from 'lucide-react';
import { authApi } from '../lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
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
        setShowSuccessDialog(true);
      } else {
        setError(response.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-400";

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] relative overflow-hidden flex-col justify-between p-10 sticky top-0 h-screen"
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
            Daftarkan akun<br />untuk mengajukan<br />
            <span className="text-blue-200">permohonan agenda</span>
          </h2>
          <p className="text-blue-100/80 text-sm leading-relaxed max-w-sm mb-8">
            Buat akun pemohon untuk mengajukan surat permohonan agenda kegiatan dengan pimpinan daerah secara digital.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { num: '1', text: 'Isi formulir pendaftaran' },
              { num: '2', text: 'Login ke akun Anda' },
              { num: '3', text: 'Ajukan permohonan agenda' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white border border-white/20">
                  {step.num}
                </div>
                <span className="text-sm text-blue-100">{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="relative z-10">
          <p className="text-xs text-blue-300/60">
            &copy; 2025 Bagian Protokol dan Komunikasi Pimpinan
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-start justify-center p-6 sm:p-8 bg-gray-50/50 overflow-y-auto">
        <div className="w-full max-w-[520px] py-4 sm:py-8">
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Buat akun baru</h2>
            <p className="text-sm text-gray-500">
              Isi formulir di bawah untuk mendaftar sebagai pemohon
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Nama & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
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

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-400"
                    placeholder="Min. 8 karakter"
                    required
                    minLength={8}
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-400"
                    placeholder="Ulangi password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Jabatan & Instansi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="jabatan" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Jabatan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    id="jabatan"
                    name="jabatan"
                    type="text"
                    value={formData.jabatan}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Contoh: Kepala Dinas"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="instansi" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Instansi/Organisasi
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
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
            <div>
              <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nomor HP
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
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
            <div>
              <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1.5">
                Alamat
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
                <textarea
                  id="alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm placeholder:text-gray-400 resize-none"
                  placeholder="Alamat lengkap"
                  rows={2}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                Akun akan digunakan untuk mengajukan surat permohonan agenda kegiatan. Pastikan data yang diisi sudah benar.
              </p>
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
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Mobile copyright */}
          <div className="lg:hidden mt-8 text-center">
            <p className="text-xs text-gray-400">
              &copy; 2025 Bagian Protokol dan Komunikasi Pimpinan
            </p>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <AlertDialogTitle className="text-center">Registrasi Berhasil!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Akun Anda telah berhasil dibuat. Silakan login untuk mulai mengajukan permohonan agenda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8"
            >
              Login Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
