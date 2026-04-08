import { Link } from 'react-router';

interface FooterProps {
  navLinks?: Array<{ label: string; id: string }>;
  scrollTo?: (id: string) => void;
}

export default function Footer({ navLinks, scrollTo }: FooterProps) {
  const defaultNavLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Fitur', id: 'fitur' },
    { label: 'Alur', id: 'alur' },
    { label: 'Berita', id: 'berita' },
  ];

  const links = navLinks || defaultNavLinks;

  const handleScroll = (id: string) => {
    if (scrollTo) {
      scrollTo(id);
    } else {
      // Fallback for pages that don't have the scroll function (redirect to home anchor)
      window.location.href = `/#${id}`;
    }
  };

  return (
    <footer className="bg-slate-50 text-slate-600 pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pb-16 border-b border-slate-200">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/logo-padang.svg" alt="Logo Kota Padang" className="w-full h-full object-contain" />
              </div>
              <p className="text-2xl font-black text-slate-900 tracking-tighter uppercase">SIMAP</p>
            </div>
            <p className="text-sm font-medium leading-relaxed max-w-xs text-slate-500">
              Inovasi tata kelola agenda dan komunikasi pimpinan daerah Kota Padang berbasis teknologi digital unggulan untuk transparansi dan efisiensi.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-8">Navigation</h4>
            <ul className="space-y-4">
              {links.map((link, j) => (
                <li key={j}>
                  <button 
                    onClick={() => handleScroll(link.id)} 
                    className="text-sm font-semibold hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / Connect */}
          <div>
            <h4 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-8">Connect</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm font-semibold hover:text-blue-600 transition-colors">Instagram</a></li>
              <li><a href="#" className="text-sm font-semibold hover:text-blue-600 transition-colors">Twitter</a></li>
              <li><a href="#" className="text-sm font-semibold hover:text-blue-600 transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">
            &copy; {new Date().getFullYear()} Bagian Protokol dan Komunikasi Pimpinan. <span className="hidden sm:inline">All Rights Reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
