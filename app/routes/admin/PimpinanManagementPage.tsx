import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';

export default function PimpinanManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedPimpinan, setSelectedPimpinan] = useState<any>(null);
  const [pimpinanToDelete, setPimpinanToDelete] = useState<any>(null);

  const [formData, setFormData] = useState({
    nama_pimpinan: '',
    jabatan: '',
    periode_id: '',
    nip: '',
    email: '',
    no_hp: '',
    status: 'Aktif'
  });

  const pimpinanList = [
    {
      id: 1,
      nama_pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      periode: 'Periode 2020-2025',
      nip: '196512251990031001',
      email: 'walikota@kota.go.id',
      no_hp: '081234567890',
      status: 'Aktif'
    },
    {
      id: 2,
      nama_pimpinan: 'Ir. Hj. Siti Rahmawati, M.T',
      jabatan: 'Wakil Walikota',
      periode: 'Periode 2020-2025',
      nip: '196803151991032001',
      email: 'wawali@kota.go.id',
      no_hp: '081234567891',
      status: 'Aktif'
    },
  ];

  const periodeOptions = [
    { id: 1, periode: 'Periode 2020-2025' },
    { id: 2, periode: 'Periode 2015-2020' },
  ];

  const handleAdd = () => {
    setModalMode('add');
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

  const handleEdit = (pimpinan: any) => {
    setModalMode('edit');
    setSelectedPimpinan(pimpinan);
    setFormData({
      nama_pimpinan: pimpinan.nama_pimpinan,
      jabatan: pimpinan.jabatan,
      periode_id: '1',
      nip: pimpinan.nip,
      email: pimpinan.email,
      no_hp: pimpinan.no_hp,
      status: pimpinan.status
    });
    setShowModal(true);
  };

  const handleDelete = (pimpinan: any) => {
    setPimpinanToDelete(pimpinan);
    setShowDeleteModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      alert('Data pimpinan berhasil ditambahkan!');
    } else {
      alert('Data pimpinan berhasil diupdate!');
    }
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmDelete = () => {
    if (pimpinanToDelete) {
      alert(`Data pimpinan "${pimpinanToDelete.nama_pimpinan}" berhasil dihapus!`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pimpinan Management</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola data Walikota dan Wakil Walikota</p>
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
              <TableRow>
                <TableHead>Nama Pimpinan</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>No HP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pimpinanList.map((pimpinan) => (
                <TableRow key={pimpinan.id}>
                  <TableCell className="font-medium">{pimpinan.nama_pimpinan}</TableCell>
                  <TableCell>
                    <Badge variant={pimpinan.jabatan === 'Walikota' ? 'info' : 'default'}>
                      {pimpinan.jabatan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{pimpinan.periode}</TableCell>
                  <TableCell className="text-sm font-mono">{pimpinan.nip}</TableCell>
                  <TableCell className="text-sm">{pimpinan.email}</TableCell>
                  <TableCell className="text-sm">{pimpinan.no_hp}</TableCell>
                  <TableCell>
                    <Badge variant={pimpinan.status === 'Aktif' ? 'success' : 'default'}>
                      {pimpinan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(pimpinan)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(pimpinan)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                {modalMode === 'add' ? 'Tambah Pimpinan' : 'Edit Pimpinan'}
              </h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Pimpinan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_pimpinan"
                    value={formData.nama_pimpinan}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Dr. H. Ahmad Suryadi, M.Si"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      <option value="Walikota">Walikota</option>
                      <option value="Wakil Walikota">Wakil Walikota</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      {periodeOptions.map((periode) => (
                        <option key={periode.id} value={periode.id}>
                          {periode.periode}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    placeholder="196512251990031001"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="walikota@kota.go.id"
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Catatan:</strong> Data pimpinan digunakan untuk agenda dan disposisi. 
                    Pastikan data yang diinput sudah benar dan lengkap.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    {modalMode === 'add' ? 'Tambah' : 'Update'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Delete */}
      {showDeleteModal && pimpinanToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                      <p className="text-sm font-semibold text-gray-900">{pimpinanToDelete.nama_pimpinan}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={pimpinanToDelete.jabatan === 'Walikota' ? 'info' : 'default'}>
                          {pimpinanToDelete.jabatan}
                        </Badge>
                        <Badge variant={pimpinanToDelete.status === 'Aktif' ? 'success' : 'default'}>
                          {pimpinanToDelete.status}
                        </Badge>
                      </div>
                      <div className="pt-1 space-y-1">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Periode:</span> {pimpinanToDelete.periode}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">NIP:</span> {pimpinanToDelete.nip}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Email:</span> {pimpinanToDelete.email}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">No HP:</span> {pimpinanToDelete.no_hp}
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
                    variant="danger" 
                    onClick={handleConfirmDelete} 
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Pimpinan
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