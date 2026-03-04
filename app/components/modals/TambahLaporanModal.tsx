import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { X, Camera, Upload, Loader2, SwitchCamera } from 'lucide-react';
import { laporanKegiatanApi } from '../../lib/api';
import Swal from 'sweetalert2';

interface TambahLaporanModalProps {
    isOpen: boolean;
    onClose: () => void;
    idPenugasan: string;
    onSuccess: () => void;
}

const DESKRIPSI_OPTIONS = [
    'Persiapan',
    'Penyambutan Pimpinan',
    'Pelaksanaan Kegiatan',
    'Sedang Berlangsung',
    'Selesai',
    'Lainnya',
];

export default function TambahLaporanModal({
    isOpen,
    onClose,
    idPenugasan,
    onSuccess,
}: TambahLaporanModalProps) {
    const [deskripsi, setDeskripsi] = useState('');
    const [deskripsiCustom, setDeskripsiCustom] = useState('');
    const [catatanLaporan, setCatatanLaporan] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Camera state
    const [cameraOpen, setCameraOpen] = useState(false);
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
    const [cameraError, setCameraError] = useState('');
    const [stream, setStream] = useState<MediaStream | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startCamera = useCallback(async (facing: 'environment' | 'user') => {
        setCameraError('');
        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
            setStream(null);
        }
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch {
            setCameraError('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (cameraOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [cameraOpen, stream]);

    const openCamera = () => {
        setCameraOpen(true);
        startCamera(facingMode);
    };

    const switchCamera = () => {
        const next = facingMode === 'environment' ? 'user' : 'environment';
        setFacingMode(next);
        startCamera(next);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], `foto_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            stopCamera();
        }, 'image/jpeg', 0.9);
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
            setStream(null);
        }
        setCameraOpen(false);
        setCameraError('');
    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Hanya file gambar yang diperbolehkan (JPG, PNG)');
                e.target.value = '';
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
        e.target.value = '';
    };

    const clearFile = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const reset = () => {
        setDeskripsi('');
        setDeskripsiCustom('');
        setCatatanLaporan('');
        clearFile();
        setError('');
        stopCamera();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const finalDeskripsi = deskripsi === 'Lainnya' ? deskripsiCustom.trim() : deskripsi;

        if (!finalDeskripsi) {
            setError('Pilih atau ketik jenis progress terlebih dahulu');
            return;
        }
        if (!catatanLaporan.trim()) {
            setError('Catatan laporan wajib diisi');
            return;
        }
        if (!selectedFile) {
            setError('Dokumentasi wajib dilampirkan (foto kamera atau upload file)');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('id_penugasan', idPenugasan);
            formData.append('deskripsi_laporan', finalDeskripsi.slice(0, 50));
            formData.append('catatan_laporan', catatanLaporan);
            formData.append('dokumentasi', selectedFile);

            const res = await laporanKegiatanApi.addLaporan(formData);
            if (res.success) {
                reset();
                onClose();
                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Progress laporan berhasil disimpan.',
                    confirmButtonColor: '#3b82f6',
                    timer: 2000,
                    timerProgressBar: true,
                });
                onSuccess();
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: res.message || 'Gagal menyimpan laporan. Silakan coba lagi.',
                    confirmButtonColor: '#3b82f6',
                });
            }
        } catch {
            await Swal.fire({
                icon: 'error',
                title: 'Kesalahan Jaringan',
                text: 'Terjadi kesalahan jaringan. Periksa koneksi internet Anda.',
                confirmButtonColor: '#3b82f6',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const isSubmitDisabled =
        submitting ||
        !deskripsi ||
        !catatanLaporan.trim() ||
        !selectedFile ||
        (deskripsi === 'Lainnya' && !deskripsiCustom.trim());

    if (!isOpen) return null;

    return (
        /* z-[60] agar menutup sidebar yang z-50 */
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div
                className="bg-white rounded-lg flex flex-col overflow-hidden shadow-xl w-full max-w-2xl max-h-[90vh]"
            >
                {/* ─── CAMERA CANVAS VIEW ─── */}
                {cameraOpen && (
                    <>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-900 flex-shrink-0">
                            <h3 className="text-lg font-semibold text-white">Ambil Foto</h3>
                            <button onClick={stopCamera} className="text-gray-300 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                            {cameraError ? (
                                <div className="text-center text-white px-6 py-8">
                                    <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">{cameraError}</p>
                                    <button
                                        onClick={() => startCamera(facingMode)}
                                        className="mt-4 text-xs px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30"
                                    >
                                        Coba Lagi
                                    </button>
                                </div>
                            ) : (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <button
                                onClick={switchCamera}
                                className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                                title="Ganti kamera"
                            >
                                <SwitchCamera className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center justify-center py-6 bg-gray-900 flex-shrink-0">
                            <button
                                onClick={capturePhoto}
                                disabled={!!cameraError}
                                className="w-16 h-16 rounded-full bg-white border-4 border-gray-400 hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 flex items-center justify-center"
                            >
                                <div className="w-11 h-11 rounded-full bg-gray-200" />
                            </button>
                        </div>

                        <canvas ref={canvasRef} className="hidden" />
                    </>
                )}

                {/* ─── NORMAL FORM VIEW ─── */}
                {!cameraOpen && (
                    <>
                        {/* Header */}
                        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                            <h3 className="text-lg font-semibold text-gray-900">Tambah Progress Laporan</h3>
                            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body — scrollable */}
                        <div className="overflow-y-auto flex-1 p-6">
                            <form id="tambah-laporan-form" onSubmit={handleSubmit} className="space-y-6">
                                {/* Error */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Jenis Progress */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jenis Progress <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {DESKRIPSI_OPTIONS.map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setDeskripsi(opt)}
                                                className={`p-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all ${deskripsi === opt
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                    {deskripsi === 'Lainnya' && (
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                maxLength={50}
                                                value={deskripsiCustom}
                                                onChange={(e) => setDeskripsiCustom(e.target.value)}
                                                placeholder="Ketik jenis progress..."
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                autoFocus
                                            />
                                            <p className="text-xs text-gray-400 mt-1">{deskripsiCustom.length}/50 karakter</p>
                                        </div>
                                    )}
                                </div>

                                {/* Catatan Laporan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Catatan Laporan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={catatanLaporan}
                                        onChange={(e) => setCatatanLaporan(e.target.value)}
                                        rows={4}
                                        placeholder="Tuliskan laporan detail pelaksanaan, kondisi lapangan, catatan penting..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                    />
                                </div>

                                {/* Dokumentasi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dokumentasi <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-xs text-gray-400 mb-2">Hanya file gambar (JPG, PNG, maks. 5MB)</p>

                                    {selectedFile ? (
                                        <div className="rounded-lg border border-blue-200 bg-blue-50 overflow-hidden">
                                            {previewUrl && selectedFile.type.startsWith('image/') && (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview dokumentasi"
                                                    className="w-full max-h-48 object-cover"
                                                />
                                            )}
                                            <div className="flex items-center justify-between px-4 py-2.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <Upload className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                    <span className="text-sm text-blue-700 truncate">{selectedFile.name}</span>
                                                    <span className="text-xs text-blue-500 flex-shrink-0">
                                                        ({(selectedFile.size / 1024).toFixed(0)} KB)
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={clearFile}
                                                    className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={openCamera}
                                                className="flex flex-col items-center justify-center gap-2 py-7 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-500 hover:text-blue-600"
                                            >
                                                <Camera className="w-7 h-7" />
                                                <span className="text-sm font-medium">Kamera</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex flex-col items-center justify-center gap-2 py-7 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-500 hover:text-blue-600"
                                            >
                                                <Upload className="w-7 h-7" />
                                                <span className="text-sm font-medium">Upload File</span>
                                            </button>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelected}
                                        className="hidden"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 flex-shrink-0">
                            <Button variant="outline" onClick={handleClose} disabled={submitting} className="flex-1">
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                form="tambah-laporan-form"
                                variant="default"
                                className="flex-1"
                                disabled={isSubmitDisabled}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Laporan'
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
