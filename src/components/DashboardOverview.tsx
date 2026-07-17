import React from 'react';
import type { Alumni, MitraKerjasama, PenggunaLulusan, AlumniFeedback } from '../data/mockData';
import { GraduationCap, Landmark, ShieldAlert, Award, ArrowRight, CheckCircle, TrendingUp, ClipboardList } from 'lucide-react';

interface DashboardOverviewProps {
  alumni: Alumni[];
  mitra: MitraKerjasama[];
  feedback: PenggunaLulusan[];
  alumniFeedback: AlumniFeedback[];
  setActiveTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  alumni,
  mitra,
  feedback,
  alumniFeedback,
  setActiveTab
}) => {
  // Key calculations
  const totalAlumni = alumni.length;
  const activeMitra = mitra.filter(m => m.status === 'Aktif' || m.status === 'Perpanjangan').length;
  
  const bekerjaCount = alumni.filter(a => a.status_kerja === 'Bekerja').length;
  const wirausahaCount = alumni.filter(a => a.status_kerja === 'Wirausaha').length;
  const studiCount = alumni.filter(a => a.status_kerja === 'Studi Lanjut').length;
  const mencariCount = alumni.filter(a => a.status_kerja === 'Mencari Kerja').length;

  // Employment rate (Bekerja + Wirausaha)
  const employedAlumniCount = alumni.filter(a => a.status_kerja === 'Bekerja' || a.status_kerja === 'Wirausaha').length;
  const employmentRate = totalAlumni > 0 
    ? ((employedAlumniCount / totalAlumni) * 100).toFixed(1)
    : '0';

  // Average feedback score
  const avgSatisfaction = feedback.length > 0
    ? (feedback.reduce((acc, curr) => {
        const itemAvg = (curr.etika_nilai + curr.keahlian_nilai + curr.bahasa_inggris_nilai + curr.teknologi_nilai + curr.komunikasi_nilai + curr.kerjasama_nilai + curr.pengembangan_diri_nilai) / 7;
        return acc + itemAvg;
      }, 0) / feedback.length).toFixed(2)
    : '0';

  // Expiring agreements alert
  const expiringMitra = mitra.filter(m => {
    if (m.status !== 'Aktif') return false;
    const expire = new Date(m.tanggal_berakhir);
    const limit = new Date();
    limit.setMonth(limit.getMonth() + 3);
    return expire <= limit && expire >= new Date();
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass p-6 bg-gradient-to-r from-blue-600/10 via-teal-500/10 to-teal-600/10 relative overflow-hidden rounded-xl border border-color">
        <div className="relative z-10 space-y-2">
          <span className="badge badge-primary py-1 px-3">Kabupaten Sumba Timur, Barat, Tengah & Barat Daya</span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Tracer Study dan Kemitraan & Kemitraan Instansi</h2>
          <p className="text-xs text-muted max-w-2xl leading-relaxed">
            Sistem Pemantauan Keterserapan Alumni dan Kemitraan Instansi Mitra. Diselenggarakan oleh Poltekkes Kemenkes Kupang Prodi D3 Keperawatan Waikabubak.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Alumni */}
        <div 
          className="p-4 flex items-center gap-3 rounded-2xl border border-blue-500/10 shadow-lg text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-inner shrink-0">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="text-[10px] text-blue-100 font-black block uppercase tracking-wider">Total Alumni</span>
            <h3 className="text-2xl font-black mt-0.5 text-white leading-none">{totalAlumni}</h3>
            <span className="text-[9px] text-blue-200/90 font-medium block mt-0.5">Tahun Lulus 2021–2025</span>
          </div>
        </div>

        {/* Card 2: Alumni Mengisi Tracer */}
        <div 
          className="p-4 flex items-center gap-3 rounded-2xl border border-teal-500/10 shadow-lg text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-inner shrink-0">
            <ClipboardList size={20} />
          </div>
          <div>
            <span className="text-[10px] text-teal-100 font-black block uppercase tracking-wider">Alumni Mengisi Tracer</span>
            <h3 className="text-2xl font-black mt-0.5 text-white leading-none">{alumniFeedback.length}</h3>
            <span className="text-[9px] text-teal-200/90 font-medium block mt-0.5">Mengisi Kuesioner & Tracer</span>
          </div>
        </div>

        {/* Card 3: Mitra Kerja Sama */}
        <div 
          className="p-4 flex items-center gap-3 rounded-2xl border border-emerald-500/10 shadow-lg text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-inner shrink-0">
            <Landmark size={20} />
          </div>
          <div>
            <span className="text-[10px] text-emerald-100 font-black block uppercase tracking-wider">Mitra Kerja Sama</span>
            <h3 className="text-2xl font-black mt-0.5 text-white leading-none">
              {activeMitra} <span className="text-xs font-normal opacity-85">/ {mitra.length} RS</span>
            </h3>
            <span className="text-[9px] text-emerald-200/90 font-black flex items-center gap-1 mt-0.5">
              <CheckCircle size={10} /> Aktif & Kerjasama
            </span>
          </div>
        </div>

        {/* Card 4: Keterserapan Lulusan */}
        <div 
          className="p-4 flex items-center gap-3 rounded-2xl border border-violet-500/10 shadow-lg text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-inner shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] text-violet-100 font-black block uppercase tracking-wider">Keterserapan Lulusan</span>
            <h3 className="text-2xl font-black mt-0.5 text-white leading-none">{employmentRate}%</h3>
            <span className="text-[9px] text-violet-200/90 font-medium block mt-0.5">Bekerja & Wirausaha</span>
          </div>
        </div>

        {/* Card 5: Kepuasan Pengguna */}
        <div 
          className="p-4 flex items-center gap-3 rounded-2xl border border-amber-500/10 shadow-lg text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-inner shrink-0">
            <Award size={20} />
          </div>
          <div>
            <span className="text-[10px] text-amber-100 font-black block uppercase tracking-wider">Kepuasan Pengguna</span>
            <h3 className="text-2xl font-black mt-0.5 text-white leading-none">
              {avgSatisfaction} <span className="text-xs font-normal opacity-85">/ 5.0</span>
            </h3>
            <span className="text-[9px] text-amber-200/90 font-medium block mt-0.5">Dari {feedback.length} Instansi Penilai</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Map Overview and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Map Promotion or Quick Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications and Alert box for expired documents */}
          {expiringMitra.length > 0 && (
            <div className="glass p-5 border-l-4 border-l-amber-500 bg-amber-500/5">
              <div className="flex gap-3">
                <ShieldAlert className="text-amber-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-amber-300">Peringatan Dokumen Kerjasama RS</h4>
                  <p className="text-xs text-muted mt-1">
                    Terdapat {expiringMitra.length} dokumen kerjasama dengan instansi mitra yang akan berakhir dalam waktu dekat. 
                    Segera hubungi direktur instansi / mitra terkait untuk pembaruan MoU/MoA.
                  </p>
                  <div className="mt-3 space-y-2">
                    {expiringMitra.map(m => (
                      <div key={m.id} className="flex justify-between items-center text-xs bg-white dark:bg-slate-800 p-2 rounded border border-color">
                        <span className="font-bold">{m.nama_rs} ({m.kabupaten})</span>
                        <span className="text-muted">Berakhir: {m.tanggal_berakhir}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="btn btn-outline btn-sm mt-3 text-xs" 
                    onClick={() => setActiveTab('mitra')}
                  >
                    Perbaharui Dokumen Kerjasama RS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats by Kabupaten */}
          <div className="glass p-6">
            <h3 className="text-sm font-bold border-bottom pb-2 mb-4">Sebaran Wilayah Kerja di Pulau Sumba</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'Sumba Timur', bg: 'bg-blue-500/5', text: 'text-blue-500' },
                { name: 'Sumba Barat', bg: 'bg-emerald-500/5', text: 'text-emerald-500' },
                { name: 'Sumba Tengah', bg: 'bg-amber-500/5', text: 'text-amber-500' },
                { name: 'Sumba Barat Daya', bg: 'bg-violet-500/5', text: 'text-violet-500' },
              ].map((kab, idx) => {
                const kabAlumni = alumni.filter(a => a.wilayah_kerja === kab.name && a.status_kerja === 'Bekerja').length;
                const kabMitra = mitra.filter(m => m.kabupaten === kab.name).length;
                return (
                  <div key={idx} className={`${kab.bg} p-4 rounded-xl border border-color`}>
                    <span className="text-xs font-bold block">{kab.name}</span>
                    <div className="mt-2 space-y-1">
                      <span className="text-xs text-muted block">Alumni: <strong className="text-slate-800 dark:text-white">{kabAlumni}</strong></span>
                      <span className="text-xs text-muted block">Mitra RS: <strong className="text-slate-800 dark:text-white">{kabMitra}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Donut Chart: Grafik Sebaran Status Pekerjaan Alumni */}
          <div className="glass p-6">
            <h3 className="text-sm font-bold border-bottom pb-2 mb-4">Grafik Sebaran Status Pekerjaan Alumni</h3>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Custom SVG Pie Chart */}
              <div className="relative w-40 h-40 shrink-0">
                {totalAlumni > 0 ? (
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    {/* Bekerja: Blue */}
                    <circle
                      cx="18" cy="18" r="15.915"
                      fill="none" stroke="#3b82f6" strokeWidth="4"
                      strokeDasharray={`${(bekerjaCount / totalAlumni) * 100} ${100 - (bekerjaCount / totalAlumni) * 100}`}
                      strokeDashoffset="0"
                    />
                    {/* Wirausaha: Emerald */}
                    <circle
                      cx="18" cy="18" r="15.915"
                      fill="none" stroke="#10b981" strokeWidth="4"
                      strokeDasharray={`${(wirausahaCount / totalAlumni) * 100} ${100 - (wirausahaCount / totalAlumni) * 100}`}
                      strokeDashoffset={`-${(bekerjaCount / totalAlumni) * 100}`}
                    />
                    {/* Studi Lanjut: Amber */}
                    <circle
                      cx="18" cy="18" r="15.915"
                      fill="none" stroke="#f59e0b" strokeWidth="4"
                      strokeDasharray={`${(studiCount / totalAlumni) * 100} ${100 - (studiCount / totalAlumni) * 100}`}
                      strokeDashoffset={`-${((bekerjaCount + wirausahaCount) / totalAlumni) * 100}`}
                    />
                    {/* Mencari Kerja: Rose */}
                    <circle
                      cx="18" cy="18" r="15.915"
                      fill="none" stroke="#ef4444" strokeWidth="4"
                      strokeDasharray={`${(mencariCount / totalAlumni) * 100} ${100 - (mencariCount / totalAlumni) * 100}`}
                      strokeDashoffset={`-${((bekerjaCount + wirausahaCount + studiCount) / totalAlumni) * 100}`}
                    />
                  </svg>
                ) : (
                  <div className="w-full h-full rounded-full border border-color flex items-center justify-center text-xs text-muted">No Data</div>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-full w-28 h-28 m-auto shadow-sm">
                  <span className="text-[10px] text-muted font-bold">Total Alumni</span>
                  <span className="text-2xl font-black">{totalAlumni}</span>
                </div>
              </div>

              {/* Legends with breakdown */}
              <div className="space-y-2 text-xs flex-1 w-full">
                <div className="flex justify-between items-center border-b border-color pb-1.5">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500 inline-block"></span> Bekerja</span>
                  <span className="font-bold">{bekerjaCount} ({((bekerjaCount/totalAlumni)*100 || 0).toFixed(0)}%)</span>
                </div>
                <div className="flex justify-between items-center border-b border-color pb-1.5">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Wirausaha</span>
                  <span className="font-bold">{wirausahaCount} ({((wirausahaCount/totalAlumni)*100 || 0).toFixed(0)}%)</span>
                </div>
                <div className="flex justify-between items-center border-b border-color pb-1.5">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500 inline-block"></span> Studi Lanjut</span>
                  <span className="font-bold">{studiCount} ({((studiCount/totalAlumni)*100 || 0).toFixed(0)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500 inline-block"></span> Mencari Kerja</span>
                  <span className="font-bold">{mencariCount} ({((mencariCount/totalAlumni)*100 || 0).toFixed(0)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Actions Panel */}
        <div className="glass p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold border-bottom pb-2 mb-3">Tautan Navigasi Cepat</h3>
            <p className="text-xs text-muted">Akses instrumen survei, laporan analisis, dan sebaran wilayah kerja.</p>
          </div>

          <div className="space-y-3 my-4">
            <button 
              className="w-full btn btn-outline text-left justify-between text-xs py-3 px-4"
              onClick={() => setActiveTab('alumni')}
            >
              <span className="flex items-center gap-2">📂 Input Data Tracer Alumni</span>
              <ArrowRight size={14} />
            </button>

            <button 
              className="w-full btn btn-outline text-left justify-between text-xs py-3 px-4"
              onClick={() => setActiveTab('feedback')}
            >
              <span className="flex items-center gap-2">✍️ Input Survei Pengguna Lulusan</span>
              <ArrowRight size={14} />
            </button>

            <button 
              className="w-full btn btn-outline text-left justify-between text-xs py-3 px-4"
              onClick={() => setActiveTab('map')}
            >
              <span className="flex items-center gap-2">🗺️ Peta Interaktif Sebaran RS</span>
              <ArrowRight size={14} />
            </button>

            <button 
              className="w-full btn btn-outline text-left justify-between text-xs py-3 px-4"
              onClick={() => setActiveTab('analisis')}
            >
              <span className="flex items-center gap-2">📊 Laporan & Rekomendasi Kurikulum</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-color text-[11px] leading-relaxed text-muted">
            <span className="font-bold text-slate-800 dark:text-white block mb-0.5">ℹ️ Catatan Sistem</span>
            Seluruh data tracer ini terintegrasi langsung dengan database awan Supabase. Untuk pengaturan koneksi, klik menu Supabase di panel kiri.
          </div>
        </div>
      </div>
    </div>
  );
};
