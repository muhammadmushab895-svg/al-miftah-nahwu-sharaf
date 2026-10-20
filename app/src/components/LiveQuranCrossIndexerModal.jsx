import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  ChevronRight,
  Filter,
  Eye
} from 'lucide-react';
import exercisesData from '../data/06_latihan_quran.json';

export default function LiveQuranCrossIndexerModal({
  isOpen,
  onClose,
  babId,
  babJudul,
  babJudulArab,
  onJumpToQuran
}) {
  const [searchWord, setSearchWord] = useState('');
  const [selectedAyahIndex, setSelectedAyahIndex] = useState(0);

  // Filter exercises that match this Bab or related grammatical topics
  const matchingAyahs = useMemo(() => {
    if (!babId) return [];

    // Exact bab match
    let matches = exercisesData.filter(ex => ex.fokus_bab_nahwu === babId);

    // If matches are few, search by semantic keywords from the Bab title
    if (matches.length < 5 && babJudul) {
      const keywords = babJudul.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const moreMatches = exercisesData.filter(ex => {
        if (matches.some(m => m.id_latihan === ex.id_latihan)) return false;
        const target = (ex.kategori_binyah + ' ' + ex.fokus_bab_nahwu + ' ' + ex.rincian_irab_tathbiqi).toLowerCase();
        return keywords.some(k => target.includes(k));
      });
      matches = [...matches, ...moreMatches];
    }

    if (searchWord.trim()) {
      const q = searchWord.toLowerCase().trim();
      matches = matches.filter(ex => 
        ex.teks_ayat_arab.includes(q) ||
        ex.terjemahan_indo.toLowerCase().includes(q) ||
        ex.kategori_binyah.toLowerCase().includes(q)
      );
    }

    return matches;
  }, [babId, babJudul, searchWord]);

  if (!isOpen) return null;

  const currentItem = matchingAyahs[selectedAyahIndex] || matchingAyahs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-emerald-800">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-[11px] font-extrabold">
              <Sparkles className="w-3 h-3 fill-current" />
              Live Quran Cross-Indexer (Jembatan Kaidah ↔ Al-Qur'an)
            </div>
            <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
              <span>Ayat-Ayat Syahid untuk: {babJudul}</span>
              <span className="font-arabic text-amber-300 font-normal text-sm sm:text-base hidden sm:inline">({babJudulArab})</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              Ditemukan: <strong className="text-emerald-700">{matchingAyahs.length} Ayat</strong> dengan pola kaidah ini
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari lafazh atau terjemahan..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
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
                return (
                  <button
                    key={item.id_latihan}
                    onClick={() => setSelectedAyahIndex(idx)}
                    className={`w-full p-4 text-left transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-950 font-bold border-l-4 border-emerald-600'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold bg-slate-200/80 px-2 py-0.5 rounded text-slate-700">
                        QS. {item.surah} : {item.ayat} (Juz {item.juz})
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold truncate max-w-[150px]">
                        {item.kategori_binyah}
                      </span>
                    </div>

                    <p className="font-arabic text-right text-base font-bold text-slate-900 line-clamp-1 pt-1">
                      {item.teks_ayat_arab}
                    </p>

                    <p className="text-xs text-slate-500 line-clamp-1">
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
                      QS. {currentItem.surah} [{currentItem.ayat}] • Juz {currentItem.juz}
                    </span>
                    <span className="text-xs text-amber-800 font-bold bg-amber-100 px-2.5 py-0.5 rounded-md">
                      {currentItem.kategori_binyah}
                    </span>
                  </div>

                  <p className="font-arabic text-2xl font-extrabold text-slate-900 text-right leading-loose pt-2">
                    {currentItem.teks_ayat_arab}
                  </p>

                  <p className="text-xs text-slate-600 italic pt-2 border-t border-slate-100">
                    "{currentItem.terjemahan_indo}"
                  </p>
                </div>

                {/* Tathbiq Kaidah Explanation */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
                  <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-700" />
                    Pembahasan Tathbiq Kaidah:
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {currentItem.rincian_irab_tathbiqi || currentItem.pertanyaan_latihan?.pembahasan}
                  </p>
                </div>

                {/* Word by Word Breakdown Preview */}
                {currentItem.kata_per_kata && (
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
                            <th className="p-2.5">Binyah Sharaf</th>
                            <th className="p-2.5">Status I'rab</th>
                            <th className="p-2.5">Tanda I'rab</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentItem.kata_per_kata.map((w, wIdx) => (
                            <tr key={wIdx} className="hover:bg-slate-50">
                              <td className="p-2.5 text-right font-arabic font-bold text-base text-slate-900">{w.kata_arab}</td>
                              <td className="p-2.5 text-slate-600 font-mono text-[11px]">{w.binyah_sharaf}</td>
                              <td className="p-2.5 font-semibold text-emerald-800">{w.status_hukum}</td>
                              <td className="p-2.5 text-slate-600 font-mono text-[11px]">{w.tanda_irab}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Direct Jump to Mushaf Button */}
                {onJumpToQuran && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        onJumpToQuran(currentItem.surah, currentItem.ayat);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-extrabold text-xs shadow-md transition"
                    >
                      <span>Buka di Mushaf I'rab Lengkap</span>
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
