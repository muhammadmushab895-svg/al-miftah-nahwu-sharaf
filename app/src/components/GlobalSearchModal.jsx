import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, BookOpen, Sparkles, Layers, BookMarked, ArrowRight } from 'lucide-react';
import babData from '../data/01_kurikulum_bab.json';
import materiData from '../data/02_materi_kaidah.json';
import quranData from '../data/06_latihan_quran.json';
import irabData from '../data/03_contoh_dan_irab.json';
import kamusData from '../data/05_kamus_istilah.json';

export default function GlobalSearchModal({ isOpen, onClose, onSelectResult }) {
  const [query, setQuery] = useState('');

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
    const q = query.toLowerCase().trim();
    if (!q || q.length < 2) return { quran: [], materi: [], irab: [], kamus: [] };

    const quran = quranData.filter(i => 
      i.surah.toLowerCase().includes(q) ||
      i.teks_ayat_arab.includes(q) ||
      i.terjemahan_indo.toLowerCase().includes(q) ||
      i.kategori_binyah?.toLowerCase().includes(q)
    ).slice(0, 5);

    const materi = materiData.filter(m =>
      m.sub_topik_indo.toLowerCase().includes(q) ||
      m.sub_topik_arab.includes(q) ||
      m.penjelasan_indo.toLowerCase().includes(q)
    ).slice(0, 5);

    const irab = irabData.filter(i =>
      i.kalimat_arab.includes(q) ||
      i.terjemahan_indo.toLowerCase().includes(q) ||
      i.kata_kunci?.toLowerCase().includes(q)
    ).slice(0, 5);

    const kamus = kamusData.filter(k =>
      k.istilah_arab.toLowerCase().includes(q) ||
      k.definisi_indo.toLowerCase().includes(q)
    ).slice(0, 5);

    return { quran, materi, irab, kamus };
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results.quran.length + results.materi.length + results.irab.length + results.kamus.length;

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
              Ketik minimal 2 karakter untuk menelusuri 520 ayat, 149 materi, 119 syahid, dan 63 istilah.
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Tidak ditemukan hasil untuk "{query}"
            </div>
          ) : (
            <>
              {/* Quran Results */}
              {results.quran.length > 0 && (
                <div className="space-y-2 pt-2">
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
