import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Calendar, Clock, MapPin, Image as ImageIcon, Plus, X, Upload, Camera } from 'lucide-react';

export default function LaporanKegiatanDetailPage() {
  const { id } = useParams();
  const [showAddProgressModal, setShowAddProgressModal] = useState(false);
  const [photoMode, setPhotoMode] = useState<'upload' | 'camera'>('upload');
  const [newProgress, setNewProgress] = useState({
    tipe: '',
    deskripsi: '',
    foto: null as File | null
  });
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample data - in real app, fetch by ID
  const kegiatan = {
    id: 1,
    pimpinan_nama: 'Dr. H. Ahmad Suryadi, M.Si',
    pimpinan_jabatan: 'Walikota',
    judul_kegiatan: 'Rapat Koordinasi Bulanan OPD',
    tanggal: '2025-02-10',
    waktu: '09:00 - 12:00',
    tempat: 'Ruang Rapat Utama Kantor Walikota',
    status_laporan: 'Sudah Dilaporkan',
    progress_reports: [
      {
        id: 1,
        tipe: 'Persiapan',
        deskripsi: 'Tim protokol tiba di lokasi pukul 08:15. Melakukan pengecekan sound system, projector, dan peralatan presentasi. Menyiapkan konsumsi untuk peserta. Ruangan telah ditata dengan formasi U-shape sesuai permintaan.',
        foto: 'persiapan_rapat_001.jpg',
        waktu_update: '08:30',
        tanggal_update: '2025-02-10',
        pelapor: 'Staf Protokol - Budi Santoso'
      },
      {
        id: 2,
        tipe: 'Sedang Berlangsung',
        deskripsi: 'Rapat dimulai tepat waktu pukul 09:00. Walikota membuka rapat dengan memberikan arahan tentang program prioritas Q1 2025. Presentasi dilakukan oleh Sekda dan diikuti dengan diskusi interaktif.',
        foto: 'rapat_berlangsung_002.jpg',
        waktu_update: '09:30',
        tanggal_update: '2025-02-10',
        pelapor: 'Staf Protokol - Budi Santoso'
      },
      {
        id: 3,
        tipe: 'Update Progress',
        deskripsi: 'Diskusi membahas 10 program prioritas. Masing-masing kepala OPD diminta memberikan input dan komitmen. Walikota memberikan arahan teknis untuk masing-masing program. Suasana rapat kondusif dan produktif.',
        foto: 'diskusi_program_003.jpg',
        waktu_update: '10:45',
        tanggal_update: '2025-02-10',
        pelapor: 'Staf Protokol - Budi Santoso'
      },
      {
        id: 4,
        tipe: 'Selesai',
        deskripsi: 'Rapat selesai pukul 12:00. Menghasilkan kesepakatan 10 program prioritas Q1 2025 dengan timeline dan PIC yang jelas. Walikota menutup rapat dengan apresiasi kepada seluruh kepala OPD atas komitmennya. Dokumentasi lengkap telah tersimpan.',
        foto: 'penutupan_rapat_004.jpg',
        waktu_update: '12:15',
        tanggal_update: '2025-02-10',
        pelapor: 'Staf Protokol - Budi Santoso'
      }
    ]
  };

  const startCamera = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Browser Anda tidak mendukung akses kamera. Silakan gunakan upload file.');
        setPhotoMode('upload');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error: any) {
      // Handle specific camera errors
      let errorMessage = 'Tidak dapat mengakses kamera.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Izin akses kamera ditolak. Silakan izinkan akses kamera di browser Anda atau gunakan upload file.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Kamera tidak ditemukan. Silakan gunakan upload file.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Kamera sedang digunakan aplikasi lain. Silakan tutup aplikasi tersebut atau gunakan upload file.';
      }
      
      alert(errorMessage);
      setPhotoMode('upload');
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setNewProgress({ ...newProgress, foto: file });
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleAddProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgress.tipe.trim()) {
      alert('Tipe progress harus diisi!');
      return;
    }
    if (newProgress.deskripsi.length < 50) {
      alert('Deskripsi minimal 50 karakter!');
      return;
    }
    if (!newProgress.foto) {
      alert('Foto dokumentasi harus diupload!');
      return;
    }
    alert('Progress berhasil ditambahkan!');
    handleCloseModal();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProgress({
        ...newProgress,
        foto: e.target.files[0]
      });
    }
  };

  const handleOpenModal = () => {
    setShowAddProgressModal(true);
    setPhotoMode('upload');
    setNewProgress({
      tipe: '',
      deskripsi: '',
      foto: null
    });
  };

  const handleCloseModal = () => {
    stopCamera();
    setShowAddProgressModal(false);
    setPhotoMode('upload');
    setNewProgress({
      tipe: '',
      deskripsi: '',
      foto: null
    });
  };

  const switchToCamera = async () => {
    setPhotoMode('camera');
    await startCamera();
  };

  const switchToUpload = () => {
    stopCamera();
    setPhotoMode('upload');
    setNewProgress({ ...newProgress, foto: null });
  };

  const getBadgeVariant = (tipe: string) => {
    const lowerTipe = tipe.toLowerCase();
    if (lowerTipe.includes('persiapan')) return 'info';
    if (lowerTipe.includes('berlangsung')) return 'success';
    if (lowerTipe.includes('selesai')) return 'default';
    return 'warning';
  };

  const getCircleColor = (tipe: string) => {
    const lowerTipe = tipe.toLowerCase();
    if (lowerTipe.includes('persiapan')) return 'bg-blue-500';
    if (lowerTipe.includes('berlangsung')) return 'bg-green-500';
    if (lowerTipe.includes('selesai')) return 'bg-gray-500';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/staf-protokol/laporan">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Detail Laporan Kegiatan</h1>
          <p className="text-sm text-gray-600 mt-1">Tambah progress dan dokumentasi kegiatan</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Progress
        </Button>
      </div>

      {/* Informasi Kegiatan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Informasi Kegiatan</h3>
            <Badge variant={kegiatan.status_laporan === 'Sudah Dilaporkan' ? 'success' : 'warning'}>
              {kegiatan.status_laporan}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Pimpinan Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600">Pimpinan</label>
                  <p className="text-sm font-medium text-gray-900">{kegiatan.pimpinan_nama}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Jabatan</label>
                  <p className="text-sm font-medium text-gray-900">{kegiatan.pimpinan_jabatan}</p>
                </div>
              </div>
            </div>

            {/* Kegiatan Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">{kegiatan.judul_kegiatan}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="text-xs text-gray-600">Tanggal</label>
                    <p className="text-sm text-gray-900">
                      {new Date(kegiatan.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="text-xs text-gray-600">Waktu</label>
                    <p className="text-sm text-gray-900">{kegiatan.waktu}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <label className="text-xs text-gray-600">Tempat</label>
                    <p className="text-sm text-gray-900">{kegiatan.tempat}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Laporan Progress ({kegiatan.progress_reports.length})
            </h3>
            <Button variant="outline" size="sm" onClick={handleOpenModal}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kegiatan.progress_reports.map((progress, index) => (
              <div key={progress.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Progress Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getCircleColor(progress.tipe)}`}>
                      {index + 1}
                    </div>
                    <div>
                      <Badge variant={getBadgeVariant(progress.tipe)}>
                        {progress.tipe}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(progress.tanggal_update).toLocaleDateString('id-ID')} · {progress.waktu_update}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Content */}
                <div className="ml-13 space-y-3">
                  <p className="text-sm text-gray-900 leading-relaxed">{progress.deskripsi}</p>

                  {/* Foto Dokumentasi */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600">Foto Dokumentasi:</p>
                        <p className="text-sm font-medium text-gray-900">{progress.foto}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pelapor */}
                  <p className="text-xs text-gray-500">
                    Dilaporkan oleh: <span className="font-medium">{progress.pelapor}</span>
                  </p>
                </div>
              </div>
            ))}

            {kegiatan.progress_reports.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada laporan progress</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={handleOpenModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Progress Pertama
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Add Progress */}
      {showAddProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Tambah Laporan Progress</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProgress} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    <strong>Info:</strong> Isi tipe progress sesuai tahapan kegiatan (contoh: Persiapan, Sedang Berlangsung, Selesai, dll).
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Progress <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProgress.tipe}
                    onChange={(e) => setNewProgress({ ...newProgress, tipe: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Contoh: Persiapan, Sedang Berlangsung, Update Progress, Selesai"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Tulis tipe progress sesuai tahapan kegiatan</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Laporan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newProgress.deskripsi}
                    onChange={(e) => setNewProgress({ ...newProgress, deskripsi: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Jelaskan detail aktivitas, kondisi, hasil, atau temuan penting dari tahapan kegiatan ini..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimal 50 karakter ({newProgress.deskripsi.length}/50)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Dokumentasi <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Mode Toggle */}
                  <div className="flex gap-2 mb-3">
                    <Button
                      type="button"
                      variant={photoMode === 'upload' ? 'default' : 'outline'}
                      size="sm"
                      onClick={switchToUpload}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                    <Button
                      type="button"
                      variant={photoMode === 'camera' ? 'default' : 'outline'}
                      size="sm"
                      onClick={switchToCamera}
                      className="flex-1"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Ambil Foto
                    </Button>
                  </div>

                  {/* Upload Mode */}
                  {photoMode === 'upload' && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maksimal 5MB</p>
                      {newProgress.foto && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700">✓ {newProgress.foto.name}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Camera Mode */}
                  {photoMode === 'camera' && (
                    <div className="space-y-3">
                      {!newProgress.foto ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full rounded-lg bg-black"
                            style={{ maxHeight: '300px' }}
                          />
                          <Button
                            type="button"
                            onClick={capturePhoto}
                            className="w-full mt-3"
                            disabled={!cameraStream}
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Ambil Foto
                          </Button>
                        </div>
                      ) : (
                        <div className="border border-green-300 rounded-lg p-4 bg-green-50">
                          <p className="text-sm text-green-700 mb-2">✓ Foto berhasil diambil: {newProgress.foto.name}</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setNewProgress({ ...newProgress, foto: null });
                              startCamera();
                            }}
                          >
                            Ambil Ulang
                          </Button>
                        </div>
                      )}
                      <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseModal} 
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button type="submit" className="flex-1">
                    Simpan Progress
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
