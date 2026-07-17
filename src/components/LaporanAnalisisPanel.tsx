import React from 'react';
import type { Alumni, PenggunaLulusan } from '../data/mockData';
import { BookOpen, Printer, AlertCircle } from 'lucide-react';

interface LaporanAnalisisPanelProps {
  alumni: Alumni[];
  feedback: PenggunaLulusan[];
}

export const LaporanAnalisisPanel: React.FC<LaporanAnalisisPanelProps> = ({ alumni, feedback }) => {

  const totalAlumni = alumni.length;
  const bekerjaCount = alumni.filter(a => a.status_kerja === 'Bekerja').length;
  const wirausahaCount = alumni.filter(a => a.status_kerja === 'Wirausaha').length;
  const studiCount = alumni.filter(a => a.status_kerja === 'Studi Lanjut').length;
  const mencariCount = alumni.filter(a => a.status_kerja === 'Mencari Kerja').length;

  const keterserapanRate = totalAlumni > 0 
    ? (((bekerjaCount + wirausahaCount) / totalAlumni) * 100).toFixed(1)
    : '0';

  // Average waiting time
  const alumniBekerja = alumni.filter(a => a.status_kerja === 'Bekerja' || a.status_kerja === 'Wirausaha');
  const avgWaktuTunggu = alumniBekerja.length > 0
    ? (alumniBekerja.reduce((acc, curr) => acc + curr.waktu_tunggu_bulan, 0) / alumniBekerja.length).toFixed(1)
    : '0';

  // Curriculum relevance
  const relevanCount = alumni.filter(a => a.relevansi_kurikulum === 'Sangat Relevan' || a.relevansi_kurikulum === 'Relevan').length;
  const relevansiRate = totalAlumni > 0
    ? ((relevanCount / totalAlumni) * 100).toFixed(1)
    : '0';

  // Ukom Pass Rate
  const ukomLulusCount = alumni.filter(a => typeof a.tahun_lulus_ukom === 'string' && a.tahun_lulus_ukom.trim() !== '').length;
  const ukomLulusRate = totalAlumni > 0
    ? ((ukomLulusCount / totalAlumni) * 100).toFixed(1)
    : '0';

  // Employer averages
  const getFeedbackAverages = () => {
    if (feedback.length === 0) return null;
    let sum = 0;
    feedback.forEach(f => {
      sum += (f.etika_nilai + f.keahlian_nilai + f.bahasa_inggris_nilai + f.teknologi_nilai + f.komunikasi_nilai + f.kerjasama_nilai + f.pengembangan_diri_nilai) / 7;
    });
    return (sum / feedback.length).toFixed(2);
  };

  const avgEmployerSatisfaction = getFeedbackAverages();

  // Generate automated curriculum recommendations
  const generateRecommendations = () => {
    if (feedback.length === 0) {
      return [
        {
          bidang: 'Kompetensi Klinis',
          nilai: '0.00',
          urgensi: 'Tinggi',
          saran: 'Lakukan survei pengguna lulusan secara periodik untuk menilai kualitas asuhan keperawatan/kebidanan.'
        }
      ];
    }

    // Calc average scores per aspect
    let etika = 0, keahlian = 0, inggris = 0, teknologi = 0, komunikasi = 0, kerjasama = 0, pengembangan = 0;
    feedback.forEach(f => {
      etika += f.etika_nilai;
      keahlian += f.keahlian_nilai;
      inggris += f.bahasa_inggris_nilai;
      teknologi += f.teknologi_nilai;
      komunikasi += f.komunikasi_nilai;
      kerjasama += f.kerjasama_nilai;
      pengembangan += f.pengembangan_diri_nilai;
    });

    const len = feedback.length;
    const scores = [
      { name: 'Etika & Moral', val: etika / len, action: 'Mempertahankan mata kuliah pembentukan karakter, kepemimpinan klinis, dan kode etik keperawatan/kebidanan.' },
      { name: 'Keahlian Klinis Utama', val: keahlian / len, action: 'Meningkatkan alokasi waktu praktek laboratorium klinik (OSCE) dan simulasi kasus kritis gawat darurat.' },
      { name: 'Bahasa Inggris', val: inggris / len, action: 'Menyediakan kelas peminatan TOEFL, kursus bahasa Inggris khusus keperawatan (English for Nursing), atau modul bilingual.' },
      { name: 'Penggunaan Teknologi', val: teknologi / len, action: 'Mengintegrasikan pelatihan Sistem Informasi Instansi / Mitra (SIRS) dan Rekam Medis Elektronik (RME) ke dalam kurikulum perkuliahan.' },
      { name: 'Kemampuan Komunikasi', val: komunikasi / len, action: 'Menyelenggarakan workshop komunikasi terapeutik interprofesi dan simulasi operan pasien (SBAR/IPCP).' },
      { name: 'Kerjasama Tim', val: kerjasama / len, action: 'Memperbanyak penugasan berbasis kelompok multi-disiplin untuk mensimulasikan lingkungan klinis yang kolaboratif.' },
      { name: 'Pengembangan Diri', val: pengembangan / len, action: 'Membimbing mahasiswa menyusun portofolio karir, seminar motivasi berprestasi, dan mendorong partisipasi riset.' }
    ];

    // Sort to get lowest scores
    const sortedScores = [...scores].sort((a, b) => a.val - b.val);

    return sortedScores.map((score) => {
      let urgensi = 'Rendah';
      if (score.val < 3.5) urgensi = 'Tinggi';
      else if (score.val < 4.2) urgensi = 'Sedang';

      return {
        bidang: score.name,
        nilai: score.val.toFixed(2),
        urgensi,
        saran: score.action
      };
    });
  };

  const recommendations = generateRecommendations();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:bg-white print:p-8">
      {/* Print Trigger */}
      <div className="flex justify-between items-center bg-slate-900/10 dark:bg-slate-900/50 p-4 rounded-xl border border-color print:hidden">
        <div>
          <h3 className="text-sm font-bold">Laporan Siap Cetak</h3>
          <p className="text-xs text-muted">Seluruh analisis tracer study dan rekomendasi kurikulum diformat agar rapi saat dicetak ke PDF.</p>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={16} />
          Cetak Laporan Resmi
        </button>
      </div>

      {/* Printable Report Wrapper */}
      <div className="space-y-8">
        {/* Header (visible in print/preview) */}
        <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-2xl font-black uppercase">LAPORAN ANALISIS TRACER STUDY & REKOMENDASI KURIKULUM</h1>
          <h2 className="text-lg font-bold">POLTEKKES KEMENKES KUPANG PRODI D3 KEPERAWATAN WAIKABUBAK</h2>
          <p className="text-xs text-muted mt-1">Jl. Adam Malik, Waikabubak, Pulau Sumba, Nusa Tenggara Timur</p>
          <p className="text-[10px] text-muted">Tanggal Laporan: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Executive Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <div 
            className="report-metric-card p-5 flex flex-col justify-between rounded-2xl shadow-md border-l-4 border-l-blue-600 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              '--print-color': '#2563eb'
            } as React.CSSProperties}
          >
            <span className="text-[10px] font-black text-blue-100 uppercase tracking-wider">Tingkat Penyerapan</span>
            <div className="my-2">
              <span className="text-3xl font-black text-white">{keterserapanRate}%</span>
              <span className="text-xs text-blue-100 block mt-1">Alumni bekerja / wirausaha</span>
            </div>
          </div>

          <div 
            className="report-metric-card p-5 flex flex-col justify-between rounded-2xl shadow-md border-l-4 border-l-emerald-600 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: '#ffffff',
              '--print-color': '#10b981'
            } as React.CSSProperties}
          >
            <span className="text-[10px] font-black text-emerald-100 uppercase tracking-wider">Waktu Tunggu Kerja</span>
            <div className="my-2">
              <span className="text-3xl font-black text-white">{avgWaktuTunggu} Bln</span>
              <span className="text-xs text-emerald-100 block mt-1">Rata-rata mendapatkan posisi pertama</span>
            </div>
          </div>

          <div 
            className="report-metric-card p-5 flex flex-col justify-between rounded-2xl shadow-md border-l-4 border-l-amber-600 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              '--print-color': '#f59e0b'
            } as React.CSSProperties}
          >
            <span className="text-[10px] font-black text-amber-100 uppercase tracking-wider">Relevansi Kurikulum</span>
            <div className="my-2">
              <span className="text-3xl font-black text-white">{relevansiRate}%</span>
              <span className="text-xs text-amber-100 block mt-1">Sangat relevan & relevan</span>
            </div>
          </div>

          <div 
            className="report-metric-card p-5 flex flex-col justify-between rounded-2xl shadow-md border-l-4 border-l-purple-600 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: '#ffffff',
              '--print-color': '#8b5cf6'
            } as React.CSSProperties}
          >
            <span className="text-[10px] font-black text-purple-100 uppercase tracking-wider">Kepuasan Instansi / Mitra</span>
            <div className="my-2">
              <span className="text-3xl font-black text-white">{avgEmployerSatisfaction || 'N/A'}/5</span>
              <span className="text-xs text-purple-100 block mt-1">Skor rata-rata dari Direktur RS</span>
            </div>
          </div>

          <div 
            className="report-metric-card p-5 flex flex-col justify-between rounded-2xl shadow-md border-l-4 border-l-cyan-600 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              color: '#ffffff',
              '--print-color': '#06b6d4'
            } as React.CSSProperties}
          >
            <span className="text-[10px] font-black text-cyan-100 uppercase tracking-wider">Lulus Uji Kompetensi</span>
            <div className="my-2">
              <span className="text-3xl font-black text-white">{ukomLulusRate}%</span>
              <span className="text-xs text-cyan-100 block mt-1">Sertifikasi profesi aktif</span>
            </div>
          </div>
        </div>

        {/* Main Analytics Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Penyerapan Chart */}
          <div className="glass p-6">
            <h3 className="text-sm font-bold border-bottom pb-2 mb-4">Grafik Sebaran Status Pekerjaan Alumni</h3>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Custom SVG Pie Chart */}
              <div className="relative w-40 h-40">
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
              <div className="space-y-2 text-xs flex-1">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500 inline-block"></span> Bekerja</span>
                  <span className="font-bold">{bekerjaCount} ({((bekerjaCount/totalAlumni)*100 || 0).toFixed(0)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Wirausaha</span>
                  <span className="font-bold">{wirausahaCount} ({((wirausahaCount/totalAlumni)*100 || 0).toFixed(0)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500 inline-block"></span> Studi Lanjut</span>
                  <span className="font-bold">{studiCount} ({((studiCount/totalAlumni)*100 || 0).toFixed(0)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500 inline-block"></span> Mencari Kerja</span>
                  <span className="font-bold">{mencariCount} ({((mencariCount/totalAlumni)*100 || 0).toFixed(0)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gaji & Relevansi Info */}
          <div className="glass p-6 space-y-4">
            <h3 className="text-sm font-bold border-bottom pb-2">Relevansi Kurikulum Pembelajaran</h3>
            
            <div className="space-y-3">
              {[
                { label: 'Sangat Relevan', color: 'bg-emerald-500', count: alumni.filter(a => a.relevansi_kurikulum === 'Sangat Relevan').length },
                { label: 'Relevan', color: 'bg-blue-500', count: alumni.filter(a => a.relevansi_kurikulum === 'Relevan').length },
                { label: 'Cukup Relevan', color: 'bg-amber-500', count: alumni.filter(a => a.relevansi_kurikulum === 'Cukup Relevan').length },
                { label: 'Tidak Relevan', color: 'bg-rose-500', count: alumni.filter(a => a.relevansi_kurikulum === 'Tidak Relevan').length },
              ].map((r, idx) => {
                const percent = totalAlumni > 0 ? (r.count / totalAlumni) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{r.label}</span>
                      <span>{r.count} Alumni ({percent.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${r.color} rounded-full`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Curriculum Recommendation Section (Requirements 8) */}
        <div className="glass p-6 space-y-4 print:border-none print:shadow-none">
          <div className="flex items-center gap-2 border-bottom pb-3 mb-4">
            <BookOpen className="text-primary" size={22} />
            <div>
              <h3 className="text-lg font-bold">Rekomendasi Penguatan Kurikulum</h3>
              <p className="text-xs text-muted">Diolah secara otomatis dari rata-rata nilai kompetensi & masukan tertulis pengguna lulusan (Instansi / Mitra).</p>
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table print:border print:border-slate-300">
              <thead>
                <tr className="print:bg-slate-100">
                  <th>Aspek Kompetensi</th>
                  <th style={{ width: '120px' }}>Nilai Rata-rata</th>
                  <th style={{ width: '120px' }}>Urgensi Tindakan</th>
                  <th>Rekomendasi Tindakan Strategis</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((rec, index) => (
                  <tr key={index}>
                    <td className="font-bold text-xs">{rec.bidang}</td>
                    <td>
                      <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 py-1 px-2 rounded font-semibold text-primary">
                        ⭐ {rec.nilai || 'N/A'} / 5.0
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        rec.urgensi === 'Tinggi' 
                          ? 'badge-danger' 
                          : rec.urgensi === 'Sedang' 
                            ? 'badge-warning' 
                            : 'badge-success'
                      } text-[10px] py-0.5 px-2`}>
                        {rec.urgensi}
                      </span>
                    </td>
                    <td className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rec.saran}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 border border-color rounded-xl p-4 flex gap-3 text-xs mt-4">
            <AlertCircle className="text-primary shrink-0" size={18} />
            <div>
              <span className="font-bold block text-primary">Kesimpulan & Langkah Lanjut:</span>
              <p className="mt-1 leading-relaxed text-muted">
                Berdasarkan evaluasi di atas, prioritas utama penyempurnaan kurikulum berfokus pada aspek 
                <strong> Bahasa Inggris Medis</strong> dan <strong>Teknologi Sistem Instansi / Mitra Digital</strong>. 
                Penyelarasan (link & match) kurikulum perlu melibatkan direktur pelayanan medis instansi mitra di 4 kabupaten 
                Pulau Sumba secara kontinu.
              </p>
            </div>
          </div>
        </div>

        {/* Footer (Visible in prints only) */}
        <div className="hidden print:flex justify-between items-center mt-12 border-t pt-4 text-xs text-muted">
          <div>
            <span>Sistem Informasi Tracer Study & Kemitraan Sumba</span>
          </div>
          <div>
            <span>Halaman 1 dari 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
