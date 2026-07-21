import { createClient } from '@supabase/supabase-js';
import type { Alumni, MitraKerjasama, PenggunaLulusan, AlumniFeedback } from '../data/mockData';
import { initialAlumni, initialMitra, initialFeedback, initialAlumniFeedback } from '../data/mockData';

// Dynamic keys - check env first, then check localStorage
let cachedUrl = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('TRACER_SUPABASE_URL') || '';
let cachedKey = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('TRACER_SUPABASE_ANON_KEY') || '';

let supabaseClient = cachedUrl && cachedKey ? createClient(cachedUrl, cachedKey) : null;

export const updateSupabaseCredentials = (url: string, key: string) => {
  if (url && key) {
    localStorage.setItem('TRACER_SUPABASE_URL', url);
    localStorage.setItem('TRACER_SUPABASE_ANON_KEY', key);
    cachedUrl = url;
    cachedKey = key;
    supabaseClient = createClient(url, key);
    return true;
  } else {
    localStorage.removeItem('TRACER_SUPABASE_URL');
    localStorage.removeItem('TRACER_SUPABASE_ANON_KEY');
    cachedUrl = '';
    cachedKey = '';
    supabaseClient = null;
    return false;
  }
};

export const getSupabaseCredentials = () => {
  return {
    url: cachedUrl,
    key: cachedKey,
    isEnv: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  };
};

export const isSupabaseConnected = () => {
  return supabaseClient !== null;
};

// --- Local Storage Helpers ---
const getLocalData = <T>(key: string, initialData: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error parsing local storage for key ${key}`, e);
    return initialData;
  }
};

const setLocalData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- Alumni API ---
export const apiGetAlumni = async (): Promise<Alumni[]> => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('alumni')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setLocalData('tracer_alumni_cache', data);
        return data as Alumni[];
      }
      console.warn('Supabase fetch failed, falling back to cache', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }
  return getLocalData<Alumni>('tracer_alumni', initialAlumni);
};

export const apiAddAlumni = async (alumni: Omit<Alumni, 'id' | 'created_at'>): Promise<Alumni> => {
  const newAlumni: Alumni = {
    ...alumni,
    id: crypto.randomUUID ? crypto.randomUUID() : 'a_' + Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString()
  };

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('alumni')
        .insert([newAlumni])
        .select();
      
      if (!error && data && data[0]) {
        // Sync local
        const local = getLocalData<Alumni>('tracer_alumni', initialAlumni);
        setLocalData('tracer_alumni', [data[0] as Alumni, ...local]);
        return data[0] as Alumni;
      }
      console.error('Supabase insert error', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }

  // Fallback to local
  const local = getLocalData<Alumni>('tracer_alumni', initialAlumni);
  const updated = [newAlumni, ...local];
  setLocalData('tracer_alumni', updated);
  return newAlumni;
};

export const apiUpdateAlumni = async (alumni: Alumni): Promise<Alumni> => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('alumni')
        .update(alumni)
        .eq('id', alumni.id)
        .select();
      
      if (!error && data && data[0]) {
        const local = getLocalData<Alumni>('tracer_alumni', initialAlumni);
        const updated = local.map(a => a.id === alumni.id ? (data[0] as Alumni) : a);
        setLocalData('tracer_alumni', updated);
        return data[0] as Alumni;
      }
      console.error('Supabase update error', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }

  const local = getLocalData<Alumni>('tracer_alumni', initialAlumni);
  const updated = local.map(a => a.id === alumni.id ? alumni : a);
  setLocalData('tracer_alumni', updated);
  return alumni;
};

export const apiDeleteAlumni = async (id: string): Promise<boolean> => {
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('alumni')
        .delete()
        .eq('id', id);
      
      if (!error) {
        const local = getLocalData<Alumni>('tracer_alumni', initialAlumni);
        setLocalData('tracer_alumni', local.filter(a => a.id !== id));
        return true;
      }
      console.error('Supabase delete error', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }

  const local = getLocalData<Alumni>('tracer_alumni', initialAlumni);
  setLocalData('tracer_alumni', local.filter(a => a.id !== id));
  return true;
};

export const apiDeleteAllAlumni = async (): Promise<boolean> => {
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('alumni')
        .delete()
        .neq('id', '');
      
      if (!error) {
        setLocalData('tracer_alumni', []);
        return true;
      }
      console.error('Supabase delete all error', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }

  setLocalData('tracer_alumni', []);
  return true;
};



// --- Mitra Kerjasama API ---
export const apiGetMitra = async (): Promise<MitraKerjasama[]> => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('mitra_kerjasama')
        .select('*')
        .order('tanggal_berakhir', { ascending: true });
      
      if (!error && data) {
        setLocalData('tracer_mitra_cache', data);
        return data as MitraKerjasama[];
      }
      console.warn('Supabase fetch failed, falling back to cache', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }
  return getLocalData<MitraKerjasama>('tracer_mitra', initialMitra);
};

export const apiAddMitra = async (mitra: Omit<MitraKerjasama, 'id' | 'created_at'>): Promise<MitraKerjasama> => {
  const newMitra: MitraKerjasama = {
    ...mitra,
    id: crypto.randomUUID ? crypto.randomUUID() : 'm_' + Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString()
  };

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('mitra_kerjasama')
        .insert([newMitra])
        .select();
      
      if (!error && data && data[0]) {
        const local = getLocalData<MitraKerjasama>('tracer_mitra', initialMitra);
        setLocalData('tracer_mitra', [data[0] as MitraKerjasama, ...local]);
        return data[0] as MitraKerjasama;
      }
      console.error('Supabase insert error', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }

  const local = getLocalData<MitraKerjasama>('tracer_mitra', initialMitra);
  const updated = [newMitra, ...local];
  setLocalData('tracer_mitra', updated);
  return newMitra;
};

export const apiUpdateMitra = async (mitra: MitraKerjasama): Promise<MitraKerjasama> => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('mitra_kerjasama')
        .update(mitra)
        .eq('id', mitra.id)
        .select();
      
      if (!error && data && data[0]) {
        const local = getLocalData<MitraKerjasama>('tracer_mitra', initialMitra);
        const updated = local.map(m => m.id === mitra.id ? (data[0] as MitraKerjasama) : m);
        setLocalData('tracer_mitra', updated);
        return data[0] as MitraKerjasama;
      }
      console.error('Supabase update error', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }

  const local = getLocalData<MitraKerjasama>('tracer_mitra', initialMitra);
  const updated = local.map(m => m.id === mitra.id ? mitra : m);
  setLocalData('tracer_mitra', updated);
  return mitra;
};

export const apiDeleteMitra = async (id: string): Promise<boolean> => {
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('mitra_kerjasama')
        .delete()
        .eq('id', id);
      
      if (!error) {
        const local = getLocalData<MitraKerjasama>('tracer_mitra', initialMitra);
        setLocalData('tracer_mitra', local.filter(m => m.id !== id));
        return true;
      }
      console.error('Supabase delete error', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }

  const local = getLocalData<MitraKerjasama>('tracer_mitra', initialMitra);
  setLocalData('tracer_mitra', local.filter(m => m.id !== id));
  return true;
};


// --- Pengguna Lulusan (Feedback) API ---
export const apiGetFeedback = async (): Promise<PenggunaLulusan[]> => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('pengguna_lulusan')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setLocalData('tracer_feedback_cache', data);
        return data as PenggunaLulusan[];
      }
      console.warn('Supabase fetch failed, falling back to cache', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }
  return getLocalData<PenggunaLulusan>('tracer_feedback', initialFeedback);
};

export const apiAddFeedback = async (feedback: Omit<PenggunaLulusan, 'id' | 'created_at'>): Promise<PenggunaLulusan> => {
  const newFeedback: PenggunaLulusan = {
    ...feedback,
    id: crypto.randomUUID ? crypto.randomUUID() : 'f_' + Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString()
  };

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('pengguna_lulusan')
        .insert([newFeedback])
        .select();
      
      if (!error && data && data[0]) {
        const local = getLocalData<PenggunaLulusan>('tracer_feedback', initialFeedback);
        setLocalData('tracer_feedback', [data[0] as PenggunaLulusan, ...local]);
        return data[0] as PenggunaLulusan;
      }
      console.error('Supabase insert error', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }

  const local = getLocalData<PenggunaLulusan>('tracer_feedback', initialFeedback);
  const updated = [newFeedback, ...local];
  setLocalData('tracer_feedback', updated);
  return newFeedback;
};

export const apiUpdateFeedback = async (feedback: PenggunaLulusan): Promise<PenggunaLulusan> => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('pengguna_lulusan')
        .update(feedback)
        .eq('id', feedback.id)
        .select();
      
      if (!error && data && data[0]) {
        const local = getLocalData<PenggunaLulusan>('tracer_feedback', initialFeedback);
        const updated = local.map(f => f.id === feedback.id ? (data[0] as PenggunaLulusan) : f);
        setLocalData('tracer_feedback', updated);
        return data[0] as PenggunaLulusan;
      }
      console.error('Supabase update error', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }

  const local = getLocalData<PenggunaLulusan>('tracer_feedback', initialFeedback);
  const updated = local.map(f => f.id === feedback.id ? feedback : f);
  setLocalData('tracer_feedback', updated);
  return feedback;
};

export const apiDeleteFeedback = async (id: string): Promise<boolean> => {
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('pengguna_lulusan')
        .delete()
        .eq('id', id);
      
      if (!error) {
        const local = getLocalData<PenggunaLulusan>('tracer_feedback', initialFeedback);
        setLocalData('tracer_feedback', local.filter(f => f.id !== id));
        return true;
      }
      console.error('Supabase delete error', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }

  const local = getLocalData<PenggunaLulusan>('tracer_feedback', initialFeedback);
  setLocalData('tracer_feedback', local.filter(f => f.id !== id));
  return true;
};

// --- Alumni Feedback API ---
export const apiGetAlumniFeedback = async (): Promise<AlumniFeedback[]> => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('alumni_feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setLocalData('tracer_alumni_feedback_cache', data);
        return data as AlumniFeedback[];
      }
      console.warn('Supabase fetch failed, falling back to cache', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }
  return getLocalData<AlumniFeedback>('tracer_alumni_feedback', initialAlumniFeedback);
};

export const apiAddAlumniFeedback = async (feedback: Omit<AlumniFeedback, 'id' | 'created_at'>): Promise<AlumniFeedback> => {
  const newFeedback: AlumniFeedback = {
    ...feedback,
    id: crypto.randomUUID ? crypto.randomUUID() : 'af_' + Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString()
  };

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('alumni_feedback')
        .insert([newFeedback])
        .select();
      
      if (!error && data && data[0]) {
        const local = getLocalData<AlumniFeedback>('tracer_alumni_feedback', initialAlumniFeedback);
        setLocalData('tracer_alumni_feedback', [data[0] as AlumniFeedback, ...local]);
        return data[0] as AlumniFeedback;
      }
      console.error('Supabase insert error', error);
    } catch (e) {
      console.error('Supabase connection error', e);
    }
  }

  const local = getLocalData<AlumniFeedback>('tracer_alumni_feedback', initialAlumniFeedback);
  const updated = [newFeedback, ...local];
  setLocalData('tracer_alumni_feedback', updated);
  return newFeedback;
};

export const apiSeedDatabase = async (reset: boolean = false): Promise<{ success: boolean; message: string }> => {
  if (!supabaseClient) {
    return { success: false, message: 'Koneksi Supabase tidak aktif. Silakan hubungkan terlebih dahulu.' };
  }
  try {
    if (reset) {
      await supabaseClient.from('alumni_feedback').delete().neq('id', '');
      await supabaseClient.from('pengguna_lulusan').delete().neq('id', '');
      await supabaseClient.from('mitra_kerjasama').delete().neq('id', '');
      await supabaseClient.from('alumni').delete().neq('id', '');
    }

    // Seed mitra_kerjasama
    const { error: errMitra } = await supabaseClient.from('mitra_kerjasama').insert(initialMitra);
    if (errMitra) throw new Error(`Gagal mengisi mitra_kerjasama: ${errMitra.message}`);

    // Seed alumni
    const { error: errAlumni } = await supabaseClient.from('alumni').insert(initialAlumni);
    if (errAlumni) throw new Error(`Gagal mengisi alumni: ${errAlumni.message}`);

    // Seed pengguna_lulusan
    const { error: errFeedback } = await supabaseClient.from('pengguna_lulusan').insert(initialFeedback);
    if (errFeedback) throw new Error(`Gagal mengisi pengguna_lulusan: ${errFeedback.message}`);

    // Seed alumni_feedback
    const { error: errAlumniFeedback } = await supabaseClient.from('alumni_feedback').insert(initialAlumniFeedback);
    if (errAlumniFeedback) throw new Error(`Gagal mengisi alumni_feedback: ${errAlumniFeedback.message}`);

    return { success: true, message: 'Database berhasil di-seed!' };
  } catch (e: any) {
    console.error('Error seeding database', e);
    return { success: false, message: e.message || 'Gagal melakukan seeding.' };
  }
};

