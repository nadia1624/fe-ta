import { Link } from 'react-router';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, Clock, ClipboardList } from 'lucide-react';

interface AgendaHariIniListProps {
  agendas: any[];
  role: 'kasubag_media' | 'sespri' | 'kasubag_protokol' | 'staf_media' | 'staf_protokol';
}

export function AgendaHariIniList({ agendas, role }: AgendaHariIniListProps) {
  const processedAgendas = (agendas || []).map((a: any) => {
    const attendeeNames: string[] = [];
    const attendeePositions: string[] = [];
    const seenAttendees = new Set<string>();
    
    // 1. Process attendance names and positions
    a.slotAgendaPimpinans?.forEach((sap: any) => {
      const attendeeId = `${sap.id_jabatan_hadir}-${sap.id_periode_hadir}`;
      if (!seenAttendees.has(attendeeId)) {
        seenAttendees.add(attendeeId);
        const name = sap.periodeJabatanHadir?.pimpinan?.nama_pimpinan || '-';
        const position = sap.periodeJabatanHadir?.jabatan?.nama_jabatan || '-';
        
        if (sap.id_jabatan_diusulkan && sap.id_jabatan_hadir !== sap.id_jabatan_diusulkan) {
          const originalPimpinan = a.agendaPimpinans?.find((ap: any) => ap.id_jabatan === sap.id_jabatan_diusulkan);
          const originalName = originalPimpinan?.periodeJabatan?.pimpinan?.nama_pimpinan || 'Pimpinan';
          attendeeNames.push(`${name} (Wakil ${originalName})`);
        } else {
          attendeeNames.push(name);
        }
        
        if (position && !attendeePositions.includes(position)) {
          attendeePositions.push(position);
        }
      }
    });

    if (attendeeNames.length === 0) {
      a.agendaPimpinans?.forEach((ap: any) => {
        if (ap.status_kehadiran === 'diwakilkan' && ap.nama_perwakilan) {
          attendeeNames.push(`${ap.nama_perwakilan} (Wakil ${ap.periodeJabatan?.pimpinan?.nama_pimpinan || 'Pimpinan'})`);
          attendeePositions.push('Perwakilan');
        } else {
          attendeeNames.push(ap.periodeJabatan?.pimpinan?.nama_pimpinan || '-');
          attendeePositions.push(ap.periodeJabatan?.jabatan?.nama_jabatan || '-');
        }
      });
    }

    // 2. Process progress reports
    const progressReports = a.penugasans?.flatMap((p: any) => p.laporanKegiatans?.map((l: any) => ({
      id: l.id_laporan,
      tipe: l.deskripsi_laporan,
      deskripsi: l.catatan_laporan,
      foto: l.dokumentasi_laporan ? l.dokumentasi_laporan.split(',').length : 0,
      waktu: new Date(l.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }))) || [];

    return {
      id: a.id_agenda,
      kegiatan: a.nama_kegiatan,
      pimpinan: attendeeNames.length > 0 ? attendeeNames.join(', ') : '-',
      jabatan: attendeePositions.length > 0 ? [...new Set(attendeePositions)].join(' & ') : '-',
      waktu: `${a.waktu_mulai?.slice(0, 5)} - ${a.waktu_selesai?.slice(0, 5)}`,
      tempat: a.lokasi_kegiatan,
      status: a.statusAgendas?.[0]?.status_agenda === 'completed' ? 'Selesai' :
        a.statusAgendas?.[0]?.status_agenda === 'delegated' ? 'Diwakilkan' : 'Berlangsung',
      progress_reports: progressReports
    };
  });

  if (processedAgendas.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Tidak ada agenda hari ini</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {processedAgendas.map((agenda) => (
        <div key={agenda.id} className="px-6 py-5 hover:bg-gray-50/50 transition-colors group">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <h4 className="text-[16px] font-bold text-gray-900">{agenda.kegiatan}</h4>
                <Badge
                  variant={
                    agenda.status === 'Berlangsung' ? 'info' :
                    agenda.status === 'Selesai' ? 'success' :
                    agenda.status === 'Diwakilkan' ? 'secondary' :
                    'warning'
                  }
                >
                  {agenda.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{agenda.pimpinan}</span> · {agenda.jabatan}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {agenda.waktu}</span>
                  <span className="flex items-center gap-1">📍 {agenda.tempat}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Progress Reports Section */}
          <div className={`mt-3 pt-3 border-t ${agenda.progress_reports.length > 0 ? 'border-blue-200' : 'border-gray-200'}`}>
            <div className="flex items-start gap-2">
              <ClipboardList className={`w-4 h-4 mt-0.5 ${agenda.progress_reports.length > 0 ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  {agenda.progress_reports.length > 0 ? `✓ ${agenda.progress_reports.length} Laporan Progress` : '○ Belum Ada Laporan'}
                </p>
                {agenda.progress_reports.length > 0 ? (
                  <div className="space-y-3">
                    {agenda.progress_reports.map((report: any) => (
                      <div key={report.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start gap-2 mb-2">
                          <Badge variant="info" className="text-xs">
                            {report.tipe}
                          </Badge>
                          <span className="text-xs text-gray-500">{report.waktu}</span>
                        </div>
                        <p className="text-sm text-gray-900 mb-2">{report.deskripsi}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            📷 {report.foto} Foto
                          </span>
                        </div>
                      </div>
                    ))}
                    <Link to={
                      role === 'sespri' ? '/sespri/laporan-kegiatan-jadwal' : 
                      role === 'kasubag_protokol' ? `/kasubag-protokol/laporan-kegiatan/${agenda.id}` :
                      role === 'staf_media' ? `/staff-media/tugas-saya` : 
                      role === 'staf_protokol' ? `/staff-protokol/tugas-saya` :
                      `/kasubag-media/laporan-kegiatan/${agenda.id}`
                    }>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        Lihat Semua Progress ({agenda.progress_reports.length})
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-500 italic">
                      Belum ada update laporan untuk kegiatan ini
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
