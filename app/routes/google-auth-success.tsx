import { useSearchParams } from "react-router";
import { CheckCircle, Calendar, ExternalLink } from "lucide-react";
import { useEffect } from "react";

export default function GoogleAuthSuccessPage() {
    const [searchParams] = useSearchParams();
    const nama = searchParams.get("nama") || "Pimpinan";

    useEffect(() => {
        // Automatically redirect to Google Calendar after 3 seconds
        const timer = setTimeout(() => {
            window.location.href = "https://calendar.google.com";
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-500 border border-slate-100">
                <div className="mb-6 flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full ring-8 ring-green-50">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Sinkronisasi Berhasil!
                </h1>
                
                <p className="text-slate-600 mb-8">
                    Halo <strong>{nama}</strong>, Google Calendar Anda telah berhasil terhubung dengan sistem SIMAP. 
                </p>

                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl flex items-start text-left gap-3 border border-blue-100">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Agenda kegiatan Anda akan otomatis muncul di kalender Anda secara real-time.
                        </p>
                    </div>

                    <div className="pt-4">
                        <p className="text-xs text-slate-400 mb-4 animate-pulse">
                            Mengarahkan ke Google Calendar dalam 3 detik...
                        </p>
                        
                        <a 
                            href="https://calendar.google.com" 
                            className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 text-white rounded-xl py-4 font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            Buka Google Calendar Sekarang <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
