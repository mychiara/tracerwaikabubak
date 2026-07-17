-- SCHEMA INITIALIZATION FOR SUPABASE DATABASE

-- 1. Table: alumni
CREATE TABLE IF NOT EXISTS public.alumni (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    nim TEXT NOT NULL,
    tahun_lulus INTEGER NOT NULL,
    no_hp TEXT DEFAULT '-',
    email TEXT DEFAULT '-',
    status_kerja TEXT NOT NULL,
    nama_institusi TEXT DEFAULT '-',
    wilayah_kerja TEXT DEFAULT '-',
    jabatan TEXT DEFAULT '-',
    gaji_bulanan TEXT DEFAULT '-',
    waktu_tunggu_bulan INTEGER DEFAULT 0,
    relevansi_kurikulum TEXT DEFAULT '-',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Table: mitra_kerjasama
CREATE TABLE IF NOT EXISTS public.mitra_kerjasama (
    id TEXT PRIMARY KEY,
    nama_rs TEXT NOT NULL,
    jenis_mitra TEXT NOT NULL,
    kabupaten TEXT NOT NULL,
    nomor_kerjasama TEXT DEFAULT '-',
    tanggal_mulai TEXT DEFAULT '-',
    tanggal_berakhir TEXT DEFAULT '-',
    ruang_lingkup TEXT DEFAULT '-',
    file_url TEXT DEFAULT '-',
    status TEXT NOT NULL,
    password TEXT DEFAULT 'mitra123',
    mou_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Table: pengguna_lulusan (Feedback Mitra)
CREATE TABLE IF NOT EXISTS public.pengguna_lulusan (
    id TEXT PRIMARY KEY,
    nama_mitra TEXT NOT NULL,
    nama_penilai TEXT NOT NULL,
    jabatan_penilai TEXT NOT NULL,
    etika_nilai INTEGER NOT NULL,
    keahlian_nilai INTEGER NOT NULL,
    bahasa_inggris_nilai INTEGER NOT NULL,
    teknologi_nilai INTEGER NOT NULL,
    komunikasi_nilai INTEGER NOT NULL,
    kerjasama_nilai INTEGER NOT NULL,
    pengembangan_diri_nilai INTEGER NOT NULL,
    masukan_kurikulum TEXT NOT NULL,
    alumni_nama TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Table: alumni_feedback (Feedback Pengisian Formulir Tracer Study)
CREATE TABLE IF NOT EXISTS public.alumni_feedback (
    id TEXT PRIMARY KEY,
    alumni_id TEXT NOT NULL,
    ipk NUMERIC(3,2) DEFAULT 0.00,
    pekerjaan_sesuai TEXT DEFAULT '-',
    saran_kurikulum TEXT DEFAULT '-',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.alumni;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mitra_kerjasama;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pengguna_lulusan;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alumni_feedback;
