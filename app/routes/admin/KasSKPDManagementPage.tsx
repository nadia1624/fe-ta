import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Plus, Edit2, Trash2, X, AlertTriangle, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { kaskpdApi } from '../../lib/api';
import { toast } from '../../lib/swal';

export default function KasSKPDManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemList, setItemList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [formData, setFormData] = useState({
    nama_instansi: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await kaskpdApi.getAll();
      if (response.success) {
        setItemList(response.data);
      } else {
        setError(response.message);
        toast.error('Gagal Memuat Data', response.message);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal memuat data KaSKPD';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(itemList.length / ITEMS_PER_PAGE);
  const paginatedItemList = itemList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleAdd = () => {
    setModalMode('add');
    setSelectedItem(null);
    setFormData({
      nama_instansi: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      nama_instansi: item.nama_instansi
    });
    setShowModal(true);
  };

  const handleDelete = async (item: any) => {
    const { isConfirmed } = await toast.confirm(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus data KaSKPD "${item.nama_instansi}"?`,
      'danger',
      `<p class="text-xs text-amber-800 leading-relaxed font-medium bg-amber-50 p-3 rounded-lg border border-amber-200 mt-4">
        <strong>Perhatian:</strong> Penghapusan ini bersifat permanen. Data tidak dapat dihapus jika instansi ini sudah terdaftar sebagai pendamping dalam agenda pimpinan.
      </p>`
    );

    if (isConfirmed) {
      setIsLoading(true);
      try {
        const response = await kaskpdApi.delete(item.id_ka_skpd);
        if (response.success) {
          toast.success('Terhapus!', `KaSKPD "${item.nama_instansi}" berhasil dihapus!`);
          fetchData();
        } else {
          toast.error('Gagal Menghapus', response.message);
        }
      } catch (err: any) {
        toast.error('Terjadi Kesalahan', err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      nama_instansi: formData.nama_instansi
    };

    try {
      let response;
      if (modalMode === 'add') {
        response = await kaskpdApi.create(payload);
      } else {
        response = await kaskpdApi.update(selectedItem.id_ka_skpd, payload);
      }

      if (response.success) {
        toast.success('Berhasil!', `KaSKPD berhasil ${modalMode === 'add' ? 'ditambahkan' : 'diupdate'}!`);
        setShowModal(false);
        fetchData();
      } else {
        toast.error('Gagal', response.message);
      }
    } catch (err: any) {
      toast.error('Terjadi Kesalahan', err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">KaSKPD Management</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola data instansi KaSKPD pendamping</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah KaSKPD
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Instansi KaSKPD</h3>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && !itemList.length && <div className="p-4 text-center">Loading...</div>}
          {error && <div className="p-4 text-center text-red-500">{error}</div>}

          {!isLoading && !error && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80 border-b border-gray-200 hover:bg-gray-50/80 transition-colors">
                      <TableHead className="text-sm font-bold text-gray-900 text-center w-12 px-4 py-4">No.</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 px-4 py-4">Nama Instansi</TableHead>
                      <TableHead className="text-sm font-bold text-gray-900 text-center w-[150px] px-4 py-4">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItemList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500 font-medium italic">
                          Tidak ada data KaSKPD ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedItemList.map((item, index) => (
                        <TableRow key={item.id_ka_skpd} className="hover:bg-blue-50/40 transition-colors even:bg-blue-50/60">
                          <TableCell className="text-center font-bold text-gray-400 text-xs px-4 py-3">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                          <TableCell className="font-semibold text-gray-900 text-sm px-4 py-3 font-inter">{item.nama_instansi}</TableCell>
                          <TableCell className="px-4 py-3">
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
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 bg-gray-50/30 font-inter">
                  <div className="text-xs font-bold text-gray-400 tracking-tight">
                    Menampilkan <span className="text-gray-600">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="text-gray-600">{Math.min(currentPage * ITEMS_PER_PAGE, itemList.length)}</span> dari <span className="text-gray-600">{itemList.length}</span> data
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
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-inter">
          <Card className="max-w-md w-full shadow-2xl border-none">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'add' ? 'Tambah KaSKPD' : 'Edit KaSKPD'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">


                <div>
                  <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">
                    Nama Instansi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_instansi"
                    value={formData.nama_instansi}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Masukkan nama instansi"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 py-2.5">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100" disabled={isLoading}>
                    {isLoading ? 'Menyimpan...' : (modalMode === 'add' ? 'Tambah Data' : 'Update Data')}
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
