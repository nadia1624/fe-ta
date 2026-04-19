import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    ClipboardList,
    Search,
    Filter,
    Eye,
    Calendar,
    Clock,
    MapPin,
    CheckCircle,
    TrendingUp,
    Loader2,
    AlertCircle,
    Newspaper,
    FileText,
    RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router';
import { penugasanApi } from '../../lib/api';
import CustomSelect from '../../components/ui/CustomSelect';

interface Pimpinan {
    nama_pimpinan: string;
    nama_jabatan: string;
}

interface Revisi {
    id_revisi: string;
    catatan_revisi: string;
    tanggal_revisi: string;
}

interface DraftBerita {
    id_draft_berita: string;
    judul_berita: string;
    status_draft: string;
    revisies?: Revisi[];
}

interface Penugasan {
    id_penugasan: string;
    id_agenda: string;
    jenis_penugasan: string;
    deskripsi_penugasan: string;
    status: string;
    status_pelaksanaan: string;
    tanggal_penugasan: string;
    agenda: {
        id_agenda: string;
        nama_kegiatan: string;
        tanggal_kegiatan: string;
        waktu_mulai: string;
        waktu_selesai: string;
        lokasi_kegiatan: string;
    } | null;
    pimpinans: Pimpinan[];
    nama_staf: string[];
    draftBeritas?: DraftBerita[];
}

export default function MonitorPenugasanMediaPage() {
    const [penugasanList, setPenugasanList] = useState<Penugasan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchPenugasan = async () => {
            try {
                setLoading(true);
                const res = await penugasanApi.getMyPenugasan();
                if (res.success) {
                    setPenugasanList(res.data || []);
                } else {
                    setError(res.message || 'Gagal mengambil data penugasan');
                }
            } catch (err) {
                setError('Terjadi kesalahan saat menghubungi server');
            } finally {
                setLoading(false);
            }
        };

        fetchPenugasan();
    }, []);

    const filteredData = penugasanList.filter(item => {
        const pimpinansStr = (item.pimpinans || []).map(p => p.nama_pimpinan).join(' ');
        const staffStr = (item.nama_staf || []).join(' ');
        const namaKegiatan = item.agenda?.nama_kegiatan || '';
        const lokasi = item.agenda?.lokasi_kegiatan || '';

        const matchesSearch =
            namaKegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pimpinansStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staffStr.toLowerCase().includes(searchTerm.toLowerCase());

        const latestDraft = item.draftBeritas && item.draftBeritas.length > 0 
            ? item.draftBeritas[item.draftBeritas.length - 1] 
            : null;
        
        let displayStatus = 'Belum Dimulai';
        if (latestDraft) {
            if (latestDraft.status_draft === 'approved') displayStatus = 'Selesai';
            else if (latestDraft.status_draft === 'draft' || latestDraft.status_draft === 'review') displayStatus = 'Berlangsung';
        }

        const matchesStatus = statusFilter === 'all' || displayStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const statsTotal = penugasanList.length;
    const statsSelesai = penugasanList.filter(p => {
        const latest = p.draftBeritas && p.draftBeritas.length > 0 ? p.draftBeritas[p.draftBeritas.length - 1] : null;
        return latest?.status_draft === 'approved';
    }).length;
    const statsBerlangsung = penugasanList.filter(p => {
        const latest = p.draftBeritas && p.draftBeritas.length > 0 ? p.draftBeritas[p.draftBeritas.length - 1] : null;
        return latest && (latest.status_draft === 'draft' || latest.status_draft === 'review');
    }).length;
    const statsBelumDimulai = penugasanList.filter(p => !p.draftBeritas || p.draftBeritas.length === 0).length;


    const getDraftStatusBadge = (drafts?: DraftBerita[]) => {
        if (!drafts || drafts.length === 0) {
            return <span className="text-xs text-gray-400 italic">Belum ada draft</span>;
        }
        const latest = drafts[drafts.length - 1];
        switch (latest.status_draft) {
            case 'approved':
                return <Badge variant="success">Disetujui</Badge>;
            case 'draft':
                return <Badge variant="warning">Menunggu Review</Badge>;
            case 'review':
                return <Badge variant="destructive">Perlu Revisi</Badge>;
            default:
                return <Badge>{latest.status_draft}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-sm">Memuat data penugasan...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Monitor Penugasan Media</h1>
                    <p className="text-sm text-gray-600 mt-1">Pantau progress penugasan staf media untuk agenda pimpinan</p>
                </div>
                <Card>
                    <CardContent className="p-8 flex flex-col items-center gap-3 text-center">
                        <AlertCircle className="w-12 h-12 text-red-400" />
                        <p className="text-gray-700 font-medium">Gagal memuat data</p>
                        <p className="text-sm text-gray-500">{error}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Coba Lagi
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Monitor Penugasan Media</h1>
                <p className="text-sm text-gray-600 mt-1">Pantau progress penugasan staf media untuk agenda pimpinan</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Penugasan</p>
                                <p className="text-2xl font-semibold text-blue-600">{statsTotal}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Selesai</p>
                                <p className="text-2xl font-semibold text-green-600">{statsSelesai}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Berlangsung</p>
                                <p className="text-2xl font-semibold text-blue-600">{statsBerlangsung}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Belum Dimulai</p>
                                <p className="text-2xl font-semibold text-orange-600">{statsBelumDimulai}</p>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table Card */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900">Daftar Penugasan ({filteredData.length})</h3>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative group flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Cari penugasan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-blue-100 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm w-full shadow-sm"
                                />
                            </div>
                             <CustomSelect
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={[
                                    { value: 'all', label: 'Semua Status' },
                                    { value: 'Selesai', label: 'Selesai' },
                                    { value: 'Berlangsung', label: 'Berlangsung' },
                                    { value: 'Belum Dimulai', label: 'Belum Dimulai' },
                                ]}
                                icon={<Filter className="w-3.5 h-3.5" />}
                                className="w-full sm:w-48 bg-white border-blue-100 shadow-sm"
                                placeholder="Pilih Status"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Agenda & Lokasi</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pimpinan</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staf Media</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revisi</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Draft</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredData.map((item) => (
                                    <tr key={item.id_penugasan} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                                                    {item.agenda?.nama_kegiatan || '-'}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                                    <MapPin className="w-3 h-3 text-blue-500" />
                                                    <span className="truncate max-w-[180px]">{item.agenda?.lokasi_kegiatan || '-'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {(item.pimpinans || []).length > 0
                                                    ? item.pimpinans.map((p, idx) => (
                                                        <div key={idx} className="flex flex-col">
                                                            <span className="text-xs font-semibold text-gray-900">{p.nama_pimpinan}</span>
                                                            <span className="text-[10px] text-gray-500">{p.nama_jabatan}</span>
                                                        </div>
                                                    ))
                                                    : <span className="text-xs text-gray-400 italic">Tidak ada pimpinan</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                                                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                    {item.agenda?.tanggal_kegiatan
                                                        ? new Date(item.agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })
                                                        : '-'}
                                                </div>
                                                {item.agenda?.waktu_mulai && (
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3 text-blue-500" />
                                                        {item.agenda.waktu_mulai.slice(0, 5)} – {item.agenda.waktu_selesai?.slice(0, 5) || ''}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5 max-w-[180px]">
                                                {(item.nama_staf || []).length > 0
                                                    ? item.nama_staf.map((staf, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-[10px] py-0 px-1.5 bg-white font-medium border-blue-100 text-blue-700">
                                                            {staf}
                                                        </Badge>
                                                    ))
                                                    : <p className="text-sm text-gray-400 italic">Tidak ada staf</p>
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 min-w-[80px]">
                                                <span className="text-xs font-semibold text-gray-900">
                                                    {(item.draftBeritas || []).reduce((acc, draft) => acc + (draft.revisies?.length || 0), 0)} revisi
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                {getDraftStatusBadge(item.draftBeritas)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/kasubag-media/penugasan/${item.id_penugasan}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 rounded-lg group"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
                                                    <span className="sr-only">Detail</span>
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredData.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 mb-4">
                                <ClipboardList className="w-7 h-7 text-blue-300" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900">Tidak ada penugasan media ditemukan</h3>
                            <p className="text-xs text-gray-500 mt-1">Coba sesuaikan kata kunci atau filter status Anda.</p>
                            {(searchTerm || statusFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4 rounded-full border-blue-200 text-blue-700"
                                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                >
                                    Reset Filter
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                        Total {filteredData.length} dari {penugasanList.length} penugasan media
                    </span>
                    <span className="text-xs text-gray-400">
                        {penugasanList.filter(p => p.draftBeritas && p.draftBeritas.length > 0).length} penugasan telah memiliki draft
                    </span>
                </div>
            </Card>
        </div>
    );
}
