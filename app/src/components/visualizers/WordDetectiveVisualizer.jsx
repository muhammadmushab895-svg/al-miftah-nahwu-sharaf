import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Zap, 
  ArrowRight, 
  Layers, 
  Check, 
  RefreshCw,
  Lightbulb,
  Tag
} from 'lucide-react';

export default function WordDetectiveVisualizer() {
  const sampleWords = [
    { word: 'كِتَابٌ', meaning: 'Sebuah buku', type: 'isim', sign: 'Tanwin (ـٌ) di akhir kata', rule: 'Tanwin adalah tanda khusus Isim yang tidak mungkin ada pada kata kerja atau huruf.' },
    { word: 'المَسْجِدُ', meaning: 'Masjid itu', type: 'isim', sign: 'Awalan Alif-Lam (الـ)', rule: 'Awalan Al- ma\'rifah hanya bisa menempel pada kata benda (Isim).' },
    { word: 'يَكْتُبُ', meaning: 'Sedang menulis', type: 'fiil', sign: 'Diawali huruf mudhara\'ah Ya\' (يَـ) dan makna pekerjaan', rule: 'Fi\'il mudhari\' diawali salah satu huruf Anita (أ، ن، ي، ت).' },
    { word: 'سَيَقُولُ', meaning: 'Akan berkata', type: 'fiil', sign: 'Kemasukan huruf Sin (سَـ) masa depan', rule: 'Huruf Sin (سَـ) dan Saufa (سَوْفَ) adalah tanda paten Fi\'il Mudhari\'.' },
    { word: 'قُمْ', meaning: 'Berdirilah!', type: 'fiil', sign: 'Makna perintah + menerima Ya\' Mukhatabah (قُومِي)', rule: 'Fi\'il Amr memiliki makna thalab (tuntutan) dan menerima ya\' muannats.' },
    { word: 'فِي', meaning: 'Di dalam', type: 'huruf', sign: 'Tidak menerima tanwin, Al-, maupun tanda kata kerja', rule: 'Huruf cirinya adalah tidak menerima tanda isim dan tidak menerima tanda fi\'il (tanda \'adamiyyah).' },
    { word: 'قَدْ', meaning: 'Sungguh / Kadang', type: 'huruf', sign: 'Huruf penegas/kemungkinan yang masuk ke fi\'il', rule: 'Qad adalah huruf khusus yang menjadi tanda bahwa kata sesudahnya adalah Fi\'il.' }
  ];

  const [selectedWordIdx, setSelectedWordIdx] = useState(0);
  const [customWord, setCustomWord] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const activeSample = sampleWords[selectedWordIdx];

  const handleSelectSample = (idx) => {
    setSelectedWordIdx(idx);
    setCustomWord('');
  };

  const getBadgeColor = (type) => {
    if (type === 'isim') return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (type === 'fiil') return 'bg-sky-100 text-sky-900 border-sky-300';
    return 'bg-amber-100 text-amber-900 border-amber-300';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40 space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/50 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-bold shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Simulator Interaktif untuk Orang Awam
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
            🕵️‍♂️ Detektif Kata: Isim, Fi'il, atau Huruf?
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Bingung membedakan kata benda, kata kerja, dan kata sambung? Klik salah satu kata di bawah untuk melihat bagaimana "radar ciri" bekerja mendeteksi jenis kata dalam 3 detik!
          </p>
        </div>
      </div>

      {/* Preset Words Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
          Pilih Contoh Kata Arab:
        </label>
        <div className="flex flex-wrap gap-2">
          {sampleWords.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(idx)}
              className={`px-3.5 py-2 rounded-xl text-sm font-arabic font-bold transition-all duration-150 flex items-center gap-2 border ${
                selectedWordIdx === idx
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-lg scale-105 ring-2 ring-amber-300/50'
                  : 'bg-emerald-900/40 hover:bg-emerald-800/60 text-white border-emerald-700/50'
              }`}
            >
              <span className="text-lg">{item.word}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-sans font-extrabold ${
                item.type === 'isim' ? 'bg-emerald-800 text-emerald-200' :
                item.type === 'fiil' ? 'bg-sky-800 text-sky-200' : 'bg-amber-800 text-amber-200'
              }`}>
                {item.type}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Detective Scan Radar Display */}
      <div className="bg-emerald-950/70 rounded-2xl border border-emerald-700/50 p-6 space-y-6">
        
        {/* Active Inspected Word Box */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-900/50 p-4 rounded-xl border border-emerald-600/40">
          <div className="text-center sm:text-left">
            <span className="text-xs text-emerald-300 font-mono block">Kata yang sedang diperiksa:</span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="font-arabic text-4xl sm:text-5xl font-extrabold text-amber-300">
                {activeSample.word}
              </span>
              <span className="text-sm text-emerald-200 font-medium">
                ({activeSample.meaning})
              </span>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className="text-xs text-emerald-300 block mb-1">Hasil Identifikasi:</span>
            <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-extrabold uppercase tracking-wide border shadow-md ${getBadgeColor(activeSample.type)}`}>
              <CheckCircle2 className="w-4 h-4" />
              100% {activeSample.type === 'isim' ? 'Isim (Kata Benda)' : activeSample.type === 'fiil' ? 'Fi\'il (Kata Kerja)' : 'Huruf (Kata Tugas)'}
            </span>
          </div>
        </div>

        {/* 3 Steps Radar Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Step 1: Isim Signs Test */}
          <div className={`p-4 rounded-xl border transition ${
            activeSample.type === 'isim'
              ? 'bg-emerald-900/60 border-emerald-400 ring-2 ring-emerald-500/30'
              : 'bg-emerald-950/40 border-emerald-800/40 opacity-70'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-300">1. Uji Ciri Isim</span>
              {activeSample.type === 'isim' ? (
                <span className="bg-emerald-500 text-emerald-950 p-1 rounded-full"><Check className="w-3.5 h-3.5 font-bold" /></span>
              ) : (
                <span className="text-slate-500"><XCircle className="w-3.5 h-3.5" /></span>
              )}
            </div>
            <p className="text-emerald-100/90 leading-relaxed">
              Cek: Tanwin (ـٌ), Al- (الـ), Huruf Jar (فِي، مِنْ), atau Panggilan (يَا).
            </p>
            {activeSample.type === 'isim' && (
              <div className="mt-3 bg-emerald-800/50 p-2 rounded-lg text-amber-300 font-semibold border border-emerald-600/50">
                ✓ Ditemukan: {activeSample.sign}
              </div>
            )}
          </div>

          {/* Step 2: Fi'il Signs Test */}
          <div className={`p-4 rounded-xl border transition ${
            activeSample.type === 'fiil'
              ? 'bg-sky-950/60 border-sky-400 ring-2 ring-sky-500/30'
              : 'bg-emerald-950/40 border-emerald-800/40 opacity-70'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sky-300">2. Uji Ciri Fi'il</span>
              {activeSample.type === 'fiil' ? (
                <span className="bg-sky-400 text-sky-950 p-1 rounded-full"><Check className="w-3.5 h-3.5 font-bold" /></span>
              ) : (
                <span className="text-slate-500"><XCircle className="w-3.5 h-3.5" /></span>
              )}
            </div>
            <p className="text-sky-100/90 leading-relaxed">
              Cek: Huruf Qad (قَدْ), Sin (سَـ), Saufa (سَوْفَ), Ta' Ta'nits (تْ), atau Awalan Anita.
            </p>
            {activeSample.type === 'fiil' && (
              <div className="mt-3 bg-sky-900/50 p-2 rounded-lg text-amber-300 font-semibold border border-sky-600/50">
                ✓ Ditemukan: {activeSample.sign}
              </div>
            )}
          </div>

          {/* Step 3: Huruf Signs Test */}
          <div className={`p-4 rounded-xl border transition ${
            activeSample.type === 'huruf'
              ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-500/30'
              : 'bg-emerald-950/40 border-emerald-800/40 opacity-70'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-300">3. Uji Ciri Huruf</span>
              {activeSample.type === 'huruf' ? (
                <span className="bg-amber-400 text-amber-950 p-1 rounded-full"><Check className="w-3.5 h-3.5 font-bold" /></span>
              ) : (
                <span className="text-slate-500"><XCircle className="w-3.5 h-3.5" /></span>
              )}
            </div>
            <p className="text-amber-100/90 leading-relaxed">
              Cek Negatif: Menolak SEMUA ciri isim dan fi'il, serta hanya punya makna jelas saat digabung.
            </p>
            {activeSample.type === 'huruf' && (
              <div className="mt-3 bg-amber-900/50 p-2 rounded-lg text-amber-200 font-semibold border border-amber-600/50">
                ✓ Terbukti: {activeSample.sign}
              </div>
            )}
          </div>
        </div>

        {/* Kaidah Explanation Card */}
        <div className="bg-emerald-900/40 border border-emerald-700/60 rounded-xl p-4 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Kaidah Emas Ibnu Malik (Alfiyyah):
            </span>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {activeSample.rule}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
