import React, { useState, useRef, useMemo } from 'react';
import type { Alumni } from '../data/mockData';
import { Search, Plus, Edit2, Trash2, Mail, Phone, Briefcase, GraduationCap, MapPin, DollarSign, Download, Upload } from 'lucide-react';

interface AlumniTracerPanelProps {
  alumni: Alumni[];
  onAdd: (a: Omit<Alumni, 'id' | 'created_at'>) => Promise<Alumni>;
  onUpdate: (a: Alumni) => Promise<Alumni>;
  onDelete: (id: string) => Promise<boolean>;
}

export const AlumniTracerPanel: React.FC<AlumniTracerPanelProps> = ({
  alumni,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterRegion, setFilterRegion] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterYear, filterStatus, filterRegion]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);

  // Form State
  const [formNama, setFormNama] = useState('');
  const [formNim, setFormNim] = useState('');
  const [formTahunLulus, setFormTahunLulus] = useState<number>(2024);
  const [formNoHp, setFormNoHp] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatusKerja, setFormStatusKerja] = useState<'Bekerja' | 'Wirausaha' | 'Studi Lanjut' | 'Mencari Kerja'>('Bekerja');
  const [formNamaInstitusi, setFormNamaInstitusi] = useState('');
  const [formWilayahKerja, setFormWilayahKerja] = useState<string>('Sumba Timur');
  const [formJabatan, setFormJabatan] = useState('');
  const [formGajiBulanan, setFormGajiBulanan] = useState<'< Rp 3.000.000' | 'Rp 3.000.000 - Rp 5.000.000' | 'Rp 5.000.000 - Rp 7.500.000' | '> Rp 7.500.000'>('Rp 3.000.000 - Rp 5.000.000');
  const [formWaktuTunggu, setFormWaktuTunggu] = useState<number>(3);
  const [formRelevansi, setFormRelevansi] = useState<'Sangat Relevan' | 'Relevan' | 'Cukup Relevan' | 'Tidak Relevan'>('Relevan');
  const [formTahunLulusUkom, setFormTahunLulusUkom] = useState<string>('');

  const openAddModal = () => {
    setEditingAlumni(null);
    setFormNama('');
    setFormNim('');
    setFormTahunLulus(2024);
    setFormNoHp('');
    setFormEmail('');
    setFormStatusKerja('Bekerja');
    setFormNamaInstitusi('');
    setFormWilayahKerja('Sumba Timur');
    setFormJabatan('');
    setFormGajiBulanan('Rp 3.000.000 - Rp 5.000.000');
    setFormWaktuTunggu(3);
    setFormRelevansi('Relevan');
    setFormTahunLulusUkom('');
    setIsModalOpen(true);
  };

  const openEditModal = (a: Alumni) => {
    setEditingAlumni(a);
    setFormNama(a.nama);
    setFormNim(a.nim);
    setFormTahunLulus(a.tahun_lulus);
    setFormNoHp(a.no_hp);
    setFormEmail(a.email);
    setFormStatusKerja(a.status_kerja);
    setFormNamaInstitusi(a.nama_institusi);
    setFormWilayahKerja(a.wilayah_kerja);
    setFormJabatan(a.jabatan);
    setFormGajiBulanan(a.gaji_bulanan);
    setFormWaktuTunggu(a.waktu_tunggu_bulan);
    setFormRelevansi(a.relevansi_kurikulum);
    setFormTahunLulusUkom(a.tahun_lulus_ukom ? String(a.tahun_lulus_ukom) : '');
    setIsModalOpen(true);
  };

  const completionPercentage = useMemo(() => {
    const fields = [formNama, formNim, formNoHp, formEmail, formStatusKerja, formRelevansi];
    let filled = fields.filter(f => f && String(f).trim() !== '' && String(f) !== '-').length;
    let total = fields.length;

    if (formStatusKerja === 'Bekerja') {
      const extraFields = [formNamaInstitusi, formWilayahKerja, formJabatan, formGajiBulanan, formWaktuTunggu];
      filled += extraFields.filter(f => f && String(f).trim() !== '' && String(f) !== '-').length;
      total += extraFields.length;
    }

    if (formTahunLulusUkom) {
      filled += 1;
    }
    total += 1;

    return Math.round((filled / total) * 100);
  }, [formNama, formNim, formNoHp, formEmail, formStatusKerja, formRelevansi, formNamaInstitusi, formWilayahKerja, formJabatan, formGajiBulanan, formWaktuTunggu, formTahunLulusUkom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama || !formNim || !formEmail) {
      alert('Nama, NIM dan Email wajib diisi!');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail)) {
      alert('Format email tidak valid!');
      return;
    }

    // Phone format validation
    const phoneRegex = /^08[0-9]{8,11}$/;
    if (formNoHp && !phoneRegex.test(formNoHp)) {
      alert('Format nomor WhatsApp/HP tidak valid! Harus diawali "08" dan berisi 10-13 digit angka.');
      return;
    }

    const payload = {
      nama: formNama,
      nim: formNim,
      tahun_lulus: Number(formTahunLulus),
      no_hp: formNoHp,
      email: formEmail,
      status_kerja: formStatusKerja,
      nama_institusi: formStatusKerja === 'Mencari Kerja' ? '-' : formNamaInstitusi,
      wilayah_kerja: formWilayahKerja,
      jabatan: formStatusKerja === 'Mencari Kerja' ? '-' : formJabatan,
      gaji_bulanan: formGajiBulanan,
      waktu_tunggu_bulan: Number(formWaktuTunggu),
      relevansi_kurikulum: formRelevansi,
      tahun_lulus_ukom: formTahunLulusUkom ? formTahunLulusUkom : null
    };

    if (editingAlumni) {
      await onUpdate({
        ...editingAlumni,
        ...payload
      });
    } else {
      await onAdd(payload);
    }    setIsModalOpen(false);
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length <= 1) {
        alert('File CSV kosong atau tidak valid.');
        return;
      }

      // Check header
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['nama', 'nim', 'tahun_lulus', 'no_hp', 'email', 'status_kerja', 'nama_institusi', 'wilayah_kerja', 'jabatan', 'gaji_bulanan', 'waktu_tunggu_bulan', 'relevansi_kurikulum'];
      
      const missing = requiredHeaders.filter(req => !headers.includes(req));
      if (missing.length > 0) {
        alert(`Header CSV tidak cocok. Kolom berikut hilang: ${missing.join(', ')}`);
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        if (values.length < headers.length) continue;

        const row: any = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx];
        });

        try {
          await onAdd({
            nama: row.nama || 'Tanpa Nama',
            nim: row.nim || '-',
            tahun_lulus: Number(row.tahun_lulus) || 2024,
            no_hp: row.no_hp || '-',
            email: row.email || '-',
            status_kerja: row.status_kerja as any || 'Bekerja',
            nama_institusi: row.nama_institusi || '-',
            wilayah_kerja: row.wilayah_kerja as any || 'Sumba Timur',
            jabatan: row.jabatan || '-',
            gaji_bulanan: row.gaji_bulanan as any || 'Rp 3.000.000 - Rp 5.000.000',
            waktu_tunggu_bulan: Number(row.waktu_tunggu_bulan) || 3,
            relevansi_kurikulum: row.relevansi_kurikulum as any || 'Relevan'
          });
          successCount++;
        } catch (err) {
          console.error(err);
          errorCount++;
        }
      }

      alert(`Impor CSV Selesai! Berhasil mengimpor ${successCount} alumni.${errorCount > 0 ? ` Gagal: ${errorCount} baris.` : ''}`);
      e.target.value = '';
    };

    reader.readAsText(file);
  };

  const downloadCSVTemplate = () => {
    const csvContent = 
      "nama,nim,tahun_lulus,no_hp,email,status_kerja,nama_institusi,wilayah_kerja,jabatan,gaji_bulanan,waktu_tunggu_bulan,relevansi_kurikulum\n" +
      "Rambu Ana,P07420120101,2024,08123456789,rambu@mail.com,Bekerja,Rumah Sakit Kristen Lindimara,Sumba Timur,Perawat IGD,Rp 3.000.000 - Rp 5.000.000,3,Relevan\n" +
      "Lodu Sumba,P07420120102,2023,08123456780,lodu@mail.com,Mencari Kerja,-,Sumba Barat,-,< Rp 3.000.000,5,Cukup Relevan";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_tracer_alumni.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data alumni ini?')) {
      await onDelete(id);
    }
  };

  // Filter Logic
  const filteredAlumni = alumni.filter(a => {
    const matchesSearch = a.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.nama_institusi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.jabatan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesYear = filterYear === 'Semua' || a.tahun_lulus === Number(filterYear);
    const matchesStatus = filterStatus === 'Semua' || a.status_kerja === filterStatus;
    const matchesRegion = filterRegion === 'Semua' || a.wilayah_kerja === filterRegion;

    return matchesSearch && matchesYear && matchesStatus && matchesRegion;
  });

  const totalPages = Math.ceil(filteredAlumni.length / 50);
  const paginatedAlumni = filteredAlumni.slice((currentPage - 1) * 50, currentPage * 50);

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="glass p-5 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1 max-w-4xl">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Cari Alumni (Nama, NIM, Institusi)..." 
              className="form-control pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-[140px]">
            <select 
              className="form-control"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="Semua">Tahun Lulus</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className="w-[160px]">
            <select 
              className="form-control"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Semua">Status Kerja</option>
              <option value="Bekerja">Bekerja</option>
              <option value="Wirausaha">Wirausaha</option>
              <option value="Studi Lanjut">Studi Lanjut</option>
              <option value="Mencari Kerja">Mencari Kerja</option>
            </select>
          </div>

          <div className="w-[180px]">
            <select 
              className="form-control"
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
            >
              <option value="Semua">Wilayah Kerja</option>
              <option value="Sumba Timur">Sumba Timur</option>
              <option value="Sumba Barat">Sumba Barat</option>
              <option value="Sumba Tengah">Sumba Tengah</option>
              <option value="Sumba Barat Daya">Sumba Barat Daya</option>
              <option value="Luar Sumba">Luar Sumba</option>
            </select>
          </div>

          {(searchTerm || filterYear !== 'Semua' || filterStatus !== 'Semua' || filterRegion !== 'Semua') && (
            <button 
              className="btn btn-outline"
              onClick={() => {
                setSearchTerm('');
                setFilterYear('Semua');
                setFilterStatus('Semua');
                setFilterRegion('Semua');
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleCSVImport} 
            accept=".csv" 
            style={{ display: 'none' }} 
          />
          
          <button 
            type="button" 
            className="btn btn-outline text-xs flex items-center gap-1 text-slate-700 dark:text-slate-200 border-color"
            onClick={downloadCSVTemplate}
          >
            <Download size={14} />
            Unduh Template
          </button>
          
          <button 
            type="button" 
            className="btn btn-outline text-xs flex items-center gap-1 text-teal-600 border-teal-500/20 hover:bg-teal-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} />
            Impor CSV
          </button>
          
          <button className="btn btn-primary text-xs flex items-center gap-1" onClick={openAddModal}>
            <Plus size={14} />
            Input Tracer Manual
          </button>
        </div>
      </div>

      {/* Main Database Table */}
      <div className="glass overflow-hidden">
        <div className="p-5 border-bottom flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Database Alumni Terintegrasi (2021-2025)</h3>
            <p className="text-xs text-muted">Menampilkan {filteredAlumni.length} alumni terdaftar berdasarkan pencarian.</p>
          </div>
        </div>

        <div className="table-container">
          {paginatedAlumni.length > 0 ? (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Alumni</th>
                  <th>Kontak</th>
                  <th>Status Kerja</th>
                  <th>Instansi / Wilayah</th>
                  <th>Gaji Bulanan</th>
                  <th>Relevansi / UKOM</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAlumni.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="font-bold text-[14px]">{a.nama}</div>
                      <div className="flex gap-2 items-center text-[11px] text-muted mt-0.5">
                        <span>NIM: {a.nim}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <GraduationCap size={12} />
                          Lulusan {a.tahun_lulus}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs flex flex-col gap-0.5 text-muted">
                        <span className="flex items-center gap-1"><Mail size={12} /> {a.email}</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {a.no_hp}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        a.status_kerja === 'Bekerja'
                          ? 'badge-success'
                          : a.status_kerja === 'Wirausaha'
                            ? 'badge-primary'
                            : a.status_kerja === 'Studi Lanjut'
                              ? 'badge-warning'
                              : 'badge-danger'
                      }`}>
                        {a.status_kerja}
                      </span>
                    </td>
                    <td>
                      {a.status_kerja === 'Bekerja' || a.status_kerja === 'Wirausaha' ? (
                        <div>
                          <div className="font-semibold text-xs flex items-center gap-1">
                            <Briefcase size={12} className="text-muted" />
                            {a.nama_institusi}
                          </div>
                          <span className="text-[10px] text-muted flex items-center gap-0.5 mt-0.5">
                            <MapPin size={10} />
                            {a.wilayah_kerja} ({a.jabatan})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted italic">-</span>
                      )}
                    </td>
                    <td>
                      <span className="text-xs font-mono font-bold flex items-center">
                        <DollarSign size={12} className="text-emerald-500" />
                        {a.gaji_bulanan}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`badge ${
                          a.relevansi_kurikulum === 'Sangat Relevan' || a.relevansi_kurikulum === 'Relevan'
                            ? 'badge-success'
                            : a.relevansi_kurikulum === 'Cukup Relevan'
                              ? 'badge-warning'
                              : 'badge-danger'
                        } text-[10px] py-0.5 px-2`}>
                          {a.relevansi_kurikulum}
                        </span>
                        {a.tahun_lulus_ukom ? (
                          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold border border-teal-200 dark:border-teal-800 rounded px-1.5 py-0.5">
                            UKOM: {a.tahun_lulus_ukom}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Belum Lulus UKOM</span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex justify-end gap-1.5">
                        <button 
                          className="btn btn-outline p-2 text-xs"
                          onClick={() => openEditModal(a)}
                          title="Edit Data"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="btn btn-outline p-2 text-xs text-rose-600 border-rose-500/20 hover:bg-rose-50"
                          onClick={() => handleDelete(a.id)}
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-muted italic">
              Tidak ada data alumni yang cocok dengan pencarian.
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-between items-center p-4 border-t border-color bg-slate-50/50 dark:bg-slate-900/30 text-xs gap-3">
            <div className="text-muted font-semibold">
              Menampilkan {paginatedAlumni.length} dari {filteredAlumni.length} baris (Halaman {currentPage} dari {totalPages})
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

      {/* Tracer Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header flex flex-col items-stretch gap-2.5 pb-2">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg font-bold">
                  {editingAlumni ? 'Perbaharui Data Tracer Alumni' : 'Isi Kuesioner Tracer Alumni'}
                </h3>
                <button className="btn btn-outline p-1.5 rounded-full" onClick={() => setIsModalOpen(false)}>
                  ×
                </button>
              </div>
              
              {/* Progress kelengkapan */}
              <div className="space-y-1 mt-1">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <span>Kelengkapan Kuesioner</span>
                  <span className={completionPercentage === 100 ? 'text-emerald-500 font-extrabold' : 'text-teal-500 font-extrabold'}>{completionPercentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${completionPercentage}%`, 
                      background: completionPercentage === 100 
                        ? '#10b981' 
                        : 'linear-gradient(90deg, #00B9AD, #CDDC29)' 
                    }}
                  />
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Nama lengkap..."
                      value={formNama}
                      onChange={(e) => setFormNama(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">NIM (Nomor Induk Mahasiswa)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: P07420118045"
                      value={formNim}
                      onChange={(e) => setFormNim(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">Tahun Kelulusan</label>
                    <select 
                      className="form-control"
                      value={formTahunLulus}
                      onChange={(e) => setFormTahunLulus(Number(e.target.value))}
                    >
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                  <div className="form-group col-span-2">
                    <label className="form-label">Nomor WhatsApp / HP</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="Nomor WA aktif..."
                      value={formNoHp}
                      onChange={(e) => setFormNoHp(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Alamat email..."
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Status Pekerjaan Saat Ini</label>
                    <select 
                      className="form-control"
                      value={formStatusKerja}
                      onChange={(e) => setFormStatusKerja(e.target.value as any)}
                    >
                      <option value="Bekerja">Bekerja (Karyawan/PNS/Honorer)</option>
                      <option value="Wirausaha">Wirausaha (Mandiri)</option>
                      <option value="Studi Lanjut">Studi Lanjut (Kuliah lagi)</option>
                      <option value="Mencari Kerja">Mencari Kerja / Belum Bekerja</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Relevansi Kurikulum dgn Pekerjaan</label>
                      <select 
                        className="form-control"
                        value={formRelevansi}
                        onChange={(e) => setFormRelevansi(e.target.value as any)}
                      >
                        <option value="Sangat Relevan">Sangat Relevan</option>
                        <option value="Relevan">Relevan</option>
                        <option value="Cukup Relevan">Cukup Relevan</option>
                        <option value="Tidak Relevan">Tidak Relevan</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tahun & Periode Uji Kompetensi</label>
                      <select 
                        className="form-control"
                        value={formTahunLulusUkom}
                        onChange={(e) => setFormTahunLulusUkom(e.target.value)}
                      >
                        <option value="">-- Belum Lulus / Kosongkan --</option>
                        {Array.from({ length: new Date().getFullYear() - 2019 + 2 }, (_, i) => 2019 + i).reverse().map(year => (
                          <React.Fragment key={year}>
                            <option value={`${year} Periode 3`}>{year} - Periode 3</option>
                            <option value={`${year} Periode 2`}>{year} - Periode 2</option>
                            <option value={`${year} Periode 1`}>{year} - Periode 1</option>
                          </React.Fragment>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {formStatusKerja !== 'Mencari Kerja' && (
                  <div className="space-y-4 border-t border-color pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Nama Instansi / Instansi / Mitra / Apotek</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Nama instansi tempat kerja..."
                          value={formNamaInstitusi}
                          onChange={(e) => setFormNamaInstitusi(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Jabatan / Posisi Kerja</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Contoh: Perawat IGD, Bidan Klinik"
                          value={formJabatan}
                          onChange={(e) => setFormJabatan(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="form-group">
                        <label className="form-label">Wilayah Kerja</label>
                        <div className="flex gap-2">
                          <select 
                            className="form-control"
                            value={['Sumba Timur', 'Sumba Barat', 'Sumba Tengah', 'Sumba Barat Daya', 'Kota Kupang', 'Kabupaten Kupang'].includes(formWilayahKerja) ? formWilayahKerja : 'Lainnya'}
                            onChange={(e) => {
                              if (e.target.value === 'Lainnya') setFormWilayahKerja('');
                              else setFormWilayahKerja(e.target.value);
                            }}
                          >
                            <option value="Sumba Timur">Sumba Timur</option>
                            <option value="Sumba Barat">Sumba Barat</option>
                            <option value="Sumba Tengah">Sumba Tengah</option>
                            <option value="Sumba Barat Daya">Sumba Barat Daya</option>
                            <option value="Kota Kupang">Kota Kupang</option>
                            <option value="Kabupaten Kupang">Kabupaten Kupang</option>
                            <option value="Lainnya">Lainnya (Sebutkan...)</option>
                          </select>
                          {!['Sumba Timur', 'Sumba Barat', 'Sumba Tengah', 'Sumba Barat Daya', 'Kota Kupang', 'Kabupaten Kupang'].includes(formWilayahKerja) && (
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Kota/Pulau..."
                              value={formWilayahKerja}
                              onChange={(e) => setFormWilayahKerja(e.target.value)}
                              required
                            />
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Waktu Tunggu (Bulan)</label>
                        <input 
                          type="number" 
                          min={0}
                          max={60}
                          className="form-control"
                          value={formWaktuTunggu}
                          onChange={(e) => setFormWaktuTunggu(Number(e.target.value))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Kisaran Gaji Bulanan</label>
                        <select 
                          className="form-control"
                          value={formGajiBulanan}
                          onChange={(e) => setFormGajiBulanan(e.target.value as any)}
                        >
                          <option value="< Rp 3.000.000">&lt; Rp 3.000.000</option>
                          <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                          <option value="Rp 5.000.000 - Rp 7.500.000">Rp 5.000.000 - Rp 7.500.000</option>
                          <option value="> Rp 7.500.000">&gt; Rp 7.500.000</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAlumni ? 'Simpan Perubahan' : 'Submit Kuesioner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
