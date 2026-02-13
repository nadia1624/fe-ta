import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Upload, Calendar, Clock, MapPin, User, FileText, Image, AlertCircle } from 'lucide-react';

export default function UploadDraftPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [judulDraft, setJudulDraft] = useState('');
  const [isiDraft, setIsiDraft] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  // Mock data kegiatan
  const kegiatanData: Record<string, any> = {
    '1': {
      id: 1,
      judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal: '2026-02-05',
      waktu: '09:00 - 12:00',
      tempat: 'Ruang Rapat Utama',
      deadline: '2026-02-05 18:00',
      status_draft: 'Pending'
    },
    '2': {
      id: 2,
      judul_kegiatan: 'Kunjungan Kerja ke Dinas Kesehatan',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      jabatan: 'Walikota',
      tanggal: '2026-02-05',
      waktu: '14:00 - 16:00',
      tempat: 'Kantor Dinas Kesehatan',
      deadline: '2026-02-05 20:00',
      status_draft: 'Belum Upload'
    },
  };

  const kegiatan = id ? kegiatanData[id] : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      alert('Draft berita berhasil diupload!');
      navigate('/dashboard/staf-media');
    }, 2000);
  };

  if (!kegiatan) {
    return (
      <div className="space-y-4 pb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Kegiatan tidak ditemukan</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Upload Draft Berita</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">Buat dan upload draft berita kegiatan</p>
          </div>
        </div>
      </div>

      {/* Informasi Kegiatan */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Informasi Kegiatan</h3>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-3">
            <div>
              <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Judul Kegiatan
              </label>
              <p className="text-sm md:text-base text-gray-900 mt-1 font-semibold">{kegiatan.judul_kegiatan}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Pimpinan
                </label>
                <p className="text-sm text-gray-900 mt-1">{kegiatan.pimpinan}</p>
                <p className="text-xs text-gray-600">{kegiatan.jabatan}</p>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(kegiatan.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Waktu
                </label>
                <p className="text-sm text-gray-900 mt-1">{kegiatan.waktu}</p>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Tempat
                </label>
                <p className="text-sm text-gray-900 mt-1">{kegiatan.tempat}</p>
              </div>
            </div>

            {/* Deadline Warning */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 md:p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs md:text-sm font-medium text-orange-800">Deadline Upload</p>
                  <p className="text-xs md:text-sm text-orange-700 mt-1">
                    {new Date(kegiatan.deadline).toLocaleString('id-ID', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Upload Draft */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="border-b border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Form Draft Berita</h3>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              {/* Judul Draft */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Judul Berita <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={judulDraft}
                  onChange={(e) => setJudulDraft(e.target.value)}
                  placeholder="Contoh: Walikota Buka Rapat Koordinasi Bulanan OPD"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm md:text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Maksimal 100 karakter, ringkas dan informatif</p>
              </div>

              {/* Isi Berita */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Isi Berita <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={isiDraft}
                  onChange={(e) => setIsiDraft(e.target.value)}
                  placeholder="Tulis isi berita di sini... (minimal 200 karakter)"
                  rows={10}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm md:text-base resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isiDraft.length} karakter (minimal 200 karakter)
                </p>
              </div>

              {/* Upload Foto */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Foto Dokumentasi <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Image className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      Klik untuk upload foto atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG hingga 10MB (minimal 3 foto)</p>
                  </label>
                </div>
                {selectedFiles && (
                  <div className="mt-3">
                    <p className="text-xs md:text-sm font-medium text-gray-700 mb-2">
                      {selectedFiles.length} file dipilih:
                    </p>
                    <div className="space-y-1">
                      {Array.from(selectedFiles).map((file, index) => (
                        <p key={index} className="text-xs text-gray-600">
                          • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Panduan Penulisan */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                <h4 className="text-xs md:text-sm font-semibold text-blue-900 mb-2">📝 Panduan Penulisan Berita</h4>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li>Gunakan bahasa formal dan jelas</li>
                  <li>Sertakan 5W + 1H (What, Who, When, Where, Why, How)</li>
                  <li>Tambahkan kutipan langsung dari pimpinan jika ada</li>
                  <li>Hindari typo dan periksa ejaan</li>
                  <li>Upload minimal 3 foto dokumentasi berkualitas baik</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 order-2 md:order-1"
            disabled={uploading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1 order-1 md:order-2"
            disabled={uploading || !judulDraft || isiDraft.length < 200 || !selectedFiles}
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Draft Berita
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
