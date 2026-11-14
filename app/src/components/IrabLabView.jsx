import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Copy,
  Check,
  Bookmark,
  Layers,
  BookOpen,
  Sparkles,
  Volume2,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Target,
  Table as TableIcon,
  Eye,
  X,
  Award,
  Loader2,
  AlertCircle,
  Lock,
  Crown
} from 'lucide-react';
import irabData from '../data/03_contoh_dan_irab.json';
import { saveBookmark, isBookmarked } from '../utils/storage';
import { normalizeArabic } from '../utils/quranSearch';
import { speakArabic, stopArabicSpeech } from '../utils/arabicAudio';
import { isIrabModelFree, isIrabSyahidFree } from '../utils/license';
import ProPaywallCard from './ProPaywallCard';

// Cache module-level agar pergantian tab tidak memicu unduhan ulang 1.17 MB
let cachedIrabModelsData = null;

const STATUS_META = {
  marfu: {
    ar: "مَرْفُوعٌ",
    id: "Marfu'",
    dot: '🟢',
    pillBg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-400 text-emerald-950',
    activeRing: 'ring-2 ring-emerald-500 bg-emerald-100 border-emerald-600 shadow-md',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    treeBorder: '#10b981',
  },
  manshub: {
    ar: "مَنْصُوبٌ",
    id: "Manshub",
    dot: '🟡',
    pillBg: 'bg-amber-50 hover:bg-amber-100 border-amber-400 text-amber-950',
    activeRing: 'ring-2 ring-amber-500 bg-amber-100 border-amber-600 shadow-md',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    treeBorder: '#f59e0b',
  },
  majrur: {
    ar: "مَجْرُورٌ",
    id: "Majrur",
    dot: '🟣',
    pillBg: 'bg-purple-50 hover:bg-purple-100 border-purple-400 text-purple-950',
    activeRing: 'ring-2 ring-purple-500 bg-purple-100 border-purple-600 shadow-md',
    badge: 'bg-purple-100 text-purple-900 border-purple-300',
    treeBorder: '#8b5cf6',
  },
  majzum: {
    ar: "مَجْزُومٌ",
    id: "Majzum",
    dot: '🔴',
    pillBg: 'bg-rose-50 hover:bg-rose-100 border-rose-400 text-rose-950',
    activeRing: 'ring-2 ring-rose-500 bg-rose-100 border-rose-600 shadow-md',
    badge: 'bg-rose-100 text-rose-900 border-rose-300',
    treeBorder: '#f43f5e',
  },
  mabni: {
    ar: "مَبْنِيٌّ",
    id: "Mabni",
    dot: '🔵',
    pillBg: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-400 text-indigo-950',
    activeRing: 'ring-2 ring-indigo-500 bg-indigo-100 border-indigo-600 shadow-md',
    badge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    treeBorder: '#6366f1',
  },
};

const PILLAR_PREFIX_MAP = {
  tawabi: 'pillar-tawabi-',
  majzumat: 'pillar-majzum-',
  nawasikh: 'pillar-nawasikh-',
  majrurat: 'pillar-majrur-',
  manshubat: 'pillar-manshub-',
};

function getModelBadgeColor(status) {
  return STATUS_META[status] || STATUS_META.mabni;
}

export default function IrabLabView({
  fontSize = 26,
  initialLabMode = 'visual',
  targetSyahid,
  isPro = false,
  onOpenLicense,
}) {
  const [labMode, setLabMode] = useState(initialLabMode); // 'visual' | 'syahid'

  // ====== STATE MODE 1: VISUAL I'RAB TAGGER (315 MODEL AL-FASHIH) ======
  const [modelsData, setModelsData] = useState(cachedIrabModelsData);
  const [loadingModels, setLoadingModels] = useState(!cachedIrabModelsData);
  const [loadError, setLoadError] = useState(null);

  const [currentLevel, setCurrentLevel] = useState('all'); // 'all' | '1' | '2' | '3'
  const [currentCategory, setCurrentCategory] = useState('all');
  const [visualSearch, setVisualSearch] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inspectOrChallenge, setInspectOrChallenge] = useState('inspect'); // 'inspect' | 'challenge'
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [challengeXp, setChallengeXp] = useState(0);
  const [speakingTag, setSpeakingTag] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // ====== STATE MODE 2: ENSIKLOPEDIA 119 DALIL SYAHID KLASIK ======
  const [syahidSearch, setSyahidSearch] = useState('');
  const [selectedDalil, setSelectedDalil] = useState('Semua');
  const [, setBookmarksUpdated] = useState(0);

  useEffect(() => {
    if (targetSyahid?.id_contoh) {
      setLabMode('syahid');
      setSelectedDalil('Semua');
      setSyahidSearch(targetSyahid.kata_kunci || targetSyahid.kalimat_arab || '');
    }
  }, [targetSyahid]);

  useEffect(() => {
    return () => stopArabicSpeech();
  }, []);

  useEffect(() => {
    if (cachedIrabModelsData) {
      setModelsData(cachedIrabModelsData);
      setLoadingModels(false);
      return;
    }
    let active = true;
    setLoadingModels(true);
    setLoadError(null);
    fetch('/data/irab-models-data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        cachedIrabModelsData = json;
        if (active) {
          setModelsData(json);
          setLoadingModels(false);
        }
      })
      .catch((err) => {
        if (active) {
          setLoadError(err?.message || 'Gagal memuat database model I\'rab.');
          setLoadingModels(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const allModels = useMemo(() => modelsData?.models || [], [modelsData]);
  const categories = useMemo(() => modelsData?.categories || [], [modelsData]);

  const categoryCounts = useMemo(() => {
    const counts = { all: allModels.length };
    categories.forEach((cat) => {
      if (cat.key === 'all') return;
      counts[cat.key] = allModels.filter(
        (m) => m.categoryKey === cat.key || (Array.isArray(m.categories) && m.categories.includes(cat.key))
      ).length;
    });
    return counts;
  }, [allModels, categories]);

  const filteredModels = useMemo(() => {
    let list = [...allModels];

    if (currentLevel !== 'all') {
      const lvl = parseInt(currentLevel, 10);
      list = list.filter((m) => m.levelId === lvl);
    }

    if (currentCategory !== 'all') {
      list = list.filter(
        (m) =>
          m.categoryKey === currentCategory ||
          (Array.isArray(m.categories) && m.categories.includes(currentCategory))
      );

      const catPrefix = PILLAR_PREFIX_MAP[currentCategory] || '';
      list.sort((a, b) => {
        const aIsPillar = catPrefix && a.id && a.id.startsWith(catPrefix);
        const bIsPillar = catPrefix && b.id && b.id.startsWith(catPrefix);
        if (aIsPillar && bIsPillar) {
          return (parseInt(a.id.replace(catPrefix, ''), 10) || 0) - (parseInt(b.id.replace(catPrefix, ''), 10) || 0);
        }
        const aScore = aIsPillar ? 3 : a.categoryKey === currentCategory ? 2 : a.id?.startsWith('pillar-') ? 1 : 0;
        const bScore = bIsPillar ? 3 : b.categoryKey === currentCategory ? 2 : b.id?.startsWith('pillar-') ? 1 : 0;
        if (bScore !== aScore) return bScore - aScore;
        return (a.globalNum || 0) - (b.globalNum || 0);
      });
    }

    const qRaw = visualSearch.trim();
    if (qRaw) {
      const lowerQ = qRaw.toLowerCase();
      const normQ = normalizeArabic(qRaw);
      list = list.filter((m) => {
        const normSentence = normalizeArabic(m.sentenceAr || '');
        const normAnalysis = normalizeArabic(m.fullAnalysisAr || '');
        const trans = (m.translationId || '').toLowerCase();
        const unitTitle = (m.unitTitleId || '').toLowerCase();
        return (
          (normQ && (normSentence.includes(normQ) || normAnalysis.includes(normQ))) ||
          trans.includes(lowerQ) ||
          unitTitle.includes(lowerQ)
        );
      });
    }

    return list;
  }, [allModels, currentLevel, currentCategory, visualSearch]);

  // Reset cursor saat filter berubah
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedTokenIndex(0);
    setQuizResult(null);
  }, [currentLevel, currentCategory, visualSearch]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredModels.length - 1));
  const currentModel = filteredModels[safeIndex] || null;
  const isCurrentModelLocked = currentModel ? !isPro && !isIrabModelFree(currentModel) : false;
  const activeTokens = useMemo(() => currentModel?.tokens || [], [currentModel]);
  const safeTokenIdx = Math.min(selectedTokenIndex, Math.max(0, activeTokens.length - 1));
  const selectedToken = activeTokens[safeTokenIdx] || null;

  const isFiiliyahSentence = useMemo(() => {
    return activeTokens.some(
      (t) =>
        (t.type || '').includes('فعل') ||
        (t.position || '').includes('فعل') ||
        (t.position || '').includes('فاعل')
    );
  }, [activeTokens]);

  const handleSelectCategory = (catKey) => {
    setCurrentCategory(catKey);
    if (currentLevel !== 'all' && catKey !== 'all') {
      const lvl = parseInt(currentLevel, 10);
      const hasAny = allModels.some(
        (m) =>
          m.levelId === lvl &&
          (m.categoryKey === catKey || (Array.isArray(m.categories) && m.categories.includes(catKey)))
      );
      if (!hasAny) setCurrentLevel('all');
    }
  };

  const handleSpeak = (text, tag) => {
    if (speakingTag === tag) {
      stopArabicSpeech();
      setSpeakingTag(null);
      return;
    }
    speakArabic(text, {
      onStart: () => setSpeakingTag(tag),
      onEnd: () => setSpeakingTag((c) => (c === tag ? null : c)),
      onError: () => setSpeakingTag(null),
    });
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1800);
    });
  };

  const handleGuessTokenStatus = (guessedStatus) => {
    if (!selectedToken) return;
    const isCorrect = selectedToken.status === guessedStatus;
    setQuizResult({ isCorrect, guessedStatus });
    if (isCorrect) {
      setChallengeXp((xp) => xp + 10);
    }
  };

  const handleNextChallengeToken = () => {
    if (safeTokenIdx < activeTokens.length - 1) {
      setSelectedTokenIndex(safeTokenIdx + 1);
      setQuizResult(null);
    } else if (safeIndex < filteredModels.length - 1) {
      setCurrentIndex(safeIndex + 1);
      setSelectedTokenIndex(0);
      setQuizResult(null);
    } else {
      setSelectedTokenIndex(0);
      setQuizResult(null);
    }
  };

  // ====== MODE 2: DALIL SYAHID FILTER ======
  const jenisDalils = useMemo(() => {
    const types = new Set(irabData.map((d) => d.jenis_dalil));
    return ['Semua', ...Array.from(types)];
  }, []);

  const filteredSyahid = useMemo(() => {
    const raw = syahidSearch.trim();
    const q = raw.toLowerCase();
    const normQ = normalizeArabic(raw);
    return irabData
      .map((item, idx) => ({ ...item, origIndex: idx }))
      .filter((item) => {
        const matchDalil = selectedDalil === 'Semua' || item.jenis_dalil === selectedDalil;
      if (!matchDalil) return false;
      if (!raw) return true;
      return (
        (normQ &&
          (normalizeArabic(item.kalimat_arab).includes(normQ) ||
            normalizeArabic(item.kata_kunci).includes(normQ) ||
            normalizeArabic(item.irab_arab).includes(normQ))) ||
        item.terjemahan_indo.toLowerCase().includes(q) ||
        item.penjelasan_irab_indo.toLowerCase().includes(q)
      );
    });
  }, [syahidSearch, selectedDalil]);

  const handleBookmarkSyahid = (item) => {
    saveBookmark({
      id: item.id_contoh,
      type: 'irab',
      title: `${item.jenis_dalil}: ${item.kata_kunci}`,
      arab: item.kalimat_arab,
      subtitle: item.terjemahan_indo,
    });
    setBookmarksUpdated((prev) => prev + 1);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6 overflow-x-hidden">
      {/* Header & Top Mode Switcher */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/80 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span className="font-arabic text-sm" dir="rtl">مُخْتَبَرُ الإِعْرَابِ البَصَرِيِّ وَالشَّوَاهِدِ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Laboratorium I&apos;rab Visual &amp; 119 Dalil Syahid
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Eksplorasi <strong className="text-amber-300">315 Model Analisis Sintaksis Al-Fashih</strong> dengan penanda warna 5 status I&apos;rab, pohon struktur jumlah, tabel I&apos;rab lengkap, dan kuis kata-per-kata — bersama <strong className="text-amber-300">119 Dalil Syahid Klasik</strong>.
            </p>
          </div>

          {/* Stats Pills */}
          {modelsData && (
            <div className="grid grid-cols-3 gap-2 text-center shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/60">
                <div className="text-lg font-extrabold text-amber-400">{modelsData.totalModels || allModels.length}</div>
                <div className="text-[10px] text-emerald-200 font-semibold">Model Visual</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/60">
                <div className="text-lg font-extrabold text-amber-400">{irabData.length}</div>
                <div className="text-[10px] text-emerald-200 font-semibold">Dalil Syahid</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/60">
                <div className="text-lg font-extrabold text-amber-400">{challengeXp} XP</div>
                <div className="text-[10px] text-emerald-200 font-semibold">Skor Kuis</div>
              </div>
            </div>
          )}
        </div>

        {!isPro && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-500/15 border border-amber-300/35 px-4 py-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-100">
              <Lock className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                <strong className="text-white">Mode Gratis Lab I&apos;rab:</strong> Tersedia{' '}
                <strong className="text-amber-200">17 dari 315 Model Visual</strong> (12 Pemula + 5
                Pilar Kategori) &amp; <strong className="text-amber-200">10 dari 119 Dalil Syahid</strong>.
                Upgrade PRO untuk membuka seluruh 315 model &amp; 119 syahid.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenLicense?.('qris')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-3.5 py-2 transition cursor-pointer shrink-0 shadow-sm"
            >
              <Crown className="w-3.5 h-3.5" />
              Buka Full PRO
            </button>
          </div>
        )}

        {/* Switcher: Laboratorium Visual Al-Fashih vs 119 Dalil Syahid */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-800/70">
          <button
            onClick={() => setLabMode('visual')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              labMode === 'visual'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'bg-emerald-900/70 text-emerald-100 hover:bg-emerald-800 border border-emerald-700/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Laboratorium I&apos;rab Visual ({modelsData?.totalModels || 315} Model Al-Fashih)</span>
          </button>
          <button
            onClick={() => setLabMode('syahid')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              labMode === 'syahid'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'bg-emerald-900/70 text-emerald-100 hover:bg-emerald-800 border border-emerald-700/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Ensiklopedia {irabData.length} Dalil Syahid Klasik</span>
          </button>
        </div>
      </div>

      {/* ================== MODE 1: VISUAL I'RAB TAGGER (AL-FASHIH) ================== */}
      {labMode === 'visual' && (
        <div className="space-y-6">
          {loadingModels ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <Loader2 className="w-9 h-9 text-emerald-700 animate-spin mx-auto" />
              <div className="font-arabic text-2xl font-bold text-emerald-900" dir="rtl">
                جَارٍ تَحْمِيلُ مُخْتَبَرِ الإِعْرَابِ الشَّامِلِ (٣١٥ نَمُوذَجًا)...
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Memuat 315 model analisis sintaksis, syawahid Al-Qur&apos;an, dan 48 unit kurikulum...
              </p>
            </div>
          ) : loadError ? (
            <div className="bg-rose-50 rounded-3xl p-8 border border-rose-200 text-center space-y-2 text-rose-800">
              <AlertCircle className="w-8 h-8 mx-auto" />
              <p className="font-bold text-sm">Gagal memuat database model I&apos;rab ({loadError})</p>
            </div>
          ) : (
            <>
              {/* Filter Bar Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
                {/* Row 1: Search & Inspect/Challenge Mode Toggle */}
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={visualSearch}
                      onChange={(e) => setVisualSearch(e.target.value)}
                      placeholder="Cari kalimat Arab (tanpa harakat) atau topik Nahwu..."
                      className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    {visualSearch && (
                      <button
                        onClick={() => setVisualSearch('')}
                        className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Inspect vs Challenge Mode Toggle */}
                  <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shrink-0 self-start md:self-auto">
                    <button
                      onClick={() => {
                        setInspectOrChallenge('inspect');
                        setQuizResult(null);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        inspectOrChallenge === 'inspect'
                          ? 'bg-emerald-900 text-amber-300 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspeksi Visual</span>
                    </button>
                    <button
                      onClick={() => {
                        setInspectOrChallenge('challenge');
                        setQuizResult(null);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        inspectOrChallenge === 'challenge'
                          ? 'bg-amber-500 text-emerald-950 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Tantangan I&apos;rab</span>
                    </button>
                  </div>
                </div>

                {/* Row 2: Level Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Level:</span>
                    {[
                      { id: 'all', label: `Semua (${allModels.length})` },
                      { id: '1', label: `Lv. 1 Pemula (${modelsData?.statsByLevel?.level1 || 95})` },
                      { id: '2', label: `Lv. 2 Menengah (${modelsData?.statsByLevel?.level2 || 121})` },
                      { id: '3', label: `Lv. 3 Mahir (${modelsData?.statsByLevel?.level3 || 99})` },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        onClick={() => setCurrentLevel(lvl.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                          currentLevel === lvl.id
                            ? 'bg-emerald-900 text-white border-emerald-900'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-bold text-emerald-800">
                    Menampilkan {filteredModels.length} model cocok
                  </div>
                </div>

                {/* Row 3: 7 Category Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => {
                    const isActive = currentCategory === cat.key;
                    const count = categoryCounts[cat.key] || 0;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => handleSelectCategory(cat.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                          isActive
                            ? 'bg-emerald-900 text-amber-300 border-emerald-900 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                        }`}
                        title={cat.descId}
                      >
                        <span>{cat.badge}</span>
                        <span className="font-arabic text-sm" dir="rtl">{cat.ar}</span>
                        <span className="hidden sm:inline text-[11px] opacity-85">({cat.id.split('(')[0].trim()})</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            isActive ? 'bg-emerald-800 text-white' : 'bg-white text-slate-500 border border-slate-200'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Model Inspector */}
              {!currentModel ? (
                <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
                  <p className="text-sm font-bold text-slate-600">Tidak ada model I&apos;rab yang cocok dengan kombinasi filter ini.</p>
                  <button
                    onClick={() => {
                      setCurrentLevel('all');
                      setCurrentCategory('all');
                      setVisualSearch('');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-900 text-amber-300 text-xs font-bold cursor-pointer"
                  >
                    Tampilkan Semua {allModels.length} Model
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Model Navigation & Meta Bar */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold">
                          Model {safeIndex + 1} / {filteredModels.length}
                        </span>
                        {!isPro && (
                          isCurrentModelLocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold">
                              <Lock className="w-3 h-3" /> PRO
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold">
                              GRATIS
                            </span>
                          )
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                          {currentModel.categoryId} • {currentModel.levelNameId}
                        </span>
                        {currentModel.sourceBook && (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-arabic text-xs font-bold" dir="rtl">
                            📚 {currentModel.sourceBook}
                          </span>
                        )}
                      </div>
                      <h2 className="text-sm sm:text-base font-extrabold text-emerald-950">
                        {(currentModel.unitTitleId || '').replace(/\s*\(Kurikulum Lengkap 5 Kitab\)/i, '')}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        disabled={safeIndex === 0}
                        onClick={() => {
                          setCurrentIndex((i) => Math.max(0, i - 1));
                          setSelectedTokenIndex(0);
                          setQuizResult(null);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 disabled:opacity-40 text-xs font-bold text-slate-700 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Sebelumnya</span>
                      </button>
                      <button
                        disabled={safeIndex >= filteredModels.length - 1}
                        onClick={() => {
                          setCurrentIndex((i) => Math.min(filteredModels.length - 1, i + 1));
                          setSelectedTokenIndex(0);
                          setQuizResult(null);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-emerald-800 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-40 text-xs font-bold text-amber-300 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <span>Berikutnya</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Sentence Card + Token Bubbles */}
                  <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-200/80 shadow-md space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-500">
                        {isCurrentModelLocked
                          ? 'Pratinjau kalimat PRO — upgrade ke Al-Miftah PRO untuk membedah kedudukan I\'rab setiap kata:'
                          : 'Klik salah satu gelembung kata di bawah untuk membedah kedudukan I\'rabnya:'}
                      </div>
                      {!isCurrentModelLocked && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSpeak(currentModel.sentenceAr, `sent-${currentModel.id}`)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                              speakingTag === `sent-${currentModel.id}`
                                ? 'bg-amber-400 text-emerald-950 animate-pulse'
                                : 'bg-emerald-900 text-amber-300 hover:bg-emerald-800'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Dengarkan Kalimat</span>
                          </button>
                          <button
                            onClick={() => handleCopyText(currentModel.sentenceAr, `sent-copy-${currentModel.id}`)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                            title="Salin Kalimat Arab"
                          >
                            {copiedId === `sent-copy-${currentModel.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>

                    {isCurrentModelLocked ? (
                      <div className="py-6 px-4 bg-[#FAF8F5] rounded-2xl border border-amber-200/70 text-center space-y-3" dir="rtl">
                        <p
                          className="font-arabic font-extrabold text-emerald-950 leading-relaxed"
                          style={{ fontSize: `${Math.min(36, fontSize + 4)}px` }}
                        >
                          {currentModel.sentenceAr}
                        </p>
                        <div dir="ltr" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-100/80 border border-amber-200 px-3 py-1 rounded-full">
                          <Lock className="w-3.5 h-3.5" />
                          Gelembung status I&apos;rab &amp; terjemah lengkap terbuka di versi PRO
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Interactive RTL Token Bubbles */}
                        <div className="flex flex-wrap items-center justify-center gap-3 py-4 px-2 bg-[#FAF8F5] rounded-2xl border border-amber-200/70" dir="rtl">
                          {activeTokens.map((tok, idx) => {
                            const meta = getModelBadgeColor(tok.status);
                            const isSelected = safeTokenIdx === idx;
                            const hiddenInChallenge = inspectOrChallenge === 'challenge' && isSelected && !quizResult;
                            return (
                              <button
                                key={`${currentModel.id}-tok-${idx}`}
                                onClick={() => {
                                  setSelectedTokenIndex(idx);
                                  setQuizResult(null);
                                }}
                                className={`px-4 py-3 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center gap-1 min-w-[90px] ${
                                  isSelected ? meta.activeRing : meta.pillBg
                                }`}
                              >
                                <span
                                  className="font-arabic font-extrabold text-emerald-950 leading-snug"
                                  style={{ fontSize: `${Math.min(36, fontSize + 4)}px` }}
                                >
                                  {tok.word}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${hiddenInChallenge ? 'bg-slate-200 text-slate-600 border-slate-300' : meta.badge}`}>
                                  {hiddenInChallenge ? '❓ Tebak Status' : `${meta.dot} ${meta.id}`}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="text-center text-xs sm:text-sm text-slate-600 italic">
                          &ldquo;{currentModel.translationId}&rdquo;
                        </div>

                        {/* 5-Status Color Legend */}
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-100 text-[11px]">
                          {Object.entries(STATUS_META).map(([key, meta]) => (
                            <span key={key} className={`px-2.5 py-1 rounded-full border font-bold ${meta.badge}`}>
                              {meta.dot} {meta.ar} ({meta.id})
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {isCurrentModelLocked && (
                    <ProPaywallCard
                      title={`Model I'rab #${safeIndex + 1} Terkunci (Khusus Member PRO)`}
                      description={`Akses gratis Laboratorium Visual menyediakan 17 model contoh (12 level Pemula + 5 pilar tiap kategori). Upgrade ke Al-Miftah PRO untuk membuka seluruh 315 model kalimat beserta gelembung status multi-warna, pohon sintaksis I'rab, jadwal kata lengkap, audio pelafalan, dan kuis tantangan cepat.`}
                      onOpenLicense={onOpenLicense}
                    />
                  )}

                  {/* INSPECT MODE PANELS */}
                  {!isCurrentModelLocked && inspectOrChallenge === 'inspect' && selectedToken && (
                    <div className="space-y-5">
                      {/* Deep Inspection Card for Selected Token */}
                      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-3">
                            <span
                              className="font-arabic font-extrabold text-emerald-950 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200"
                              style={{ fontSize: `${Math.min(34, fontSize + 2)}px` }}
                              dir="rtl"
                            >
                              {selectedToken.word}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Bedah Kata Terpilih (#{safeTokenIdx + 1})
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${getModelBadgeColor(selectedToken.status).badge}`}>
                                  {getModelBadgeColor(selectedToken.status).dot} {selectedToken.case || getModelBadgeColor(selectedToken.status).ar}
                                </span>
                                {selectedToken.type && (
                                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-arabic" dir="rtl">
                                    {selectedToken.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleSpeak(selectedToken.word, `tok-${currentModel.id}-${safeTokenIdx}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Lafalkan Kata</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">
                              Kedudukan &amp; Jabatan Kata (المَوْقِعُ الإِعْرَابِيُّ)
                            </div>
                            <p className="font-arabic text-base sm:text-lg font-bold text-emerald-950 text-right leading-relaxed" dir="rtl">
                              {selectedToken.position || '-'}
                            </p>
                          </div>
                          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1.5">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
                              Tanda I&apos;rab (العَلَامَةُ)
                            </div>
                            <p className="font-arabic text-base sm:text-lg font-bold text-amber-950 text-right leading-relaxed" dir="rtl">
                              {selectedToken.marker || '-'}
                            </p>
                          </div>
                        </div>

                        {selectedToken.reason && (
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                              I&apos;rab Lengkap &amp; Alasan Ilmiah (التَّوْجِيهُ الإِعْرَابِيُّ)
                            </div>
                            <p className="font-arabic text-base sm:text-lg text-slate-900 text-right leading-loose" dir="rtl">
                              {selectedToken.reason}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Syntax Relationship Tree */}
                      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <GitBranch className="w-5 h-5 text-emerald-700" />
                            <h3 className="font-arabic text-lg font-extrabold text-emerald-950" dir="rtl">
                              شَجَرَةُ العَلَاقَاتِ التَّرْكِيبِيَّةِ وَالمُتَعَلَّقَاتِ
                            </h3>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 font-arabic" dir="rtl">
                            {isFiiliyahSentence ? 'جُمْلَةٌ فِعْلِيَّةٌ (Kalimat Verbal)' : 'جُمْلَةٌ اسْمِيَّةٌ (Kalimat Nominal)'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2.5 py-2" dir="rtl">
                          {activeTokens.map((t, idx) => {
                            const meta = getModelBadgeColor(t.status);
                            return (
                              <React.Fragment key={`tree-${currentModel.id}-${idx}`}>
                                <div
                                  onClick={() => setSelectedTokenIndex(idx)}
                                  className="cursor-pointer bg-slate-50 hover:bg-emerald-50/70 rounded-2xl p-3 border border-slate-200 text-center min-w-[125px] flex-1 max-w-[220px] transition"
                                  style={{ borderTopWidth: '4px', borderTopColor: meta.treeBorder }}
                                >
                                  <div className="font-arabic text-2xl font-extrabold text-emerald-950 mb-1">
                                    {t.word}
                                  </div>
                                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badge} font-arabic`}>
                                    {t.position || t.type}
                                  </span>
                                  {t.case && (
                                    <div className="text-[11px] text-slate-500 mt-1 font-arabic">{t.case}</div>
                                  )}
                                </div>
                                {idx < activeTokens.length - 1 && (
                                  <span className="text-xl font-bold text-amber-600 select-none">⟵</span>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                        <p className="text-[11px] text-center text-slate-500">
                          Panah (⟵) memperlihatkan urutan isnad dan pertautan hubungan gramatikal antarunsur kalimat dari kanan ke kiri.
                        </p>
                      </div>

                      {/* Exhaustive Word-by-Word Schedule Table */}
                      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <TableIcon className="w-5 h-5 text-emerald-700" />
                            <h3 className="text-sm sm:text-base font-extrabold text-emerald-950">
                              Jadwal I&apos;rab Lengkap Kata-per-Kata
                            </h3>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-right border-collapse text-xs sm:text-sm" dir="rtl">
                            <thead>
                              <tr className="bg-emerald-950 text-amber-300">
                                <th className="p-3 rounded-tr-xl">الكَلِمَةُ</th>
                                <th className="p-3">النَّوْعُ</th>
                                <th className="p-3">المَوْقِعُ</th>
                                <th className="p-3">الحُكْمُ</th>
                                <th className="p-3 rounded-tl-xl">العَلَامَةُ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {activeTokens.map((t, idx) => {
                                const meta = getModelBadgeColor(t.status);
                                return (
                                  <tr
                                    key={`tbl-${currentModel.id}-${idx}`}
                                    onClick={() => setSelectedTokenIndex(idx)}
                                    className={`cursor-pointer transition ${
                                      safeTokenIdx === idx ? 'bg-amber-50/70' : 'hover:bg-slate-50'
                                    }`}
                                  >
                                    <td className="p-3 font-arabic text-lg font-extrabold text-emerald-950">{t.word}</td>
                                    <td className="p-3 font-arabic text-slate-700">{t.type || '-'}</td>
                                    <td className="p-3 font-arabic text-slate-800">{t.position || '-'}</td>
                                    <td className="p-3">
                                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${meta.badge} font-arabic`}>
                                        {t.case || meta.ar}
                                      </span>
                                    </td>
                                    <td className="p-3 font-arabic text-slate-700">{t.marker || '-'}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CHALLENGE MODE PANEL */}
                  {!isCurrentModelLocked && inspectOrChallenge === 'challenge' && selectedToken && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md text-center space-y-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                        <Award className="w-4 h-4" />
                        <span className="font-arabic text-sm" dir="rtl">تَحَدِّي إِتْقَانِ الإِعْرَابِ السَّرِيعِ</span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-arabic text-2xl sm:text-3xl font-extrabold text-emerald-950" dir="rtl">
                          مَا هُوَ حُكْمُ إِعْرَابِ الكَلِمَةِ «<span className="text-amber-700 underline">{selectedToken.word}</span>» فِي هَذِهِ الجُمْلَةِ؟
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">
                          Pilih status I&apos;rab yang tepat untuk kata di atas untuk menguji ketajaman nalar Nahwu Anda (+10 XP tiap jawaban tepat).
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2.5">
                        {Object.entries(STATUS_META).map(([statusKey, meta]) => (
                          <button
                            key={statusKey}
                            onClick={() => handleGuessTokenStatus(statusKey)}
                            className={`px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-extrabold transition cursor-pointer hover:scale-[1.02] ${meta.pillBg}`}
                          >
                            {meta.dot} <span className="font-arabic text-base">{meta.ar}</span> ({meta.id})
                          </button>
                        ))}
                      </div>

                      {quizResult && (
                        <div
                          className={`p-5 rounded-2xl border-2 text-center space-y-2 ${
                            quizResult.isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                              : 'bg-rose-50 border-rose-500 text-rose-950'
                          }`}
                        >
                          <div className="text-lg sm:text-xl font-extrabold font-arabic" dir="rtl">
                            {quizResult.isCorrect ? '🎉 أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ!' : '❌ لَيْسَ تَمَامًا! حَاوِلْ مَرَّةً أُخْرَى'}
                          </div>
                          <div className="font-arabic text-lg font-bold" dir="rtl">
                            الحُكْمُ الصَّوَابُ: {selectedToken.case} ({selectedToken.position})
                          </div>
                          <p className="font-arabic text-base text-slate-800" dir="rtl">
                            <strong>التَّوْجِيهُ:</strong> {selectedToken.reason}
                          </p>
                          {quizResult.isCorrect && (
                            <div className="text-xs font-extrabold text-amber-800">
                              ⭐ +10 XP ditambahkan ke skor sesi Anda! Total XP: {challengeXp}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          onClick={handleNextChallengeToken}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs sm:text-sm font-bold cursor-pointer transition"
                        >
                          <span>Uji Kata / Model Berikutnya</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ================== MODE 2: ENSIKLOPEDIA 119 DALIL SYAHID ================== */}
      {labMode === 'syahid' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari kalimat Arab (tanpa harakat), terjemahan, atau kata kunci..."
                  value={syahidSearch}
                  onChange={(e) => setSyahidSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-slate-50/70"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium px-2 shrink-0">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Menampilkan {filteredSyahid.length} dari {irabData.length} Syahid</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {jenisDalils.map((jenis) => {
                const isActive = selectedDalil === jenis;
                return (
                  <button
                    key={jenis}
                    onClick={() => setSelectedDalil(jenis)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    {jenis}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Syahid Cards */}
          <div className="space-y-4">
            {filteredSyahid.map((item) => {
              const bookmarked = isBookmarked(item.id_contoh, 'irab');
              const isSyahidLocked = !isPro && !isIrabSyahidFree(item.origIndex);
              return (
                <div
                  key={item.id_contoh}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                        {item.id_contoh}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {item.jenis_dalil}
                      </span>
                      {!isPro && (
                        isSyahidLocked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            <Lock className="w-3 h-3" /> PRO
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            GRATIS
                          </span>
                        )
                      )}
                      <span className="text-xs font-medium text-slate-500">
                        Kata Kunci:{' '}
                        <strong className="text-emerald-800 font-arabic text-base mx-1">
                          {item.kata_kunci}
                        </strong>
                      </span>
                    </div>

                    {!isSyahidLocked && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeak(item.kalimat_arab, `syahid-${item.id_contoh}`)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                          title="Dengarkan Syahid"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCopyText(`${item.kalimat_arab}\n\nArtinya: ${item.terjemahan_indo}\n\nI'rab:\n${item.irab_arab}`, item.id_contoh)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                          title="Salin Dalil & I'rab"
                        >
                          {copiedId === item.id_contoh ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleBookmarkSyahid(item)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            bookmarked
                              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                              : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
                          }`}
                          title="Tandai Favorit"
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>
                    )}
                  </div>

                  {isSyahidLocked ? (
                    <ProPaywallCard
                      compact
                      title={`Dalil Syahid #${item.origIndex + 1} (${item.id_contoh}) Terkunci`}
                      description="Akses gratis hanya memuat 10 dalil syahid pertama. Upgrade ke Al-Miftah PRO untuk membuka seluruh 119 Dalil Syahid Al-Qur'an, Hadits, & Syi'ir beserta tathbiq I'rab dan penjelasan ilmiahnya."
                      onOpenLicense={onOpenLicense}
                    />
                  ) : (
                    <>
                      <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-amber-200/60 text-right">
                        <p
                          className="font-arabic font-bold text-slate-900 leading-relaxed"
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          {item.kalimat_arab}
                        </p>
                        <p className="text-xs text-slate-600 italic text-left mt-2">
                          &ldquo;{item.terjemahan_indo}&rdquo;
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/70 space-y-2">
                          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                            Tathbiq I&apos;rab (Bahasa Arab):
                          </h4>
                          <p className="font-arabic text-base sm:text-lg text-emerald-950 text-right leading-loose font-medium">
                            {item.irab_arab}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            Penjelasan Ilmiah Gramatika:
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {item.penjelasan_irab_indo}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
