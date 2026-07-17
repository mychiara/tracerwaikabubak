import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import {
  apiGetAlumni, apiAddAlumni, apiUpdateAlumni, apiDeleteAlumni,
  apiGetMitra, apiAddMitra, apiUpdateMitra, apiDeleteMitra,
  apiGetFeedback, apiAddFeedback, apiUpdateFeedback,
  apiGetAlumniFeedback, apiAddAlumniFeedback
} from './utils/db';
import type { Alumni, MitraKerjasama, PenggunaLulusan, AlumniFeedback } from './data/mockData';
import { DashboardOverview } from './components/DashboardOverview';
import { PublicLanding } from './components/PublicLanding';

import {
  LayoutDashboard, Map, GraduationCap, FileText,
  MessageSquare, BarChart3, Sun, Moon, Bell,
  Menu, X, LogOut, Globe, BookOpen, Info, ClipboardList,
  Award, Briefcase
} from 'lucide-react';

// Lazy loaded components for optimized loading speed
const MitraKerjasamaPanel = lazy(() => import('./components/MitraKerjasamaPanel').then(m => ({ default: m.MitraKerjasamaPanel })));
const AlumniTracerPanel = lazy(() => import('./components/AlumniTracerPanel').then(m => ({ default: m.AlumniTracerPanel })));
const FeedbackPenggunaPanel = lazy(() => import('./components/FeedbackPenggunaPanel').then(m => ({ default: m.FeedbackPenggunaPanel })));
const AlumniFeedbackPanel = lazy(() => import('./components/AlumniFeedbackPanel').then(m => ({ default: m.AlumniFeedbackPanel })));
const LaporanAnalisisPanel = lazy(() => import('./components/LaporanAnalisisPanel').then(m => ({ default: m.LaporanAnalisisPanel })));
const SumbaMap = lazy(() => import('./components/SumbaMap').then(m => ({ default: m.SumbaMap })));
const SupabasePanel = lazy(() => import('./components/SupabasePanel').then(m => ({ default: m.SupabasePanel })));
const LoginPage = lazy(() => import('./components/LoginPage').then(m => ({ default: m.LoginPage })));
const UkomAnalisisPanel = lazy(() => import('./components/UkomAnalisisPanel').then(m => ({ default: m.UkomAnalisisPanel })));
const JabatanAnalisisPanel = lazy(() => import('./components/JabatanAnalisisPanel').then(m => ({ default: m.JabatanAnalisisPanel })));

import { MitraDashboard } from './components/MitraDashboard';
import { PanduanPanel } from './components/PanduanPanel';
import { AboutPanel } from './components/AboutPanel';

type AppMode = 'public' | 'login' | 'admin' | 'mitra';

function App() {
  const [mode, setMode] = useState<AppMode>(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') return 'admin';
    if (sessionStorage.getItem('mitra_auth') === 'true') return 'mitra';
    return 'public';
  });
  const [loggedInMitraId, setLoggedInMitraId] = useState<string | null>(() => {
    return sessionStorage.getItem('mitra_id');
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [mitra, setMitra] = useState<MitraKerjasama[]>([]);
  const [feedback, setFeedback] = useState<PenggunaLulusan[]>([]);
  const [alumniFeedback, setAlumniFeedback] = useState<AlumniFeedback[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedHospitalName, setSelectedHospitalName] = useState<string | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Compute notifications list dynamically
  const notifications = useMemo(() => {
    const list: { id: string; type: 'mou_expired' | 'mou_expiring' | 'unrated_alumni'; message: string; actionTab: string }[] = [];
    const today = new Date();

    // 1. Expiring MoU
    mitra.forEach(m => {
      if (m.tanggal_berakhir) {
        const expDate = new Date(m.tanggal_berakhir);
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          list.push({
            id: `mou-exp-${m.id}`,
            type: 'mou_expired',
            message: `MoU ${m.nama_rs} telah kedaluwarsa (${m.tanggal_berakhir}).`,
            actionTab: 'mitra'
          });
        } else if (diffDays <= 90) {
          list.push({
            id: `mou-expi-${m.id}`,
            type: 'mou_expiring',
            message: `MoU ${m.nama_rs} akan berakhir dalam ${diffDays} hari.`,
            actionTab: 'mitra'
          });
        }
      }
    });

    // 2. Unrated Alumni
    alumni.forEach(a => {
      if (a.status_kerja === 'Bekerja' && a.nama_institusi && a.nama_institusi !== '-') {
        const partner = mitra.find(m => m.nama_rs.toLowerCase().includes(a.nama_institusi.toLowerCase()) || a.nama_institusi.toLowerCase().includes(m.nama_rs.toLowerCase()));
        if (partner) {
          const hasFeedback = feedback.some(f => f.nama_mitra.toLowerCase() === partner.nama_rs.toLowerCase());
          if (!hasFeedback) {
            list.push({
              id: `unrated-${a.id}`,
              type: 'unrated_alumni',
              message: `Alumni ${a.nama} bekerja di ${partner.nama_rs} belum mendapat survei kepuasan.`,
              actionTab: 'feedback'
            });
          }
        }
      }
    });

    return list;
  }, [mitra, alumni, feedback]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [alumniData, mitraData, feedbackData, alumniFeedbackData] = await Promise.all([
        apiGetAlumni(), apiGetMitra(), apiGetFeedback(), apiGetAlumniFeedback()
      ]);
      setAlumni(alumniData);
      setMitra(mitraData);
      setFeedback(feedbackData);
      setAlumniFeedback(alumniFeedbackData);
    } catch (e) {
      console.error('Error loading data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const handleLogin = () => { setMode('admin'); setActiveTab('dashboard'); };
  const handleMitraLogin = (mitraId: string) => {
    setLoggedInMitraId(mitraId);
    setMode('mitra');
  };
  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('mitra_auth');
    sessionStorage.removeItem('mitra_id');
    setLoggedInMitraId(null);
    setMode('public');
  };

  // CRUD handlers
  const handleAddAlumni = async (a: Omit<Alumni, 'id' | 'created_at'>) => {
    const res = await apiAddAlumni(a);
    setAlumni(prev => [res, ...prev]);
    return res;
  };
  const handleUpdateAlumni = async (a: Alumni) => {
    const res = await apiUpdateAlumni(a);
    setAlumni(prev => prev.map(item => item.id === a.id ? res : item));
    return res;
  };
  const handleDeleteAlumni = async (id: string) => {
    const res = await apiDeleteAlumni(id);
    if (res) setAlumni(prev => prev.filter(item => item.id !== id));
    return res;
  };
  const handleAddMitra = async (m: Omit<MitraKerjasama, 'id' | 'created_at'>) => {
    const res = await apiAddMitra(m);
    setMitra(prev => [res, ...prev]);
    return res;
  };
  const handleUpdateMitra = async (m: MitraKerjasama) => {
    const res = await apiUpdateMitra(m);
    setMitra(prev => prev.map(item => item.id === m.id ? res : item));
    return res;
  };
  const handleDeleteMitra = async (id: string) => {
    const res = await apiDeleteMitra(id);
    if (res) setMitra(prev => prev.filter(item => item.id !== id));
    return res;
  };
  const handleAddFeedback = async (f: Omit<PenggunaLulusan, 'id' | 'created_at'>) => {
    const res = await apiAddFeedback(f);
    setFeedback(prev => [res, ...prev]);
    return res;
  };
  const handleAddAlumniFeedback = async (af: Omit<AlumniFeedback, 'id' | 'created_at'>) => {
    const res = await apiAddAlumniFeedback(af);
    setAlumniFeedback(prev => [res, ...prev]);
    return res;
  };
  const handleUpdateFeedback = async (f: PenggunaLulusan) => {
    const res = await apiUpdateFeedback(f);
    setFeedback(prev => prev.map(item => item.id === f.id ? res : item));
    return res;
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Peta Sebaran', icon: Map },
    { id: 'mitra', label: 'Kemitraan', icon: FileText },
    { id: 'alumni', label: 'Tracer Alumni', icon: GraduationCap },
    { id: 'feedback', label: 'Grafik Pengguna Lulusan', icon: MessageSquare },
    { id: 'alumniFeedback', label: 'Rekapan Umpan Balik', icon: ClipboardList },
    { id: 'analisis', label: 'Analisis & Kurikulum', icon: BarChart3 },
    { id: 'ukom', label: 'Analisis UKOM', icon: Award },
    { id: 'jabatan', label: 'Analisis Jabatan', icon: Briefcase },
    { id: 'panduan', label: 'Panduan Sistem', icon: BookOpen },
    { id: 'about', label: 'Tentang Aplikasi', icon: Info },
  ];

  // ── PUBLIC LANDING ──
  if (mode === 'public') {
    if (isLoading) {
      return (
        <div className="loading-screen">
          <div className="loading-blob loading-blob-1" />
          <div className="loading-blob loading-blob-2" />
          <div className="loading-center">
            <div className="loading-icon">🏥</div>
            <div className="loading-spinner" />
            <p className="loading-text">Memuat data portal...</p>
          </div>
        </div>
      );
    }
    return (
      <PublicLanding
        alumni={alumni}
        mitra={mitra}
        feedback={feedback}
        theme={theme}
        toggleTheme={toggleTheme}
        onAdminLogin={() => setMode('login')}
        onAddFeedback={handleAddFeedback}
        onUpdateMitra={handleUpdateMitra}
        onAddAlumniFeedback={handleAddAlumniFeedback}
        onUpdateAlumni={handleUpdateAlumni}
      />
    );
  }

  // ── LOGIN PAGE ──
  if (mode === 'login') {
    return (
      <Suspense fallback={
        <div className="loading-screen">
          <div className="loading-spinner" />
        </div>
      }>
        <LoginPage
          onLogin={handleLogin}
          onMitraLogin={handleMitraLogin}
          mitra={mitra}
          theme={theme}
          toggleTheme={toggleTheme}
          onBackToPublic={() => setMode('public')}
        />
      </Suspense>
    );
  }

  // ── MITRA PANEL ──
  if (mode === 'mitra' && loggedInMitraId) {
    return (
      <MitraDashboard
        mitraId={loggedInMitraId}
        mitra={mitra}
        alumni={alumni}
        feedback={feedback}
        onUpdateMitra={handleUpdateMitra}
        onAddFeedback={handleAddFeedback}
        onUpdateFeedback={handleUpdateFeedback}
        onAddAlumni={handleAddAlumni}
        onLogout={handleLogout}
      />
    );
  }

  // ── ADMIN PANEL ──
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar glass ${isMobileMenuOpen ? 'sidebar-mobile-open' : 'sidebar-desktop'}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">🏥</div>
          <div>
            <h1 className="sidebar-title">Tracer Study, Kemitraan dan UKOM</h1>
            <span className="sidebar-subtitle">Prodi D3 Keperawatan Waikabubak</span>
          </div>
          {isMobileMenuOpen && (
            <button className="sidebar-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={16} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold ${
                  isActive ? 'active' : 'text-muted'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {/* Public view link */}
          <button
            className="sidebar-public-btn"
            onClick={() => { sessionStorage.removeItem('admin_auth'); setMode('public'); }}
          >
            <Globe size={13} /> Lihat Halaman Publik
          </button>

          {/* Logout */}
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={13} /> Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="admin-header">
          <div className="flex items-center gap-3">
            <button
              className="btn btn-outline p-2 admin-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={18} />
            </button>
            <div>
              <h2 className="admin-header-title">
                {navigationItems.find(n => n.id === activeTab)?.label}
              </h2>
              <p className="admin-header-sub">Poltekkes Kemenkes Kupang Prodi D3 Keperawatan Waikabubak</p>
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                className="btn btn-outline p-2 rounded-full relative"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                title="Pemberitahuan"
              >
                <Bell size={17} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-black" style={{ minWidth: '16px', height: '16px' }}>
                    {notifications.length}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 glass border border-color rounded-2xl p-4 shadow-2xl z-50 max-h-[360px] overflow-y-auto space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-color">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Pemberitahuan</span>
                    <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2.5 py-0.5 rounded-full font-black">
                      {notifications.length} Info
                    </span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      🎉 Tidak ada peringatan sistem baru. Semua data aman!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className="p-2.5 rounded-xl border border-color/40 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100/60 dark:hover:bg-slate-900/30 transition-all duration-150 cursor-pointer text-left space-y-1"
                          onClick={() => {
                            setActiveTab(notif.actionTab);
                            setIsNotifOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              notif.type === 'mou_expired' ? 'bg-rose-500' :
                              notif.type === 'mou_expiring' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {notif.type === 'mou_expired' ? 'MoU Expired' :
                               notif.type === 'mou_expiring' ? 'MoU Segera Berakhir' : 'Survei Belum Diisi'}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed font-semibold text-slate-700 dark:text-slate-300">
                            {notif.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              className="btn btn-outline p-2 rounded-full"
              onClick={toggleTheme}
              title="Toggle tema"
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button className="btn btn-outline p-2 rounded-full" onClick={handleLogout} title="Logout">
              <LogOut size={17} />
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="admin-spinner" />
            <p className="text-muted text-xs font-bold">Memuat data dari database...</p>
          </div>
        ) : (
          <div className="admin-content-area">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="admin-spinner" />
                <p className="text-muted text-xs font-bold">Memuat modul panel...</p>
              </div>
            }>
              {activeTab === 'dashboard' && (
                <DashboardOverview alumni={alumni} mitra={mitra} feedback={feedback} alumniFeedback={alumniFeedback} setActiveTab={setActiveTab} />
              )}
              {activeTab === 'map' && (
                <SumbaMap alumni={alumni} mitra={mitra}
                  onSelectHospital={(name) => { setSelectedHospitalName(name); setActiveTab('mitra'); }} />
              )}
              {activeTab === 'mitra' && (
                <MitraKerjasamaPanel mitra={mitra} onAdd={handleAddMitra} onUpdate={handleUpdateMitra}
                  onDelete={handleDeleteMitra} selectedHospitalName={selectedHospitalName}
                  onClearSelectedHospital={() => setSelectedHospitalName(null)} />
              )}
              {activeTab === 'alumni' && (
                <AlumniTracerPanel alumni={alumni} onAdd={handleAddAlumni}
                  onUpdate={handleUpdateAlumni} onDelete={handleDeleteAlumni} />
              )}
              {activeTab === 'feedback' && (
                <FeedbackPenggunaPanel feedback={feedback} onAdd={handleAddFeedback} />
              )}
              {activeTab === 'alumniFeedback' && (
                <AlumniFeedbackPanel alumniFeedback={alumniFeedback} />
              )}
              {activeTab === 'analisis' && (
                <LaporanAnalisisPanel alumni={alumni} feedback={feedback} />
              )}
              {activeTab === 'ukom' && (
                <UkomAnalisisPanel alumni={alumni} />
              )}
              {activeTab === 'jabatan' && (
                <JabatanAnalisisPanel alumni={alumni} />
              )}
              {activeTab === 'supabase' && <SupabasePanel />}
              {activeTab === 'panduan' && <PanduanPanel role="admin" />}
              {activeTab === 'about' && <AboutPanel />}
            </Suspense>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
