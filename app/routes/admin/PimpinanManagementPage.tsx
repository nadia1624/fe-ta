import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Plus, Edit2, Trash2, X, AlertTriangle, Search, Check, UserPlus, Users, Mail, Calendar, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { pimpinanApi, periodeApi } from '../../lib/api';
import Swal from 'sweetalert2';

export default function PimpinanManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedPimpinan, setSelectedPimpinan] = useState<any>(null);
  const [pimpinanToDelete, setPimpinanToDelete] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pimpinanList, setPimpinanList] = useState<any[]>([]);
  const [periodeOptions, setPeriodeOptions] = useState<any[]>([]);
  const [jabatanOptions, setJabatanOptions] = useState<any[]>([]);
  const [existingPimpinanList, setExistingPimpinanList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'new' | 'existing'>('new');

  const [formData, setFormData] = useState({
    nama_pimpinan: '',
    jabatan: '',
    periode_id: '',
    nip: '',
    email: '',
    no_hp: '',
    status: 'Aktif'
  });

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pimpinanRes, periodeRes, jabatanRes, listRes] = await Promise.all([
        pimpinanApi.getAll(),
        periodeApi.getAll(),
        pimpinanApi.getJabatan(),
        pimpinanApi.getList()
      ]);

      if (pimpinanRes.success) {
        setPimpinanList(pimpinanRes.data);
      }
      if (periodeRes.success) {
        setPeriodeOptions(periodeRes.data);
      }
      if (jabatanRes.success) {
        setJabatanOptions(jabatanRes.data);
      }
      if (listRes.success) {
        setExistingPimpinanList(listRes.data);
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

  const totalPages = Math.ceil(pimpinanList.length / ITEMS_PER_PAGE);
  const paginatedPimpinan = pimpinanList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleAdd = () => {
    setModalMode('add');
    setInputMode('new');
    setSelectedPimpinan(null);
    setFormData({
      nama_pimpinan: '',
      jabatan: '',
      periode_id: '',
      nip: '',
      email: '',
      no_hp: '',
      status: 'Aktif'
    });
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setModalMode('edit');
    setInputMode('new'); // Edit always shows form
    setSelectedPimpinan(item);

    setFormData({
      nama_pimpinan: item.pimpinan?.nama_pimpinan || '',
      jabatan: item.jabatan?.id_jabatan || '',
      periode_id: item.periode?.id_periode || '',
      nip: item.pimpinan?.nip || '',
      email: item.pimpinan?.email || '',
      no_hp: item.pimpinan?.no_hp || '',
      status: item.status_aktif === 'aktif' ? 'Aktif' : 'Nonaktif'
    });
    setShowModal(true);
  };

  const handleDelete = (item: any) => {
    setPimpinanToDelete(item);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      // If mode is 'existing', we might just send ID, but current backend likely expects NIP/Data to find.
      // Or we can send id_pimpinan if backend supports it.
      // The current backend implementation of createOrUpdatePimpinan primarily looks up by NIP.
      // So if 'existing', we must ensure NIP is populated from the selected pimpinan.

      nama_pimpinan: formData.nama_pimpinan,
      nip: formData.nip,
      email: formData.email,
      no_hp: formData.no_hp,
      id_periode: formData.periode_id,
      id_jabatan: formData.jabatan,
      status_aktif: formData.status.toLowerCase()
    };

    try {
      const response = await pimpinanApi.createOrUpdate(payload);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Data pimpinan berhasil ${modalMode === 'add' ? 'ditambahkan' : 'diupdate'}!`,
          timer: 2000,
          showConfirmButton: false
        });
        setShowModal(false);
        fetchData();
      } else {
        Swal.fire('Gagal', response.message, 'error');
      }
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Filter pimpinan list based on search query
  const filteredPimpinan = existingPimpinanList.filter(p =>
    p.nama_pimpinan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPimpinan = (p: any) => {
    setSearchQuery(p.nama_pimpinan);
    setIsDropdownOpen(false);
    setFormData({
      ...formData,
      nama_pimpinan: p.nama_pimpinan,
      nip: p.nip,
      email: p.email,
      no_hp: p.no_hp,
    });
  };

  const handleConfirmDelete = async () => {
    if (pimpinanToDelete) {
      setIsLoading(true);
      try {
        const payload = {
          id_jabatan: pimpinanToDelete.id_jabatan,
          id_periode: pimpinanToDelete.id_periode
        };

        const response = await pimpinanApi.delete(payload);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: `Data pimpinan berhasil dihapus!`,
            timer: 2000,
            showConfirmButton: false
          });
          setShowDeleteModal(false);
          fetchData();
        } else {
          Swal.fire('Gagal', response.message, 'error');
        }
      } catch (error: any) {
        Swal.fire('Error', error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendSync = async (item: any) => {
    const id_pimpinan = item.pimpinan?.id_pimpinan;
    if (!id_pimpinan) return;

    setIsLoading(true);
    try {
      const response = await pimpinanApi.resendSyncInvitation(id_pimpinan);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Undangan sinkronisasi telah dikirim ulang ke email pimpinan.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire('Gagal', response.message, 'error');
      }
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Pimpinan Management</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data Walikota dan Wakil Walikota</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pimpinan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Daftar Pimpinan</h3>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
                <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
                  <TableHead className="text-sm font-bold text-gray-900 text-center w-12 py-4">No.</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Nama Pimpinan</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Jabatan</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Periode</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">NIP</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Email & No HP</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Google Calendar</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 py-4">Status</TableHead>
                  <TableHead className="text-sm font-bold text-gray-900 text-center py-4">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {pimpinanList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">Tidak ada data pimpinan</TableCell>
                </TableRow>
              ) : (
                paginatedPimpinan.map((item: any, index) => (
                  <TableRow key={index} className="hover:bg-blue-50/40 transition-colors even:bg-blue-50/60">
                    <TableCell className="text-center font-bold text-gray-400 text-xs">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                    <TableCell className="font-semibold text-gray-900 text-sm whitespace-normal min-w-[150px]">{item.pimpinan?.nama_pimpinan}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold px-2 py-0">
                        {item.jabatan?.nama_jabatan || item.id_jabatan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 font-medium tracking-tight">{item.periode?.nama_periode}</TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 tracking-tight">{item.pimpinan?.nip}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 text-xs">{item.pimpinan?.email}</span>
                        <span className="text-[10px] text-gray-400 font-bold tracking-tight">{item.pimpinan?.no_hp}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.pimpinan?.is_calendar_synced ? (
                          <Badge variant="success" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-[10px] px-2 py-0">
                            <Calendar className="w-3 h-3 mr-1" /> Tersinkron
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-2 py-0">
                            <RefreshCw className="w-3 h-3 mr-1" /> Belum Sinkron
                          </Badge>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          onClick={() => handleResendSync(item)}
                          title="Kirim ulang undangan sinkronisasi"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={item.status_aktif === 'aktif' ? 'success' : 'secondary'} className="text-[10px] font-bold px-2 py-0">
                          {item.status_aktif === 'aktif' ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(item)}
                          className="h-9 w-9 p-0 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 border border-amber-100 rounded-xl transition-all shadow-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(item)}
                          className="h-9 w-9 p-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100 rounded-xl transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
                Menampilkan <span className="text-gray-600">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="text-gray-600">{Math.min(currentPage * ITEMS_PER_PAGE, pimpinanList.length)}</span> dari <span className="text-gray-600">{pimpinanList.length}</span> data
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

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                {modalMode === 'add' ? 'Tambah Pimpinan' : 'Edit Pimpinan'}
              </h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">

                {modalMode === 'add' && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div
                      onClick={() => {
                        setInputMode('new');
                        setFormData(prev => ({ ...prev, nama_pimpinan: '', nip: '', email: '', no_hp: '' }));
                      }}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center hover:bg-gray-50 ${inputMode === 'new'
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                        : 'border-gray-200 bg-white hover:border-blue-200'
                        }`}
                    >
                      <div className={`p-2 rounded-full ${inputMode === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        <UserPlus className="w-6 h-6" />
                      </div>
                      <div>
                        <p className={`font-semibold ${inputMode === 'new' ? 'text-blue-700' : 'text-gray-700'}`}>Buat Baru</p>
                        <p className="text-xs text-gray-500 mt-1">Input data pimpinan secara manual</p>
                      </div>
                    </div>

                    <div
                      onClick={() => setInputMode('existing')}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center hover:bg-gray-50 ${inputMode === 'existing'
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                        : 'border-gray-200 bg-white hover:border-blue-200'
                        }`}
                    >
                      <div className={`p-2 rounded-full ${inputMode === 'existing' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className={`font-semibold ${inputMode === 'existing' ? 'text-blue-700' : 'text-gray-700'}`}>Pilih Lama</p>
                        <p className="text-xs text-gray-500 mt-1">Pilih dari database pimpinan</p>
                      </div>
                    </div>
                  </div>
                )}

                {inputMode === 'existing' && modalMode === 'add' && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih Pimpinan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Cari nama atau NIP..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        // Delay blurring to allow click on items
                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                      />
                    </div>

                    {isDropdownOpen && filteredPimpinan.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredPimpinan.map((p) => (
                          <div
                            key={p.id_pimpinan}
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                            onMouseDown={(e) => {
                              e.preventDefault(); // Prevent input blur
                              handleSelectPimpinan(p);
                            }}
                          >
                            <div className="font-medium text-gray-900">{p.nama_pimpinan}</div>
                            <div className="text-sm text-gray-500">{p.nip}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {isDropdownOpen && searchQuery && filteredPimpinan.length === 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                        Tidak ada data ditemukan
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                    Nama Pimpinan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_pimpinan"
                    value={formData.nama_pimpinan}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Nama Walikota"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                      Jabatan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="jabatan"
                      value={formData.jabatan}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    >
                      <option value="">Pilih Jabatan...</option>
                      {jabatanOptions.map((jabatan: any) => (
                        <option key={jabatan.id_jabatan} value={jabatan.id_jabatan}>
                          {jabatan.nama_jabatan}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                      Periode <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="periode_id"
                      value={formData.periode_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    >
                      <option value="">Pilih Periode...</option>
                      {periodeOptions.map((periode: any) => (
                        <option key={periode.id_periode} value={periode.id_periode}>
                          {periode.nama_periode}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    placeholder="196512251990031001"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="walikota@kota.go.id"
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
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Menyimpan...' : (modalMode === 'add' ? 'Tambah' : 'Update')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Delete */}
      {showDeleteModal && pimpinanToDelete && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Konfirmasi Hapus Pimpinan
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
                      Apakah Anda yakin ingin menghapus data pimpinan berikut?
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                      <p className="text-sm font-semibold text-gray-900">{pimpinanToDelete.pimpinan?.nama_pimpinan}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {pimpinanToDelete.jabatan?.nama_jabatan}
                        </Badge>
                        <Badge variant={pimpinanToDelete.status_aktif === 'aktif' ? 'success' : 'secondary'}>
                          {pimpinanToDelete.status_aktif === 'aktif' ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                      <div className="pt-1 space-y-1">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Periode:</span> {pimpinanToDelete.periode?.nama_periode}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">NIP:</span> {pimpinanToDelete.pimpinan?.nip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    <strong>Peringatan:</strong> Data pimpinan yang dihapus tidak dapat dikembalikan.
                    Semua agenda dan disposisi yang terkait dengan pimpinan ini akan terpengaruh.
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
                    onClick={handleConfirmDelete}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Menghapus...' : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus Pimpinan
                      </>
                    )}
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