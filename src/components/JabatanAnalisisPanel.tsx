import { useMemo } from 'react';
import type { Alumni } from '../data/mockData';
import { Building2 } from 'lucide-react';
import { DonutChart, BarChart } from './InteractiveCharts';

interface JabatanAnalisisPanelProps {
  alumni: Alumni[];
}

export function JabatanAnalisisPanel({ alumni }: JabatanAnalisisPanelProps) {
  const stats = useMemo(() => {
    const bekerja = alumni.filter(a => a.status_kerja === 'Bekerja');

    // Top jabatan
    const jabatanMap: Record<string, number> = {};
    bekerja.forEach(a => {
      const j = a.jabatan && a.jabatan !== '-' ? a.jabatan : 'Lainnya';
      jabatanMap[j] = (jabatanMap[j] || 0) + 1;
    });
    const topJabatan = Object.entries(jabatanMap).sort((a, b) => b[1] - a[1]);

    // Per status kerja
    const statusMap: Record<string, number> = {};
    alumni.forEach(a => { statusMap[a.status_kerja] = (statusMap[a.status_kerja] || 0) + 1; });

    // Per wilayah kerja
    const wilayahMap: Record<string, number> = {};
    bekerja.forEach(a => {
      const w = a.wilayah_kerja || 'Lainnya';
      wilayahMap[w] = (wilayahMap[w] || 0) + 1;
    });
    const topWilayah = Object.entries(wilayahMap).sort((a, b) => b[1] - a[1]);

    // Gaji distribusi
    const gajiMap: Record<string, number> = {};
    bekerja.forEach(a => { 
      const g = a.gaji_bulanan || 'Tidak Mengisi';
      gajiMap[g] = (gajiMap[g] || 0) + 1; 
    });

    return { topJabatan, statusMap, topWilayah, gajiMap, bekerja };
  }, [alumni]);

  const statusColors: Record<string, string> = {
    'Bekerja': '#00B9AD', 'Wirausaha': '#CDDC29', 'Studi Lanjut': '#60C0D0', 'Mencari Kerja': '#ef4444'
  };

  // Datasets for charts
  const statusChartData = Object.entries(stats.statusMap).map(([label, value]) => ({
    label,
    value,
    color: statusColors[label] || '#94a3b8'
  }));

  const salaryChartData = Object.entries(stats.gajiMap).map(([label, value], idx) => {
    const colors = ['#00B9AD', '#CDDC29', '#60C0D0', '#3b82f6', '#f59e0b', '#ec4899'];
    return {
      label,
      value,
      color: colors[idx % colors.length]
    };
  });

  const jabatanChartData = stats.topJabatan.slice(0, 5).map(([label, value]) => ({
    label,
    value
  }));

  const wilayahChartData = stats.topWilayah.slice(0, 5).map(([label, value]) => ({
    label,
    value
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">
          💼 Analisis Jabatan &amp; Posisi Kerja
        </h2>
        <p className="text-xs text-muted">Statistik persebaran status karir, posisi jabatan, wilayah kerja, dan gaji alumni.</p>
      </div>

      {/* Interactive Charts: Status Kerja & Gaji */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChart data={statusChartData} title="Distribusi Status Karir Alumni" size={180} />
        <DonutChart data={salaryChartData} title="Distribusi Gaji Bulanan Alumni Bekerja" size={180} />
      </div>

      {/* Interactive Charts: Top Jabatan & Sebaran Wilayah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart data={jabatanChartData} title="Top 5 Posisi / Jabatan Pekerjaan" color="#00B9AD" />
        <BarChart data={wilayahChartData} title="Top 5 Wilayah Penempatan Kerja" color="#60C0D0" />
      </div>

      {/* Detail Table */}
      <div className="glass p-5 rounded-2xl border border-color shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Building2 size={16} className="text-teal-500" />
          Detail Penempatan Kerja Alumni
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-extrabold border-b border-color">
                {['Nama','Jabatan','Institusi Kerja','Wilayah','Gaji Bulanan','Waktu Tunggu'].map(h => (
                  <th key={h} className="p-3 font-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.bekerja.map(a => (
                <tr key={a.id} className="border-b border-color/40 hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{a.nama}</td>
                  <td className="p-3 text-teal-600 dark:text-teal-400 font-bold">{a.jabatan}</td>
                  <td className="p-3 max-w-[180px] truncate" title={a.nama_institusi}>{a.nama_institusi}</td>
                  <td className="p-3">{a.wilayah_kerja}</td>
                  <td className="p-3">{a.gaji_bulanan}</td>
                  <td className="p-3 font-extrabold">{a.waktu_tunggu_bulan} Bulan</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
