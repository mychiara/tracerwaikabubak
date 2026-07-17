import React, { useState } from 'react';
import type { PenggunaLulusan } from '../data/mockData';
import { Star, MessageSquare, PlusCircle, Search } from 'lucide-react';

interface FeedbackPenggunaPanelProps {
  feedback: PenggunaLulusan[];
  onAdd: (f: Omit<PenggunaLulusan, 'id' | 'created_at'>) => Promise<PenggunaLulusan>;
}

export const FeedbackPenggunaPanel: React.FC<FeedbackPenggunaPanelProps> = ({ feedback, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Form State
  const [formNamaMitra, setFormNamaMitra] = useState('');
  const [formNamaPenilai, setFormNamaPenilai] = useState('');
  const [formJabatanPenilai, setFormJabatanPenilai] = useState('');
  
  // Rating states (1 to 5)
  const [formEtika, setFormEtika] = useState<number>(5);
  const [formKeahlian, setFormKeahlian] = useState<number>(4);
  const [formInggris, setFormInggris] = useState<number>(3);
  const [formTeknologi, setFormTeknologi] = useState<number>(4);
  const [formKomunikasi, setFormKomunikasi] = useState<number>(4);
  const [formKerjasama, setFormKerjasama] = useState<number>(5);
  const [formPengembangan, setFormPengembangan] = useState<number>(4);
  const [formMasukan, setFormMasukan] = useState('');

  // Calculate Averages
  const calculateAverages = () => {
    if (feedback.length === 0) return null;
    
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
    return {
      etika: Number((etika / len).toFixed(2)),
      keahlian: Number((keahlian / len).toFixed(2)),
      inggris: Number((inggris / len).toFixed(2)),
      teknologi: Number((teknologi / len).toFixed(2)),
      komunikasi: Number((komunikasi / len).toFixed(2)),
      kerjasama: Number((kerjasama / len).toFixed(2)),
      pengembangan: Number((pengembangan / len).toFixed(2))
    };
  };

  const averages = calculateAverages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNamaMitra || !formNamaPenilai || !formJabatanPenilai) {
      alert('Nama Mitra, Penilai, dan Jabatan wajib diisi!');
      return;
    }

    await onAdd({
      nama_mitra: formNamaMitra,
      nama_penilai: formNamaPenilai,
      jabatan_penilai: formJabatanPenilai,
      etika_nilai: formEtika,
      keahlian_nilai: formKeahlian,
      bahasa_inggris_nilai: formInggris,
      teknologi_nilai: formTeknologi,
      komunikasi_nilai: formKomunikasi,
      kerjasama_nilai: formKerjasama,
      pengembangan_diri_nilai: formPengembangan,
      masukan_kurikulum: formMasukan
    });

    // Reset
    setFormNamaMitra('');
    setFormNamaPenilai('');
    setFormJabatanPenilai('');
    setFormMasukan('');
    setIsModalOpen(false);
  };

  const categories = [
    { label: 'Etika & Moral', key: 'etika', color: 'bg-emerald-500', val: averages?.etika || 0 },
    { label: 'Keahlian Klinis (Utama)', key: 'keahlian', color: 'bg-blue-500', val: averages?.keahlian || 0 },
    { label: 'Bahasa Inggris', key: 'inggris', color: 'bg-violet-500', val: averages?.inggris || 0 },
    { label: 'Penggunaan Teknologi', key: 'teknologi', color: 'bg-cyan-500', val: averages?.teknologi || 0 },
    { label: 'Kemampuan Komunikasi', key: 'komunikasi', color: 'bg-amber-500', val: averages?.komunikasi || 0 },
    { label: 'Kerjasama Tim', key: 'kerjasama', color: 'bg-teal-500', val: averages?.kerjasama || 0 },
    { label: 'Pengembangan Diri', key: 'pengembangan', color: 'bg-pink-500', val: averages?.pengembangan || 0 },
  ];

  const filteredFeedback = feedback.filter(f => 
    f.nama_mitra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.nama_penilai.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.masukan_kurikulum.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFeedback.length / 50);
  const paginatedFeedback = filteredFeedback.slice((currentPage - 1) * 50, currentPage * 50);

  const renderStars = (score: number) => {
    return (
      <div className="flex gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star 
            key={s} 
            size={14} 
            fill={s <= score ? 'currentColor' : 'none'} 
            className={s <= score ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards & Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics & Chart */}
        <div className="glass p-6 lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-bold">Grafik Kepuasan Pengguna Lulusan</h3>
            <p className="text-xs text-muted">Nilai rata-rata kepuasan dari {feedback.length} mitra pengguna lulusan (Skala 1 - 5).</p>
          </div>

          {averages ? (
            <div className="space-y-4">
              {categories.map(c => {
                const percentage = (c.val / 5) * 100;
                return (
                  <div key={c.key} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{c.label}</span>
                      <span className="text-primary font-bold">{c.val} / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${c.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted italic">
              Belum ada data feedback yang masuk.
            </div>
          )}
        </div>

        {/* Action Panel & Key Takeaway */}
        <div className="glass p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Evaluasi Lulusan</h3>
            <p className="text-xs text-muted">
              Fitur ini mengumpulkan data langsung dari Pihak Instansi Mitra / Pengguna Lulusan mengenai kualitas kerja alumni yang bertugas di sana.
            </p>
            <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl text-xs text-teal-700 dark:text-teal-300">
              <span className="font-bold block mb-1">💡 Penting untuk Akreditasi</span>
              Data kepuasan pengguna merupakan indikator utama akreditasi kampus dan dasar evaluasi kurikulum berkala.
            </div>
          </div>

          <button className="btn btn-primary w-full mt-6" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} />
            Input Feedback Baru
          </button>
        </div>
      </div>

      {/* Raw Feedback & Comments List */}
      <div className="glass">
        <div className="p-5 border-bottom flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Komentar & Masukan Kurikulum</h3>
            <p className="text-xs text-muted">Kritik, saran, dan catatan perbaikan kurikulum dari direktur/supervisi klinik.</p>
          </div>
          
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-2.5 text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Cari masukan/mitra..." 
              className="form-control pl-9 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-[480px] overflow-y-auto">
          {paginatedFeedback.length > 0 ? (
            paginatedFeedback.map(f => (
              <div key={f.id} className="border border-color rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/25 flex flex-col md:flex-row gap-4 justify-between animate-fade-in">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-bold text-sm text-primary">{f.nama_mitra}</span>
                    <span className="text-xs text-muted">|</span>
                    <span className="text-xs font-semibold">{f.nama_penilai} ({f.jabatan_penilai})</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-muted bg-white dark:bg-slate-800 p-3 rounded-lg border border-color font-sans italic">
                    <MessageSquare size={16} className="text-slate-400 shrink-0 mt-0.5 align-top" />
                    <span>"{f.masukan_kurikulum || 'Tidak ada masukan tertulis.'}"</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:flex md:flex-col gap-2 shrink-0 md:w-[180px] border-t md:border-t-0 md:border-l border-color pt-3 md:pt-0 md:pl-4 justify-center">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Etika</span>
                    {renderStars(f.etika_nilai)}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Keahlian</span>
                    {renderStars(f.keahlian_nilai)}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Komunikasi</span>
                    {renderStars(f.komunikasi_nilai)}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted">Teknologi</span>
                    {renderStars(f.teknologi_nilai)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted italic">
              Tidak ada feedback yang cocok dengan pencarian.
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

      {/* Add Feedback Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header">
              <h3 className="text-lg font-bold">Input Penilaian Pengguna Lulusan</h3>
              <button className="btn btn-outline p-1 rounded-full" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div className="form-group">
                  <label className="form-label">Nama Instansi / Instansi Mitra</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: RSUD Urmana Rara Mayang Waikabubak"
                    value={formNamaMitra}
                    onChange={(e) => setFormNamaMitra(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Nama Penilai</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Nama lengkap penilai..."
                      value={formNamaPenilai}
                      onChange={(e) => setFormNamaPenilai(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jabatan Penilai</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: Direktur Utama, Kabid Keperawatan"
                      value={formJabatanPenilai}
                      onChange={(e) => setFormJabatanPenilai(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Rating Scale Inputs */}
                <div className="border-t border-color pt-4">
                  <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Nilai Aspek Kepuasan (Skala 1 s/d 5)</h4>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'Etika, Moral, & Integritas', val: formEtika, setVal: setFormEtika },
                      { label: 'Keahlian Klinis Utama (Kompetensi Bidang)', val: formKeahlian, setVal: setFormKeahlian },
                      { label: 'Kemampuan Bahasa Inggris', val: formInggris, setVal: setFormInggris },
                      { label: 'Pemanfaatan Teknologi Informasi & Digitalisasi', val: formTeknologi, setVal: setFormTeknologi },
                      { label: 'Kemampuan Berkomunikasi (Terapeutik/Interprofesi)', val: formKomunikasi, setVal: setFormKomunikasi },
                      { label: 'Kerjasama Tim (Teamwork)', val: formKerjasama, setVal: setFormKerjasama },
                      { label: 'Kemauan Mengembangkan Diri (Continuous Learning)', val: formPengembangan, setVal: setFormPengembangan },
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-color">
                        <span className="text-xs font-semibold">{item.label}</span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(n => (
                            <button
                              key={n}
                              type="button"
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                item.val === n 
                                  ? 'bg-primary text-white shadow-md' 
                                  : 'bg-white dark:bg-slate-800 hover:bg-primary-light border border-color'
                              }`}
                              onClick={() => item.setVal(n)}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Saran & Masukan untuk Penguatan Kurikulum</label>
                  <textarea 
                    className="form-control" 
                    rows={3} 
                    placeholder="Saran perbaikan, penambahan jam laboratorium, pelatihan khusus yang dirasa kurang..."
                    value={formMasukan}
                    onChange={(e) => setFormMasukan(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Kirim Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
