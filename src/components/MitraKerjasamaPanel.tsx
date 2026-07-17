import React, { useState } from 'react';
import type { MitraKerjasama } from '../data/mockData';
import { Plus, Edit2, Trash2, Search, RefreshCw, Download, Building2, FileText, Key, CheckCircle, AlertCircle, Copy, Check, Link } from 'lucide-react';

interface MitraKerjasamaPanelProps {
  mitra: MitraKerjasama[];
  onAdd: (m: Omit<MitraKerjasama, 'id' | 'created_at'>) => Promise<MitraKerjasama>;
  onUpdate: (m: MitraKerjasama) => Promise<MitraKerjasama>;
  onDelete: (id: string) => Promise<boolean>;
  selectedHospitalName: string | null;
  onClearSelectedHospital: () => void;
}

export const MitraKerjasamaPanel: React.FC<MitraKerjasamaPanelProps> = ({
  mitra,
  onAdd,
  onUpdate,
  onDelete,
  selectedHospitalName,
  onClearSelectedHospital
}) => {
  const getMouStatus = (tanggalBerakhir: string) => {
    if (!tanggalBerakhir) return { label: 'AKTIF', class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
    const expireDate = new Date(tanggalBerakhir);
    const today = new Date();
    if (today > expireDate) {
      return { label: 'BERAKHIR', class: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
    }
    const limit = new Date();
    limit.setMonth(limit.getMonth() + 3);
    if (expireDate <= limit) {
      return { label: 'SEGERA BERAKHIR', class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    }
    return { label: 'AKTIF', class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
  };

  // Sub-tabs: 'instansi' (Registrasi RS & Akun) or 'dokumen' (MoU Berkas)
  const [activeTab, setActiveTab] = useState<'instansi' | 'dokumen'>('instansi');
  
  const [searchTerm, setSearchTerm] = useState(selectedHospitalName || '');
  const [filterKabupaten, setFilterKabupaten] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);

  const availableKabupatens = React.useMemo(() => {
    const kabs = new Set<string>();
    mitra.forEach(m => { if (m.kabupaten) kabs.add(m.kabupaten); });
    kabs.add('Sumba Timur');
    kabs.add('Sumba Barat');
    kabs.add('Sumba Tengah');
    kabs.add('Sumba Barat Daya');
    return Array.from(kabs).sort();
  }, [mitra]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterKabupaten, filterStatus, activeTab]);

  // Modal states
  const [isInstansiModalOpen, setIsInstansiModalOpen] = useState(false);
  const [isDokumenModalOpen, setIsDokumenModalOpen] = useState(false);
  const [editingMitra, setEditingMitra] = useState<MitraKerjasama | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State - Tab 1 (Registrasi Instansi)
  const [formNamaRS, setFormNamaRS] = useState('');
  const [formKabupaten, setFormKabupaten] = useState<string>('Sumba Timur');
  const [formJenisMitra, setFormJenisMitra] = useState<'Rumah Sakit' | 'Pemerintah Daerah' | 'Puskesmas' | 'Klinik' | 'Lainnya'>('Rumah Sakit');
  const [formUsernameLogin, setFormUsernameLogin] = useState('');
  const [formPasswordLogin, setFormPasswordLogin] = useState('');

  // Form State - Tab 2 (Berkas Dokumen MoU)
  const [selectedMitraId, setSelectedMitraId] = useState('');
  const [formNomor, setFormNomor] = useState('');
  const [formMulai, setFormMulai] = useState('');
  const [formBerakhir, setFormBerakhir] = useState('');
  const [formRuangLingkup, setFormRuangLingkup] = useState('');
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Perpanjangan' | 'Non-Aktif'>('Aktif');
  const [formFileUrl, setFormFileUrl] = useState('');

  // Sync selected hospital from map
  React.useEffect(() => {
    if (selectedHospitalName) {
      setSearchTerm(selectedHospitalName);
      setFilterKabupaten('Semua');
      setFilterStatus('Semua');
      setActiveTab('dokumen');
    }
  }, [selectedHospitalName]);

  // Tab 1 modal handlers
  const openAddInstansiModal = () => {
    setEditingMitra(null);
    setFormNamaRS('');
    setFormKabupaten('Sumba Timur');
    setFormJenisMitra('Rumah Sakit');
    setFormUsernameLogin('');
    setFormPasswordLogin('');
    setIsInstansiModalOpen(true);
  };

  const openEditInstansiModal = (m: MitraKerjasama) => {
    setEditingMitra(m);
    setFormNamaRS(m.nama_rs);
    setFormKabupaten(m.kabupaten);
    setFormJenisMitra(m.jenis_mitra || 'Rumah Sakit');
    setFormUsernameLogin(m.username_login || '');
    setFormPasswordLogin(m.password_login || '');
    setIsInstansiModalOpen(true);
  };

  // Tab 2 modal handlers
  const openAddDokumenModal = (preselectedId?: string) => {
    setEditingMitra(null);
    setSelectedMitraId(preselectedId || mitra[0]?.id || '');
    setFormNomor('');
    setFormMulai('');
    setFormBerakhir('');
    setFormRuangLingkup('');
    setFormStatus('Aktif');
    setFormFileUrl('');
    setIsDokumenModalOpen(true);
  };

  const openEditDokumenModal = (m: MitraKerjasama) => {
    setEditingMitra(m);
    setSelectedMitraId(m.id);
    setFormNomor(m.nomor_kerjasama || '');
    setFormMulai(m.tanggal_mulai || '');
    setFormBerakhir(m.tanggal_berakhir || '');
    setFormRuangLingkup(m.ruang_lingkup || '');
    setFormStatus(m.status || 'Aktif');
    setFormFileUrl(m.file_url || '');
    setIsDokumenModalOpen(true);
  };

  const handleRenew = (m: MitraKerjasama) => {
    setEditingMitra(m);
    setSelectedMitraId(m.id);
    setFormNomor((m.nomor_kerjasama || '') + ' - RENEW');
    setFormMulai(new Date().toISOString().split('T')[0]);
    
    const end = new Date();
    end.setFullYear(end.getFullYear() + 3);
    setFormBerakhir(end.toISOString().split('T')[0]);
    setFormRuangLingkup(m.ruang_lingkup || '');
    setFormStatus('Aktif');
    setFormFileUrl(m.file_url || '');
    setIsDokumenModalOpen(true);
  };

  // Submits
  const handleInstansiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNamaRS || !formUsernameLogin || !formPasswordLogin) {
      alert('Nama RS, Username dan Password wajib diisi!');
      return;
    }

    if (editingMitra) {
      await onUpdate({
        ...editingMitra,
        nama_rs: formNamaRS,
        kabupaten: formKabupaten,
        jenis_mitra: formJenisMitra,
        username_login: formUsernameLogin,
        password_login: formPasswordLogin
      });
    } else {
      await onAdd({
        nama_rs: formNamaRS,
        kabupaten: formKabupaten,
        jenis_mitra: formJenisMitra,
        username_login: formUsernameLogin,
        password_login: formPasswordLogin,
        nomor_kerjasama: '-',
        tanggal_mulai: '',
        tanggal_berakhir: '',
        ruang_lingkup: '',
        status: 'Non-Aktif',
        file_url: '#'
      });
    }
    setIsInstansiModalOpen(false);
  };

  const handleDokumenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMitraId || !formNomor || !formMulai || !formBerakhir) {
      alert('Nama RS, Nomor MoU, Tanggal Mulai dan Berakhir wajib diisi!');
      return;
    }

    const targetMitra = mitra.find(m => m.id === selectedMitraId);
    if (!targetMitra) {
      alert('Mitra RS tidak ditemukan!');
      return;
    }

    const newEntry = {
      nomor_kerjasama: formNomor,
      tanggal_mulai: formMulai,
      tanggal_berakhir: formBerakhir,
      file_url: formFileUrl || '#',
      ruang_lingkup: formRuangLingkup,
      created_at: new Date().toISOString()
    };

    let updatedHistory = targetMitra.mou_history ? [...targetMitra.mou_history] : [];
    if (updatedHistory.length === 0 && targetMitra.nomor_kerjasama && targetMitra.nomor_kerjasama !== '-') {
      updatedHistory.push({
        nomor_kerjasama: targetMitra.nomor_kerjasama,
        tanggal_mulai: targetMitra.tanggal_mulai,
        tanggal_berakhir: targetMitra.tanggal_berakhir,
        file_url: targetMitra.file_url,
        ruang_lingkup: targetMitra.ruang_lingkup,
        created_at: targetMitra.created_at
      });
    }

    const exists = updatedHistory.some(h => h.nomor_kerjasama === formNomor);
    if (!exists) {
      updatedHistory.push(newEntry);
    }

    await onUpdate({
      ...targetMitra,
      nomor_kerjasama: formNomor,
      tanggal_mulai: formMulai,
      tanggal_berakhir: formBerakhir,
      ruang_lingkup: formRuangLingkup,
      status: formStatus,
      file_url: formFileUrl || '#',
      mou_history: updatedHistory
    });

    setIsDokumenModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini? Semua data terkait instansi ini akan hilang.')) {
      await onDelete(id);
    }
  };

  // Copy to clipboard helper
  const handleCopy = (id: string, usr: string, pass: string) => {
    navigator.clipboard.writeText(`User: ${usr} | Pass: ${pass}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length <= 1) {
        alert('File CSV kosong atau tidak valid.');
        return;
      }

      // Check header
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['nama_rs', 'kabupaten', 'jenis_mitra', 'username_login', 'password_login', 'nomor_kerjasama', 'tanggal_mulai', 'tanggal_berakhir', 'ruang_lingkup', 'status', 'file_url'];
      
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
            nama_rs: row.nama_rs || 'Tanpa Nama',
            kabupaten: row.kabupaten || 'Sumba Timur',
            jenis_mitra: (row.jenis_mitra as any) || 'Rumah Sakit',
            username_login: row.username_login || `user_${Math.random().toString(36).substring(7)}`,
            password_login: row.password_login || 'pass123',
            nomor_kerjasama: row.nomor_kerjasama || '-',
            tanggal_mulai: row.tanggal_mulai || '',
            tanggal_berakhir: row.tanggal_berakhir || '',
            ruang_lingkup: row.ruang_lingkup || '',
            status: (row.status as any) || 'Non-Aktif',
            file_url: row.file_url || '#'
          });
          successCount++;
        } catch (err) {
          console.error(err);
          errorCount++;
        }
      }

      alert(`Impor CSV Selesai! Berhasil mengimpor ${successCount} mitra.${errorCount > 0 ? ` Gagal: ${errorCount} baris.` : ''}`);
      e.target.value = '';
    };

    reader.readAsText(file);
  };

  const downloadCSVTemplate = () => {
    const csvContent = 
      "nama_rs,kabupaten,jenis_mitra,username_login,password_login,nomor_kerjasama,tanggal_mulai,tanggal_berakhir,ruang_lingkup,status,file_url\n" +
      "RSUD Waingapu,Sumba Timur,Rumah Sakit,rsud_waingapu,pass123,01/MoU/2026,2026-01-01,2029-01-01,Pelayanan Kesehatan & Praktek Klinik,Aktif,#\n" +
      "Puskesmas Melolo,Sumba Timur,Puskesmas,pk_melolo,pass456,02/MoU/2026,2026-02-15,2029-02-15,Praktek Lapangan Kebidanan,Aktif,#";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_mitra_kerjasama.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Logic
  const filteredMitra = mitra.filter(m => {
    const matchesSearch = m.nama_rs.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (m.nomor_kerjasama && m.nomor_kerjasama.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (m.username_login && m.username_login.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesKabupaten = filterKabupaten === 'Semua' || m.kabupaten === filterKabupaten;
    const matchesStatus = filterStatus === 'Semua' || m.status === filterStatus;

    return matchesSearch && matchesKabupaten && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMitra.length / 50);
  const paginatedMitra = filteredMitra.slice((currentPage - 1) * 50, currentPage * 50);

  return (
    <div className="space-y-6">
      
      {/* Premium Segmented Switch for Tabs */}
      <div className="flex bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-color shadow-sm">
        <button 
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 ${activeTab === 'instansi' ? 'bg-white dark:bg-slate-800 shadow-md text-teal-600 dark:text-teal-400 border border-slate-200/50 dark:border-slate-700/50' : 'text-muted hover:text-slate-700 dark:hover:text-slate-200'}`}
          onClick={() => { setActiveTab('instansi'); setSearchTerm(''); }}
        >
          <Building2 size={16} className={activeTab === 'instansi' ? 'text-teal-500' : 'text-muted'} />
          <div>
            <div className="text-left font-extrabold text-[12px]">MENU 1: Registrasi & Akun Mitra</div>
            <div className="text-[10px] text-muted font-normal text-left hidden sm:block">Kelola identitas instansi & kredensial login portal</div>
          </div>
        </button>
        
        <button 
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 ${activeTab === 'dokumen' ? 'bg-white dark:bg-slate-800 shadow-md text-teal-600 dark:text-teal-400 border border-slate-200/50 dark:border-slate-700/50' : 'text-muted hover:text-slate-700 dark:hover:text-slate-200'}`}
          onClick={() => { setActiveTab('dokumen'); setSearchTerm(''); }}
        >
          <FileText size={16} className={activeTab === 'dokumen' ? 'text-teal-500' : 'text-muted'} />
          <div>
            <div className="text-left font-extrabold text-[12px]">MENU 2: Berkas & MoU Kerjasama</div>
            <div className="text-[10px] text-muted font-normal text-left hidden sm:block">Unggah dokumen MoU, masa berlaku & ruang lingkup</div>
          </div>
        </button>
      </div>

      {/* Control Panel / Filter & Action bar */}
      <div className="glass p-5 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-wrap gap-3 items-center flex-1 max-w-4xl">
          
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 text-muted" size={18} />
            <input 
              type="text" 
              placeholder={activeTab === 'instansi' ? "Cari Instansi / Mitra / Username..." : "Cari Instansi / Mitra / Nomor MoU..."}
              className="form-control pl-10 text-xs py-2 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-[150px]">
            <select 
              className="form-control text-xs py-2 rounded-xl"
              value={filterKabupaten}
              onChange={(e) => setFilterKabupaten(e.target.value)}
            >
              <option value="Semua">Semua Wilayah</option>
              {availableKabupatens.map(kab => (
                <option key={kab} value={kab}>{kab}</option>
              ))}
            </select>
          </div>

          {activeTab === 'dokumen' && (
            <div className="w-[150px]">
              <select 
                className="form-control text-xs py-2 rounded-xl"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Perpanjangan">Perlu Perpanjangan</option>
                <option value="Non-Aktif">Non-Aktif (Expired)</option>
              </select>
            </div>
          )}

          {(searchTerm || filterKabupaten !== 'Semua' || filterStatus !== 'Semua') && (
            <button 
              className="btn btn-outline p-2.5 text-xs text-muted border-color flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"
              onClick={() => {
                setSearchTerm('');
                setFilterKabupaten('Semua');
                setFilterStatus('Semua');
                onClearSelectedHospital();
              }}
              title="Reset Filter"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          {activeTab === 'instansi' && (
            <>
              <button 
                className="btn btn-outline text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 shadow-sm border-color hover:bg-slate-50 dark:hover:bg-slate-900"
                onClick={downloadCSVTemplate}
              >
                📥 Template
              </button>
              <label className="btn btn-outline text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 shadow-sm border-color hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                📤 Impor CSV
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleCSVImport} 
                />
              </label>
            </>
          )}

          {activeTab === 'instansi' ? (
            <button className="btn btn-primary text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm" onClick={openAddInstansiModal}>
              <Plus size={16} />
              Registrasi Mitra
            </button>
          ) : (
            <button className="btn btn-primary text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm" onClick={() => openAddDokumenModal()}>
              <Plus size={16} />
              Unggah Dokumen MoU
            </button>
          )}
        </div>
      </div>

      {/* CONTENT TAB 1: REGISTRASI & AKUN LOGIN RS (Premium Card Grid) */}
      {activeTab === 'instansi' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                🏥 Data Profil Instansi & Kredensial Portal
              </h3>
              <p className="text-xs text-muted">Daftar instansi mitra kerja sama beserta data kredensial akses masuk.</p>
            </div>
            <span className="text-xs text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/10">
              {filteredMitra.length} Instansi terdaftar
            </span>
          </div>

          {paginatedMitra.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedMitra.map(m => {
                const hasMoU = m.nomor_kerjasama && m.nomor_kerjasama !== '-';
                
                const countyTheme = {
                  'Sumba Timur': {
                    border: '#3b82f6',
                    bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.01) 100%)',
                    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20',
                    hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  },
                  'Sumba Barat': {
                    border: '#a855f7',
                    bg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(168, 85, 247, 0.01) 100%)',
                    badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20',
                    hoverText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400'
                  },
                  'Sumba Tengah': {
                    border: '#10b981',
                    bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.01) 100%)',
                    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
                    hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                  },
                  'Sumba Barat Daya': {
                    border: '#f59e0b',
                    bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.01) 100%)',
                    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
                    hoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400'
                  }
                };
                const theme = (countyTheme as any)[m.kabupaten] || countyTheme['Sumba Timur'];

                return (
                  <div 
                    key={m.id} 
                    className="glass border border-color rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group hover:-translate-y-0.5"
                    style={{
                      borderLeft: `5px solid ${theme.border}`,
                      background: theme.bg
                    }}
                  >
                    <div className="space-y-3">
                      {/* RS info & county badge */}
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-lg ${theme.badge}`}>
                          📍 Kabupaten {m.kabupaten}
                        </span>
                        
                        {hasMoU ? (
                          <span className="badge badge-success text-[9px] font-bold py-1 px-2 flex items-center gap-1">
                            <CheckCircle size={10} />
                            MoU Aktif
                          </span>
                        ) : (
                          <span className="badge badge-danger text-[9px] font-bold py-1 px-2 flex items-center gap-1">
                            <AlertCircle size={10} />
                            Tanpa MoU
                          </span>
                        )}
                      </div>

                      <h4 className={`font-extrabold text-sm text-slate-800 dark:text-white leading-snug transition-colors ${theme.hoverText}`}>
                        {m.nama_rs}
                      </h4>

                      {/* Credentials Display */}
                      <div 
                        onClick={() => handleCopy(m.id, m.username_login || '', m.password_login || '')}
                        className="bg-slate-100/60 dark:bg-slate-900/50 border border-color p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-900/80 transition-colors group/cred"
                        title="Klik untuk menyalin detail login"
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] text-muted font-bold block uppercase tracking-wider">Kredensial Login Akses:</span>
                          <div className="font-mono text-xs text-slate-700 dark:text-slate-200">
                            <span>usr: <strong className="text-teal-600 dark:text-teal-400">{m.username_login || '-'}</strong></span>
                            <span className="mx-2 text-slate-300">|</span>
                            <span>pwd: <strong className="font-semibold">{m.password_login || '-'}</strong></span>
                          </div>
                        </div>
                        <button className="text-teal-500 p-1.5 rounded-lg bg-teal-500/5 group-hover/cred:bg-teal-500/10 transition-colors">
                          {copiedId === m.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-color pt-3">
                      <div>
                        {!hasMoU && (
                          <button 
                            onClick={() => openAddDokumenModal(m.id)}
                            className="text-[10px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline"
                          >
                            <Link size={12} />
                            Unggah MoU Sekarang
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button 
                          className="btn btn-outline p-2 text-xs rounded-xl border-color text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                          onClick={() => openEditInstansiModal(m)}
                          title="Edit Info Instansi"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          className="btn btn-outline p-2 text-xs rounded-xl text-rose-600 border-rose-500/20 hover:bg-rose-50"
                          onClick={() => handleDelete(m.id)}
                          title="Hapus Registrasi Instansi"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-between items-center p-4 border border-color rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 text-xs gap-3 mt-4">
                <div className="text-muted font-semibold">
                  Menampilkan {paginatedMitra.length} dari {filteredMitra.length} instansi (Halaman {currentPage} dari {totalPages})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    className="btn btn-outline py-1 px-2.5 rounded-lg font-bold text-xs"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Sebelumnya
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                    <button
                      key={page}
                      className={`btn py-1 px-2.5 rounded-lg font-bold text-xs ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
                      style={page === currentPage ? { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', color: '#fff' } : {}}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="btn btn-outline py-1 px-2.5 rounded-lg font-bold text-xs"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </>
          ) : (
            <div className="text-center py-12 text-muted italic bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-color">
              Belum ada instansi Instansi / Mitra terdaftar yang cocok dengan pencarian Anda.
            </div>
          )}
        </div>
      )}

      {/* CONTENT TAB 2: DAFTAR DOKUMEN MOU RS (Premium Timeline Cards Grid) */}
      {activeTab === 'dokumen' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                📄 Berkas Dokumen Kerja Sama (MoU) Aktif
              </h3>
              <p className="text-xs text-muted">Daftar dokumen nomor PKS, tanggal berakhir, berkas pendukung, serta cakupan kerja sama.</p>
            </div>
            <span className="text-xs text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/10">
              {filteredMitra.filter(m => m.nomor_kerjasama && m.nomor_kerjasama !== '-').length} Dokumen terunggah
            </span>
          </div>

          {paginatedMitra.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedMitra.map(m => {
                const expireDate = m.tanggal_berakhir ? new Date(m.tanggal_berakhir) : null;
                const startDate = m.tanggal_mulai ? new Date(m.tanggal_mulai) : null;
                const today = new Date();
                
                const totalDays = expireDate && startDate ? Math.max(1, (expireDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) : 1;
                const elapsedDays = startDate ? Math.max(0, (today.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) : 0;
                const progressPercentage = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

                const hasDoc = m.nomor_kerjasama && m.nomor_kerjasama !== '-';
                const isExpired = expireDate ? (today > expireDate || m.status === 'Non-Aktif') : true;
                const isExpiringSoon = expireDate ? (m.status === 'Aktif' && (expireDate.getTime() - today.getTime()) < (90 * 24 * 60 * 60 * 1000) && !isExpired) : false;

                const kabColors = {
                  'Sumba Timur': 'from-teal-500/10 to-teal-600/5 text-teal-700 dark:text-teal-300 border-teal-500/20',
                  'Sumba Barat': 'from-purple-500/10 to-purple-600/5 text-purple-700 dark:text-purple-300 border-purple-500/20',
                  'Sumba Tengah': 'from-blue-500/10 to-blue-600/5 text-blue-700 dark:text-blue-300 border-blue-500/20',
                  'Sumba Barat Daya': 'from-teal-500/10 to-teal-600/5 text-teal-700 dark:text-teal-300 border-teal-500/20'
                };
                const kabBadgeStyle = (kabColors as any)[m.kabupaten] || kabColors['Sumba Timur'];

                return (
                  <div 
                    key={m.id} 
                    className={`glass rounded-2xl border transition-all duration-200 overflow-hidden relative group hover:-translate-y-1 hover:shadow-md ${
                      !hasDoc 
                        ? 'border-dashed border-slate-300 dark:border-slate-800 opacity-80' 
                        : isExpired 
                          ? 'border-rose-500/30' 
                          : isExpiringSoon 
                            ? 'border-amber-500/30 shadow-md' 
                            : 'border-color'
                    }`}
                  >
                    {/* Status Top bar */}
                    <div className={`h-1.5 w-full ${
                      !hasDoc 
                        ? 'bg-slate-300 dark:bg-slate-800'
                        : isExpired 
                          ? 'bg-rose-500' 
                          : isExpiringSoon 
                            ? 'bg-amber-500 animate-pulse' 
                            : 'bg-emerald-500'
                    }`} />

                    <div className="p-5 space-y-4">
                      {/* Header */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border bg-gradient-to-r ${kabBadgeStyle}`}>
                            📍 {m.kabupaten}
                          </span>
                          <span className={`badge text-[10px] font-bold ${
                            !hasDoc
                              ? 'bg-slate-100 dark:bg-slate-800 text-muted'
                              : isExpired 
                                ? 'badge-danger' 
                                : isExpiringSoon 
                                  ? 'badge-warning' 
                                  : 'badge-success'
                          }`}>
                            {!hasDoc ? 'Belum Ada MoU' : isExpired ? 'Expired' : isExpiringSoon ? 'Segera Berakhir' : 'Aktif'}
                          </span>
                        </div>
                        
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-white leading-snug group-hover:text-teal-500 transition-colors">
                          {m.nama_rs}
                        </h4>
                      </div>

                      {hasDoc ? (
                        <>
                          {/* MoU Number details */}
                          <div className="bg-slate-100/60 dark:bg-slate-900/50 p-2.5 rounded-xl border border-color space-y-1">
                            <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">Nomor MoU / PKS:</span>
                            <code className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 block truncate" title={m.nomor_kerjasama}>
                              {m.nomor_kerjasama}
                            </code>
                          </div>

                          {/* Progress/Validity Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-muted font-medium">
                              <span>Mulai: {m.tanggal_mulai}</span>
                              <span>Selesai: {m.tanggal_berakhir}</span>
                            </div>
                            
                            <div className="w-full bg-slate-200/50 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-color">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  isExpired 
                                    ? 'bg-rose-500' 
                                    : isExpiringSoon 
                                      ? 'bg-amber-500' 
                                      : 'bg-emerald-500'
                                }`}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            
                            {expireDate && (
                              <span className="text-[9px] text-muted block text-right font-semibold">
                                {isExpired 
                                  ? 'Masa berlaku telah habis' 
                                  : `${Math.ceil(totalDays - elapsedDays)} hari tersisa`
                                }
                              </span>
                            )}
                          </div>

                          {/* Scope / Ruang lingkup */}
                          <div className="space-y-1 text-xs">
                            <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">Cakupan Kerjasama:</span>
                            <p className="text-muted leading-relaxed line-clamp-2 text-[11px]" title={m.ruang_lingkup}>
                              {m.ruang_lingkup || 'Belum didefinisikan secara khusus.'}
                            </p>
                          </div>

                          {/* Historic MoU List Accordion */}
                          {m.mou_history && m.mou_history.length > 0 ? (
                            <div className="border-t border-color pt-3 mt-2 space-y-2">
                              <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">📜 Riwayat MoU ({m.mou_history.length}):</span>
                              <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                                {[...m.mou_history].sort((a, b) => new Date(b.tanggal_berakhir).getTime() - new Date(a.tanggal_berakhir).getTime()).map((hist, idx) => {
                                  const hStatus = getMouStatus(hist.tanggal_berakhir);
                                  return (
                                    <div key={idx} className="p-2 bg-slate-100/40 dark:bg-slate-900/30 rounded-lg border border-color text-[10px] space-y-1">
                                      <div className="flex justify-between items-start gap-1">
                                        <code className="font-mono text-slate-700 dark:text-slate-300 font-bold truncate block flex-1" title={hist.nomor_kerjasama}>
                                          {hist.nomor_kerjasama}
                                        </code>
                                        <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border ${hStatus.class}`}>
                                          {hStatus.label}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-muted text-[8px] pt-1">
                                        <span>{hist.tanggal_mulai} s.d {hist.tanggal_berakhir}</span>
                                        {hist.file_url && hist.file_url !== '#' && (
                                          <a href={hist.file_url} target="_blank" rel="noopener noreferrer" className="text-teal-500 font-bold hover:underline">
                                            Unduh
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="border-t border-color pt-3 mt-2 space-y-2">
                              <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">📜 Riwayat MoU (1):</span>
                              <div className="p-2 bg-slate-100/40 dark:bg-slate-900/30 rounded-lg border border-color text-[10px] space-y-1">
                                <div className="flex justify-between items-start gap-1">
                                  <code className="font-mono text-slate-700 dark:text-slate-300 font-bold truncate block flex-1" title={m.nomor_kerjasama}>
                                    {m.nomor_kerjasama}
                                  </code>
                                  <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border ${getMouStatus(m.tanggal_berakhir).class}`}>
                                    {getMouStatus(m.tanggal_berakhir).label}
                                  </span>
                                </div>
                                <div className="flex justify-between text-muted text-[8px] pt-1">
                                  <span>{m.tanggal_mulai} s.d {m.tanggal_berakhir}</span>
                                  {m.file_url && m.file_url !== '#' && (
                                    <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-teal-500 font-bold hover:underline">
                                      Unduh
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-6 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 text-xs space-y-3">
                          <p className="text-muted font-medium">Instansi terdaftar belum mengunggah berkas MoU.</p>
                          <button
                            onClick={() => openAddDokumenModal(m.id)}
                            className="btn btn-xs btn-primary font-bold text-[10px] py-1 px-3.5 rounded-lg border-none"
                          >
                            Unggah Dokumen MoU
                          </button>
                        </div>
                      )}

                      {/* Footer Actions */}
                      {hasDoc && (
                        <div className="flex gap-2 pt-2 border-t border-color justify-between items-center">
                          <a 
                            href={m.file_url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline text-xs px-2.5 py-1.5 rounded-lg border-color text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1" 
                            title="Unduh / Lihat Dokumen MoU"
                          >
                            <Download size={13} />
                            MoU PDF
                          </a>

                          <div className="flex gap-1.5">
                            <button 
                              className="btn btn-outline p-1.5 text-xs rounded-lg border-color text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                              onClick={() => openEditDokumenModal(m)}
                              title="Sunting Dokumen"
                            >
                              <Edit2 size={13} />
                            </button>
                            
                            {isExpired && (
                              <button 
                                className="btn btn-outline p-1.5 text-xs rounded-lg text-emerald-600 border-emerald-500/20 hover:bg-emerald-50"
                                onClick={() => handleRenew(m)}
                                title="Perbaharui Kerjasama"
                              >
                                <RefreshCw size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-between items-center p-4 border border-color rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 text-xs gap-3 mt-4">
                <div className="text-muted font-semibold">
                  Menampilkan {paginatedMitra.length} dari {filteredMitra.length} dokumen (Halaman {currentPage} dari {totalPages})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    className="btn btn-outline py-1 px-2.5 rounded-lg font-bold text-xs"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Sebelumnya
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                    <button
                      key={page}
                      className={`btn py-1 px-2.5 rounded-lg font-bold text-xs ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
                      style={page === currentPage ? { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', color: '#fff' } : {}}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="btn btn-outline py-1 px-2.5 rounded-lg font-bold text-xs"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </>
          ) : (
            <div className="text-center py-12 text-muted italic bg-slate-50 dark:bg-slate-900 rounded-2xl border border-color">
              Tidak ada dokumen kerjasama instansi / mitra yang cocok dengan filter.
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: REGISTRASI INSTANSI (TAB 1) */}
      {isInstansiModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass w-full max-w-md shadow-2xl rounded-2xl border border-color">
            <div className="modal-header border-bottom pb-3">
              <h3 className="text-sm font-black flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-wider">
                <Building2 size={18} className="text-teal-500" />
                {editingMitra ? 'Update Registrasi RS Mitra' : 'Registrasi RS Mitra Baru'}
              </h3>
              <button className="btn btn-outline p-1.5 rounded-full" onClick={() => setIsInstansiModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleInstansiSubmit}>
              <div className="modal-body space-y-4 pt-4">
                <div className="form-group">
                  <label className="form-label text-xs">Nama Instansi Mitra</label>
                  <input 
                    type="text" 
                    className="form-control text-xs py-2 rounded-xl" 
                    placeholder="Contoh: RSUD Waikabubak"
                    value={formNamaRS}
                    onChange={(e) => setFormNamaRS(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Jenis Kemitraan</label>
                  <select 
                    className="form-control text-xs py-2 rounded-xl"
                    value={formJenisMitra}
                    onChange={(e) => setFormJenisMitra(e.target.value as any)}
                    required
                  >
                    <option value="Rumah Sakit">Rumah Sakit</option>
                    <option value="Pemerintah Daerah">Pemerintah Daerah</option>
                    <option value="Puskesmas">Puskesmas</option>
                    <option value="Klinik">Klinik</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Kabupaten (Lokasi)</label>
                  <div className="flex gap-2">
                    <select 
                      className="form-control text-xs py-2 rounded-xl"
                      value={['Sumba Timur', 'Sumba Barat', 'Sumba Tengah', 'Sumba Barat Daya', 'Kota Kupang', 'Kabupaten Kupang'].includes(formKabupaten) ? formKabupaten : 'Lainnya'}
                      onChange={(e) => {
                        if (e.target.value === 'Lainnya') setFormKabupaten('');
                        else setFormKabupaten(e.target.value);
                      }}
                      required
                    >
                      <option value="Sumba Timur">Sumba Timur</option>
                      <option value="Sumba Barat">Sumba Barat</option>
                      <option value="Sumba Tengah">Sumba Tengah</option>
                      <option value="Sumba Barat Daya">Sumba Barat Daya</option>
                      <option value="Kota Kupang">Kota Kupang</option>
                      <option value="Kabupaten Kupang">Kabupaten Kupang</option>
                      <option value="Lainnya">Kabupaten / Lokasi Lain...</option>
                    </select>
                    {!['Sumba Timur', 'Sumba Barat', 'Sumba Tengah', 'Sumba Barat Daya', 'Kota Kupang', 'Kabupaten Kupang'].includes(formKabupaten) && (
                      <input 
                        type="text" 
                        className="form-control text-xs py-2 rounded-xl flex-1"
                        placeholder="Ketik nama kabupaten/kota..."
                        value={formKabupaten}
                        onChange={(e) => setFormKabupaten(e.target.value)}
                        required
                      />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 rounded-2xl space-y-3">
                  <h4 className="text-xs font-black text-teal-600 dark:text-teal-400 flex items-center gap-1.5 uppercase tracking-wide">
                    <Key size={14} /> Atur Akun Portal Login
                  </h4>
                  
                  <div className="form-group">
                    <label className="form-label text-[10px]">Username Login</label>
                    <input 
                      type="text" 
                      className="form-control text-xs font-mono py-2 rounded-xl" 
                      placeholder="Contoh: rswaikabubak"
                      value={formUsernameLogin}
                      onChange={(e) => setFormUsernameLogin(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label text-[10px]">Password Login</label>
                    <input 
                      type="text" 
                      className="form-control text-xs font-mono py-2 rounded-xl" 
                      placeholder="Contoh: mitra123"
                      value={formPasswordLogin}
                      onChange={(e) => setFormPasswordLogin(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-t pt-3 flex justify-end gap-2">
                <button type="button" className="btn btn-outline text-xs rounded-xl py-2 px-4" onClick={() => setIsInstansiModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary text-xs rounded-xl py-2 px-4">
                  {editingMitra ? 'Simpan Perubahan' : 'Registrasi Instansi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UNGGAH DOKUMEN MOU (TAB 2) */}
      {isDokumenModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass w-full max-w-lg shadow-2xl rounded-2xl border border-color">
            <div className="modal-header border-bottom pb-3">
              <h3 className="text-sm font-black flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-wider">
                <FileText size={18} className="text-teal-500" />
                {editingMitra ? 'Update Berkas MoU Kerjasama' : 'Unggah Dokumen MoU Kerjasama'}
              </h3>
              <button className="btn btn-outline p-1.5 rounded-full" onClick={() => setIsDokumenModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleDokumenSubmit}>
              <div className="modal-body space-y-4 pt-4">
                
                <div className="form-group">
                  <label className="form-label text-xs">Pilih Instansi / Mitra Kemitraan</label>
                  {editingMitra ? (
                    <input 
                      type="text" 
                      className="form-control text-xs bg-slate-100 dark:bg-slate-900 cursor-not-allowed font-extrabold py-2 rounded-xl" 
                      value={formNamaRS} 
                      disabled 
                    />
                  ) : (
                    <select
                      className="form-control text-xs py-2 rounded-xl"
                      value={selectedMitraId}
                      onChange={(e) => setSelectedMitraId(e.target.value)}
                      required
                    >
                      {mitra.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.nama_rs} (Kab. {m.kabupaten})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label text-xs">Nomor Dokumen Kerjasama (MoU)</label>
                    <input 
                      type="text" 
                      className="form-control text-xs font-mono py-2 rounded-xl" 
                      placeholder="Contoh: 120/PKS/RSKL/XI/2024"
                      value={formNomor}
                      onChange={(e) => setFormNomor(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label text-xs">Status MoU</label>
                    <select 
                      className="form-control text-xs py-2 rounded-xl"
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Perpanjangan">Perlu Perpanjangan</option>
                      <option value="Non-Aktif">Non-Aktif (Expired)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label text-xs">Tanggal Mulai Berlaku</label>
                    <input 
                      type="date" 
                      className="form-control text-xs py-2 rounded-xl" 
                      value={formMulai}
                      onChange={(e) => setFormMulai(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-xs">Tanggal Berakhir</label>
                    <input 
                      type="date" 
                      className="form-control text-xs py-2 rounded-xl" 
                      value={formBerakhir}
                      onChange={(e) => setFormBerakhir(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Link Berkas MoU (Google Drive / URL PDF)</label>
                  <input 
                    type="url" 
                    className="form-control text-xs py-2 rounded-xl" 
                    placeholder="https://drive.google.com/file/d/..."
                    value={formFileUrl}
                    onChange={(e) => setFormFileUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Cakupan / Ruang Lingkup Kerjasama</label>
                  <textarea 
                    className="form-control text-xs p-3 rounded-xl" 
                    rows={3} 
                    placeholder="Tuliskan cakupan kerjasama seperti praktek klinis mahasiswa, penelitian, penyaluran kerja, dll."
                    value={formRuangLingkup}
                    onChange={(e) => setFormRuangLingkup(e.target.value)}
                  />
                </div>

              </div>
              <div className="modal-footer border-t pt-3 flex justify-end gap-2">
                <button type="button" className="btn btn-outline text-xs rounded-xl py-2 px-4" onClick={() => setIsDokumenModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary text-xs rounded-xl py-2 px-4">
                  {editingMitra ? 'Simpan Berkas' : 'Unggah Berkas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
