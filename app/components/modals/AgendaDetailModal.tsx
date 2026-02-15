import { X, FileText, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface AgendaDetailModalProps {
  agenda: any;
  onClose: () => void;
}

export default function AgendaDetailModal({ agenda, onClose }: AgendaDetailModalProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Detail Agenda</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nomor Surat</label>
              <p className="mt-1 text-sm text-gray-900">{agenda.nomor_surat}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tanggal Surat</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(agenda.tanggal_surat).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Perihal</label>
            <p className="mt-1 text-sm text-gray-900">{agenda.perihal}</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Informasi Kegiatan</label>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Nama Kegiatan</p>
                  <p className="text-sm text-gray-900">{agenda.nama_kegiatan}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Lokasi</p>
                  <p className="text-sm text-gray-900">{agenda.lokasi_kegiatan}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Tanggal Kegiatan</p>
                  <p className="text-sm text-gray-900">
                    {new Date(agenda.tanggal_kegiatan).toLocaleDateString('id-ID', {
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
                  <p className="text-sm font-medium text-gray-700">Waktu</p>
                  <p className="text-sm text-gray-900">
                    {agenda.waktu_mulai} - {agenda.waktu_selesai} WIB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="text-sm font-medium text-gray-700">Status Agenda</label>
            <div className="mt-2">
              <Badge variant={getStatusVariant(agenda.status_agenda)}>
                {agenda.status_agenda}
              </Badge>
            </div>
          </div>

          {agenda.catatan_verifikasi && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-1">Catatan Verifikasi</p>
              <p className="text-sm text-blue-800">{agenda.catatan_verifikasi}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Surat Permohonan</label>
            <div className="mt-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                {agenda.surat_permohonan}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          {agenda.status_agenda === 'Pending' && (
            <>
              <Button variant="secondary">
                Tolak
              </Button>
              <Button variant="default">
                Setujui
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
