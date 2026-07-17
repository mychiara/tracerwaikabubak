import { useMemo } from 'react';
import type { Alumni } from '../data/mockData';
import { Award, CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react';
import { DonutChart, LineChart } from './InteractiveCharts';

interface Props { alumni: Alumni[]; }

export function UkomAnalisisPanel({ alumni }: Props) {
  const stats = useMemo(() => {
    const lulus = alumni.filter(a => a.tahun_lulus_ukom && a.tahun_lulus_ukom !== 'null');
    const belum = alumni.filter(a => !a.tahun_lulus_ukom || a.tahun_lulus_ukom === 'null');
    const rate = alumni.length > 0 ? Math.round((lulus.length / alumni.length) * 100) : 0;

    // Per tahun lulus
    const perTahun: Record<number, { lulus: number; belum: number }> = {};
    alumni.forEach(a => {
      if (!perTahun[a.tahun_lulus]) perTahun[a.tahun_lulus] = { lulus: 0, belum: 0 };
      if (a.tahun_lulus_ukom && a.tahun_lulus_ukom !== 'null') perTahun[a.tahun_lulus].lulus++;
      else perTahun[a.tahun_lulus].belum++;
    });

    // Per periode UKOM
    const periodeMap: Record<string, number> = {};
    lulus.forEach(a => {
      const p = a.tahun_lulus_ukom!;
      periodeMap[p] = (periodeMap[p] || 0) + 1;
    });

    return { lulus: lulus.length, belum: belum.length, rate, perTahun, periodeMap, lulusArr: lulus };
  }, [alumni]);

  const tahunList = Object.keys(stats.perTahun).map(Number).sort();

  // Prepare chart datasets
  const donutData = [
    { label: 'Lulus UKOM', value: stats.lulus, color: '#10b981' },
    { label: 'Belum Lulus / Belum Mengikuti', value: stats.belum, color: '#ef4444' }
  ];

  const lineData = tahunList.map(t => ({
    label: `Angkatan ${t}`,
    value: stats.perTahun[t].lulus
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">
          📈 Analisis Uji Kompetensi (UKOM)
        </h2>
        <p className="text-xs text-muted">Visualisasi tingkat kelulusan dan tren UKOM program studi alumni.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alumni', val: alumni.length, icon: <Users size={18}/>, color: '#00B9AD' },
          { label: 'Lulus UKOM', val: stats.lulus, icon: <CheckCircle size={18}/>, color: '#10b981' },
          { label: 'Belum UKOM', val: stats.belum, icon: <XCircle size={18}/>, color: '#ef4444' },
          { label: 'Tingkat Kelulusan', val: `${stats.rate}%`, icon: <TrendingUp size={18}/>, color: '#CDDC29' },
        ].map((s, i) => (
          <div key={i} className="glass p-5 rounded-2xl border border-color flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span style={{ color: s.color }}>{s.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-wider">{s.label}</span>
            </div>
            <div className="text-2xl font-black mt-2 text-slate-800 dark:text-white">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChart data={donutData} title="Proporsi Status Kelulusan UKOM" />
        <LineChart data={lineData} title="Tren Kelulusan UKOM per Angkatan" color="#00B9AD" />
      </div>

      {/* Per Tahun Table */}
      <div className="glass p-5 rounded-2xl border border-color shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
          📋 Kelulusan UKOM per Angkatan
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-extrabold border-b border-color">
                {['Tahun Lulus','Total Alumni','Lulus UKOM','Belum UKOM','Tingkat (%)'].map(h => (
                  <th key={h} className="p-3 font-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tahunList.map(t => {
                const d = stats.perTahun[t];
                const total = d.lulus + d.belum;
                const pct = total > 0 ? Math.round((d.lulus / total) * 100) : 0;
                return (
                  <tr key={t} className="border-b border-color/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="p-3 font-extrabold">{t}</td>
                    <td className="p-3">{total}</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">{d.lulus}</td>
                    <td className="p-3 text-rose-500 font-bold">{d.belum}</td>
                    <td className="p-3 w-[250px]">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }}/>
                        </div>
                        <span className="font-extrabold text-teal-600 dark:text-teal-400 w-10 text-right">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per Periode */}
      {Object.keys(stats.periodeMap).length > 0 && (
        <div className="glass p-5 rounded-2xl border border-color shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
            🏆 Distribusi Berdasarkan Periode Kelulusan UKOM
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(stats.periodeMap).sort().map(([p, count]) => (
              <div key={p} className="bg-teal-500/5 border border-teal-500/15 rounded-xl px-4 py-2 flex items-center gap-2.5">
                <Award size={14} className="text-teal-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{p}</span>
                <span className="text-[10px] bg-teal-500 text-white rounded-full px-2 py-0.5 font-black">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alumni detail table */}
      <div className="glass p-5 rounded-2xl border border-color shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
          🔍 Detail Alumni &amp; Status UKOM
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-extrabold border-b border-color">
                {['Nama','NIM','Tahun Lulus','Institusi Kerja','Status UKOM','Periode Kelulusan UKOM'].map(h => (
                  <th key={h} className="p-3 font-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alumni.map(a => (
                <tr key={a.id} className="border-b border-color/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{a.nama}</td>
                  <td className="p-3 text-muted">{a.nim}</td>
                  <td className="p-3">{a.tahun_lulus}</td>
                  <td className="p-3 max-w-[200px] truncate" title={a.nama_institusi}>{a.nama_institusi}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] border ${
                      a.tahun_lulus_ukom 
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/10' 
                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/10'
                    }`}>
                      {a.tahun_lulus_ukom ? '✓ Lulus' : '✗ Belum'}
                    </span>
                  </td>
                  <td className="p-3 text-teal-600 dark:text-teal-400 font-extrabold">{a.tahun_lulus_ukom || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
