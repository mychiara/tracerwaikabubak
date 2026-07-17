import React, { useState } from 'react';
import type { Alumni, MitraKerjasama } from '../data/mockData';
import { MapPin, Info, Users, ShieldAlert } from 'lucide-react';

interface SumbaMapProps {
  alumni: Alumni[];
  mitra: MitraKerjasama[];
  onSelectHospital: (hospitalName: string) => void;
}

export const SumbaMap: React.FC<SumbaMapProps> = ({ alumni, mitra, onSelectHospital }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [showHospitals, setShowHospitals] = useState(true);
  const [mapTab, setMapTab] = useState<'sumba' | 'ntt' | 'nasional'>('sumba');

  // Statistics per district
  const getDistrictStats = (districtName: string) => {
    const districtAlumni = alumni.filter(a => a.wilayah_kerja === districtName && a.status_kerja === 'Bekerja');
    const districtMitra = mitra.filter(m => m.kabupaten === districtName);
    const activeMitra = districtMitra.filter(m => m.status === 'Aktif' || m.status === 'Perpanjangan');
    
    return {
      name: districtName,
      alumniCount: districtAlumni.length,
      mitraCount: districtMitra.length,
      activeMitraCount: activeMitra.length,
      hospitals: districtMitra.map(m => ({ nama: m.nama_rs, status: m.status, id: m.id }))
    };
  };

  const districts = [
    { id: 'SBD', name: 'Sumba Barat Daya', colorClass: 'color-southwest', textX: 85, textY: 155 },
    { id: 'SB', name: 'Sumba Barat', colorClass: 'color-west', textX: 160, textY: 145 },
    { id: 'ST', name: 'Sumba Tengah', colorClass: 'color-central', textX: 222, textY: 145 },
    { id: 'STE', name: 'Sumba Timur', colorClass: 'color-east', textX: 380, textY: 165 },
  ];

  // Hospital markers mapping
  const hospitalMarkers = [
    { nama: 'RSUD Urmana Rara Mayang Waikabubak', x: 360, y: 120, kab: 'Sumba Timur' },
    { nama: 'Rumah Sakit Kristen Lindimara', x: 395, y: 135, kab: 'Sumba Timur' },
    { nama: 'RS Imanuel Waikabubak', x: 420, y: 115, kab: 'Sumba Timur' },
    { nama: 'RSUD Waikabubak', x: 150, y: 125, kab: 'Sumba Barat' },
    { nama: 'Rumah Sakit Lende Moripa', x: 175, y: 155, kab: 'Sumba Barat' },
    { nama: 'RSUD Pratama Waibakul', x: 235, y: 130, kab: 'Sumba Tengah' },
    { nama: 'RSUD Pratama Reda Bolo', x: 75, y: 135, kab: 'Sumba Barat Daya' },
    { nama: 'RS Rumah Sakit Kristen Karitas', x: 95, y: 170, kab: 'Sumba Barat Daya' },
  ];

  const activeStats = hoveredDistrict 
    ? getDistrictStats(hoveredDistrict) 
    : selectedDistrict 
      ? getDistrictStats(selectedDistrict) 
      : null;

  const sumbaDistricts = ['Sumba Timur', 'Sumba Barat', 'Sumba Tengah', 'Sumba Barat Daya'];
  
  const otherDistrictsStats = React.useMemo(() => {
    const list: string[] = [];
    alumni.forEach(a => {
      if (a.wilayah_kerja && !sumbaDistricts.includes(a.wilayah_kerja) && a.wilayah_kerja !== '-') {
        if (!list.includes(a.wilayah_kerja)) list.push(a.wilayah_kerja);
      }
    });
    mitra.forEach(m => {
      if (m.kabupaten && !sumbaDistricts.includes(m.kabupaten) && m.kabupaten !== '-') {
        if (!list.includes(m.kabupaten)) list.push(m.kabupaten);
      }
    });
    return list.map(name => getDistrictStats(name)).sort((a, b) => b.alumniCount - a.alumniCount);
  }, [alumni, mitra]);

  return (
    <div className="glass p-6 mb-8 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-color/65 pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            🗺️ Peta Interaktif Sebaran Alumni & Instansi Mitra
          </h2>
          <p className="text-sm text-muted">Pilih cakupan wilayah (Sumba / Provinsi NTT / Nasional) dan klik area untuk analisis detail.</p>
        </div>
        
        {/* Toggle Map Tabs */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            className={`btn btn-sm ${showHospitals ? 'btn-primary' : 'btn-outline'} text-xs font-bold flex items-center gap-1.5`}
            onClick={() => setShowHospitals(!showHospitals)}
          >
            <MapPin size={14} />
            {showHospitals ? 'Sembunyikan Mitra' : 'Tampilkan Mitra'}
          </button>

          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-color">
            {(['sumba', 'ntt', 'nasional'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setMapTab(tab);
                  setSelectedDistrict(null);
                  setHoveredDistrict(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all duration-200 ${
                  mapTab === tab
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                {tab === 'sumba' ? 'Sumba' : tab === 'ntt' ? 'Prov. NTT' : 'Nasional'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Map Section */}
        <div className="lg:col-span-2 flex flex-col justify-center items-center bg-slate-900/10 dark:bg-slate-900/50 rounded-xl p-4 border border-dashed border-color relative overflow-hidden min-h-[320px]">
          
          {mapTab === 'sumba' && (
            <svg viewBox="0 0 600 300" className="w-full h-auto drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
              {/* Sumba Barat Daya Path */}
              <path 
                d="M 40,130 C 50,110, 100,105, 120,115 C 130,125, 140,150, 135,170 C 130,185, 105,210, 80,205 C 55,200, 35,175, 40,130 Z" 
                className={`sumba-district color-southwest ${selectedDistrict === 'Sumba Barat Daya' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Sumba Barat Daya')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Sumba Barat Daya' ? null : 'Sumba Barat Daya')}
              />

              {/* Sumba Barat Path */}
              <path 
                d="M 120,115 C 140,105, 170,100, 185,115 C 190,130, 195,160, 180,175 C 170,185, 145,180, 135,170 C 140,150, 130,125, 120,115 Z" 
                className={`sumba-district color-west ${selectedDistrict === 'Sumba Barat' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Sumba Barat')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Sumba Barat' ? null : 'Sumba Barat')}
              />

              {/* Sumba Tengah Path */}
              <path 
                d="M 185,115 C 205,100, 240,95, 260,110 C 265,130, 270,170, 250,185 C 235,195, 195,190, 180,175 C 195,160, 190,130, 185,115 Z" 
                className={`sumba-district color-central ${selectedDistrict === 'Sumba Tengah' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Sumba Tengah')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Sumba Tengah' ? null : 'Sumba Tengah')}
              />

              {/* Sumba Timur Path */}
              <path 
                d="M 260,110 C 310,90, 420,80, 480,100 C 530,120, 550,150, 520,190 C 490,220, 400,240, 340,230 C 290,220, 270,195, 250,185 C 270,170, 265,130, 260,110 Z" 
                className={`sumba-district color-east ${selectedDistrict === 'Sumba Timur' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Sumba Timur')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Sumba Timur' ? null : 'Sumba Timur')}
              />

              {/* Labels */}
              {districts.map(d => (
                <g key={d.id} className="pointer-events-none">
                  <text x={d.textX} y={d.textY} textAnchor="middle" className="district-label text-[10px] dark:fill-white font-bold opacity-80">
                    {d.name.split(' ').slice(1).join(' ') || d.name}
                  </text>
                  <text x={d.textX} y={d.textY + 12} textAnchor="middle" className="fill-slate-600 dark:fill-slate-350 font-bold text-[9px]">
                    ({alumni.filter(a => a.wilayah_kerja === d.name && a.status_kerja === 'Bekerja').length} Alumni)
                  </text>
                </g>
              ))}

              {/* Hospital Markers */}
              {showHospitals && hospitalMarkers.map((h, idx) => {
                const activeMitra = mitra.find(m => m.nama_rs === h.nama);
                const isPartner = !!activeMitra;
                const statusColor = activeMitra?.status === 'Aktif' 
                  ? '#10b981' 
                  : activeMitra?.status === 'Perpanjangan' 
                    ? '#f59e0b' 
                    : '#ef4444';
                
                const workingCount = alumni.filter(a => a.nama_institusi === h.nama).length;

                return (
                  <g key={idx} className="cursor-pointer group" onClick={(e) => { e.stopPropagation(); onSelectHospital(h.nama); }}>
                    <circle cx={h.x} cy={h.y} r={6} fill={isPartner ? statusColor : '#94a3b8'} stroke="#fff" strokeWidth={1.5} />
                    {workingCount > 0 && (
                      <circle cx={h.x} cy={h.y} r={12} fill="none" stroke={isPartner ? statusColor : '#94a3b8'} strokeWidth={1} className="animate-ping opacity-30 pointer-events-none" />
                    )}
                    <title>{`${h.nama} (${workingCount} Alumni Bekerja)`}</title>
                  </g>
                );
              })}
            </svg>
          )}

          {mapTab === 'ntt' && (
            <svg viewBox="0 0 600 300" className="w-full h-auto drop-shadow-lg" xmlns="http://www.w3.org/2050/svg">
              {/* Flores Island Path */}
              <path 
                d="M 100,100 Q 250,70 420,100 Q 430,115 350,120 Q 250,115 100,110 Z" 
                className={`sumba-district color-southwest ${selectedDistrict === 'Flores' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Flores')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Flores' ? null : 'Flores')}
              />
              {/* Sumba Island Path */}
              <path 
                d="M 120,180 C 150,170, 200,170, 230,185 C 240,195, 190,210, 160,210 C 130,205, 110,195, 120,180 Z" 
                className={`sumba-district color-central ${selectedDistrict === 'Sumba Timur' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Sumba Timur')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Sumba Timur' ? null : 'Sumba Timur')}
              />
              {/* Timor Island Path */}
              <path 
                d="M 380,180 L 450,140 C 470,130, 490,150, 480,170 L 410,220 C 390,230, 370,200, 380,180 Z" 
                className={`sumba-district color-east ${selectedDistrict === 'Kota Kupang' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Kota Kupang')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Kota Kupang' ? null : 'Kota Kupang')}
              />
              {/* Alor Circle */}
              <circle 
                cx={445} cy={100} r={15} 
                className={`sumba-district color-west ${selectedDistrict === 'Alor' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Alor')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Alor' ? null : 'Alor')}
              />
              {/* Rote Circle */}
              <circle 
                cx={360} cy={235} r={12} 
                className={`sumba-district color-west ${selectedDistrict === 'Rote Ndao' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Rote Ndao')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Rote Ndao' ? null : 'Rote Ndao')}
              />
              
              {/* Labels */}
              <text x={260} y={115} className="district-label text-[10px] fill-slate-700 dark:fill-white font-bold pointer-events-none">Pulau Flores</text>
              <text x={175} y={200} className="district-label text-[10px] fill-slate-700 dark:fill-white font-bold pointer-events-none">Pulau Sumba</text>
              <text x={440} y={195} className="district-label text-[10px] fill-slate-700 dark:fill-white font-bold pointer-events-none">Timor / Kupang</text>
              <text x={445} y={90} className="district-label text-[9px] fill-slate-700 dark:fill-white font-bold pointer-events-none">Alor</text>
              <text x={330} y={245} className="district-label text-[9px] fill-slate-700 dark:fill-white font-bold pointer-events-none">Rote</text>
            </svg>
          )}

          {mapTab === 'nasional' && (
            <svg viewBox="0 0 600 300" className="w-full h-auto drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
              {/* Sumatra */}
              <path 
                d="M 50,60 L 150,140 C 160,150, 120,190, 100,170 L 30,90 Z" 
                className={`sumba-district color-southwest ${selectedDistrict === 'Sumatra' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Sumatra')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Sumatra' ? null : 'Sumatra')}
              />
              {/* Jawa */}
              <path 
                d="M 120,200 L 250,210 C 260,210, 260,220, 250,220 L 120,210 Z" 
                className={`sumba-district color-west ${selectedDistrict === 'Jawa' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Jawa')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Jawa' ? null : 'Jawa')}
              />
              {/* Kalimantan */}
              <path 
                d="M 200,70 Q 250,60 280,100 Q 300,150 250,160 Q 180,150 200,70 Z" 
                className={`sumba-district color-central ${selectedDistrict === 'Kalimantan' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Kalimantan')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Kalimantan' ? null : 'Kalimantan')}
              />
              {/* Sulawesi */}
              <path 
                d="M 330,100 L 370,105 L 375,80 L 385,80 L 380,110 L 410,115 L 410,125 L 380,125 L 390,155 L 380,160 L 370,130 L 330,130 Z" 
                className={`sumba-district color-east ${selectedDistrict === 'Sulawesi' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Sulawesi')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Sulawesi' ? null : 'Sulawesi')}
              />
              {/* Papua */}
              <path 
                d="M 480,120 Q 520,110 550,140 Q 560,165 540,185 Q 500,190 480,160 Z" 
                className={`sumba-district color-southwest ${selectedDistrict === 'Papua' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Papua')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Papua' ? null : 'Papua')}
              />
              {/* Nusa Tenggara */}
              <path 
                d="M 260,220 Q 350,225 410,210 Q 420,215 410,220 Q 350,235 260,220 Z" 
                className={`sumba-district color-central ${selectedDistrict === 'Sumba Timur' ? 'stroke-primary fill-opacity-80' : ''}`}
                onMouseEnter={() => setHoveredDistrict('Sumba Timur')}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(selectedDistrict === 'Sumba Timur' ? null : 'Sumba Timur')}
              />

              {/* Labels */}
              <text x={80} y={110} className="district-label text-[10px] fill-slate-700 dark:fill-white font-bold pointer-events-none">Sumatra</text>
              <text x={180} y={235} className="district-label text-[10px] fill-slate-700 dark:fill-white font-bold pointer-events-none">Jawa</text>
              <text x={240} y={110} className="district-label text-[10px] fill-slate-700 dark:fill-white font-bold pointer-events-none">Kalimantan</text>
              <text x={380} y={145} className="district-label text-[10px] fill-slate-700 dark:fill-white font-bold pointer-events-none">Sulawesi</text>
              <text x={510} y={155} className="district-label text-[10px] fill-slate-700 dark:fill-white font-bold pointer-events-none">Papua</text>
              <text x={330} y={245} className="district-label text-[9px] fill-slate-700 dark:fill-white font-bold pointer-events-none">Nusa Tenggara</text>
            </svg>
          )}

        </div>

        {/* Details Sidebar */}
        <div className="flex flex-col justify-between">
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-color h-full flex flex-col">
            {activeStats ? (
              <div>
                <h3 className="text-lg font-bold border-bottom pb-2 mb-3 flex items-center gap-2 text-primary">
                  <Info size={18} />
                  {activeStats.name}
                </h3>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-color shadow-sm">
                    <span className="text-[11px] text-muted block">Alumni Bekerja</span>
                    <span className="text-xl font-bold flex items-center gap-1.5 mt-1">
                      <Users size={16} className="text-teal-500" />
                      {activeStats.alumniCount}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-color shadow-sm">
                    <span className="text-[11px] text-muted block">Mitra Aktif</span>
                    <span className="text-xl font-bold flex items-center gap-1.5 mt-1 text-emerald-500">
                      🏥 {activeStats.activeMitraCount}
                      <span className="text-[10px] text-muted font-normal">/ {activeStats.mitraCount}</span>
                    </span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Daftar Instansi / Mitra & Kemitraan:</h4>
                {activeStats.hospitals.length > 0 ? (
                  <ul className="space-y-2 overflow-y-auto max-h-[160px] pr-1">
                    {activeStats.hospitals.map(h => {
                      const workingCount = alumni.filter(a => a.nama_institusi === h.nama).length;
                      return (
                        <li 
                          key={h.id} 
                          className="bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-color text-xs flex justify-between items-center hover:border-primary cursor-pointer"
                          onClick={() => onSelectHospital(h.nama)}
                        >
                          <div className="font-semibold pr-2 truncate max-w-[140px]">{h.nama}</div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-muted">{workingCount} Alumni</span>
                            <span className={`w-2 h-2 rounded-full ${
                              h.status === 'Aktif' 
                                ? 'bg-emerald-500' 
                                : h.status === 'Perpanjangan' 
                                  ? 'bg-amber-500' 
                                  : 'bg-rose-500'
                            }`}></span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-xs text-muted italic bg-white dark:bg-slate-800 p-3 rounded-lg border border-dashed border-color text-center py-6">
                    Belum ada mitra terdaftar di wilayah ini.
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center my-auto py-8">
                <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mb-3">
                  <Info size={24} />
                </div>
                <h3 className="font-bold text-sm">Informasi Wilayah Kerja</h3>
                <p className="text-xs text-muted max-w-[200px] mt-1">Sorot atau klik kabupaten di peta untuk menampilkan data sebaran mitra & alumni.</p>
              </div>
            )}

            {/* Expiring Agreements Warning */}
            {mitra.some(m => {
              if (m.status !== 'Aktif') return false;
              const expire = new Date(m.tanggal_berakhir);
              const limit = new Date();
              limit.setMonth(limit.getMonth() + 3); // 3 months warning
              return expire <= limit && expire >= new Date();
            }) && (
              <div className="mt-4 bg-amber-500/10 border border-amber-500/25 p-3 rounded-lg flex gap-2.5 text-xs text-amber-700 dark:text-amber-300">
                <ShieldAlert size={18} className="shrink-0" />
                <div>
                  <span className="font-bold block">Peringatan Kemitraan!</span>
                  Terdapat dokumen kerjasama RS yang akan berakhir dalam waktu dekat (&lt; 3 bulan).
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wilayah Lain di Luar Sumba */}
      {otherDistrictsStats.length > 0 && (
        <div className="mt-8 pt-6 border-t border-color">
          <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            🌍 Sebaran Wilayah Lainnya (Luar Pulau Sumba / NTT / Nasional)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {otherDistrictsStats.map(stat => (
              <div 
                key={stat.name}
                className={`p-3.5 rounded-xl border border-color transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-sm ${
                  selectedDistrict === stat.name 
                    ? 'bg-primary-light border-primary text-primary' 
                    : 'bg-white dark:bg-slate-800/50 hover:border-primary'
                }`}
                onClick={() => setSelectedDistrict(selectedDistrict === stat.name ? null : stat.name)}
              >
                <div className="text-xs font-black truncate" title={stat.name}>{stat.name}</div>
                <div className="flex justify-between items-center mt-2.5">
                  <span className="text-[10px] text-muted font-bold">
                    👥 {stat.alumniCount} Alumni
                  </span>
                  <span className="text-[10px] text-muted font-bold">
                    🤝 {stat.mitraCount} Mitra
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
