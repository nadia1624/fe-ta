import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/Button';
import { User, Mail, Phone, Lock, Image } from 'lucide-react';

export default function ProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Mock current user data
  const [profileData, setProfileData] = useState({
    nama_lengkap: 'Ahmad Hidayat',
    email: 'admin@protokol.go.id',
    no_hp: '081234567890',
    nip: '198705152010011001',
    jabatan: 'Administrator Sistem',
    role: 'Admin'
  });

  const [profileForm, setProfileForm] = useState({
    nama_lengkap: profileData.nama_lengkap,
    email: profileData.email,
    no_hp: profileData.no_hp,
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({
      ...profileData,
      ...profileForm
    });
    setIsEditingProfile(false);
    alert('Profil berhasil diperbarui!');
  };

  const handleCancelEditProfile = () => {
    setProfileForm({
      nama_lengkap: profileData.nama_lengkap,
      email: profileData.email,
      no_hp: profileData.no_hp,
    });
    setIsEditingProfile(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      alert('Password baru minimal 8 karakter!');
      return;
    }

    alert('Password berhasil diubah!');
    setPasswordForm({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setIsChangingPassword(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profil Saya</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola informasi profil dan keamanan akun Anda</p>
      </div>

      {/* Profile Photo Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 bg-white border-2 border-gray-200 rounded-full p-2 hover:bg-gray-50 transition-colors">
                <Image className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{profileData.nama_lengkap}</h3>
              <p className="text-sm text-gray-600">{profileData.jabatan}</p>
              <p className="text-sm text-blue-600 mt-1">{profileData.role}</p>
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
                    {profileData.nama_lengkap}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">NIP</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <User className="w-4 h-4 text-gray-400" />
                    {profileData.nip}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {profileData.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">No HP</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {profileData.no_hp}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Jabatan</label>
                  <div className="text-gray-900">{profileData.jabatan}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                  <div className="text-gray-900">{profileData.role}</div>
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
                    name="nama_lengkap"
                    value={profileForm.nama_lengkap}
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
                    value={profileData.nip}
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
                    required
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
                <p className="text-sm text-yellow-900">
                  <strong>Tips Keamanan:</strong>
                </p>
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
                    setPasswordForm({
                      current_password: '',
                      new_password: '',
                      confirm_password: ''
                    });
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
