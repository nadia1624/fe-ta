import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Upload, X, Check, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { pimpinanApi, agendaApi } from '../../lib/api';
import { Calendar } from '../../components/ui/calendar';
import { TimePicker } from '../../components/ui/time-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { cn } from '../../components/ui/utils';
import moment from 'moment';
import 'moment/locale/id';
import Swal from 'sweetalert2';

moment.locale('id');

export default function SubmitRequestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pimpinanOptions, setPimpinanOptions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nomor_surat: '',
    tanggal_surat: '',
    perihal: '',
    nama_kegiatan: '',
    lokasi_kegiatan: '',
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

  const handleDateSelect = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, [name]: moment(date).format('YYYY-MM-DD') });
    }
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

    // Date validation: must be after today
    const today = moment().startOf('day');
    const selectedDate = moment(formData.tanggal_kegiatan);
    if (!selectedDate.isAfter(today)) {
      return Swal.fire('Error', 'Tanggal kegiatan harus setelah hari ini (minimal besok)', 'error');
    }

    // Time validation: end time > start time
    if (formData.waktu_selesai <= formData.waktu_mulai) {
      return Swal.fire('Error', 'Waktu selesai tidak boleh lebih awal dari waktu mulai.', 'error');
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('nomor_surat', formData.nomor_surat);
      submitData.append('tanggal_surat', formData.tanggal_surat);
      submitData.append('perihal', formData.perihal);
      submitData.append('nama_kegiatan', formData.nama_kegiatan);
      submitData.append('lokasi_kegiatan', formData.lokasi_kegiatan);


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
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Ajukan Permohonan Baru</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
          Isi formulir untuk mengajukan permohonan agenda kegiatan pimpinan.
        </p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Form Permohonan Agenda Kegiatan</h3>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Nomor Surat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nomor_surat"
                  value={formData.nomor_surat}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                  placeholder="Contoh: 015/SP/II/2025"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Tanggal Surat <span className="text-red-500">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-left text-sm transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none",
                        !formData.tanggal_surat && "text-gray-400"
                      )}
                    >
                      <span>{formData.tanggal_surat ? moment(formData.tanggal_surat).format('DD MMMM YYYY') : "Pilih tanggal"}</span>
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.tanggal_surat ? new Date(formData.tanggal_surat) : undefined}
                      onSelect={(date: Date | undefined) => handleDateSelect('tanggal_surat', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Perihal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="perihal"
                value={formData.perihal}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                placeholder="Contoh: Permohonan audiensi terkait program..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Nama Kegiatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_kegiatan"
                value={formData.nama_kegiatan}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                placeholder="Nama kegiatan yang diajukan"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Tanggal Kegiatan <span className="text-red-500">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-left text-sm transition-all shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none",
                        !formData.tanggal_kegiatan && "text-gray-400"
                      )}
                    >
                      <span>{formData.tanggal_kegiatan ? moment(formData.tanggal_kegiatan).format('DD MMMM YYYY') : "Pilih tanggal"}</span>
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.tanggal_kegiatan ? new Date(formData.tanggal_kegiatan) : undefined}
                      onSelect={(date: Date | undefined) => handleDateSelect('tanggal_kegiatan', date)}
                      initialFocus
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date <= today;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Waktu Mulai <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    value={formData.waktu_mulai}
                    onChange={(val) => setFormData({ ...formData, waktu_mulai: val })}
                    placeholder="08:00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Waktu Selesai <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    value={formData.waktu_selesai}
                    onChange={(val) => setFormData({ ...formData, waktu_selesai: val })}
                    placeholder="10:00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">
                Lokasi Kegiatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lokasi_kegiatan"
                value={formData.lokasi_kegiatan}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 shadow-sm"
                placeholder="Contoh: Ruang Rapat Walikota"
                required
              />
            </div>

            {/* Pimpinan yang ingin diundang */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Pimpinan yang Ingin Diundang <span className="text-red-500">*</span>
              </label>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pimpinanOptions.map((item) => {
                    const isSelected = selectedPimpinan.some(p => p.id_jabatan === item.id_jabatan);
                    return (
                      <div
                        key={item.id_jabatan}
                        onClick={() => togglePimpinan(item)}
                        className={`cursor-pointer group flex items-center justify-between p-3.5 border rounded-xl transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                            {item.pimpinan?.nama_pimpinan}
                          </span>
                          <span className={`text-[11px] font-medium ${isSelected ? 'text-blue-500' : 'text-gray-500'}`}>
                            {item.jabatan?.nama_jabatan}
                          </span>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? 'bg-blue-600 text-white shadow-sm' : 'border border-gray-200 group-hover:border-blue-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {selectedPimpinan.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <p className="w-full text-[11px] font-bold text-gray-400 uppercase tracking-tight mb-1">Pimpinan Terpilih:</p>
                    {selectedPimpinan.map((p) => (
                      <div key={p.id_jabatan} className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200">
                        <span>{p.nama}</span>
                        <button type="button" onClick={() => setSelectedPimpinan(prev => prev.filter(item => item.id_jabatan !== p.id_jabatan))}>
                          <X className="w-3 h-3 hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>



            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Surat Permohonan <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-4 sm:p-8 text-center transition-all ${file ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400 cursor-pointer shadow-sm'
                  }`}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
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