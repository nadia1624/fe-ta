import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Plus, Edit2, Trash2, X, AlertTriangle, Building2 } from 'lucide-react';
import { kaskpdApi } from '../../lib/api';
import Swal from 'sweetalert2';

export default function KasSKPDManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [itemList, setItemList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: response.message,
        });
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

  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
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
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: `KaSKPD berhasil ${modalMode === 'add' ? 'ditambahkan' : 'diupdate'}!`,
          timer: 2000,
          showConfirmButton: false
        });
        setShowModal(false);
        fetchData();
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

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      setIsLoading(true);
      try {
        const response = await kaskpdApi.delete(itemToDelete.id_ka_skpd);
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: `KaSKPD "${itemToDelete.nama_instansi}" berhasil dihapus!`,
            timer: 2000,
            showConfirmButton: false
          });
          setShowDeleteModal(false);
          fetchData();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghapus',
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
          <h1 className="text-2xl font-semibold text-gray-900">KaSKPD Management</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola data instansi KaSKPD pendamping</p>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-3">Nama Instansi</TableHead>
                    <TableHead className="text-center w-[150px] px-4 py-3">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                        Tidak ada data KaSKPD
                      </TableCell>
                    </TableRow>
                  ) : (
                    itemList.map((item) => (
                      <TableRow key={item.id_ka_skpd}>
                        <TableCell className="font-medium px-4 py-3">{item.nama_instansi}</TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                              <Edit2 className="w-4 h-4 text-amber-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )))}
                </TableBody>
              </Table>
            </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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

      {/* Modal Delete */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-inter">
          <Card className="max-w-md w-full shadow-2xl border-none">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Konfirmasi Hapus
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Apakah Anda yakin ingin menghapus data KaSKPD berikut?
                    </p>
                    <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-4">
                      <p className="text-sm font-bold text-red-900">{itemToDelete.nama_instansi}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    ⚠️ <strong>Perhatian:</strong> Penghapusan ini bersifat permanen. Jika instansi ini sudah digunakan dalam agenda pimpinan, penghapusan mungkin akan gagal atau menyebabkan data terkait terpengaruh.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2.5"
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 shadow-md shadow-red-100"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Menghapus...' : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus Data
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
