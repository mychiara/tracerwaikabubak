import React, { useState } from 'react';
import { getSupabaseCredentials, updateSupabaseCredentials, isSupabaseConnected, apiSeedDatabase } from '../utils/db';
import { Database, Key, AlertTriangle, Cloud, Play, RefreshCw } from 'lucide-react';

export const SupabasePanel: React.FC = () => {
  const [creds, setCreds] = useState(getSupabaseCredentials());
  const [urlInput, setUrlInput] = useState(creds.url);
  const [keyInput, setKeyInput] = useState(creds.key);
  const [isConnected, setIsConnected] = useState(isSupabaseConnected());
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    try {
      const success = updateSupabaseCredentials(urlInput, keyInput);
      setCreds(getSupabaseCredentials());
      setIsConnected(isSupabaseConnected());
      setSaveStatus(success ? 'success' : 'failed');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) {
      setSaveStatus('failed');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleClear = () => {
    updateSupabaseCredentials('', '');
    setUrlInput('');
    setKeyInput('');
    setCreds(getSupabaseCredentials());
    setIsConnected(isSupabaseConnected());
    setSaveStatus('idle');
    setSeedResult(null);
  };

  const handleSeed = async (reset: boolean) => {
    const confirmMsg = reset 
      ? 'Apakah Anda yakin ingin MENGHAPUS SEMUA DATA di database Supabase dan mengisi ulang dengan data awal?' 
      : 'Apakah Anda yakin ingin mengisi data awal ke database Supabase?';
    if (!window.confirm(confirmMsg)) return;

    setSeedLoading(true);
    setSeedResult(null);
    try {
      const res = await apiSeedDatabase(reset);
      setSeedResult(res);
    } catch (e: any) {
      setSeedResult({ success: false, message: e.message || 'Gagal melakukan seeding.' });
    } finally {
      setSeedLoading(false);
    }
  };

  const envFileContent = `VITE_SUPABASE_URL=${urlInput || 'YOUR_SUPABASE_PROJECT_URL'}
VITE_SUPABASE_ANON_KEY=${keyInput || 'YOUR_SUPABASE_ANON_KEY'}`;

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="glass p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isConnected 
                ? 'bg-emerald-500/10 text-emerald-500' 
                : 'bg-amber-500/10 text-amber-500'
            }`}>
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                Status Integrasi Supabase
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isConnected 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {isConnected ? 'Terhubung (Cloud)' : 'Fallback (Penyimpanan Lokal)'}
                </span>
              </h3>
              <p className="text-xs text-muted">
                {isConnected 
                  ? 'Aplikasi terhubung langsung ke database Supabase Cloud. Seluruh data disinkronkan secara real-time.' 
                  : 'Aplikasi menggunakan penyimpanan lokal browser (LocalStorage) dengan data awal terisi otomatis. Anda dapat menghubungkan database Supabase di bawah ini.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credentials Editor */}
        <div className="glass p-6 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 border-bottom pb-2">
            <Key size={16} />
            Konfigurasi Kunci API Supabase
          </h3>

          <div className="space-y-3">
            <div className="form-group">
              <label className="form-label text-xs">Supabase Project URL</label>
              <input 
                type="text" 
                placeholder="https://xyzxyz.supabase.co" 
                className="form-control text-xs font-mono"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label text-xs">Supabase Anon Key</label>
              <input 
                type="password" 
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
                className="form-control text-xs font-mono"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              {(urlInput || keyInput) && (
                <button className="btn btn-outline text-xs" onClick={handleClear}>
                  Hapus Koneksi
                </button>
              )}
              <button className="btn btn-primary text-xs" onClick={handleSave}>
                Hubungkan & Simpan
              </button>
            </div>

            {saveStatus === 'success' && (
              <div className="p-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs rounded-lg font-bold text-center">
                ✅ Database terhubung! Halaman akan reload dalam cache.
              </div>
            )}
          </div>
        </div>

        {/* Netlify / Deployment Guide */}
        <div className="glass p-6 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 border-bottom pb-2">
            <Cloud size={16} />
            Panduan Deploy ke Netlify
          </h3>
          
          <div className="text-xs space-y-2 text-muted leading-relaxed">
            <p>Untuk meluncurkan aplikasi ini di Netlify secara penuh dengan database Supabase, ikuti langkah berikut:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Unggah source code ini ke repository <strong>Github</strong> Anda.</li>
              <li>Buka dashboard <strong>Netlify</strong> dan buat situs baru dari Github.</li>
              <li>Di menu <strong>Build & Deploy Settings</strong>, masukkan variabel lingkungan (Environment Variables) berikut:</li>
            </ol>

            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-color font-mono relative mt-2">
              <pre className="text-[10px] text-slate-800 dark:text-slate-200">{envFileContent}</pre>
            </div>
            
            <p className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 p-3 rounded-lg flex gap-2 items-start mt-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>Eksekusi terlebih dahulu skrip <strong>supabase_schema.sql</strong> di SQL Editor Supabase Console sebelum menyambungkan aplikasi.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Database Seeding section */}
      <div className="glass p-6 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 border-bottom pb-2">
          <Database size={16} />
          Seeding & Sinkronisasi Data Awal (Mock Data)
        </h3>
        <div className="text-xs space-y-2 text-muted leading-relaxed">
          <p>
            Jika Anda baru saja menghubungkan database Supabase baru, seluruh tabel akan berada dalam keadaan kosong (mitra kosong, alumni kosong, dll.).
            Gunakan tombol di bawah ini untuk mengisi database Supabase Anda dengan data awal (Mock Data) secara otomatis agar aplikasi tidak kosong.
          </p>
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 p-3 rounded-lg flex gap-2 items-start">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">PENTING: Masalah RLS & Kolom Database Mismatch!</span>
              <span>Pastikan Anda telah menjalankan perintah SQL migrasi terbaru (atau tabel schema ter-update) di panel Supabase SQL Editor sebelum melakukan seeding. Jika database Anda masih menggunakan schema lama, proses seeding dapat gagal karena ketidakcocokan kolom.</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              className="btn btn-outline text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 border-color hover:bg-slate-100 dark:hover:bg-slate-900"
              onClick={() => handleSeed(false)}
              disabled={seedLoading || !isConnected}
            >
              <Play size={14} className="text-teal-500" />
              Isi Data Awal (Masukkan Data Baru)
            </button>
            <button 
              className="btn btn-outline text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-rose-600 border-rose-500/20 hover:bg-rose-50"
              onClick={() => handleSeed(true)}
              disabled={seedLoading || !isConnected}
            >
              <RefreshCw size={14} className={seedLoading ? 'animate-spin' : ''} />
              Reset & Isi Data Awal Baru (Hapus Semua Dulu)
            </button>
          </div>
          
          {seedLoading && (
            <div className="text-xs font-bold text-slate-500 animate-pulse pt-2">
              ⏳ Sedang melakukan proses seeding ke Supabase, harap tunggu...
            </div>
          )}

          {seedResult && (
            <div className={`p-3 text-xs rounded-lg font-bold border mt-2 ${
              seedResult.success 
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
            }`}>
              {seedResult.success ? '✅ ' : '❌ '} {seedResult.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
