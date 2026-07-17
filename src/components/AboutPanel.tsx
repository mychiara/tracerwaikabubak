import React from 'react';
import { 
  Code, MessageCircle, Mail, MapPin, Building, Activity, 
  Globe, GraduationCap, Laptop, FileText, 
  CheckSquare, Award, Heart
} from 'lucide-react';

// Custom inline SVG icons for Instagram & Facebook to bypass missing export issues
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export const AboutPanel: React.FC = () => {
  const portfolioItems = [
    {
      title: 'CBT Online Keperawatan',
      url: 'https://cbt-wkb.masandigital.com/',
      icon: GraduationCap,
      color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/30'
    },
    {
      title: 'Bimbel Online Keperawatan',
      url: 'https://bimbel.masandigital.com/',
      icon: Laptop,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30'
    },
    {
      title: 'Bimbel Online Kebidanan',
      url: 'https://bimbelbidan.masandigital.com/',
      icon: Heart,
      color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/30'
    },
    {
      title: 'SDKI & SLKI Digital',
      url: 'https://sdkipro.com/',
      icon: Activity,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
    },
    {
      title: 'PDF Tools Terlengkap',
      url: 'https://toolpdf.masandigital.com/',
      icon: FileText,
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/30'
    },
    {
      title: 'Monev Praktik Klinik',
      url: 'https://logbook.masandigital.com/',
      icon: CheckSquare,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
    },
    {
      title: 'Bimbel CAT ASN',
      url: 'https://smart-asn.masandigital.com/',
      icon: Award,
      color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-slide-up">
      {/* Profile Header Card */}
      <div className="glass p-8 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-xl border border-color">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500" />
        
        {/* Avatar */}
        <div className="relative inline-block" style={{ margin: '0 auto' }}>
          <div 
            className="shadow-2xl bg-slate-100 dark:bg-slate-800"
            style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto',
              border: '4px solid var(--bg-card, #fff)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <img 
              src="/profil.png" 
              alt="Septian Andi Prianto" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                // Fallback to text avatar if image fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Septian Andi Prianto</h2>
          <p className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center justify-center gap-1.5 uppercase tracking-wider">
            <Code size={14} /> Fullstack Developer & Nurse Educator
          </p>
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap gap-3 justify-center">
          <a 
            href="https://wa.me/6282247926207" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline text-xs px-5 py-2.5 rounded-full flex items-center gap-2 font-bold transition-all duration-200"
            style={{ 
              color: '#10b981', 
              borderColor: 'rgba(16, 185, 129, 0.3)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
          >
            <MessageCircle size={15} fill="none" stroke="currentColor" />
            WhatsApp
          </a>
          
          <a 
            href="mailto:masandigital@gmail.com"
            className="btn btn-outline text-xs px-5 py-2.5 rounded-full flex items-center gap-2 font-bold transition-all duration-200"
            style={{ 
              color: '#3b82f6', 
              borderColor: 'rgba(59, 130, 246, 0.3)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }}
          >
            <Mail size={15} />
            Email
          </a>
        </div>
      </div>

      {/* Two Column details: Profile & Social Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Profil Profesional */}
        <div className="glass p-6 rounded-2xl border border-color space-y-4 shadow-md">
          <div className="border-l-4 border-l-blue-600 pl-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>👤</span> Profil Profesional
            </h3>
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex gap-3 items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-color">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <Building size={16} />
              </div>
              <div className="text-xs">
                <span className="text-muted block text-[10px] uppercase font-bold tracking-wide">Institusi</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">Poltekkes Kemenkes Kupang</span>
              </div>
            </div>

            <div className="flex gap-3 items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-color">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin size={16} />
              </div>
              <div className="text-xs">
                <span className="text-muted block text-[10px] uppercase font-bold tracking-wide">Lokasi</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">Waikabubak, Sumba Barat</span>
              </div>
            </div>

            <div className="flex gap-3 items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-color">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <Laptop size={16} />
              </div>
              <div className="text-xs">
                <span className="text-muted block text-[10px] uppercase font-bold tracking-wide">Spesialisasi</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">Health IT Solutions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Jejaring Sosial */}
        <div className="glass p-6 rounded-2xl border border-color space-y-4 shadow-md">
          <div className="border-l-4 border-l-teal-600 pl-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>📢</span> Jejaring Sosial
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            <a 
              href="https://instagram.com/Maz_4ndy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex gap-3 items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-color hover:border-pink-500/30 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center shrink-0">
                <InstagramIcon />
              </div>
              <div className="text-xs">
                <span className="text-muted block text-[10px] uppercase font-bold tracking-wide">Instagram</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">@Maz_4ndy</span>
              </div>
            </a>

            <a 
              href="https://facebook.com/mas4ndy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex gap-3 items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-color hover:border-blue-500/30 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <FacebookIcon />
              </div>
              <div className="text-xs">
                <span className="text-muted block text-[10px] uppercase font-bold tracking-wide">Facebook</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">@mas4ndy</span>
              </div>
            </a>

            <a 
              href="https://masandigital.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex gap-3 items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-color hover:border-teal-500/30 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                <Globe size={16} />
              </div>
              <div className="text-xs">
                <span className="text-muted block text-[10px] uppercase font-bold tracking-wide">Website</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">masandigital.com</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Portfolio & Digital Products */}
      <div className="glass p-6 rounded-2xl border border-color space-y-5 shadow-md">
        <div className="border-l-4 border-l-blue-600 pl-3">
          <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span>📦</span> Portfolio & Digital Products
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolioItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a 
                key={idx}
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-color hover:border-teal-500/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 leading-tight">
                    {item.title}
                  </span>
                </div>
                <div className="w-5 h-5 rounded-full border border-color flex items-center justify-center text-muted hover:text-slate-700 dark:hover:text-slate-200 shrink-0">
                  <span style={{ fontSize: '10px' }}>➜</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Collaboration Card */}
      <div 
        className="p-6 rounded-2xl text-center space-y-3"
        style={{
          border: '1.5px dashed rgba(0, 185, 173, 0.1)',
          background: 'linear-gradient(135deg, rgba(0, 185, 173, 0.1) 0%, rgba(0, 185, 173, 0.1) 100%)'
        }}
      >
        <span className="text-xl">🤝</span>
        <h4 className="text-xs font-black text-teal-900 dark:text-teal-300 uppercase tracking-wide">
          Ingin Bekerja Sama?
        </h4>
        <p className="text-xs text-muted max-w-lg mx-auto leading-relaxed">
          Tersedia untuk kolaborasi pengembangan sistem informasi kesehatan, pelatihan digital, atau konsultasi IT medis lainnya.
        </p>
      </div>

      {/* Footer info */}
      <div className="text-center text-[10px] text-muted space-y-1 pt-2">
        <p>Aplikasi Tracer Study Alumni © Mas Andy - masandigital.com | Built with ❤️ & Supabase/React</p>
      </div>
    </div>
  );
};
