import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Camera, Upload, X, Check } from 'lucide-react';

export default function TambahProgressPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [formData, setFormData] = useState({
    tipe_progress: '',
    tipe_progress_custom: '',
    deskripsi: '',
    foto: null as File | null,
    foto_preview: ''
  });

  const [useCustomTipe, setUseCustomTipe] = useState(false);

  const tipeOptions = [
    'Persiapan',
    'Sedang Berlangsung',
    'Pelaksanaan',
    'Selesai',
    'Evaluasi',
    'Lainnya'
  ];

  const handleTipeChange = (value: string) => {
    if (value === 'Lainnya') {
      setUseCustomTipe(true);
      setFormData({ ...formData, tipe_progress: '' });
    } else {
      setUseCustomTipe(false);
      setFormData({ ...formData, tipe_progress: value, tipe_progress_custom: '' });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        foto: file,
        foto_preview: URL.createObjectURL(file)
      });
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            setFormData({
              ...formData,
              foto: file,
              foto_preview: URL.createObjectURL(file)
            });
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const removeFoto = () => {
    setFormData({
      ...formData,
      foto: null,
      foto_preview: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tipe = useCustomTipe ? formData.tipe_progress_custom : formData.tipe_progress;
    
    if (!tipe) {
      alert('Mohon isi tipe progress');
      return;
    }
    
    if (!formData.deskripsi) {
      alert('Mohon isi deskripsi progress');
      return;
    }

    if (!formData.foto) {
      alert('Mohon upload atau ambil foto dokumentasi');
      return;
    }

    // Submit logic here
    console.log('Submitted:', {
      tipe,
      deskripsi: formData.deskripsi,
      foto: formData.foto
    });

    alert('Progress berhasil ditambahkan!');
    navigate(-1);
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Tambah Progress</h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Laporan progress kegiatan protokol</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="border-b border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Form Progress Kegiatan</h3>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-5">
              {/* Tipe Progress */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Progress <span className="text-red-500">*</span>
                </label>
                {!useCustomTipe ? (
                  <select
                    value={formData.tipe_progress}
                    onChange={(e) => handleTipeChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Pilih tipe progress</option>
                    {tipeOptions.map((tipe) => (
                      <option key={tipe} value={tipe}>{tipe}</option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.tipe_progress_custom}
                      onChange={(e) => setFormData({ ...formData, tipe_progress_custom: e.target.value })}
                      placeholder="Masukkan tipe progress (contoh: Koordinasi Awal, Survey Lokasi, dll)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUseCustomTipe(false);
                        setFormData({ ...formData, tipe_progress_custom: '' });
                      }}
                    >
                      Kembali ke pilihan
                    </Button>
                  </div>
                )}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Progress <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  rows={5}
                  placeholder="Jelaskan detail progress kegiatan protokol (contoh: Tim protokol sudah tiba di lokasi, setup ruangan selesai, koordinasi dengan pihak terkait berjalan lancar, dll)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 20 karakter. Jelaskan detail aktivitas yang sudah dilakukan.
                </p>
              </div>

              {/* Foto Dokumentasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Dokumentasi <span className="text-red-500">*</span>
                </label>
                
                {!formData.foto_preview && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Upload Button */}
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Foto
                        </Button>
                      </div>

                      {/* Camera Button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={startCamera}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Ambil Foto
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Upload atau ambil 1 foto dokumentasi kegiatan (max 5MB)
                    </p>
                  </div>
                )}

                {/* Camera Preview */}
                {showCamera && (
                  <div className="mt-3 space-y-3">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        className="flex-1"
                        onClick={capturePhoto}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Ambil Foto
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={stopCamera}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Photo Preview */}
                {formData.foto_preview && (
                  <div className="mt-3">
                    <div className="relative inline-block">
                      <img
                        src={formData.foto_preview}
                        alt="Preview"
                        className="w-full md:w-80 h-auto rounded-lg border border-gray-300"
                      />
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeFoto}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      ✓ Foto berhasil ditambahkan
                    </p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Tips Laporan Progress
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                      <li>Pilih tipe progress sesuai tahapan kegiatan</li>
                      <li>Jika tipe tidak tersedia, pilih "Lainnya" untuk input manual</li>
                      <li>Jelaskan detail aktivitas secara lengkap dan jelas</li>
                      <li>Upload foto yang menunjukkan kegiatan protokol</li>
                      <li>Pastikan foto tidak blur dan terang</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-2" />
            Simpan Progress
          </Button>
        </div>
      </form>
    </div>
  );
}
