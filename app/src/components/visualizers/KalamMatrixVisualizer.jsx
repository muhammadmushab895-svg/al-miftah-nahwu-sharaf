import React, { useState } from 'react';
import { 
  Check, 
  X, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Info
} from 'lucide-react';

export default function KalamMatrixVisualizer() {
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' vs 'venn'
  const [selectedCase, setSelectedCase] = useState(0);

  const testCases = [
    {
      id: 0,
      arab: 'العِلْمُ نُورٌ',
      indo: 'Ilmu itu cahaya',
      wordCount: 2,
      isMufid: true,
      statusKalam: true,
      statusKalim: false,
      statusKalimah: false,
      statusQaul: true,
      verdict: 'Hanya KALAM (Bukan Kalim karena < 3 kata)',
      reason: 'Tersusun dari 2 kata (Mubtada\' + Khabar) dan maknanya sempurna tuntas. Belum disebut Kalim karena syarat Kalim minimal 3 kata.'
    },
    {
      id: 1,
      arab: 'إِنْ حَضَرَ الأُسْتَاذُ...',
      indo: 'Jika ustadz telah hadir...',
      wordCount: 3,
      isMufid: false,
      statusKalam: false,
      statusKalim: true,
      statusKalimah: false,
      statusQaul: true,
      verdict: 'Hanya KALIM (Bukan Kalam karena Belum Tuntas)',
      reason: 'Tersusun dari 3 kata (In + Hadhara + Al-Ustadz), sehingga sah disebut Kalim. Namun bukan Kalam karena maknanya menggantung (belum ada jawab syarat).'
    },
    {
      id: 2,
      arab: 'قَدْ قَامَتِ الصَّلَاةُ',
      indo: 'Sungguh shalat telah ditegakkan',
      wordCount: 3,
      isMufid: true,
      statusKalam: true,
      statusKalim: true,
      statusKalimah: false,
      statusQaul: true,
      verdict: 'KALAM sekaligus KALIM!',
      reason: 'Memenuhi kedua syarat: Tersusun dari >= 3 kata (Qad + Qamat + Ash-Shalah) dan memberikan faedah makna yang sempurna tuntas.'
    },
    {
      id: 3,
      arab: 'مُحَمَّدٌ',
      indo: 'Muhammad',
      wordCount: 1,
      isMufid: false,
      statusKalam: false,
      statusKalim: false,
      statusKalimah: true,
      statusQaul: true,
      verdict: 'Hanya KALIMAH (Kata Tunggal)',
      reason: 'Hanya terdiri dari satu kata mufrad bermakna. Bukan Kalam (karena belum tersusun) dan bukan Kalim (karena belum 3 kata).'
    }
  ];

  const current = testCases[selectedCase];

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-200/90 shadow-md p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Matriks Perbandingan Visual Kaidah Kitab
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Beda Kalam, Kalim, Kalimah & Qaul dalam Sekali Lirik
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Salah satu materi paling membingungkan bagi pemula! Gunakan simulasi di bawah untuk menguji perbedaannya.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'matrix' ? 'bg-amber-400 text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tabel Matriks
          </button>
          <button
            onClick={() => setActiveTab('venn')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'venn' ? 'bg-amber-400 text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Piramida Hirarki
          </button>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        <div className="space-y-6">
          {/* Case Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {testCases.map((tc, idx) => (
              <button
                key={tc.id}
                onClick={() => setSelectedCase(idx)}
                className={`p-3 rounded-xl border text-center transition ${
                  selectedCase === idx
                    ? 'bg-emerald-900 text-white font-bold ring-2 ring-amber-400 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="font-arabic text-base block font-bold">{tc.arab}</span>
                <span className="text-[11px] font-sans font-medium opacity-90 line-clamp-1">{tc.indo}</span>
              </button>
            ))}
          </div>

          {/* Detailed Diagnosis Card */}
          <div className="bg-gradient-to-r from-amber-50/60 to-emerald-50/60 rounded-2xl border border-amber-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/70 pb-3">
              <div>
                <span className="text-xs text-slate-500 font-mono">Uji Kasus:</span>
                <div className="flex items-baseline gap-3">
                  <span className="font-arabic text-2xl sm:text-3xl font-extrabold text-emerald-950">
                    {current.arab}
                  </span>
                  <span className="text-xs text-slate-600 italic">
                    "{current.indo}"
                  </span>
                </div>
              </div>
              
              <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-xs text-xs font-bold text-amber-900 self-start sm:self-auto">
                {current.verdict}
              </div>
            </div>

            {/* Checklist Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              {/* Kalam */}
              <div className={`p-3 rounded-xl border ${current.statusKalam ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950 font-bold' : 'bg-slate-100/80 border-slate-200 text-slate-400'}`}>
                <span className="block mb-1">1. Kalam (كَلَام)</span>
                <span className="text-lg">{current.statusKalam ? '✅ SAH' : '❌ TIDAK'}</span>
                <span className="block text-[10px] mt-1 font-normal">Minimal 2 kata + Mufid</span>
              </div>

              {/* Kalim */}
              <div className={`p-3 rounded-xl border ${current.statusKalim ? 'bg-sky-100/90 border-sky-300 text-sky-950 font-bold' : 'bg-slate-100/80 border-slate-200 text-slate-400'}`}>
                <span className="block mb-1">2. Kalim (كَلِم)</span>
                <span className="text-lg">{current.statusKalim ? '✅ SAH' : '❌ TIDAK'}</span>
                <span className="block text-[10px] mt-1 font-normal">Wajib minimal 3 kata</span>
              </div>

              {/* Kalimah */}
              <div className={`p-3 rounded-xl border ${current.statusKalimah ? 'bg-purple-100/90 border-purple-300 text-purple-950 font-bold' : 'bg-slate-100/80 border-slate-200 text-slate-400'}`}>
                <span className="block mb-1">3. Kalimah (كَلِمَة)</span>
                <span className="text-lg">{current.statusKalimah ? '✅ SAH' : '❌ TIDAK'}</span>
                <span className="block text-[10px] mt-1 font-normal">Tepat 1 kata tunggal</span>
              </div>

              {/* Qaul */}
              <div className={`p-3 rounded-xl border ${current.statusQaul ? 'bg-amber-100/90 border-amber-300 text-amber-950 font-bold' : 'bg-slate-100/80 border-slate-200 text-slate-400'}`}>
                <span className="block mb-1">4. Qaul (قَوْل)</span>
                <span className="text-lg">{current.statusQaul ? '✅ SAH' : '❌ TIDAK'}</span>
                <span className="block text-[10px] mt-1 font-normal">Payung umum lafaz bermakna</span>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="bg-white p-4 rounded-xl border border-amber-200/80 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Analisis Kaidah:</strong>
                {current.reason}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Hierarchical Pyramid / Venn View */
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center space-y-4">
          <h4 className="text-sm font-bold text-slate-800">
            Piramida Hirarki: Dari yang Paling Luas hingga Spesifik
          </h4>
          
          <div className="max-w-md mx-auto space-y-2 text-xs">
            {/* Level 1: Qaul */}
            <div className="bg-amber-500 text-white p-3 rounded-2xl font-bold shadow-sm">
              <span className="text-sm block">1. AL-QAUL (الْقَوْلُ) - Payung Terluas</span>
              <span className="text-[11px] font-normal opacity-90">Mencakup semua bunyi lafaz yang punya arti (Kalam, Kalim, maupun Kalimah).</span>
            </div>

            {/* Level 2: Kalam & Kalim */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-emerald-700 text-white p-3 rounded-xl font-bold shadow-sm">
                <span className="block">2A. AL-KALAM</span>
                <span className="text-[10px] font-normal opacity-90">Fokus ke "MAKNA TUNTAS" (minimal 2 kata).</span>
              </div>
              <div className="bg-sky-700 text-white p-3 rounded-xl font-bold shadow-sm">
                <span className="block">2B. AL-KALIM</span>
                <span className="text-[10px] font-normal opacity-90">Fokus ke "JUMLAH KATA" (minimal 3 kata).</span>
              </div>
            </div>

            {/* Level 3: Kalimah */}
            <div className="bg-purple-700 text-white p-3 rounded-2xl font-bold shadow-sm">
              <span className="text-sm block">3. AL-KALIMAH (الْكَلِمَةُ) - Unit Terkecil</span>
              <span className="text-[11px] font-normal opacity-90">Satu kata tunggal (Isim, Fi'il, atau Huruf).</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
