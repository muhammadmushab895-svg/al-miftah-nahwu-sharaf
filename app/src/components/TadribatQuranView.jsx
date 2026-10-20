import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  BookOpen, 
  Bookmark, 
  Copy, 
  Check, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  SlidersHorizontal,
  RefreshCw,
  Lightbulb,
  Award,
  Layers,
  Eye,
  Info,
  Hash,
  Compass,
  BookCheck,
  ListOrdered,
  ChevronDown
} from 'lucide-react';
import quranExercisesData from '../data/06_latihan_quran.json';
import { isBookmarked, saveBookmark } from '../utils/storage';

export default function TadribatQuranView({ fontSize = 28, onOpenMateri, targetLocation }) {
  // Main View Navigation: 'mushaf' (114 Surah, 6.236 Ayat) vs 'latihan' (520 Soal Binyah)
  const [mainView, setMainView] = useState('mushaf');

  // ==========================================
  // STATE FOR MUSHAF 114 SURAH (6.236 AYAT)
  // ==========================================
  const [surahList, setSurahList] = useState([]);
  const [selectedSurahId, setSelectedSurahId] = useState(1);
  const [surahSearch, setSurahSearch] = useState('');
  const [surahDropdownOpen, setSurahDropdownOpen] = useState(false);
  
  const [currentSurahData, setCurrentSurahData] = useState(null);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [surahError, setSurahError] = useState(null);

  // In-memory cache for surahs so switching is instant
  const surahCache = useRef({});

  // Filter within current Surah
  const [mushafAyahSearch, setMushafAyahSearch] = useState('');
  const [mushafPage, setMushafPage] = useState(1);
  const ayahsPerPage = 20;

  // Active word inspected in Mushaf: { surahId, ayatId, wordIdx, wordData, verseText }
  const [inspectedMushafWord, setInspectedMushafWord] = useState(null);

  // Expanded tables in Mushaf: { [ayahId]: boolean }
  const [mushafExpandedTables, setMushafExpandedTables] = useState({});

  // Syntactic color layer toggle
  const [highlightSyntax, setHighlightSyntax] = useState(true);

  // ==========================================
  // STATE FOR LATIHAN TEMATIK (520 AYAT)
  // ==========================================
  const [selectedBinyah, setSelectedBinyah] = useState('ALL');
  const [selectedJuz, setSelectedJuz] = useState('ALL');
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');
  const [exercisePage, setExercisePage] = useState(1);
  const exerciseItemsPerPage = 12;

  // Sub-mode in Latihan: 'inspector' vs 'quiz'
  const [exerciseSubMode, setExerciseSubMode] = useState('inspector');
  const [inspectedExerciseWord, setInspectedExerciseWord] = useState(null);
  const [expandedExerciseTableAyah, setExpandedExerciseTableAyah] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});

  // Copy state
  const [copiedId, setCopiedId] = useState(null);
  const [bookmarkUpdate, setBookmarkUpdate] = useState(0);

  // Target navigation ref
  const pendingAyahRef = useRef(null);

  // Listen for targetLocation jump requests
  useEffect(() => {
    if (!targetLocation) return;
    setMainView('mushaf');

    let targetSurahId = parseInt(targetLocation.surahNameOrId || targetLocation.surahId, 10);
    if (isNaN(targetSurahId) && surahList.length > 0) {
      const clean = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const searchTarget = clean(targetLocation.surahNameOrId || targetLocation.surah);
      const found = surahList.find(s => clean(s.name_id) === searchTarget || clean(s.name_ar) === searchTarget);
      if (found) targetSurahId = found.id;
      else targetSurahId = 1;
    }

    const targetAyah = parseInt(targetLocation.ayahNumber || targetLocation.ayah, 10) || 1;
    pendingAyahRef.current = targetAyah;

    if (targetSurahId) {
      if (selectedSurahId === targetSurahId) {
        const targetPage = Math.ceil(targetAyah / ayahsPerPage) || 1;
        setMushafPage(targetPage);
        setMushafExpandedTables(prev => ({
          ...prev,
          [`${targetSurahId}:${targetAyah}`]: true
        }));
        setTimeout(() => {
          const el = document.getElementById(`mushaf-ayah-${targetAyah}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          pendingAyahRef.current = null;
        }, 400);
      } else {
        setSelectedSurahId(targetSurahId);
      }
    }
  }, [targetLocation, surahList]);

  // Fetch Surah list on mount
  useEffect(() => {
    fetch('/data/quran/surah_list.json')
      .then(res => res.json())
      .then(data => {
        setSurahList(data);
      })
      .catch(err => {
        console.error('Gagal memuat daftar surah:', err);
      });
  }, []);

  // Fetch individual Surah data when selectedSurahId changes
  useEffect(() => {
    if (!selectedSurahId) return;

    const applyPendingAyah = (targetSurahId) => {
      const targetAyah = pendingAyahRef.current;
      if (targetAyah) {
        const targetPage = Math.ceil(targetAyah / ayahsPerPage) || 1;
        setMushafPage(targetPage);
        setMushafExpandedTables(prev => ({
          ...prev,
          [`${targetSurahId}:${targetAyah}`]: true
        }));
        setTimeout(() => {
          const el = document.getElementById(`mushaf-ayah-${targetAyah}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          pendingAyahRef.current = null;
        }, 500);
      } else {
        setMushafPage(1);
        setMushafExpandedTables({});
      }
    };

    if (surahCache.current[selectedSurahId]) {
      setCurrentSurahData(surahCache.current[selectedSurahId]);
      setMushafAyahSearch('');
      setInspectedMushafWord(null);
      applyPendingAyah(selectedSurahId);
      return;
    }

    setLoadingSurah(true);
    setSurahError(null);

    fetch(`/data/quran/surah_${selectedSurahId}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        surahCache.current[selectedSurahId] = data;
        setCurrentSurahData(data);
        setMushafAyahSearch('');
        setInspectedMushafWord(null);
        applyPendingAyah(selectedSurahId);
        setLoadingSurah(false);
      })
      .catch(err => {
        console.error(`Gagal memuat surah ${selectedSurahId}:`, err);
        setSurahError(`Gagal memuat data Surah nomor ${selectedSurahId}.`);
        setLoadingSurah(false);
      });
  }, [selectedSurahId]);

  // Color helper for syntax status
  const getStatusColor = (status) => {
    if (!status) return 'text-slate-800 hover:bg-amber-100';
    const s = status.toLowerCase();
    if (s.includes('marfu')) return 'bg-emerald-100/90 text-emerald-900 border-emerald-300 hover:bg-emerald-200';
    if (s.includes('manshub')) return 'bg-sky-100/90 text-sky-900 border-sky-300 hover:bg-sky-200';
    if (s.includes('majrur')) return 'bg-purple-100/90 text-purple-900 border-purple-300 hover:bg-purple-200';
    if (s.includes('majzum')) return 'bg-rose-100/90 text-rose-900 border-rose-300 hover:bg-rose-200';
    if (s.includes('mabni')) return 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200';
    return 'bg-slate-100 text-slate-800 hover:bg-slate-200';
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleMushafTable = (ayahId) => {
    setMushafExpandedTables(prev => ({ ...prev, [ayahId]: !prev[ayahId] }));
  };

  const toggleExerciseTable = (itemId) => {
    setExpandedExerciseTableAyah(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Filtered Surahs in dropdown
  const filteredSurahList = useMemo(() => {
    const q = surahSearch.toLowerCase().trim();
    if (!q) return surahList;
    return surahList.filter(s => 
      String(s.id).includes(q) ||
      s.name_id.toLowerCase().includes(q) ||
      s.name_ar.includes(q) ||
      s.type.toLowerCase().includes(q) ||
      String(s.juz).includes(q)
    );
  }, [surahList, surahSearch]);

  // Filtered Ayahs in current Surah
  const filteredMushafAyahs = useMemo(() => {
    if (!currentSurahData || !currentSurahData.ayat) return [];
    const q = mushafAyahSearch.toLowerCase().trim();
    if (!q) return currentSurahData.ayat;
    return currentSurahData.ayat.filter(a => 
      String(a.ayat_id).includes(q) ||
      a.teks_ayat_arab.includes(q) ||
      (a.kata_per_kata && a.kata_per_kata.some(k => 
        k.kata_arab.includes(q) ||
        k.kedudukan_irab?.toLowerCase().includes(q) ||
        k.akar_kata?.includes(q) ||
        k.jenis_kata_sharaf?.toLowerCase().includes(q) ||
        k.wazan_sharaf?.includes(q)
      ))
    );
  }, [currentSurahData, mushafAyahSearch]);

  // Paginated Mushaf Ayahs
  const totalMushafPages = Math.ceil(filteredMushafAyahs.length / ayahsPerPage) || 1;
  const currentMushafAyahs = useMemo(() => {
    const start = (mushafPage - 1) * ayahsPerPage;
    return filteredMushafAyahs.slice(start, start + ayahsPerPage);
  }, [filteredMushafAyahs, mushafPage]);

  // ==========================================
  // LATIHAN TEMATIK COMPUTATIONS
  // ==========================================
  const binyahCategories = useMemo(() => {
    const set = new Set();
    quranExercisesData.forEach(item => {
      if (item.kategori_binyah) set.add(item.kategori_binyah);
    });
    return Array.from(set).sort();
  }, []);

  const filteredExercises = useMemo(() => {
    return quranExercisesData.filter(item => {
      const matchBinyah = selectedBinyah === 'ALL' || item.kategori_binyah === selectedBinyah;
      const matchJuz = selectedJuz === 'ALL' || String(item.juz) === String(selectedJuz);
      const q = exerciseSearchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        item.surah.toLowerCase().includes(q) ||
        String(item.ayat).includes(q) ||
        item.teks_ayat_arab.includes(q) ||
        item.terjemahan_indo.toLowerCase().includes(q) ||
        item.kategori_binyah?.toLowerCase().includes(q) ||
        item.fokus_bab_nahwu?.toLowerCase().includes(q) ||
        item.kata_kunci_syahid?.includes(q)
      );
      return matchBinyah && matchJuz && matchSearch;
    });
  }, [selectedBinyah, selectedJuz, exerciseSearchQuery]);

  const totalExercisePages = Math.ceil(filteredExercises.length / exerciseItemsPerPage) || 1;
  const currentExercises = useMemo(() => {
    const start = (exercisePage - 1) * exerciseItemsPerPage;
    return filteredExercises.slice(start, start + exerciseItemsPerPage);
  }, [filteredExercises, exercisePage]);

  const handleSelectQuizOption = (item, optionKey) => {
    const isCorrect = optionKey.toUpperCase() === item.pertanyaan_latihan.jawaban_benar.toUpperCase();
    setQuizAnswers(prev => ({
      ...prev,
      [item.id_latihan]: {
        selected: optionKey,
        isCorrect,
        showExplanation: true
      }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Hero Banner: 114 Surah & 6.236 Ayat */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/50">
        <div className="absolute -right-8 -bottom-10 opacity-10 font-arabic text-[180px] pointer-events-none select-none text-amber-300">
          القرآن
        </div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Koleksi Lengkap 114 Surah &bull; 6.236 Ayat &bull; 77.429 Kata</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Tadribat Qur'aniyyah & Mushaf I'rab Presisi
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Bedah sintaksis dan morfologi kata per kata untuk seluruh ayat Al-Qur'an secara presisi dengan metodologi ilmiah <span className="text-amber-300 font-semibold">An-Nahwu At-Tathbiqi</span> dan derivasi wazan <span className="text-amber-300 font-semibold">Jami'ud Durus Al-'Arabiyyah</span>.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setMainView('mushaf')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-md ${
                mainView === 'mushaf'
                  ? 'bg-amber-400 text-emerald-950 ring-2 ring-amber-300'
                  : 'bg-emerald-950/70 text-emerald-100 hover:bg-emerald-900 border border-emerald-700/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Mushaf 114 Surah (6.236 Ayat Kata per Kata)</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-900/40 text-emerald-950 font-extrabold">
                100% Qur'an
              </span>
            </button>

            <button
              onClick={() => setMainView('latihan')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-md ${
                mainView === 'latihan'
                  ? 'bg-amber-400 text-emerald-950 ring-2 ring-amber-300'
                  : 'bg-emerald-950/70 text-emerald-100 hover:bg-emerald-900 border border-emerald-700/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Bank Latihan & Kuis Tematik (520 Soal)</span>
            </button>

            {/* Syntactic Color Toggle */}
            <button
              onClick={() => setHighlightSyntax(!highlightSyntax)}
              className={`sm:ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                highlightSyntax
                  ? 'bg-emerald-800/80 text-amber-300 border-amber-400/40'
                  : 'bg-emerald-950/50 text-emerald-300 border-emerald-800'
              }`}
              title="Aktifkan / nonaktifkan penyorot warna sintaksis status i'rab"
            >
              <Eye className="w-3.5 h-3.5" />
              {highlightSyntax ? 'Warna Sintaksis: ON' : 'Warna Sintaksis: OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Syntax Legend Bar */}
      {highlightSyntax && (
        <div className="bg-white/90 backdrop-blur rounded-2xl p-3 sm:p-4 border border-emerald-100 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Keterangan Penyorot Warna Sintaksis I'rab:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Marfu' (Rafa')
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 font-semibold border border-sky-300">
              <span className="w-2 h-2 rounded-full bg-sky-600"></span> Manshub (Nashab)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-100 text-purple-900 font-semibold border border-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span> Majrur (Khafadh/Jarr)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-semibold border border-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span> Majzum (Jazm)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-semibold border border-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span> Mabni
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 1: MUSHAF 114 SURAH (6.236 AYAT KATA PER KATA)       */}
      {/* ======================================================== */}
      {mainView === 'mushaf' && (
        <div className="space-y-6">
          
          {/* Surah Selector & Controller Bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              
              {/* Surah Dropdown Selector */}
              <div className="relative md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Pilih Surah (1 - 114):
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSurahDropdownOpen(!surahDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-left hover:bg-emerald-50 transition focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-900 text-amber-300 font-mono font-bold flex items-center justify-center text-xs">
                        {selectedSurahId}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 text-base">
                          {surahList.find(s => s.id === selectedSurahId)?.name_id || 'Memuat Surah...'}
                        </span>
                        <span className="font-arabic font-bold text-lg text-emerald-800 ml-2">
                          {surahList.find(s => s.id === selectedSurahId)?.name_ar}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{surahList.find(s => s.id === selectedSurahId)?.ayat_count} Ayat</span>
                      <ChevronDown className="w-4 h-4 text-emerald-700" />
                    </div>
                  </button>

                  {/* Dropdown Menu Modal */}
                  {surahDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 max-h-96 flex flex-col space-y-2 animate-in fade-in duration-150">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="Cari Surah nomor, nama Latin atau Arab..."
                          value={surahSearch}
                          onChange={(e) => setSurahSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          autoFocus
                        />
                      </div>
                      
                      <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
                        {filteredSurahList.map(surah => (
                          <button
                            key={surah.id}
                            onClick={() => {
                              setSelectedSurahId(surah.id);
                              setSurahDropdownOpen(false);
                              setSurahSearch('');
                            }}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition hover:bg-emerald-50 ${
                              selectedSurahId === surah.id ? 'bg-emerald-100/70 font-bold' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-mono text-xs flex items-center justify-center font-bold">
                                {surah.id}
                              </span>
                              <div>
                                <span className="text-sm text-slate-900 font-semibold">{surah.name_id}</span>
                                <span className="text-xs text-slate-400 block">{surah.type} &bull; Juz {surah.juz}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-arabic font-bold text-lg text-emerald-900 block">{surah.name_ar}</span>
                              <span className="text-[10px] text-slate-400">{surah.ayat_count} Ayat</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Prev / Next Surah Quick Controls */}
              <div className="flex items-center justify-between md:justify-end gap-2 pt-5">
                <button
                  disabled={selectedSurahId <= 1}
                  onClick={() => setSelectedSurahId(prev => Math.max(1, prev - 1))}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Surah Sebelumnya</span>
                </button>
                <button
                  disabled={selectedSurahId >= 114}
                  onClick={() => setSelectedSurahId(prev => Math.min(114, prev + 1))}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition"
                >
                  <span>Surah Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Surah Meta & In-Surah Search */}
            {currentSurahData && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-900 text-amber-300 text-xs font-bold">
                    Surah Ke-{currentSurahData.id}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {currentSurahData.type}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    Juz {currentSurahData.juz}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                    Total: {currentSurahData.total_ayat_valid} Ayat (100% Terverifikasi)
                  </span>
                </div>

                {/* Filter within surah */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari kata/ayat di surah ini..."
                    value={mushafAyahSearch}
                    onChange={(e) => {
                      setMushafAyahSearch(e.target.value);
                      setMushafPage(1);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  {mushafAyahSearch && (
                    <button
                      onClick={() => setMushafAyahSearch('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-[10px] bg-slate-200 rounded-full px-1.5"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Loading or Error State */}
          {loadingSurah && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-600">Memuat data I'rab kata per kata Surah {selectedSurahId}...</p>
            </div>
          )}

          {surahError && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800 space-y-2">
              <p className="font-bold">{surahError}</p>
              <button
                onClick={() => setSelectedSurahId(selectedSurahId)}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* List of Ayahs in Mushaf */}
          {!loadingSurah && currentSurahData && (
            <div className="space-y-6">
              
              {currentMushafAyahs.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-500">
                  Tidak ada ayat yang cocok dengan kata pencarian "{mushafAyahSearch}".
                </div>
              ) : (
                currentMushafAyahs.map((ayah) => {
                  const ayahIdStr = `${ayah.surah_id}:${ayah.ayat_id}`;
                  const isTableOpen = mushafExpandedTables[ayahIdStr];

                  return (
                    <div
                      key={ayahIdStr}
                      id={`mushaf-ayah-${ayah.ayat_id}`}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      {/* Ayah Card Header */}
                      <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-white px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-emerald-900 text-amber-300 font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                            {ayah.ayat_id}
                          </span>
                          <div>
                            <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                              QS. {ayah.surah_name} <span className="text-xs text-emerald-700 font-semibold font-mono">[{ayah.surah_id}:{ayah.ayat_id}]</span>
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-mono">
                            {ayah.total_kata} Kata
                          </span>

                          {/* Copy Ayah Button */}
                          <button
                            onClick={() => handleCopy(ayahIdStr, `${ayah.teks_ayat_arab}\n(QS. ${ayah.surah_name}: ${ayah.ayat_id})`)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
                            title="Salin Ayat Arab"
                          >
                            {copiedId === ayahIdStr ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Arabic Ayah Text with Interactive Word Chips */}
                      <div className="p-6 bg-[#FCFBF8] border-b border-slate-100 space-y-4">
                        <div className="text-right flex flex-wrap flex-row-reverse items-center gap-x-2 gap-y-3 leading-loose py-2">
                          {ayah.kata_per_kata && ayah.kata_per_kata.map((k, wordIdx) => {
                            const isInspected = inspectedMushafWord && 
                              inspectedMushafWord.ayahIdStr === ayahIdStr && 
                              inspectedMushafWord.wordIdx === wordIdx;
                            const statusClass = highlightSyntax ? getStatusColor(k.status_hukum) : 'hover:bg-amber-100 text-slate-900';

                            return (
                              <button
                                key={wordIdx}
                                onClick={() => {
                                  if (isInspected) {
                                    setInspectedMushafWord(null);
                                  } else {
                                    setInspectedMushafWord({
                                      ayahIdStr,
                                      wordIdx,
                                      wordData: k,
                                      ayah
                                    });
                                  }
                                }}
                                className={`font-quran px-3.5 py-1.5 rounded-xl transition-all duration-150 border cursor-pointer ${
                                  isInspected
                                    ? 'ring-3 ring-amber-500 shadow-lg scale-105 bg-amber-300 text-emerald-950 font-bold border-amber-500'
                                    : `${statusClass} border-transparent`
                                }`}
                                style={{ fontSize: `${fontSize}px` }}
                                title={`Klik untuk bedah I'rab & Sharaf: ${k.kata_arab}`}
                              >
                                {k.kata_arab}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Word Inspector Card (Dual Pillars: Nahwu & Sharaf) */}
                      {inspectedMushafWord && inspectedMushafWord.ayahIdStr === ayahIdStr && (
                        <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-50/95 via-orange-50/40 to-white border-b-2 border-amber-300 space-y-4 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-quran text-3xl font-bold text-emerald-950">
                                {inspectedMushafWord.wordData.kata_arab}
                              </span>
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(inspectedMushafWord.wordData.status_hukum)}`}>
                                Status: {inspectedMushafWord.wordData.status_hukum}
                              </span>
                              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                                ID: {inspectedMushafWord.wordData.id_kata}
                              </span>
                            </div>
                            <button
                              onClick={() => setInspectedMushafWord(null)}
                              className="text-xs text-amber-900 hover:text-black font-bold bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition"
                            >
                              Tutup Bedah Kata ✕
                            </button>
                          </div>

                          {/* Dual Pillars Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Pilar 1: Sintaksis & I'rab Nahwu */}
                            <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs space-y-3">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wide border-b border-emerald-100 pb-2">
                                <BookOpen className="w-4 h-4 text-emerald-700" />
                                1. Analisis I'rab Nahwu (Sintaksis)
                              </div>
                              
                              <div>
                                <span className="text-[11px] text-slate-400 block">Kedudukan I'rab (موقع الإعراب):</span>
                                <p className="font-arabic font-bold text-base text-emerald-950 mt-0.5 leading-relaxed text-right">
                                  {inspectedMushafWord.wordData.kedudukan_irab}
                                </p>
                                {inspectedMushafWord.wordData.kedudukan_indo && (
                                  <p className="text-xs text-slate-600 mt-1 font-medium">
                                    {inspectedMushafWord.wordData.kedudukan_indo}
                                  </p>
                                )}
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-slate-500">Tanda I'rab:</span>
                                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {inspectedMushafWord.wordData.tanda_irab}
                                </span>
                              </div>

                              {inspectedMushafWord.wordData.rincian_segmen && (
                                <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                                  <span className="text-slate-400 block text-[10px]">Segmen Morfo-Sintaksis:</span>
                                  <span className="font-mono text-emerald-900 font-semibold">{inspectedMushafWord.wordData.rincian_segmen}</span>
                                </div>
                              )}
                            </div>

                            {/* Pilar 2: Morfologi & Derivasi Sharaf */}
                            <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-2xs space-y-3">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wide border-b border-amber-100 pb-2">
                                <Sparkles className="w-4 h-4 text-amber-600" />
                                2. Analisis Morfologi Sharaf (Binyah)
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-100">
                                  <span className="text-[10px] text-slate-500 block">Jenis Kata:</span>
                                  <span className="font-bold text-slate-800">{inspectedMushafWord.wordData.jenis_kata_sharaf}</span>
                                </div>
                                <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-100">
                                  <span className="text-[10px] text-slate-500 block">Timbangan Wazan:</span>
                                  <span className="font-arabic text-lg font-bold text-amber-900">{inspectedMushafWord.wordData.wazan_sharaf || '-'}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                  <span className="text-[10px] text-slate-500 block">Akar Kata:</span>
                                  <span className="font-arabic font-bold text-base text-slate-900">{inspectedMushafWord.wordData.akar_kata || '-'}</span>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                  <span className="text-[10px] text-slate-500 block">Jenis Bina':</span>
                                  <span className="font-semibold text-slate-800">{inspectedMushafWord.wordData.jenis_bina || '-'}</span>
                                </div>
                              </div>

                              {inspectedMushafWord.wordData.lemma && (
                                <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 flex items-center justify-between">
                                  <span className="text-slate-400 text-[10px]">Lemma / Asal:</span>
                                  <span className="font-arabic font-bold text-sm text-amber-900">{inspectedMushafWord.wordData.lemma}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Table Bedah Toggle & Footer */}
                      <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                          <span className="font-medium">Klik salah satu kata di atas untuk bedah instan, atau buka tabel komprehensif:</span>
                        </div>

                        <button
                          onClick={() => toggleMushafTable(ayahIdStr)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                            isTableOpen
                              ? 'bg-amber-400 text-emerald-950 hover:bg-amber-300'
                              : 'bg-emerald-900 text-amber-300 hover:bg-emerald-800'
                          }`}
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>{isTableOpen ? 'Tutup Tabel Bedah' : `Tabel Bedah Seluruh Kata (${ayah.total_kata})`}</span>
                        </button>
                      </div>

                      {/* Full Table Breakdown per Ayah */}
                      {isTableOpen && (
                        <div className="border-t border-slate-200 overflow-x-auto bg-slate-50/50 p-4 animate-in fade-in duration-200">
                          <table className="w-full text-left text-xs divide-y divide-slate-200 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                            <thead className="bg-slate-100 text-slate-800 font-bold">
                              <tr>
                                <th className="p-3">Kata (Arab)</th>
                                <th className="p-3">I'rab Nahwu (Sintaksis)</th>
                                <th className="p-3">Status & Tanda</th>
                                <th className="p-3">Binyah Sharaf</th>
                                <th className="p-3">Wazan & Bina'</th>
                                <th className="p-3">Akar Kata & Segmen</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {ayah.kata_per_kata.map((w, wIdx) => (
                                <tr key={wIdx} className="hover:bg-amber-50/40 transition">
                                  <td className="p-3 font-quran text-2xl font-bold text-emerald-950 whitespace-nowrap">
                                    {w.kata_arab}
                                  </td>
                                  <td className="p-3 space-y-1 min-w-[200px]">
                                    <div className="font-arabic font-semibold text-sm text-slate-900 text-right">{w.kedudukan_irab}</div>
                                    <div className="text-[11px] text-slate-500">{w.kedudukan_indo}</div>
                                  </td>
                                  <td className="p-3 whitespace-nowrap">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${getStatusColor(w.status_hukum)}`}>
                                      {w.status_hukum}
                                    </span>
                                    <div className="text-[10px] text-slate-500 mt-1">{w.tanda_irab}</div>
                                  </td>
                                  <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                                    {w.jenis_kata_sharaf}
                                  </td>
                                  <td className="p-3 whitespace-nowrap">
                                    <div className="font-arabic font-bold text-base text-amber-900">{w.wazan_sharaf || '-'}</div>
                                    <div className="text-[10px] text-slate-500">{w.jenis_bina || '-'}</div>
                                  </td>
                                  <td className="p-3 text-[11px] text-slate-600 max-w-xs space-y-0.5">
                                    <span className="font-arabic font-bold text-xs text-emerald-800 block">{w.akar_kata}</span>
                                    <span className="font-mono text-[10px] text-slate-500">{w.rincian_segmen}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Pagination for Surah Ayahs */}
              {totalMushafPages > 1 && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div className="text-slate-500 text-xs">
                    Halaman <strong className="text-emerald-800">{mushafPage}</strong> dari <strong>{totalMushafPages}</strong> ({filteredMushafAyahs.length} ayat di surah ini)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={mushafPage === 1}
                      onClick={() => {
                        setMushafPage(prev => Math.max(1, prev - 1));
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold"
                    >
                      Sebelumnya
                    </button>
                    
                    {(() => {
                      const windowSize = 5;
                      let startPage = Math.max(1, mushafPage - Math.floor(windowSize / 2));
                      let endPage = startPage + windowSize - 1;
                      if (endPage > totalMushafPages) {
                        endPage = totalMushafPages;
                        startPage = Math.max(1, endPage - windowSize + 1);
                      }
                      const pages = [];
                      for (let p = startPage; p <= endPage; p++) {
                        pages.push(p);
                      }
                      return pages.map(pageNum => (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setMushafPage(pageNum);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                            mushafPage === pageNum
                              ? 'bg-emerald-900 text-amber-300 shadow-sm'
                              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ));
                    })()}

                    <button
                      disabled={mushafPage === totalMushafPages}
                      onClick={() => {
                        setMushafPage(prev => Math.min(totalMushafPages, prev + 1));
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: BANK LATIHAN & KUIS TEMATIK (520 SOAL BINYAH)    */}
      {/* ======================================================== */}
      {mainView === 'latihan' && (
        <div className="space-y-6">
          
          {/* Sub-mode Switcher: Bedah vs Kuis */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pilih Pendekatan:</span>
              <button
                onClick={() => setExerciseSubMode('inspector')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  exerciseSubMode === 'inspector'
                    ? 'bg-emerald-900 text-amber-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Mode Bedah I'rab Lengkap
              </button>
              <button
                onClick={() => setExerciseSubMode('quiz')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  exerciseSubMode === 'quiz'
                    ? 'bg-emerald-900 text-amber-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Mode Uji Tantangan Kuis
              </button>
            </div>
            <div className="text-xs text-slate-500">
              Menampilkan <strong className="text-emerald-800 font-bold">{filteredExercises.length}</strong> butir soal tematik
            </div>
          </div>

          {/* Filter Controls for Latihan */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Search Box */}
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Cari Surah, teks Arab, binyah, wazan..."
                  value={exerciseSearchQuery}
                  onChange={(e) => {
                    setExerciseSearchQuery(e.target.value);
                    setExercisePage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                />
                {exerciseSearchQuery && (
                  <button
                    onClick={() => setExerciseSearchQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 rounded-full px-1.5 py-0.5"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Binyah Category Filter */}
              <div>
                <select
                  value={selectedBinyah}
                  onChange={(e) => {
                    setSelectedBinyah(e.target.value);
                    setExercisePage(1);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium cursor-pointer"
                >
                  <option value="ALL">Semua Binyah Kalimat ({binyahCategories.length})</option>
                  {binyahCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Juz Filter */}
              <div>
                <select
                  value={selectedJuz}
                  onChange={(e) => {
                    setSelectedJuz(e.target.value);
                    setExercisePage(1);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-700 font-medium cursor-pointer"
                >
                  <option value="ALL">Semua Juz (1 - 30)</option>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(juz => (
                    <option key={juz} value={juz}>Juz {juz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Grid of Latihan Cards */}
          <div className="grid grid-cols-1 gap-6">
            {currentExercises.map((item) => {
              const bookmarked = isBookmarked(item.id_latihan, 'quran');
              const qAns = quizAnswers[item.id_latihan];

              return (
                <div
                  key={item.id_latihan}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-900 text-amber-300 text-xs font-bold font-mono">
                        {item.id_latihan}
                      </span>
                      <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                        QS. {item.surah} <span className="text-xs text-emerald-700 font-semibold">[{item.ayat}]</span>
                      </h3>
                      <span className="text-xs text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full">
                        Juz {item.juz}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300/60 shadow-xs">
                        {item.kategori_binyah}
                      </span>

                      <button
                        onClick={() => {
                          saveBookmark({
                            id: item.id_latihan,
                            type: 'quran',
                            title: `${item.surah}: ${item.ayat}`,
                            subtitle: item.kategori_binyah,
                            arab: item.teks_ayat_arab,
                            indo: item.terjemahan_indo
                          });
                          setBookmarkUpdate(prev => prev + 1);
                        }}
                        className={`p-1.5 rounded-lg border transition ${
                          bookmarked 
                            ? 'bg-amber-400 text-emerald-950 border-amber-500' 
                            : 'bg-white text-slate-400 hover:text-amber-600 border-slate-200 hover:bg-slate-50'
                        }`}
                        title={bookmarked ? "Hapus Markah" : "Simpan ke Markah"}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={() => handleCopy(item.id_latihan, `${item.teks_ayat_arab}\n(QS. ${item.surah}: ${item.ayat})\n\nI'rab:\n${item.rincian_irab_tathbiqi}`)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
                        title="Salin Ayat & I'rab"
                      >
                        {copiedId === item.id_latihan ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div className="p-6 bg-[#FCFBF8] border-b border-slate-100 space-y-4">
                    <div className="text-right flex flex-wrap flex-row-reverse items-center gap-x-2 gap-y-3 leading-loose py-2">
                      {item.kata_per_kata && item.kata_per_kata.map((k, wordIdx) => {
                        const isInspected = inspectedExerciseWord && 
                          inspectedExerciseWord.itemId === item.id_latihan && 
                          inspectedExerciseWord.wordIdx === wordIdx;
                        const statusClass = highlightSyntax ? getStatusColor(k.status_hukum) : 'hover:bg-amber-100 text-slate-900';

                        return (
                          <button
                            key={wordIdx}
                            onClick={() => {
                              if (exerciseSubMode === 'inspector') {
                                if (isInspected) {
                                  setInspectedExerciseWord(null);
                                } else {
                                  setInspectedExerciseWord({ itemId: item.id_latihan, wordIdx, wordData: k, parentItem: item });
                                }
                              }
                            }}
                            className={`font-quran px-3 py-1 rounded-xl transition-all duration-150 border cursor-pointer ${
                              isInspected
                                ? 'ring-3 ring-amber-500 shadow-md scale-105 bg-amber-300 text-emerald-950 font-bold border-amber-500'
                                : `${statusClass} border-transparent`
                            }`}
                            style={{ fontSize: `${fontSize}px` }}
                            title={`Klik untuk bedah: ${k.kata_arab}`}
                          >
                            {k.kata_arab}
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-sm text-slate-600 italic border-l-2 border-emerald-600 pl-3 leading-relaxed">
                      "{item.terjemahan_indo}"
                    </p>
                  </div>

                  {/* Inspector Details in Latihan */}
                  {exerciseSubMode === 'inspector' && (
                    <div className="p-5 sm:p-6 space-y-4 bg-white">
                      {inspectedExerciseWord && inspectedExerciseWord.itemId === item.id_latihan && (
                        <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border-2 border-amber-300 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200 shadow-md">
                          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-quran text-3xl font-bold text-emerald-950">
                                {inspectedExerciseWord.wordData.kata_arab}
                              </span>
                              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(inspectedExerciseWord.wordData.status_hukum)}`}>
                                {inspectedExerciseWord.wordData.status_hukum}
                              </span>
                            </div>
                            <button
                              onClick={() => setInspectedExerciseWord(null)}
                              className="text-xs text-amber-900 hover:text-black font-bold bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-lg transition"
                            >
                              Tutup Detail ✕
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nahwu */}
                            <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs space-y-2">
                              <span className="text-xs font-bold text-emerald-900 uppercase">1. Sintaksis & I'rab Nahwu</span>
                              <p className="font-arabic font-bold text-base text-emerald-950 text-right">
                                {inspectedExerciseWord.wordData.kedudukan_irab}
                              </p>
                              <div className="pt-1 text-xs text-slate-600 flex justify-between">
                                <span>Tanda I'rab:</span>
                                <span className="font-semibold text-emerald-800">{inspectedExerciseWord.wordData.tanda_irab}</span>
                              </div>
                            </div>
                            {/* Sharaf */}
                            <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-2xs space-y-2">
                              <span className="text-xs font-bold text-amber-900 uppercase">2. Morfologi Sharaf (Binyah)</span>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-amber-50 p-2 rounded">
                                  <span className="text-[10px] text-slate-500 block">Wazan:</span>
                                  <span className="font-arabic text-base font-bold text-amber-900">{inspectedExerciseWord.wordData.wazan_sharaf || '-'}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded">
                                  <span className="text-[10px] text-slate-500 block">Akar:</span>
                                  <span className="font-arabic text-sm font-bold text-slate-800">{inspectedExerciseWord.wordData.akar_kata || '-'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Full Tathbiqi Sentence I'rab */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-right space-y-2">
                        <span className="text-xs font-bold tracking-wider text-emerald-900 uppercase flex items-center gap-1.5 float-left">
                          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                          Tathbiq I'rab (An-Nahwu At-Tathbiqi):
                        </span>
                        <div className="clear-both"></div>
                        <p className="font-arabic text-lg sm:text-xl text-slate-800 leading-relaxed font-medium">
                          {item.rincian_irab_tathbiqi}
                        </p>
                      </div>

                      {/* Toggle Table Button */}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => toggleExerciseTable(item.id_latihan)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-900 text-amber-300 hover:bg-emerald-800 transition"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>{expandedExerciseTableAyah[item.id_latihan] ? 'Tutup Tabel Bedah' : `Tabel Bedah Semua Kata (${item.kata_per_kata?.length || 0})`}</span>
                        </button>
                      </div>

                      {/* Full Table */}
                      {expandedExerciseTableAyah[item.id_latihan] && (
                        <div className="overflow-x-auto rounded-xl border border-slate-200 mt-2">
                          <table className="w-full text-left text-xs divide-y divide-slate-200">
                            <thead className="bg-slate-100 text-slate-800 font-bold">
                              <tr>
                                <th className="p-3">Kata (Arab)</th>
                                <th className="p-3">I'rab Nahwu</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Jenis Kata</th>
                                <th className="p-3">Wazan & Bina'</th>
                                <th className="p-3">Akar Kata</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                              {item.kata_per_kata.map((w, wIdx) => (
                                <tr key={wIdx}>
                                  <td className="p-3 font-quran text-xl font-bold text-emerald-950">{w.kata_arab}</td>
                                  <td className="p-3 font-arabic text-sm text-right">{w.kedudukan_irab}</td>
                                  <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(w.status_hukum)}`}>{w.status_hukum}</span></td>
                                  <td className="p-3">{w.jenis_kata_sharaf}</td>
                                  <td className="p-3 font-arabic font-bold text-amber-900">{w.wazan_sharaf}</td>
                                  <td className="p-3 font-arabic font-bold text-emerald-800">{w.akar_kata}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quiz Submode */}
                  {exerciseSubMode === 'quiz' && item.pertanyaan_latihan && (
                    <div className="p-5 sm:p-6 space-y-4 bg-white">
                      <div className="flex items-start gap-3 bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                            Tantangan Uji Analisis:
                          </span>
                          <p className="text-sm font-semibold text-slate-800 mt-1">
                            {item.pertanyaan_latihan.pertanyaan}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {['A', 'B', 'C', 'D'].map(optKey => {
                          const optText = item.pertanyaan_latihan[`opsi_${optKey.toLowerCase()}`];
                          if (!optText) return null;

                          const isSelected = qAns?.selected === optKey;
                          const isCorrectKey = item.pertanyaan_latihan.jawaban_benar.toUpperCase() === optKey;
                          
                          let btnStyle = "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700";
                          if (qAns) {
                            if (isCorrectKey) {
                              btnStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400";
                            } else if (isSelected && !qAns.isCorrect) {
                              btnStyle = "bg-rose-100 border-rose-300 text-rose-900 font-semibold";
                            } else {
                              btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={optKey}
                              disabled={!!qAns}
                              onClick={() => handleSelectQuizOption(item, optKey)}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all duration-150 ${btnStyle}`}
                            >
                              <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected
                                  ? (qAns.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white')
                                  : (qAns && isCorrectKey ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700')
                              }`}>
                                {optKey}
                              </span>
                              <span className="flex-1 font-medium">{optText}</span>
                              {qAns && isCorrectKey && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                              {qAns && isSelected && !qAns.isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {qAns && (
                        <div className={`p-4 rounded-xl border text-sm space-y-2 animate-in fade-in duration-200 ${
                          qAns.isCorrect 
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                            : 'bg-rose-50/80 border-rose-200 text-slate-800'
                        }`}>
                          <div className="font-bold">
                            {qAns.isCorrect ? (
                              <span className="text-emerald-800 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Mumtaz! Jawaban Anda Benar (Kunci: {item.pertanyaan_latihan.jawaban_benar})
                              </span>
                            ) : (
                              <span className="text-rose-800 flex items-center gap-1.5">
                                <XCircle className="w-4 h-4 text-rose-600" />
                                Kurang Tepat. Jawaban yang Benar: {item.pertanyaan_latihan.jawaban_benar}
                              </span>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed text-slate-700 bg-white/70 p-3 rounded-lg border border-slate-200/60">
                            <strong>Pembahasan Kaidah Al-Qur'an:</strong> {item.pertanyaan_latihan.pembahasan}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Exercise Pagination */}
          {totalExercisePages > 1 && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="text-slate-500 text-xs">
                Halaman <strong className="text-emerald-800">{exercisePage}</strong> dari <strong>{totalExercisePages}</strong> (Total {filteredExercises.length} soal)
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={exercisePage === 1}
                  onClick={() => setExercisePage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold"
                >
                  Sebelumnya
                </button>
                <button
                  disabled={exercisePage === totalExercisePages}
                  onClick={() => setExercisePage(prev => Math.min(totalExercisePages, prev + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}