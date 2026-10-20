import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  AlertTriangle, 
  HelpCircle, 
  Flame, 
  Lightbulb, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Search,
  BookCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import asrarData from '../data/asrar_irab_balaghah.json';

export default function AsrarIrabView({ fontSize = 28, onJumpToQuran }) {
  const [selectedId, setSelectedId] = useState(asrarData[0]?.id || 'ASRAR-01');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'Balaghah & Tauhid', 'Akidah & Teologi', 'Fikih & Qira\'at', 'Kedekatan Munajat', 'Kelembutan Bahasa', 'Psikologi Sosial Al-Qur\'an', 'Dialek Klasik & Syubhat Nahwu', 'Keagungan Al-Qur\'an'];

  const filteredItems = asrarData.filter(item => {
    const matchCat = activeCategory === 'ALL' || item.kategori === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q || (
      item.surah.toLowerCase().includes(q) ||
      item.topik_nahwu.toLowerCase().includes(q) ||
      item.ayat_arab.includes(q) ||
      item.terjemahan.toLowerCase().includes(q) ||
      item.rahasia_makna.toLowerCase().includes(q)
    );
    return matchCat && matchQ;
  });

  const activeItem = asrarData.find(item => item.id === selectedId) || asrarData[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-amber-950 via-emerald-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-800/40 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-extrabold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              Keajaiban Linguistik & Teologi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2 flex items-center gap-2">
              Tafsir I'rab & Rahasia Balaghah Al-Qur'an
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-2xl leading-relaxed">
              Mengapa Allah memilih harakat Fathah bukan Dhommah? Mengapa kata kerja ditaruh di belakang? Temukan bagaimana perbedaan satu harakat mengubah makna tauhid, akidah, dan fikih secara dramatis!
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeCategory === cat
                  ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                  : 'bg-white/10 hover:bg-white/20 text-white/80'
              }`}
            >
              {cat === 'ALL' ? 'Semua Rahasia (' + asrarData.length + ')' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List of Secrets */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari surah atau rahasia makna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 max-h-[700px] overflow-y-auto">
            {filteredItems.map(item => {
              const isSelected = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full p-4 text-left transition-all duration-150 flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-900 to-emerald-950 text-white shadow-md'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-amber-100 text-amber-900'
                    }`}>
                      QS. {item.surah} : {item.ayat}
                    </span>
                    <span className={`text-[10px] font-semibold ${isSelected ? 'text-amber-200' : 'text-slate-400'}`}>
                      {item.kategori}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm line-clamp-1 leading-snug">
                    {item.topik_nahwu}
                  </h4>

                  <p className={`font-arabic text-sm text-right line-clamp-1 ${
                    isSelected ? 'text-amber-300' : 'text-emerald-900 font-bold'
                  }`}>
                    {item.ayat_arab}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Inspection Card */}
        <div className="lg:col-span-8 space-y-6">
          {activeItem && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-xl text-xs">
                    QS. {activeItem.surah} [{activeItem.surah_no}] : Ayat {activeItem.ayat}
                  </span>
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-xl text-xs">
                    {activeItem.kategori}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {activeItem.referensi_kitab}
                </span>
              </div>

              {/* Quran Verse Display */}
              <div className="bg-gradient-to-r from-slate-50 via-amber-50/30 to-slate-50 border-2 border-amber-200/80 rounded-3xl p-6 sm:p-8 text-right space-y-3 shadow-xs">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block text-left">
                  نَصُّ الآيَةِ الكَرِيمَةِ (POTONGAN AYAT):
                </span>
                <p 
                  className="font-arabic font-extrabold text-emerald-950 leading-loose"
                  style={{ fontSize: `${fontSize + 4}px` }}
                >
                  {activeItem.ayat_arab}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 italic text-left pt-2 border-t border-amber-200/60">
                  "{activeItem.terjemahan}"
                </p>
              </div>

              {/* Point 1: I'rab Syntactic Analysis */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <span>Analisis Sintaksis I'rab & Kedudukan Kata:</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeItem.analisis_irab}
                </p>
              </div>

              {/* Point 2: The Core Secret / Rahasia Makna Balaghah */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-2xl p-6 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 border-b border-amber-200 pb-2">
                  <Sparkles className="w-5 h-5 text-amber-600 fill-amber-500" />
                  <h4 className="font-extrabold text-base text-amber-950">
                    Rahasia Balaghah & Kedalaman Makna Teologis:
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {activeItem.rahasia_makna}
                </p>
              </div>

              {/* Point 3: The Danger of Misreading / Dampak Kesalahan Harakat */}
              <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 flex items-start gap-3 shadow-xs">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-rose-950 uppercase tracking-wider block">
                    ⚠️ Bahaya Jika Harakat Tertukar / Salah Paham Kaidah:
                  </span>
                  <p className="text-xs sm:text-sm text-rose-900 leading-relaxed">
                    {activeItem.dampak_kesalahan}
                  </p>
                </div>
              </div>

              {/* Reference & Jump to Quran */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1.5">
                  <BookCheck className="w-4 h-4 text-emerald-700" />
                  Rujukan Ilmiah: <strong className="text-slate-600">{activeItem.referensi_kitab}</strong>
                </span>

                {onJumpToQuran && (
                  <button
                    onClick={() => onJumpToQuran(activeItem.surah, activeItem.ayat)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs shadow-xs transition"
                  >
                    <span>Buka Ayat di Mushaf I'rab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
