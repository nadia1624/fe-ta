import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Plus, Edit, Trash2, Search, X, AlertTriangle } from 'lucide-react';

interface User {
  id_user: number;
  nama: string;
  email: string;
  nip: string;
  role: string;
  jabatan: string;
  instansi: string;
  no_hp: string;
  status_aktif: boolean;
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([
    {
      id_user: 1,
      nama: 'Budi Santoso',
      email: 'budi.santoso@protokol.go.id',
      nip: '198501012010011001',
      role: 'Admin',
      jabatan: 'Administrator Sistem',
      instansi: 'Bagian Protokol dan Komunikasi Pimpinan',
      no_hp: '081234567890',
      status_aktif: true
    },
    {
      id_user: 2,
      nama: 'Siti Rahma',
      email: 'siti.rahma@protokol.go.id',
      nip: '198602152010012001',
      role: 'Sespri',
      jabatan: 'Sekretaris Pribadi',
      instansi: 'Bagian Protokol dan Komunikasi Pimpinan',
      no_hp: '081234567891',
      status_aktif: true
    },
    {
      id_user: 3,
      nama: 'Ahmad Hidayat',
      email: 'ahmad.hidayat@protokol.go.id',
      nip: '198703202010011002',
      role: 'Kasubag Protokol',
      jabatan: 'Kepala Subbagian Protokol',
      instansi: 'Bagian Protokol dan Komunikasi Pimpinan',
      no_hp: '081234567892',
      status_aktif: true
    },
    {
      id_user: 4,
      nama: 'Dewi Lestari',
      email: 'dewi.lestari@protokol.go.id',
      nip: '198804102010012002',
      role: 'Kasubag Media',
      jabatan: 'Kepala Subbagian Media',
      instansi: 'Bagian Protokol dan Komunikasi Pimpinan',
      no_hp: '081234567893',
      status_aktif: true
    },
    {
      id_user: 5,
      nama: 'Eko Prasetyo',
      email: 'eko.prasetyo@protokol.go.id',
      nip: '198905252010011003',
      role: 'Ajudan',
      jabatan: 'Ajudan Pimpinan',
      instansi: 'Bagian Protokol dan Komunikasi Pimpinan',
      no_hp: '081234567894',
      status_aktif: true
    },
    {
      id_user: 6,
      nama: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@protokol.go.id',
      nip: '199006302015012001',
      role: 'Staf Media',
      jabatan: 'Staf Dokumentasi',
      instansi: 'Bagian Protokol dan Komunikasi Pimpinan',
      no_hp: '081234567895',
      status_aktif: true
    },
    {
      id_user: 7,
      nama: 'Bambang Wijaya',
      email: 'bambang.wijaya@protokol.go.id',
      nip: '199107152015011001',
      role: 'Staf Protokol',
      jabatan: 'Staf Pelaksana Protokol',
      instansi: 'Bagian Protokol dan Komunikasi Pimpinan',
      no_hp: '081234567896',
      status_aktif: true
    },
    {
      id_user: 8,
      nama: 'Rina Kusuma',
      email: 'rina.kusuma@dinaspendidikan.go.id',
      nip: '198208202012012001',
      role: 'Pemohon',
      jabatan: 'Kepala Dinas',
      instansi: 'Dinas Pendidikan',
      no_hp: '081234567897',
      status_aktif: false
    },
  ]);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    nip: '',
    password: '',
    confirm_password: '',
    role: '',
    jabatan: '',
    instansi: '',
    no_hp: '',
    status_aktif: true
  });

  // Role yang bisa ditambahkan (tidak termasuk Admin dan Pemohon)
  const roleOptions = [
    'Sespri',
    'Kasubag Protokol',
    'Kasubag Media',
    'Ajudan',
    'Staf Protokol',
    'Staf Media'
  ];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Admin': return 'danger';
      case 'Sespri': return 'info';
      case 'Kasubag Protokol': return 'success';
      case 'Kasubag Media': return 'success';
      case 'Ajudan': return 'info';
      case 'Staf Protokol': return 'default';
      case 'Staf Media': return 'default';
      case 'Pemohon': return 'warning';
      default: return 'default';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.nip.includes(searchTerm);
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const roles = [...new Set(users.map(u => u.role))];

  const handleAdd = () => {
    setModalMode('add');
    setSelectedUser(null);
    setFormData({
      nama: '',
      email: '',
      nip: '',
      password: '',
      confirm_password: '',
      role: '',
      jabatan: '',
      instansi: '',
      no_hp: '',
      status_aktif: true
    });
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      nama: user.nama,
      email: user.email,
      nip: user.nip,
      password: '',
      confirm_password: '',
      role: user.role,
      jabatan: user.jabatan,
      instansi: user.instansi,
      no_hp: user.no_hp,
      status_aktif: user.status_aktif
    });
    setShowModal(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id_user !== userToDelete.id_user));
      alert('User berhasil dihapus!');
      setShowDeleteModal(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      // Validasi email unik
      if (users.some(u => u.email === formData.email)) {
        alert('Email sudah digunakan! Gunakan email lain.');
        return;
      }

      // Validasi NIP unik
      if (users.some(u => u.nip === formData.nip)) {
        alert('NIP sudah terdaftar! Gunakan NIP lain.');
        return;
      }

      // Validasi password dan konfirmasi password
      if (formData.password !== formData.confirm_password) {
        alert('Password dan konfirmasi password tidak cocok!');
        return;
      }

      const newUser: User = {
        id_user: Math.max(...users.map(u => u.id_user)) + 1,
        nama: formData.nama,
        email: formData.email,
        nip: formData.nip,
        role: formData.role,
        jabatan: formData.jabatan,
        instansi: formData.instansi,
        no_hp: formData.no_hp,
        status_aktif: formData.status_aktif
      };

      setUsers([...users, newUser]);
      alert('User berhasil ditambahkan!');
    } else {
      // Validasi email unik (kecuali email sendiri)
      if (users.some(u => u.email === formData.email && u.id_user !== selectedUser?.id_user)) {
        alert('Email sudah digunakan! Gunakan email lain.');
        return;
      }

      // Validasi NIP unik (kecuali NIP sendiri)
      if (users.some(u => u.nip === formData.nip && u.id_user !== selectedUser?.id_user)) {
        alert('NIP sudah terdaftar! Gunakan NIP lain.');
        return;
      }

      setUsers(users.map(user => 
        user.id_user === selectedUser?.id_user 
          ? {
              ...user,
              nama: formData.nama,
              email: formData.email,
              nip: formData.nip,
              role: formData.role,
              jabatan: formData.jabatan,
              instansi: formData.instansi,
              no_hp: formData.no_hp,
              status_aktif: formData.status_aktif
            }
          : user
      ));
      alert('User berhasil diupdate!');
    }
    
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola pengguna dan role akses sistem</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah User
        </Button>
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Informasi:</strong> Admin hanya dapat menambahkan user dengan role: <strong>Sespri, Kasubag Protokol, Kasubag Media, Ajudan, Staf Protokol, dan Staf Media</strong>. Role Admin dan Pemohon tidak dapat ditambahkan melalui menu ini.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, jabatan, atau NIP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        >
          <option value="all">Semua Role</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Pengguna</h3>
            <p className="text-sm text-gray-600">Total: {filteredUsers.length} user</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Instansi</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Tidak ada data user yang sesuai dengan pencarian
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id_user}>
                    <TableCell className="font-medium">{user.nama}</TableCell>
                    <TableCell className="text-sm font-mono text-gray-600">{user.nip}</TableCell>
                    <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user.jabatan}</TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                      {user.instansi}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{user.no_hp}</TableCell>
                    <TableCell>
                      <Badge variant={user.status_aktif ? 'success' : 'default'}>
                        {user.status_aktif ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Add/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'add' ? 'Tambah User Baru' : 'Edit User'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Budi Santoso"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nip"
                      value={formData.nip}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="198501012010011001"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="user@protokol.go.id"
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
                      value={formData.no_hp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="081234567890"
                      required
                    />
                  </div>

                  {modalMode === 'add' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Minimal 8 karakter"
                        minLength={8}
                        required
                      />
                    </div>
                  )}

                  {modalMode === 'add' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konfirmasi Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Minimal 8 karakter"
                        minLength={8}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    >
                      <option value="">Pilih Role...</option>
                      {roleOptions.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jabatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jabatan"
                      value={formData.jabatan}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Administrator Sistem"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instansi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="instansi"
                      value={formData.instansi}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Bagian Protokol dan Komunikasi Pimpinan"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="status_aktif"
                        checked={formData.status_aktif}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Status Aktif</span>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Catatan:</strong>
                  </p>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4 list-disc">
                    <li>Email dan NIP harus unik untuk setiap user</li>
                    <li>Password minimal 8 karakter</li>
                    {modalMode === 'add' && (
                      <li>Password dan Konfirmasi Password harus sama</li>
                    )}
                    {modalMode === 'edit' && (
                      <li>Kosongkan password jika tidak ingin mengubahnya</li>
                    )}
                    <li>Status Aktif menentukan apakah user dapat login ke sistem</li>
                    <li>Role yang tersedia: Sespri, Kasubag Protokol, Kasubag Media, Ajudan, Staf Protokol, Staf Media</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    {modalMode === 'add' ? 'Tambah User' : 'Update User'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Delete User */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Konfirmasi Hapus User
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Icon & Message */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2">
                      Apakah Anda yakin ingin menghapus user berikut?
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
                      <p className="text-sm font-semibold text-gray-900">{userToDelete.nama}</p>
                      <p className="text-xs text-gray-600">{userToDelete.email}</p>
                      <p className="text-xs text-gray-600">{userToDelete.role} - {userToDelete.jabatan}</p>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    <strong>Peringatan:</strong> Data yang dihapus tidak dapat dikembalikan. Pastikan Anda yakin dengan tindakan ini.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowDeleteModal(false)} 
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button 
                    type="button" 
                    variant="danger" 
                    onClick={confirmDelete} 
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus User
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}