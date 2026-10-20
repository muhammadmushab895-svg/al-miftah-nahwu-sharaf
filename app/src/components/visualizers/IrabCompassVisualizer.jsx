import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export default function IrabCompassVisualizer() {
  const [activeCase, setActiveCase] = useState('rafa'); // 'rafa', 'nashab', 'jar', 'jazm'
  const [activeWordSample, setActiveWordSample] = useState(0); // 0: Zaid, 1: Al-Muslim, 2: Al-Kitab

  const wordTransitions = [
    {
      wordName: 'Zaid (Kata Benda Mufrad / Tunggal)',
      rafa: { arab: 'جَاءَ زَيْدٌ', word: 'زَيْدٌ', role: 'Fa\'il (Pelaku)', harakat: 'Dhommah (ـٌ)', type: 'Tanda Asli' },
      nashab: { arab: 'رَأَيْتُ زَيْدًا', word: 'زَيْدًا', role: 'Maf\'ul Bih (Objek)', harakat: 'Fathah (ـً)', type: 'Tanda Asli' },
      jar: { arab: 'سَلَّمْتُ عَلَى زَيْدٍ', word: 'زَيْدٍ', role: 'Majrur bi \'Ala', harakat: 'Kasrah (ـٍ)', type: 'Tanda Asli' },
      jazm: { arab: '❌ Tidak Ada', word: '—', role: 'Isim TIDAK BISA Majzum!', harakat: '—', type: 'Hukum Khusus' }
    },
    {
      wordName: 'Al-Muslimun (Jamak Mudzakkar Salim)',
      rafa: { arab: 'أَفْلَحَ الْمُؤْمِنُونَ', word: 'الْمُؤْمِنُونَ', role: 'Fa\'il (Pelaku)', harakat: 'Huruf Wawu (و)', type: 'Tanda Pengganti (Far\'i)' },
      nashab: { arab: 'إِنَّ الْمُؤْمِنِينَ إِخْوَةٌ', word: 'الْمُؤْمِنِينَ', role: 'Isim Inna (Manshub)', harakat: 'Huruf Ya\' (ي)', type: 'Tanda Pengganti (Far\'i)' },
      jar: { arab: 'مَرَرْتُ بِالْمُؤْمِنِينَ', word: 'الْمُؤْمِنِينَ', role: 'Majrur bi Ba\'', harakat: 'Huruf Ya\' (ي)', type: 'Tanda Pengganti (Far\'i)' },
      jazm: { arab: '❌ Tidak Ada', word: '—', role: 'Isim TIDAK BISA Majzum!', harakat: '—', type: 'Hukum Khusus' }
    },
    {
      wordName: 'Yaktubu (Kata Kerja Fi\'il Mudhari\')',
      rafa: { arab: 'يَكْتُبُ مُحَمَّدٌ', word: 'يَكْتُبُ', role: 'Bebas dari amil nashab/jazm', harakat: 'Dhommah (ـُ)', type: 'Tanda Asli' },
      nashab: { arab: 'لَنْ يَكْتُبَ', word: 'يَكْتُبَ', role: 'Kemasukan huruf Lan', harakat: 'Fathah (ـَ)', type: 'Tanda Asli' },
      jar: { arab: '❌ Tidak Ada', word: '—', role: 'Fi\'il TIDAK BISA Jar!', harakat: '—', type: 'Hukum Khusus' },
      jazm: { arab: 'لَمْ يَكْتُبْ', word: 'يَكْتُبْ', role: 'Kemasukan huruf Lam', harakat: 'Sukun (ـْ)', type: 'Tanda Asli' }
    }
  ];

  const currentTransition = wordTransitions[activeWordSample];

  const caseDetails = {
    rafa: {
      title: '1. Ar-Raf\'u (الرَّفْعُ) - Posisi Raja / Subjek',
      color: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      heroBg: 'from-emerald-900 to-teal-950 text-white',
      badge: 'Status Mulia',
      defaultHarakat: 'Dhommah (ـُ)',
      analog: 'Paling sering dipakai untuk PELAKU (Fa\'il) atau TOPIK UTAMA (Mubtada\').',
      appliesTo: 'Bisa masuk ke Isim dan Fi\'il Mudhari\'.'
    },
    nashab: {
      title: '2. An-Nashbu (النَّصْبُ) - Posisi Objek / Keterangan',
      color: 'bg-sky-100 text-sky-950 border-sky-300',
      heroBg: 'from-sky-900 to-indigo-950 text-white',
      badge: 'Status Objek Aktif',
      defaultHarakat: 'Fathah (ـَ)',
      analog: 'Paling sering dipakai untuk OBJEK PENDERITA (Maf\'ul Bih), KONDISI (Hal), dan WAKTU/TEMPAT (Zharf).',
      appliesTo: 'Bisa masuk ke Isim dan Fi\'il Mudhari\'.'
    },
    jar: {
      title: '3. Al-Jarru / Al-Khafdh (الْجَرُّ) - Posisi Terseret Huruf',
      color: 'bg-purple-100 text-purple-950 border-purple-300',
      heroBg: 'from-purple-900 to-violet-950 text-white',
      badge: 'Khusus Kata Benda',
      defaultHarakat: 'Kasrah (ـِ)',
      analog: 'Muncul saat kata benda didahului kata depan (Di, Ke, Dari) atau dalam hubungan kepemilikan (Buku Ahmad).',
      appliesTo: 'KHUSUS ISIM SAJA! Fi\'il haram terkena Jar.'
    },
    jazm: {
      title: '4. Al-Jazmu (الْجَزْمُ) - Posisi Gembok / Larangan',
      color: 'bg-rose-100 text-rose-950 border-rose-300',
      heroBg: 'from-rose-900 to-red-950 text-white',
      badge: 'Khusus Kata Kerja',
      defaultHarakat: 'Sukun (ـْ)',
      analog: 'Muncul saat kata kerja disetop atau dilarang oleh huruf seperti Lam (Tidak) atau Laa Nahiyah (Jangan).',
      appliesTo: 'KHUSUS FI\'IL MUDHARI\' SAJA! Isim haram terkena Jazm.'
    }
  };

  const currCaseInfo = caseDetails[activeCase];

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-200/90 shadow-md p-5 sm:p-7 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            Kompas 4 Arah I'rab untuk Pemula
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Peta Perubahan Harakat Akhir: Rafa', Nashab, Jar & Jazm
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Kenapa ujung kata kadang berbunyi "-un", "-an", "-in", atau sukun? Inilah 4 kuadran hukumnya!
          </p>
        </div>
      </div>

      {/* 4 Quadrants Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(caseDetails).map(([key, item]) => {
          const isActive = activeCase === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCase(key)}
              className={`p-3.5 rounded-xl border text-left transition ${
                isActive
                  ? 'bg-emerald-900 text-white ring-2 ring-amber-400 shadow-md font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                  isActive ? 'bg-amber-400 text-emerald-950' : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.badge}
                </span>
                <span className={`text-xs font-mono font-bold ${isActive ? 'text-amber-300' : 'text-slate-500'}`}>
                  {item.defaultHarakat}
                </span>
              </div>
              <h4 className="font-bold text-sm mt-2">{item.title.split('-')[0]}</h4>
              <p className={`text-[11px] mt-1 line-clamp-1 ${isActive ? 'text-emerald-200' : 'text-slate-500'}`}>
                {item.analog}
              </p>
            </button>
          );
        })}
      </div>

      {/* Hero Case Highlight Box */}
      <div className={`rounded-2xl p-5 bg-gradient-to-r ${currCaseInfo.heroBg} shadow-sm space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/20 pb-2">
          <h4 className="font-bold text-base sm:text-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            {currCaseInfo.title}
          </h4>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">
            Tanda Asli: {currCaseInfo.defaultHarakat}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed">
          <strong>Fungsi Sehari-hari:</strong> {currCaseInfo.analog}
        </p>
        <div className="text-xs bg-black/20 p-2.5 rounded-xl text-amber-200 border border-white/10">
          💡 <strong>Ketentuan Penting:</strong> {currCaseInfo.appliesTo}
        </div>
      </div>

      {/* Chameleon Transition Simulator */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div>
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              Simulasi "Bunglon Harakat": Lihat Satu Kata Berganti Seragam
            </h4>
            <span className="text-xs text-slate-500">Pilih contoh kata di bawah untuk melihat bagaimana harakat buntutnya berubah:</span>
          </div>

          <div className="flex items-center gap-1">
            {wordTransitions.map((wt, idx) => (
              <button
                key={idx}
                onClick={() => setActiveWordSample(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeWordSample === idx
                    ? 'bg-amber-400 text-emerald-950 shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {wt.wordName.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cards Transformation Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Rafa */}
          <div className={`p-4 rounded-xl border ${activeCase === 'rafa' ? 'ring-2 ring-emerald-500 bg-emerald-50/80 border-emerald-300' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">1. Rafa' (Subjek)</span>
            <p className="font-arabic text-xl font-bold text-slate-900 my-1">{currentTransition.rafa.arab}</p>
            <p className="text-slate-600 font-semibold">{currentTransition.rafa.role}</p>
            <div className="mt-2 text-[11px] text-emerald-900 font-mono bg-emerald-100/60 p-1 rounded">
              Tanda: {currentTransition.rafa.harakat}
            </div>
          </div>

          {/* Nashab */}
          <div className={`p-4 rounded-xl border ${activeCase === 'nashab' ? 'ring-2 ring-sky-500 bg-sky-50/80 border-sky-300' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] font-bold text-sky-800 uppercase block mb-1">2. Nashab (Objek)</span>
            <p className="font-arabic text-xl font-bold text-slate-900 my-1">{currentTransition.nashab.arab}</p>
            <p className="text-slate-600 font-semibold">{currentTransition.nashab.role}</p>
            <div className="mt-2 text-[11px] text-sky-900 font-mono bg-sky-100/60 p-1 rounded">
              Tanda: {currentTransition.nashab.harakat}
            </div>
          </div>

          {/* Jar */}
          <div className={`p-4 rounded-xl border ${activeCase === 'jar' ? 'ring-2 ring-purple-500 bg-purple-50/80 border-purple-300' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] font-bold text-purple-800 uppercase block mb-1">3. Jar (Terseret)</span>
            <p className="font-arabic text-xl font-bold text-slate-900 my-1">{currentTransition.jar.arab}</p>
            <p className="text-slate-600 font-semibold">{currentTransition.jar.role}</p>
            <div className="mt-2 text-[11px] text-purple-900 font-mono bg-purple-100/60 p-1 rounded">
              Tanda: {currentTransition.jar.harakat}
            </div>
          </div>

          {/* Jazm */}
          <div className={`p-4 rounded-xl border ${activeCase === 'jazm' ? 'ring-2 ring-rose-500 bg-rose-50/80 border-rose-300' : 'bg-white border-slate-200'}`}>
            <span className="text-[10px] font-bold text-rose-800 uppercase block mb-1">4. Jazm (Gembok)</span>
            <p className="font-arabic text-xl font-bold text-slate-900 my-1">{currentTransition.jazm.arab}</p>
            <p className="text-slate-600 font-semibold">{currentTransition.jazm.role}</p>
            <div className="mt-2 text-[11px] text-rose-900 font-mono bg-rose-100/60 p-1 rounded">
              Tanda: {currentTransition.jazm.harakat}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
