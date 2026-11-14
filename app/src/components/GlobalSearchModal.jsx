import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, BookOpen, Sparkles, Layers, BookMarked, Compass, FlaskConical } from 'lucide-react';
import babData from '../data/01_kurikulum_bab.json';
import materiData from '../data/02_materi_kaidah.json';
import quranData from '../data/06_latihan_quran.json';
import irabData from '../data/03_contoh_dan_irab.json';
import kamusData from '../data/05_kamus_istilah.json';
import tashrifData from '../data/tashrif_data.json';
import {
  loadGlobalQuranIndex,
  searchGlobalQuran,
  prepareSearchQuery,
  matchArabicText,
  normalizeLatin
} from '../utils/quranSearch';

export default function GlobalSearchModal({ isOpen, onClose, onSelectResult }) {
  const [query, setQuery] = useState('');
  const [surahList, setSurahList] = useState([]);
  const [globalQuranIndex, setGlobalQuranIndex] = useState(null);

  // Lazy load surahList & 6.236-ayah index saat modal pencarian dibuka
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    fetch('/data/quran/surah_list.json')
      .then((r) => r.json())
      .then((list) => {
        if (!active) return;
        setSurahList(list);
        return loadGlobalQuranIndex(list);
      })
      .then((idx) => {
        if (active && idx) setGlobalQuranIndex(idx);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const raw = query.trim();
    const q = raw.toLowerCase();
    if (!raw || raw.length < 2) {
      return { mushaf: [], quran: [], tashrif: [], materi: [], irab: [], kamus: [] };
    }

    const parsed = prepareSearchQuery(raw);
    const latinQ = normalizeLatin(raw);
    const cleanArQuery = parsed.isArabic ? parsed.cleanArabic : '';

    const globalHits = searchGlobalQuran(globalQuranIndex || [], raw, surahList, 8);
    const mushaf = [...globalHits.directRefs, ...globalHits.matches].slice(0, 8);

    const tashrif = (tashrifData.verbs || []).filter(v =>
      v.meaning.toLowerCase().includes(q) ||
      v.babNameId.toLowerCase().includes(q) ||
      v.root.toLowerCase().includes(q) ||
      v.id.toLowerCase().includes(q) ||
      (cleanArQuery && (
        matchArabicText(v.istilahi.madhi, parsed) ||
        matchArabicText(v.istilahi.mudhari, parsed) ||
        matchArabicText(v.istilahi.mashdar, parsed) ||
        matchArabicText(v.istilahi.isimFail, parsed)
      ))
    ).slice(0, 5);

    const quran = quranData.filter(i =>
      i.surah.toLowerCase().includes(q) ||
      (parsed.isArabic ? matchArabicText(i.teks_ayat_arab, parsed) : i.teks_ayat_arab.includes(raw)) ||
      normalizeLatin(i.terjemahan_indo).includes(latinQ) ||
      i.kategori_binyah?.toLowerCase().includes(q)
    ).slice(0, 5);

    const materi = materiData.filter(m =>
      m.sub_topik_indo.toLowerCase().includes(q) ||
      (parsed.isArabic ? matchArabicText(m.sub_topik_arab, parsed) : m.sub_topik_arab.includes(raw)) ||
      m.penjelasan_indo.toLowerCase().includes(q)
    ).slice(0, 5);

    const irab = irabData.filter(i =>
      (parsed.isArabic ? matchArabicText(i.kalimat_arab, parsed) : i.kalimat_arab.includes(raw)) ||
      i.terjemahan_indo.toLowerCase().includes(q) ||
      i.kata_kunci?.toLowerCase().includes(q)
    ).slice(0, 5);

    const kamus = kamusData.filter(k =>
      (parsed.isArabic ? matchArabicText(k.istilah_arab, parsed) : k.istilah_arab.toLowerCase().includes(q)) ||
      k.definisi_indo.toLowerCase().includes(q)
    ).slice(0, 5);

    return { mushaf, quran, tashrif, materi, irab, kamus };
  }, [query, globalQuranIndex, surahList]);

  if (!isOpen) return null;

  const totalResults =
    results.mushaf.length +
    results.quran.length +
    results.tashrif.length +
    results.materi.length +
    results.irab.length +
    results.kamus.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-emerald-700 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Cari kaidah, ayat Al-Qur'an, syahid, atau istilah..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4 divide-y divide-slate-100">
          {query.trim().length < 2 ? (
            <div className="text-center py-8 text-slate-400 text-xs sm:text-sm">
              Ketik minimal 2 karakter untuk menelusuri 6.236 ayat Al-Qur'an, 520 latihan, 149 materi, 119 syahid, dan 63 istilah (mis. <span className="font-mono text-slate-600">2:255</span>, <span className="font-semibold text-slate-600">baqarah 255</span>, <span className="font-arabic text-slate-600">الحمد لله</span>).
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Tidak ditemukan hasil untuk "{query}"
            </div>
          ) : (
            <>
              {/* Mushaf 6.236 Ayah Results */}
              {results.mushaf.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Mushaf Al-Qur'an 30 Juz ({results.mushaf.length})
                  </span>
                  <div className="space-y-1.5">
                    {results.mushaf.map((item) => (
                      <div
                        key={`mushaf-${item.s}:${item.a}`}
                        onClick={() => {
                          onSelectResult('quran', item);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-emerald-50/80 cursor-pointer transition border border-transparent hover:border-emerald-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>QS. {item.surahName}: {item.a}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Lompat Langsung
                              </span>
                            )}
                          </div>
                          {item.id && (
                            <div className="text-slate-500 line-clamp-1">{item.id}</div>
                          )}
                        </div>
                        <span className="font-arabic text-base font-semibold text-emerald-900 shrink-0 max-w-[200px] truncate" dir="rtl">
                          {item.t || item.surahArab}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quran Results */}
              {results.quran.length > 0 && (
                <div className="space-y-2 pt-3">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Latihan Al-Qur'an ({results.quran.length})
                  </span>
                  <div className="space-y-1.5">
                    {results.quran.map(item => (
                      <div
                        key={item.id_latihan}
                        onClick={() => {
                          onSelectResult('quran', item);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-emerald-50/80 cursor-pointer transition border border-transparent hover:border-emerald-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">QS. {item.surah}: {item.ayat}</div>
                          <div className="text-slate-500 line-clamp-1">{item.terjemahan_indo}</div>
                        </div>
                        <span className="font-arabic text-sm font-semibold text-emerald-900 shrink-0">
                          {item.kata_kunci_syahid || item.surah}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tashrif Sharaf Results */}
              {results.tashrif.length > 0 && (
                <div className="space-y-2 pt-3">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5" />
                    Laboratorium Tashrif &amp; Sharaf ({results.tashrif.length})
                  </span>
                  <div className="space-y-1.5">
                    {results.tashrif.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectResult('tashrif', item);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-emerald-50/80 cursor-pointer transition border border-transparent hover:border-emerald-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{item.meaning} ({item.babNameId})</div>
                          <div className="text-slate-500 line-clamp-1">{item.bina} • Akar: {item.root}</div>
                        </div>
                        <span className="font-arabic text-base font-semibold text-emerald-900 shrink-0" dir="rtl">
                          {item.istilahi.madhi} — {item.istilahi.mudhari}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materi Results */}
              {results.materi.length > 0 && (
                <div className="space-y-2 pt-3">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Materi Kaidah ({results.materi.length})
                  </span>
                  <div className="space-y-1.5">
                    {results.materi.map(item => (
                      <div
                        key={item.id_materi}
                        onClick={() => {
                          onSelectResult('materi', item);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-amber-50/80 cursor-pointer transition border border-transparent hover:border-amber-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{item.sub_topik_indo}</div>
                          <div className="text-slate-500 line-clamp-1">{item.penjelasan_indo}</div>
                        </div>
                        <span className="font-arabic text-sm font-semibold text-amber-900 shrink-0">
                          {item.sub_topik_arab}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Irab Syahid Results */}
              {results.irab.length > 0 && (
                <div className="space-y-2 pt-3">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Laboratorium I'rab ({results.irab.length})
                  </span>
                  <div className="space-y-1.5">
                    {results.irab.map(item => (
                      <div
                        key={item.id_contoh}
                        onClick={() => {
                          onSelectResult('irab', item);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-teal-50/80 cursor-pointer transition border border-transparent hover:border-teal-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{item.jenis_dalil} ({item.kata_kunci})</div>
                          <div className="text-slate-500 line-clamp-1">{item.terjemahan_indo}</div>
                        </div>
                        <span className="font-arabic text-sm font-semibold text-teal-900 shrink-0 line-clamp-1 max-w-[200px]">
                          {item.kalimat_arab}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kamus Results */}
              {results.kamus.length > 0 && (
                <div className="space-y-2 pt-3">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5" />
                    Kamus Istilah ({results.kamus.length})
                  </span>
                  <div className="space-y-1.5">
                    {results.kamus.map(item => (
                      <div
                        key={item.id_istilah}
                        onClick={() => {
                          onSelectResult('kamus', item);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 cursor-pointer transition border border-transparent hover:border-slate-300 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">{item.istilah_arab} ({item.bidang})</div>
                          <div className="text-slate-500 line-clamp-1">{item.definisi_indo}</div>
                        </div>
                        <span className="font-arabic text-base font-semibold text-slate-900 shrink-0">
                          {item.istilah_arab}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
