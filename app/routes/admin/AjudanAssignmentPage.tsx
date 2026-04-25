import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Plus, Trash2, Search, X, UserCheck, ChevronLeft, ChevronRight, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { userApi, pimpinanApi, periodeApi, ajudanAssignmentApi } from '../../lib/api';
import { toast } from '../../lib/swal';

export default function AjudanAssignmentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'aktif' | 'nonaktif'>('all');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [assignments, setAssignments] = useState<any[]>([]);
  const [ajudans, setAjudans] = useState<any[]>([]);
  const [allPimpinan, setAllPimpinan] = useState<any[]>([]); // These are actually PeriodeJabatan records
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [formData, setFormData] = useState({
    id_user_ajudan: '',
    id_pimpinan_jabatan: '', // Composite key string: id_jabatan|id_periode
    keterangan: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [assignRes, userRes, pimpinanRes] = await Promise.all([
        ajudanAssignmentApi.getAll(),
        userApi.getAll(),
        pimpinanApi.getAll()
      ]);

      if (assignRes.success) {
        setAssignments(assignRes.data);
      } else {
        toast.error('Gagal', assignRes.message || 'Gagal memuat data penugasan');
      }

      if (userRes.success) {
        setAjudans(userRes.data.filter((u: any) => u.role?.nama_role?.toLowerCase() === 'ajudan'));
      } else {
        toast.error('Gagal', userRes.message || 'Gagal memuat data ajudan');
      }

      if (pimpinanRes.success) {
        // filter active pimpinan assignments
        setAllPimpinan(pimpinanRes.data.filter((p: any) => p.status_aktif === 'aktif'));
      } else {
        toast.error('Gagal', pimpinanRes.message || 'Gagal memuat data pimpinan');
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error('Gagal memuat data penugasan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAssignments = assignments.filter(item => {
    const ajudanName = item.ajudan?.nama?.toLowerCase() || '';
    const pimpinanName = item.periodeJabatan?.pimpinan?.nama_pimpinan?.toLowerCase() || '';
    const matchesSearch = ajudanName.includes(searchTerm.toLowerCase()) ||
      pimpinanName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status_aktif === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAssignments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleAddAssignment = () => {
    setFormData({ id_user_ajudan: '', id_pimpinan_jabatan: '', keterangan: '' });
    setShowModal(true);
  };

  const handleToggleActive = async (item: any) => {
    if (item.status_aktif === 'aktif') return;

    const { isConfirmed } = await toast.confirm(
      'Aktifkan Penugasan?',
      `Penugasan ajudan ${item.ajudan?.nama} untuk ${item.periodeJabatan?.pimpinan?.nama_pimpinan} akan menjadi aktif. Penugasan lainnya akan dinonaktifkan.`
    );

    if (isConfirmed) {
      try {
        const res = await ajudanAssignmentApi.setActive({
          id_user_ajudan: item.id_user_ajudan,
          id_jabatan: item.id_jabatan,
          id_periode: item.id_periode
        });

        if (res.success) {
          toast.success('Berhasil!', 'Status penugasan telah diperbarui.');
          fetchData();
        } else {
          toast.error('Gagal', res.message);
        }
      } catch (error) {
        toast.error('Error', 'Terjadi kesalahan sistem');
      }
    }
  };

  const handleDelete = async (item: any) => {
    const { isConfirmed } = await toast.confirm(
      'Hapus Penugasan?',
      "Data penugasan akan dihapus permanen.",
      'danger'
    );

    if (isConfirmed) {
      try {
        const res = await ajudanAssignmentApi.delete({
          id_user_ajudan: item.id_user_ajudan,
          id_jabatan: item.id_jabatan,
          id_periode: item.id_periode
        });

        if (res.success) {
          toast.success('Berhasil!', 'Penugasan telah dihapus.');
          fetchData();
        } else {
          toast.error('Gagal', res.message);
        }
      } catch (error) {
        toast.error('Error', 'Terjadi kesalahan sistem');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_user_ajudan || !formData.id_pimpinan_jabatan) {
      toast.warning('Peringatan', 'Harap isi semua data yang wajib');
      return;
    }

    setIsLoading(true);
    try {
      const [id_jabatan, id_periode] = formData.id_pimpinan_jabatan.split('|');
      const res = await ajudanAssignmentApi.create({
        id_user_ajudan: formData.id_user_ajudan,
        id_jabatan,
        id_periode,
        keterangan: formData.keterangan
      });

      if (res.success) {
        toast.success('Berhasil!', 'Penugasan baru telah ditambahkan.');
        setShowModal(false);
        fetchData();
      } else {
        toast.error('Gagal', res.message);
      }
    } catch (error: any) {
      toast.error('Error', error.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Penugasan Ajudan</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola tugas pendampingan ajudan kepada pimpinan</p>
        </div>
        <Button onClick={handleAddAssignment} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Penugasan
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-blue-50/30">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari ajudan atau pimpinan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white shadow-sm flex-1 md:flex-none"
            >
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
            <Button variant="outline" size="icon" onClick={fetchData} className="rounded-xl border-gray-200">
              <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
                <TableHead className="text-sm font-bold text-gray-900 text-center w-12 py-4">No.</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Ajudan</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Mendampingi Pimpinan</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 py-4">Periode</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 text-center py-4">Status Aktif</TableHead>
                <TableHead className="text-sm font-bold text-gray-900 text-center py-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                      <span className="font-medium italic">Memuat data penugasan...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredAssignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500 font-medium italic">
                    Tidak ada data penugasan ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-blue-50/40 transition-colors even:bg-blue-50/60">
                    <TableCell className="text-center font-bold text-gray-400 text-xs">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shadow-sm">
                          {item.ajudan?.nama?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm tracking-tight">{item.ajudan?.nama}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{item.ajudan?.nip || 'Non-PNS'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-900 text-sm tracking-tight">{item.periodeJabatan?.pimpinan?.nama_pimpinan}</p>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{item.periodeJabatan?.jabatan?.nama_jabatan}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-bold">
                        {item.periodeJabatan?.periode?.nama_periode}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge
                          data-testid="status-badge"
                          variant={item.status_aktif === 'aktif' ? 'success' : 'secondary'}
                          className="text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleToggleActive(item)}
                        >
                          {item.status_aktif === 'aktif' ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                        <input
                          type="checkbox"
                          data-testid="status-checkbox"
                          className="hidden"
                          checked={item.status_aktif === 'aktif'}
                          readOnly
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid="edit-button"
                          onClick={() => handleToggleActive(item)}
                          disabled={item.status_aktif === 'aktif'}
                          title="Set as Active"
                          className="h-9 w-9 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-100 rounded-xl disabled:opacity-30"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid="delete-button"
                          onClick={() => handleDelete(item)}
                          title="Hapus Penugasan"
                          className="h-9 w-9 p-0 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100 rounded-xl"
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

          {totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/30">
              <div className="text-xs font-bold text-gray-400">
                Menampilkan <span className="text-gray-600">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="text-gray-600">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAssignments.length)}</span> dari <span className="text-gray-600">{filteredAssignments.length}</span> data
              </div>
              <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid="pagination-prev"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-8 px-2 text-xs font-bold rounded-lg"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid="pagination-next"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="h-8 px-2 text-xs font-bold rounded-lg"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Warning */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-xs text-amber-900 font-medium">
          <strong>Catatan:</strong> Hanya ada satu status <b>Aktif</b> untuk setiap ajudan. Penugasan yang aktif akan menentukan pimpinan mana yang dikelola agendanya oleh ajudan tersebut.
        </p>
      </div>

      {showModal && (
        <div data-testid="modal-container" className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-inter">
          <Card className="max-w-md w-full shadow-2xl border-none">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Tambah Penugasan Ajudan</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="ajudan-select" className="text-xs font-bold text-gray-400 ml-1 mb-2 block uppercase tracking-wider">Pilih Ajudan</label>
                  <select
                    id="ajudan-select"
                    data-testid="select-ajudan"
                    value={formData.id_user_ajudan}
                    onChange={(e) => setFormData({ ...formData, id_user_ajudan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value="">-- Pilih Ajudan --</option>
                    {ajudans.map(user => (
                      <option key={user.id_user} value={user.id_user}>{user.nama} ({user.nip || 'Non-PNS'})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="pimpinan-select" className="text-xs font-bold text-gray-400 ml-1 mb-2 block uppercase tracking-wider">Pilih Pimpinan & Periode</label>
                  <select
                    id="pimpinan-select"
                    data-testid="select-pimpinan"
                    value={formData.id_pimpinan_jabatan}
                    onChange={(e) => setFormData({ ...formData, id_pimpinan_jabatan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value="">-- Pilih Pimpinan (Aktif) --</option>
                    {allPimpinan.map(p => (
                      <option key={`${p.id_jabatan}|${p.id_periode}`} value={`${p.id_jabatan}|${p.id_periode}`}>
                        {p.pimpinan?.nama_pimpinan} - {p.jabatan?.nama_jabatan} ({p.periode?.nama_periode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block uppercase tracking-wider">Keterangan (Opsional)</label>
                  <textarea
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    placeholder="Contoh: Pendamping Utama"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-xl text-gray-500"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Simpan Penugasan'}
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
