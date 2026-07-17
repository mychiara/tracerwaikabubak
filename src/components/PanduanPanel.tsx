import React, { useState } from 'react';
import { BookOpen, GraduationCap, Building2, UserCog } from 'lucide-react';

interface PanduanPanelProps {
  role: 'admin' | 'mitra';
}

export const PanduanPanel: React.FC<PanduanPanelProps> = ({ role }) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'admin' | 'mitra' | 'alumni'>(role);

  return (
    <div className="space-y-6">
      {/* Title section */}
      <div className="glass p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-widest text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
            Pusat Bantuan & Dokumen
          </span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Panduan Penggunaan Sistem Tracer Study</h2>
          <p className="text-xs text-muted">Petunjuk langkah demi langkah pengoperasian aplikasi untuk setiap peran (Role) sistem.</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm shrink-0">
          <BookOpen size={22} />
        </div>
      </div>

      {/* Guide Tab Switchers */}
      <div className="flex bg-slate-100/80 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-color gap-1.5 w-fit">
        <button
          onClick={() => setActiveGuideTab('admin')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
            activeGuideTab === 'admin'
              ? 'bg-white dark:bg-slate-950 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-muted hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <UserCog size={15} />
          Panduan Administrator
        </button>
        <button
          onClick={() => setActiveGuideTab('mitra')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
            activeGuideTab === 'mitra'
              ? 'bg-white dark:bg-slate-950 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-muted hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Building2 size={15} />
          Panduan Instansi / Mitra (Mitra)
        </button>
        <button
          onClick={() => setActiveGuideTab('alumni')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
            activeGuideTab === 'alumni'
              ? 'bg-white dark:bg-slate-950 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-muted hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <GraduationCap size={15} />
          Panduan Alumni & Publik
        </button>
      </div>

      {/* Guide Contents */}
      <div className="space-y-6">
        {/* ================================== */}
        {/* 1. ADMIN GUIDE */}
        {/* ================================== */}
        {activeGuideTab === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
            {/* Steps / Navigation Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Core manual */}
              <div className="glass p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-color">
                  <span>🛠️</span> Modul Utama Pengelola (Admin)
                </h3>
                
                <div className="space-y-4 text-xs leading-relaxed">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Monitoring Dasbor & Sebaran Wilayah</h4>
                      <p className="text-muted">Gunakan tab <strong>Dashboard</strong> untuk memantau ringkasan statistik keterserapan alumni, kepuasan instansi / mitra, rata-rata waktu tunggu kerja, dan relevansi kurikulum pendidikan secara keseluruhan. Tab <strong>Peta Sebaran</strong> menyajikan peta interaktif Pulau Sumba dengan data statistik alumni per kabupaten.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Manajemen Kemitraan Instansi & MoU</h4>
                      <p className="text-muted">Pada tab <strong>Kemitraan RS</strong>, admin dapat mendaftarkan instansi mitra baru di Sumba Timur, Barat, Tengah, dan Barat Daya. Unggah dokumen MoU (Perjanjian Kerja Sama), set tanggal masa berlaku, dan <strong>atur kredensial login portal (Username & Password)</strong> untuk masing-masing instansi / mitra agar mereka dapat masuk ke portal mitra.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Tracer Study Alumni & Verifikasi Data</h4>
                      <p className="text-muted">Kelola data alumni Prodi D3 Keperawatan Waikabubak pada menu <strong>Tracer Alumni</strong>. Admin dapat menambahkan data alumni baru, menyunting data alumni yang sudah ada, atau menghapusnya. Data mencakup NIM, tahun kelulusan, status pekerjaan saat ini, waktu tunggu kerja, gaji, instansi tempat bekerja, serta keselarasan kurikulum.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Umpan Balik Pengguna Lulusan & Kurikulum</h4>
                      <p className="text-muted">Pantau rekam ulasan penilaian kinerja alumni yang diberikan oleh pihak atasan instansi / mitra melalui menu <strong>Pengguna Lulusan</strong>. Modul ini merekam penilaian terhadap 7 aspek kompetensi alumni yang bekerja, serta mencakup saran perbaikan kurikulum.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">5</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Analisis Data Kurikulum & Cetak Laporan</h4>
                      <p className="text-muted">Akses menu <strong>Analisis & Kurikulum</strong> untuk mendapatkan visualisasi diagram sebaran pekerjaan, tingkat relevansi kurikulum dengan dunia kerja klinis, serta grafik performa keahlian alumni. Klik tombol <strong>Cetak Laporan Resmi</strong> untuk mengekspor data analisis siap cetak/PDF formal.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Database Connection Info */}
              <div className="glass p-6 rounded-2xl space-y-3">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">💾 Panduan Sinkronisasi Supabase Cloud</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Aplikasi ini dirancang dengan mode penyimpanan ganda. Secara default, aplikasi berjalan menggunakan <strong>Local Storage</strong> browser. Untuk mengaktifkan sinkronisasi real-time berbasis cloud:
                </p>
                <ul className="list-disc pl-5 text-xs text-muted space-y-1.5">
                  <li>Buka tab <strong>Pengaturan DB (Database)</strong> di menu terbawah sidebar.</li>
                  <li>Masukkan kredensial berupa <strong>Supabase URL</strong> dan <strong>Supabase Anon Key</strong> proyek database Anda.</li>
                  <li>Klik tombol <strong>Hubungkan Database Supabase</strong> untuk menyinkronkan data alumni secara otomatis.</li>
                </ul>
              </div>
            </div>

            {/* Quick tips & FAQ */}
            <div className="space-y-6">
              <div className="glass p-5 rounded-2xl border-l-4 border-l-amber-500 bg-amber-500/5 space-y-3">
                <h4 className="font-extrabold text-xs text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  💡 Tips Sukses Pengelolaan Data
                </h4>
                <div className="text-xs text-muted space-y-2">
                  <p><strong>1. Notifikasi Kemitraan:</strong> Pantau warna indikator status MoU RS. Kuning menandakan MoU segera berakhir dalam waktu kurang dari 3 bulan, dan merah menandakan MoU telah kadaluwarsa.</p>
                  <p><strong>2. Kredensial RS:</strong> Pastikan Anda membagikan username dan password yang tertera di panel instansi kepada penanggung jawab masing-masing instansi / mitra agar mereka dapat masuk ke portal mitra.</p>
                </div>
              </div>

              <div className="glass p-5 rounded-2xl space-y-4">
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider">❓ Tanya Jawab Admin</h4>
                <div className="space-y-3 text-xs">
                  <div className="border-bottom pb-2">
                    <span className="font-bold text-slate-800 dark:text-white block">Bagaimana jika data RS tidak tersinkronisasi?</span>
                    <span className="text-muted block mt-1">Pastikan kredensial Supabase Anda di tab Pengaturan DB sudah valid dan status koneksi bercentang hijau.</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white block">Apakah data alumni bisa diimpor massal?</span>
                    <span className="text-muted block mt-1">Untuk saat ini penambahan data dilakukan melalui form interaktif di tab Tracer Alumni demi menjaga keutuhan validasi NIM dan relasi kerja.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================== */}
        {/* 2. MITRA GUIDE */}
        {/* ================================== */}
        {activeGuideTab === 'mitra' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-color">
                  <span>🏢</span> Panduan Portal Instansi / Mitra / Instansi
                </h3>

                <div className="space-y-4 text-xs leading-relaxed">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Pengelolaan Dokumen MoU Kemitraan</h4>
                      <p className="text-muted">Akses tab <strong>Dokumen MoU Kerjasama</strong> untuk memantau tanggal aktif berkas PKS (Perjanjian Kerja Sama) Anda dengan Poltekkes Kupang. Jika MoU mendekati kadaluwarsa, pihak instansi / mitra dapat langsung mengisi formulir pembaharuan nomor MoU baru dan menyematkan tautan dokumen PDF hasil perpanjangan kerja sama.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Pendaftaran Alumni Keperawatan yang Bekerja</h4>
                      <p className="text-muted">Sebelum memberikan ulasan kinerja, daftarkan terlebih dahulu alumni Prodi D3 Keperawatan Waikabubak yang saat ini bekerja aktif di instansi / mitra Anda pada tab <strong>Alumni & Penilaian Kinerja</strong>. Klik tombol <strong>Daftarkan Alumni Baru</strong> dan isi Nama Lengkap, NIM, Tahun Lulus, dan Jabatan.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Evaluasi Penilaian Kinerja Alumni (Atasan Langsung)</h4>
                      <p className="text-muted">Setelah nama alumni terdaftar di tabel, klik tombol <strong>Beri Penilaian Kinerja Alumni</strong>. Isi informasi nama dan jabatan atasan langsung penilai, berikan nilai bintang (1 sampai 5) untuk 7 aspek kompetensi utama (Etika, Keahlian Klinis, Bahasa Inggris, IT/EHR, Komunikasi, Kerjasama Tim, Pengembangan Diri), dan berikan saran kurikulum.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Pemberian Feedback Institusi Umum</h4>
                      <p className="text-muted">Pada tab <strong>Feedback Kurikulum (Umum)</strong>, manajer/direksi instansi / mitra dapat mengirimkan masukan penguatan materi pembelajaran prodi secara umum untuk disinkronkan dengan tren kebutuhan pelayanan medis klinis terkini.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Curriculum Engine widget overview */}
              <div className="glass p-6 rounded-2xl space-y-3 border-l-4 border-l-blue-500">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">🤖 Curriculum Recommendation Engine</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Setiap ulasan bintang dan saran kurikulum yang dikirimkan oleh pihak instansi / mitra akan diolah oleh modul rekomendasi kurikulum prodi. Hasil analisis akan muncul di dashboard utama untuk ditindaklanjuti oleh pengelola akademik Poltekkes dalam memperkuat mata kuliah tertentu.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-5 rounded-2xl bg-teal-500/5 border-l-4 border-l-teal-500 space-y-3">
                <h4 className="font-extrabold text-xs text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                  🏥 Penting Bagi Mitra RS
                </h4>
                <div className="text-xs text-muted space-y-2">
                  <p><strong>Ubah Password:</strong> Kredensial login Anda dibuat oleh admin. Jaga kerahasiaan akun login RS demi keamanan pengunggahan berkas MoU.</p>
                  <p><strong>Bintang Penilaian:</strong> Berikan penilaian objektif pada performa kerja perawat lulusan di RS Anda untuk perbaikan kurikulum berkelanjutan.</p>
                </div>
              </div>

              <div className="glass p-5 rounded-2xl space-y-3">
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider">📞 Butuh Bantuan Teknis?</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Jika Anda mengalami kendala saat mengunggah berkas MoU kemitraan atau akun tidak dapat mengakses portal, hubungi bagian kemitraan alumni Poltekkes Kemenkes Kupang Waikabubak.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================================== */}
        {/* 3. ALUMNI GUIDE */}
        {/* ================================== */}
        {activeGuideTab === 'alumni' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-color">
                  <span>🎓</span> Panduan Alumni & Pengunjung Publik
                </h3>

                <div className="space-y-4 text-xs leading-relaxed">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Mengisi Kuesioner Tracer Study Alumni</h4>
                      <p className="text-muted">Alumni Prodi D3 Keperawatan Waikabubak dapat berpartisipasi langsung pada halaman beranda utama (sebelum login) dengan mengeklik tombol <strong>Isi Umpan Balik Tracer Study</strong>. Masukkan Nama Lengkap, NIM, Tahun Kelulusan, status kebekerjaan, serta keselarasan kurikulum mata kuliah dengan posisi kerja Anda saat ini.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Pemberian Feedback Singkat</h4>
                      <p className="text-muted">Bagi masyarakat atau pengguna umum yang ingin memberikan ulasan atau tanggapan singkat, Anda dapat mengisi formulir tanggapan cepat di bagian bawah halaman depan publik tanpa perlu melakukan proses login.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">Melihat Hasil Statistik Publik</h4>
                      <p className="text-muted">Halaman depan menampilkan statistik kumulatif tingkat penyerapan kerja alumni di Pulau Sumba serta rangkuman kepuasan instansi secara transparan yang diperbarui secara langsung (real-time).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-5 rounded-2xl bg-amber-500/5 border-l-4 border-l-amber-500 space-y-2">
                <h4 className="font-extrabold text-xs text-amber-800 dark:text-amber-400">📝 Catatan Partisipasi Alumni</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Partisipasi Anda dalam mengisi kuesioner pelacakan alumni sangat berharga untuk proses akreditasi program studi dan peningkatan kurikulum perkuliahan mahasiswa keperawatan di Pulau Sumba.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
