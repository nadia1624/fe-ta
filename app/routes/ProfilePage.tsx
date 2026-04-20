import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Mail, Phone, Lock, Pencil, Trash2 } from 'lucide-react';
import { authApi } from '../lib/api';
import { toast } from '../lib/swal';
import PhotoCropModal from '../components/ui/PhotoCropModal';

interface UserProfile {
  id_user: string;
  nama: string;
  email: string;
  no_hp?: string;
  nip?: string;
  jabatan?: string;
  instansi?: string;
  foto_profil?: string;
  role?: { id_role: string; nama_role: string };
}

export default function ProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<UserProfile>({
    id_user: '',
    nama: '',
    email: '',
    no_hp: '',
    nip: '',
    jabatan: '',
    role: undefined,
  });

  const [profileForm, setProfileForm] = useState({
    nama: '',
    email: '',
    no_hp: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Fetch real profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.getMe();
        if (res.success && res.data) {
          const data = res.data;
          setProfileData(data);
          setProfileForm({
            nama: data.nama || '',
            email: data.email || '',
            no_hp: data.no_hp || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Step 1: file picker opens → read as dataURL → show crop modal
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropImageSrc(reader.result as string);
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Step 2: crop confirmed → upload cropped file
  const handleCropConfirm = async (croppedFile: File) => {
    setCropImageSrc(null);
    setUploadingPhoto(true);
    try {
      const res = await authApi.uploadFoto(croppedFile);
      if (res.success && res.data?.foto_profil) {
        setProfileData(prev => ({ ...prev, foto_profil: res.data.foto_profil }));
        toast.success('Berhasil!', 'Foto profil berhasil diperbarui.');
      } else {
        toast.error('Gagal!', res.message || 'Gagal mengupload foto.');
      }
    } catch {
      toast.error('Error', 'Terjadi kesalahan saat upload foto.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeleteFoto = async () => {
    const isConfirmed = await toast.confirm(
      'Hapus Foto Profil?',
      'Foto profil Anda akan dihapus dan diganti dengan avatar default.',
      'danger'
    );
    if (!isConfirmed) return;
 
    try {
      const res = await authApi.deleteFoto();
      if (res.success) {
        setProfileData(prev => ({ ...prev, foto_profil: undefined }));
        toast.success('Berhasil!', 'Foto profil berhasil dihapus.');
      } else {
        toast.error('Gagal!', res.message || 'Gagal menghapus foto.');
      }
    } catch {
      toast.error('Error', 'Terjadi kesalahan. Coba lagi.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.updateProfile({
        nama: profileForm.nama,
        email: profileForm.email,
        no_hp: profileForm.no_hp,
      });
      if (res.success) {
        setProfileData({ ...profileData, ...profileForm });
        localStorage.setItem('userName', profileForm.nama);
        setIsEditingProfile(false);
        toast.success('Berhasil!', 'Profil berhasil diperbarui.');
      } else {
        toast.error('Gagal!', res.message || 'Gagal memperbarui profil.');
      }
    } catch {
      toast.error('Error', 'Terjadi kesalahan. Coba lagi.');
    }
  };

  const handleCancelEditProfile = () => {
    setProfileForm({
      nama: profileData.nama,
      email: profileData.email,
      no_hp: profileData.no_hp || '',
    });
    setIsEditingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.warning('Tidak Cocok!', 'Password baru dan konfirmasi password tidak cocok.');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast.warning('Terlalu Pendek!', 'Password baru minimal 8 karakter.');
      return;
    }

    try {
      const res = await authApi.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      if (res.success) {
        toast.success('Berhasil!', 'Password berhasil diubah.');
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
        setIsChangingPassword(false);
      } else {
        toast.error('Gagal!', res.message || 'Gagal mengubah password.');
      }
    } catch {
      toast.error('Error', 'Terjadi kesalahan. Coba lagi.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profil Saya</h1>
          <p className="text-sm text-gray-600 mt-1">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profil Saya</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola informasi profil dan keamanan akun Anda</p>
      </div>

      {/* Crop Modal */}
      {cropImageSrc && (
        <PhotoCropModal
          imageSrc={cropImageSrc}
          onCancel={() => {
            setCropImageSrc(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          onConfirm={handleCropConfirm}
        />
      )}

      {/* Profile Photo Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFotoChange}
              />
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                {profileData.foto_profil ? (
                  <img
                    src={profileData.foto_profil}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              {/* Camera button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-0 right-0 bg-white border-2 border-gray-200 rounded-full p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Ubah foto profil"
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{profileData.nama || '-'}</h3>
              <p className="text-sm text-gray-600">{profileData.jabatan || '-'}</p>
              <p className="text-sm text-blue-600 mt-1">{profileData.role?.nama_role || '-'}</p>
              {uploadingPhoto && (
                <p className="text-xs text-blue-500 mt-1 animate-pulse">Mengupload foto...</p>
              )}
              {/* Delete photo button — shown only if photo exists */}
              {profileData.foto_profil && !uploadingPhoto && (
                <button
                  type="button"
                  onClick={handleDeleteFoto}
                  className="mt-2 flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus foto profil
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Informasi Profil</h3>
            {!isEditingProfile && (
              <Button onClick={() => setIsEditingProfile(true)} size="sm">
                Edit Profil
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isEditingProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nama Lengkap</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <User className="w-4 h-4 text-gray-400" />
                    {profileData.nama || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">NIP</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <User className="w-4 h-4 text-gray-400" />
                    {profileData.nip || 'Tidak ada'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {profileData.email || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">No HP</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {profileData.no_hp || 'Belum diisi'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Jabatan</label>
                  <div className="text-gray-900">{profileData.jabatan || 'Belum diisi'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                  <div className="text-gray-900">{profileData.role?.nama_role || '-'}</div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={profileForm.nama}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIP <span className="text-gray-400">(Tidak dapat diubah)</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.nip || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="no_hp"
                    value={profileForm.no_hp}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Catatan:</strong> Jabatan dan Role tidak dapat diubah sendiri. Hubungi Administrator untuk perubahan data tersebut.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={handleCancelEditProfile} className="flex-1">
                  Batal
                </Button>
                <Button type="submit" className="flex-1">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Keamanan Akun</h3>
              <p className="text-sm text-gray-600 mt-1">Ubah password untuk menjaga keamanan akun Anda</p>
            </div>
            {!isChangingPassword && !isEditingProfile && (
              <Button onClick={() => setIsChangingPassword(true)} variant="outline" size="sm">
                <Lock className="w-4 h-4 mr-2" />
                Ubah Password
              </Button>
            )}
          </div>
        </CardHeader>
        {isChangingPassword && (
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Saat Ini <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Masukkan password saat ini"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Baru <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Minimal 8 karakter"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password Baru <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordForm.confirm_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Ulangi password baru"
                    required
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900"><strong>Tips Keamanan:</strong></p>
                <ul className="text-sm text-yellow-800 mt-2 space-y-1 ml-4 list-disc">
                  <li>Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol</li>
                  <li>Minimal 8 karakter panjang</li>
                  <li>Jangan gunakan informasi pribadi yang mudah ditebak</li>
                  <li>Ubah password secara berkala</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
                  }}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button type="submit" className="flex-1">
                  Ubah Password
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
