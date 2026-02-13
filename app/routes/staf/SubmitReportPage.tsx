import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Upload } from 'lucide-react';

export default function SubmitReportPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Laporan berhasil dikirim!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Submit Laporan Kegiatan</h1>
        <p className="text-sm text-gray-600 mt-1">Kirim laporan dan dokumentasi kegiatan yang telah dilaksanakan</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Form Laporan Kegiatan</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Agenda Terkait <span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Pilih agenda...</option>
                <option value="1">Rapat Koordinasi Bulanan - 01 Feb 2025</option>
                <option value="2">Kunjungan Kerja Dinas Pendidikan - 03 Feb 2025</option>
                <option value="3">Upacara Peringatan - 05 Feb 2025</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Laporan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Jelaskan pelaksanaan kegiatan secara detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Laporan
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Tambahkan catatan tambahan (opsional)..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dokumentasi (Foto/Video)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Klik untuk upload atau drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG, atau MP4 (max. 50MB per file)
                </p>
                <input type="file" className="hidden" multiple accept="image/*,video/*" />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Catatan:</strong> Pastikan laporan yang disubmit sudah lengkap dan akurat. 
                Laporan akan direview oleh Kasubag sebelum disetujui.
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1">
                Reset
              </Button>
              <Button type="submit" className="flex-1">
                Submit Laporan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
