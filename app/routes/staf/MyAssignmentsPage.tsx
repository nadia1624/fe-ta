import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function MyAssignmentsPage() {
  const assignments = [
    {
      id: 1,
      agenda: 'Rapat Koordinasi Bulanan',
      jenis_penugasan: 'Protokol',
      deskripsi: 'Persiapan dan pelaksanaan protokoler rapat koordinasi',
      tanggal_kegiatan: '2025-02-01',
      waktu: '09:00 - 11:00',
      lokasi: 'Ruang Rapat Utama',
      status: 'On Progress',
      tanggal_penugasan: '2025-01-28',
      catatan: 'Pastikan sound system berfungsi dengan baik'
    },
    {
      id: 2,
      agenda: 'Kunjungan Kerja Dinas Pendidikan',
      jenis_penugasan: 'Media',
      deskripsi: 'Dokumentasi foto dan video kegiatan',
      tanggal_kegiatan: '2025-02-03',
      waktu: '10:30 - 12:30',
      lokasi: 'Aula Kantor Walikota',
      status: 'Not Started',
      tanggal_penugasan: '2025-01-29',
      catatan: 'Bawa kamera dan tripod'
    },
    {
      id: 3,
      agenda: 'Upacara Peringatan Hari Kemerdekaan',
      jenis_penugasan: 'Protokol',
      deskripsi: 'Koordinasi pelaksanaan upacara',
      tanggal_kegiatan: '2025-02-05',
      waktu: '08:00 - 10:00',
      lokasi: 'Lapangan Upacara',
      status: 'Not Started',
      tanggal_penugasan: '2025-01-27',
      catatan: null
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'On Progress': return 'info';
      case 'Not Started': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return CheckCircle;
      case 'On Progress': return Clock;
      case 'Not Started': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tugas Saya</h1>
        <p className="text-sm text-gray-600 mt-1">Kelola dan update status tugas yang ditugaskan kepada Anda</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {assignments.map((assignment) => {
          const StatusIcon = getStatusIcon(assignment.status);
          return (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{assignment.agenda}</h3>
                      <Badge variant={assignment.jenis_penugasan === 'Protokol' ? 'info' : 'default'}>
                        {assignment.jenis_penugasan}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{assignment.deskripsi}</p>
                  </div>
                  <Badge variant={getStatusVariant(assignment.status)}>
                    {assignment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Tanggal Kegiatan</p>
                    <p className="text-sm text-gray-900">
                      {new Date(assignment.tanggal_kegiatan).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Waktu</p>
                    <p className="text-sm text-gray-900">{assignment.waktu}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Lokasi</p>
                    <p className="text-sm text-gray-900">{assignment.lokasi}</p>
                  </div>
                </div>

                {assignment.catatan && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs font-medium text-blue-900 mb-1">Catatan:</p>
                    <p className="text-sm text-blue-800">{assignment.catatan}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  {assignment.status === 'Not Started' && (
                    <Button size="sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Mulai Tugas
                    </Button>
                  )}
                  {assignment.status === 'On Progress' && (
                    <Button size="sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Tandai Selesai
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}