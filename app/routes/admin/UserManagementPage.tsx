import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash2, Search, X, AlertTriangle } from 'lucide-react';
import { userApi, pimpinanApi, periodeApi } from '../../lib/api';
import Swal from 'sweetalert2';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);
  const [pimpinanList, setPimpinanList] = useState<Pimpinan[]>([]);
  const [periodeList, setPeriodeList] = useState<any[]>([]);
  const [availablePeriodes, setAvailablePeriodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [pimpinanSearchQuery, setPimpinanSearchQuery] = useState('');
  const [isPimpinanDropdownOpen, setIsPimpinanDropdownOpen] = useState(false);

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
    // Ajudan specific
    id_pimpinan_ajudan: '', // Used for UI state (selected pimpinan)
    id_jabatan_ajudan: '', // Actual Foreign Key for backend
    id_periode_ajudan: '',
    nama_pimpinan_selected: '' // For UI display only
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, rolesRes, assignmentsRes, periodeRes] = await Promise.all([
        userApi.getAll(),
        userApi.getRoles(),
        pimpinanApi.getActiveAssignments(),
        periodeApi.getAll()
      ]);

      if (usersRes.success) setUsers(usersRes.data);
      if (rolesRes.success) setRoles(rolesRes.data);
      if (periodeRes.success) setPeriodeList(periodeRes.data);

      if (assignmentsRes.success) {
        setActiveAssignments(assignmentsRes.data);

        // Extract unique Pimpinan from active assignments
        const uniquePimpinans = new Map();
        assignmentsRes.data.forEach((item: any) => {
          if (item.pimpinan) {
            uniquePimpinans.set(item.pimpinan.id_pimpinan, { // Use keys from backend properly
              id_pimpinan: item.pimpinan.id_pimpinan,
              nama_pimpinan: item.pimpinan.nama_pimpinan,
              nip: item.pimpinan.nip,
              jabatan: item.jabatan?.nama_jabatan || '',
              status: 'aktif'
            });
          }
        });
        setPimpinanList(Array.from(uniquePimpinans.values()));
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire('Error', 'Gagal memuat data', 'error');
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
      status_aktif: true,
      id_pimpinan_ajudan: '',
      id_jabatan_ajudan: '', // Reset
      id_periode_ajudan: '',
      nama_pimpinan_selected: ''
    });
    setPimpinanSearchQuery('');
    setAvailablePeriodes([]);
    setShowModal(true);
  };

  const handleEdit = (user: any) => {
    setModalMode('edit');
    setSelectedUser(user);

    // Initial Ajudan Data
    let pimpinanId = '';
    let jabatanId = '';
    let periodeId = '';
    let pimpinanName = '';

    if (user.pimpinanAjudans && user.pimpinanAjudans.length > 0) {
      const assignment = user.pimpinanAjudans[0];
      // Structure changed: assignment.periodeJabatan -> pimpinan

      // Before: assignment.id_pimpinan, assignment.periodePimpinan.pimpinan
      // After: assignment.id_jabatan, assignment.periodeJabatan.pimpinan

      // We need to resolve pimpinan from periodeJabatan
      if (assignment.periodeJabatan?.pimpinan) {
        pimpinanId = assignment.periodeJabatan.pimpinan.id_pimpinan;
        pimpinanName = assignment.periodeJabatan.pimpinan.nama_pimpinan;
      }

      jabatanId = assignment.id_jabatan;
      periodeId = assignment.id_periode;
    }

    setFormData({
      nama: user.nama,
      email: user.email,
      nip: user.nip || '',
      password: '',
      confirm_password: '',
      role_id: user.id_role,
      jabatan: user.jabatan || '',
      instansi: user.instansi || '',
      no_hp: user.no_hp || '',
      status_aktif: user.status_aktif === 'aktif' || user.status_aktif === true,
      id_pimpinan_ajudan: pimpinanId,
      id_jabatan_ajudan: jabatanId,
      id_periode_ajudan: periodeId,
      nama_pimpinan_selected: pimpinanName
    });

    setPimpinanSearchQuery(pimpinanName);

    // Set available periodes based on pimpinanId if it exists
    if (pimpinanId) {
      // Find assignments for this pimpinan (assignments are now PeriodeJabatan objects)
      // We filter by pimpinan.id_pimpinan inside the nested object
      const pimpinanAssignments = activeAssignments.filter(a => a.pimpinan?.id_pimpinan === pimpinanId);

      const periods = pimpinanAssignments.map(a => a.periode).filter(Boolean);
      const uniquePeriods = Array.from(new Set(periods.map((p: any) => p.id_periode)))
        .map(id => periods.find((p: any) => p.id_periode === id));
      setAvailablePeriodes(uniquePeriods);
    } else {
      setAvailablePeriodes([]);
    }

    setShowModal(true);
  };

  const handleDelete = (user: any) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      // Prevent deleting Admin
      if (userToDelete.role?.nama_role === 'Admin') {
        Swal.fire('Error', 'User dengan role Admin tidak dapat dihapus', 'error');
        setShowDeleteModal(false);
        setUserToDelete(null);
        return;
      }
      setIsLoading(true);
      try {
        const res = await userApi.delete(userToDelete.id_user);
        if (res.success) {
          Swal.fire('Berhasil!', 'User telah dihapus.', 'success');
          fetchData();
        } else {
          Swal.fire('Gagal', res.message, 'error');
        }
      } catch (error: any) {
        Swal.fire('Error', error.message || 'Gagal menghapus user', 'error');
      } finally {
        setIsLoading(false);
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Password Validation
    if (modalMode === 'add' || (modalMode === 'edit' && formData.password)) {
      if (formData.password !== formData.confirm_password) {
        Swal.fire('Error', 'Password dan konfirmasi password tidak cocok!', 'error');
        setIsLoading(false);
        return;
      }
    }

    // Ajudan Validation
    const selectedRoleObj = roles.find(r => r.id_role == formData.role_id);
    if (selectedRoleObj && selectedRoleObj.nama_role.toLowerCase() === 'ajudan') {
      if (!formData.id_pimpinan_ajudan || !formData.id_periode_ajudan) {
        Swal.fire('Error', 'Untuk Role Ajudan, Pimpinan dan Periode wajib dipilih', 'error');
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
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `User berhasil ${modalMode === 'add' ? 'ditambahkan' : 'diupdate'}!`,
          timer: 1500,
          showConfirmButton: false
        });
        setShowModal(false);
        fetchData();
      } else {
        Swal.fire('Gagal', response.message, 'error');
      }
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Terjadi kesalahan', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'id_periode_ajudan') {
      // When periode selected, find the id_jabatan from assignments
      // We know id_pimpinan_ajudan (selected pimpinan) and now id_periode_ajudan

      const assignment = activeAssignments.find(a =>
        a.pimpinan?.id_pimpinan === formData.id_pimpinan_ajudan &&
        a.id_periode === value
      );

      setFormData({
        ...formData,
        id_periode_ajudan: value,
        id_jabatan_ajudan: assignment ? assignment.id_jabatan : ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      });
    }
  };

  // Filter pimpinan list for dropdown
  const filteredPimpinanList = pimpinanList.filter(p =>
    p.nama_pimpinan.toLowerCase().includes(pimpinanSearchQuery.toLowerCase()) ||
    p.nip.toLowerCase().includes(pimpinanSearchQuery.toLowerCase())
  );

  const isAjudan = () => {
    const selected = roles.find(r => r.id_role == formData.role_id);
    return selected?.nama_role.toLowerCase() === 'ajudan';
  };

  // Update available periodes when pimpinan is selected
  const handlePimpinanSelect = (pimpinan: Pimpinan) => {
    setFormData(prev => ({
      ...prev,
      id_pimpinan_ajudan: pimpinan.id_pimpinan,
      nama_pimpinan_selected: pimpinan.nama_pimpinan,
      id_periode_ajudan: '',
      id_jabatan_ajudan: '' // Reset
    }));
    setPimpinanSearchQuery(pimpinan.nama_pimpinan);
    setIsPimpinanDropdownOpen(false);

    // Filter available periodes containing this pimpinan
    // activeAssignments are PeriodeJabatan records
    const pimpinanAssignments = activeAssignments.filter(a => a.pimpinan?.id_pimpinan === pimpinan.id_pimpinan);
    const periods = pimpinanAssignments.map(a => a.periode).filter(Boolean);
    const uniquePeriods = Array.from(new Set(periods.map((p: any) => p.id_periode)))
      .map(id => periods.find((p: any) => p.id_periode === id));

    setAvailablePeriodes(uniquePeriods);

    // Auto-select if only one
    if (uniquePeriods.length === 1) {
      const selectedPeriodeId = uniquePeriods[0].id_periode;

      // Find the id_jabatan for this single assignment
      const assignment = pimpinanAssignments.find(a => a.id_periode === selectedPeriodeId);

      setFormData(prev => ({
        ...prev,
        id_periode_ajudan: selectedPeriodeId,
        id_jabatan_ajudan: assignment ? assignment.id_jabatan : ''
      }));
    }
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
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Instansi/Pimpinan</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
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
                      <Badge variant={getRoleBadgeVariant(user.role?.nama_role)}>
                        {user.role?.nama_role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.role?.nama_role?.toLowerCase() === 'ajudan' ? (
                        user.pimpinanAjudans?.[0]?.periodeJabatan?.pimpinan?.nama_pimpinan ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-blue-700">{user.pimpinanAjudans[0].periodeJabatan.pimpinan.nama_pimpinan}</span>
                            <span className="text-xs text-gray-400">{user.pimpinanAjudans[0].periodeJabatan.periode?.nama_periode}</span>
                          </div>
                        ) : '-'
                      ) : (
                        user.instansi || '-'
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{user.no_hp}</TableCell>
                    <TableCell>
                      <Badge variant={user.status_aktif === 'aktif' || user.status_aktif === true ? 'success' : 'secondary'}>
                        {user.status_aktif === 'aktif' || user.status_aktif === true ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.role?.nama_role !== 'Admin' && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(user)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        )}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password {modalMode === 'add' ? <span className="text-red-500">*</span> : <span className="text-gray-500 text-xs">(Kosongkan jika tidak ingin mengubah)</span>}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password {modalMode === 'add' ? <span className="text-red-500">*</span> : <span className="text-gray-500 text-xs">(Opsional)</span>}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    // required // Optional now as it might be inferred
                    />
                  </div>
                </div>

                {isAjudan() && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-4">
                    <h4 className="font-semibold text-blue-800 text-sm">Assignment Ajudan</h4>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Pimpinan Searchable Dropdown */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pilih Pimpinan <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            placeholder="Cari Pimpinan..."
                            value={pimpinanSearchQuery}
                            onChange={(e) => {
                              setPimpinanSearchQuery(e.target.value);
                              setIsPimpinanDropdownOpen(true);
                            }}
                            onFocus={() => setIsPimpinanDropdownOpen(true)}
                            onBlur={() => setTimeout(() => setIsPimpinanDropdownOpen(false), 200)}
                          />
                        </div>
                        {isPimpinanDropdownOpen && filteredPimpinanList.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {filteredPimpinanList.map(p => (
                              <div
                                key={p.id_pimpinan}
                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handlePimpinanSelect(p);
                                }}
                              >
                                <div className="font-medium">{p.nama_pimpinan}</div>
                                <div className="text-xs text-gray-500">{p.nip}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Periode Bertugas <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="id_periode_ajudan"
                          value={formData.id_periode_ajudan}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                          <option value="">Pilih Periode</option>
                          {availablePeriodes.map(per => (
                            <option key={per.id_periode} value={per.id_periode}>
                              {per.nama_periode} ({per.tahun_mulai}-{per.tahun_selesai})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

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
                      checked={Boolean(formData.status_aktif)}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Status Aktif</span>
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

      {/* Modal Delete User */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
                      <p className="text-xs text-gray-600">{userToDelete.role?.nama_role} - {userToDelete.instansi}</p>
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
                    variant="destructive"
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