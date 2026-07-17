import React, { useState } from 'react';
import type { AlumniFeedback } from '../data/mockData';
import { Star, Search } from 'lucide-react';

interface AlumniFeedbackPanelProps {
  alumniFeedback: AlumniFeedback[];
}

export const AlumniFeedbackPanel: React.FC<AlumniFeedbackPanelProps> = ({ alumniFeedback }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const itemsPerPage = 50;

  // Calculate Averages
  const calculateAverages = () => {
    if (alumniFeedback.length === 0) return null;
    let kualitas = 0, fasilitas = 0, relevansi = 0, layanan = 0;
    
    alumniFeedback.forEach(f => {
      kualitas += f.kualitas_pembelajaran;
      fasilitas += f.fasilitas_pembelajaran;
      relevansi += f.relevansi_kurikulum;
      layanan += f.layanan_akademik;
    });

    const len = alumniFeedback.length;
    return {
      kualitas: Number((kualitas / len).toFixed(2)),
      fasilitas: Number((fasilitas / len).toFixed(2)),
      relevansi: Number((relevansi / len).toFixed(2)),
      layanan: Number((layanan / len).toFixed(2))
    };
  };

  const averages = calculateAverages();

  const filteredFeedback = alumniFeedback.filter(f => 
    f.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.saran_prodi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const paginatedFeedback = filteredFeedback.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderStars = (score: number) => {
    return (
      <div className="flex gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star 
            key={s} 
            size={13} 
            fill={s <= score ? 'currentColor' : 'none'} 
            className={s <= score ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full" />
          <div className="text-muted text-[11px] font-bold uppercase tracking-wider">Kualitas Pengajaran</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black">{averages?.kualitas || '0.0'}</span>
            <span className="text-xs text-muted">/ 5.0</span>
          </div>
          <div className="mt-3">{renderStars(Math.round(averages?.kualitas || 0))}</div>
        </div>

        <div className="glass p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-emerald-500 h-full" />
          <div className="text-muted text-[11px] font-bold uppercase tracking-wider">Fasilitas Laboratorium</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black">{averages?.fasilitas || '0.0'}</span>
            <span className="text-xs text-muted">/ 5.0</span>
          </div>
          <div className="mt-3">{renderStars(Math.round(averages?.fasilitas || 0))}</div>
        </div>

        <div className="glass p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-teal-500 h-full" />
          <div className="text-muted text-[11px] font-bold uppercase tracking-wider">Relevansi Kurikulum</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black">{averages?.relevansi || '0.0'}</span>
            <span className="text-xs text-muted">/ 5.0</span>
          </div>
          <div className="mt-3">{renderStars(Math.round(averages?.relevansi || 0))}</div>
        </div>

        <div className="glass p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-purple-500 h-full" />
          <div className="text-muted text-[11px] font-bold uppercase tracking-wider">Layanan Akademik</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black">{averages?.layanan || '0.0'}</span>
            <span className="text-xs text-muted">/ 5.0</span>
          </div>
          <div className="mt-3">{renderStars(Math.round(averages?.layanan || 0))}</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass overflow-hidden">
        <div className="p-5 border-bottom flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Rekapitulasi Umpan Balik Alumni</h3>
            <p className="text-xs text-muted">Menampilkan hasil kuesioner pembelajaran, sarana, dan kurikulum dari alumni.</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari Alumni (Nama, NIM, Saran)..." 
              className="form-control pl-10 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          {paginatedFeedback.length > 0 ? (
            <table className="custom-table text-xs">
              <thead>
                <tr>
                  <th style={{ width: '220px' }}>Alumni</th>
                  <th style={{ width: '130px' }}>Kualitas Dosen</th>
                  <th style={{ width: '130px' }}>Fasilitas Lab</th>
                  <th style={{ width: '130px' }}>Relevansi Kerja</th>
                  <th style={{ width: '130px' }}>Layanan Akad</th>
                  <th>Masukan & Saran Program Studi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFeedback.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td>
                      <div className="font-bold text-slate-800 dark:text-white">{f.nama}</div>
                      <div className="text-[10px] text-muted font-mono mt-0.5">NIM: {f.nim} • Lulus {f.tahun_lulus}</div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{f.kualitas_pembelajaran} / 5</span>
                        {renderStars(f.kualitas_pembelajaran)}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{f.fasilitas_pembelajaran} / 5</span>
                        {renderStars(f.fasilitas_pembelajaran)}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{f.relevansi_kurikulum} / 5</span>
                        {renderStars(f.relevansi_kurikulum)}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{f.layanan_akademik} / 5</span>
                        {renderStars(f.layanan_akademik)}
                      </div>
                    </td>
                    <td className="italic text-slate-600 dark:text-slate-400 py-3 font-semibold leading-relaxed">
                      "{f.saran_prodi}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-muted italic">
              Tidak ada data umpan balik alumni yang ditemukan.
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-between items-center p-4 border-t border-color bg-slate-50/50 dark:bg-slate-900/30 text-xs gap-3">
            <div className="text-muted font-semibold">
              Menampilkan {paginatedFeedback.length} dari {filteredFeedback.length} baris (Halaman {currentPage} dari {totalPages})
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                className="btn btn-outline py-1 px-2.5 rounded-lg font-bold"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                <button
                  key={page}
                  className={`btn py-1 px-2.5 rounded-lg font-bold ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
                  style={page === currentPage ? { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', color: '#fff' } : {}}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="btn btn-outline py-1 px-2.5 rounded-lg font-bold"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
