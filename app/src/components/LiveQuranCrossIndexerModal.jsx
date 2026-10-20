import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  X, 
  ExternalLink, 
  Layers, 
  ChevronRight,
  Filter,
  Star,
  BookmarkCheck,
  CheckCircle2
} from 'lucide-react';
import crossIndexData from '../data/07_bab_quran_cross_index.json';

export default function LiveQuranCrossIndexerModal({
  isOpen,
  onClose,
  babId,
  babJudul,
  babJudulArab,
  onJumpToQuran
}) {
  const [searchWord, setSearchWord] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'SYAHID' | 'TATHBIQ'
  const [selectedAyahIndex, setSelectedAyahIndex] = useState(0);

  // Retrieve curated, 100% verified relevant Quranic verses for this Bab
  const babEntry = useMemo(() => {
    if (!babId || !crossIndexData[babId]) return null;
    return crossIndexData[babId];
  }, [babId]);

  const rawAyahs = useMemo(() => {
    return babEntry?.daftar_ayat || [];
  }, [babEntry]);

  // Filter by tab and search keyword
  const matchingAyahs = useMemo(() => {
    let list = rawAyahs;

    if (filterType === 'SYAHID') {
      list = list.filter(item => item.tipe === 'DALIL_SYAHID');
    } else if (filterType === 'TATHBIQ') {
      list = list.filter(item => item.tipe !== 'DALIL_SYAHID');
    }

    if (searchWord.trim()) {
      const q = searchWord.toLowerCase().trim();
      list = list.filter(item => 
        (item.kalimat_arab && item.kalimat_arab.includes(q)) ||
        (item.terjemahan_indo && item.terjemahan_indo.toLowerCase().includes(q)) ||
        (item.sumber_dalil && item.sumber_dalil.toLowerCase().includes(q)) ||
        (item.kata_kunci && item.kata_kunci.includes(q)) ||
        (item.penjelasan_irab_indo && item.penjelasan_irab_indo.toLowerCase().includes(q)) ||
        (item.kategori_binyah && item.kategori_binyah.toLowerCase().includes(q))
      );
    }

    return list;
  }, [rawAyahs, filterType, searchWord]);

  if (!isOpen) return null;

  const currentItem = matchingAyahs[selectedAyahIndex] || matchingAyahs[0];

  const syahidCount = rawAyahs.filter(x => x.tipe === 'DALIL_SYAHID').length;
  const tathbiqCount = rawAyahs.filter(x => x.tipe !== 'DALIL_SYAHID').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-emerald-800">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-[11px] font-extrabold">
              <Sparkles className="w-3 h-3 fill-current" />
              Jelajahi Ayat Terkait Kaidah (Tathbiq Qur'ani Otentik)
            </div>
            <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
              <span>Ayat-Ayat Terkait: {babJudul}</span>
              <span className="font-arabic text-amber-300 font-normal text-sm sm:text-base hidden sm:inline">({babJudulArab})</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs & Search Toolbar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setFilterType('ALL'); setSelectedAyahIndex(0); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-emerald-900 text-amber-300 shadow-xs'
                  : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Semua ({rawAyahs.length})
            </button>
            <button
              onClick={() => { setFilterType('SYAHID'); setSelectedAyahIndex(0); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                filterType === 'SYAHID'
                  ? 'bg-amber-500 text-emerald-950 shadow-xs'
                  : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Syahid Utama ({syahidCount})</span>
            </button>
            <button
              onClick={() => { setFilterType('TATHBIQ'); setSelectedAyahIndex(0); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                filterType === 'TATHBIQ'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <BookmarkCheck className="w-3 h-3" />
              <span>Latihan Tathbiq ({tathbiqCount})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari lafazh, kata kunci, surah..."
              value={searchWord}
              onChange={(e) => { setSearchWord(e.target.value); setSelectedAyahIndex(0); }}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Content Body: Split List & Detail Inspector */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* Left Column: Ayat List */}
          <div className="lg:col-span-5 overflow-y-auto divide-y divide-slate-100 max-h-full">
            {matchingAyahs.length > 0 ? (
              matchingAyahs.map((item, idx) => {
                const isSelected = selectedAyahIndex === idx;
                const isSyahid = item.tipe === 'DALIL_SYAHID';

                return (
                  <button
                    key={item.id_contoh || item.id_latihan || idx}
                    onClick={() => setSelectedAyahIndex(idx)}
                    className={`w-full p-4 text-left transition flex flex-col gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-950 font-bold border-l-4 border-emerald-600'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        isSyahid ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-200/80 text-slate-700'
                      }`}>
                        {item.sumber_dalil}
                      </span>
                      {isSyahid ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-400/90 text-emerald-950 font-extrabold px-1.5 py-0.5 rounded">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          Syahid Utama
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-semibold truncate max-w-[150px]">
                          {item.kategori_binyah || 'Tathbiq Kaidah'}
                        </span>
                      )}
                    </div>

                    <p className="font-arabic text-right text-base font-bold text-slate-900 line-clamp-1 pt-1">
                      {item.kalimat_arab}
                    </p>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {item.kata_kunci ? <span className="font-bold text-emerald-800 mr-1">[{item.kata_kunci}]</span> : null}
                      {item.terjemahan_indo}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Tidak ada ayat yang cocok dengan kata kunci pencarian.
              </div>
            )}
          </div>

          {/* Right Column: Detailed Tathbiq Inspector */}
          <div className="lg:col-span-7 overflow-y-auto p-6 space-y-6 bg-slate-50/50 max-h-full">
            {currentItem ? (
              <div className="space-y-6">
                
                {/* Verse Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold font-mono text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
                      {currentItem.sumber_dalil} {currentItem.juz ? `• Juz ${currentItem.juz}` : ''}
                    </span>
                    {currentItem.tipe === 'DALIL_SYAHID' ? (
                      <span className="text-xs text-amber-900 font-bold bg-amber-200 border border-amber-300 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-700" />
                        Dalil Syahid Utama Kaidah
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-md">
                        {currentItem.kategori_binyah}
                      </span>
                    )}
                  </div>

                  <p className="font-arabic text-2xl font-extrabold text-slate-900 text-right leading-loose pt-2">
                    {currentItem.kalimat_arab}
                  </p>

                  {currentItem.kata_kunci && (
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <span className="text-slate-500 font-medium">Lafadz Syahid / Kata Kunci:</span>
                      <span className="font-arabic font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        {currentItem.kata_kunci}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 italic pt-2 border-t border-slate-100">
                    "{currentItem.terjemahan_indo}"
                  </p>
                </div>

                {/* Tathbiq / Penjelasan Syahid */}
                {(currentItem.penjelasan_irab_indo || currentItem.rincian_irab_tathbiqi) && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
                    <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-700" />
                      {currentItem.tipe === 'DALIL_SYAHID' ? "Keterkaitan Syahid dengan Kaidah:" : "Pembahasan Tathbiq Kaidah:"}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {currentItem.penjelasan_irab_indo || currentItem.rincian_irab_tathbiqi}
                    </p>
                  </div>
                )}

                {/* Full Classical I'rab if Syahid */}
                {currentItem.irab_arab && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
                    <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      Analisis I'rab Klasik Lengkap:
                    </h4>
                    <p className="font-arabic text-sm text-slate-900 text-right leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      {currentItem.irab_arab}
                    </p>
                  </div>
                )}

                {/* Word by Word Breakdown Preview if Available */}
                {currentItem.kata_per_kata && currentItem.kata_per_kata.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs">
                    <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      Bedah Kata-per-Kata ({currentItem.kata_per_kata.length} Kata):
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                        <thead className="bg-slate-100 text-slate-700 font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5 text-right font-arabic">الْكَلِمَةُ</th>
                            <th className="p-2.5">Status I'rab</th>
                            <th className="p-2.5">Tanda I'rab</th>
                            <th className="p-2.5">Kedudukan I'rab</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentItem.kata_per_kata.map((w, wIdx) => (
                            <tr key={wIdx} className="hover:bg-slate-50">
                              <td className="p-2.5 text-right font-arabic font-bold text-base text-slate-900">{w.kata_arab}</td>
                              <td className="p-2.5 font-semibold text-emerald-800">{w.status_hukum}</td>
                              <td className="p-2.5 text-slate-600 font-mono text-[11px]">{w.tanda_irab}</td>
                              <td className="p-2.5 text-slate-700 text-xs font-arabic text-right">{w.kedudukan_irab}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Direct Jump to Mushaf Button */}
                {onJumpToQuran && currentItem.surah && currentItem.ayat && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        onJumpToQuran(currentItem.surah, currentItem.ayat);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-extrabold text-xs shadow-md transition cursor-pointer"
                    >
                      <span>Buka di Mushaf I'rab Lengkap (QS. {currentItem.surah}: {currentItem.ayat})</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
