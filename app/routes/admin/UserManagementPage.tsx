import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash2, Search, X, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { userApi, pimpinanApi, periodeApi } from '../../lib/api';
import { toast } from '../../lib/swal';

interface Pimpinan {
  id_pimpinan: string;
  nama_pimpinan: string;
  nip: string;
  jabatan: string;
  status: string;
}

interface User {
  id_user: number;
  nama: string;
  email: string;
  nip: string;
  role: {
    id_role: number;
    nama_role: string;
  };
  jabatan: string;
  instansi: string;
  no_hp: string;
  status_aktif: boolean | string;
  pimpinanAjudans?: any[];
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;


  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    nip: '',
    password: '',
    confirm_password: '',
    role_id: '',
    jabatan: '',
    instansi: '',
    no_hp: '',
    status_aktif: true,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        userApi.getAll(),
        userApi.getRoles()
      ]);

      if (usersRes.success) setUsers(usersRes.data);
      if (rolesRes.success) setRoles(rolesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case 'Admin': return 'destructive';
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
    const roleName = user.role?.nama_role || '';
    const matchesSearch = user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.nip && user.nip.includes(searchTerm)) ||
      roleName.toLowerCase().includes(searchTerm.toLowerCase());

    // Check filterRole against roleName
    const matchesFilter = filterRole === 'all' || roleName === filterRole;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  const uniqueRoles = [...new Set(users.map(u => u.role?.nama_role).filter(Boolean))];

  const handleAdd = () => {
    setModalMode('add');
    setSelectedUser(null);
    setFormData({
      nama: '',
      email: '',
      nip: '',
      password: '',
      confirm_password: '',
      role_id: '',
      jabatan: '',
      instansi: '',
      no_hp: '',
      status_aktif: true
    });
    setShowModal(true);
  };

  const handleEdit = (user: any) => {
    setModalMode('edit');
    setSelectedUser(user);

    setFormData({
      nama: user.nama,
      email: user.email,
      nip: user.nip || '',
      password: '',
      confirm_password: '',
      role_id: user.id_role ? String(user.id_role) : '',
      jabatan: user.jabatan || '',
      instansi: user.instansi || '',
      no_hp: user.no_hp || '',
      status_aktif: user.status_aktif === 'aktif' || user.status_aktif === true,
    });

    setShowModal(true);
  };

  const handleDelete = async (user: any) => {
    // Prevent deleting Admin
    if (user.role?.nama_role === 'Admin') {
      return toast.error('Hapus Ditolak', 'User dengan role Admin tidak dapat dihapus');
    }

    const { isConfirmed } = await toast.confirm(
      'Konfirmasi Hapus User',
      `Apakah Anda yakin ingin menghapus user ${user.nama}?`,
      'danger',
      `<div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left mt-4 space-y-1">
        <p class="text-sm font-bold text-gray-900">${user.nama}</p>
        <p class="text-xs text-gray-500">${user.email}</p>
        <p class="text-xs text-gray-500 font-medium">${user.role?.nama_role} - ${user.instansi}</p>
      </div>
      <p class="text-xs text-red-500 font-medium mt-3 text-center italic">Tindakan ini tidak dapat dikembalikan!</p>`
    );

    if (isConfirmed) {
      setIsLoading(true);
      try {
        const res = await userApi.delete(user.id_user);
        if (res.success) {
          toast.success('Berhasil!', 'User telah dihapus.');
          fetchData();
        } else {
          toast.error('Gagal', res.message);
        }
      } catch (error: any) {
        toast.error('Error', error.message || 'Gagal menghapus user');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Password Validation
    if (modalMode === 'add' || (modalMode === 'edit' && formData.password)) {
      if (formData.password !== formData.confirm_password) {
        toast.error('Gagal', 'Password dan konfirmasi password tidak cocok!');
        setIsLoading(false);
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        status_aktif: formData.status_aktif ? 'aktif' : 'nonaktif'
      };

      let response;
      if (modalMode === 'add') {
        response = await userApi.create(payload);
      } else {
        response = await userApi.update(selectedUser.id_user, payload);
      }

      if (response.success) {
        toast.success('Berhasil!', `User berhasil ${modalMode === 'add' ? 'ditambahkan' : 'diupdate'}!`);
        setShowModal(false);
        fetchData();
      } else {
        toast.error('Gagal', response.message);
      }
    } catch (error: any) {
      toast.error('Error', error.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola pengguna dan role akses sistem</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah User
        </Button>
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Informasi:</strong> Admin hanya dapat menambahkan user dengan role tertentu.
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
            <option key={role.id_role} value={role.nama_role}>{role.nama_role}</option>
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
              <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
                <TableHead className="text-sm font-bold text-gray-900 text-center w-12 py-4">No.</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Nama</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">NIP</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Email</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Role</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Instansi</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">No. HP</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Status</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 text-center py-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500 font-medium italic">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500 font-medium italic">
                    Tidak ada data user yang sesuai dengan pencarian
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => (
                  <TableRow key={user.id_user} className="hover:bg-blue-50/40 transition-colors even:bg-blue-50/60">
                    <TableCell className="text-center font-bold text-gray-400 text-xs">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                    <TableCell className="font-semibold text-gray-900 text-sm whitespace-normal min-w-[150px]">{user.nama}</TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 tracking-tight">{user.nip || '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role?.nama_role)} className="text-[10px] font-bold px-2 py-0">
                        {user.role?.nama_role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      <span className="font-medium">{user.instansi || '-'}</span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 font-medium">{user.no_hp || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.status_aktif === 'aktif' || user.status_aktif === true ? 'success' : 'secondary'} className="text-[10px] font-bold">
                        {user.status_aktif === 'aktif' || user.status_aktif === true ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(user)}
                          className="h-9 w-9 p-0 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 border border-amber-100 rounded-xl transition-all shadow-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.role?.nama_role !== 'Admin' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(user)}
                            className="h-9 w-9 p-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100 rounded-xl transition-all shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
              <div className="text-xs font-bold text-gray-400 tracking-tight">
                Menampilkan <span className="text-gray-600">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="text-gray-600">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> dari <span className="text-gray-600">{filteredUsers.length}</span> data
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-2 text-xs font-bold text-gray-500 hover:text-blue-600 border-gray-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Prev
                </Button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                          : 'text-gray-400 hover:bg-white hover:text-gray-600 border border-transparent hover:border-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2 text-xs font-bold text-gray-500 hover:text-blue-600 border-gray-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Add/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
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
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
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
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
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
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
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

                  <div>
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                      Password {modalMode === 'add' ? <span className="text-red-500">*</span> : <span className="text-gray-500 text-[10px] lowercase tracking-normal">(Kosongkan jika tidak ingin mengubah)</span>}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder={modalMode === 'add' ? "Minimal 8 karakter" : "Biarkan kosong untuk password lama"}
                      minLength={8}
                      required={modalMode === 'add'}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                      Konfirmasi Password {modalMode === 'add' ? <span className="text-red-500">*</span> : <span className="text-gray-500 text-[10px] lowercase tracking-normal">(Opsional)</span>}
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder={modalMode === 'add' ? "Minimal 8 karakter" : "Konfirmasi password baru"}
                      minLength={8}
                      required={modalMode === 'add' ? true : formData.password.length > 0}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role_id"
                      value={formData.role_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    >
                      <option value="">Pilih Role...</option>
                      {roles.map(role => (
                        <option key={role.id_role} value={role.id_role}>{role.nama_role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                      Jabatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jabatan"
                      value={formData.jabatan}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Administrator Sistem"
                    // required // Optional now as it might be inferred
                    />
                  </div>
                </div>

                {/* Ajudan Assignment removed - now managed in Penugasan Ajudan menu */}

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
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
                      checked={Boolean(formData.status_aktif)}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-gray-500">Status Aktif</span>
                  </label>
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


    </div>
  );
}