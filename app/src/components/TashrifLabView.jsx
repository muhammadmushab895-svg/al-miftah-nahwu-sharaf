import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Volume2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Layers,
  Users,
  Scale,
  GraduationCap,
  RotateCcw,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import tashrifData from '../data/tashrif_data.json';
import { normalizeArabic } from '../utils/quranSearch';
import { speakArabic, stopArabicSpeech } from '../utils/arabicAudio';

const SHIGHAH_DEFS = [
  { key: 'madhi', titleAr: 'الفِعْلُ المَاضِي', titleId: "Fi'il Madhi (Lampau)", role: 'Kata kerja lampau dasar' },
  { key: 'mudhari', titleAr: 'الفِعْلُ المُضَارِعُ', titleId: "Fi'il Mudhari' (Kini/Nanti)", role: 'Kata kerja sedang/akan' },
  { key: 'mashdar', titleAr: 'المَصْدَرُ', titleId: 'Mashdar Ghairu Mimi', role: 'Kata benda abstrak (Gerund)' },
  { key: 'mashdarMimi', titleAr: 'المَصْدَرُ المِيمِيُّ', titleId: 'Mashdar Mimi', role: 'Mashdar berawalan huruf Mim' },
  { key: 'isimFail', titleAr: 'اِسْمُ الفَاعِلِ', titleId: "Isim Fa'il (Subjek/Pelaku)", role: 'Yang mengerjakan perbuatan' },
  { key: 'isimMaful', titleAr: 'اِسْمُ المَفْعُولِ', titleId: "Isim Maf'ul (Objek)", role: 'Yang dikenai perbuatan' },
  { key: 'amr', titleAr: 'فِعْلُ الأَمْرِ', titleId: "Fi'il Amr (Perintah)", role: 'Kata kerja perintah aktif' },
  { key: 'nahy', titleAr: 'فِعْلُ النَّهْيِ', titleId: "Fi'il Nahy (Larangan)", role: 'Kata kerja larangan (Jangan!)' },
  { key: 'zaman', titleAr: 'اِسْمُ الزَّمَانِ', titleId: 'Isim Zaman (Waktu)', role: 'Kata penunjuk waktu kejadian' },
  { key: 'makan', titleAr: 'اِسْمُ المَكَانِ', titleId: 'Isim Makan (Tempat)', role: 'Kata penunjuk tempat kejadian' },
  { key: 'alat', titleAr: 'اِسْمُ الآلَةِ', titleId: 'Isim Alat (Instrumen)', role: 'Kata penunjuk perkakas/alat' },
];

const LUGHAWI_GROUPS = [
  {
    key: 'ghaib',
    title: '١. الغَائِبُ وَالغَائِبَةُ (Kata Ganti Ketiga — Dia / Mereka)',
    accent: 'border-amber-200 bg-amber-50/40',
    indices: [0, 1, 2, 3, 4, 5],
  },
  {
    key: 'mukhatab',
    title: '٢. المُخَاطَبُ وَالمُخَاطَبَةُ (Kata Ganti Kedua — Kamu / Kalian)',
    accent: 'border-emerald-200 bg-emerald-50/40',
    indices: [6, 7, 8, 9, 10, 11],
  },
  {
    key: 'mutakallim',
    title: '٣. المُتَكَلِّمُ (Kata Ganti Pertama — Saya / Kami)',
    accent: 'border-sky-200 bg-sky-50/40',
    indices: [12, 13],
  },
];

function getBabShortLabel(babId) {
  if (babId === 'rubai_mujarrad') return "Ruba'i Mujarrad";
  if (babId === 'rubai_mazid') return "Ruba'i Mazid";
  if (babId === 'mazid') return 'Tsulatsi Mazid';
  const num = babId.split('_')[1];
  return `Mujarrad Bab ${num}`;
}

function getBabNadhzamRule(verb) {
  if (!verb) return null;
  if (verb.babId === 'rubai_mujarrad') {
    return {
      title: "Pola Baku Ruba'i Mujarrad (Bab Tunggal: فَعْلَلَ - يُفَعْلِلُ)",
      arabic: 'فَعْلَلَ — يُفَعْلِلُ — فَعْلَلَةً وَفِعْلَالًا — وَمُفَعْلَلًا — فَهُوَ مُفَعْلِلٌ — وَذَاكَ مُفَعْلَلٌ — فَعْلِلْ — لَا تُفَعْلِلْ — مُفَعْلَلٌ — مُفَعْلَلٌ',
      note: "Fi'il Ruba'i Mujarrad memiliki 4 huruf asli (ف - ع - ل١ - ل٢) dan tidak memiliki Isim Alat qiyasi."
    };
  }
  if (verb.babId === 'rubai_mazid') {
    return {
      title: "Pola Baku Ruba'i Mazid (+1 Huruf تَفَعْلَلَ & +2 Huruf اِفْعَلَلَّ)",
      arabic: `${verb.wazan} | ${verb.bina}`,
      note: "Huruf mudhara'ah pada تَفَعْلَلَ berfathah (يَتَفَعْلَلُ), sedangkan pada اِفْعَلَلَّ berfathah (يَفْعَلِلُّ) dan wajib fakkul idgham bila bersambung dhamir mutaharrik."
    };
  }
  if (verb.babId === 'mazid') {
    return {
      title: 'Kaidah Umum Tsulatsi Mazid (Huruf Tambahan)',
      arabic: `${verb.wazan} • يُـ/يَـ + حَرْفُ الزِّيَادَةِ`,
      note: "Pada Tsulatsi Mazid maupun Ruba'i, Isim Fa'il dibentuk dari mudhari' dengan mengubah huruf mudhara'ah menjadi مٌُ dan mengkasrah huruf sebelum akhir, sedangkan Isim Maf'ul, Zaman, Makan, & Mashdar Mimi seragam memakai fathah sebelum akhir."
    };
  }
  return {
    title: 'Urutan Baku Kitab At-Tashrif Al-Ishtilahi (11 Shighah Tsulatsi Mujarrad)',
    arabic: 'فَعَلَ — يَفْعُلُ — فَعْلًا — وَمَفْعَلًا — فَهُوَ فَاعِلٌ — وَذَاكَ مَفْعُولٌ — اُفْعُلْ — لَا تَفْعُلْ — مَفْعَلٌ — مَفْعَلٌ — مِفْعَلٌ',
    note: `Pada ${verb.babNameId} (${verb.wazan}), perubahan vokal utama terletak pada harakat 'ain fi'il antara Madhi dan Mudhari'.`
  };
}

function getZiyadahAnalysis(verb) {
  if (!verb) return null;
  if (verb.babId === 'rubai_mazid') {
    if (verb.wazan.startsWith('تَفَعْلَلَ')) {
      return {
        tag: "Ruba'i Mazid +1 Huruf",
        extra: 'Huruf تَ (Ta\' Muthawwa\'ah) di awal kata',
        meaningImpact: 'Mengubah makna transitif menjadi akibat/refleksif (berbuat dengan sendirinya).'
      };
    }
    return {
      tag: "Ruba'i Mazid +2 Huruf",
      extra: 'Hamzah washal (اِـ) di awal + Tadh\'if/penggandaan Lam ke-2 (ـلَّ)',
      meaningImpact: 'Memberikan makna intensitas (mubalaghah) suatu keadaan yang dalam.'
    };
  }
  if (verb.babId === 'rubai_mujarrad') {
    return {
      tag: "Ruba'i Mujarrad (Murni 4 Huruf)",
      extra: 'Tidak ada huruf ziyadah — seluruh 4 huruf adalah akar kata asli',
      meaningImpact: 'Hanya mengikuti 1 pola dasar (فَعْلَلَ - يُفَعْلِلُ).'
    };
  }
  if (verb.babId !== 'mazid') {
    return {
      tag: 'Tsulatsi Mujarrad (Murni 3 Huruf)',
      extra: 'Tidak ada huruf tambahan — 100% tersusun dari Fa\', \'Ain, dan Lam fi\'il',
      meaningImpact: verb.faedah
    };
  }
  const w = verb.wazan || '';
  if (w.startsWith('أَفْعَلَ')) return { tag: 'Mazid +1 Huruf (Bab Af\'ala)', extra: 'Hamzah Qatha\' (أَـ) di awal', meaningImpact: 'Umumnya untuk Ta\'diyah (menjadikan kata kerja butuh objek).' };
  if (w.startsWith('فَعَّلَ')) return { tag: 'Mazid +1 Huruf (Bab Fa\'\'ala)', extra: 'Tasydid / Penggandaan \'Ain Fi\'il', meaningImpact: 'Ta\'diyah, Taktsir (sering/banyak), atau menisbahkan perbuatan.' };
  if (w.startsWith('فَاعَلَ')) return { tag: 'Mazid +1 Huruf (Bab Fa\'ala)', extra: 'Alif setelah Fa\' Fi\'il', meaningImpact: 'Musyarakah (perbuatan timbal balik antar dua pihak).' };
  if (w.startsWith('تَفَعَّلَ')) return { tag: 'Mazid +2 Huruf (Bab Tafa\'\'ala)', extra: 'Ta\' (تَـ) di awal + Tasydid \'Ain Fi\'il', meaningImpact: 'Takalluf (bersungguh-sungguh mengupayakan) atau Muthawwa\'ah.' };
  if (w.startsWith('تَفَاعَلَ')) return { tag: 'Mazid +2 Huruf (Bab Tafa\'ala)', extra: 'Ta\' (تَـ) di awal + Alif setelah Fa\' Fi\'il', meaningImpact: 'Musyarakah sejajar (saling) atau pura-pura.' };
  if (w.startsWith('اِفْتَعَلَ')) return { tag: 'Mazid +2 Huruf (Bab Ifta\'ala)', extra: 'Hamzah washal (اِـ) + Ta\' (ـتَـ) setelah Fa\' Fi\'il', meaningImpact: 'Ittikhadz / kesungguhan menyimak atau berkumpul.' };
  if (w.startsWith('اِنْفَعَلَ')) return { tag: 'Mazid +2 Huruf (Bab Infa\'ala)', extra: 'Hamzah washal (اِـ) + Nun (نْ) di awal', meaningImpact: 'Muthawwa\'ah / menjadi terpengaruh secara pasif (pecah/terbelah).' };
  if (w.startsWith('اِفْعَلَّ')) return { tag: 'Mazid +2 Huruf (Bab If\'alla)', extra: 'Hamzah washal (اِـ) + Penggandaan Lam Fi\'il', meaningImpact: 'Khusus warna kuat atau sifat fisik yang melekat (Lazim).' };
  return { tag: 'Mazid +3 Huruf (Bab Istaf\'ala)', extra: 'Hamzah washal + Sin + Ta\' (اِسْتَـ) di awal', meaningImpact: 'Thalab (memohon/meminta) atau menganggap sifat.' };
}

export default function TashrifLabView({ fontSize = 26, onOpenMateri, initialVerbId }) {
  const [activeBab, setActiveBab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerbId, setSelectedVerbId] = useState(initialVerbId || tashrifData.verbs[0]?.id || 'nasara');
  const [subTab, setSubTab] = useState('istilahi'); // 'istilahi' | 'lughawi' | 'mizan' | 'quiz'
  const [lughawiTense, setLughawiTense] = useState('madhi'); // 'madhi' | 'mudhari' | 'amr'
  const [speakingText, setSpeakingText] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Stop speech cleanly on unmount
  useEffect(() => {
    return () => stopArabicSpeech();
  }, []);

  useEffect(() => {
    if (initialVerbId && tashrifData.verbs.some((v) => v.id === initialVerbId)) {
      setSelectedVerbId(initialVerbId);
      setActiveBab('all');
    }
  }, [initialVerbId]);

  const babCounts = useMemo(() => {
    const map = { all: tashrifData.verbs.length };
    tashrifData.verbs.forEach((v) => {
      map[v.babId] = (map[v.babId] || 0) + 1;
    });
    return map;
  }, []);

  const filteredVerbs = useMemo(() => {
    const raw = searchQuery.trim();
    const normQuery = normalizeArabic(raw).replace(/\s+/g, '');
    const lowerQuery = raw.toLowerCase();

    return tashrifData.verbs.filter((v) => {
      if (activeBab !== 'all' && v.babId !== activeBab) return false;
      if (!raw) return true;

      if (
        v.meaning.toLowerCase().includes(lowerQuery) ||
        v.babNameId.toLowerCase().includes(lowerQuery) ||
        v.wazan.toLowerCase().includes(lowerQuery) ||
        v.root.toLowerCase().includes(lowerQuery) ||
        v.id.toLowerCase().includes(lowerQuery)
      ) {
        return true;
      }

      const arFields = [
        v.root.replace(/-/g, ''),
        v.istilahi.madhi,
        v.istilahi.mudhari,
        v.istilahi.mashdar,
        v.istilahi.isimFail,
        v.istilahi.isimMaful,
        v.istilahi.amr,
        v.syahid?.textAr || '',
      ];
      return arFields.some((f) => normalizeArabic(f).replace(/\s+/g, '').includes(normQuery));
    });
  }, [activeBab, searchQuery]);

  const activeVerb = useMemo(() => {
    const found = filteredVerbs.find((v) => v.id === selectedVerbId);
    if (found) return found;
    if (filteredVerbs.length > 0) return filteredVerbs[0];
    return tashrifData.verbs.find((v) => v.id === selectedVerbId) || tashrifData.verbs[0];
  }, [filteredVerbs, selectedVerbId]);

  const handlePlayAudio = (text, idKey) => {
    const tag = idKey || text;
    if (speakingText === tag) {
      stopArabicSpeech();
      setSpeakingText(null);
      return;
    }
    speakArabic(text, {
      onStart: () => setSpeakingText(tag),
      onEnd: () => setSpeakingText((cur) => (cur === tag ? null : cur)),
      onError: () => setSpeakingText(null),
    });
  };

  const handleCopy = (text, idKey) => {
    if (!text) return;
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(idKey);
      setTimeout(() => setCopiedId((cur) => (cur === idKey ? null : cur)), 1600);
    });
  };

  const rootParts = useMemo(() => {
    return (activeVerb?.root || '').split('-').map((s) => s.trim()).filter(Boolean);
  }, [activeVerb]);

  const ziyadahInfo = useMemo(() => getZiyadahAnalysis(activeVerb), [activeVerb]);
  const nadhzamRule = useMemo(() => getBabNadhzamRule(activeVerb), [activeVerb]);

  const quizzes = tashrifData.quizzes || [];
  const currentQuiz = quizzes[quizIndex];
  const isQuizFinished = quizIndex >= quizzes.length;

  const handleAnswerQuiz = (optIdx) => {
    if (quizAnswered || !currentQuiz) return;
    setSelectedOption(optIdx);
    setQuizAnswered(true);
    if (optIdx === currentQuiz.correctIndex) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedOption(null);
    setQuizAnswered(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/80 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-arabic text-sm" dir="rtl">مُخْتَبَرُ الصَّرْفِ وَالتَّصْرِيفِ</span>
              <span>• Model Interaktif Al-Fashih</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Laboratorium Tashrif Ishtilahi &amp; Lughawi
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Simulasi konjugasi kata kerja Arab terlengkap dari <strong className="text-amber-300">Tsulatsi Mujarrad (Bab 1–6)</strong>,{' '}
              <strong className="text-amber-300">Tsulatsi Mazid</strong>, hingga <strong className="text-amber-300">Ruba&apos;i Mujarrad &amp; Mazid</strong>. Dilengkapi 11 shighah Ishtilahi, 14 dhamir Lughawi, Mizan Sharfi, pelafalan audio, serta kuis sharaf.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 text-center">
              <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/60">
                <div className="text-lg font-extrabold text-amber-400">{tashrifData.verbs.length}</div>
                <div className="text-[10px] text-emerald-200 font-semibold">Kata Kerja</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/60">
                <div className="text-lg font-extrabold text-amber-400">11</div>
                <div className="text-[10px] text-emerald-200 font-semibold">Shighah Ishtilahi</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/60">
                <div className="text-lg font-extrabold text-amber-400">14</div>
                <div className="text-[10px] text-emerald-200 font-semibold">Dhamir Lughawi</div>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/60">
                <div className="text-lg font-extrabold text-amber-400">{quizzes.length}</div>
                <div className="text-[10px] text-emerald-200 font-semibold">Soal Kuis</div>
              </div>
            </div>
            {onOpenMateri && (
              <button
                onClick={onOpenMateri}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-extrabold shadow transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Baca Teori Bab 2–14 Sharaf</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls: Filter Wazan & Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Dropdown + Quick Title */}
          <div className="flex items-center gap-2.5 flex-1">
            <label htmlFor="tashrif-bab-select" className="text-xs font-bold text-slate-600 shrink-0">
              Pilih Wazan:
            </label>
            <select
              id="tashrif-bab-select"
              value={activeBab}
              onChange={(e) => setActiveBab(e.target.value)}
              className="flex-1 max-w-md px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {tashrifData.wazanCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameId} ({babCounts[c.id] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari akar kata Arab (tanpa harakat) atau arti Indo..."
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                aria-label="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-1.5">
          {tashrifData.wazanCategories.map((cat) => {
            const isActive = activeBab === cat.id;
            const isRubai = cat.id.startsWith('rubai');
            return (
              <button
                key={cat.id}
                onClick={() => setActiveBab(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-900 text-amber-300 border-emerald-900 shadow-sm'
                    : isRubai
                    ? 'bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                <span className="font-arabic text-sm" dir="rtl">{cat.nameAr}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-emerald-800 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
                  {babCounts[cat.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Verb Selector Pills */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Pilih Sampel Kata Kerja ({filteredVerbs.length} ditemukan)
            </span>
          </div>

          {filteredVerbs.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
              <p className="text-sm font-semibold text-slate-600">Tidak ada kata kerja yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.</p>
              <button
                onClick={() => {
                  setActiveBab('all');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredVerbs.map((v) => {
                const isSelected = activeVerb?.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVerbId(v.id)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-md ring-2 ring-amber-400/70'
                        : 'bg-slate-50/80 hover:bg-emerald-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span
                        className={`font-arabic text-lg font-extrabold leading-tight ${isSelected ? 'text-amber-300' : 'text-emerald-950'}`}
                        dir="rtl"
                      >
                        {v.istilahi.madhi}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          isSelected ? 'bg-emerald-800 text-amber-200' : 'bg-white text-slate-500 border border-slate-200'
                        }`}
                      >
                        {v.root}
                      </span>
                    </div>
                    <div className={`text-[11px] font-semibold line-clamp-1 ${isSelected ? 'text-emerald-100' : 'text-slate-600'}`}>
                      {v.meaning}
                    </div>
                    <div className={`text-[9px] font-bold ${isSelected ? 'text-amber-300/90' : 'text-emerald-700'}`}>
                      {getBabShortLabel(v.babId)}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active Verb Showcase Hero */}
      {activeVerb && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-emerald-200/80 shadow-md space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-arabic text-sm font-bold" dir="rtl">
                  {activeVerb.babNameAr}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {activeVerb.babNameId}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  {activeVerb.bina}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                  Akar: {activeVerb.root} ({rootParts.length} Huruf)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div
                  className="font-arabic font-extrabold text-emerald-950 tracking-wide"
                  style={{ fontSize: `${Math.min(44, fontSize + 10)}px`, lineHeight: 1.5 }}
                  dir="rtl"
                >
                  {activeVerb.istilahi.madhi} <span className="text-amber-500">—</span> {activeVerb.istilahi.mudhari}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAudio(`${activeVerb.istilahi.madhi}، ${activeVerb.istilahi.mudhari}`, 'hero')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      speakingText === 'hero'
                        ? 'bg-amber-400 text-emerald-950 animate-pulse shadow'
                        : 'bg-emerald-900 text-amber-300 hover:bg-emerald-800'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{speakingText === 'hero' ? 'Melafalkan...' : 'Dengarkan'}</span>
                  </button>
                  <button
                    onClick={() => handleCopy(`${activeVerb.istilahi.madhi} - ${activeVerb.istilahi.mudhari}`, 'hero-copy')}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                    title="Salin Madhi & Mudhari"
                  >
                    {copiedId === 'hero-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'hero-copy' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-base sm:text-lg font-extrabold text-slate-800">
                  Arti: <span className="text-emerald-800">{activeVerb.meaning}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-600">
                  <span className="font-bold text-slate-700">Wazan Baku:</span>{' '}
                  <span className="font-arabic text-base font-bold text-emerald-900" dir="rtl">{activeVerb.wazan}</span>
                  {' '}• {activeVerb.faedah}
                </div>
              </div>
            </div>

            {/* Syahid Qurani Box */}
            {activeVerb.syahid && (
              <div className="lg:max-w-md w-full bg-gradient-to-br from-amber-50/90 to-emerald-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    Syahid / Contoh Kalimat
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePlayAudio(activeVerb.syahid.textAr, 'syahid')}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        speakingText === 'syahid' ? 'bg-amber-400 text-emerald-950' : 'bg-white text-emerald-800 hover:bg-emerald-100 border border-amber-200'
                      }`}
                      title="Dengarkan Syahid"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-emerald-900 border border-amber-200">
                      {activeVerb.syahid.source}
                    </span>
                  </div>
                </div>
                <p
                  className="font-arabic text-emerald-950 font-bold leading-loose text-right"
                  style={{ fontSize: `${Math.max(20, fontSize - 4)}px` }}
                  dir="rtl"
                >
                  {activeVerb.syahid.textAr}
                </p>
                <p className="text-xs text-slate-700 italic">&ldquo;{activeVerb.syahid.translation}&rdquo;</p>
              </div>
            )}
          </div>

          {/* Sub-Navigation Tabs inside Tashrif Lab */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
            {[
              { id: 'istilahi', label: 'Tashrif Ishtilahi (11 Shighah)', icon: Layers },
              { id: 'lughawi', label: 'Tashrif Lughawi (14 Dhamir)', icon: Users },
              { id: 'mizan', label: 'Mizan Sharaf & Bedah Huruf', icon: Scale },
              { id: 'quiz', label: `Tantangan Kuis Sharaf (${quizzes.length})`, icon: GraduationCap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isAct = subTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSubTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer border ${
                    isAct
                      ? 'bg-emerald-900 text-amber-300 border-emerald-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 1: TASHRIF ISHTILAHI (11 SHIGHAH) */}
      {activeVerb && subTab === 'istilahi' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {SHIGHAH_DEFS.map((shighah, idx) => {
              const value = activeVerb.istilahi[shighah.key];
              const isNone = !value || value.startsWith('-');
              const cardKey = `ist-${activeVerb.id}-${shighah.key}`;
              return (
                <div
                  key={shighah.key}
                  className={`rounded-2xl p-4 border transition flex flex-col justify-between gap-3 ${
                    isNone
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                        Shighah {idx + 1}
                      </div>
                      <div className="font-arabic text-base font-extrabold text-emerald-900" dir="rtl">
                        {shighah.titleAr}
                      </div>
                      <div className="text-xs font-bold text-slate-700">{shighah.titleId}</div>
                    </div>
                    {!isNone && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePlayAudio(value, cardKey)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            speakingText === cardKey ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                          title="Dengarkan"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopy(value, cardKey)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                          title="Salin"
                        >
                          {copiedId === cardKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className={`font-arabic font-extrabold text-center py-2 px-3 rounded-xl ${
                      isNone ? 'bg-slate-100 text-slate-400 text-sm font-sans' : 'bg-emerald-50/60 text-emerald-950'
                    }`}
                    style={!isNone ? { fontSize: `${Math.min(34, fontSize + 2)}px`, lineHeight: 1.6 } : undefined}
                    dir={!isNone ? 'rtl' : 'ltr'}
                  >
                    {value}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
                    <span>{shighah.role}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {nadhzamRule && (
            <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-5 border border-emerald-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>{nadhzamRule.title}</span>
              </div>
              <p className="font-arabic text-base sm:text-lg text-white leading-loose" dir="rtl">
                {nadhzamRule.arabic}
              </p>
              <p className="text-xs text-emerald-200/90">{nadhzamRule.note}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TASHRIF LUGHAWI (14 DHAMIR) */}
      {activeVerb && subTab === 'lughawi' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'madhi', ar: 'الفِعْلُ المَاضِي', idLabel: "Fi'il Madhi (14 Dhamir)" },
                { id: 'mudhari', ar: 'الفِعْلُ المُضَارِعُ', idLabel: "Fi'il Mudhari' (14 Dhamir)" },
                { id: 'amr', ar: 'فِعْلُ الأَمْرِ', idLabel: "Fi'il Amr (6 Mukhatab)" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setLughawiTense(t.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 border ${
                    lughawiTense === t.id
                      ? 'bg-emerald-900 text-amber-300 border-emerald-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                  }`}
                >
                  <span className="font-arabic text-sm" dir="rtl">{t.ar}</span>
                  <span>• {t.idLabel}</span>
                </button>
              ))}
            </div>

            {lughawiTense === 'amr' && (
              <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Info className="w-4 h-4 shrink-0" />
                <span>Fi&apos;il Amr hanya berlaku untuk 6 dhamir Mukhatab (Orang Kedua).</span>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {LUGHAWI_GROUPS.map((grp) => (
              <div key={grp.key} className={`rounded-2xl p-4 sm:p-5 border ${grp.accent} space-y-3`}>
                <h3 className="text-xs sm:text-sm font-extrabold text-emerald-950 font-arabic" dir="rtl">
                  {grp.title}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {grp.indices.map((dIdx) => {
                    const dhamir = tashrifData.dhamirList[dIdx];
                    const word = activeVerb.lughawi[lughawiTense]?.[dIdx] || '-';
                    const isEmpty = word === '-';
                    const dKey = `lug-${activeVerb.id}-${lughawiTense}-${dIdx}`;
                    return (
                      <div
                        key={dhamir.id}
                        className={`rounded-xl p-3 border transition flex flex-col justify-between gap-2 ${
                          isEmpty
                            ? 'bg-white/50 border-slate-200/70 opacity-50'
                            : 'bg-white border-slate-200 hover:border-emerald-400 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-arabic font-extrabold text-sm" dir="rtl">
                            {dhamir.ar}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">#{dIdx + 1}</span>
                        </div>

                        <div
                          className={`font-arabic font-extrabold text-center py-1 ${isEmpty ? 'text-slate-400' : 'text-emerald-950'}`}
                          style={!isEmpty ? { fontSize: `${Math.min(30, fontSize)}px`, lineHeight: 1.5 } : undefined}
                          dir="rtl"
                        >
                          {word}
                        </div>

                        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100">
                          <span className="text-[10px] font-semibold text-slate-600 line-clamp-1">{dhamir.trans}</span>
                          {!isEmpty && (
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                onClick={() => handlePlayAudio(word, dKey)}
                                className={`p-1 rounded transition cursor-pointer ${
                                  speakingText === dKey ? 'bg-amber-400 text-emerald-950' : 'text-emerald-700 hover:bg-emerald-50'
                                }`}
                                title="Dengarkan"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleCopy(word, dKey)}
                                className="p-1 rounded text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                                title="Salin"
                              >
                                {copiedId === dKey ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MIZAN SHARAF */}
      {activeVerb && subTab === 'mizan' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
              Timbangan Morfologi Arab (المِيزَانُ الصَّرْفِيُّ)
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-emerald-950">
              Bedah Huruf Asli ({rootParts.length === 4 ? "ف - ع - ل١ - ل٢ / Ruba'i" : "ف - ع - ل / Tsulatsi"}) &amp; Ziyadah
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              Setiap huruf asal ditimbang dengan pola <strong>ف — ع — ل</strong> (untuk akar 3 huruf) atau <strong>ف — ع — ل ١ — ل ٢</strong> (untuk akar 4 huruf Ruba&apos;i).
            </p>
          </div>

          {/* Root Letter Mapping Boxes */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4" dir="rtl">
            {rootParts.map((letter, idx) => {
              const scales3 = [
                { scale: 'فَاءُ الكَلِمَةِ', label: "Fa' Fi'il (Huruf Asli 1)" },
                { scale: 'عَيْنُ الكَلِمَةِ', label: "'Ain Fi'il (Huruf Asli 2)" },
                { scale: 'لَامُ الكَلِمَةِ', label: "Lam Fi'il (Huruf Asli 3)" },
              ];
              const scales4 = [
                { scale: 'فَاءُ الكَلِمَةِ', label: "Fa' Fi'il (Huruf Asli 1)" },
                { scale: 'عَيْنُ الكَلِمَةِ', label: "'Ain Fi'il (Huruf Asli 2)" },
                { scale: 'اللَّامُ الأُولَى', label: 'Lam Ula (Huruf Asli 3)' },
                { scale: 'اللَّامُ الثَّانِيَةُ', label: 'Lam Tsaniyah (Huruf Asli 4)' },
              ];
              const meta = (rootParts.length === 4 ? scales4 : scales3)[idx] || { scale: 'حَرْفٌ أَصْلِيٌّ', label: 'Huruf Asli' };
              return (
                <div
                  key={`${activeVerb.id}-root-${idx}`}
                  className="min-w-[130px] sm:min-w-[155px] p-4 rounded-2xl bg-gradient-to-b from-emerald-50 to-white border-2 border-emerald-200 text-center space-y-1.5 shadow-xs"
                >
                  <div className="text-[11px] font-bold text-amber-800">{meta.label}</div>
                  <div className="font-arabic text-4xl sm:text-5xl font-extrabold text-emerald-950">{letter}</div>
                  <div className="font-arabic text-sm font-bold text-emerald-700 bg-emerald-100/80 py-1 px-2.5 rounded-full">
                    {meta.scale}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagnostic Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                1. Klasifikasi Wazan &amp; Tambahan (Ziyadah)
              </div>
              <div className="text-sm font-extrabold text-slate-900">{ziyadahInfo?.tag}</div>
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong>Komposisi Tambahan:</strong> {ziyadahInfo?.extra}
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong>Dampak Semantik:</strong> {ziyadahInfo?.meaningImpact}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                2. Identitas Bina&apos; &amp; Wazan Standar
              </div>
              <div className="text-sm font-extrabold text-emerald-950">{activeVerb.bina}</div>
              <div className="text-xs text-slate-700">
                <strong>Wazan Kitab:</strong>{' '}
                <span className="font-arabic text-base font-bold text-emerald-900" dir="rtl">{activeVerb.wazan}</span>
              </div>
              <div className="text-xs text-slate-700">
                <strong>Contoh Turunan Kunci:</strong> Madhi (<span className="font-arabic font-bold text-sm">{activeVerb.istilahi.madhi}</span>) → Mashdar (<span className="font-arabic font-bold text-sm">{activeVerb.istilahi.mashdar}</span>) → Isim Fa&apos;il (<span className="font-arabic font-bold text-sm">{activeVerb.istilahi.isimFail}</span>)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TANTANGAN KUIS SHARAF */}
      {subTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm max-w-3xl mx-auto">
          {isQuizFinished ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <GraduationCap className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-extrabold text-emerald-950">Kuis Tashrif &amp; Sharaf Selesai!</h3>
              <p className="text-sm text-slate-600">
                Skor Akhir Anda:{' '}
                <strong className="text-emerald-800 text-lg">{quizScore}</strong> dari{' '}
                <strong>{quizzes.length}</strong> soal (
                {Math.round((quizScore / Math.max(1, quizzes.length)) * 100)}%)
              </p>
              <button
                onClick={handleRestartQuiz}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-sm font-bold transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Kuis Sharaf</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Top Progress */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-100 pb-3">
                <span>Soal {quizIndex + 1} dari {quizzes.length}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                  Skor Sementara: {quizScore}
                </span>
              </div>

              {/* Target Word Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50/40 border border-emerald-200 text-center space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <span
                    className="font-arabic font-extrabold text-emerald-950"
                    style={{ fontSize: `${Math.min(40, fontSize + 8)}px` }}
                    dir="rtl"
                  >
                    {currentQuiz.word}
                  </span>
                  <button
                    onClick={() => handlePlayAudio(currentQuiz.word, `quiz-${currentQuiz.id}`)}
                    className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                    title="Dengarkan Lafazh"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-arabic text-base font-bold text-slate-700" dir="rtl">
                  {currentQuiz.questionAr}
                </p>
                <p className="text-sm font-bold text-slate-800">{currentQuiz.questionId}</p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQuiz.options.map((opt, idx) => {
                  const isCorrect = idx === currentQuiz.correctIndex;
                  const isChosen = selectedOption === idx;
                  let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-emerald-50 hover:border-emerald-300';
                  if (quizAnswered) {
                    if (isCorrect) {
                      style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isChosen) {
                      style = 'bg-rose-100 border-rose-500 text-rose-950';
                    } else {
                      style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-70';
                    }
                  }
                  return (
                    <button
                      key={idx}
                      disabled={quizAnswered}
                      onClick={() => handleAnswerQuiz(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between gap-2 ${
                        !quizAnswered ? 'cursor-pointer' : 'cursor-default'
                      } ${style}`}
                    >
                      <span>{opt}</span>
                      {quizAnswered && isCorrect && <span className="text-emerald-700 font-extrabold">✓ Benar</span>}
                      {quizAnswered && isChosen && !isCorrect && <span className="text-rose-700 font-extrabold">✕ Salah</span>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {quizAnswered && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                    Pembahasan Sharaf:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {currentQuiz.explanation}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setQuizIndex((i) => i + 1);
                        setSelectedOption(null);
                        setQuizAnswered(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-bold cursor-pointer transition"
                    >
                      <span>Lanjut Soal Berikutnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
