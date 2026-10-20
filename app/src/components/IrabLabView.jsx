import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  BookOpen, 
  Bookmark, 
  Copy, 
  Check, 
  Tag, 
  Filter,
  Sparkles
} from 'lucide-react';
import irabData from '../data/03_contoh_dan_irab.json';
import { isBookmarked, saveBookmark } from '../utils/storage';

export default function IrabLabView({ fontSize = 28 }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDalil, setSelectedDalil] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  // Distinct jenis dalil
  const dalilTypes = useMemo(() => {
    const set = new Set();
    irabData.forEach(d => { if (d.jenis_dalil) set.add(d.jenis_dalil); });
    return Array.from(set);
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return irabData.filter(item => {
      const matchDalil = selectedDalil === 'ALL' || item.jenis_dalil === selectedDalil;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        item.kalimat_arab.includes(q) ||
        item.terjemahan_indo.toLowerCase().includes(q) ||
        item.kata_kunci?.toLowerCase().includes(q) ||
        item.irab_arab.includes(q) ||
        item.penjelasan_irab_indo.toLowerCase().includes(q) ||
        item.sumber_dalil.toLowerCase().includes(q)
      );
      return matchDalil && matchSearch;
    });
  }, [selectedDalil, searchQuery]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleBookmark = (item) => {
    saveBookmark({
      id: item.id_contoh,
      type: 'irab',
      title: item.kata_kunci || item.jenis_dalil,
      subtitle: item.sumber_dalil,
      arab: item.kalimat_arab,
      indo: item.terjemahan_indo
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-3 border border-emerald-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
          <Layers className="w-3.5 h-3.5" />
          Laboratorium 119 Syahid Kaidah & I'rab Analitis
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Laboratorium I'rab & Bedah Syahid Gramatika
        </h1>
        <p className="text-emerald-100/90 text-sm max-w-2xl leading-relaxed">
          Kumpulan dalil otentik Al-Qur'an, Hadits Nabi, dan bait syair Arab klasik dengan rincian i'rab per kata serta penjelasan kedudukan hukum nahwu secara tuntas.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Cari kalimat syahid, kata kunci, terjemahan, atau i'rab..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div>
          <select
            value={selectedDalil}
            onChange={(e) => setSelectedDalil(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-700"
          >
            <option value="ALL">Semua Jenis Syahid ({dalilTypes.length})</option>
            {dalilTypes.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-slate-500 px-1">
        Menampilkan <strong>{filteredData.length}</strong> syahid & contoh i'rab
      </div>

      {/* Syahid Cards List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredData.map((item) => {
          const bookmarked = isBookmarked(item.id_contoh, 'irab');

          return (
            <div
              key={item.id_contoh}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden space-y-4 p-6"
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-900 text-amber-300">
                    {item.id_contoh}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                    {item.jenis_dalil}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {item.sumber_dalil}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Mahal Syahid: {item.kata_kunci}
                  </span>

                  <button
                    onClick={() => handleToggleBookmark(item)}
                    className={`p-1.5 rounded-lg border transition ${
                      bookmarked 
                        ? 'bg-amber-400 text-emerald-950 border-amber-500' 
                        : 'bg-white text-slate-400 hover:text-amber-600 border-slate-200'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    onClick={() => handleCopy(item.id_contoh, `${item.kalimat_arab}\n\nI'rab:\n${item.irab_arab}`)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700"
                  >
                    {copiedId === item.id_contoh ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Kalimat Arab */}
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-amber-200/60 text-right">
                <p 
                  className="font-arabic font-bold text-slate-900 leading-relaxed"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {item.kalimat_arab}
                </p>
                <p className="text-xs text-slate-600 italic text-left mt-2">
                  "{item.terjemahan_indo}"
                </p>
              </div>

              {/* I'rab Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Arab I'rab */}
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/70 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    Tathbiq I'rab (Bahasa Arab):
                  </h4>
                  <p className="font-arabic text-base sm:text-lg text-emerald-950 text-right leading-loose font-medium">
                    {item.irab_arab}
                  </p>
                </div>

                {/* Indonesian Explanation */}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
