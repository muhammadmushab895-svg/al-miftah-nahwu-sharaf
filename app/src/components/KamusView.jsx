import React, { useState, useMemo } from 'react';
import { 
  BookMarked, 
  Search, 
  Bookmark, 
  Copy, 
  Check, 
  BookOpen,
  Tag
} from 'lucide-react';
import istilahData from '../data/05_kamus_istilah.json';
import { isBookmarked, saveBookmark } from '../utils/storage';

export default function KamusView({ fontSize = 28 }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  // Distinct bidang
  const bidangList = useMemo(() => {
    const set = new Set();
    istilahData.forEach(item => { if (item.bidang) set.add(item.bidang); });
    return Array.from(set);
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return istilahData.filter(item => {
      const matchBidang = selectedBidang === 'ALL' || item.bidang === selectedBidang;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        item.istilah_arab.toLowerCase().includes(q) ||
        item.definisi_indo.toLowerCase().includes(q) ||
        item.definisi_arab.includes(q) ||
        item.contoh.toLowerCase().includes(q)
      );
      return matchBidang && matchSearch;
    });
  }, [selectedBidang, searchQuery]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleBookmark = (item) => {
    saveBookmark({
      id: item.id_istilah,
      type: 'kamus',
      title: item.istilah_arab,
      subtitle: item.bidang,
      arab: item.definisi_arab,
      indo: item.definisi_indo
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-3 border border-emerald-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
          <BookMarked className="w-3.5 h-3.5" />
          Kamus & Mu'jam Istilah Nahwu-Sharaf (63 Istilah)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Mu'jam Musthalahat Al-Qawa'id
        </h1>
        <p className="text-emerald-100/90 text-sm max-w-2xl leading-relaxed">
          Glosarium istilah-istilah gramatika dan morfologi Arab disertai ta'rif Arab standar para ulama nahwu, terjemahan, dan contoh penerapannya.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Cari istilah Arab, latin, definisi, atau contoh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div>
          <select
            value={selectedBidang}
            onChange={(e) => setSelectedBidang(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-700"
          >
            <option value="ALL">Semua Bidang ({bidangList.length})</option>
            {bidangList.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      <div className="text-xs text-slate-500 px-1">
        Menampilkan <strong>{filteredData.length}</strong> istilah
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredData.map((item) => {
          const bookmarked = isBookmarked(item.id_istilah, 'kamus');

          return (
            <div
              key={item.id_istilah}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-amber-300">
                    {item.id_istilah}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                      {item.bidang}
                    </span>
                    <button
                      onClick={() => handleToggleBookmark(item)}
                      className={`p-1.5 rounded-lg border transition ${
                        bookmarked 
                          ? 'bg-amber-400 text-emerald-950 border-amber-500' 
                          : 'bg-white text-slate-400 hover:text-amber-600 border-slate-200'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => handleCopy(item.id_istilah, `${item.istilah_arab}\n\n${item.definisi_arab}\n\n${item.definisi_indo}`)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700"
                    >
                      {copiedId === item.id_istilah ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Istilah Name */}
                <h3 className="font-arabic text-xl font-bold text-emerald-950 text-right leading-relaxed">
                  {item.istilah_arab}
                </h3>

                {/* Ta'rif Arab */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-amber-200/60 text-right">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block text-left mb-1">
                    التَّعْرِيفُ اللُّغَوِيُّ وَالِاصْطِلَاحِيُّ:
                  </span>
                  <p className="font-arabic text-base font-semibold text-slate-800 leading-relaxed">
                    {item.definisi_arab}
                  </p>
                </div>

                {/* Penjelasan Indonesia */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.definisi_indo}
                </p>
              </div>

              {/* Contoh Aplikasi */}
              {item.contoh && (
                <div className="pt-3 border-t border-slate-100 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                  <span className="font-bold text-emerald-900 block mb-0.5">Contoh Penerapan:</span>
                  <p className="text-slate-700">{item.contoh}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
