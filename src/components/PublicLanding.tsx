import React, { useState } from 'react';
import type { Alumni, MitraKerjasama, PenggunaLulusan, AlumniFeedback } from '../data/mockData';
import {
  GraduationCap, TrendingUp, Award, Star,
  Users, Building2, Info, X, ClipboardList, Lock, CheckCircle2
} from 'lucide-react';

interface PublicLandingProps {
  alumni: Alumni[];
  mitra: MitraKerjasama[];
  feedback: PenggunaLulusan[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onAdminLogin: () => void;
  onAddFeedback: (f: Omit<PenggunaLulusan, 'id' | 'created_at'>) => Promise<PenggunaLulusan>;
  onUpdateMitra: (m: MitraKerjasama) => Promise<MitraKerjasama>;
  onAddAlumniFeedback: (af: Omit<AlumniFeedback, 'id' | 'created_at'>) => Promise<AlumniFeedback>;
  onUpdateAlumni: (a: Alumni) => Promise<Alumni>;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({
  alumni, mitra, feedback, theme, toggleTheme, onAdminLogin, onAddFeedback, onUpdateMitra, onAddAlumniFeedback, onUpdateAlumni
}) => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isInformasiPublikOpen, setIsInformasiPublikOpen] = useState(false);
  const [publicTab, setPublicTab] = useState<'map' | 'laporan' | 'unduhan'>('map');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Alumni Feedback Modal States
  const [isAlumniFeedbackOpen, setIsAlumniFeedbackOpen] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState<1 | 2 | 3>(1);
  const [alumniSearchNim, setAlumniSearchNim] = useState('');
  const [foundAlumni, setFoundAlumni] = useState<Alumni | null>(null);
  const [nimSearchError, setNimSearchError] = useState(false);
  
  // Rating states for alumni
  const [formKualitasPembelajaran, setFormKualitasPembelajaran] = useState<number>(5);
  const [formFasilitasPembelajaran, setFormFasilitasPembelajaran] = useState<number>(5);
  const [formRelevansiKurikulum, setFormRelevansiKurikulum] = useState<number>(5);
  const [formLayananAkademik, setFormLayananAkademik] = useState<number>(5);
  const [formSaranProdi, setFormSaranProdi] = useState('');

  // Alumni Tracer Study Update states
  const [formTahunLulus, setFormTahunLulus] = useState<number>(2024);
  const [formNoHp, setFormNoHp] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatusKerja, setFormStatusKerja] = useState<'Bekerja' | 'Wirausaha' | 'Studi Lanjut' | 'Mencari Kerja'>('Bekerja');
  const [formRelevansi, setFormRelevansi] = useState<'Sangat Relevan' | 'Relevan' | 'Cukup Relevan' | 'Tidak Relevan'>('Relevan');
  const [formNamaInstitusi, setFormNamaInstitusi] = useState('');
  const [formJabatan, setFormJabatan] = useState('');
  const [formWilayahKerja, setFormWilayahKerja] = useState<string>('Sumba Timur');
  const [formWaktuTunggu, setFormWaktuTunggu] = useState<number>(3);
  const [formGajiBulanan, setFormGajiBulanan] = useState<'< Rp 3.000.000' | 'Rp 3.000.000 - Rp 5.000.000' | 'Rp 5.000.000 - Rp 7.500.000' | '> Rp 7.500.000'>('Rp 3.000.000 - Rp 5.000.000');
  const [formTahunLulusUkom, setFormTahunLulusUkom] = useState<string>('');

  const handleVerifyNim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumniSearchNim.trim()) return;

    const matched = alumni.find(
      a => a.nim.toLowerCase().trim() === alumniSearchNim.toLowerCase().trim()
    );

    if (matched) {
      setFoundAlumni(matched);
      setNimSearchError(false);
      
      // Prefill fields
      setFormTahunLulus(matched.tahun_lulus);
      setFormNoHp(matched.no_hp || '');
      setFormEmail(matched.email || '');
      setFormStatusKerja(matched.status_kerja || 'Bekerja');
      setFormRelevansi(matched.relevansi_kurikulum || 'Relevan');
      setFormNamaInstitusi(matched.nama_institusi || '');
      setFormJabatan(matched.jabatan || '');
      setFormWilayahKerja(matched.wilayah_kerja || 'Sumba Timur');
      setFormWaktuTunggu(matched.waktu_tunggu_bulan || 3);
      setFormGajiBulanan(matched.gaji_bulanan || 'Rp 3.000.000 - Rp 5.000.000');

      setFeedbackStep(2);
    } else {
      setFoundAlumni(null);
      setNimSearchError(true);
    }
  };

  const handleAlumniFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundAlumni) return;

    // 1. Update the Database Alumni Terintegrasi
    await onUpdateAlumni({
      ...foundAlumni,
      tahun_lulus: Number(formTahunLulus),
      no_hp: formNoHp,
      email: formEmail,
      status_kerja: formStatusKerja,
      relevansi_kurikulum: formRelevansi,
      nama_institusi: formNamaInstitusi,
      jabatan: formJabatan,
      wilayah_kerja: formWilayahKerja,
      waktu_tunggu_bulan: Number(formWaktuTunggu),
      gaji_bulanan: formGajiBulanan,
      tahun_lulus_ukom: formTahunLulusUkom ? formTahunLulusUkom : null
    });

    // 2. Add Alumni Feedback entry
    await onAddAlumniFeedback({
      alumni_id: foundAlumni.id,
      nim: foundAlumni.nim,
      nama: foundAlumni.nama,
      tahun_lulus: Number(formTahunLulus),
      kualitas_pembelajaran: formKualitasPembelajaran,
      fasilitas_pembelajaran: formFasilitasPembelajaran,
      relevansi_kurikulum: formRelevansiKurikulum,
      layanan_akademik: formLayananAkademik,
      saran_prodi: formSaranProdi
    });

    setFeedbackStep(3);
    
    // Reset Form after a short delay
    setTimeout(() => {
      setIsAlumniFeedbackOpen(false);
      setFeedbackStep(1);
      setAlumniSearchNim('');
      setFoundAlumni(null);
      setNimSearchError(false);
      setFormKualitasPembelajaran(5);
      setFormFasilitasPembelajaran(5);
      setFormRelevansiKurikulum(5);
      setFormLayananAkademik(5);
      setFormSaranProdi('');
      setFormTahunLulusUkom('');
      
      // Show general success toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 2000);
  };

  // Form State
  const [formNamaMitra, setFormNamaMitra] = useState('');
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

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNamaMitra || !formNamaPenilai || !formJabatanPenilai) {
      alert('Nama Mitra, Penilai, dan Jabatan wajib diisi!');
      return;
    }

    await onAddFeedback({
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

    // Reset Form
    setFormNamaMitra('');
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

    setIsFeedbackModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  // Renewal Form State
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewHospitalId, setRenewHospitalId] = useState('');
  const [renewNomorKerjasama, setRenewNomorKerjasama] = useState('');
  const [renewTanggalMulai, setRenewTanggalMulai] = useState('');
  const [renewTanggalBerakhir, setRenewTanggalBerakhir] = useState('');
  const [renewFileUrl, setRenewFileUrl] = useState('');
  const [renewRuangLingkup, setRenewRuangLingkup] = useState('');
  const [renewStatus, setRenewStatus] = useState<'Aktif' | 'Perpanjangan' | 'Non-Aktif'>('Aktif');

  // Prefill details when hospital is selected
  const handleRenewHospitalChange = (hospitalId: string) => {
    setRenewHospitalId(hospitalId);
    const selected = mitra.find(m => m.id === hospitalId);
    if (selected) {
      setRenewNomorKerjasama(selected.nomor_kerjasama);
      setRenewTanggalMulai(selected.tanggal_mulai);
      setRenewTanggalBerakhir(selected.tanggal_berakhir);
      setRenewFileUrl(selected.file_url || '');
      setRenewRuangLingkup(selected.ruang_lingkup || '');
      setRenewStatus(selected.status);
    }
  };

  const handleRenewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewHospitalId || !renewNomorKerjasama || !renewTanggalMulai || !renewTanggalBerakhir) {
      alert('Mohon pilih instansi / mitra dan isi semua field wajib.');
      return;
    }
    const selected = mitra.find(m => m.id === renewHospitalId);
    if (!selected) return;

    await onUpdateMitra({
      ...selected,
      nomor_kerjasama: renewNomorKerjasama,
      tanggal_mulai: renewTanggalMulai,
      tanggal_berakhir: renewTanggalBerakhir,
      file_url: renewFileUrl || '#',
      ruang_lingkup: renewRuangLingkup,
      status: renewStatus
    });

    // Reset Form
    setIsRenewModalOpen(false);
    setRenewHospitalId('');
    setRenewNomorKerjasama('');
    setRenewTanggalMulai('');
    setRenewTanggalBerakhir('');
    setRenewFileUrl('');
    setRenewRuangLingkup('');
    setRenewStatus('Aktif');

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const totalAlumni = alumni.length;
  const activeMitra = mitra.filter(m => m.status === 'Aktif' || m.status === 'Perpanjangan').length;
  const employedCount = alumni.filter(a => a.status_kerja === 'Bekerja' || a.status_kerja === 'Wirausaha').length;
  const employmentRate = totalAlumni > 0 ? ((employedCount / totalAlumni) * 100).toFixed(1) : '0';
  const avgScore = feedback.length > 0
    ? (feedback.reduce((acc, f) =>
        acc + (f.etika_nilai + f.keahlian_nilai + f.bahasa_inggris_nilai +
               f.teknologi_nilai + f.komunikasi_nilai + f.kerjasama_nilai +
               f.pengembangan_diri_nilai) / 7, 0) / feedback.length).toFixed(1)
    : '0';




  // Dynamic wilayah from alumni data
  const wilayahColors = ['#00B9AD','#CDDC29','#60C0D0','#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#64748b','#e11d48'];
  const wilayahEmojis: Record<string, string> = {
    'Sumba Timur': '🔵', 'Sumba Barat': '🟢', 'Sumba Tengah': '🟡',
    'Sumba Barat Daya': '🟣', 'Kota Kupang': '🏙️', 'Luar Sumba': '🌐',
  };
  const allWilayah = Array.from(new Set(
    [...alumni.map(a => a.wilayah_kerja), ...mitra.map(m => m.kabupaten)]
      .filter(Boolean)
  )).sort();
  const kabupaten = allWilayah.map((name, i) => ({
    name,
    color: wilayahColors[i % wilayahColors.length],
    emoji: wilayahEmojis[name] || '📍'
  }));

  const activeMitraList = mitra.filter(m => m.status === 'Aktif').slice(0, 6);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#f0fafa', fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif" }}>
      {/* === KEMENKES NAVBAR === */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,185,173,0.15)',
        boxShadow: '0 2px 20px rgba(0,185,173,0.08)'
      }}>
        {/* Top accent bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #00B9AD 0%, #CDDC29 50%, #60C0D0 100%)' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #00B9AD 0%, #60C0D0 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 4px 14px rgba(0,185,173,0.35)'
            }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>SI-MITRA CARE <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, letterSpacing: '0' }}>by masandigital.com</span></span>
              <span style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: '#00B9AD', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '3px', lineHeight: 1.4 }}>Sistem Informasi Kemitraan & Tracer Keperawatan<br/>D3 Keperawatan Waikabubak</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={toggleTheme} title="Ganti Tema" style={{
              width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,185,173,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              border: '1px solid rgba(0,185,173,0.15)', transition: 'all 0.2s'
            }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => { setPublicTab('map'); setIsInformasiPublikOpen(true); }}
              style={{
                display: 'none', // hidden on mobile, shown via media query override
                alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px',
                color: '#475569', background: 'transparent', border: '1px solid rgba(0,0,0,0.1)',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              className="sm:flex"
            >
              📄 Informasi Publik
            </button>
            <button
              onClick={() => { setFeedbackStep(1); setAlumniSearchNim(''); setNimSearchError(false); setIsAlumniFeedbackOpen(true); }}
              style={{
                display: 'none',
                alignItems: 'center', gap: '6px',
                padding: '8px 18px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px',
                color: '#fff', background: 'linear-gradient(135deg, #00B9AD 0%, #60C0D0 100%)',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,185,173,0.3)', transition: 'all 0.2s'
              }}
              className="sm:flex"
            >
              🎓 Umpan Balik Alumni
            </button>
            <button
              onClick={onAdminLogin}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px',
                color: '#fff', background: '#0f172a',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'all 0.2s'
              }}
            >
              <Lock size={14} style={{ color: '#00B9AD' }} />
              <span>Login</span>
            </button>
          </div>
        </div>
      </nav>

      {/* === HERO SECTION === */}
      <section style={{
        position: 'relative', paddingTop: '100px', paddingBottom: '80px',
        background: 'linear-gradient(135deg, #00B9AD 0%, #004e48 60%, #003d39 100%)',
        overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center'
      }}>
        {/* Background decorations */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(205,220,41,0.12)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(96,192,208,0.15)', filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', top: '40%', left: '50%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', filter: 'blur(30px)' }} />
          {/* Decorative grid lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} viewBox="0 0 100 100" preserveAspectRatio="none">
            {[10,20,30,40,50,60,70,80,90].map(x => <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="white" strokeWidth="0.5"/>)}
            {[10,20,30,40,50,60,70,80,90].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="white" strokeWidth="0.5"/>)}
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(205,220,41,0.2)', border: '1px solid rgba(205,220,41,0.4)', marginBottom: '28px' }}>
            <Award size={14} color="#CDDC29" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#CDDC29', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Portal Resmi Prodi D3 Keperawatan Waikabubak · Poltekkes Kemenkes Kupang</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center' }}>
            {/* Left: Text */}
            <div style={{ flex: '1 1 500px' }}>
              <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '24px' }}>
                Sistem Informasi<br/>
                <span style={{ color: '#CDDC29' }}>Alumni, Kemitraan</span><br/>
                <span style={{ color: '#a8f0ec' }}>& UKOM Terpadu</span>
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: '36px', maxWidth: '540px' }}>
                Platform digital terintegrasi untuk pemantauan keterserapan lulusan, sertifikasi kompetensi, serta evaluasi kinerja instansi mitra Prodi D3 Keperawatan Waikabubak.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  onClick={() => { setFeedbackStep(1); setAlumniSearchNim(''); setNimSearchError(false); setIsAlumniFeedbackOpen(true); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '14px 28px', borderRadius: '14px', fontWeight: 800, fontSize: '15px',
                    background: '#CDDC29', color: '#0f172a', border: 'none', cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(205,220,41,0.4)', transition: 'all 0.2s'
                  }}
                >
                  <ClipboardList size={20} />
                  Isi Kuesioner Alumni
                </button>
                <button
                  onClick={onAdminLogin}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '14px 28px', borderRadius: '14px', fontWeight: 800, fontSize: '15px',
                    background: 'rgba(255,255,255,0.12)', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  <Lock size={20} />
                  Login Administrator
                </button>
              </div>
            </div>

            {/* Right: Stat cards */}
            <div style={{ flex: '0 1 320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: <GraduationCap size={22}/>, label: 'Total Alumni Terdata', value: totalAlumni, accent: '#CDDC29' },
                { icon: <TrendingUp size={22}/>, label: 'Tingkat Keterserapan', value: `${employmentRate}%`, accent: '#60C0D0' },
                { icon: <Building2 size={22}/>, label: 'Instansi Mitra Aktif', value: `${activeMitra}/${mitra.length}`, accent: '#00B9AD' },
                { icon: <Award size={22}/>, label: 'Kepuasan Pengguna Lulusan', value: `${avgScore}/5`, accent: '#CDDC29' },
              ].map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 20px', borderRadius: '16px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(12px)'
                }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: `${s.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.accent, flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.accent, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginTop: '4px' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
            <path d="M0 80L48 69.3C96 58.7 192 37.3 288 32C384 26.7 480 37.3 576 48C672 58.7 768 69.3 864 64C960 58.7 1056 37.3 1152 32C1248 26.7 1344 37.3 1392 42.7L1440 48V80H0Z" fill="#f0fafa"/>
          </svg>
        </div>
      </section>

      {/* === TENTANG PROGRAM === */}
      <section style={{ background: '#f0fafa', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 16px', borderRadius: '9999px', background: 'rgba(0,185,173,0.1)', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#00B9AD', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tentang Program</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: 1.2 }}>Melacak Jejak Langkah Lulusan</h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: 1.75 }}>
              Tracer study mengevaluasi kinerja prodi, menilai relevansi kurikulum, dan memantau keberhasilan alumni di dunia kerja secara berkelanjutan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { icon: <CheckCircle2 size={28}/>, title: 'Outcome Pendidikan', desc: 'Melacak transisi lulusan ke dunia kerja, situasi kerja terakhir, kesesuaian profesi, dan aplikasi kompetensi di lapangan nyata.', accent: '#00B9AD', bg: 'rgba(0,185,173,0.08)' },
              { icon: <Star size={28}/>, title: 'Output Pendidikan', desc: 'Penilaian mandiri lulusan terhadap penguasaan materi, pemerolehan kompetensi khusus, serta kemandirian saat bekerja di klinik.', accent: '#CDDC29', bg: 'rgba(205,220,41,0.1)' },
              { icon: <TrendingUp size={28}/>, title: 'Proses Pendidikan', desc: 'Evaluasi komprehensif terhadap proses pembelajaran, kelengkapan fasilitas, serta kontribusi layanan akademik prodi.', accent: '#60C0D0', bg: 'rgba(96,192,208,0.1)' },
            ].map((card, i) => (
              <div key={i} style={{
                background: '#ffffff', borderRadius: '24px', padding: '36px 32px',
                border: '1px solid rgba(0,185,173,0.1)',
                boxShadow: '0 4px 24px rgba(0,185,173,0.06)',
                transition: 'all 0.25s', cursor: 'default'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,185,173,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,185,173,0.06)'; }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: card.bg, color: card.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>{card.title}</h3>
                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.75 }}>{card.desc}</p>
                <div style={{ marginTop: '20px', height: '3px', borderRadius: '9999px', background: `linear-gradient(90deg, ${card.accent}, transparent)` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === STATISTIK UTAMA === */}
      <section style={{ background: '#ffffff', padding: '80px 24px', borderTop: '1px solid rgba(0,185,173,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 16px', borderRadius: '9999px', background: 'rgba(0,185,173,0.1)', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#00B9AD', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Statistik Utama</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: 1.2 }}>Ringkasan Data Lulusan</h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.75 }}>
              Monitoring realtime keterserapan lulusan, kepuasan mitra, serta distribusi instansi kerjasama.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              { label: 'Total Alumni', value: totalAlumni, sub: 'Terdata di sistem', icon: <GraduationCap size={26}/>, accent: '#00B9AD', gradient: 'linear-gradient(135deg, #00B9AD, #006b66)' },
              { label: 'Tingkat Keterserapan', value: `${employmentRate}%`, sub: 'Terserap dunia kerja', icon: <TrendingUp size={26}/>, accent: '#CDDC29', gradient: 'linear-gradient(135deg, #CDDC29, #8fa000)' },
              { label: 'Instansi Mitra', value: `${activeMitra}/${mitra.length}`, sub: 'RS & Pemerintah Aktif', icon: <Building2 size={26}/>, accent: '#60C0D0', gradient: 'linear-gradient(135deg, #60C0D0, #2e8fa0)' },
              { label: 'Kepuasan Mitra', value: `${avgScore}/5`, sub: 'Skor rata-rata SKM', icon: <Award size={26}/>, accent: '#00B9AD', gradient: 'linear-gradient(135deg, #00B9AD, #CDDC29)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: '20px', padding: '28px',
                border: '1px solid rgba(0,185,173,0.12)',
                boxShadow: '0 4px 20px rgba(0,185,173,0.06)',
                position: 'relative', overflow: 'hidden', transition: 'all 0.25s'
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,185,173,0.15)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,185,173,0.06)'; }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '0 20px 0 80px', background: s.gradient, opacity: 0.08 }} />
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${s.accent}18`, color: s.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, background: s.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '8px' }}>{s.value}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{s.label}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SEBARAN WILAYAH === */}
      <section style={{ background: 'linear-gradient(135deg, #00B9AD08, #60C0D008)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 16px', borderRadius: '9999px', background: 'rgba(96,192,208,0.12)', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#60C0D0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Distribusi Wilayah</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: 1.2 }}>Sebaran per Kabupaten</h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.75 }}>
              Pemetaan seluruh alumni dan instansi kemitraan aktif berdasarkan wilayah kerja dan kabupaten.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {kabupaten.map((kab, i) => {
              const kabAlumni = alumni.filter(a =>
                a.status_kerja === 'Bekerja' && a.wilayah_kerja === kab.name
              ).length;
              const kabMitra = mitra.filter(m => m.kabupaten === kab.name).length;
              const kabMitraAktif = mitra.filter(m => m.status === 'Aktif' && m.kabupaten === kab.name).length;
              const pct = Math.min((kabAlumni / Math.max(totalAlumni, 1)) * 100 * 4, 100);
              const c = kab.color;
              return (
                <div key={i} style={{
                  background: '#fff', borderRadius: '20px', padding: '24px',
                  border: `1px solid ${c}22`,
                  boxShadow: `0 4px 20px ${c}10`, transition: 'all 0.25s'
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${c}25`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${c}10`; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '1.8rem', background: '#f8fafc', borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{kab.emoji}</span>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>{kab.name}</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                        <Users size={13} color="#00B9AD" /><span>Alumni Bekerja</span>
                      </div>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{kabAlumni}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                        <Building2 size={13} color="#60C0D0" /><span>Mitra Aktif</span>
                      </div>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{kabMitraAktif}<span style={{ color: '#94a3b8', fontWeight: 500 }}>/{kabMitra}</span></span>
                    </div>
                  </div>
                  <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${c}, ${c}88)`, borderRadius: '9999px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === INSTANSI KEMITRAAN === */}
      <section style={{ background: '#fff', padding: '80px 24px', borderTop: '1px solid rgba(0,185,173,0.1)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid rgba(0,185,173,0.15)', boxShadow: '0 8px 40px rgba(0,185,173,0.08)', overflow: 'hidden' }}>
            {/* Card header */}
            <div style={{ padding: '24px 32px', background: 'linear-gradient(135deg, #00B9AD08, #60C0D008)', borderBottom: '1px solid rgba(0,185,173,0.12)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #00B9AD, #60C0D0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px rgba(0,185,173,0.3)' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>Instansi Kemitraan</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Jejaring rumah sakit & pemerintah daerah aktif</p>
                </div>
              </div>
              <button
                onClick={() => setIsRenewModalOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 18px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px',
                  color: '#00B9AD', background: 'rgba(0,185,173,0.08)',
                  border: '1px solid rgba(0,185,173,0.2)', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <ClipboardList size={15} />
                Perpanjang Kerjasama
              </button>
            </div>

            {/* Mitra rows */}
            <div>
              {activeMitraList.length > 0 ? activeMitraList.map((m, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 32px', borderBottom: i < activeMitraList.length - 1 ? '1px solid rgba(0,185,173,0.08)' : 'none',
                  transition: 'background 0.15s'
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,185,173,0.03)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #00B9AD22, #60C0D022)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🏥</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.nama_rs}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12px', color: '#64748b' }}>
                      <Building2 size={12} color="#94a3b8" />
                      <span>{m.kabupaten}</span>
                      <span style={{ color: '#cbd5e1' }}>•</span>
                      <span>s/d {m.tanggal_berakhir}</span>
                    </div>
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700,
                    background: m.status === 'Aktif' ? 'rgba(0,185,173,0.1)' : '#f1f5f9',
                    color: m.status === 'Aktif' ? '#00B9AD' : '#64748b',
                    border: `1px solid ${m.status === 'Aktif' ? 'rgba(0,185,173,0.2)' : '#e2e8f0'}`
                  }}>
                    {m.status === 'Aktif' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00B9AD', display: 'inline-block', animation: 'pulse 2s infinite' }} />}
                    {m.status}
                  </span>
                </div>
              )) : (
                <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Belum ada data instansi mitra</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* === FEEDBACK MITRA === */}
      {feedback.length > 0 && (
        <section style={{ background: 'linear-gradient(135deg, #00B9AD08, #CDDC2908)', padding: '80px 24px', borderTop: '1px solid rgba(0,185,173,0.1)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 16px', borderRadius: '9999px', background: 'rgba(205,220,41,0.15)', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#7a8a00', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Testimoni</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: 1.2 }}>Penilaian Pengguna Lulusan</h2>
              <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.75 }}>
                Umpan balik langsung dari direktur instansi mitra mengenai kinerja dan kompetensi alumni di lapangan.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {feedback.slice(0, 3).map((f, i) => {
                const avg = ((f.etika_nilai + f.keahlian_nilai + f.bahasa_inggris_nilai +
                  f.teknologi_nilai + f.komunikasi_nilai + f.kerjasama_nilai + f.pengembangan_diri_nilai) / 7).toFixed(1);
                return (
                  <div key={i} style={{
                    background: '#fff', borderRadius: '24px', padding: '32px',
                    border: '1px solid rgba(0,185,173,0.12)',
                    boxShadow: '0 4px 24px rgba(0,185,173,0.07)',
                    display: 'flex', flexDirection: 'column', transition: 'all 0.25s', position: 'relative'
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,185,173,0.14)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,185,173,0.07)'; }}
                  >
                    <div style={{ position: 'absolute', top: '24px', right: '24px', color: '#CDDC29', opacity: 0.4, fontSize: '2.5rem', lineHeight: 1 }}>"</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #00B9AD, #60C0D0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.3rem', flexShrink: 0 }}>
                        {f.nama_penilai.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', lineHeight: 1.2 }}>{f.nama_penilai}</h4>
                        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{f.jabatan_penilai} · {f.nama_mitra}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '10px 16px', background: 'rgba(0,185,173,0.06)', borderRadius: '12px' }}>
                      <Star size={16} fill="#CDDC29" color="#CDDC29" />
                      <span style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.1rem' }}>{avg}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>/ 5.0 Rata-rata SKM</span>
                    </div>
                    {f.masukan_kurikulum && (
                      <p style={{ color: '#475569', fontStyle: 'italic', flex: 1, lineHeight: 1.75, fontSize: '0.9rem' }}>
                        "{f.masukan_kurikulum}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* === CTA SECTION === */}
      <section style={{ background: 'linear-gradient(135deg, #00B9AD 0%, #004e48 100%)', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '16px' }}>Bergabung dalam Survei Alumni</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '36px' }}>
            Bantu kami meningkatkan kualitas pendidikan keperawatan dengan mengisi kuesioner tracer study Anda.
          </p>
          <button
            onClick={() => { setFeedbackStep(1); setAlumniSearchNim(''); setNimSearchError(false); setIsAlumniFeedbackOpen(true); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '16px 36px', borderRadius: '14px', fontWeight: 800, fontSize: '16px',
              background: '#CDDC29', color: '#0f172a', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 28px rgba(205,220,41,0.45)', transition: 'all 0.2s'
            }}
          >
            <ClipboardList size={20} />
            Isi Kuesioner Sekarang
          </button>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer style={{ background: '#0a1628', color: '#94a3b8', padding: '48px 24px 32px' }}>
        {/* Top gradient bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #00B9AD, #CDDC29, #60C0D0)', marginBottom: '40px', borderRadius: '9999px', maxWidth: '200px' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #00B9AD, #60C0D0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <GraduationCap size={18} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>SI-MITRA CARE <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>by masandigital.com</span></span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.75, maxWidth: '280px' }}>Poltekkes Kemenkes Kupang<br/>Prodi D3 Keperawatan Waikabubak</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
            <button
              onClick={onAdminLogin}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '9999px', fontWeight: 700, fontSize: '13px',
                color: '#fff', background: 'rgba(0,185,173,0.15)',
                border: '1px solid rgba(0,185,173,0.3)', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Lock size={14} color="#00B9AD" />
              Login Admin
            </button>
            <p style={{ fontSize: '11px', textAlign: 'right', lineHeight: 1.75 }}>
              © {new Date().getFullYear()} by Masandigital.com<br/>
              Data bersifat publik dan informatif.
            </p>
          </div>
        </div>
      </footer>

      {/* Toast Success */}
      {showSuccessToast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: 'linear-gradient(135deg, #00B9AD, #004e48)',
          color: '#fff', padding: '14px 20px', borderRadius: '14px',
          boxShadow: '0 10px 30px rgba(0,185,173,0.35)',
          zIndex: 9999, fontWeight: 700, fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '10px',
          animation: 'slideUp 0.3s ease'
        }}>
          ✅ Terima kasih! Penilaian berhasil disimpan & diintegrasikan ke sistem.
        </div>
      )}

      {/* Direct Feedback Modal */}
      {isFeedbackModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 2000 }}>
          <div className="modal-content glass" style={{ maxWidth: '600px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 className="text-lg font-bold">Form Penilaian Pengguna Lulusan</h3>
              <button className="btn btn-outline p-1 rounded-full text-lg" onClick={() => setIsFeedbackModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="modal-body space-y-4 text-left">
                <p className="text-xs text-muted" style={{ marginTop: '-4px' }}>
                  Evaluasi dari Direktur/Staf Instansi Mitra sangat membantu kami dalam menyelaraskan kurikulum kesehatan agar alumni kami siap pakai di lapangan kerja.
                </p>

                <div className="form-group">
                  <label className="form-label">Pilih / Nama Instansi Mitra</label>
                  <select 
                    className="form-control"
                    value={formNamaMitra}
                    onChange={(e) => setFormNamaMitra(e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Instansi / Mitra --</option>
                    {mitra.map(m => (
                      <option key={m.id} value={m.nama_rs}>{m.nama_rs} (Kab. {m.kabupaten})</option>
                    ))}
                    <option value="Lainnya">Lainnya / Tidak terdaftar</option>
                  </select>
                </div>

                {formNamaMitra === 'Lainnya' && (
                  <div className="form-group">
                    <label className="form-label">Tuliskan Nama Instansi / Mitra / Instansi</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Masukkan nama instansi lengkap..."
                      onChange={(e) => setFormNamaMitra(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap Penilai</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Nama Anda..."
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
                      placeholder="Contoh: Direktur Utama, Kabid Keperawatan..."
                      value={formJabatanPenilai}
                      onChange={(e) => setFormJabatanPenilai(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-color pt-3">
                  <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Nilai Kualitas Alumni Kami (Skala 1 - 5)</h4>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'Etika, Sikap, & Integritas', val: formEtika, setVal: setFormEtika },
                      { label: 'Keahlian Klinis & Asuhan Keperawatan', val: formKeahlian, setVal: setFormKeahlian },
                      { label: 'Kemampuan Bahasa Inggris', val: formInggris, setVal: setFormInggris },
                      { label: 'Penggunaan Teknologi & Rekam Medis Digital', val: formTeknologi, setVal: setFormTeknologi },
                      { label: 'Kemampuan Komunikasi & SBAR', val: formKomunikasi, setVal: setFormKomunikasi },
                      { label: 'Kerjasama Tim & Interprofesi', val: formKerjasama, setVal: setFormKerjasama },
                      { label: 'Semangat Belajar & Pengembangan Diri', val: formPengembangan, setVal: setFormPengembangan },
                    ].map((aspect, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-color">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{aspect.label}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(num => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => aspect.setVal(num)}
                              className={`p-1 rounded transition-all duration-150 ${aspect.val >= num ? 'text-amber-500 scale-110' : 'text-slate-300 dark:text-slate-700'}`}
                            >
                              <Star size={16} fill={aspect.val >= num ? 'currentColor' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Saran & Masukan untuk Kurikulum Pembelajaran</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    placeholder="Saran mata kuliah/praktek klinik yang perlu diperkuat..."
                    value={formMasukan}
                    onChange={(e) => setFormMasukan(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer flex gap-2 justify-end p-4 border-t border-color">
                <button type="button" className="btn btn-outline text-xs" onClick={() => setIsFeedbackModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary text-xs" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff' }}>Kirim Penilaian</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Renewal Modal */}
      {isRenewModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 2000 }}>
          <div className="modal-content glass" style={{ maxWidth: '550px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 className="text-lg font-bold">Perpanjang & Perbaharui Kerjasama RS</h3>
              <button className="btn btn-outline p-1 rounded-full text-lg" onClick={() => setIsRenewModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleRenewSubmit}>
              <div className="modal-body space-y-4 text-left">
                <p className="text-xs text-muted" style={{ marginTop: '-4px' }}>
                  Halaman ini digunakan oleh Staf Administrasi Instansi Mitra di Pulau Sumba untuk melakukan pembaharuan masa berlaku kerjasama (MoU/PKS).
                </p>

                <div className="form-group">
                  <label className="form-label">Pilih Instansi / Mitra</label>
                  <select 
                    className="form-control"
                    value={renewHospitalId}
                    onChange={(e) => handleRenewHospitalChange(e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Instansi / Mitra Anda --</option>
                    {mitra.map(m => (
                      <option key={m.id} value={m.id}>{m.nama_rs} (Kab. {m.kabupaten})</option>
                    ))}
                  </select>
                </div>

                {renewHospitalId && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Nomor Dokumen Kerjasama Baru (MoU / PKS)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Contoh: 120/PKS/RSUD-WKB/VII/2026"
                        value={renewNomorKerjasama}
                        onChange={(e) => setRenewNomorKerjasama(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Tanggal Mulai Baru</label>
                        <input 
                          type="date" 
                          className="form-control"
                          value={renewTanggalMulai}
                          onChange={(e) => setRenewTanggalMulai(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Tanggal Berakhir Baru</label>
                        <input 
                          type="date" 
                          className="form-control"
                          value={renewTanggalBerakhir}
                          onChange={(e) => setRenewTanggalBerakhir(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Link Dokumen Baru (Google Drive / URL PDF)</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        placeholder="Contoh: https://drive.google.com/file/d/..."
                        value={renewFileUrl}
                        onChange={(e) => setRenewFileUrl(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Status Kerjasama</label>
                      <select 
                        className="form-control"
                        value={renewStatus}
                        onChange={(e) => setRenewStatus(e.target.value as any)}
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Perpanjangan">Sedang Diperpanjang (Under Review)</option>
                        <option value="Non-Aktif">Non-Aktif (Expired)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ruang Lingkup Kerjasama</label>
                      <textarea 
                        className="form-control" 
                        rows={2}
                        value={renewRuangLingkup}
                        onChange={(e) => setRenewRuangLingkup(e.target.value)}
                        placeholder="Cakupan kerjasama..."
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer flex gap-2 justify-end p-4 border-t border-color">
                <button type="button" className="btn btn-outline text-xs" onClick={() => setIsRenewModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary text-xs" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff' }} disabled={!renewHospitalId}>Simpan Pembaharuan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alumni Feedback Modal */}
      {isAlumniFeedbackOpen && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 2000 }}>
          <div className="modal-content glass" style={{ maxWidth: '650px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 className="text-lg font-bold">🎓 Kuesioner & Umpan Balik Alumni</h3>
              <button 
                className="btn btn-outline p-1 rounded-full text-lg animate-hover" 
                style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 'auto' }}
                onClick={() => {
                  setIsAlumniFeedbackOpen(false);
                  setFeedbackStep(1);
                  setAlumniSearchNim('');
                  setFoundAlumni(null);
                  setNimSearchError(false);
                }}
              >
                ×
              </button>
            </div>

            {feedbackStep === 1 && (
              <form onSubmit={handleVerifyNim} className="modal-body space-y-4 text-left p-6">
                <div className="text-center space-y-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center mx-auto text-2xl">
                    🔍
                  </div>
                  <h4 className="font-bold text-sm">Verifikasi Identitas Alumni</h4>
                  <p className="text-xs text-muted">Silakan masukkan NIM Anda terlebih dahulu untuk memulai pengisian kuesioner.</p>
                </div>

                <div className="form-group">
                  <label className="form-label font-bold text-xs">Nomor Induk Mahasiswa (NIM)</label>
                  <input 
                    type="text" 
                    className="form-control text-center font-bold tracking-wider" 
                    placeholder="Masukkan NIM Anda (Contoh: P07420118045)"
                    value={alumniSearchNim}
                    onChange={(e) => {
                      setAlumniSearchNim(e.target.value);
                      setNimSearchError(false);
                    }}
                    required
                  />
                </div>

                {nimSearchError && (
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs space-y-2 animate-slide-up">
                    <span className="font-bold block">❌ NIM Tidak Ditemukan</span>
                    <p>NIM yang Anda masukkan belum terdaftar dalam sistem database kami.</p>
                    <p className="font-semibold">Silakan hubungi Administrator Prodi D3 Keperawatan Waikabubak untuk melakukan pemutakhiran data:</p>
                    <a 
                      href="https://wa.me/628123456789" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full text-center block text-xs mt-2 py-1.5"
                      style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', border: 'none', color: '#fff', textDecoration: 'none' }}
                    >
                      Hubungi Admin via WhatsApp
                    </a>
                  </div>
                )}

                <div className="modal-footer flex gap-2 justify-end pt-4 border-t border-color mt-6">
                  <button 
                    type="button" 
                    className="btn btn-outline text-xs" 
                    onClick={() => setIsAlumniFeedbackOpen(false)}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary text-xs"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', color: '#fff', fontWeight: 700 }}
                  >
                    Verifikasi NIM
                  </button>
                </div>
              </form>
            )}

            {feedbackStep === 2 && foundAlumni && (
              <form onSubmit={handleAlumniFeedbackSubmit} className="modal-body space-y-4 text-left p-6">
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-500/20 text-xs">
                  <div className="font-bold text-teal-700 dark:text-teal-300">Identitas Alumni Terverifikasi</div>
                  <div className="grid grid-cols-2 gap-2 mt-2 font-semibold">
                    <div>Nama: <span className="text-slate-800 dark:text-white font-bold">{foundAlumni.nama}</span></div>
                    <div>NIM: <span className="text-slate-800 dark:text-white font-mono">{foundAlumni.nim}</span></div>
                  </div>
                </div>

                <div className="border-b border-color pb-2 mb-2 pt-2">
                  <h4 className="text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider">
                    📋 Pemutakhiran Database Alumni Terintegrasi
                  </h4>
                  <p className="text-[10px] text-muted">Lengkapi atau update data tracer study Anda di database alumni (2021-2025):</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Tahun Kelulusan */}
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Tahun Kelulusan</label>
                    <input 
                      type="number" 
                      className="form-control text-xs" 
                      min={2021}
                      max={2025}
                      value={formTahunLulus}
                      onChange={(e) => setFormTahunLulus(Number(e.target.value))}
                      required
                    />
                  </div>

                  {/* Nomor WhatsApp / HP */}
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Nomor WhatsApp / HP</label>
                    <input 
                      type="tel" 
                      className="form-control text-xs" 
                      placeholder="Contoh: 081234567890"
                      value={formNoHp}
                      onChange={(e) => setFormNoHp(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Email</label>
                    <input 
                      type="email" 
                      className="form-control text-xs" 
                      placeholder="Contoh: nama@domain.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Status Pekerjaan Saat Ini */}
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Status Pekerjaan Saat Ini</label>
                    <select 
                      className="form-control text-xs"
                      value={formStatusKerja}
                      onChange={(e) => setFormStatusKerja(e.target.value as any)}
                      required
                    >
                      <option value="Bekerja">Bekerja</option>
                      <option value="Wirausaha">Wirausaha</option>
                      <option value="Studi Lanjut">Studi Lanjut</option>
                      <option value="Mencari Kerja">Mencari Kerja</option>
                    </select>
                  </div>

                  {/* Relevansi Kurikulum dgn Pekerjaan */}
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Relevansi Kurikulum dgn Pekerjaan</label>
                    <select 
                      className="form-control text-xs"
                      value={formRelevansi}
                      onChange={(e) => setFormRelevansi(e.target.value as any)}
                      required
                    >
                      <option value="Sangat Relevan">Sangat Relevan</option>
                      <option value="Relevan">Relevan</option>
                      <option value="Cukup Relevan">Cukup Relevan</option>
                      <option value="Tidak Relevan">Tidak Relevan</option>
                    </select>
                  </div>

                  {/* Nama Instansi / RS / Apotek */}
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Nama Instansi / Instansi / Mitra / Apotek</label>
                    <input 
                      type="text" 
                      className="form-control text-xs" 
                      placeholder="Contoh: RSUD Waikabubak"
                      value={formNamaInstitusi}
                      onChange={(e) => setFormNamaInstitusi(e.target.value)}
                      disabled={formStatusKerja === 'Mencari Kerja'}
                      required={formStatusKerja !== 'Mencari Kerja'}
                    />
                  </div>

                  {/* Jabatan / Posisi Kerja */}
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Jabatan / Posisi Kerja</label>
                    <input 
                      type="text" 
                      className="form-control text-xs" 
                      placeholder="Contoh: Perawat IGD / Staff Klinik"
                      value={formJabatan}
                      onChange={(e) => setFormJabatan(e.target.value)}
                      disabled={formStatusKerja === 'Mencari Kerja'}
                      required={formStatusKerja !== 'Mencari Kerja'}
                    />
                  </div>

                  {/* Wilayah Kerja */}
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Wilayah Kerja</label>
                    <div className="flex gap-2">
                      <select 
                        className="form-control text-xs flex-1"
                        value={['Sumba Timur', 'Sumba Barat', 'Sumba Tengah', 'Sumba Barat Daya'].includes(formWilayahKerja) ? formWilayahKerja : 'Lainnya'}
                        onChange={(e) => {
                          if (e.target.value === 'Lainnya') setFormWilayahKerja('');
                          else setFormWilayahKerja(e.target.value);
                        }}
                        disabled={formStatusKerja === 'Mencari Kerja'}
                        required={formStatusKerja !== 'Mencari Kerja'}
                      >
                        <option value="Sumba Timur">Sumba Timur</option>
                        <option value="Sumba Barat">Sumba Barat</option>
                        <option value="Sumba Tengah">Sumba Tengah</option>
                        <option value="Sumba Barat Daya">Sumba Barat Daya</option>
                        <option value="Lainnya">Lainnya (Sebutkan...)</option>
                      </select>
                      {!['Sumba Timur', 'Sumba Barat', 'Sumba Tengah', 'Sumba Barat Daya'].includes(formWilayahKerja) && (
                        <input
                          type="text"
                          className="form-control text-xs flex-1"
                          placeholder="Nama Kota/Pulau..."
                          value={formWilayahKerja}
                          onChange={(e) => setFormWilayahKerja(e.target.value)}
                          disabled={formStatusKerja === 'Mencari Kerja'}
                          required={formStatusKerja !== 'Mencari Kerja'}
                        />
                      )}
                    </div>
                  </div>

                  {/* Waktu Tunggu (Bulan) */}
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Waktu Tunggu (Bulan)</label>
                    <input 
                      type="number" 
                      className="form-control text-xs" 
                      min={0}
                      value={formWaktuTunggu}
                      onChange={(e) => setFormWaktuTunggu(Number(e.target.value))}
                      required
                    />
                  </div>

                  {/* Kisaran Gaji Bulanan */}
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Kisaran Gaji Bulanan</label>
                    <select 
                      className="form-control text-xs"
                      value={formGajiBulanan}
                      onChange={(e) => setFormGajiBulanan(e.target.value as any)}
                      disabled={formStatusKerja === 'Mencari Kerja'}
                      required={formStatusKerja !== 'Mencari Kerja'}
                    >
                      <option value="< Rp 3.000.000">&lt; Rp 3.000.000</option>
                      <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                      <option value="Rp 5.000.000 - Rp 7.500.000">Rp 5.000.000 - Rp 7.500.000</option>
                      <option value="> Rp 7.500.000">&gt; Rp 7.500.000</option>
                    </select>
                  </div>

                  {/* Tahun Lulus Uji Kompetensi */}
                  <div className="form-group">
                    <label className="form-label font-bold text-xs">Tahun & Periode Uji Kompetensi</label>
                    <select 
                      className="form-control text-xs"
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

                <div className="border-b border-color pb-2 pt-2 mt-4 mb-2">
                  <h4 className="text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider">
                    ⭐ Kuesioner Kepuasan Layanan Institusi
                  </h4>
                  <p className="text-[10px] text-muted">Berikan penilaian kualitas pembelajaran dan fasilitas selama menempuh pendidikan (Skala 1 - 5 Bintang):</p>
                </div>

                {/* Rating 1: Kualitas Pembelajaran */}
                <div className="space-y-1">
                  <label className="form-label font-bold text-xs flex justify-between">
                    <span>1. Kualitas Pembelajaran & Dosen</span>
                    <span className="text-teal-600 font-black">{formKualitasPembelajaran} / 5</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormKualitasPembelajaran(star)}
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          fill={star <= formKualitasPembelajaran ? '#f59e0b' : 'none'} 
                          className={star <= formKualitasPembelajaran ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating 2: Fasilitas Pembelajaran */}
                <div className="space-y-1">
                  <label className="form-label font-bold text-xs flex justify-between">
                    <span>2. Fasilitas Kampus & Laboratorium</span>
                    <span className="text-teal-600 font-black">{formFasilitasPembelajaran} / 5</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormFasilitasPembelajaran(star)}
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          fill={star <= formFasilitasPembelajaran ? '#f59e0b' : 'none'} 
                          className={star <= formFasilitasPembelajaran ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating 3: Relevansi Kurikulum */}
                <div className="space-y-1">
                  <label className="form-label font-bold text-xs flex justify-between">
                    <span>3. Relevansi Kurikulum dengan Dunia Kerja</span>
                    <span className="text-teal-600 font-black">{formRelevansiKurikulum} / 5</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRelevansiKurikulum(star)}
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          fill={star <= formRelevansiKurikulum ? '#f59e0b' : 'none'} 
                          className={star <= formRelevansiKurikulum ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating 4: Layanan Akademik */}
                <div className="space-y-1">
                  <label className="form-label font-bold text-xs flex justify-between">
                    <span>4. Layanan Akademik & Administrasi</span>
                    <span className="text-teal-600 font-black">{formLayananAkademik} / 5</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormLayananAkademik(star)}
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          fill={star <= formLayananAkademik ? '#f59e0b' : 'none'} 
                          className={star <= formLayananAkademik ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea: Saran */}
                <div className="form-group">
                  <label className="form-label font-bold text-xs">Masukan & Saran untuk Program Studi</label>
                  <textarea 
                    className="form-control text-xs" 
                    rows={3}
                    placeholder="Tuliskan masukan untuk peningkatan kualitas kurikulum, fasilitas, atau metode pengajaran..."
                    value={formSaranProdi}
                    onChange={(e) => setFormSaranProdi(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-footer flex gap-2 justify-end pt-4 border-t border-color mt-6">
                  <button 
                    type="button" 
                    className="btn btn-outline text-xs" 
                    onClick={() => {
                      setFeedbackStep(1);
                      setFoundAlumni(null);
                    }}
                  >
                    Kembali
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary text-xs"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff', fontWeight: 700 }}
                  >
                    Kirim Umpan Balik & Update Data
                  </button>
                </div>
              </form>
            )}

            {feedbackStep === 3 && (
              <div className="modal-body space-y-4 text-center p-8">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto text-3xl animate-bounce">
                  ✅
                </div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white">Terima Kasih!</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Umpan balik Anda telah berhasil disimpan ke database. Kontribusi Anda sangat berharga untuk peningkatan mutu pendidikan dan proses akreditasi kampus.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informasi Publik Modal */}
      {isInformasiPublikOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-4xl w-full">
            <div className="modal-header flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-4 border-b border-color">
              <div className="flex items-center gap-2">
                <Info className="text-teal-600" size={20} />
                <div>
                  <h3 className="text-md font-black text-slate-800 dark:text-white">Portal Informasi Publik</h3>
                  <p className="text-[10px] text-muted">Statistik, Peta Sebaran Alumni & Instansi Mitra</p>
                </div>
              </div>
              <button 
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                onClick={() => setIsInformasiPublikOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-color bg-slate-50/50 dark:bg-slate-950/20 px-4">
              <button 
                onClick={() => setPublicTab('map')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
                  publicTab === 'map' 
                    ? 'border-teal-600 text-teal-600' 
                    : 'border-transparent text-muted hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                🗺️ Peta Sebaran
              </button>
              <button 
                onClick={() => setPublicTab('laporan')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
                  publicTab === 'laporan' 
                    ? 'border-teal-600 text-teal-600' 
                    : 'border-transparent text-muted hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                📊 Statistik & Laporan
              </button>
            </div>

            <div className="modal-body p-6">
              {publicTab === 'map' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">Peta Wilayah Sebaran Kabupaten</h4>
                      <p className="text-xs text-muted">Arahkan kursor atau klik wilayah kabupaten pada peta untuk melihat sebaran data secara detail.</p>
                    </div>
                    {/* legend */}
                    <div className="flex gap-3 text-[10px] bg-slate-50 dark:bg-slate-900/30 p-1.5 rounded-lg border border-color font-semibold">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', border: '1.5px solid #3b82f6' }}></span> Timur
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1.5px solid #10b981' }}></span> Barat
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', border: '1.5px solid #f59e0b' }}></span> Tengah
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', border: '1.5px solid #8b5cf6' }}></span> Barat Daya
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* SVG map */}
                    <div className="lg:col-span-2 flex justify-center items-center bg-slate-900/5 dark:bg-slate-900/30 rounded-xl p-4 border border-dashed border-color min-h-[260px]">
                      <svg viewBox="0 0 600 300" className="w-full h-auto drop-shadow-md">
                        {/* SBD */}
                        <path 
                          d="M 40,130 C 50,110, 100,105, 120,115 C 130,125, 140,150, 135,170 C 130,185, 105,210, 80,205 C 55,200, 35,175, 40,130 Z" 
                          className="cursor-pointer transition-all duration-300 stroke-2"
                          style={{
                            fill: (hoveredDistrict === 'Sumba Barat Daya' || selectedDistrict === 'Sumba Barat Daya') ? 'rgba(139, 92, 246, 0.7)' : 'rgba(139, 92, 246, 0.2)',
                            stroke: (hoveredDistrict === 'Sumba Barat Daya' || selectedDistrict === 'Sumba Barat Daya') ? '#8b5cf6' : 'rgba(139, 92, 246, 0.5)',
                            strokeWidth: (hoveredDistrict === 'Sumba Barat Daya' || selectedDistrict === 'Sumba Barat Daya') ? '3.5' : '2',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={() => setHoveredDistrict('Sumba Barat Daya')}
                          onMouseLeave={() => setHoveredDistrict(null)}
                          onClick={() => setSelectedDistrict(selectedDistrict === 'Sumba Barat Daya' ? null : 'Sumba Barat Daya')}
                        />
                        {/* SB */}
                        <path 
                          d="M 120,115 C 130,105, 170,110, 185,125 C 200,140, 205,170, 185,190 C 165,210, 140,195, 135,170 C 140,150, 130,125, 120,115 Z" 
                          className="cursor-pointer transition-all duration-300 stroke-2"
                          style={{
                            fill: (hoveredDistrict === 'Sumba Barat' || selectedDistrict === 'Sumba Barat') ? 'rgba(16, 185, 129, 0.7)' : 'rgba(16, 185, 129, 0.2)',
                            stroke: (hoveredDistrict === 'Sumba Barat' || selectedDistrict === 'Sumba Barat') ? '#10b981' : 'rgba(16, 185, 129, 0.5)',
                            strokeWidth: (hoveredDistrict === 'Sumba Barat' || selectedDistrict === 'Sumba Barat') ? '3.5' : '2',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={() => setHoveredDistrict('Sumba Barat')}
                          onMouseLeave={() => setHoveredDistrict(null)}
                          onClick={() => setSelectedDistrict(selectedDistrict === 'Sumba Barat' ? null : 'Sumba Barat')}
                        />
                        {/* Central */}
                        <path 
                          d="M 185,125 C 200,110, 240,115, 255,130 C 270,145, 260,185, 245,200 C 230,215, 195,210, 185,190 C 205,170, 200,140, 185,125 Z" 
                          className="cursor-pointer transition-all duration-300 stroke-2"
                          style={{
                            fill: (hoveredDistrict === 'Sumba Tengah' || selectedDistrict === 'Sumba Tengah') ? 'rgba(245, 158, 11, 0.7)' : 'rgba(245, 158, 11, 0.2)',
                            stroke: (hoveredDistrict === 'Sumba Tengah' || selectedDistrict === 'Sumba Tengah') ? '#f59e0b' : 'rgba(245, 158, 11, 0.5)',
                            strokeWidth: (hoveredDistrict === 'Sumba Tengah' || selectedDistrict === 'Sumba Tengah') ? '3.5' : '2',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={() => setHoveredDistrict('Sumba Tengah')}
                          onMouseLeave={() => setHoveredDistrict(null)}
                          onClick={() => setSelectedDistrict(selectedDistrict === 'Sumba Tengah' ? null : 'Sumba Tengah')}
                        />
                        {/* East */}
                        <path 
                          d="M 255,130 C 270,115, 480,100, 520,130 C 560,160, 550,230, 480,250 C 410,270, 320,240, 280,220 C 240,200, 240,215, 245,200 C 260,185, 270,145, 255,130 Z" 
                          className="cursor-pointer transition-all duration-300 stroke-2"
                          style={{
                            fill: (hoveredDistrict === 'Sumba Timur' || selectedDistrict === 'Sumba Timur') ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.2)',
                            stroke: (hoveredDistrict === 'Sumba Timur' || selectedDistrict === 'Sumba Timur') ? '#3b82f6' : 'rgba(59, 130, 246, 0.5)',
                            strokeWidth: (hoveredDistrict === 'Sumba Timur' || selectedDistrict === 'Sumba Timur') ? '3.5' : '2',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={() => setHoveredDistrict('Sumba Timur')}
                          onMouseLeave={() => setHoveredDistrict(null)}
                          onClick={() => setSelectedDistrict(selectedDistrict === 'Sumba Timur' ? null : 'Sumba Timur')}
                        />

                        {/* Text labels */}
                        <text x="85" y="155" style={{ fill: 'var(--text-main)', fontWeight: 800, fontSize: '10px', pointerEvents: 'none', userSelect: 'none' }} textAnchor="middle">SBD</text>
                        <text x="160" y="145" style={{ fill: 'var(--text-main)', fontWeight: 800, fontSize: '10px', pointerEvents: 'none', userSelect: 'none' }} textAnchor="middle">SB</text>
                        <text x="222" y="145" style={{ fill: 'var(--text-main)', fontWeight: 800, fontSize: '10px', pointerEvents: 'none', userSelect: 'none' }} textAnchor="middle">Sumba Tengah</text>
                        <text x="380" y="165" style={{ fill: 'var(--text-main)', fontWeight: 800, fontSize: '10px', pointerEvents: 'none', userSelect: 'none' }} textAnchor="middle">Sumba Timur</text>
                      </svg>
                    </div>

                    {/* Stats sidebar */}
                    <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-900/30 rounded-xl p-4 border border-color space-y-4">
                      {(() => {
                        const targetDistrict = hoveredDistrict || selectedDistrict || 'Sumba Timur';
                        const distAlumni = alumni.filter(a => a.wilayah_kerja === targetDistrict);
                        const distAlumniEmployed = distAlumni.filter(a => a.status_kerja === 'Bekerja').length;
                        const distMitra = mitra.filter(m => m.kabupaten === targetDistrict);
                        const distMitraAktif = distMitra.filter(m => m.status === 'Aktif').length;

                        return (
                          <div className="space-y-3">
                            <div className="pb-2 border-b border-color">
                              <span className="text-[10px] text-muted font-bold block uppercase tracking-wider">Wilayah Terpilih:</span>
                              <span className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1">
                                📍 {targetDistrict}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="p-2 bg-white dark:bg-slate-900/50 rounded-lg border border-color">
                                <span className="text-[8px] text-muted block font-semibold uppercase">Alumni Bekerja</span>
                                <span className="text-xs font-black text-teal-600">{distAlumniEmployed} Orang</span>
                              </div>
                              <div className="p-2 bg-white dark:bg-slate-900/50 rounded-lg border border-color">
                                <span className="text-[8px] text-muted block font-semibold uppercase">RS Mitra Aktif</span>
                                <span className="text-xs font-black text-emerald-600">{distMitraAktif} / {distMitra.length}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted font-bold block mb-1">Daftar RS Mitra Kerja Sama:</span>
                              <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                                {distMitra.length > 0 ? distMitra.map((m, idx) => (
                                  <div key={idx} className="flex justify-between items-center p-1.5 bg-white dark:bg-slate-900/30 rounded border border-color text-[10px]">
                                    <span className="font-semibold truncate max-w-[130px]">{m.nama_rs}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                      m.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                    }`}>{m.status}</span>
                                  </div>
                                )) : (
                                  <span className="text-[10px] text-muted italic">Tidak ada RS mitra di kabupaten ini</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {publicTab === 'laporan' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Analisis Kurikulum & Keterserapan Alumni</h4>
                    <p className="text-xs text-muted">Laporan statistik kuesioner tracer study (Tahun Kelulusan 2021-2025).</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Wait time metric card */}
                    {(() => {
                      const alumniEmployed = alumni.filter(a => a.status_kerja === 'Bekerja' || a.status_kerja === 'Wirausaha');
                      const avgWaitTime = alumniEmployed.length > 0
                        ? (alumniEmployed.reduce((acc, curr) => acc + (curr.waktu_tunggu_bulan || 0), 0) / alumniEmployed.length).toFixed(1)
                        : '0';

                      // curriculum relevance counts
                      const relevansiSangat = alumni.filter(a => a.relevansi_kurikulum === 'Sangat Relevan').length;
                      const relevansiRelevan = alumni.filter(a => a.relevansi_kurikulum === 'Relevan').length;
                      const relevansiCukup = alumni.filter(a => a.relevansi_kurikulum === 'Cukup Relevan').length;
                      const relevansiTidak = alumni.filter(a => a.relevansi_kurikulum === 'Tidak Relevan').length;

                      // salary range counts
                      const gajiLow = alumni.filter(a => a.gaji_bulanan === '< Rp 3.000.000').length;
                      const gajiMed = alumni.filter(a => a.gaji_bulanan === 'Rp 3.000.000 - Rp 5.000.000').length;
                      const gajiHigh = alumni.filter(a => a.gaji_bulanan === 'Rp 5.000.000 - Rp 7.500.000').length;
                      const gajiVHigh = alumni.filter(a => a.gaji_bulanan === '> Rp 7.500.000').length;

                      const avgScore = feedback.length > 0
                        ? (feedback.reduce((acc, f) => acc + (f.etika_nilai + f.keahlian_nilai + f.bahasa_inggris_nilai + f.teknologi_nilai + f.komunikasi_nilai + f.kerjasama_nilai + f.pengembangan_diri_nilai) / 7, 0) / feedback.length).toFixed(1)
                        : '0.0';

                      return (
                        <>
                          <div className="p-4 rounded-xl border border-color bg-teal-50/20 dark:bg-teal-950/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                              <TrendingUp size={20} />
                            </div>
                            <div>
                              <span className="text-[9px] text-muted block uppercase font-bold">Waktu Tunggu Kerja</span>
                              <span className="text-lg font-black text-teal-600">{avgWaitTime} Bulan</span>
                              <span className="text-[8px] text-muted block">Rata-rata setelah lulus</span>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border border-color bg-emerald-50/20 dark:bg-emerald-950/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                              <Award size={20} />
                            </div>
                            <div>
                              <span className="text-[9px] text-muted block uppercase font-bold">Kesesuaian Kurikulum</span>
                              <span className="text-lg font-black text-emerald-600">
                                {totalAlumni > 0 ? (((relevansiSangat + relevansiRelevan) / totalAlumni) * 100).toFixed(1) : '0'}%
                              </span>
                              <span className="text-[8px] text-muted block">Sangat Relevan & Relevan</span>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border border-color bg-amber-50/20 dark:bg-amber-950/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                              <Star size={20} fill="currentColor" />
                            </div>
                            <div>
                              <span className="text-[9px] text-muted block uppercase font-bold">Kepuasan Pengguna</span>
                              <span className="text-lg font-black text-amber-500">{avgScore} / 5.0</span>
                              <span className="text-[8px] text-muted block">Dari {feedback.length} Instansi</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-3 mt-2">
                            {/* Curriculum Relevance Breakdown */}
                            <div className="p-4 rounded-xl border border-color bg-white dark:bg-slate-900/30 space-y-3">
                              <span className="text-xs font-bold text-slate-800 dark:text-white block">Relevansi Kurikulum dengan Pekerjaan</span>
                              <div className="space-y-2">
                                {[
                                  { label: 'Sangat Relevan', count: relevansiSangat, color: 'bg-emerald-500' },
                                  { label: 'Relevan', count: relevansiRelevan, color: 'bg-blue-500' },
                                  { label: 'Cukup Relevan', count: relevansiCukup, color: 'bg-amber-500' },
                                  { label: 'Tidak Relevan', count: relevansiTidak, color: 'bg-rose-500' }
                                ].map((item, idx) => {
                                  const pct = totalAlumni > 0 ? ((item.count / totalAlumni) * 100).toFixed(1) : '0';
                                  return (
                                    <div key={idx} className="space-y-1">
                                      <div className="flex justify-between text-[10px] font-semibold text-muted">
                                        <span>{item.label}</span>
                                        <span>{item.count} alumni ({pct}%)</span>
                                      </div>
                                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Salary distribution */}
                            <div className="p-4 rounded-xl border border-color bg-white dark:bg-slate-900/30 space-y-3">
                              <span className="text-xs font-bold text-slate-800 dark:text-white block">Distribusi Kisaran Gaji Alumni</span>
                              <div className="space-y-2">
                                {[
                                  { label: '< Rp 3.000.000', count: gajiLow, color: 'bg-teal-400' },
                                  { label: 'Rp 3.000.000 - Rp 5.000.000', count: gajiMed, color: 'bg-teal-600' },
                                  { label: 'Rp 5.000.000 - Rp 7.500.000', count: gajiHigh, color: 'bg-teal-800' },
                                  { label: '> Rp 7.500.000', count: gajiVHigh, color: 'bg-purple-600' }
                                ].map((item, idx) => {
                                  const pct = totalAlumni > 0 ? ((item.count / totalAlumni) * 100).toFixed(1) : '0';
                                  return (
                                    <div key={idx} className="space-y-1">
                                      <div className="flex justify-between text-[10px] font-semibold text-muted">
                                        <span>{item.label}</span>
                                        <span>{item.count} alumni ({pct}%)</span>
                                      </div>
                                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}


            </div>

            <div className="modal-footer flex gap-2 justify-end bg-slate-50 dark:bg-slate-900/40 p-4 border-t border-color">
              <button 
                type="button" 
                className="btn btn-primary text-xs"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', color: '#fff', fontWeight: 700 }}
                onClick={() => setIsInformasiPublikOpen(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
