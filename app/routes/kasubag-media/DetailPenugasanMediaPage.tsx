import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    ArrowLeft, CheckCircle, ClipboardList, Calendar, MapPin, Clock, User,
    Loader2, AlertCircle, Users, FileText, TrendingUp, Newspaper, ExternalLink, RotateCcw
} from 'lucide-react';
import { penugasanApi } from '../../lib/api';
import { toast } from '../../lib/swal';

interface DokumentasiBerita {
    id_dokumentasi: string;
    file_path: string;
}

interface RevisiDraftBerita {
    id_revisi: string;
    catatan_revisi: string;
    tanggal_revisi: string;
}

interface DraftBerita {
    id_draft_berita: string;
    judul_berita: string;
    isi_draft: string;
    catatan: string | null;
    status_draft: string;
    tanggal_kirim: string;
    dokumentasis: DokumentasiBerita[];
    revisies?: RevisiDraftBerita[];
}

interface LaporanKegiatan {
    id_laporan: string;
    deskripsi_laporan: string;
    catatan_laporan: string;
    dokumentasi_laporan: string | null;
    createdAt: string;
    staff: { id_user: string; nama: string } | null;
}

interface PenugasanDetail {
    id_penugasan: string;
    jenis_penugasan: string;
    deskripsi_penugasan: string;
    tanggal_penugasan: string;
    status: 'pending' | 'progress' | 'selesai' | null;
    status_pelaksanaan: string;
    nama_staf: string[];
    pimpinans: { 
        nama_pimpinan: string; 
        nama_jabatan: string;
        nama_perwakilan?: string;
        is_representative?: boolean;
        representing?: string;
    }[];
    agenda: {
        id_agenda: string;
        nama_kegiatan: string;
        tanggal_kegiatan: string;
        waktu_mulai: string;
        waktu_selesai: string;
        lokasi_kegiatan: string;
        contact_person?: string;
        keterangan?: string;
        kaskpdPendampings?: any[];
    } | null;
    laporanKegiatans: LaporanKegiatan[];
    draftBeritas: DraftBerita[];
}

export default function DetailPenugasanMediaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [penugasan, setPenugasan] = useState<PenugasanDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await penugasanApi.getPenugasanDetail(id);
                if (res.success && res.data) {
                    setPenugasan(res.data);
                } else {
                    setError(res.message || 'Penugasan tidak ditemukan');
                }
            } catch (err) {
                setError('Terjadi kesalahan saat menghubungi server');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleTandaiSelesai = async () => {
        if (!id || !penugasan) return;

        const { isConfirmed } = await toast.confirm(
            'Konfirmasi',
            'Apakah Anda yakin ingin menandai penugasan ini sebagai Selesai?'
        );

        if (!isConfirmed) return;

        setIsUpdating(true);
        try {
            const res = await penugasanApi.updateStatusPenugasan(id, 'selesai');
            if (res.success) {
                toast.success('Berhasil!', 'Penugasan berhasil ditandai sebagai Selesai.');
                setPenugasan(prev => prev ? { ...prev, status: 'selesai', status_pelaksanaan: 'Selesai' } : prev);
            } else {
                toast.error('Gagal', res.message || 'Gagal memperbarui status');
            }
        } catch {
            toast.error('Error', 'Terjadi kesalahan saat menghubungi server');
        } finally {
            setIsUpdating(false);
        }
    };

    const formatTime = (time: string | null | undefined) => {
        if (!time) return '-';
        return time.slice(0, 5);
    };

    const getStatusInfo = () => {
        if (!penugasan) return { label: 'Unknown', variant: 'default' as any, className: '' };
        if (penugasan.status === 'selesai' || penugasan.status_pelaksanaan === 'Selesai') {
            return { label: 'Selesai', variant: 'success' as any, className: 'bg-green-50 text-green-700 border-green-100' };
        }
        if (penugasan.status === 'progress' || (penugasan.laporanKegiatans?.length > 0)) {
            return { label: 'Berlangsung', variant: 'info' as any, className: 'bg-blue-50 text-blue-700 border-blue-100' };
        }
        return { label: 'Belum Dimulai', variant: 'warning' as any, className: 'bg-amber-50 text-amber-700 border-amber-100' };
    };

    const getDraftStatusInfo = (status: string) => {
        switch (status) {
            case 'approved': return { label: 'Disetujui', color: 'bg-green-100 text-green-700 border-green-200' };
            case 'draft': return { label: 'Menunggu Review', color: 'bg-amber-100 text-amber-700 border-amber-200' };
            case 'review': return { label: 'Perlu Revisi', color: 'bg-red-100 text-red-700 border-red-200' };
            default: return { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-sm">Memuat detail penugasan...</p>
                </div>
            </div>
        );
    }

    if (error || !penugasan) {
        return (
            <div className="space-y-6">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali
                </Button>
                <Card>
                    <CardContent className="p-8 flex flex-col items-center gap-3 text-center">
                        <AlertCircle className="w-12 h-12 text-red-400" />
                        <p className="text-gray-700 font-medium">Penugasan tidak ditemukan</p>
                        <p className="text-sm text-gray-500">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statusInfo = getStatusInfo();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Detail Penugasan Media</h1>
                        <p className="text-sm text-gray-600 mt-0.5">{penugasan.agenda?.nama_kegiatan || '-'}</p>
                    </div>
                </div>

                {penugasan.status !== 'selesai' && penugasan.laporanKegiatans.length > 0 && (
                    <Button
                        onClick={handleTandaiSelesai}
                        disabled={isUpdating}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isUpdating ? 'Memproses...' : 'Tandai Selesai'}
                    </Button>
                )}
            </div>

            {/* Informasi Penugasan */}
            <Card>
                <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Informasi Penugasan</h3>
                        <Badge variant={statusInfo.variant} className={statusInfo.className}>{statusInfo.label}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">

                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    Agenda Terkait
                                </label>
                                <p className="text-sm text-gray-900 font-semibold leading-relaxed">
                                    {penugasan.agenda?.nama_kegiatan || '-'}
                                </p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Pimpinan
                                </label>
                                <div className="space-y-2.5">
                                    {penugasan.pimpinans.length > 0
                                        ? penugasan.pimpinans.map((p: any, idx) => (
                                            <div key={idx} className="flex flex-col">
                                                {p.is_representative ? (
                                                    <>
                                                        <p className="text-sm text-gray-900 font-semibold leading-none">{p.nama_perwakilan}</p>
                                                        <p className="text-[10px] text-gray-500 font-medium mt-1 leading-none">(Wakil {p.nama_pimpinan})</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-sm text-gray-900 font-semibold leading-none">{p.nama_pimpinan}</p>
                                                        <p className="text-[10px] text-gray-500 font-medium mt-1 leading-none">{p.nama_jabatan}</p>
                                                    </>
                                                )}
                                            </div>
                                        ))
                                        : <p className="text-sm text-gray-400 italic">-</p>
                                    }
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    Tanggal Kegiatan
                                </label>
                                <p className="text-sm text-gray-900 font-medium">
                                    {penugasan.agenda?.tanggal_kegiatan
                                        ? new Date(penugasan.agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })
                                        : '-'}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    Waktu
                                </label>
                                <p className="text-sm text-gray-900 font-medium">
                                    {penugasan.agenda?.waktu_mulai
                                        ? `${formatTime(penugasan.agenda.waktu_mulai)} – ${formatTime(penugasan.agenda.waktu_selesai)}`
                                        : '-'}
                                </p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    Lokasi
                                </label>
                                <p className="text-sm text-gray-900 font-medium leading-relaxed">{penugasan.agenda?.lokasi_kegiatan || '-'}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    Staf Media Ditugaskan
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {penugasan.nama_staf.length > 0
                                        ? penugasan.nama_staf.map((staf, idx) => (
                                            <Badge key={idx} variant="outline" className="text-[10px] border-blue-100 text-blue-700 bg-blue-50/50 font-medium px-2 py-0.5">
                                                {staf}
                                            </Badge>
                                        ))
                                        : <span className="text-xs text-gray-400 italic">Tidak ada staf</span>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1.5 pt-2 border-t border-gray-50">
                                <ClipboardList className="w-4 h-4 text-blue-600" />
                                Deskripsi Penugasan (Kepada Staf)
                            </label>
                            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                {penugasan.deskripsi_penugasan || <span className="italic text-gray-400">Tidak ada deskripsi</span>}
                            </p>
                        </div>

                        {/* Kontak Person */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                                <User className="w-4 h-4 text-blue-600" />
                                Kontak Person
                            </label>
                            <p className="text-sm text-blue-600 font-bold">
                                {penugasan.agenda?.contact_person || '-'}
                            </p>
                        </div>

                        {/* KaSKPD Pendamping */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                                <Users className="w-4 h-4 text-blue-600" />
                                KaSKPD Pendamping
                            </label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {penugasan.agenda?.kaskpdPendampings && penugasan.agenda.kaskpdPendampings.length > 0 ? (
                                    penugasan.agenda.kaskpdPendampings.map((k: any, i: number) => (
                                        <Badge key={i} variant="secondary" className="bg-white text-[10px] text-gray-700 border-gray-200">
                                            {k.kaskpd?.nama_instansi}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-[10px] text-gray-400 italic">Tidak ada pendamping</p>
                                )}
                            </div>
                        </div>

                        {/* Catatan Agenda */}
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                                <ClipboardList className="w-4 h-4 text-blue-600" />
                                Catatan Agenda
                            </label>
                            <div className="mt-1 p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl font-medium">
                                <p className="text-sm text-gray-800 leading-relaxed italic">
                                    {penugasan.agenda?.keterangan || '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ringkasan Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-none shadow-sm transition-all hover:shadow-md">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Total Revisi</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {(penugasan.draftBeritas || []).reduce((acc, draft) => acc + (draft.revisies?.length || 0), 0)}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <RotateCcw className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm transition-all hover:shadow-md">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Staf Bertugas</p>
                            <p className="text-2xl font-bold text-gray-900">{penugasan.nama_staf.length}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Draft Berita Section */}
            {penugasan.draftBeritas && penugasan.draftBeritas.length > 0 && (
                <Card className="border-none shadow-sm transition-all hover:shadow-md">
                    <CardHeader className="bg-blue-50/50 border-b border-blue-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Newspaper className="w-5 h-5 text-blue-600" />
                                <h3 className="text-base font-semibold text-blue-900">Draft Berita</h3>
                            </div>
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-white">
                                {penugasan.draftBeritas.length} draft
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {penugasan.draftBeritas.map((draft, draftIdx) => {
                            const draftStatus = getDraftStatusInfo(draft.status_draft);
                            return (
                                <div key={draft.id_draft_berita} className={`border rounded-lg overflow-hidden ${draftIdx > 0 ? 'mt-4' : ''}`}>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-semibold text-gray-900">{draft.judul_berita}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={draftStatus.color}>{draftStatus.label}</Badge>
                                            <Link to={`/kasubag-media/review-draft/${draft.id_draft_berita}`}>
                                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1 border-blue-200 text-blue-700 hover:bg-blue-50">
                                                    <ExternalLink className="w-3 h-3" />
                                                    Review
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div
                                            className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100 max-h-48 overflow-y-auto"
                                            dangerouslySetInnerHTML={{ __html: draft.isi_draft }}
                                        />
                                        {draft.revisies && draft.revisies.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <TrendingUp className="w-4 h-4 text-amber-500" />
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Riwayat Feedback ({draft.revisies.length})</h4>
                                                </div>
                                                <div className="space-y-3 pl-4 border-l-2 border-gray-100 mt-2">
                                                    {[...draft.revisies].sort((a, b) => new Date(b.tanggal_revisi).getTime() - new Date(a.tanggal_revisi).getTime()).map((rev, rIdx) => (
                                                        <div key={rev.id_revisi} className="relative">
                                                            <div className={`absolute -left-[1.35rem] top-1 w-2 h-2 rounded-full border-2 border-white shadow-sm ${rIdx === 0 ? 'bg-amber-500' : 'bg-gray-300'}`} />
                                                            <div className={`p-3 rounded-lg border ${rIdx === 0 ? 'bg-amber-50/50 border-amber-100 shadow-sm' : 'bg-white border-gray-50'}`}>
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className={`text-[10px] font-bold uppercase tracking-tight ${rIdx === 0 ? 'text-amber-700' : 'text-gray-400'}`}>
                                                                        Review Kasubag {rIdx === 0 && '(Terbaru)'}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-400 font-medium italic">
                                                                        {new Date(rev.tanggal_revisi).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-gray-700 leading-relaxed font-medium">"{rev.catatan_revisi}"</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {draft.catatan && (!draft.revisies || draft.revisies.length === 0) && (
                                            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                                <p className="text-xs font-bold text-red-800 mb-1">Catatan Revisi (Legacy):</p>
                                                <p className="text-xs text-red-700">{draft.catatan}</p>
                                            </div>
                                        )}
                                        {draft.dokumentasis && draft.dokumentasis.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-50">
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Dokumentasi Media</h4>
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                                    {draft.dokumentasis.map((doc, idx) => {
                                                        const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.file_path || '');
                                                        return (
                                                            <div key={idx} className="group relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                                                                {isImage ? (
                                                                    <img
                                                                        src={`/api/uploads/berita/${doc.file_path}`}
                                                                        alt="Dokumentasi"
                                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 cursor-pointer"
                                                                        onClick={() => window.open(`/api/uploads/berita/${doc.file_path}`, '_blank')}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
                                                                        <FileText className="w-8 h-8 text-blue-400" />
                                                                        <Button
                                                                            variant="secondary"
                                                                            size="sm"
                                                                            className="h-6 text-[10px] px-2 hover:bg-blue-50"
                                                                            onClick={() => window.open(`/api/uploads/berita/${doc.file_path}`, '_blank')}
                                                                        >
                                                                            Buka File
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Footer Action */}
            <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => navigate(-1)} className="px-12 hover:bg-gray-50">
                    Kembali ke Monitoring
                </Button>
            </div>
        </div>
    );
}
