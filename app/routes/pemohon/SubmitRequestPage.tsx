import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Upload, X, Check } from 'lucide-react';
import { pimpinanApi, agendaApi } from '../../lib/api';
import Swal from 'sweetalert2';

export default function SubmitRequestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pimpinanOptions, setPimpinanOptions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nomor_surat: '',
    tanggal_surat: '',
    perihal: '',
    nama_kegiatan: '',
    lokasi_kegiatan: '',
    keterangan: '',
    tanggal_kegiatan: '',
    waktu_mulai: '',
    waktu_selesai: '',
  });

  const [selectedPimpinan, setSelectedPimpinan] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pimpinanRes = await pimpinanApi.getActiveAssignments();
        if (pimpinanRes.success) setPimpinanOptions(pimpinanRes.data);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePimpinan = (item: any) => {
    const exists = selectedPimpinan.find(p => p.id_jabatan === item.id_jabatan);
    if (exists) {
      setSelectedPimpinan(selectedPimpinan.filter(p => p.id_jabatan !== item.id_jabatan));
    } else {
      setSelectedPimpinan([...selectedPimpinan, { id_jabatan: item.id_jabatan, id_periode: item.id_periode, nama: item.pimpinan?.nama_pimpinan }]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPimpinan.length === 0) {
      return Swal.fire('Error', 'Pilih minimal satu pimpinan yang ingin diundang', 'error');
    }

    if (!formData.waktu_mulai || !formData.waktu_selesai) {
      return Swal.fire('Error', 'Pilih waktu mulai dan selesai kegiatan', 'error');
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('nomor_surat', formData.nomor_surat);
      submitData.append('tanggal_surat', formData.tanggal_surat);
      submitData.append('perihal', formData.perihal);
      submitData.append('nama_kegiatan', formData.nama_kegiatan);
      submitData.append('lokasi_kegiatan', formData.lokasi_kegiatan);
      submitData.append('keterangan', formData.keterangan);

      // Send as JSON string for backend parsing
      submitData.append('invited_pimpinan', JSON.stringify(selectedPimpinan.map(p => ({
        id_jabatan: p.id_jabatan,
        id_periode: p.id_periode
      }))));

      submitData.append('waktu_mulai', formData.waktu_mulai);
      submitData.append('waktu_selesai', formData.waktu_selesai);
      submitData.append('tanggal_kegiatan', formData.tanggal_kegiatan);

      if (file) {
        submitData.append('surat_permohonan', file);
      }

      const response = await agendaApi.create(submitData);

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Permohonan agenda berhasil diajukan.',
          confirmButtonText: 'OK'
        }).then(() => {
          // Reset form or redirect
          window.location.reload();
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
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Ajukan Permohonan Baru</h1>
        <p className="text-sm text-gray-600 mt-1">Isi formulir untuk mengajukan permohonan agenda kegiatan dengan pimpinan</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Form Permohonan Agenda Kegiatan</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Surat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nomor_surat"
                  value={formData.nomor_surat}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Contoh: 015/SP/II/2025"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Surat <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_surat"
                  value={formData.tanggal_surat}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Perihal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="perihal"
                value={formData.perihal}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Contoh: Permohonan audiensi terkait program..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kegiatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_kegiatan"
                value={formData.nama_kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Nama kegiatan yang diajukan"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_kegiatan"
                  value={formData.tanggal_kegiatan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="waktu_mulai"
                  value={formData.waktu_mulai}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Selesai <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="waktu_selesai"
                  value={formData.waktu_selesai}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi Kegiatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lokasi_kegiatan"
                value={formData.lokasi_kegiatan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Contoh: Ruang Rapat Walikota"
                required
              />
            </div>

            {/* Pimpinan yang ingin diundang */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pimpinan yang Ingin Diundang <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pimpinanOptions.map((item) => (
                  <div
                    key={item.id_jabatan}
                    onClick={() => togglePimpinan(item)}
                    className={`cursor-pointer flex items-center justify-between p-3 border rounded-lg transition-all ${selectedPimpinan.some(p => p.id_jabatan === item.id_jabatan)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">{item.pimpinan?.nama_pimpinan}</span>
                      <span className="text-xs text-gray-500">{item.jabatan?.nama_jabatan}</span>
                    </div>
                    {selectedPimpinan.some(p => p.id_jabatan === item.id_jabatan) && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Kegiatan
              </label>
              <textarea
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Jelaskan detail kegiatan yang akan dilaksanakan..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Surat Permohonan <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 cursor-pointer'
                  }`}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <Check className="w-8 h-8 text-blue-500" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="p-1 hover:bg-white rounded-full text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">Klik untuk upload atau drag and drop</p>
                    <p className="text-xs text-gray-500">PDF (max. 5MB)</p>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Catatan:</strong> Pastikan semua data yang diisi sudah benar dan surat permohonan
                sudah ditandatangani. Permohonan akan diverifikasi oleh Sespri sebelum diteruskan untuk konfirmasi jadwal.
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" disabled={isLoading} onClick={() => window.location.reload()}>
                Reset
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Mengajukan...' : 'Ajukan Permohonan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}