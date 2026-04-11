import { useSearchParams, Link } from "react-router";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";

export default function GoogleAuthSuccessPage() {
    const [searchParams] = useSearchParams();
    const nama = searchParams.get("nama") || "Pimpinan";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="mb-6 flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Sinkronisasi Berhasil!
                </h1>
                
                <p className="text-slate-600 mb-8">
                    Halo <strong>{nama}</strong>, Google Calendar Anda telah berhasil terhubung dengan sistem SI-PEPIM. 
                    Agenda kegiatan Anda akan otomatis muncul di kalender Anda.
                </p>

                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl flex items-start text-left gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <p className="text-sm text-blue-800">
                            Setiap kali ajudan mengkonfirmasi kehadiran Anda, jadwal akan langsung masuk ke kalender Anda.
                        </p>
                    </div>

                    <div className="pt-4">
                        <p className="text-xs text-slate-400 mb-4">
                            Anda sekarang dapat menutup halaman ini.
                        </p>
                        
                        <Link 
                            to="/" 
                            className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 text-white rounded-xl py-3 font-medium hover:bg-slate-800 transition-colors"
                        >
                            Kembali ke Beranda <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
