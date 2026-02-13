import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, CheckCircle, TrendingUp, Calendar, MapPin, Clock, User } from 'lucide-react';

export default function DetailPenugasanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  // Mock data - harus match dengan ID dari MonitorPenugasanPage
  const penugasanData: Record<string, any> = {
    '1': {
      id: 1,
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Bertugas mengatur protokoler acara, koordinasi dengan MC dan setting tempat duduk pimpinan',
      agenda_terkait: 'Rapat Koordinasi Bulanan OPD',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal_kegiatan: '2026-02-10',
      waktu: '09:00 - 12:00',
      lokasi: 'Ruang Rapat Utama',
      nama_staf: ['Ahmad Hidayat', 'Budi Santoso'],
      tanggal_penugasan: '2026-02-05',
      status_pelaksanaan: 'Selesai',
      progress: [
        {
          tipe: 'Persiapan Awal',
          keterangan: 'Survey lokasi dan persiapan peralatan protokoler',
          tanggal: '2026-02-08 10:00',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          tipe: 'Pelaksanaan',
          keterangan: 'Koordinasi protokoler berjalan lancar, pimpinan hadir tepat waktu',
          tanggal: '2026-02-10 09:00',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          tipe: 'Selesai',
          keterangan: 'Acara selesai, dokumentasi telah diserahkan',
          tanggal: '2026-02-10 12:30',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        }
      ]
    },
    '2': {
      id: 2,
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Koordinasi protokoler kunjungan, persiapan sambutan dan pengawalan pimpinan',
      agenda_terkait: 'Kunjungan Kerja ke Dinas Kesehatan',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal_kegiatan: '2026-02-12',
      waktu: '10:00 - 11:30',
      lokasi: 'Kantor Dinas Kesehatan',
      nama_staf: ['Eko Prasetyo'],
      tanggal_penugasan: '2026-02-06',
      status_pelaksanaan: 'Berlangsung',
      progress: [
        {
          tipe: 'Persiapan',
          keterangan: 'Koordinasi dengan Dinas Kesehatan sudah dilakukan',
          tanggal: '2026-02-09 14:00',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          tipe: 'Briefing',
          keterangan: 'Briefing dengan pimpinan selesai dilakukan',
          tanggal: '2026-02-11 16:00',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        }
      ]
    },
    '3': {
      id: 3,
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Persiapan dan pelaksanaan protokoler upacara pelantikan',
      agenda_terkait: 'Pelantikan Kepala Dinas',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal_kegiatan: '2026-02-20',
      waktu: '10:00 - 12:00',
      lokasi: 'Aula Kantor Walikota',
      nama_staf: ['Bambang Wijaya', 'Dewi Lestari', 'Farhan Saputra'],
      tanggal_penugasan: '2026-02-10',
      status_pelaksanaan: 'Belum Dimulai',
      progress: [
        {
          tipe: 'Rapat Koordinasi',
          keterangan: 'Rapat koordinasi awal dengan tim pelaksana',
          tanggal: '2026-02-11 09:00',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        }
      ]
    },
    '4': {
      id: 4,
      jenis_penugasan: 'Protokol',
      deskripsi_penugasan: 'Mengatur protokoler acara peresmian dan koordinasi dengan instansi terkait',
      agenda_terkait: 'Peresmian Jalan Tol Baru',
      pimpinan: 'Dr. H. Ahmad Suryadi, M.Si',
      tanggal_kegiatan: '2026-02-16',
      waktu: '08:00 - 10:00',
      lokasi: 'Gerbang Tol Sukamaju',
      nama_staf: ['Ahmad Hidayat', 'Eko Prasetyo'],
      tanggal_penugasan: '2026-02-07',
      status_pelaksanaan: 'Berlangsung',
      progress: [
        {
          tipe: 'Survey Lokasi',
          keterangan: 'Survey lokasi acara dan koordinasi dengan PT Jasa Marga',
          tanggal: '2026-02-09 10:00',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          tipe: 'Persiapan Teknis',
          keterangan: 'Persiapan panggung, sound system, dan tata letak',
          tanggal: '2026-02-13 14:00',
          foto: 'https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwbWVldGluZyUyMGRvY3VtZW50YXRpb24lMjBpbmRvbmVzaWF8ZW58MXx8fHwxNzcwMjkwMTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080'
        }
      ]
    }
  };

  const penugasan = id ? penugasanData[id] : null;

  if (!penugasan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Penugasan tidak ditemukan</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return <Badge variant="success">Selesai</Badge>;
      case 'Berlangsung':
        return <Badge variant="info">Berlangsung</Badge>;
      case 'Belum Dimulai':
        return <Badge variant="warning">Belum Dimulai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleMarkComplete = () => {
    setIsMarkingComplete(true);
    // Simulate API call
    setTimeout(() => {
      alert('Penugasan telah ditandai sebagai SELESAI!');
      setIsMarkingComplete(false);
      navigate('/dashboard/monitor-penugasan-protokol');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Detail Penugasan</h1>
            <p className="text-sm text-gray-600 mt-1">{penugasan.agenda_terkait}</p>
          </div>
        </div>
        {penugasan.status_pelaksanaan !== 'Selesai' && (
          <Button 
            onClick={handleMarkComplete}
            disabled={isMarkingComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {isMarkingComplete ? 'Memproses...' : 'Tandai Selesai'}
          </Button>
        )}
      </div>

      {/* Informasi Penugasan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Informasi Penugasan</h3>
            {getStatusBadge(penugasan.status_pelaksanaan)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Agenda Terkait
                </label>
                <p className="text-sm text-gray-900 mt-1 font-semibold">{penugasan.agenda_terkait}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Pimpinan
                </label>
                <p className="text-sm text-gray-900 mt-1">{penugasan.pimpinan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Kegiatan
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(penugasan.tanggal_kegiatan).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Waktu
                </label>
                <p className="text-sm text-gray-900 mt-1">{penugasan.waktu}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Lokasi
                </label>
                <p className="text-sm text-gray-900 mt-1">{penugasan.lokasi}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Staf Ditugaskan
                </label>
                <p className="text-sm text-gray-900 mt-1">{penugasan.nama_staf.join(', ')}</p>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Deskripsi Penugasan</label>
              <p className="text-sm text-gray-900 mt-1">{penugasan.deskripsi_penugasan}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Jenis Penugasan</label>
              <div className="mt-1">
                <Badge variant="info">{penugasan.jenis_penugasan}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Tanggal Penugasan</label>
              <p className="text-sm text-gray-900 mt-1">
                {new Date(penugasan.tanggal_penugasan).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Timeline Progress</h3>
            </div>
            <Badge variant="info">{penugasan.progress.length} Update</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {penugasan.progress.map((prog: any, idx: number) => (
              <div key={idx} className="relative pl-8 pb-6 border-l-2 border-blue-200 last:border-l-0 last:pb-0">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-white"></div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="info">{prog.tipe}</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(prog.tanggal).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 mb-4">{prog.keterangan}</p>
                  
                  {/* Foto Dokumentasi */}
                  {prog.foto && (
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-2">
                        Dokumentasi Foto
                      </label>
                      <div className="rounded-lg overflow-hidden border border-gray-300">
                        <img 
                          src={prog.foto} 
                          alt={`Dokumentasi ${prog.tipe}`}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Ringkasan</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Total Progress</p>
              <p className="text-2xl font-semibold text-blue-600">{penugasan.progress.length}</p>
              <p className="text-xs text-gray-500 mt-1">Update</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Staf Bertugas</p>
              <p className="text-2xl font-semibold text-green-600">{penugasan.nama_staf.length}</p>
              <p className="text-xs text-gray-500 mt-1">Orang</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <div className="mt-2">{getStatusBadge(penugasan.status_pelaksanaan)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
          Kembali ke Daftar
        </Button>
        {penugasan.status_pelaksanaan !== 'Selesai' && (
          <Button 
            onClick={handleMarkComplete}
            disabled={isMarkingComplete}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {isMarkingComplete ? 'Memproses...' : 'Tandai Selesai'}
          </Button>
        )}
      </div>
    </div>
  );
}
