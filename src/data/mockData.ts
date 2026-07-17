export interface Alumni {
  id: string;
  nama: string;
  nim: string;
  tahun_lulus: number;
  no_hp: string;
  email: string;
  status_kerja: 'Bekerja' | 'Wirausaha' | 'Studi Lanjut' | 'Mencari Kerja';
  nama_institusi: string;
  wilayah_kerja: string;
  jabatan: string;
  gaji_bulanan: '< Rp 3.000.000' | 'Rp 3.000.000 - Rp 5.000.000' | 'Rp 5.000.000 - Rp 7.500.000' | '> Rp 7.500.000';
  waktu_tunggu_bulan: number; // 0 to 24
  relevansi_kurikulum: 'Sangat Relevan' | 'Relevan' | 'Cukup Relevan' | 'Tidak Relevan';
  tahun_lulus_ukom?: string | null;
  created_at: string;
}

export interface MitraKerjasama {
  id: string;
  nama_rs: string; // nama instansi (RS, Pemda, Puskesmas, Klinik, dll)
  jenis_mitra: 'Rumah Sakit' | 'Pemerintah Daerah' | 'Puskesmas' | 'Klinik' | 'Lainnya';
  kabupaten: string; // free-text: Sumba Timur, Kupang, Jakarta, dll
  nomor_kerjasama: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  ruang_lingkup: string;
  status: 'Aktif' | 'Perpanjangan' | 'Non-Aktif';
  file_url: string;
  username_login?: string;
  password_login?: string;
  created_at: string;
  mou_history?: Array<{
    nomor_kerjasama: string;
    tanggal_mulai: string;
    tanggal_berakhir: string;
    file_url: string;
    ruang_lingkup?: string;
    created_at?: string;
  }>;
}

export interface PenggunaLulusan {
  id: string;
  nama_mitra: string; // nama instansi / mitra/instansi
  nama_penilai: string;
  jabatan_penilai: string;
  etika_nilai: number; // 1-5
  keahlian_nilai: number; // 1-5 (kompetensi utama)
  bahasa_inggris_nilai: number; // 1-5
  teknologi_nilai: number; // 1-5
  komunikasi_nilai: number; // 1-5
  kerjasama_nilai: number; // 1-5
  pengembangan_diri_nilai: number; // 1-5
  masukan_kurikulum: string;
  alumni_nama?: string; // Nama alumni yang dinilai (opsional)
  created_at: string;
}

export const initialMitra: MitraKerjasama[] = [
  {
    id: 'm1',
    nama_rs: 'RSUD Urmana Rara Mayang Waingapu',
    jenis_mitra: 'Rumah Sakit' as const,
    kabupaten: 'Sumba Timur',
    nomor_kerjasama: '045/KS/RSUD-WGP/VIII/2023',
    tanggal_mulai: '2023-08-15',
    tanggal_berakhir: '2026-08-15',
    ruang_lingkup: 'Pendidikan Klinis Keperawatan, Praktek Kerja Lapangan (PKL), dan Rekrutmen Alumni',
    status: 'Aktif',
    file_url: '#',
    username_login: 'rsudwaingapu',
    password_login: 'mitra123',
    created_at: '2023-08-15T00:00:00Z',
    mou_history: [
      {
        nomor_kerjasama: '012/KS/RSUD-WGP/VIII/2020',
        tanggal_mulai: '2020-08-15',
        tanggal_berakhir: '2023-08-15',
        file_url: '#',
        ruang_lingkup: 'Pendidikan Klinis Keperawatan dasar',
        created_at: '2020-08-15T00:00:00Z'
      },
      {
        nomor_kerjasama: '045/KS/RSUD-WGP/VIII/2023',
        tanggal_mulai: '2023-08-15',
        tanggal_berakhir: '2026-08-15',
        file_url: '#',
        ruang_lingkup: 'Pendidikan Klinis Keperawatan, Praktek Kerja Lapangan (PKL), dan Rekrutmen Alumni',
        created_at: '2023-08-15T00:00:00Z'
      }
    ]
  },
  {
    id: 'm2',
    nama_rs: 'Rumah Sakit Kristen Lindimara',
    jenis_mitra: 'Rumah Sakit' as const,
    kabupaten: 'Sumba Timur',
    nomor_kerjasama: '120/PKS/RSKL/XI/2024',
    tanggal_mulai: '2024-11-10',
    tanggal_berakhir: '2027-11-10',
    ruang_lingkup: 'Praktek Lapangan Kebidanan, Pelatihan Kompetensi, Rekrutmen Tenaga Kesehatan',
    status: 'Aktif',
    file_url: '#',
    username_login: 'rslindimara',
    password_login: 'mitra123',
    created_at: '2024-11-10T00:00:00Z',
    mou_history: [
      {
        nomor_kerjasama: '085/PKS/RSKL/XI/2021',
        tanggal_mulai: '2021-11-10',
        tanggal_berakhir: '2024-11-10',
        file_url: '#',
        ruang_lingkup: 'Praktek Kebidanan dan Keperawatan dasar',
        created_at: '2021-11-10T00:00:00Z'
      },
      {
        nomor_kerjasama: '120/PKS/RSKL/XI/2024',
        tanggal_mulai: '2024-11-10',
        tanggal_berakhir: '2027-11-10',
        file_url: '#',
        ruang_lingkup: 'Praktek Lapangan Kebidanan, Pelatihan Kompetensi, Rekrutmen Tenaga Kesehatan',
        created_at: '2024-11-10T00:00:00Z'
      }
    ]
  },
  {
    id: 'm3',
    nama_rs: 'RSUD Waikabubak',
    jenis_mitra: 'Rumah Sakit' as const,
    kabupaten: 'Sumba Barat',
    nomor_kerjasama: '221/KS-MOU/RSUD-WKB/I/2024',
    tanggal_mulai: '2024-01-05',
    tanggal_berakhir: '2027-01-05',
    ruang_lingkup: 'Layanan Rujukan Kesehatan, Praktek Mahasiswa, Penyaluran Kerja',
    status: 'Aktif',
    file_url: '#',
    username_login: 'rswaikabubak',
    password_login: 'mitra123',
    created_at: '2024-01-05T00:00:00Z',
    mou_history: [
      {
        nomor_kerjasama: '110/KS-MOU/RSUD-WKB/I/2021',
        tanggal_mulai: '2021-01-05',
        tanggal_berakhir: '2024-01-05',
        file_url: '#',
        ruang_lingkup: 'Layanan Rujukan Kesehatan dasar',
        created_at: '2021-01-05T00:00:00Z'
      },
      {
        nomor_kerjasama: '221/KS-MOU/RSUD-WKB/I/2024',
        tanggal_mulai: '2024-01-05',
        tanggal_berakhir: '2027-01-05',
        file_url: '#',
        ruang_lingkup: 'Layanan Rujukan Kesehatan, Praktek Mahasiswa, Penyaluran Kerja',
        created_at: '2024-01-05T00:00:00Z'
      }
    ]
  },
  {
    id: 'm4',
    nama_rs: 'Rumah Sakit Lende Moripa',
    jenis_mitra: 'Rumah Sakit' as const,
    kabupaten: 'Sumba Barat',
    nomor_kerjasama: '089/PKS/RSLM/VI/2025',
    tanggal_mulai: '2025-06-20',
    tanggal_berakhir: '2028-06-20',
    ruang_lingkup: 'Praktek Lapangan Terpadu, Riset Kesehatan Bersama, Seminar Klinis',
    status: 'Aktif',
    file_url: '#',
    username_login: 'rslendemoripa',
    password_login: 'mitra123',
    created_at: '2025-06-20T00:00:00Z'
  },
  {
    id: 'm5',
    nama_rs: 'RSUD Pratama Waibakul',
    jenis_mitra: 'Rumah Sakit' as const,
    kabupaten: 'Sumba Tengah',
    nomor_kerjasama: '440/012/RSP-ST/II/2022',
    tanggal_mulai: '2022-02-18',
    tanggal_berakhir: '2025-02-18',
    ruang_lingkup: 'Magang Kerja, Pengabdian Masyarakat, Pelatihan Medis Teknis',
    status: 'Non-Aktif',
    file_url: '#',
    username_login: 'rswaibakul',
    password_login: 'mitra123',
    created_at: '2022-02-18T00:00:00Z'
  },
  {
    id: 'm6',
    nama_rs: 'RSUD Pratama Reda Bolo',
    jenis_mitra: 'Rumah Sakit' as const,
    kabupaten: 'Sumba Barat Daya',
    nomor_kerjasama: '015/KS/P-RDB/V/2024',
    tanggal_mulai: '2024-05-12',
    tanggal_berakhir: '2027-05-12',
    ruang_lingkup: 'Penempatan Praktek Klinik, Kerja Sama Penelitian, Tracer Study Pasca-Kerja',
    status: 'Aktif',
    file_url: '#',
    username_login: 'rsredabolo',
    password_login: 'mitra123',
    created_at: '2024-05-12T00:00:00Z'
  },
  {
    id: 'm7',
    nama_rs: 'RS Kristen Karitas',
    jenis_mitra: 'Rumah Sakit' as const,
    kabupaten: 'Sumba Barat Daya',
    nomor_kerjasama: '800/KS/RSKK/IX/2023',
    tanggal_mulai: '2023-09-01',
    tanggal_berakhir: '2026-09-01',
    ruang_lingkup: 'Studi Klinis Mahasiswa, Rekrutmen Bidan dan Perawat, Layanan Bakti Sosial',
    status: 'Aktif',
    file_url: '#',
    username_login: 'rskaritas',
    password_login: 'mitra123',
    created_at: '2023-09-01T00:00:00Z'
  },
  {
    id: 'm8',
    nama_rs: 'RS Imanuel Waikabubak',
    jenis_mitra: 'Rumah Sakit' as const,
    kabupaten: 'Sumba Barat',
    nomor_kerjasama: '102/MOU/RSI-WGP/XII/2024',
    tanggal_mulai: '2024-12-15',
    tanggal_berakhir: '2027-12-15',
    ruang_lingkup: 'Praktek Keperawatan dan Farmasi, Uji Kompetensi Mandiri, Penempatan Lulusan',
    status: 'Aktif',
    file_url: '#',
    username_login: 'rsimanuel',
    password_login: 'mitra123',
    created_at: '2024-12-15T00:00:00Z'
  },
  {
    id: 'm9',
    nama_rs: 'Pemda Kabupaten Sumba Barat',
    jenis_mitra: 'Pemerintah Daerah' as const,
    kabupaten: 'Sumba Barat',
    nomor_kerjasama: '001/MOU/PEMDA-SB/2026',
    tanggal_mulai: '2026-01-01',
    tanggal_berakhir: '2030-01-01',
    ruang_lingkup: 'Kerjasama Lintas Sektor dan Beasiswa Daerah',
    status: 'Aktif',
    file_url: '#',
    username_login: 'pemdasb',
    password_login: 'mitra123',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'm10',
    nama_rs: 'Pemda Kabupaten Sumba Barat Daya',
    jenis_mitra: 'Pemerintah Daerah' as const,
    kabupaten: 'Sumba Barat Daya',
    nomor_kerjasama: '002/MOU/PEMDA-SBD/2026',
    tanggal_mulai: '2026-01-01',
    tanggal_berakhir: '2030-01-01',
    ruang_lingkup: 'Kerjasama Lintas Sektor',
    status: 'Aktif',
    file_url: '#',
    username_login: 'pemdasbd',
    password_login: 'mitra123',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'm11',
    nama_rs: 'Pemda Kabupaten Sumba Timur',
    jenis_mitra: 'Pemerintah Daerah' as const,
    kabupaten: 'Sumba Timur',
    nomor_kerjasama: '003/MOU/PEMDA-ST/2026',
    tanggal_mulai: '2026-01-01',
    tanggal_berakhir: '2030-01-01',
    ruang_lingkup: 'Kerjasama Lintas Sektor',
    status: 'Aktif',
    file_url: '#',
    username_login: 'pemdast',
    password_login: 'mitra123',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'm12',
    nama_rs: 'Pemda Kabupaten Sumba Tengah',
    jenis_mitra: 'Pemerintah Daerah' as const,
    kabupaten: 'Sumba Tengah',
    nomor_kerjasama: '004/MOU/PEMDA-STG/2026',
    tanggal_mulai: '2026-01-01',
    tanggal_berakhir: '2030-01-01',
    ruang_lingkup: 'Kerjasama Lintas Sektor',
    status: 'Aktif',
    file_url: '#',
    username_login: 'pemdasteng',
    password_login: 'mitra123',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'm13', nama_rs: 'Puskesmas Waikabubak', jenis_mitra: 'Puskesmas' as const,
    kabupaten: 'Sumba Barat', nomor_kerjasama: '101/PKM-WKB/2026',
    tanggal_mulai: '2026-02-01', tanggal_berakhir: '2029-02-01',
    ruang_lingkup: 'Praktek Lapangan Keperawatan Komunitas',
    status: 'Aktif', file_url: '#', username_login: 'puskesmaswkb', password_login: 'mitra123',
    created_at: '2026-02-01T00:00:00Z'
  },
  {
    id: 'm14', nama_rs: 'Puskesmas Waibakul', jenis_mitra: 'Puskesmas' as const,
    kabupaten: 'Sumba Tengah', nomor_kerjasama: '102/PKM-WBK/2026',
    tanggal_mulai: '2026-02-01', tanggal_berakhir: '2029-02-01',
    ruang_lingkup: 'Praktek Lapangan Keperawatan Komunitas',
    status: 'Aktif', file_url: '#', username_login: 'puskesmaswaibakul', password_login: 'mitra123',
    created_at: '2026-02-01T00:00:00Z'
  },
  {
    id: 'm15', nama_rs: 'Klinik Pratama Sumba Sehat', jenis_mitra: 'Klinik' as const,
    kabupaten: 'Sumba Timur', nomor_kerjasama: '201/KLN-SS/2025',
    tanggal_mulai: '2025-03-01', tanggal_berakhir: '2028-03-01',
    ruang_lingkup: 'Praktek Klinik Primer dan Penempatan Lulusan',
    status: 'Aktif', file_url: '#', username_login: 'klinikss', password_login: 'mitra123',
    created_at: '2025-03-01T00:00:00Z'
  },
  {
    id: 'm16', nama_rs: 'RSUD Prof. Dr. W. Z. Johannes Kupang', jenis_mitra: 'Rumah Sakit' as const,
    kabupaten: 'Kota Kupang', nomor_kerjasama: '500/MOU/RSUD-KPG/I/2025',
    tanggal_mulai: '2025-01-10', tanggal_berakhir: '2028-01-10',
    ruang_lingkup: 'Rujukan Kasus Kompleks, Praktek Spesialistik, Rekrutmen Lulusan',
    status: 'Aktif', file_url: '#', username_login: 'rsudjohanneskpg', password_login: 'mitra123',
    created_at: '2025-01-10T00:00:00Z'
  },
  {
    id: 'm17', nama_rs: 'Siloam Hospitals Kupang', jenis_mitra: 'Rumah Sakit' as const,
    kabupaten: 'Kota Kupang', nomor_kerjasama: '310/MOU/SHK/VI/2024',
    tanggal_mulai: '2024-06-01', tanggal_berakhir: '2027-06-01',
    ruang_lingkup: 'Rekrutmen Lulusan, Magang, Pelatihan Klinis Lanjutan',
    status: 'Aktif', file_url: '#', username_login: 'siloamkpg', password_login: 'mitra123',
    created_at: '2024-06-01T00:00:00Z'
  }
];

export const initialAlumni: Alumni[] = [
  {
    id: 'a1',
    nama: 'Yohanes Umbu Deta',
    nim: 'P07420118045',
    tahun_lulus: 2022,
    no_hp: '081234567890',
    email: 'yohanes.umbu@gmail.com',
    status_kerja: 'Bekerja',
    nama_institusi: 'RSUD Urmana Rara Mayang Waikabubak',
    wilayah_kerja: 'Sumba Timur',
    jabatan: 'Perawat Pelaksana IGD',
    gaji_bulanan: 'Rp 3.000.000 - Rp 5.000.000',
    waktu_tunggu_bulan: 3,
    relevansi_kurikulum: 'Sangat Relevan',
    tahun_lulus_ukom: '2022 Periode 2',
    created_at: '2022-10-15T08:30:00Z'
  },
  {
    id: 'a2',
    nama: 'Maria Konda Ngguna',
    nim: 'P07420117012',
    tahun_lulus: 2021,
    no_hp: '081339887766',
    email: 'maria.konda@yahoo.com',
    status_kerja: 'Bekerja',
    nama_institusi: 'Rumah Sakit Kristen Lindimara',
    wilayah_kerja: 'Sumba Timur',
    jabatan: 'Bidan Ruang Bersalin',
    gaji_bulanan: 'Rp 3.000.000 - Rp 5.000.000',
    waktu_tunggu_bulan: 2,
    relevansi_kurikulum: 'Sangat Relevan',
    tahun_lulus_ukom: '2021 Periode 3',
    created_at: '2021-09-20T10:15:00Z'
  },
  {
    id: 'a3',
    nama: 'Andreas Randa Hambandima',
    nim: 'P07420119004',
    tahun_lulus: 2023,
    no_hp: '082144556677',
    email: 'andreas.randa@outlook.com',
    status_kerja: 'Bekerja',
    nama_institusi: 'RSUD Waikabubak',
    wilayah_kerja: 'Sumba Barat',
    jabatan: 'Perawat ICU',
    gaji_bulanan: 'Rp 3.000.000 - Rp 5.000.000',
    waktu_tunggu_bulan: 5,
    relevansi_kurikulum: 'Relevan',
    tahun_lulus_ukom: '2023 Periode 1',
    created_at: '2023-11-05T14:22:00Z'
  },
  {
    id: 'a4',
    nama: 'Yarni Ndaha Lero',
    nim: 'P07420120088',
    tahun_lulus: 2024,
    no_hp: '085239112233',
    email: 'yarni.lero@gmail.com',
    status_kerja: 'Bekerja',
    nama_institusi: 'Rumah Sakit Kristen Karitas',
    wilayah_kerja: 'Sumba Barat Daya',
    jabatan: 'Bidan Poliklinik',
    gaji_bulanan: 'Rp 3.000.000 - Rp 5.000.000',
    waktu_tunggu_bulan: 1,
    relevansi_kurikulum: 'Sangat Relevan',
    tahun_lulus_ukom: '2024 Periode 1',
    created_at: '2024-08-12T09:00:00Z'
  },
  {
    id: 'a5',
    nama: 'Frengky Umbu Tay',
    nim: 'P07420119022',
    tahun_lulus: 2023,
    no_hp: '081238990011',
    email: 'frengky.tay@gmail.com',
    status_kerja: 'Bekerja',
    nama_institusi: 'Puskesmas Waibakul',
    wilayah_kerja: 'Sumba Tengah',
    jabatan: 'Perawat Puskesmas Keliling',
    gaji_bulanan: '< Rp 3.000.000',
    waktu_tunggu_bulan: 6,
    relevansi_kurikulum: 'Relevan',
    created_at: '2023-12-01T11:45:00Z'
  },
  {
    id: 'a6',
    nama: 'Rambu Anawulang',
    nim: 'P07420117099',
    tahun_lulus: 2021,
    no_hp: '081237123123',
    email: 'rambu.ana@gmail.com',
    status_kerja: 'Studi Lanjut',
    nama_institusi: 'Universitas Citra Bangsa Kupang',
    wilayah_kerja: 'Luar Sumba',
    jabatan: 'Mahasiswa S1 Keperawatan & Ners',
    gaji_bulanan: '< Rp 3.000.000',
    waktu_tunggu_bulan: 0,
    relevansi_kurikulum: 'Relevan',
    tahun_lulus_ukom: null,
    created_at: '2025-01-15T13:00:00Z'
  },
  {
    id: 'a7',
    nama: 'Daniel Gulla',
    nim: 'P07420121015',
    tahun_lulus: 2025,
    no_hp: '081333444555',
    email: 'daniel.gulla@gmail.com',
    status_kerja: 'Bekerja',
    nama_institusi: 'RSUD Pratama Reda Bolo',
    wilayah_kerja: 'Sumba Barat Daya',
    jabatan: 'Perawat Honorer',
    gaji_bulanan: '< Rp 3.000.000',
    waktu_tunggu_bulan: 6,
    relevansi_kurikulum: 'Cukup Relevan',
    tahun_lulus_ukom: '2023 Periode 2',
    created_at: '2024-01-10T11:45:00Z'
  },
  {
    id: 'a8',
    nama: 'Martha Kaba',
    nim: 'P07420118021',
    tahun_lulus: 2022,
    no_hp: '082340556677',
    email: 'martha.kaba@yahoo.com',
    status_kerja: 'Wirausaha',
    nama_institusi: 'Apotek Mandiri Sumba',
    wilayah_kerja: 'Sumba Barat',
    jabatan: 'Pemilik & Pengelola Apotek',
    gaji_bulanan: 'Rp 5.000.000 - Rp 7.500.000',
    waktu_tunggu_bulan: 4,
    relevansi_kurikulum: 'Cukup Relevan',
    created_at: '2022-11-20T13:10:00Z'
  },
  {
    id: 'a9',
    nama: 'Piter Lado',
    nim: 'P07420120011',
    tahun_lulus: 2024,
    no_hp: '087766554433',
    email: 'piter.lado@gmail.com',
    status_kerja: 'Mencari Kerja',
    nama_institusi: '-',
    wilayah_kerja: 'Sumba Timur',
    jabatan: '-',
    gaji_bulanan: '< Rp 3.000.000',
    waktu_tunggu_bulan: 12,
    relevansi_kurikulum: 'Tidak Relevan',
    created_at: '2025-01-10T10:00:00Z'
  },
  {
    id: 'a10',
    nama: 'Rambu Ngana Kareri',
    nim: 'P07420121045',
    tahun_lulus: 2025,
    no_hp: '081239123456',
    email: 'rambu.ngana@gmail.com',
    status_kerja: 'Bekerja',
    nama_institusi: 'RS Imanuel Waikabubak',
    wilayah_kerja: 'Sumba Timur',
    jabatan: 'Bidan Klinik',
    gaji_bulanan: 'Rp 3.000.000 - Rp 5.000.000',
    waktu_tunggu_bulan: 1,
    relevansi_kurikulum: 'Sangat Relevan',
    created_at: '2025-06-30T09:15:00Z'
  },
  {
    id: 'a11',
    nama: 'Stefanus Umbu Pati',
    nim: 'P07420119056',
    tahun_lulus: 2023,
    no_hp: '085344332211',
    email: 'stefanus.pati@gmail.com',
    status_kerja: 'Bekerja',
    nama_institusi: 'Siloam Hospitals Kupang',
    wilayah_kerja: 'Luar Sumba',
    jabatan: 'Perawat Pelaksana',
    gaji_bulanan: 'Rp 5.000.000 - Rp 7.500.000',
    waktu_tunggu_bulan: 4,
    relevansi_kurikulum: 'Sangat Relevan',
    created_at: '2023-10-18T15:30:00Z'
  },
  {
    id: 'a12',
    nama: 'Juliana Kaka',
    nim: 'P07420120102',
    tahun_lulus: 2024,
    no_hp: '081240112233',
    email: 'juliana.kaka@yahoo.com',
    status_kerja: 'Bekerja',
    nama_institusi: 'Rumah Sakit Lende Moripa',
    wilayah_kerja: 'Sumba Barat',
    jabatan: 'Bidan Pelaksana',
    gaji_bulanan: 'Rp 3.000.000 - Rp 5.000.000',
    waktu_tunggu_bulan: 3,
    relevansi_kurikulum: 'Relevan',
    created_at: '2024-09-05T11:20:00Z'
  }
];

export const initialFeedback: PenggunaLulusan[] = [
  {
    id: 'f1',
    nama_mitra: 'RSUD Urmana Rara Mayang Waikabubak',
    nama_penilai: 'dr. Helen Y. Hambandima, M.Kes',
    jabatan_penilai: 'Direktur Utama',
    etika_nilai: 5,
    keahlian_nilai: 4,
    bahasa_inggris_nilai: 3,
    teknologi_nilai: 4,
    komunikasi_nilai: 4,
    kerjasama_nilai: 5,
    pengembangan_diri_nilai: 4,
    masukan_kurikulum: 'Lulusan memiliki integritas moral dan etika yang sangat baik di lingkungan kerja. Namun, mohon agar kemampuan asuhan keperawatan gawat darurat (resusitasi, interpretasi EKG dasar) lebih diperdalam lagi dalam kurikulum praktek laboratorium.',
    created_at: '2024-05-15T09:00:00Z'
  },
  {
    id: 'f2',
    nama_mitra: 'Rumah Sakit Kristen Lindimara',
    nama_penilai: 'Ns. Kornelis Umbu Remu, S.Kep',
    jabatan_penilai: 'Kepala Bidang Keperawatan',
    etika_nilai: 4,
    keahlian_nilai: 4,
    bahasa_inggris_nilai: 2,
    teknologi_nilai: 3,
    komunikasi_nilai: 5,
    kerjasama_nilai: 4,
    pengembangan_diri_nilai: 5,
    masukan_kurikulum: 'Secara umum, alumni sangat cekatan dan memiliki empati tinggi (komunikasi terapeutik luar biasa). Masukan kami adalah meningkatkan kompetensi pencatatan rekam medis digital (EHR) karena instansi / mitra kami sedang bertransisi ke sistem digital penuh.',
    created_at: '2024-11-20T10:30:00Z'
  },
  {
    id: 'f3',
    nama_mitra: 'RSUD Waikabubak',
    nama_penilai: 'dr. John L. D. Lado',
    jabatan_penilai: 'Wadir Pelayanan Medis',
    etika_nilai: 4,
    keahlian_nilai: 5,
    bahasa_inggris_nilai: 3,
    teknologi_nilai: 4,
    komunikasi_nilai: 3,
    kerjasama_nilai: 4,
    pengembangan_diri_nilai: 4,
    masukan_kurikulum: 'Keahlian klinis kebidanan/keperawatan sudah sangat matang. Perlu ditingkatkan kompetensi komunikasi antar profesi (IPCP) agar koordinasi dokter-perawat-bidan berjalan lebih efisien, terutama saat handover pasien.',
    created_at: '2025-02-10T14:15:00Z'
  },
  {
    id: 'f4',
    nama_mitra: 'Rumah Sakit Lende Moripa',
    nama_penilai: 'Margaretha Radja, S.ST',
    jabatan_penilai: 'Koordinator Bidan Klinik',
    etika_nilai: 5,
    keahlian_nilai: 4,
    bahasa_inggris_nilai: 3,
    teknologi_nilai: 4,
    komunikasi_nilai: 4,
    kerjasama_nilai: 5,
    pengembangan_diri_nilai: 4,
    masukan_kurikulum: 'Kerja sama tim sangat baik. Lulusan memiliki kemauan belajar mandiri yang tinggi. Saran untuk kurikulum: perlu adanya pengenalan yang lebih mendalam mengenai asuhan kebidanan komplementer yang mulai banyak diminati pasien.',
    created_at: '2025-06-25T11:00:00Z'
  },
  {
    id: 'f5',
    nama_mitra: 'RS Imanuel Waikabubak',
    nama_penilai: 'dr. Danny W. Umbu',
    jabatan_penilai: 'Kepala Komite Medik',
    etika_nilai: 5,
    keahlian_nilai: 4,
    bahasa_inggris_nilai: 3,
    teknologi_nilai: 5,
    komunikasi_nilai: 4,
    kerjasama_nilai: 4,
    pengembangan_diri_nilai: 4,
    masukan_kurikulum: 'Lulusan memiliki penguasaan teknologi informasi kesehatan yang sangat baik. Masukan kami berfokus pada ketahanan mental di bawah tekanan kerja tinggi (workplace resilience) agar dimasukkan dalam materi kepribadian/etika profesi.',
    created_at: '2025-07-05T08:45:00Z'
  },
  {
    id: 'f6',
    nama_mitra: 'RSUD Pratama Waibakul',
    nama_penilai: 'dr. Martha U. K.',
    jabatan_penilai: 'Kepala Bidang Pelayanan',
    etika_nilai: 4,
    keahlian_nilai: 4,
    bahasa_inggris_nilai: 2,
    teknologi_nilai: 3,
    komunikasi_nilai: 4,
    kerjasama_nilai: 4,
    pengembangan_diri_nilai: 4,
    masukan_kurikulum: 'Perlu bimbingan lebih detail dalam pembuatan asuhan keperawatan mandiri di ruangan.',
    created_at: '2025-07-06T10:00:00Z'
  },
  {
    id: 'f7',
    nama_mitra: 'RSUD Pratama Reda Bolo',
    nama_penilai: 'dr. Gede Bagus',
    jabatan_penilai: 'Kepala Pelayanan Medis',
    etika_nilai: 5,
    keahlian_nilai: 5,
    bahasa_inggris_nilai: 3,
    teknologi_nilai: 4,
    komunikasi_nilai: 5,
    kerjasama_nilai: 5,
    pengembangan_diri_nilai: 5,
    masukan_kurikulum: 'Sangat puas dengan kinerja lulusan di RSUD Reda Bolo, mandiri dan bertanggung jawab.',
    created_at: '2025-07-07T11:30:00Z'
  },
  {
    id: 'f8',
    nama_mitra: 'RS Rumah Sakit Kristen Karitas',
    nama_penilai: 'Ns. Martha Rambu, S.Kep',
    jabatan_penilai: 'Kepala Bidang Keperawatan',
    etika_nilai: 4,
    keahlian_nilai: 4,
    bahasa_inggris_nilai: 3,
    teknologi_nilai: 3,
    komunikasi_nilai: 4,
    kerjasama_nilai: 4,
    pengembangan_diri_nilai: 4,
    masukan_kurikulum: 'Fokus pada peningkatan etika profesional di tempat kerja dan kolaborasi tim.',
    created_at: '2025-07-08T09:15:00Z'
  },
  {
    id: 'f9',
    nama_mitra: 'RSUD Waikabubak',
    nama_penilai: 'dr. Stefanus K. M.',
    jabatan_penilai: 'Kabid Medik',
    etika_nilai: 5,
    keahlian_nilai: 4,
    bahasa_inggris_nilai: 2,
    teknologi_nilai: 4,
    komunikasi_nilai: 4,
    kerjasama_nilai: 5,
    pengembangan_diri_nilai: 4,
    masukan_kurikulum: 'Lulusan memiliki empati tinggi dan disiplin kerja yang patut diapresiasi oleh manajemen.',
    created_at: '2025-07-09T14:20:00Z'
  },
  {
    id: 'f10',
    nama_mitra: 'RS Imanuel Waikabubak',
    nama_penilai: 'Ns. Yohanis M., S.Kep',
    jabatan_penilai: 'Kepala Ruangan',
    etika_nilai: 4,
    keahlian_nilai: 4,
    bahasa_inggris_nilai: 3,
    teknologi_nilai: 4,
    komunikasi_nilai: 4,
    kerjasama_nilai: 4,
    pengembangan_diri_nilai: 4,
    masukan_kurikulum: 'Aspek kolaborasi interprofesional perlu terus ditanamkan sejak dini dalam kurikulum praktek.',
    created_at: '2025-07-10T16:45:00Z'
  }
];

export interface AlumniFeedback {
  id: string;
  alumni_id: string;
  nim: string;
  nama: string;
  tahun_lulus: number;
  kualitas_pembelajaran: number; // 1-5
  fasilitas_pembelajaran: number; // 1-5
  relevansi_kurikulum: number; // 1-5
  layanan_akademik: number; // 1-5
  saran_prodi: string;
  created_at: string;
}

export const initialAlumniFeedback: AlumniFeedback[] = [
  {
    id: 'af1',
    alumni_id: 'b3c6c39a-7c3e-46bf-8ff6-bd2745347201',
    nim: 'P07420118045',
    nama: 'Yohanes Umbu Deta',
    tahun_lulus: 2022,
    kualitas_pembelajaran: 5,
    fasilitas_pembelajaran: 4,
    relevansi_kurikulum: 5,
    layanan_akademik: 4,
    saran_prodi: 'Pembelajaran teori sudah sangat matang. Namun, porsi praktek klinis langsung di RS perlu ditingkatkan agar mahasiswa tidak canggung saat mulai bekerja.',
    created_at: '2025-05-10T09:00:00Z'
  },
  {
    id: 'af2',
    alumni_id: 'b3c6c39a-7c3e-46bf-8ff6-bd2745347202',
    nim: 'P07420117012',
    nama: 'Maria Konda Ngguna',
    tahun_lulus: 2021,
    kualitas_pembelajaran: 4,
    fasilitas_pembelajaran: 5,
    relevansi_kurikulum: 4,
    layanan_akademik: 5,
    saran_prodi: 'Kualitas dosen pembimbing luar biasa sabar dan mendukung kami saat menyusun tugas akhir. Fasilitas lab kebidanan juga sangat memadai.',
    created_at: '2025-06-12T14:30:00Z'
  }
];
