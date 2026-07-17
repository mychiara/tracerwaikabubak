import React, { useState } from 'react';
import type { Alumni, MitraKerjasama, PenggunaLulusan } from '../data/mockData';
import {
  Building2, LogOut, FileText, CheckCircle2, AlertTriangle, XCircle,
  Star, Send, BookOpen, UserCheck, MessageSquarePlus, Award, Download, Plus, X, GraduationCap,
  Menu, Home, Info
} from 'lucide-react';
import { PanduanPanel } from './PanduanPanel';
import { AboutPanel } from './AboutPanel';

interface MitraDashboardProps {
  mitraId: string;
  mitra: MitraKerjasama[];
  alumni: Alumni[];
  feedback: PenggunaLulusan[];
  onUpdateMitra: (m: MitraKerjasama) => Promise<MitraKerjasama>;
  onAddFeedback: (f: Omit<PenggunaLulusan, 'id' | 'created_at'>) => Promise<PenggunaLulusan>;
  onUpdateFeedback: (f: PenggunaLulusan) => Promise<PenggunaLulusan>;
  onAddAlumni: (a: Omit<Alumni, 'id' | 'created_at'>) => Promise<Alumni>;
  onLogout: () => void;
}

export const MitraDashboard: React.FC<MitraDashboardProps> = ({
  mitraId, mitra, alumni, feedback, onUpdateMitra, onAddFeedback, onUpdateFeedback, onAddAlumni, onLogout
}) => {
  const currentMitra = mitra.find(m => m.id === mitraId);

  // Active Menu Tab state for Mitra role
  const [activeTab, setActiveTab] = useState<'beranda' | 'mou' | 'alumni' | 'feedback' | 'panduan' | 'about'>('beranda');
  
  // Mobile menu control state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search & Filter state variables for Alumni list
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterYear, activeTab]);

  // Premium Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Form states for general/direct feedback
  const [formNamaPenilai, setFormNamaPenilai] = useState('');
  const [formJabatanPenilai, setFormJabatanPenilai] = useState('');
  const [formEtika, setFormEtika] = useState<number>(5);
  const [formKeahlian, setFormKeahlian] = useState<number>(5);
  const [formInggris, setFormInggris] = useState<number>(5);
  const [formTeknologi, setFormTeknologi] = useState<number>(5);
  const [formKomunikasi, setFormKomunikasi] = useState<number>(5);
  const [formKerjasama, setFormKerjasama] = useState<number>(5);
  const [formPengembangan, setFormPengembangan] = useState<number>(5);
  const [formMasukan, setFormMasukan] = useState('');
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Form states for MoU renewal
  const [renewNomor, setRenewNomor] = useState(currentMitra?.nomor_kerjasama || '');
  const [renewMulai, setRenewMulai] = useState(currentMitra?.tanggal_mulai || '');
  const [renewBerakhir, setRenewBerakhir] = useState(currentMitra?.tanggal_berakhir || '');
  const [renewFileUrl, setRenewFileUrl] = useState(currentMitra?.file_url || '');
  const [renewRuangLingkup, setRenewRuangLingkup] = useState(currentMitra?.ruang_lingkup || '');
  const [isRenewSubmitting, setIsRenewSubmitting] = useState(false);
  const [renewSuccess, setRenewSuccess] = useState(false);

  // Modal State 1: Registering new Alumni Profile (Basic Profile Info Only)
  const [isAlumniModalOpen, setIsAlumniModalOpen] = useState(false);
  const [alumniNama, setAlumniNama] = useState('');
  const [alumniNim, setAlumniNim] = useState('');
  const [alumniTahunLulus, setAlumniTahunLulus] = useState(new Date().getFullYear().toString());
  const [alumniJabatan, setAlumniJabatan] = useState('');
  const [isAlumniSubmitting, setIsAlumniSubmitting] = useState(false);

  // Modal State 2: Giving & Editing Alumni Performance Evaluation
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [selectedAlumniForEval, setSelectedAlumniForEval] = useState<Alumni | null>(null);
  const [alumniPenilaiNama, setAlumniPenilaiNama] = useState('');
  const [alumniPenilaiJabatan, setAlumniPenilaiJabatan] = useState('');
  const [alumniEtika, setAlumniEtika] = useState<number>(5);
  const [alumniKeahlian, setAlumniKeahlian] = useState<number>(5);
  const [alumniInggris, setAlumniInggris] = useState<number>(5);
  const [alumniTeknologi, setAlumniTeknologi] = useState<number>(5);
  const [alumniKomunikasi, setAlumniKomunikasi] = useState<number>(5);
  const [alumniKerjasama, setAlumniKerjasama] = useState<number>(5);
  const [alumniPengembangan, setAlumniPengembangan] = useState<number>(5);
  const [alumniSaran, setAlumniSaran] = useState('');
  const [isEvalSubmitting, setIsEvalSubmitting] = useState(false);

  // Active selected alumni for detail accordion view
  const [expandedAlumniId, setExpandedAlumniId] = useState<string | null>(null);

  // Live progress completion percentage for alumni performance evaluation
  const evalCompletionPercentage = React.useMemo(() => {
    const fields = [alumniPenilaiNama, alumniPenilaiJabatan, alumniSaran];
    const filled = fields.filter(f => f && f.trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [alumniPenilaiNama, alumniPenilaiJabatan, alumniSaran]);

  const downloadAlumniCSVTemplate = () => {
    const csvContent = 
      "nama,nim,tahun_lulus,jabatan,no_hp,email\n" +
      "Rambu Donda,P07420120104,2024,Perawat Pelaksana,081234567891,rambu.donda@mail.com\n" +
      "Lodu Kaka,P07420120105,2023,Perawat IGD,081234567892,lodu.kaka@mail.com";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template_alumni_mitra.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAlumniCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length <= 1) {
        showToast('File CSV kosong atau tidak valid.', 'error');
        return;
      }

      // Check header
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['nama', 'nim', 'tahun_lulus', 'jabatan', 'no_hp', 'email'];
      
      const missing = requiredHeaders.filter(req => !headers.includes(req));
      if (missing.length > 0) {
        showToast(`Header CSV tidak cocok. Kolom berikut hilang: ${missing.join(', ')}`, 'error');
        return;
      }

      if (!currentMitra) return;

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
          await onAddAlumni({
            nama: row.nama || 'Tanpa Nama',
            nim: row.nim || '-',
            tahun_lulus: Number(row.tahun_lulus) || 2024,
            no_hp: row.no_hp || '-',
            email: row.email || '-',
            status_kerja: 'Bekerja',
            nama_institusi: currentMitra.nama_rs,
            wilayah_kerja: currentMitra.kabupaten,
            jabatan: row.jabatan || '-',
            gaji_bulanan: 'Rp 3.000.000 - Rp 5.000.000',
            waktu_tunggu_bulan: 3,
            relevansi_kurikulum: 'Relevan'
          });
          successCount++;
        } catch (err) {
          console.error(err);
          errorCount++;
        }
      }

      showToast(`Impor CSV Selesai! Berhasil mengimpor ${successCount} alumni.${errorCount > 0 ? ` Gagal: ${errorCount} baris.` : ''}`);
      e.target.value = '';
    };

    reader.readAsText(file);
  };

  const handlePrintEvaluationReport = () => {
    if (!currentMitra) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Popup blocker mencegah pencetakan. Silakan izinkan popup untuk situs ini.', 'error');
      return;
    }

    const doc = printWindow.document;
    doc.write(`
      <html>
        <head>
          <title>Laporan Evaluasi Kinerja Alumni - ${currentMitra.nama_rs}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; }
            h1 { font-size: 18px; font-weight: bold; margin-bottom: 5px; color: #0f172a; }
            h2 { font-size: 13px; font-weight: normal; margin-top: 0; color: #64748b; margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { padding: 10px; text-align: left; font-size: 11px; border-bottom: 1px solid #cbd5e1; }
            th { background-color: #f1f5f9; font-weight: bold; color: #334155; }
            .score { font-weight: bold; color: #0d9488; }
            .aspect-col { font-size: 10px; color: #64748b; }
            .footer { margin-top: 50px; font-size: 11px; text-align: right; color: #64748b; }
            .signature { margin-top: 80px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>LAPORAN EVALUASI KINERJA ALUMNI POLTEKKES</h1>
          <h2>Instansi/Mitra: ${currentMitra.nama_rs} | Kab: ${currentMitra.kabupaten}</h2>
          <table>
            <thead>
              <tr>
                <th>Nama Alumni</th>
                <th>NIM</th>
                <th>Jabatan</th>
                <th>Rata-rata Skor</th>
                <th>Aspek Penilaian (Etika, Skill, Ingg, Tek, Kom, Tim, Diri)</th>
                <th>Saran Kurikulum</th>
              </tr>
            </thead>
            <tbody>
              \${employedAlumni.map(a => {
                const rev = feedback.find(f => f.nama_mitra === currentMitra.nama_rs && f.alumni_nama === a.nama);
                if (!rev) {
                  return \`
                    <tr>
                      <td>\${a.nama}</td>
                      <td>\${a.nim}</td>
                      <td>\${a.jabatan}</td>
                      <td colspan="3" style="color: #94a3b8; font-style: italic;">Belum dievaluasi</td>
                    </tr>
                  \`;
                }
                const avg = ((
                  rev.etika_nilai +
                  rev.keahlian_nilai +
                  rev.bahasa_inggris_nilai +
                  rev.teknologi_nilai +
                  rev.komunikasi_nilai +
                  rev.kerjasama_nilai +
                  rev.pengembangan_diri_nilai
                ) / 7).toFixed(1);
                return \`
                  <tr>
                    <td style="font-weight: bold;">\${a.nama}</td>
                    <td>\${a.nim}</td>
                    <td>\${a.jabatan}</td>
                    <td class="score">\${avg} / 5.0</td>
                    <td class="aspect-col">
                      E:\${rev.etika_nilai} | S:\${rev.keahlian_nilai} | I:\${rev.bahasa_inggris_nilai} | 
                      T:\${rev.teknologi_nilai} | K:\${rev.komunikasi_nilai} | M:\${rev.kerjasama_nilai} | D:\${rev.pengembangan_diri_nilai}
                    </td>
                    <td style="font-style: italic;">"\${rev.masukan_kurikulum}"</td>
                  </tr>
                \`;
              }).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Dicetak otomatis pada tanggal: \${new Date().toLocaleDateString('id-ID')}</p>
            <div class="signature">
              <p>Pimpinan Instansi / Mitra</p>
              <br><br><br>
              <p>_______________________</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  if (!currentMitra) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <XCircle className="text-rose-500 mb-4" size={48} />
        <h2 className="text-xl font-bold">Mitra tidak ditemukan</h2>
        <button onClick={onLogout} className="btn btn-primary mt-4">Kembali</button>
      </div>
    );
  }

  // Filter alumni that work at this hospital (matching nama_institusi) and search/filter criteria
  const employedAlumni = alumni.filter(a => {
    const matchesHospital = a.nama_institusi === currentMitra.nama_rs;
    const matchesSearch = 
      a.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.nim.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear ? a.tahun_lulus.toString() === filterYear : true;
    return matchesHospital && matchesSearch && matchesYear;
  });

  const totalPages = Math.ceil(employedAlumni.length / 50);
  const paginatedAlumni = employedAlumni.slice((currentPage - 1) * 50, currentPage * 50);
  
  // Filter feedback submitted by this hospital
  const myFeedbackList = feedback.filter(f => f.nama_mitra === currentMitra.nama_rs);

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

  const getMouHistoryList = () => {
    if (currentMitra.mou_history && currentMitra.mou_history.length > 0) {
      return [...currentMitra.mou_history].sort((a, b) => new Date(b.tanggal_berakhir).getTime() - new Date(a.tanggal_berakhir).getTime());
    }
    if (currentMitra.nomor_kerjasama && currentMitra.nomor_kerjasama !== '-') {
      return [{
        nomor_kerjasama: currentMitra.nomor_kerjasama,
        tanggal_mulai: currentMitra.tanggal_mulai,
        tanggal_berakhir: currentMitra.tanggal_berakhir,
        file_url: currentMitra.file_url,
        ruang_lingkup: currentMitra.ruang_lingkup,
        created_at: currentMitra.created_at
      }];
    }
    return [];
  };

  const mouHistoryList = getMouHistoryList();

  // Look up performance review for a specific alumni
  const getAlumniPerformanceReview = (nama: string) => {
    return feedback.find(f => f.nama_mitra === currentMitra.nama_rs && f.alumni_nama === nama);
  };

  // Get average rating for an alumni
  const getAverageScore = (rev: PenggunaLulusan) => {
    return (
      rev.etika_nilai +
      rev.keahlian_nilai +
      rev.bahasa_inggris_nilai +
      rev.teknologi_nilai +
      rev.komunikasi_nilai +
      rev.kerjasama_nilai +
      rev.pengembangan_diri_nilai
    ) / 7;
  };

  // Recommendation engine based on ALL feedbacks
  const getCurriculumRecommendations = () => {
    if (feedback.length === 0) return [];
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
      { name: 'Etika & Moral', val: etika / len, action: 'Mempertahankan mata kuliah pembentukan karakter, kepemimpinan klinis, dan kode etik keperawatan.' },
      { name: 'Keahlian Klinis Utama', val: keahlian / len, action: 'Meningkatkan alokasi waktu praktek laboratorium klinik (OSCE) dan simulasi kasus kritis gawat darurat.' },
      { name: 'Bahasa Inggris', val: inggris / len, action: 'Menyediakan kelas peminatan TOEFL, kursus bahasa Inggris khusus keperawatan (English for Nursing), atau modul bilingual.' },
      { name: 'Penggunaan Teknologi', val: teknologi / len, action: 'Mengintegrasikan pelatihan Sistem Informasi Instansi / Mitra (SIRS) dan Rekam Medis Elektronik (RME) ke dalam kurikulum.' },
      { name: 'Kemampuan Komunikasi', val: komunikasi / len, action: 'Menyelenggarakan workshop komunikasi terapeutik interprofesi dan simulasi operan pasien (SBAR).' },
      { name: 'Kerjasama Tim', val: kerjasama / len, action: 'Memperbanyak penugasan berbasis kelompok multi-disiplin untuk mensimulasikan lingkungan klinis.' },
      { name: 'Pengembangan Diri', val: pengembangan / len, action: 'Membimbing mahasiswa menyusun portofolio karir, seminar motivasi berprestasi, dan mendorong partisipasi riset.' }
    ];
    return [...scores].sort((a, b) => a.val - b.val).slice(0, 3);
  };

  const currentRecs = getCurriculumRecommendations();

  // Handle direct general feedback
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNamaPenilai || !formJabatanPenilai || !formMasukan) {
      showToast('Mohon lengkapi data penilai dan masukan kurikulum.', 'error');
      return;
    }
    setIsFeedbackSubmitting(true);
    try {
      await onAddFeedback({
        nama_mitra: currentMitra.nama_rs,
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
      setFeedbackSuccess(true);
      setFormNamaPenilai('');
      setFormJabatanPenilai('');
      setFormEtika(5);
      setFormKeahlian(5);
      setFormInggris(5);
      setFormTeknologi(5);
      setFormKomunikasi(5);
      setFormKerjasama(5);
      setFormPengembangan(5);
      setFormMasukan('');
      showToast('Feedback kepuasan & rekomendasi kurikulum Anda berhasil dikirim!');
      setTimeout(() => setFeedbackSuccess(false), 3000);
    } catch (e) {
      showToast('Gagal mengirim penilaian.', 'error');
    } finally {
      setIsFeedbackSubmitting(false);
    }
  };

  // Handle new alumni entry (Only profile info)
  const handleAlumniRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumniNama || !alumniNim || !alumniJabatan) {
      showToast('Mohon lengkapi seluruh kolom profil alumni.', 'error');
      return;
    }
    setIsAlumniSubmitting(true);
    try {
      await onAddAlumni({
        nama: alumniNama,
        nim: alumniNim,
        tahun_lulus: Number(alumniTahunLulus),
        no_hp: '-',
        email: '-',
        status_kerja: 'Bekerja',
        nama_institusi: currentMitra.nama_rs,
        wilayah_kerja: currentMitra.kabupaten,
        jabatan: alumniJabatan,
        gaji_bulanan: 'Rp 3.000.000 - Rp 5.000.000',
        waktu_tunggu_bulan: 3,
        relevansi_kurikulum: 'Relevan'
      });

      // Reset modal fields
      setAlumniNama('');
      setAlumniNim('');
      setAlumniJabatan('');
      setIsAlumniModalOpen(false);
      showToast('Alumni berhasil didaftarkan! Silakan klik tombol "Beri Penilaian" pada daftarnya.');
    } catch (e) {
      showToast('Gagal menyimpan pendaftaran alumni.', 'error');
    } finally {
      setIsAlumniSubmitting(false);
    }
  };

  // Open the evaluation modal and prefill if existing
  const openEvalModal = (a: Alumni) => {
    const existing = getAlumniPerformanceReview(a.nama);
    setSelectedAlumniForEval(a);
    if (existing) {
      setAlumniPenilaiNama(existing.nama_penilai);
      setAlumniPenilaiJabatan(existing.jabatan_penilai);
      setAlumniEtika(existing.etika_nilai);
      setAlumniKeahlian(existing.keahlian_nilai);
      setAlumniInggris(existing.bahasa_inggris_nilai);
      setAlumniTeknologi(existing.teknologi_nilai);
      setAlumniKomunikasi(existing.komunikasi_nilai);
      setAlumniKerjasama(existing.kerjasama_nilai);
      setAlumniPengembangan(existing.pengembangan_diri_nilai);
      setAlumniSaran(existing.masukan_kurikulum);
    } else {
      setAlumniPenilaiNama('');
      setAlumniPenilaiJabatan('');
      setAlumniEtika(5);
      setAlumniKeahlian(5);
      setAlumniInggris(5);
      setAlumniTeknologi(5);
      setAlumniKomunikasi(5);
      setAlumniKerjasama(5);
      setAlumniPengembangan(5);
      setAlumniSaran('');
    }
    setIsEvalModalOpen(true);
  };

  // Handle saving or editing the performance evaluation
  const handleAlumniEvalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlumniForEval) return;
    if (!alumniPenilaiNama || !alumniPenilaiJabatan || !alumniSaran) {
      showToast('Mohon isi nama penilai, jabatan, dan saran penguatan kurikulum.', 'error');
      return;
    }
    setIsEvalSubmitting(true);
    try {
      const existing = getAlumniPerformanceReview(selectedAlumniForEval.nama);
      if (existing) {
        // Edit / Update existing feedback
        await onUpdateFeedback({
          ...existing,
          nama_penilai: alumniPenilaiNama,
          jabatan_penilai: alumniPenilaiJabatan,
          etika_nilai: alumniEtika,
          keahlian_nilai: alumniKeahlian,
          bahasa_inggris_nilai: alumniInggris,
          teknologi_nilai: alumniTeknologi,
          komunikasi_nilai: alumniKomunikasi,
          kerjasama_nilai: alumniKerjasama,
          pengembangan_diri_nilai: alumniPengembangan,
          masukan_kurikulum: alumniSaran
        });
        showToast('Penilaian kinerja alumni berhasil diperbaharui!');
      } else {
        // Add new feedback
        await onAddFeedback({
          nama_mitra: currentMitra.nama_rs,
          alumni_nama: selectedAlumniForEval.nama,
          nama_penilai: alumniPenilaiNama,
          jabatan_penilai: alumniPenilaiJabatan,
          etika_nilai: alumniEtika,
          keahlian_nilai: alumniKeahlian,
          bahasa_inggris_nilai: alumniInggris,
          teknologi_nilai: alumniTeknologi,
          komunikasi_nilai: alumniKomunikasi,
          kerjasama_nilai: alumniKerjasama,
          pengembangan_diri_nilai: alumniPengembangan,
          masukan_kurikulum: alumniSaran
        });
        showToast('Penilaian kinerja alumni berhasil disimpan!');
      }
      setIsEvalModalOpen(false);
      setSelectedAlumniForEval(null);
    } catch (e) {
      showToast('Gagal menyimpan penilaian kinerja.', 'error');
    } finally {
      setIsEvalSubmitting(false);
    }
  };

  const handleRenewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewNomor || !renewMulai || !renewBerakhir || !renewFileUrl) {
      showToast('Mohon isi nomor dokumen, tanggal, dan link dokumen MoU baru.', 'error');
      return;
    }
    setIsRenewSubmitting(true);
    try {
      const newEntry = {
        nomor_kerjasama: renewNomor,
        tanggal_mulai: renewMulai,
        tanggal_berakhir: renewBerakhir,
        file_url: renewFileUrl,
        ruang_lingkup: renewRuangLingkup,
        created_at: new Date().toISOString()
      };

      let updatedHistory = currentMitra.mou_history ? [...currentMitra.mou_history] : [];
      if (updatedHistory.length === 0 && currentMitra.nomor_kerjasama && currentMitra.nomor_kerjasama !== '-') {
        updatedHistory.push({
          nomor_kerjasama: currentMitra.nomor_kerjasama,
          tanggal_mulai: currentMitra.tanggal_mulai,
          tanggal_berakhir: currentMitra.tanggal_berakhir,
          file_url: currentMitra.file_url,
          ruang_lingkup: currentMitra.ruang_lingkup,
          created_at: currentMitra.created_at
        });
      }

      const exists = updatedHistory.some(h => h.nomor_kerjasama === renewNomor);
      if (!exists) {
        updatedHistory.push(newEntry);
      }

      await onUpdateMitra({
        ...currentMitra,
        nomor_kerjasama: renewNomor,
        tanggal_mulai: renewMulai,
        tanggal_berakhir: renewBerakhir,
        file_url: renewFileUrl,
        ruang_lingkup: renewRuangLingkup,
        status: 'Aktif',
        mou_history: updatedHistory
      });
      setRenewSuccess(true);
      showToast('Pembaruan dokumen MoU kerjasama berhasil disimpan!');
      setTimeout(() => setRenewSuccess(false), 3000);
    } catch (e) {
      showToast('Gagal memperbaharui kerjasama.', 'error');
    } finally {
      setIsRenewSubmitting(false);
    }
  };



  // Navigation Items for Sidebar menu
  const menuItems = [
    { id: 'beranda', label: 'Dashboard & Ringkasan', icon: Home },
    { id: 'mou', label: 'Dokumen MoU Kerjasama', icon: FileText },
    { id: 'alumni', label: 'Alumni & Penilaian Kinerja', icon: GraduationCap },
    { id: 'feedback', label: 'Feedback Kurikulum (Umum)', icon: MessageSquarePlus },
    { id: 'panduan', label: 'Panduan Mitra', icon: BookOpen },
    { id: 'about', label: 'Tentang Aplikasi', icon: Info },
  ] as const;

  return (
    <div className="app-container">
      
      {/* Premium Custom Toast/Popup Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-slide-up">
          <div className={`glass p-4 rounded-2xl shadow-2xl border flex items-center gap-3 min-w-[320px] max-w-[420px] transition-all duration-300 ${
            toast.type === 'success' 
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' 
              : toast.type === 'error'
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200'
                : 'border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-200'
          }`} style={{ backdropFilter: 'blur(20px)' }}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              toast.type === 'success' 
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                : toast.type === 'error'
                  ? 'bg-rose-500/20 text-rose-500'
                  : 'bg-blue-500/20 text-blue-500'
            }`}>
              {toast.type === 'success' && <CheckCircle2 size={16} />}
              {toast.type === 'error' && <XCircle size={16} />}
              {toast.type === 'info' && <AlertTriangle size={16} />}
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-black uppercase tracking-wider block opacity-70">
                {toast.type === 'success' ? 'Sukses' : toast.type === 'error' ? 'Kesalahan' : 'Pemberitahuan'}
              </span>
              <p className="text-xs font-bold leading-tight">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-muted transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR FOR MITRA ROLE */}
      <aside className={`sidebar glass ${isMobileMenuOpen ? 'sidebar-mobile-open' : 'sidebar-desktop'}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">🏥</div>
          <div>
            <h1 className="sidebar-title">Portal RS Mitra</h1>
            <span className="sidebar-subtitle">Poltekkes Waikabubak</span>
          </div>
          {isMobileMenuOpen && (
            <button className="sidebar-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={16} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => {
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
          {/* Active Mitra Name badge in sidebar */}
          <div className="p-3 bg-slate-100/50 dark:bg-slate-900/50 border border-color rounded-xl space-y-1 mb-3">
            <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">Instansi / Mitra:</span>
            <span className="text-xs font-black text-slate-800 dark:text-white block truncate" title={currentMitra.nama_rs}>
              {currentMitra.nama_rs}
            </span>
            <span className="text-[10px] text-teal-500 font-semibold block">Kab. {currentMitra.kabupaten}</span>
          </div>

          <button className="sidebar-logout-btn" onClick={onLogout}>
            <LogOut size={13} /> Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="main-content flex flex-col min-h-screen">
        
        {/* HEADER */}
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
                {menuItems.find(m => m.id === activeTab)?.label}
              </h2>
              <p className="admin-header-sub">Portal RS Mitra • Poltekkes Kemenkes Kupang Waikabubak</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`badge ${
              currentMitra.status === 'Aktif' 
                ? 'badge-success' 
                : currentMitra.status === 'Perpanjangan' 
                  ? 'badge-warning' 
                  : 'badge-danger'
            } text-[10px] font-bold py-1.5 px-3`}>
              {currentMitra.status === 'Aktif' ? <CheckCircle2 size={12} /> : currentMitra.status === 'Perpanjangan' ? <AlertTriangle size={12} /> : <XCircle size={12} />}
              Masa MoU: {currentMitra.status}
            </span>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <div className="flex-1 p-6 space-y-6">

          {/* VIEW 1: OVERVIEW & BERANDA */}
          {activeTab === 'beranda' && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="glass p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">
                    Dasbor Mitra Kerja Sama
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Selamat Datang di Portal Tracer Study</h2>
                  <p className="text-xs text-muted">Terima kasih atas peran aktif dalam mengawal mutu pendidikan keperawatan dan kebidanan di Pulau Sumba.</p>
                </div>
              </div>

              {/* Alert Peringatan Dini MoU Mandiri */}
              {(() => {
                if (!currentMitra.tanggal_berakhir) return null;
                const expDate = new Date(currentMitra.tanggal_berakhir);
                const today = new Date();
                const diffTime = expDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 90) {
                  return (
                    <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex gap-3">
                        <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={24} />
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-450">⚠️ Peringatan Masa Berlaku MoU</h4>
                          <p className="text-[11px] font-semibold mt-1">
                            {diffDays < 0 
                              ? `Dokumen MoU kerja sama Anda telah kedaluwarsa sejak tanggal ${currentMitra.tanggal_berakhir}.` 
                              : `Dokumen MoU kerja sama Anda akan berakhir dalam ${diffDays} hari (${currentMitra.tanggal_berakhir}).`}
                          </p>
                          <span className="text-[10px] opacity-75 block mt-0.5">Segera ajukan pembaharuan dokumen agar proses registrasi mahasiswa & kerjasama tetap berjalan lancar.</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('mou')}
                        className="btn btn-xs btn-primary bg-rose-600 border-none hover:bg-rose-700 text-white font-extrabold rounded-lg py-2 px-4 shrink-0 shadow-sm"
                      >
                        Perbaharui MoU Sekarang
                      </button>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Stats metric grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* MoU info */}
                <div 
                  className="glass p-5 rounded-2xl border-l-4 flex items-center justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.02) 100%)',
                    borderColor: 'rgba(16, 185, 129, 0.15)',
                    borderLeftColor: '#10b981',
                    borderLeftWidth: '5px'
                  }}
                >
                  <div className="space-y-2">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold block uppercase tracking-wider">Status MoU</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white block">{currentMitra.nomor_kerjasama}</span>
                    <span className="text-[10px] text-muted block font-medium">Berakhir: <span className="font-bold">{currentMitra.tanggal_berakhir || '-'}</span></span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                    <Building2 size={20} />
                  </div>
                </div>

                {/* Total Alumni */}
                <div 
                  className="glass p-5 rounded-2xl border-l-4 flex items-center justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 185, 173, 0.1) 0%, rgba(0, 185, 173, 0.1) 100%)',
                    borderColor: 'rgba(0, 185, 173, 0.1)',
                    borderLeftColor: '#6366f1',
                    borderLeftWidth: '5px'
                  }}
                >
                  <div className="space-y-2">
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold block uppercase tracking-wider">Alumni Bekerja</span>
                    <span className="text-2xl font-black text-teal-600 dark:text-teal-400 block">{employedAlumni.length} orang</span>
                    <span className="text-[10px] text-muted block font-medium">Telah didaftarkan oleh RS Anda</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm">
                    <UserCheck size={20} />
                  </div>
                </div>

                {/* Feedbacks count */}
                <div 
                  className="glass p-5 rounded-2xl border-l-4 flex items-center justify-between transition-all duration-200 hover:-translate-y-1 shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.02) 100%)',
                    borderColor: 'rgba(168, 85, 247, 0.15)',
                    borderLeftColor: '#a855f7',
                    borderLeftWidth: '5px'
                  }}
                >
                  <div className="space-y-2">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold block uppercase tracking-wider">Umpan Balik Terkirim</span>
                    <span className="text-2xl font-black text-purple-600 dark:text-purple-400 block">{myFeedbackList.length} kali</span>
                    <span className="text-[10px] text-muted block font-medium">Penilaian kinerja & masukan prodi</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
                    <Award size={20} />
                  </div>
                </div>
              </div>

              {/* Recommendation engine widget */}
              <div className="glass p-6 rounded-2xl space-y-4">
                <div>
                  <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
                    Curriculum Recommendation Engine
                  </span>
                  <h3 className="text-sm font-black mt-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                    <BookOpen size={16} className="text-blue-500" />
                    Rekomendasi Penguatan Kurikulum Poltekkes
                  </h3>
                  <p className="text-xs text-muted">Saran perbaikan kurikulum yang dihitung otomatis berdasarkan umpan balik seluruh pengguna lulusan.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {currentRecs.length > 0 ? currentRecs.map((rec, i) => {
                    const colors = [
                      { bg: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%)', border: '#ef4444', text: 'text-rose-600 dark:text-rose-400', badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
                      { bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%)', border: '#f59e0b', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
                      { bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)', border: '#3b82f6', text: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
                    ][i] || { bg: 'var(--bg-card)', border: 'var(--border-color)', text: 'text-slate-600', badge: 'bg-slate-500/10 text-slate-600' };

                    return (
                      <div 
                        key={i} 
                        className="p-4 rounded-2xl border flex gap-3.5 items-start transition-all duration-200 hover:shadow-sm"
                        style={{
                          background: colors.bg,
                          borderColor: 'rgba(0,0,0,0.05)',
                          borderLeft: `5px solid ${colors.border}`
                        }}
                      >
                        <span className="text-xl">
                          {i === 0 ? '🚨' : i === 1 ? '⚠️' : '💡'}
                        </span>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">{rec.name}</h4>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                              Skor: {rec.val.toFixed(2)}/5
                            </span>
                          </div>
                          <p className="text-[11px] text-muted leading-relaxed font-medium">{rec.action}</p>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-xs text-center italic py-8 text-muted bg-slate-50 dark:bg-slate-900 rounded-xl">
                      Belum ada data feedback terkumpul untuk menghitung rekomendasi kurikulum.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: DOKUMEN MOU KERJASAMA */}
          {activeTab === 'mou' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left card: History list of MoUs */}
              <div className="glass p-6 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
                    <Building2 className="text-emerald-500" size={18} />
                    Riwayat Dokumen MoU Kemitraan RS Anda
                  </h3>
                  <p className="text-xs text-muted">Daftar lengkap berkas kerjasama MoU dari awal hingga terakhir dengan status masa berlaku.</p>
                </div>

                <div className="space-y-3.5 pt-2 max-h-[500px] overflow-y-auto pr-1">
                  {mouHistoryList.length > 0 ? (
                    mouHistoryList.map((hist, index) => {
                      const hStatus = getMouStatus(hist.tanggal_berakhir);
                      return (
                        <div 
                          key={index} 
                          className="bg-slate-100/50 dark:bg-slate-900/40 p-4 rounded-xl border border-color space-y-3 relative overflow-hidden group hover:border-teal-500/20 transition-all duration-200"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1">
                              <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">Nomor MoU / PKS:</span>
                              <code className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[220px]" title={hist.nomor_kerjasama}>
                                {hist.nomor_kerjasama}
                              </code>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${hStatus.class}`}>
                              {hStatus.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-muted block text-[9px] uppercase tracking-wide font-bold">Tanggal Mulai:</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{hist.tanggal_mulai || '-'}</span>
                            </div>
                            <div>
                              <span className="text-muted block text-[9px] uppercase tracking-wide font-bold">Tanggal Berakhir:</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{hist.tanggal_berakhir || '-'}</span>
                            </div>
                          </div>

                          {hist.ruang_lingkup && (
                            <div className="text-xs space-y-0.5">
                              <span className="text-[9px] text-muted font-bold block uppercase tracking-wide">Cakupan / Ruang Lingkup:</span>
                              <p className="text-muted leading-relaxed text-[11px]">
                                {hist.ruang_lingkup}
                              </p>
                            </div>
                          )}

                          {hist.file_url && hist.file_url !== '#' ? (
                            <a 
                              href={hist.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-outline py-1.5 px-3 text-[10px] flex items-center justify-center gap-1.5 text-teal-600 border-teal-500/20 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/20 w-fit"
                            >
                              <Download size={12} />
                              Lihat Dokumen PDF
                            </a>
                          ) : (
                            <span className="text-[10px] text-muted italic block">Berkas tidak diunggah</span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-center italic py-8 text-muted bg-slate-50 dark:bg-slate-900 rounded-xl">
                      Belum ada riwayat dokumen MoU yang tersimpan.
                    </div>
                  )}
                </div>
              </div>

              {/* Right card: Renew MoU Form */}
              <div className="glass p-6 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
                    <FileText size={18} className="text-emerald-500" />
                    Perbaharui Dokumen Kerjasama RS Anda
                  </h3>
                  <p className="text-xs text-muted">Ajukan nomor kerjasama baru dan tautkan link PDF MoU yang telah diperbaharui.</p>
                </div>

                <form onSubmit={handleRenewSubmit} className="space-y-4 pt-2">
                  <div className="form-group">
                    <label className="form-label text-xs">Nomor Dokumen MoU/PKS Baru</label>
                    <input 
                      type="text" 
                      className="form-control text-xs py-2 rounded-xl" 
                      placeholder="Contoh: 120/PKS/RSKL/XI/2026"
                      value={renewNomor}
                      onChange={e => setRenewNomor(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label text-xs">Tanggal Mulai Berlaku</label>
                      <input 
                        type="date" 
                        className="form-control text-xs py-2 rounded-xl" 
                        value={renewMulai}
                        onChange={e => setRenewMulai(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-xs">Tanggal Berakhir</label>
                      <input 
                        type="date" 
                        className="form-control text-xs py-2 rounded-xl" 
                        value={renewBerakhir}
                        onChange={e => setRenewBerakhir(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-xs">Link Dokumen Baru (Google Drive / URL PDF)</label>
                    <input 
                      type="url" 
                      className="form-control text-xs py-2 rounded-xl" 
                      placeholder="Masukkan link dokumen lengkap diawali https://"
                      value={renewFileUrl}
                      onChange={e => setRenewFileUrl(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label text-xs">Cakupan / Ruang Lingkup Baru</label>
                    <textarea 
                      className="form-control text-xs p-3 rounded-xl" 
                      rows={2}
                      placeholder="Tuliskan jika terdapat perubahan ruang lingkup..."
                      value={renewRuangLingkup}
                      onChange={e => setRenewRuangLingkup(e.target.value)}
                    />
                  </div>

                  {renewSuccess && (
                    <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-lg flex items-center gap-2">
                      <CheckCircle2 size={14} />
                      Dokumen MoU berhasil diperbaharui!
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-1.5 rounded-xl"
                    disabled={isRenewSubmitting}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff' }}
                  >
                    <Send size={14} />
                    {isRenewSubmitting ? 'Memperbaharui...' : 'Simpan Pembaharuan MoU'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* VIEW 3: ALUMNI & PENILAIAN */}
          {activeTab === 'alumni' && (
            <div className="glass p-6 rounded-2xl space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4 border-bottom pb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
                    <GraduationCap size={18} className="text-teal-500" />
                    Registrasi & Kinerja Alumni Poltekkes Kupang
                  </h3>
                  <p className="text-xs text-muted">Daftar alumni yang bekerja di instansi / mitra ini beserta riwayat penilaian kinerjanya.</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={downloadAlumniCSVTemplate}
                    className="btn btn-outline text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 border-color hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350"
                  >
                    📥 Template CSV
                  </button>
                  <label className="btn btn-outline text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 border-color hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 cursor-pointer">
                    📤 Impor CSV
                    <input 
                      type="file" 
                      accept=".csv" 
                      className="hidden" 
                      onChange={handleAlumniCSVImport} 
                    />
                  </label>
                  <button 
                    onClick={handlePrintEvaluationReport}
                    className="btn btn-outline text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 border-color hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350"
                  >
                    🖨️ Cetak Evaluasi
                  </button>
                  
                  {/* Button to open Modal for registering alumni */}
                  <button 
                    onClick={() => {
                      setAlumniNama('');
                      setAlumniNim('');
                      setAlumniJabatan('');
                      setIsAlumniModalOpen(true);
                    }}
                    className="btn btn-primary text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none' }}
                  >
                    <Plus size={14} />
                    Daftarkan Alumni Baru
                  </button>
                </div>
              </div>

              {/* Search & Filter Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-100/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-color">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    className="form-control text-xs py-2 px-3.5 rounded-xl w-full"
                    placeholder="🔍 Cari nama alumni atau NIM..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="form-control text-xs py-2 px-3 rounded-xl w-full"
                    value={filterYear}
                    onChange={e => setFilterYear(e.target.value)}
                  >
                    <option value="">Semua Tahun Lulus</option>
                    {Array.from(new Set(alumni.filter(a => a.nama_institusi === currentMitra.nama_rs).map(a => a.tahun_lulus)))
                      .sort((a, b) => b - a)
                      .map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))
                    }
                  </select>
                  {(searchTerm || filterYear) && (
                    <button 
                      onClick={() => { setSearchTerm(''); setFilterYear(''); }}
                      className="btn btn-outline text-xs px-3 rounded-xl border-color text-muted font-bold hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {paginatedAlumni.length > 0 ? (
                  paginatedAlumni.map((a) => {
                    const review = getAlumniPerformanceReview(a.nama);
                    const isExpanded = expandedAlumniId === a.id;
                    
                    return (
                      <div 
                        key={a.id} 
                        className="bg-slate-100/40 dark:bg-slate-900/30 rounded-2xl border border-color overflow-hidden transition-all duration-200"
                      >
                        {/* Header Row */}
                        <div 
                          className="p-4 flex flex-wrap justify-between items-center gap-4 cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-900/50"
                          onClick={() => setExpandedAlumniId(isExpanded ? null : a.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold text-sm">
                              {a.nama.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-xs text-slate-800 dark:text-white">{a.nama}</h4>
                              <p className="text-[10px] text-muted">NIM: {a.nim} • Lulusan {a.tahun_lulus} • Jabatan: {a.jabatan}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {review ? (
                              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 p-1 px-2.5 rounded-full text-[10px] font-bold">
                                <span>⭐ {getAverageScore(review).toFixed(1)} / 5</span>
                                <span className="text-muted text-[9px] font-normal">• Dinilai Atasan</span>
                              </div>
                            ) : (
                              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-muted p-1 px-2.5 rounded-full font-bold">
                                Belum Dinilai
                              </span>
                            )}
                            <span className="text-muted text-xs font-semibold">{isExpanded ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {/* Accordion Content */}
                        {isExpanded && (
                          <div className="p-4 border-t border-color bg-slate-50/50 dark:bg-slate-900/10 space-y-4 text-xs">
                            {review ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Skills breakdown */}
                                  <div className="space-y-2 bg-white dark:bg-slate-950 p-4 rounded-xl border border-color">
                                    <h5 className="font-bold text-slate-800 dark:text-white border-bottom pb-1.5 flex items-center gap-1.5 text-[11px]">
                                      📊 Detail Nilai Kompetensi Lulusan:
                                    </h5>
                                    <div className="space-y-2 pt-1 text-[11px]">
                                      {[
                                        { label: 'Etika & Moral', val: review.etika_nilai },
                                        { label: 'Keahlian Klinis Utama', val: review.keahlian_nilai },
                                        { label: 'Bahasa Inggris', val: review.bahasa_inggris_nilai },
                                        { label: 'Teknologi Informasi / EHR', val: review.teknologi_nilai },
                                        { label: 'Komunikasi Terapeutik', val: review.komunikasi_nilai },
                                        { label: 'Kerjasama Tim', val: review.kerjasama_nilai },
                                        { label: 'Pengembangan Diri', val: review.pengembangan_diri_nilai },
                                      ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                          <span className="text-muted">{item.label}</span>
                                          <span className="font-bold text-xs flex items-center gap-0.5">
                                            <span className="text-amber-500">{'★'.repeat(item.val)}</span>
                                            <span className="text-slate-300 dark:text-slate-700">{'☆'.repeat(5 - item.val)}</span>
                                            <span className="text-slate-500 dark:text-slate-400 font-medium text-[9px] ml-1">({item.val}/5)</span>
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Evaluator & curriculum suggestion details */}
                                  <div className="space-y-3 bg-white dark:bg-slate-950 p-4 rounded-xl border border-color flex flex-col justify-between">
                                    <div>
                                      <h5 className="font-bold text-slate-800 dark:text-white border-bottom pb-1.5 flex items-center gap-1.5 text-[11px]">
                                        📝 Masukan Penguatan Kurikulum dari Evaluasi Alumni ini:
                                      </h5>
                                      <p className="text-muted italic leading-relaxed pt-2">
                                        "{review.masukan_kurikulum}"
                                      </p>
                                    </div>
                                    
                                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-color text-[10px] mt-2">
                                      <span className="text-muted block">Penilai / Atasan langsung:</span>
                                      <span className="font-bold">{review.nama_penilai}</span>
                                      <span className="text-muted"> ({review.jabatan_penilai})</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-end">
                                  <button
                                    onClick={() => openEvalModal(a)}
                                    className="btn btn-xs btn-outline border-teal-500/20 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/20 font-bold rounded-lg py-1.5 px-4 flex items-center gap-1"
                                  >
                                    ✏️ Edit Penilaian Kinerja
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-6 bg-white dark:bg-slate-950 rounded-xl border border-color space-y-3">
                                <AlertTriangle className="text-amber-500 mx-auto" size={24} />
                                <div>
                                  <p className="font-bold text-xs text-slate-800 dark:text-white">Alumni ini belum memiliki penilaian kinerja.</p>
                                  <p className="text-muted text-[10px] max-w-sm mx-auto mt-0.5">Berikan evaluasi performa kerja alumni ini untuk mendukung perbaikan kurikulum prodi.</p>
                                </div>
                                <button
                                  onClick={() => openEvalModal(a)}
                                  className="btn btn-xs btn-primary bg-amber-500 border-none hover:bg-amber-600 text-white font-bold rounded-lg py-1.5 px-3"
                                >
                                  Beri Penilaian Kinerja Alumni
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-muted italic bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-color">
                    {searchTerm || filterYear ? 'Tidak ditemukan alumni yang cocok dengan pencarian / filter Anda.' : 'Belum ada data alumni terdaftar yang bekerja di instansi / mitra ini.'}
                  </div>
                )}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-between items-center p-4 border border-color rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 text-xs gap-3 mt-4">
                  <div className="text-muted font-semibold">
                    Menampilkan {paginatedAlumni.length} dari {employedAlumni.length} alumni (Halaman {currentPage} dari {totalPages})
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
            </div>
          )}

          {/* VIEW 4: FEEDBACK KURIKULUM UMUM */}
          {activeTab === 'feedback' && (
            <div className="glass p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wide flex items-center gap-2">
                  <MessageSquarePlus size={18} className="text-purple-500" />
                  Kirim Feedback Institusi (General)
                </h3>
                <p className="text-xs text-muted">Beri masukan penguatan kurikulum dari sudut pandang direksi/manajemen instansi / mitra secara umum.</p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label text-xs">Nama Lengkap Penilai</label>
                    <input 
                      type="text" 
                      className="form-control text-xs py-2 rounded-xl" 
                      placeholder="Nama & gelar penilai (misal: dr. Ani, M.Kes)"
                      value={formNamaPenilai}
                      onChange={e => setFormNamaPenilai(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-xs">Jabatan Penilai</label>
                    <input 
                      type="text" 
                      className="form-control text-xs py-2 rounded-xl" 
                      placeholder="Misal: Kepala Bidang Keperawatan / Direktur"
                      value={formJabatanPenilai}
                      onChange={e => setFormJabatanPenilai(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="form-label text-xs font-bold text-slate-700 dark:text-slate-200 block mb-2">
                    Beri Nilai Kepuasan untuk 7 Aspek Kompetensi Utama (Skor 1 - 5):
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Etika & Moral', val: formEtika, setVal: setFormEtika },
                      { label: 'Keahlian Klinis Utama', val: formKeahlian, setVal: setFormKeahlian },
                      { label: 'Bahasa Inggris', val: formInggris, setVal: setFormInggris },
                      { label: 'Penggunaan Teknologi', val: formTeknologi, setVal: setFormTeknologi },
                      { label: 'Kemampuan Komunikasi', val: formKomunikasi, setVal: setFormKomunikasi },
                      { label: 'Kerjasama Tim', val: formKerjasama, setVal: setFormKerjasama },
                      { label: 'Pengembangan Diri', val: formPengembangan, setVal: setFormPengembangan },
                    ].map((aspect, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-color flex flex-col justify-between gap-1.5 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 leading-tight">{aspect.label}</span>
                        <div className="flex gap-0.5 justify-end pt-1 border-t border-slate-100 dark:border-slate-800">
                          {[1, 2, 3, 4, 5].map(num => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => aspect.setVal(num)}
                              className={`p-0.5 rounded transition-all duration-150 ${aspect.val >= num ? 'text-amber-500 scale-110' : 'text-slate-300 dark:text-slate-700'}`}
                            >
                              <Star size={13} fill={aspect.val >= num ? 'currentColor' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Saran Masukan Penguatan Kurikulum Pembelajaran</label>
                  <textarea 
                    className="form-control text-xs p-3 rounded-xl" 
                    rows={3}
                    placeholder="Tuliskan saran perbaikan materi perkuliahan/praktek laboratorium yang perlu ditingkatkan..."
                    value={formMasukan}
                    onChange={e => setFormMasukan(e.target.value)}
                    required
                  />
                </div>

                {feedbackSuccess && (
                  <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-lg flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    Feedback & penilaian kurikulum Anda berhasil dikirim!
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-1.5 rounded-xl"
                  disabled={isFeedbackSubmitting}
                  style={{ background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)', border: 'none', color: '#fff' }}
                >
                  <Send size={14} />
                  {isFeedbackSubmitting ? 'Mengirim...' : 'Kirim Umpan Balik Penggunaan Lulusan'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'panduan' && (
            <PanduanPanel role="mitra" />
          )}

          {activeTab === 'about' && (
            <AboutPanel />
          )}

        </div>

        {/* FOOTER */}
        <footer className="glass border-t border-color py-6 text-center text-xs text-muted mt-auto">
          <p>© 2026 Tracer Study dan Kemitraan. Poltekkes Kemenkes Kupang Prodi D3 Keperawatan Waikabubak</p>
        </footer>
      </main>

      {/* MODAL 1: REGISTER NEW ALUMNI PROFILE ONLY */}
      {isAlumniModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass w-full max-w-md shadow-2xl rounded-2xl border border-color">
            {/* Header */}
            <div className="modal-header border-bottom pb-3">
              <h3 className="text-sm font-black flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-wider">
                <span>👤</span>
                Daftarkan Alumni Baru
              </h3>
              <button 
                onClick={() => setIsAlumniModalOpen(false)}
                className="p-1 rounded-full border border-color hover:bg-slate-200 dark:hover:bg-slate-800 text-muted"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAlumniRegisterSubmit} className="modal-body space-y-4 pt-4">
              <div className="form-group">
                <label className="form-label text-xs">Nama Lengkap Alumni</label>
                <input 
                  type="text" 
                  className="form-control text-xs py-2 rounded-xl" 
                  placeholder="Nama lengkap & gelar"
                  value={alumniNama}
                  onChange={e => setAlumniNama(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label text-xs">NIM (Nomor Induk Mahasiswa)</label>
                <input 
                  type="text" 
                  className="form-control text-xs py-2 rounded-xl font-mono" 
                  placeholder="Contoh: P07420121045"
                  value={alumniNim}
                  onChange={e => setAlumniNim(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label text-xs">Tahun Lulus</label>
                  <select 
                    className="form-control text-xs py-2 rounded-xl"
                    value={alumniTahunLulus}
                    onChange={e => setAlumniTahunLulus(e.target.value)}
                    required
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 8 + i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label text-xs">Jabatan / Posisi Kerja</label>
                  <input 
                    type="text" 
                    className="form-control text-xs py-2 rounded-xl" 
                    placeholder="Contoh: Perawat IGD / Bidan"
                    value={alumniJabatan}
                    onChange={e => setAlumniJabatan(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="modal-footer border-t pt-3 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsAlumniModalOpen(false)}
                  className="btn btn-outline text-xs rounded-xl py-2 px-4"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary text-xs rounded-xl py-2 px-6 flex items-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', color: '#fff' }}
                  disabled={isAlumniSubmitting}
                >
                  <CheckCircle2 size={14} />
                  {isAlumniSubmitting ? 'Mendaftarkan...' : 'Daftarkan Alumni'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GIVE OR EDIT PERFORMANCE EVALUATION */}
      {isEvalModalOpen && selectedAlumniForEval && (
        <div className="modal-overlay">
          <div className="modal-content glass w-full max-w-2xl shadow-2xl rounded-2xl border border-color">
            {/* Header */}
            <div className="modal-header border-bottom pb-3 flex flex-col items-start gap-2">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-sm font-black flex items-center gap-2 text-slate-800 dark:text-white uppercase tracking-wider">
                  <span>📋</span>
                  Penilaian Kinerja: {selectedAlumniForEval.nama}
                </h3>
                <button 
                  onClick={() => {
                    setIsEvalModalOpen(false);
                    setSelectedAlumniForEval(null);
                  }}
                  className="p-1 rounded-full border border-color hover:bg-slate-200 dark:hover:bg-slate-800 text-muted"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Progress kelengkapan */}
              <div className="space-y-1 w-full mt-1">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <span>Kelengkapan Evaluasi</span>
                  <span className={evalCompletionPercentage === 100 ? 'text-emerald-500 font-extrabold' : 'text-teal-500 font-extrabold'}>
                    {evalCompletionPercentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${evalCompletionPercentage}%`, 
                      background: evalCompletionPercentage === 100 
                        ? '#10b981' 
                        : 'linear-gradient(90deg, #00B9AD, #CDDC29)' 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAlumniEvalSubmit} className="modal-body space-y-4 pt-4 max-h-[75vh] overflow-y-auto">
              
              {/* Evaluator Section */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide">1. Informasi Atasan Penilai</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label text-xs">Nama Atasan Penilai</label>
                    <input 
                      type="text" 
                      className="form-control text-xs py-2 rounded-xl" 
                      placeholder="Nama lengkap & gelar atasan"
                      value={alumniPenilaiNama}
                      onChange={e => setAlumniPenilaiNama(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-xs">Jabatan Atasan Penilai</label>
                    <input 
                      type="text" 
                      className="form-control text-xs py-2 rounded-xl" 
                      placeholder="Misal: Kepala Ruangan / Kabid Keperawatan"
                      value={alumniPenilaiJabatan}
                      onChange={e => setAlumniPenilaiJabatan(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Evaluation Scores Section */}
              <div className="space-y-3 pt-3 border-t border-color">
                <h4 className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wide">2. Nilai Kompetensi Lulusan (Skor 1 - 5):</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Etika & Moral', val: alumniEtika, setVal: setAlumniEtika },
                    { label: 'Keahlian Klinis Keperawatan/Kebidanan', val: alumniKeahlian, setVal: setAlumniKeahlian },
                    { label: 'Kemampuan Bahasa Inggris', val: alumniInggris, setVal: setAlumniInggris },
                    { label: 'Penggunaan Teknologi / EHR', val: alumniTeknologi, setVal: setAlumniTeknologi },
                    { label: 'Komunikasi Terapeutik', val: alumniKomunikasi, setVal: setAlumniKomunikasi },
                    { label: 'Kerjasama Tim & Kolaborasi', val: alumniKerjasama, setVal: setAlumniKerjasama },
                    { label: 'Kemauan Pengembangan Diri', val: alumniPengembangan, setVal: setAlumniPengembangan },
                  ].map((aspect, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-2.5 px-3.5 rounded-xl border border-color flex justify-between items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 leading-tight">{aspect.label}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => aspect.setVal(num)}
                            className={`p-0.5 rounded transition-all duration-150 ${aspect.val >= num ? 'text-amber-500 scale-110' : 'text-slate-300 dark:text-slate-700'}`}
                          >
                            <Star size={13} fill={aspect.val >= num ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations Section */}
              <div className="space-y-3 pt-3 border-t border-color">
                <h4 className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">3. Umpan Balik Penguatan Kurikulum</h4>
                <div className="form-group">
                  <label className="form-label text-xs">Saran Masukan Berdasarkan Performa Kerja Alumni Ini</label>
                  <textarea 
                    className="form-control text-xs p-3 rounded-xl" 
                    rows={3}
                    placeholder="Masukkan materi perkuliahan/laboratorium/klinik spesifik yang perlu diperkuat..."
                    value={alumniSaran}
                    onChange={e => setAlumniSaran(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="modal-footer border-t pt-3 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEvalModalOpen(false);
                    setSelectedAlumniForEval(null);
                  }}
                  className="btn btn-outline text-xs rounded-xl py-2 px-4"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary text-xs rounded-xl py-2 px-6 flex items-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff' }}
                  disabled={isEvalSubmitting}
                >
                  <CheckCircle2 size={14} />
                  {isEvalSubmitting ? 'Menyimpan...' : 'Simpan Penilaian'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
