import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Plus, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { periodeApi } from '../../lib/api';
import Swal from 'sweetalert2';

export default function PeriodeManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedPeriode, setSelectedPeriode] = useState<any>(null);
  const [periodeList, setPeriodeList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    periode: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    keterangan: '',
    status: 'Aktif'
  });

  const fetchPeriode = async () => {
    setIsLoading(true);
    try {
      const response = await periodeApi.getAll();
      if (response.success) {
        setPeriodeList(response.data);
      } else {
        setError(response.message);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: response.message,
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat data periode';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriode();
  }, []);

  const handleAdd = () => {
    setModalMode('add');
    setSelectedPeriode(null);
    setFormData({
      periode: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      keterangan: '',
      status: 'Aktif'
    });
    setShowModal(true);
  };

  const handleEdit = (periode: any) => {
    setModalMode('edit');
    setSelectedPeriode(periode);
    setFormData({
      periode: periode.nama_periode,
      tanggal_mulai: periode.tanggal_mulai,
      tanggal_selesai: periode.tanggal_selesai,
      keterangan: periode.keterangan || '',
      status: periode.status_periode === 'aktif' ? 'Aktif' : 'Nonaktif'
    });
    setShowModal(true);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Convert status to backend format if needed. 
    // Backend expects 'aktif' or 'nonaktif' (lowercase).
    const payload = {
      nama_periode: formData.periode,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
      keterangan: formData.keterangan,
      status_periode: formData.status.toLowerCase()
    };

    try {
      let response;
      if (modalMode === 'add') {
        response = await periodeApi.create(payload);
      } else {
        response = await periodeApi.update(selectedPeriode.id_periode, payload);
      }

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `Periode berhasil ${modalMode === 'add' ? 'ditambahkan' : 'diupdate'}!`,
          timer: 2000,
          showConfirmButton: false
        });
        setShowModal(false);
        fetchPeriode();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: response.message,
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };


  const totalPages = Math.ceil(periodeList.length / ITEMS_PER_PAGE);
  const paginatedPeriode = periodeList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Periode Management</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data periode jabatan pimpinan</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Periode
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Daftar Periode</h3>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && <div className="p-4 text-center">Loading...</div>}
          {error && <div className="p-4 text-center text-red-500">{error}</div>}

          {!isLoading && !error && (
            <>
              <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
                      <TableHead className="text-sm font-bold text-gray-900 text-center w-12 py-4">No.</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4">Periode</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4">Tanggal Mulai</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4">Tanggal Selesai</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4">Keterangan</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 py-4">Status</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 text-center py-4">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {periodeList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">Tidak ada data periode</TableCell>
                    </TableRow>
                  ) : (
                    paginatedPeriode.map((periode, index) => (
                    <TableRow key={periode.id_periode} className="hover:bg-blue-50/40 transition-colors even:bg-blue-50/60">
                      <TableCell className="text-center font-bold text-gray-400 text-xs">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                      <TableCell className="font-semibold text-gray-900 text-sm whitespace-normal min-w-[150px]">{periode.nama_periode}</TableCell>
                      <TableCell className="text-sm text-gray-500 font-medium tracking-tight">
                        {new Date(periode.tanggal_mulai).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 font-medium tracking-tight">
                        {new Date(periode.tanggal_selesai).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 italic font-medium">{periode.keterangan || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={periode.status_periode === 'aktif' ? 'success' : 'secondary'} className="text-[10px] font-bold">
                          {periode.status_periode === 'aktif' ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(periode)}
                            className="h-9 w-9 p-0 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 border border-amber-100 rounded-xl transition-all shadow-sm"
                          >
                            <Edit2 className="w-4 h-4" />
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
                    Menampilkan <span className="text-gray-600">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="text-gray-600">{Math.min(currentPage * ITEMS_PER_PAGE, periodeList.length)}</span> dari <span className="text-gray-600">{periodeList.length}</span> data
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                {modalMode === 'add' ? 'Tambah Periode' : 'Edit Periode'}
              </h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                    Nama Periode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="periode"
                    value={formData.periode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Contoh: Periode 2020-2025"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggal_mulai"
                      value={formData.tanggal_mulai}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                      Tanggal Selesai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="tanggal_selesai"
                      value={formData.tanggal_selesai}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                    Keterangan
                  </label>
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Keterangan periode..."
                  />
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


    </div>
  );
}