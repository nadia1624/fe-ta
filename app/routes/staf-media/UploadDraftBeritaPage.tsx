import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Upload, FileText } from 'lucide-react';

export default function UploadDraftBeritaPage() {
  const [formData, setFormData] = useState({
    agenda_terkait: '',
    judul_berita: '',
    isi_draft: '',
    catatan: ''
  });

  const myAgendas = [
    { id: 1, nama: 'Rapat Koordinasi Bulanan', tanggal: '2025-02-01' },
    { id: 2, nama: 'Kunjungan Kerja Dinas Pendidikan', tanggal: '2025-02-03' },
    { id: 3, nama: 'Upacara Peringatan Hari Kemerdekaan', tanggal: '2025-02-05' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agenda_terkait || !formData.judul_berita || !formData.isi_draft) {
      alert('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }
    alert('Draft berita berhasil dikirim ke Kasubag Media untuk direview!');
    setFormData({
      agenda_terkait: '',
      judul_berita: '',
      isi_draft: '',
      catatan: ''
    });
  };

  const handleReset = () => {
    setFormData({
      agenda_terkait: '',
      judul_berita: '',
      isi_draft: '',
      catatan: ''
    });
  };

  const wordCount = formData.isi_draft.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Upload Draft Berita</h1>
        <p className="text-sm text-gray-600 mt-1">Buat dan kirim draft berita untuk direview oleh Kasubag Media</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Form Draft Berita</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pilih Agenda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Agenda Terkait <span className="text-red-500">*</span>
              </label>
              <select 
                name="agenda_terkait"
                value={formData.agenda_terkait}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Pilih agenda yang sudah didokumentasikan...</option>
                {myAgendas.map((agenda) => (
                  <option key={agenda.id} value={agenda.id}>
                    {agenda.nama} - {new Date(agenda.tanggal).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Pilih agenda yang telah Anda dokumentasikan
              </p>
            </div>

            {/* Judul Berita */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Berita <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="judul_berita"
                value={formData.judul_berita}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Contoh: Walikota Hadiri Rapat Koordinasi Bulanan Februari 2025"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Buat judul yang informatif dan menarik
              </p>
            </div>

            {/* Isi Draft */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Isi Draft Berita <span className="text-red-500">*</span>
              </label>
              <textarea
                name="isi_draft"
                value={formData.isi_draft}
                onChange={handleChange}
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-sans"
                placeholder="Tulis isi berita di sini...&#10;&#10;Tips:&#10;- Gunakan struktur 5W+1H (What, Who, When, Where, Why, How)&#10;- Sertakan kutipan langsung jika ada&#10;- Tulis dengan bahasa formal dan objektif&#10;- Tambahkan detail yang relevan"
                required
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  Minimum 100 kata untuk draft berita
                </p>
                <p className={`text-xs font-medium ${wordCount >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                  {wordCount} kata
                </p>
              </div>
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan untuk Kasubag Media
              </label>
              <textarea
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Tambahkan catatan tambahan jika diperlukan (opsional)..."
              />
            </div>

            {/* Lampiran Dokumentasi (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lampiran Foto Dokumentasi (Opsional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Klik untuk upload foto pendukung berita
                </p>
                <p className="text-xs text-gray-500">
                  JPG atau PNG (max. 10MB per file, maksimal 5 foto)
                </p>
                <input type="file" className="hidden" multiple accept="image/*" />
              </div>
            </div>

            {/* Panduan */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-2">Panduan Penulisan Draft Berita:</p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Gunakan bahasa baku dan formal</li>
                    <li>Hindari opini pribadi, fokus pada fakta</li>
                    <li>Sertakan kutipan langsung dari narasumber jika ada</li>
                    <li>Periksa kembali ejaan dan tata bahasa</li>
                    <li>Draft akan direview oleh Kasubag Media sebelum dipublikasikan</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                Reset Form
              </Button>
              <Button type="submit" className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Kirim Draft ke Kasubag
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Tips Penulisan Berita yang Baik</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Struktur Piramida Terbalik:</h4>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Paragraf 1: Informasi paling penting (5W+1H)</li>
                <li>Paragraf 2-3: Detail dan penjelasan</li>
                <li>Paragraf terakhir: Informasi tambahan</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Yang Perlu Dihindari:</h4>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Bahasa yang terlalu berlebihan</li>
                <li>Kalimat yang terlalu panjang</li>
                <li>Informasi yang tidak akurat</li>
                <li>Kata-kata yang tidak baku</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}