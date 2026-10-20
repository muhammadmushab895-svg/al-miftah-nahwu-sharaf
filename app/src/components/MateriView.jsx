import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  CheckCircle, 
  Bookmark, 
  Copy, 
  Check, 
  Layers, 
  Sparkles, 
  HelpCircle,
  FileText,
  Clock,
  ExternalLink,
  ChevronDown,
  Compass,
  Zap,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Info,
  Award,
  SlidersHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react';
import babList from '../data/01_kurikulum_bab.json';
import materiList from '../data/02_materi_kaidah.json';
import irabList from '../data/03_contoh_dan_irab.json';
import { isBookmarked, saveBookmark, getCompletedMateri, toggleMateriComplete } from '../utils/storage';
import { penjelasanAwamPerBab, getPenjelasanAwam } from '../data/penjelasan_awam';

// Visualizers
import IsimSignsVisualizer from './visualizers/IsimSignsVisualizer';
import FiilSignsVisualizer from './visualizers/FiilSignsVisualizer';
import SmartContentVisualizer from './visualizers/SmartContentVisualizer';
import WordDetectiveVisualizer from './visualizers/WordDetectiveVisualizer';
import KalamMatrixVisualizer from './visualizers/KalamMatrixVisualizer';
import IrabCompassVisualizer from './visualizers/IrabCompassVisualizer';
import SyntaxColorExplorer from './visualizers/SyntaxColorExplorer';
import AmilMaulVisualizer from './visualizers/AmilMaulVisualizer';
import LiveQuranCrossIndexerModal from './LiveQuranCrossIndexerModal';

export default function MateriView({ fontSize = 28, onJumpToQuran }) {
  // Main states
  const [selectedBabId, setSelectedBabId] = useState(babList[0]?.id_bab || 'BAB-01');
  const [selectedMateriId, setSelectedMateriId] = useState(null);
  const [searchMateri, setSearchMateri] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [completedList, setCompletedList] = useState(getCompletedMateri());

  // Learning Level Filter (Roadmap): 'ALL', 'level_1', 'level_2', 'level_3', 'level_4'
  const [activeRoadmapLevel, setActiveRoadmapLevel] = useState('ALL');

  // Mode Belajar Switcher: 'awam' (Pemula & Analogi Nyata) vs 'kitab' (Kitab Kuning & Akademik)
  const [modeBelajar, setModeBelajar] = useState('awam');

  // Mini Glosarium Modal
  const [glosariumOpen, setGlosariumOpen] = useState(false);

  // Live Quran Cross Indexer Modal
  const [crossIndexerOpen, setCrossIndexerOpen] = useState(false);

  // Roadmap Definition
  const roadmapLevels = [
    {
      id: 'level_1',
      badge: 'Level 1: Pemula',
      title: 'Pondasi & Jenis Kata',
      sub: 'Bab 1 - 7: Isim, Fi\'il, Huruf & Tanda I\'rab',
      icon: '🌱',
      color: 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/70',
      activeColor: 'bg-emerald-900 text-white ring-2 ring-emerald-600',
      startBab: 'BAB-01',
      endBab: 'BAB-07',
      babs: ['BAB-01', 'BAB-02', 'BAB-03', 'BAB-04', 'BAB-05', 'BAB-06', 'BAB-07']
    },
    {
      id: 'level_2',
      badge: 'Level 2: Menengah',
      title: 'Merangkai Kalimat',
      sub: 'Bab 8 - 14: Subjek, Predikat, Kaana & Inna',
      icon: '🧱',
      color: 'border-sky-300 hover:border-sky-500 bg-sky-50/70',
      activeColor: 'bg-sky-900 text-white ring-2 ring-sky-600',
      startBab: 'BAB-08',
      endBab: 'BAB-14',
      babs: ['BAB-08', 'BAB-09', 'BAB-10', 'BAB-11', 'BAB-12', 'BAB-13', 'BAB-14']
    },
    {
      id: 'level_3',
      badge: 'Level 3: Lanjutan',
      title: 'Hukum & Jabatan I\'rab',
      sub: 'Bab 15 - 34: Korban (Objek), Keterangan & Tawabi\'',
      icon: '⚖️',
      color: 'border-purple-300 hover:border-purple-500 bg-purple-50/70',
      activeColor: 'bg-purple-900 text-white ring-2 ring-purple-600',
      startBab: 'BAB-15',
      endBab: 'BAB-34',
      babs: babList.map(b => b.id_bab).filter(id => {
        const num = parseInt(id.replace('BAB-', ''), 10);
        return num >= 15 && num <= 34;
      })
    },
    {
      id: 'level_4',
      badge: 'Level 4: Morfologi',
      title: 'Ilmu Sharaf & Timbangan',
      sub: 'Bab 35 - 42: Wazan Kata & Perubahan Bentuk',
      icon: '🔬',
      color: 'border-amber-300 hover:border-amber-500 bg-amber-50/70',
      activeColor: 'bg-amber-900 text-white ring-2 ring-amber-600',
      startBab: 'BAB-35',
      endBab: 'BAB-42',
      babs: babList.map(b => b.id_bab).filter(id => {
        const num = parseInt(id.replace('BAB-', ''), 10);
        return num >= 35 && num <= 42;
      })
    }
  ];

  // Quick Glosarium Terms for Laypeople
  const glosariumTerms = [
    { term: 'Kalam (كَلَام)', arti: 'Rangkaian kalimat sempurna yang sudah ada subjek dan infonya, sehingga orang yang mendengar langsung paham.' },
    { term: 'Kalimah (كَلِمَة)', arti: 'Satu kata tunggal dalam bahasa Arab (baik kata benda, kerja, atau sambung).' },
    { term: 'Isim (اِسْم)', arti: 'Kata benda, nama orang, sifat, atau tempat (cirinya: bisa tanwin atau diawali Al-).' },
    { term: 'Fi\'il (فِعْل)', arti: 'Kata kerja yang terikat waktu (lampau, sekarang/akan datang, atau perintah).' },
    { term: 'Harf / Huruf (حَرْف)', arti: 'Kata tugas atau kata sambung yang baru punya arti jelas kalau digabung dengan kata lain (seperti: di, ke, dari).' },
    { term: 'I\'rab (إِعْرَاب)', arti: 'Perubahan bunyi harakat pada huruf terakhir kata Arab sesuai jabatan tugasnya dalam kalimat.' },
    { term: 'Mabni (مَبْنِيّ)', arti: 'Kata yang kebal dan terkunci mati harakat akhirnya, tidak pernah berubah selamanya (seperti kata ganti).' },
    { term: 'Marfu\' (مَرْفُوع)', arti: 'Status hukum untuk Subjek/Pelaku utama, tanda aslinya berbunyi Dhommah (ـُ / -un).' },
    { term: 'Manshub (مَنْصُوب)', arti: 'Status hukum untuk Objek/Korban/Keterangan, tanda aslinya berbunyi Fathah (ـَ / -an).' },
    { term: 'Majrur (مَجْرُور)', arti: 'Status hukum karena terseret kata depan (di/ke/dari) atau kepemilikan, tanda aslinya berbunyi Kasrah (ـِ / -in).' },
    { term: 'Majzum (مَجْزُوم)', arti: 'Status hukum khusus kata kerja yang disetop oleh huruf larangan/peniadaan, tanda aslinya berbunyi Sukun (ـْ).' },
    { term: 'Fa\'il (فَاعِل)', arti: 'Si Pelaku yang melakukan pekerjaan perbuatan (terletak setelah kata kerja).' },
    { term: 'Maf\'ul Bih (مَفْعُول بِهِ)', arti: 'Si Korban atau objek penderita yang terkena perbuatan.' },
    { term: 'Mubtada\' (مُبْتَدَأ)', arti: 'Topik utama atau subjek pembuka di awal kalimat.' },
    { term: 'Khabar (خَبَر)', arti: 'Berita atau informasi yang menjelaskan apa yang terjadi dengan si Mubtada\'.' }
  ];

  // Filtered Bab List based on Roadmap Level and Search
  const filteredBabList = useMemo(() => {
    return babList.filter(b => {
      let matchLevel = true;
      if (activeRoadmapLevel !== 'ALL') {
        const lvl = roadmapLevels.find(l => l.id === activeRoadmapLevel);
        if (lvl) {
          matchLevel = lvl.babs.includes(b.id_bab);
        }
      }

      const q = searchMateri.toLowerCase().trim();
      const matchSearch = !q || (
        b.judul_indo.toLowerCase().includes(q) ||
        b.judul_arab.includes(q) ||
        b.ringkasan_cakupan.toLowerCase().includes(q)
      );

      return matchLevel && matchSearch;
    });
  }, [activeRoadmapLevel, searchMateri]);

  // Selected Bab Object
  const selectedBab = useMemo(() => {
    return babList.find(b => b.id_bab === selectedBabId) || babList[0];
  }, [selectedBabId]);

  // Materi items for this Bab
  const subMateriList = useMemo(() => {
    return materiList.filter(m => m.id_bab === selectedBabId);
  }, [selectedBabId]);

  // Active Materi Object
  const activeMateri = useMemo(() => {
    if (selectedMateriId) {
      const found = subMateriList.find(m => m.id_materi === selectedMateriId);
      if (found) return found;
    }
    return subMateriList[0] || null;
  }, [selectedMateriId, subMateriList]);

  // Related Irab Examples for this Bab/Materi
  const relatedIrab = useMemo(() => {
    if (!activeMateri) return [];
    return irabList.filter(ex => ex.id_materi === activeMateri.id_materi || ex.id_bab === activeMateri.id_bab);
  }, [activeMateri]);

  // Penjelasan Awam for current Bab
  const penjelasanAwam = useMemo(() => {
    return getPenjelasanAwam(selectedBabId, selectedBab);
  }, [selectedBabId, selectedBab]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleComplete = (id) => {
    const updated = toggleMateriComplete(id);
    setCompletedList(updated);
  };

  const handleToggleBookmark = (m) => {
    saveBookmark({
      id: m.id_materi,
      type: 'materi',
      title: m.sub_topik_indo,
      subtitle: `${selectedBab.judul_indo} (${m.id_bab})`,
      arab: m.kaidah_arab,
      indo: m.penjelasan_indo
    });
  };

  const handleSelectLevel = (levelId, startBab) => {
    setActiveRoadmapLevel(levelId);
    if (startBab) {
      setSelectedBabId(startBab);
      setSelectedMateriId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* ============================================================== */}
      {/* 1. HERO LEARNING ROADMAP (PANDUAN BELAJAR AWAM DARI NOL)      */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/50 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-800/60 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-extrabold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              Kurikulum Terstruktur untuk Orang Awam & Santri
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Jalur Cepat Belajar Nahwu & Sharaf dari Nol
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
              Disusun bertahap dari pengenalan kata sehari-hari hingga mampu membedah dan mengi'rab seluruh 6.236 ayat Al-Qur'an secara presisi sesuai kitab <em>An-Nahwu At-Tathbiqi</em> & <em>Jami'ud Durus</em>.
            </p>
          </div>

          {/* Quick Glosarium Trigger */}
          <button
            onClick={() => setGlosariumOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs shadow-md transition-all duration-150 self-start lg:self-auto shrink-0"
          >
            <Lightbulb className="w-4 h-4 fill-current text-emerald-900" />
            <span>Kamus Istilah Awam (15 Istilah Kunci)</span>
          </button>
        </div>

        {/* 4 Roadmap Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {roadmapLevels.map((lvl) => {
            const isSelected = activeRoadmapLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => handleSelectLevel(lvl.id, lvl.startBab)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? `${lvl.activeColor} shadow-lg scale-102 ring-2 ring-amber-400`
                    : 'bg-emerald-900/40 hover:bg-emerald-800/60 border-emerald-700/50 text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{lvl.icon}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-800 text-emerald-200'
                    }`}>
                      {lvl.badge}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base leading-snug">{lvl.title}</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${isSelected ? 'text-emerald-100' : 'text-emerald-200/70'}`}>
                    {lvl.sub}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-amber-300">
                  <span>Buka Pelajaran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter reset button if active */}
        {activeRoadmapLevel !== 'ALL' && (
          <div className="flex items-center justify-between pt-1 text-xs text-emerald-200">
            <span>Menampilkan bab khusus <strong>{roadmapLevels.find(l => l.id === activeRoadmapLevel)?.title}</strong></span>
            <button
              onClick={() => setActiveRoadmapLevel('ALL')}
              className="text-amber-300 underline font-semibold hover:text-amber-200"
            >
              Lihat Seluruh 42 Bab (Lengkap)
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN WORKSPACE: SIDEBAR BAB & CONTENT CARD                 */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar: 42 Bab Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Daftar Bab Kurikulum
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded-full">
                {filteredBabList.length} Bab
              </span>
            </div>

            {/* Quick Bab Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari materi atau kaidah..."
                value={searchMateri}
                onChange={(e) => setSearchMateri(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Bab List Scrollable */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 max-h-[750px] overflow-y-auto">
            {filteredBabList.map((bab) => {
              const isSelected = selectedBabId === bab.id_bab;
              const babMateri = materiList.filter(m => m.id_bab === bab.id_bab);
              const completedCount = babMateri.filter(m => completedList.includes(m.id_materi)).length;
              const isBabCompleted = babMateri.length > 0 && completedCount === babMateri.length;

              return (
                <button
                  key={bab.id_bab}
                  onClick={() => {
                    setSelectedBabId(bab.id_bab);
                    setSelectedMateriId(null);
                  }}
                  className={`w-full p-3.5 text-left rounded-xl transition-all duration-150 flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-900 text-white shadow-md'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {bab.id_bab}
                      </span>
                      <span className={`text-[11px] truncate ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                        {bab.kategori}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm leading-snug line-clamp-2">
                      {bab.judul_indo}
                    </h4>

                    <p className={`font-arabic text-sm line-clamp-1 ${
                      isSelected ? 'text-amber-300' : 'text-emerald-800'
                    }`}>
                      {bab.judul_arab}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1.5 pt-1">
                    {isBabCompleted && (
                      <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-emerald-600'}`} />
                    )}
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                      {completedCount}/{babMateri.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area: Detailed Bab & Sub-Materi */}
        <div className="lg:col-span-8 space-y-6">
          {selectedBab && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              
              {/* Bab Header Banner */}
              <div className="space-y-3 border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                    {selectedBab.kategori} • Level {selectedBab.level}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Estimasi: {selectedBab.estimasi_jam_belajar} jam belajar</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {selectedBab.urutan}. {selectedBab.judul_indo}
                  </h2>
                  <p className="font-arabic text-2xl sm:text-3xl font-bold text-emerald-900">
                    {selectedBab.judul_arab}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedBab.ringkasan_cakupan}
                </p>

                {/* References Badges */}
                <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-emerald-900 block">📖 An-Nahwu At-Tathbiqi:</span>
                    <span className="text-slate-600">{selectedBab.ref_nahwu_tathbiqi}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-emerald-900 block">📚 Jami'ud Durus:</span>
                    <span className="text-slate-600">{selectedBab.ref_jami_durus}</span>
                  </div>
                </div>

                {/* Feature 2: Live Quran Cross-Indexer Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setCrossIndexerOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 hover:from-emerald-800 hover:to-teal-800 text-amber-300 font-extrabold text-xs shadow-md border border-emerald-600/50 transition-all transform hover:scale-[1.01]"
                  >
                    <Sparkles className="w-4 h-4 fill-amber-400 text-amber-900" />
                    <span>🔍 Jelajahi Ayat Terkait di Seluruh Al-Qur'an (6.236 Ayat)</span>
                  </button>
                </div>
              </div>

              {/* Sub-Topics Selector */}
              {subMateriList.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Sub-Topik Pembahasan ({subMateriList.length}):
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {subMateriList.map((m) => {
                      const isActive = activeMateri?.id_materi === m.id_materi;
                      const isDone = completedList.includes(m.id_materi);

                      return (
                        <button
                          key={m.id_materi}
                          onClick={() => setSelectedMateriId(m.id_materi)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                            isActive
                              ? 'bg-amber-400 text-emerald-950 ring-2 ring-amber-300'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-950' : 'text-emerald-600'}`} />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          )}
                          <span>{m.sub_topik_indo}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. ACTIVE SUB-MATERI CONTENT CARD                             */}
          {/* ============================================================== */}
          {activeMateri ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6">
              
              {/* Header & Mode Switcher Bar */}
              <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    {activeMateri.id_materi}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                    {activeMateri.sub_topik_indo}
                  </h3>
                  <p className="font-arabic text-lg text-emerald-900 font-semibold">
                    {activeMateri.sub_topik_arab}
                  </p>
                </div>

                {/* Perspective Mode Switcher */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <div className="inline-flex rounded-2xl bg-slate-200/80 p-1 border border-slate-300/80 shadow-inner">
                    <button
                      onClick={() => setModeBelajar('awam')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        modeBelajar === 'awam'
                          ? 'bg-emerald-900 text-amber-300 shadow-md font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Mode Awam (Ramah)</span>
                    </button>
                    <button
                      onClick={() => setModeBelajar('kitab')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        modeBelajar === 'kitab'
                          ? 'bg-emerald-900 text-amber-300 shadow-md font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Mode Kitab (Santri)</span>
                    </button>
                  </div>

                  {/* Complete Button */}
                  <button
                    onClick={() => handleToggleComplete(activeMateri.id_materi)}
                    className={`p-2 rounded-xl border transition ${
                      completedList.includes(activeMateri.id_materi)
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-emerald-700'
                    }`}
                    title={completedList.includes(activeMateri.id_materi) ? 'Sudah Selesai Dibaca' : 'Tandai Selesai'}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleToggleBookmark(activeMateri)}
                    className={`p-2 rounded-xl border transition ${
                      isBookmarked(activeMateri.id_materi, 'materi')
                        ? 'bg-amber-400 text-emerald-950 border-amber-500'
                        : 'bg-white text-slate-400 hover:text-amber-600 border-slate-200'
                    }`}
                    title="Simpan ke Markah"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(activeMateri.id_materi, `${activeMateri.kaidah_arab}\n\n${activeMateri.penjelasan_indo}`)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700"
                    title="Salin Kaidah"
                  >
                    {copiedId === activeMateri.id_materi ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Kaidah Arab Hero Box */}
              <div className="px-6">
                <div className="bg-[#FAF8F5] border-2 border-amber-200/90 rounded-2xl p-6 text-right space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-amber-800">
                      نَصُّ الْقَاعِدَةِ (TEKS RUMUS KAIDAH UTAMA)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Khaled Abdul Aziz • An-Nahwu At-Tathbiqi
                    </span>
                  </div>
                  <p 
                    className="font-arabic font-bold text-emerald-950 leading-loose"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {activeMateri.kaidah_arab}
                  </p>
                </div>
              </div>

              {/* Content Body Based on Learning Perspective */}
              <div className="px-6 space-y-6 pb-6">

                {/* ======================================================= */}
                {/* PERSPECTIVE A: MODE AWAM (RAMAH, ANALOGI & VISUALIZER) */}
                {/* ======================================================= */}
                {modeBelajar === 'awam' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    
                    {/* 1. Everyday Analogy Card */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50/70 border-2 border-amber-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                        <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
                          <span>{penjelasanAwam.judul_santai}</span>
                        </h4>
                        <span className="text-[11px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                          Analogi Logika Sehari-Hari
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed">
                        {penjelasanAwam.analogi}
                      </p>
                    </div>

                    {/* 2. 3-Second Quick Formula */}
                    <div className="bg-emerald-50 border-2 border-emerald-300/80 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
                      <Zap className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider block">
                          ⚡ Rumus Cepat 3 Detik (Kunci Ingatan):
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-emerald-900 leading-relaxed">
                          {penjelasanAwam.rumus_tiga_detik}
                        </p>
                      </div>
                    </div>

                    {/* 3. Interactive Context-Aware Visualizers */}
                    {/* Case 1: BAB-01 -> Kalam Matrix & Word Detective */}
                    {selectedBabId === 'BAB-01' && (
                      <div className="space-y-6">
                        <KalamMatrixVisualizer />
                        <WordDetectiveVisualizer />
                      </div>
                    )}

                    {/* Case 2: BAB-02 or BAB-03 -> Irab Compass */}
                    {(selectedBabId === 'BAB-02' || selectedBabId === 'BAB-03') && (
                      <IrabCompassVisualizer />
                    )}

                    {/* Case 3: Isim Signs Specific */}
                    {(activeMateri.id_materi === 'MAT-0103' || (activeMateri.sub_topik_indo.includes('Isim') && activeMateri.sub_topik_indo.includes('Tanda'))) && (
                      <IsimSignsVisualizer />
                    )}

                    {/* Case 4: Fi'il Signs Specific */}
                    {(activeMateri.id_materi === 'MAT-0104' || (activeMateri.sub_topik_indo.includes('Fi\'il') && activeMateri.sub_topik_indo.includes('Tanda'))) && (
                      <FiilSignsVisualizer />
                    )}

                    {/* Case 5: Sentence Structure & Roles (Bab 8 - 15) */}
                    {(['BAB-08', 'BAB-09', 'BAB-10', 'BAB-11', 'BAB-12', 'BAB-15'].includes(selectedBabId)) && (
                      <SyntaxColorExplorer />
                    )}

                    {/* Case 5b: Amil-Ma'mul Circuit Visualizer (Kaana, Inna, Zhanna, Amil Mudhari') */}
                    {(['BAB-11', 'BAB-12', 'BAB-20', 'BAB-21', 'BAB-24', 'BAB-25', 'BAB-26', 'BAB-27'].includes(selectedBabId) || 
                      activeMateri.sub_topik_indo.includes('Amil') || 
                      activeMateri.sub_topik_indo.includes('Kana') || 
                      activeMateri.sub_topik_indo.includes('Inna')) && (
                      <AmilMaulVisualizer />
                    )}

                    {/* Case 6: Smart Infographic Content Breakdown for all others */}
                    <SmartContentVisualizer
                      penjelasanIndo={activeMateri.penjelasan_indo}
                      rincianHukum={activeMateri.rincian_hukum_dan_syarat}
                      rumusRingkas={activeMateri.rumus_ringkas}
                      tanbihatKhilaf={activeMateri.tanbihat_dan_khilaf}
                    />

                    {/* 4. Practical Checklist for Beginners */}
                    {penjelasanAwam.checklist_pemula && penjelasanAwam.checklist_pemula.length > 0 && (
                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                        <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>Checklist Uji Cepat (3 Pertanyaan untuk Diri Sendiri):</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          {penjelasanAwam.checklist_pemula.map((chk, idx) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                              <span className="font-bold text-emerald-950 block">❓ {chk.tanya}</span>
                              <p className="text-slate-600">✓ {chk.ya}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. Tips Anti-Bingung */}
                    {penjelasanAwam.tips_anti_bingung && (
                      <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-4 flex items-start gap-3 text-xs">
                        <HelpCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-rose-950 block mb-0.5">⚠️ Tips Anti-Bingung / Jebakan Umum:</strong>
                          <p className="text-slate-700 leading-relaxed">{penjelasanAwam.tips_anti_bingung}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ======================================================= */}
                {/* PERSPECTIVE B: MODE BAGAN (PETA POHON & MIND MAP)       */}
                {/* ======================================================= */}
                {/* ======================================================= */}
                {/* PERSPECTIVE B: MODE KITAB (SANTRI & AKADEMIK LENGKAP)  */}
                {/* ======================================================= */}
                {modeBelajar === 'kitab' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    {/* Penjelasan Mendalam */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-2">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-700" />
                        Uraian Analisis Kaidah & Syarah (Bahasa Indonesia)
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {activeMateri.penjelasan_indo}
                      </p>
                    </div>

                    {/* Rincian Hukum & Syarat */}
                    {activeMateri.rincian_hukum_dan_syarat && (
                      <div className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200 space-y-2">
                        <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-700" />
                          Rincian Hukum, Syarat & Klasifikasi Sintaksis
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-mono">
                          {activeMateri.rincian_hukum_dan_syarat}
                        </p>
                      </div>
                    )}

                    {/* Rumus Cepat */}
                    {activeMateri.rumus_ringkas && (
                      <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-1.5">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          Rumus Ringkas Kaidah (Dhawabith)
                        </h4>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800">
                          {activeMateri.rumus_ringkas}
                        </p>
                      </div>
                    )}

                    {/* Tanbihat & Khilaf Ulama */}
                    {activeMateri.tanbihat_dan_khilaf && (
                      <div className="bg-teal-50/60 rounded-2xl p-5 border border-teal-200/70 space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-teal-950 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
                          Tanbihat Penting & Khilaf Mazhab Basrah-Kufah (Jami'ud Durus)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {activeMateri.tanbihat_dan_khilaf}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Contoh Syahid & I'rab Terkait (Available in Both Modes) */}
                {relatedIrab.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Syahid Ayat & Contoh Tathbiq Terkait ({relatedIrab.length}):
                    </h4>
                    
                    <div className="space-y-3">
                      {relatedIrab.slice(0, 3).map((ex) => (
                        <div key={ex.id_contoh} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-semibold text-emerald-800">{ex.jenis_dalil}</span>
                            <span>{ex.sumber_dalil}</span>
                          </div>
                          <p className="font-arabic text-xl font-bold text-slate-900 text-right leading-loose">
                            {ex.kalimat_arab}
                          </p>
                          <p className="text-xs text-slate-600 italic">"{ex.terjemahan_indo}"</p>
                          <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-right text-xs">
                            <strong className="text-amber-800 block text-left mb-1">Tathbiq I'rab:</strong>
                            <p className="font-arabic text-sm text-slate-800 leading-relaxed">{ex.irab_arab}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
              Pilih sub-topik materi untuk membaca kaidah.
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. MODAL: MINI GLOSARIUM ISTILAH AWAM                          */}
      {/* ============================================================== */}
      {glosariumOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
                  <Lightbulb className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Kamus Istilah Kunci untuk Orang Awam
                  </h3>
                  <p className="text-xs text-slate-500">
                    15 istilah bahasa Arab yang sering terdengar tapi jarang dipahami
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGlosariumOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1 text-xs">
              {glosariumTerms.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="font-extrabold text-emerald-950 text-sm block">
                    {item.term}
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {item.arti}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setGlosariumOpen(false)}
                className="px-5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs shadow-sm transition"
              >
                Tutup Kamus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 2: Live Quran Cross-Indexer Modal */}
      <LiveQuranCrossIndexerModal
        isOpen={crossIndexerOpen}
        onClose={() => setCrossIndexerOpen(false)}
        babId={selectedBabId}
        babJudul={selectedBab.judul_indo}
        babJudulArab={selectedBab.judul_arab}
        onJumpToQuran={onJumpToQuran}
      />

    </div>
  );
}
